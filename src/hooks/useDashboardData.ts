
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Exercise {
  name: string;
  sets: number;
  reps: string | number;
  instruction?: string;
}

export interface Meal {
  name: string;
  meal: string;
  calories: number;
  time: string;
}

export interface StatItem {
  name: string;
  goal: number;
  current: number;
  unit?: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  daysCompleted: number;
  totalDays: number;
  todayWorkout: {
    name: string;
    duration: string;
    exercises: Exercise[];
  };
}

export interface MealPlan {
  name: string;
  dailyCalories: number;
  todayMeals: Meal[];
}

export const defaultMeals: Meal[] = [
  { 
    name: "Breakfast", 
    meal: "Greek yogurt with berries and nuts", 
    calories: 350,
    time: "7:00 AM"
  },
  { 
    name: "Lunch", 
    meal: "Grilled chicken salad with olive oil dressing", 
    calories: 450,
    time: "12:30 PM"
  },
  { 
    name: "Snack", 
    meal: "Protein shake with banana", 
    calories: 250,
    time: "3:30 PM"
  },
  { 
    name: "Dinner", 
    meal: "Baked salmon with roasted vegetables", 
    calories: 550,
    time: "7:00 PM"
  }
];

export const useDashboardData = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [streak, setStreak] = useState(0);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState<StatItem[]>([
    { name: "Weight", goal: 0, current: 0, unit: "lbs" },
    { name: "Daily Steps", goal: 10000, current: 0, unit: "steps" },
    { name: "Weekly Workouts", goal: 5, current: 0, unit: "sessions" },
    { name: "Daily Calories", goal: 0, current: 0, unit: "cal" }
  ]);

  const calculateCompletedDays = (startDate: string) => {
    if (!startDate) return 0;
    
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  const formatTodayWorkout = (exercises: any[]) => {
    if (!exercises || exercises.length === 0) {
      return {
        name: "Rest Day",
        duration: "0 min",
        exercises: []
      };
    }
    
    const todayExercises = exercises.slice(0, 4).map(ex => ({
      name: ex.name,
      sets: ex.sets || 3,
      reps: ex.reps || 10,
      instruction: ex.instructions
    }));
    
    return {
      name: "Today's Workout",
      duration: `${todayExercises.length * 10} min`,
      exercises: todayExercises
    };
  };
  
  const formatMeals = (meals: any[]) => {
    if (!meals || meals.length === 0) {
      return defaultMeals;
    }
    
    const timeSlots = {
      breakfast: "7:00 AM",
      lunch: "12:30 PM",
      snack: "3:30 PM",
      dinner: "7:00 PM"
    };
    
    return meals.slice(0, 4).map((meal, index) => {
      const mealType = Object.keys(timeSlots)[index % 4] || "snack";
      
      return {
        name: meal.name.includes(mealType) ? meal.name : `${mealType.charAt(0).toUpperCase() + mealType.slice(1)}`,
        meal: meal.description || meal.name,
        calories: meal.calories || 300 + (index * 100),
        time: meal.meal_time || timeSlots[mealType as keyof typeof timeSlots]
      };
    });
  };
  
  const calculateStreak = (dates: Date[]) => {
    if (!dates.length) return 0;
    
    dates.sort((a, b) => b.getTime() - a.getTime());
    
    let streak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const latestDate = dates[0];
    latestDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.round((today.getTime() - latestDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays > 1) return 0;
    
    for (let i = 1; i < dates.length; i++) {
      const current = dates[i];
      const prev = dates[i-1];
      
      current.setHours(0, 0, 0, 0);
      prev.setHours(0, 0, 0, 0);
      
      const dayDiff = Math.round((prev.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        streak++;
      } else if (dayDiff > 1) {
        break;
      }
    }
    
    return streak;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        
        // Get the current user
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate('/login');
          return;
        }
        
        const userId = session.user.id;
        
        // Fetch user profile and update stats
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (profileError) {
          console.error('Error fetching profile:', profileError);
        } else if (profileData) {
          setProfile(profileData);
          
          if (profileData.weight) {
            const currentWeight = Number(profileData.weight);
            const targetWeight = profileData.goal === 'weight-loss' 
              ? Math.round(currentWeight * 0.9) 
              : Math.round(currentWeight * 1.1);
              
            setStats(prev => prev.map(stat => 
              stat.name === "Weight" 
                ? { ...stat, current: currentWeight, goal: targetWeight } 
                : stat
            ));
          }
        }
        
        // Fetch workout plans with exercises
        const { data: workoutPlans, error: workoutError } = await supabase
          .from('workout_plans')
          .select(`
            *,
            exercises(*)
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (workoutError) {
          console.error('Error fetching workout plan:', workoutError);
          toast({
            title: "Error loading workout plan",
            description: workoutError.message,
            variant: "destructive"
          });
        } else if (workoutPlans && workoutPlans.length > 0) {
          const plan = workoutPlans[0];
          
          const formattedPlan = {
            id: plan.id,
            name: plan.name,
            description: plan.description,
            daysCompleted: calculateCompletedDays(plan.created_at),
            totalDays: plan.duration ? Number(plan.duration) * 7 : 30,
            todayWorkout: formatTodayWorkout(plan.exercises || [])
          };
          
          setWorkoutPlan(formattedPlan);
          
          // Calculate progress based on days completed vs total days
          const calculatedProgress = Math.round((formattedPlan.daysCompleted / formattedPlan.totalDays) * 100);
          setProgress(Math.min(calculatedProgress, 100));
          
          // Update workout stats
          setStats(prev => prev.map(stat => 
            stat.name === "Weekly Workouts" 
              ? { ...stat, current: Math.min(formattedPlan.daysCompleted % 7, 5) } 
              : stat
          ));
        }
        
        // Try to fetch from new nutrition_plans first, then fall back to meal_plans
        let nutritionPlan = null;
        
        // First check the new nutrition_plans table
        const { data: nutritionPlans, error: nutritionError } = await supabase
          .from('nutrition_plans')
          .select(`
            *,
            nutrition_plan_days(
              *,
              nutrition_meals(*)
            )
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (!nutritionError && nutritionPlans && nutritionPlans.length > 0) {
          const plan = nutritionPlans[0];
          const dailyCals = plan.daily_calories || 2000;
          
          // Extract all meals from all days
          const allMeals = plan.nutrition_plan_days.flatMap(day => 
            day.nutrition_meals.map(meal => ({
              name: meal.name,
              description: meal.description,
              calories: meal.calories,
              meal_time: meal.meal_time
            }))
          );
          
          nutritionPlan = {
            name: plan.name,
            dailyCalories: dailyCals,
            todayMeals: formatMeals(allMeals)
          };
        }
        
        // Fall back to the old meal_plans if no nutrition plan
        if (!nutritionPlan) {
          const { data: mealPlans, error: mealError } = await supabase
            .from('meal_plans')
            .select(`
              *,
              meals(*)
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(1);
            
          if (!mealError && mealPlans && mealPlans.length > 0) {
            const plan = mealPlans[0];
            const dailyCals = plan.daily_calories ? Number(plan.daily_calories) : 2000;
            
            nutritionPlan = {
              name: plan.name,
              dailyCalories: dailyCals,
              todayMeals: formatMeals(plan.meals)
            };
          }
        }
        
        // Set the meal plan
        if (nutritionPlan) {
          setMealPlan(nutritionPlan);
          
          setStats(prev => prev.map(stat => 
            stat.name === "Daily Calories" 
              ? { ...stat, goal: nutritionPlan.dailyCalories, current: Math.round(nutritionPlan.dailyCalories * 0.9) } 
              : stat
          ));
        }
        
        // Fetch nutrition logs to update calories and weight stats
        const { data: nutritionLogs, error: nutritionLogsError } = await supabase
          .from('nutrition_logs')
          .select('*')
          .eq('user_id', userId)
          .order('date', { ascending: false })
          .limit(7);
          
        if (!nutritionLogsError && nutritionLogs && nutritionLogs.length > 0) {
          // Get today's log if exists
          const today = new Date().toISOString().split('T')[0];
          const todayLog = nutritionLogs.find(log => log.date === today);
          
          if (todayLog) {
            // Update calories consumed
            setStats(prev => prev.map(stat => 
              stat.name === "Daily Calories" 
                ? { ...stat, current: todayLog.daily_calories || 0 } 
                : stat
            ));
          }
          
          // Get the latest weight log
          const latestWeightLog = nutritionLogs.find(log => log.weight);
          if (latestWeightLog && latestWeightLog.weight) {
            setStats(prev => prev.map(stat => 
              stat.name === "Weight" 
                ? { ...stat, current: latestWeightLog.weight } 
                : stat
            ));
          }
        }
        
        // Calculate streak
        // Now include both workout logs and nutrition logs to calculate streak
        const { data: workoutLogs, error: logsError } = await supabase
          .from('workout_logs')
          .select('date')
          .eq('user_id', userId)
          .order('date', { ascending: false });
          
        const { data: nutLogs, error: nutLogsError } = await supabase
          .from('nutrition_logs')
          .select('date')
          .eq('user_id', userId)
          .order('date', { ascending: false });
          
        if ((!logsError && workoutLogs) || (!nutLogsError && nutLogs)) {
          // Combine both logs and remove duplicates
          const allDates = new Set();
          
          if (workoutLogs) {
            workoutLogs.forEach(log => allDates.add(log.date));
          }
          
          if (nutLogs) {
            nutLogs.forEach(log => allDates.add(log.date));
          }
          
          const streakCount = calculateStreak([...allDates].map(date => new Date(date as string)));
          setStreak(streakCount);
        }
        
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Error loading dashboard",
          description: "Failed to load your data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate]);

  return {
    isLoading,
    profile,
    workoutPlan,
    mealPlan,
    streak,
    progress,
    stats,
    defaultMeals
  };
};
