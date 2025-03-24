
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { requireAuth } from '@/lib/auth';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number | string;
  duration?: string | number;
  instructions?: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  duration: number;
  exercises: Exercise[];
}

interface TodayWorkout {
  day: number;
  name: string;
  duration: string;
  type: string;
  completed: boolean;
  exercises: {
    name: string;
    sets: number;
    reps: string | number;
    instruction: string;
  }[];
}

interface PlanStats {
  name: string;
  daysCompleted: number;
  totalDays: number;
  type: string;
  progress: number;
}

export const useWorkoutPlans = () => {
  const navigate = useNavigate();
  const [userWorkoutPlans, setUserWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [todayWorkout, setTodayWorkout] = useState<TodayWorkout | null>(null);
  const [planStats, setPlanStats] = useState<PlanStats>({
    name: "",
    daysCompleted: 0,
    totalDays: 30,
    type: "Custom",
    progress: 0
  });

  const fetchWorkoutPlans = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return;
      }
      
      const { data: plans, error } = await supabase
        .from('workout_plans')
        .select(`
          id, 
          name, 
          description, 
          difficulty, 
          duration,
          exercises(id, name, sets, reps, duration, instructions)
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      if (plans && plans.length > 0) {
        setUserWorkoutPlans(plans);
        setSelectedPlan(plans[0]);
        
        // Set plan stats based on first plan
        const completedExercises = 0; // This would be from workout logs in a real app
        const totalExercises = plans[0].exercises ? plans[0].exercises.length : 0;
        const progress = totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;
        
        setPlanStats({
          name: plans[0].name,
          daysCompleted: completedExercises,
          totalDays: totalExercises,
          type: plans[0].difficulty || "Custom",
          progress: progress
        });
        
        // Create today's workout from the first few exercises
        if (plans[0].exercises && plans[0].exercises.length > 0) {
          const dailyExercises = plans[0].exercises.slice(0, 4);
          setTodayWorkout({
            day: 1,
            name: "Today's Workout",
            duration: "45 min",
            type: plans[0].difficulty || "Mixed",
            completed: false,
            exercises: dailyExercises.map(ex => ({
              name: ex.name,
              sets: ex.sets,
              reps: ex.reps || "10",
              instruction: ex.instructions || "Perform with proper form"
            }))
          });
        }
      }
    } catch (error) {
      console.error('Error fetching workout plans:', error);
      toast({
        title: 'Error fetching plans',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await requireAuth(navigate);
      if (!isAuth) return;
      
      fetchWorkoutPlans();
    };
    
    checkAuth();
  }, [navigate]);

  return {
    userWorkoutPlans,
    loading,
    selectedPlan,
    setSelectedPlan,
    todayWorkout,
    planStats,
    fetchWorkoutPlans
  };
};
