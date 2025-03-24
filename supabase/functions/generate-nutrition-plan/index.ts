import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPEN_AI_KEY = Deno.env.get('OPENAI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      SUPABASE_URL || '',
      SUPABASE_SERVICE_ROLE_KEY || '',
    );

    const { 
      goal,
      dailyCalories,
      days = 7,
      preferences = [],
      restrictions = [],
      weight,
      height,
      age,
      gender,
      activityLevel
    } = await req.json();

    const { data: { user } } = await supabaseClient.auth.getUser(
      req.headers.get('Authorization')?.replace('Bearer ', '') || ''
    );

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate daily calories if not provided
    const calculatedCalories = dailyCalories || calculateCalories(weight, height, age, gender, activityLevel, goal);

    // Generate nutrition plan with OpenAI
    const nutritionPlan = await generateNutritionPlan(
      goal,
      calculatedCalories,
      days,
      preferences,
      restrictions
    );

    // Save to database
    const { data: planData, error: planError } = await supabaseClient
      .from('nutrition_plans')
      .insert({
        user_id: user.id,
        name: `${goal.charAt(0).toUpperCase() + goal.slice(1)} Nutrition Plan`,
        goal: goal,
        daily_calories: calculatedCalories,
        protein_target: Math.round(calculatedCalories * 0.3 / 4), // 30% protein
        carbs_target: Math.round(calculatedCalories * 0.45 / 4), // 45% carbs
        fat_target: Math.round(calculatedCalories * 0.25 / 9), // 25% fat
      })
      .select()
      .single();

    if (planError) {
      throw planError;
    }

    // Save days and meals
    for (let i = 0; i < nutritionPlan.length; i++) {
      const day = nutritionPlan[i];
      
      const { data: dayData, error: dayError } = await supabaseClient
        .from('nutrition_plan_days')
        .insert({
          nutrition_plan_id: planData.id,
          day_number: i + 1
        })
        .select()
        .single();

      if (dayError) {
        throw dayError;
      }

      // Save meals for this day
      for (const meal of day.meals) {
        const { error: mealError } = await supabaseClient
          .from('nutrition_meals')
          .insert({
            nutrition_plan_day_id: dayData.id,
            name: meal.name,
            meal_time: meal.mealTime,
            calories: meal.calories,
            protein: meal.protein,
            carbs: meal.carbs,
            fat: meal.fat,
            description: meal.description,
            instructions: meal.instructions || ''
          });

        if (mealError) {
          throw mealError;
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        plan_id: planData.id,
        message: "Nutrition plan created successfully"
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-nutrition-plan function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Helper function to calculate BMR and TDEE based on user data
function calculateCalories(
  weight: number, 
  height: number, 
  age: number, 
  gender: string,
  activityLevel: string,
  goal: string
): number {
  // Default to average values if not provided
  weight = weight || 70; // kg
  height = height || 170; // cm
  age = age || 30;
  gender = gender || 'male';
  activityLevel = activityLevel || 'moderate';
  
  // Calculate BMR using Mifflin-St Jeor Equation
  let bmr;
  if (gender.toLowerCase() === 'female') {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  }
  
  // Apply activity multiplier
  let activityMultiplier = 1.2; // Sedentary
  switch (activityLevel.toLowerCase()) {
    case 'light':
      activityMultiplier = 1.375;
      break;
    case 'moderate':
      activityMultiplier = 1.55;
      break;
    case 'active':
      activityMultiplier = 1.725;
      break;
    case 'very active':
      activityMultiplier = 1.9;
      break;
  }
  
  let tdee = Math.round(bmr * activityMultiplier);
  
  // Adjust based on goal
  switch (goal.toLowerCase()) {
    case 'weight-loss':
      tdee = Math.round(tdee * 0.8); // 20% deficit
      break;
    case 'muscle-gain':
    case 'strength':
      tdee = Math.round(tdee * 1.1); // 10% surplus
      break;
    // For maintenance, keep TDEE as is
  }
  
  return tdee;
}

async function generateNutritionPlan(
  goal: string,
  dailyCalories: number,
  days: number,
  preferences: string[],
  restrictions: string[]
): Promise<any[]> {
  try {
    const preferenceText = preferences.length ? `Food preferences: ${preferences.join(', ')}.` : '';
    const restrictionText = restrictions.length ? `Dietary restrictions: ${restrictions.join(', ')}.` : '';

    const prompt = `Create a ${days}-day nutrition plan for a ${goal} goal with approximately ${dailyCalories} calories per day. ${preferenceText} ${restrictionText}

    For each day, provide 4-5 meals including breakfast, lunch, dinner, and snacks. For each meal, include:
    1. Name of the meal
    2. Brief description
    3. Calories
    4. Macronutrients (protein, carbs, fat in grams)
    5. Meal time
    6. Simple instructions

    Format the response as a JSON array of days, where each day has an array of meals with the following fields:
    {
      "day": 1,
      "meals": [
        {
          "name": "meal name",
          "mealTime": "time of day",
          "description": "brief description",
          "calories": number,
          "protein": number,
          "carbs": number,
          "fat": number,
          "instructions": "simple instructions"
        }
      ]
    }`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPEN_AI_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a nutritionist who creates personalized meal plans.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (!data.choices || !data.choices[0]) {
      throw new Error('Invalid response from OpenAI');
    }

    const content = data.choices[0].message.content;
    
    // Extract JSON from the response
    const jsonMatch = content.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
    if (!jsonMatch) {
      throw new Error('Could not extract JSON from OpenAI response');
    }
    
    // Parse the JSON and return it
    const nutritionPlan = JSON.parse(jsonMatch[0]);
    
    // Return an array format even if the response is a single object
    return Array.isArray(nutritionPlan) ? nutritionPlan : [nutritionPlan];
    
  } catch (error) {
    console.error('Error generating nutrition plan:', error);
    // Return a basic plan if AI generation fails
    return generateFallbackPlan(goal, dailyCalories, days);
  }
}

// Generate a basic fallback plan
function generateFallbackPlan(goal: string, dailyCalories: number, days: number): any[] {
  const plan = [];
  
  // Calculate macros
  const proteinPerDay = Math.round(dailyCalories * 0.3 / 4); // 30% protein (4 cal/g)
  const carbsPerDay = Math.round(dailyCalories * 0.45 / 4); // 45% carbs (4 cal/g)
  const fatPerDay = Math.round(dailyCalories * 0.25 / 9); // 25% fat (9 cal/g)
  
  const meals = [
    {
      name: "Breakfast",
      mealTime: "8:00 AM",
      description: "Protein-rich breakfast to start the day",
      calories: Math.round(dailyCalories * 0.25),
      protein: Math.round(proteinPerDay * 0.25),
      carbs: Math.round(carbsPerDay * 0.25),
      fat: Math.round(fatPerDay * 0.25),
      instructions: "Prepare quickly for a nutritious start to your day"
    },
    {
      name: "Lunch",
      mealTime: "12:30 PM",
      description: "Balanced meal with lean protein and vegetables",
      calories: Math.round(dailyCalories * 0.35),
      protein: Math.round(proteinPerDay * 0.35),
      carbs: Math.round(carbsPerDay * 0.35),
      fat: Math.round(fatPerDay * 0.35),
      instructions: "Can be prepared ahead of time for convenience"
    },
    {
      name: "Snack",
      mealTime: "4:00 PM",
      description: "Quick energy boost",
      calories: Math.round(dailyCalories * 0.1),
      protein: Math.round(proteinPerDay * 0.1),
      carbs: Math.round(carbsPerDay * 0.1),
      fat: Math.round(fatPerDay * 0.1),
      instructions: "Easy to pack and consume on-the-go"
    },
    {
      name: "Dinner",
      mealTime: "7:00 PM",
      description: "Nutritious evening meal",
      calories: Math.round(dailyCalories * 0.3),
      protein: Math.round(proteinPerDay * 0.3),
      carbs: Math.round(carbsPerDay * 0.3),
      fat: Math.round(fatPerDay * 0.3),
      instructions: "Enjoy a satisfying dinner to end your day"
    }
  ];
  
  for (let i = 0; i < days; i++) {
    plan.push({
      day: i + 1,
      meals: meals.map(meal => ({
        ...meal,
        name: `Day ${i + 1} ${meal.name}`
      }))
    });
  }
  
  return plan;
}
