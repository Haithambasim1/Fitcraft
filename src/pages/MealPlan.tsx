
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Apple, Clock, ArrowLeft, CheckCircle, Utensils, Calendar } from "lucide-react";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';

const weeklyMeals = [
  {
    day: "Monday",
    isToday: true,
    totalCalories: 1800,
    meals: [
      { 
        name: "Breakfast", 
        meal: "Greek yogurt with berries and nuts", 
        calories: 350,
        time: "7:00 AM",
        macros: { protein: 20, carbs: 30, fat: 15 },
        ingredients: ["1 cup Greek yogurt", "1/2 cup mixed berries", "1 tbsp honey", "2 tbsp chopped nuts"]
      },
      { 
        name: "Lunch", 
        meal: "Grilled chicken salad with olive oil dressing", 
        calories: 450,
        time: "12:30 PM",
        macros: { protein: 35, carbs: 20, fat: 25 },
        ingredients: ["6 oz grilled chicken breast", "2 cups mixed greens", "1/4 cup cherry tomatoes", "1/4 cucumber", "2 tbsp olive oil", "1 tbsp balsamic vinegar"]
      },
      { 
        name: "Snack", 
        meal: "Protein shake with banana", 
        calories: 250,
        time: "3:30 PM",
        macros: { protein: 25, carbs: 25, fat: 5 },
        ingredients: ["1 scoop whey protein", "1 medium banana", "1 cup almond milk", "ice cubes"]
      },
      { 
        name: "Dinner", 
        meal: "Baked salmon with roasted vegetables", 
        calories: 550,
        time: "7:00 PM",
        macros: { protein: 35, carbs: 35, fat: 30 },
        ingredients: ["6 oz salmon fillet", "1 cup broccoli", "1 cup bell peppers", "1/2 cup carrots", "2 tbsp olive oil", "lemon juice", "herbs and spices"]
      }
    ]
  },
  {
    day: "Tuesday",
    isToday: false,
    totalCalories: 1750,
    meals: [
      { 
        name: "Breakfast", 
        meal: "Vegetable omelette with whole grain toast", 
        calories: 400,
        time: "7:00 AM",
        macros: { protein: 25, carbs: 25, fat: 20 },
        ingredients: ["3 eggs", "Mixed vegetables", "1 slice whole grain bread", "1 tsp butter"]
      },
      { 
        name: "Lunch", 
        meal: "Turkey and avocado wrap", 
        calories: 500,
        time: "12:30 PM",
        macros: { protein: 30, carbs: 40, fat: 20 },
        ingredients: ["4 oz turkey breast", "1 whole grain wrap", "1/2 avocado", "Lettuce", "Tomato", "Mustard"]
      },
      { 
        name: "Snack", 
        meal: "Apple with almond butter", 
        calories: 200,
        time: "3:30 PM",
        macros: { protein: 5, carbs: 20, fat: 10 },
        ingredients: ["1 medium apple", "1 tbsp almond butter"]
      },
      { 
        name: "Dinner", 
        meal: "Lean beef stir fry with brown rice", 
        calories: 650,
        time: "7:00 PM",
        macros: { protein: 40, carbs: 60, fat: 25 },
        ingredients: ["5 oz lean beef", "1 cup mixed vegetables", "1/2 cup brown rice", "Stir fry sauce", "1 tbsp olive oil"]
      }
    ]
  },
  {
    day: "Wednesday",
    isToday: false,
    totalCalories: 1850,
    meals: [
      { 
        name: "Breakfast", 
        meal: "Overnight oats with fruit", 
        calories: 380,
        time: "7:00 AM",
        macros: { protein: 15, carbs: 50, fat: 10 },
        ingredients: ["1/2 cup rolled oats", "1/2 cup Greek yogurt", "1/2 cup almond milk", "1 tbsp chia seeds", "1/2 cup mixed berries"]
      },
      { 
        name: "Lunch", 
        meal: "Quinoa bowl with grilled vegetables and chickpeas", 
        calories: 520,
        time: "12:30 PM",
        macros: { protein: 20, carbs: 70, fat: 15 },
        ingredients: ["1/2 cup quinoa", "1/2 cup chickpeas", "1 cup grilled vegetables", "2 tbsp tahini dressing"]
      },
      { 
        name: "Snack", 
        meal: "Greek yogurt with honey", 
        calories: 180,
        time: "3:30 PM",
        macros: { protein: 15, carbs: 15, fat: 5 },
        ingredients: ["1 cup Greek yogurt", "1 tsp honey"]
      },
      { 
        name: "Dinner", 
        meal: "Grilled chicken with sweet potato and green beans", 
        calories: 580,
        time: "7:00 PM",
        macros: { protein: 40, carbs: 45, fat: 20 },
        ingredients: ["6 oz grilled chicken", "1 medium sweet potato", "1 cup green beans", "2 tsp olive oil", "Herbs and spices"]
      }
    ]
  }
];

const mealPlanInfo = {
  name: "Low Carb Plan",
  type: "Weight Loss",
  dailyCalories: 1800,
  duration: "4 weeks",
  progress: 32
};

const MacroChart = ({ protein, carbs, fat }: { protein: number; carbs: number; fat: number }) => {
  const total = protein + carbs + fat;
  const proteinPercentage = Math.round((protein / total) * 100);
  const carbsPercentage = Math.round((carbs / total) * 100);
  const fatPercentage = Math.round((fat / total) * 100);
  
  return (
    <div className="mt-2">
      <div className="flex justify-between text-xs text-slate-600 mb-1">
        <span>Protein: {protein}g ({proteinPercentage}%)</span>
        <span>Carbs: {carbs}g ({carbsPercentage}%)</span>
        <span>Fat: {fat}g ({fatPercentage}%)</span>
      </div>
      <div className="w-full h-2 flex rounded-full overflow-hidden">
        <div className="bg-blue-500" style={{ width: `${proteinPercentage}%` }}></div>
        <div className="bg-green-500" style={{ width: `${carbsPercentage}%` }}></div>
        <div className="bg-yellow-500" style={{ width: `${fatPercentage}%` }}></div>
      </div>
    </div>
  );
};

const MealPlan = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("today");
  const [selectedDay, setSelectedDay] = useState("Monday");
  
  const todayMeals = weeklyMeals.find(day => day.day === selectedDay) || weeklyMeals[0];
  
  // Calculate total macros for the day
  const totalMacros = todayMeals.meals.reduce(
    (acc, meal) => {
      return {
        protein: acc.protein + meal.macros.protein,
        carbs: acc.carbs + meal.macros.carbs,
        fat: acc.fat + meal.macros.fat
      };
    },
    { protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center">
            <Button 
              variant="ghost" 
              className="mr-2 p-2"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-fitcraft-dark">
                {mealPlanInfo.name}
              </h1>
              <p className="text-slate-600">
                {mealPlanInfo.type} Diet • {mealPlanInfo.dailyCalories} calories per day
              </p>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-fitcraft-dark">Plan Progress</span>
              <span className="text-sm text-fitcraft-dark">{mealPlanInfo.progress}%</span>
            </div>
            <Progress value={mealPlanInfo.progress} className="h-2" />
          </div>
          
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="today">Today's Meals</TabsTrigger>
              <TabsTrigger value="week">Weekly Plan</TabsTrigger>
            </TabsList>
            
            <TabsContent value="today" className="mt-6">
              <Card className="mb-6">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-fitcraft-primary" />
                    {todayMeals.day}'s Overview
                  </CardTitle>
                  <CardDescription>
                    Total: {todayMeals.totalCalories} calories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MacroChart 
                    protein={totalMacros.protein} 
                    carbs={totalMacros.carbs} 
                    fat={totalMacros.fat} 
                  />
                </CardContent>
              </Card>
              
              <div className="space-y-4">
                {todayMeals.meals.map((meal, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg flex items-center">
                          <Utensils className="w-4 h-4 mr-2 text-fitcraft-primary" />
                          {meal.name}
                        </CardTitle>
                        <span className="text-sm text-slate-600">{meal.time}</span>
                      </div>
                      <CardDescription>
                        {meal.calories} calories
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-fitcraft-dark font-medium mb-2">{meal.meal}</p>
                      
                      <div className="mt-3">
                        <h4 className="text-sm font-medium text-slate-700 mb-1">Ingredients:</h4>
                        <ul className="text-sm text-slate-600 list-disc list-inside">
                          {meal.ingredients.map((ingredient, i) => (
                            <li key={i}>{ingredient}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <MacroChart 
                        protein={meal.macros.protein} 
                        carbs={meal.macros.carbs} 
                        fat={meal.macros.fat} 
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="week" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {weeklyMeals.map((day) => (
                  <Card 
                    key={day.day} 
                    className={`cursor-pointer hover:border-fitcraft-primary transition-colors ${
                      selectedDay === day.day ? 'border-fitcraft-primary' : ''
                    }`}
                    onClick={() => setSelectedDay(day.day)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{day.day}</CardTitle>
                        {day.isToday && (
                          <span className="text-xs bg-fitcraft-primary text-white px-2 py-1 rounded-full">
                            Today
                          </span>
                        )}
                      </div>
                      <CardDescription>
                        {day.totalCalories} calories
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm text-slate-600 space-y-1">
                        {day.meals.map((meal, i) => (
                          <li key={i} className="flex justify-between">
                            <span>{meal.name}</span>
                            <span>{meal.calories} cal</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Nutrition Guidelines</CardTitle>
                  <CardDescription>
                    Recommended daily intake for your goals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-fitcraft-dark mb-1">Calories</h3>
                      <p className="text-slate-600 text-sm">
                        Target: 1700-1900 calories per day based on your body composition and activity level
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium text-fitcraft-dark mb-1">Macronutrients</h3>
                      <ul className="text-slate-600 text-sm list-disc list-inside">
                        <li>Protein: 30% (115-130g)</li>
                        <li>Carbohydrates: 40% (170-190g)</li>
                        <li>Fat: 30% (55-65g)</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium text-fitcraft-dark mb-1">Hydration</h3>
                      <p className="text-slate-600 text-sm">
                        Aim for 3-4 liters of water daily
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium text-fitcraft-dark mb-1">Meal Timing</h3>
                      <p className="text-slate-600 text-sm">
                        Space meals 3-4 hours apart to maintain steady energy levels and optimize nutrient absorption
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MealPlan;
