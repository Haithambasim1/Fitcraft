
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export interface NutritionMeal {
  id?: string;
  name: string;
  meal_time: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  description?: string;
  instructions?: string;
}

export interface NutritionPlanDay {
  id?: string;
  day_number: number;
  meals: NutritionMeal[];
}

export interface NutritionPlan {
  id?: string;
  name: string;
  goal: string;
  daily_calories: number;
  protein_target: number;
  carbs_target: number;
  fat_target: number;
  days: NutritionPlanDay[];
}

export interface NutritionLog {
  id?: string;
  date: string;
  daily_calories?: number;
  daily_protein?: number;
  daily_carbs?: number;
  daily_fat?: number;
  weight?: number;
  notes?: string;
}

export const useNutritionPlans = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<NutritionPlan[]>([]);
  const [logs, setLogs] = useState<NutritionLog[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<NutritionPlan | null>(null);

  useEffect(() => {
    fetchNutritionPlans();
    fetchNutritionLogs();
  }, []);

  const fetchNutritionPlans = async () => {
    try {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return;
      }
      
      // Fetch all nutrition plans
      const { data: plansData, error: plansError } = await supabase
        .from('nutrition_plans')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (plansError) {
        throw plansError;
      }
      
      // For each plan, fetch its days and meals
      const plansWithDetails = await Promise.all(
        (plansData || []).map(async (plan) => {
          const { data: daysData, error: daysError } = await supabase
            .from('nutrition_plan_days')
            .select('*')
            .eq('nutrition_plan_id', plan.id)
            .order('day_number', { ascending: true });
            
          if (daysError) throw daysError;
          
          const days = await Promise.all(
            (daysData || []).map(async (day) => {
              const { data: mealsData, error: mealsError } = await supabase
                .from('nutrition_meals')
                .select('*')
                .eq('nutrition_plan_day_id', day.id)
                .order('meal_time', { ascending: true });
                
              if (mealsError) throw mealsError;
              
              return {
                id: day.id,
                day_number: day.day_number,
                meals: mealsData || []
              };
            })
          );
          
          return {
            id: plan.id,
            name: plan.name,
            goal: plan.goal,
            daily_calories: plan.daily_calories,
            protein_target: plan.protein_target,
            carbs_target: plan.carbs_target,
            fat_target: plan.fat_target,
            days
          };
        })
      );
      
      setPlans(plansWithDetails);
      
      // Set the first plan as selected if there are plans and none is selected
      if (plansWithDetails.length > 0 && !selectedPlan) {
        setSelectedPlan(plansWithDetails[0]);
      }
      
    } catch (error: any) {
      console.error('Error fetching nutrition plans:', error);
      toast({
        title: 'Error',
        description: 'Failed to load nutrition plans. ' + error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchNutritionLogs = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return;
      }
      
      const { data, error } = await supabase
        .from('nutrition_logs')
        .select('*')
        .order('date', { ascending: false })
        .limit(30); // Last 30 days
        
      if (error) throw error;
      
      setLogs(data || []);
    } catch (error: any) {
      console.error('Error fetching nutrition logs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load nutrition logs. ' + error.message,
        variant: 'destructive'
      });
    }
  };

  const createNutritionPlan = async (plan: NutritionPlan) => {
    try {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return null;
      }
      
      // Create the plan
      const { data: planData, error: planError } = await supabase
        .from('nutrition_plans')
        .insert({
          user_id: session.user.id,
          name: plan.name,
          goal: plan.goal,
          daily_calories: plan.daily_calories,
          protein_target: plan.protein_target,
          carbs_target: plan.carbs_target,
          fat_target: plan.fat_target
        })
        .select()
        .single();
        
      if (planError) throw planError;
      
      // Create days and meals for each day
      for (const day of plan.days) {
        const { data: dayData, error: dayError } = await supabase
          .from('nutrition_plan_days')
          .insert({
            nutrition_plan_id: planData.id,
            day_number: day.day_number
          })
          .select()
          .single();
          
        if (dayError) throw dayError;
        
        // Create meals for this day
        for (const meal of day.meals) {
          const { error: mealError } = await supabase
            .from('nutrition_meals')
            .insert({
              nutrition_plan_day_id: dayData.id,
              name: meal.name,
              meal_time: meal.meal_time,
              calories: meal.calories,
              protein: meal.protein,
              carbs: meal.carbs,
              fat: meal.fat,
              description: meal.description || '',
              instructions: meal.instructions || ''
            });
            
          if (mealError) throw mealError;
        }
      }
      
      toast({
        title: 'Success',
        description: 'Nutrition plan created successfully!',
      });
      
      // Refresh the list of plans
      await fetchNutritionPlans();
      
      return planData;
    } catch (error: any) {
      console.error('Error creating nutrition plan:', error);
      toast({
        title: 'Error',
        description: 'Failed to create nutrition plan. ' + error.message,
        variant: 'destructive'
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logNutrition = async (log: NutritionLog) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return null;
      }
      
      // Check if log for this date already exists
      const { data: existingLog, error: checkError } = await supabase
        .from('nutrition_logs')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('date', log.date)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      let result;
      
      if (existingLog) {
        // Update existing log
        const { data, error } = await supabase
          .from('nutrition_logs')
          .update({
            daily_calories: log.daily_calories,
            daily_protein: log.daily_protein,
            daily_carbs: log.daily_carbs,
            daily_fat: log.daily_fat,
            weight: log.weight,
            notes: log.notes
          })
          .eq('id', existingLog.id)
          .select()
          .single();
          
        if (error) throw error;
        result = data;
      } else {
        // Create new log
        const { data, error } = await supabase
          .from('nutrition_logs')
          .insert({
            user_id: session.user.id,
            date: log.date,
            daily_calories: log.daily_calories,
            daily_protein: log.daily_protein,
            daily_carbs: log.daily_carbs,
            daily_fat: log.daily_fat,
            weight: log.weight,
            notes: log.notes
          })
          .select()
          .single();
          
        if (error) throw error;
        result = data;
      }
      
      toast({
        title: 'Success',
        description: 'Nutrition log saved successfully!',
      });
      
      // Refresh logs
      await fetchNutritionLogs();
      
      return result;
    } catch (error: any) {
      console.error('Error logging nutrition:', error);
      toast({
        title: 'Error',
        description: 'Failed to save nutrition log. ' + error.message,
        variant: 'destructive'
      });
      return null;
    }
  };

  return {
    loading,
    plans,
    logs,
    selectedPlan,
    setSelectedPlan,
    createNutritionPlan,
    logNutrition,
    fetchNutritionPlans,
    fetchNutritionLogs
  };
};
