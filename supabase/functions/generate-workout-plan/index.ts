
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Fallback workout plan for when the OpenAI API is unavailable
const generateFallbackWorkoutPlan = (userProfile, fitnessGoals, preferences) => {
  // Extract key user info
  const primaryGoal = fitnessGoals.primaryGoal || 'general fitness';
  const workoutPreference = preferences.workoutPreference || 'home';
  const workoutFrequency = preferences.workoutFrequency || '3-4';
  const workoutDuration = preferences.workoutDuration || '30-45';
  
  // Basic plan name based on goal
  let planName = 'Basic Fitness Plan';
  if (primaryGoal === 'weight-loss') planName = 'Weight Loss Program';
  if (primaryGoal === 'muscle-gain') planName = 'Muscle Building Program';
  if (primaryGoal === 'improve-fitness') planName = 'General Fitness Improvement';
  
  // Create a simple 4-week plan
  const weeks = [];
  for (let weekNum = 1; weekNum <= 4; weekNum++) {
    const days = [];
    
    // Number of days based on user preference
    let daysPerWeek = 3;
    if (workoutFrequency === '4-5') daysPerWeek = 4;
    if (workoutFrequency === '6+') daysPerWeek = 5;
    
    // Generate workout days
    for (let dayNum = 1; dayNum <= daysPerWeek; dayNum++) {
      // Alternate between different workout types
      let dayFocus = 'Full Body';
      let exercises = [];
      
      if (daysPerWeek >= 4) {
        // Split routine for higher frequency
        switch (dayNum % 4) {
          case 1:
            dayFocus = 'Upper Body';
            exercises = [
              {
                name: 'Push-ups',
                sets: 3,
                reps: '10-15',
                rest: '60 sec',
                instructions: 'Keep your body straight, lower until your chest nearly touches the floor.'
              },
              {
                name: 'Dumbbell Rows',
                sets: 3,
                reps: '10-12 each side',
                rest: '60 sec',
                instructions: 'Bend at hips, keep back flat, pull dumbbell to hip.'
              },
              {
                name: 'Overhead Press',
                sets: 3,
                reps: '10-12',
                rest: '60 sec',
                instructions: 'Press weights directly overhead, keeping core tight.'
              }
            ];
            break;
          case 2:
            dayFocus = 'Lower Body';
            exercises = [
              {
                name: 'Bodyweight Squats',
                sets: 3,
                reps: '15-20',
                rest: '60 sec',
                instructions: 'Keep weight in heels, go as low as comfortable, keep knees in line with toes.'
              },
              {
                name: 'Lunges',
                sets: 3,
                reps: '10-12 each leg',
                rest: '60 sec',
                instructions: 'Step forward, lower body until both knees are at 90 degrees.'
              },
              {
                name: 'Glute Bridges',
                sets: 3,
                reps: '15-20',
                rest: '60 sec',
                instructions: 'Lie on back, feet flat, raise hips to create straight line from knees to shoulders.'
              }
            ];
            break;
          case 3:
            dayFocus = 'Chest and Arms';
            exercises = [
              {
                name: 'Incline Push-ups',
                sets: 3,
                reps: '12-15',
                rest: '60 sec',
                instructions: 'Hands on elevated surface, perform push-up with straight body.'
              },
              {
                name: 'Tricep Dips',
                sets: 3,
                reps: '10-15',
                rest: '60 sec',
                instructions: 'Use chair or bench, lower body until arms at 90 degrees.'
              },
              {
                name: 'Bicep Curls',
                sets: 3,
                reps: '12-15',
                rest: '60 sec',
                instructions: 'Keep elbows at sides, curl weights toward shoulders.'
              }
            ];
            break;
          case 0:
            dayFocus = 'Back and Shoulders';
            exercises = [
              {
                name: 'Superman Holds',
                sets: 3,
                reps: '30 sec hold',
                rest: '45 sec',
                instructions: 'Lie face down, extend arms and legs, lift limbs off ground.'
              },
              {
                name: 'Lateral Raises',
                sets: 3,
                reps: '12-15',
                rest: '60 sec',
                instructions: 'Raise arms to sides until parallel with floor, slight bend in elbows.'
              },
              {
                name: 'Face Pulls',
                sets: 3,
                reps: '15-20',
                rest: '60 sec',
                instructions: 'With resistance band, pull toward face with elbows high.'
              }
            ];
            break;
        }
      } else {
        // Full body routine for lower frequency
        switch (dayNum % 3) {
          case 1:
            dayFocus = 'Full Body - Push Focus';
            exercises = [
              {
                name: 'Push-ups',
                sets: 3,
                reps: '10-15',
                rest: '60 sec',
                instructions: 'Keep your body straight, lower until your chest nearly touches the floor.'
              },
              {
                name: 'Bodyweight Squats',
                sets: 3,
                reps: '15-20',
                rest: '60 sec',
                instructions: 'Keep weight in heels, go as low as comfortable, keep knees in line with toes.'
              },
              {
                name: 'Shoulder Taps',
                sets: 3,
                reps: '10-12 each side',
                rest: '60 sec',
                instructions: 'Start in push-up position, tap opposite shoulder while maintaining stability.'
              }
            ];
            break;
          case 2:
            dayFocus = 'Full Body - Pull Focus';
            exercises = [
              {
                name: 'Bodyweight Rows',
                sets: 3,
                reps: '10-15',
                rest: '60 sec',
                instructions: 'Using table or bar at waist height, pull chest toward bar with straight body.'
              },
              {
                name: 'Glute Bridges',
                sets: 3,
                reps: '15-20',
                rest: '60 sec',
                instructions: 'Lie on back, feet flat, raise hips to create straight line from knees to shoulders.'
              },
              {
                name: 'Superman Holds',
                sets: 3,
                reps: '30 sec hold',
                rest: '45 sec',
                instructions: 'Lie face down, extend arms and legs, lift limbs off ground.'
              }
            ];
            break;
          case 0:
            dayFocus = 'Full Body - Core Focus';
            exercises = [
              {
                name: 'Plank',
                sets: 3,
                reps: '30-45 sec hold',
                rest: '45 sec',
                instructions: 'Forearms on ground, maintain straight line from head to heels.'
              },
              {
                name: 'Mountain Climbers',
                sets: 3,
                reps: '30-45 sec',
                rest: '45 sec',
                instructions: 'Start in push-up position, alternate bringing knees to chest.'
              },
              {
                name: 'Russian Twists',
                sets: 3,
                reps: '10-15 each side',
                rest: '60 sec',
                instructions: 'Sit with knees bent, lean back slightly, twist torso side to side.'
              }
            ];
            break;
        }
      }
      
      // Add some cardio
      if (primaryGoal === 'weight-loss') {
        exercises.push({
          name: 'Jumping Jacks',
          sets: 1,
          reps: '3 minutes',
          rest: '60 sec',
          instructions: 'Jump while raising arms and spreading legs, then return to starting position.'
        });
      }
      
      // Add the day to our plan
      days.push({
        day_number: dayNum,
        name: dayFocus,
        exercises: exercises
      });
    }
    
    // Add the week to our plan
    weeks.push({
      week_number: weekNum,
      days: days
    });
  }
  
  // The final fallback plan
  return {
    plan_name: planName,
    plan_description: `A 4-week ${planName.toLowerCase()} designed for ${workoutPreference} workouts. This plan focuses on progressive overload and balanced training to help you achieve your ${primaryGoal} goal.`,
    weeks: weeks,
    notes: "This is a starter plan. Adjust intensity as needed, ensuring proper form on all exercises. Rest at least 1-2 days between workouts that target the same muscle groups. Stay hydrated and listen to your body."
  };
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userProfile, fitnessGoals, preferences } = await req.json();

    // Create a comprehensive prompt for GPT-4o
    const systemPrompt = `You are a professional fitness trainer and exercise scientist with years of experience.
    Your task is to create a personalized 4-week workout plan based on the user's profile, goals, and preferences.
    
    Generate a structured workout plan that includes:
    1. A weekly schedule with specific exercises for each day
    2. Sets, reps, and rest periods for each exercise
    3. Progression plan over the 4 weeks
    4. Warm-up and cool-down routines
    5. Brief explanation of how this plan targets their specific goals
    
    Format the response as JSON with the following structure:
    {
      "plan_name": "Name of the plan based on goals",
      "plan_description": "Brief overview of the plan",
      "weeks": [
        {
          "week_number": 1,
          "days": [
            {
              "day_number": 1,
              "name": "Focus area (e.g., Lower Body Strength)",
              "exercises": [
                {
                  "name": "Exercise name",
                  "sets": 3,
                  "reps": "10-12",
                  "rest": "60 sec",
                  "instructions": "How to perform the exercise"
                }
              ]
            }
          ]
        }
      ],
      "notes": "General advice and notes"
    }
    
    ONLY return valid JSON that matches this structure exactly.`;

    // User prompt with details
    const userPrompt = `
    User Profile:
    - Age: ${userProfile.age || 'Not specified'}
    - Gender: ${userProfile.gender || 'Not specified'}
    - Height: ${userProfile.height || 'Not specified'} cm
    - Weight: ${userProfile.weight || 'Not specified'} kg
    - Fitness level: ${userProfile.activityLevel || 'Not specified'}
    - Sleep: ${userProfile.sleepHours || 'Not specified'}
    
    Fitness Goals:
    - Primary goal: ${fitnessGoals.primaryGoal || 'Not specified'}
    - Target weight: ${fitnessGoals.targetWeight || 'Not specified'}
    - Timeframe: ${fitnessGoals.timeframe || 'Not specified'}
    
    Preferences:
    - Workout environment: ${preferences.workoutPreference || 'Not specified'}
    - Available equipment: ${preferences.equipment || 'Not specified'}
    - Preferred workout duration: ${preferences.workoutDuration || 'Not specified'}
    - Preferred workout frequency: ${preferences.workoutFrequency || 'Not specified'}
    - Dietary restrictions: ${(preferences.dietaryRestrictions || []).join(', ') || 'None'}
    
    Please create a personalized 4-week workout plan for this user.`;

    try {
      // First try using OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
        }),
      });
      
      if (!response.ok) {
        // Log the specific error
        const errorData = await response.json();
        console.error('OpenAI API error:', errorData);
        throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      let workoutPlan;
      
      try {
        // Extract the content from the OpenAI response
        const content = data.choices[0].message.content;
        
        // Parse the JSON response
        workoutPlan = JSON.parse(content);
      } catch (parseError) {
        console.error('Failed to parse OpenAI response:', parseError);
        throw new Error('Failed to generate a valid workout plan. Please try again.');
      }

      return new Response(JSON.stringify({ workoutPlan }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
      
    } catch (openAIError) {
      // If OpenAI API fails, use our fallback plan
      console.log('OpenAI generation failed, using fallback:', openAIError.message);
      
      const fallbackPlan = generateFallbackWorkoutPlan(userProfile, fitnessGoals, preferences);
      
      return new Response(JSON.stringify({ 
        workoutPlan: fallbackPlan,
        isAIGenerated: false,
        fallbackReason: openAIError.message
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error in generate-workout-plan function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
