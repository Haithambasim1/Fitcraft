
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface WorkoutPlanRequest {
  userProfile: {
    age?: string;
    gender?: string;
    height?: string;
    weight?: string;
    activityLevel?: string;
    sleepHours?: string;
  };
  fitnessGoals: {
    primaryGoal?: string;
    targetWeight?: string;
    timeframe?: string;
  };
  preferences: {
    workoutPreference?: string;
    equipment?: string;
    workoutDuration?: string;
    workoutFrequency?: string;
    dietaryRestrictions?: string[];
  };
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  instructions: string;
}

export interface WorkoutDay {
  day_number: number;
  name: string;
  exercises: Exercise[];
}

export interface WorkoutWeek {
  week_number: number;
  days: WorkoutDay[];
}

export interface WorkoutPlan {
  plan_name: string;
  plan_description: string;
  weeks: WorkoutWeek[];
  notes: string;
  isAIGenerated?: boolean;
  fallbackReason?: string;
}

export const generateWorkoutPlan = async (request: WorkoutPlanRequest): Promise<WorkoutPlan> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-workout-plan', {
      body: request,
    });

    if (error) {
      toast({
        title: "Error generating workout plan",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }

    // If we got a fallback plan, show a message to the user
    if (data.fallbackReason) {
      toast({
        title: "Using backup workout plan",
        description: "We couldn't connect to our AI service. We've created a standard plan for you instead.",
        variant: "default"
      });
    }

    return data.workoutPlan;
  } catch (error) {
    console.error('Error generating workout plan:', error);
    throw error;
  }
};

export const saveWorkoutPlan = async (workoutPlan: WorkoutPlan): Promise<string> => {
  try {
    // Get the current user
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('You must be logged in to save a workout plan');
    }
    
    // Insert the workout plan into the database
    const { data: planData, error: planError } = await supabase
      .from('workout_plans')
      .insert({
        user_id: session.user.id,
        name: workoutPlan.plan_name,
        description: workoutPlan.plan_description,
        difficulty: 'custom',
        duration: 4 // 4 weeks plan
      })
      .select()
      .single();
    
    if (planError) {
      toast({
        title: "Error saving workout plan",
        description: planError.message,
        variant: "destructive"
      });
      throw planError;
    }
    
    // Get the workout plan ID
    const workoutPlanId = planData.id;
    
    // Create array to hold all exercises to insert in a batch
    const exercisesToInsert = [];
    
    // Process each week and day to extract exercises
    workoutPlan.weeks.forEach(week => {
      week.days.forEach(day => {
        day.exercises.forEach(exercise => {
          // Convert reps to a database-friendly format
          // If it's a range like "10-15", extract the first number
          // If it's not a number at all, default to 10
          let repsValue = 10; // Default value
          
          if (exercise.reps) {
            // Check if it's a range (contains a dash)
            if (exercise.reps.includes('-')) {
              const firstNumber = parseInt(exercise.reps.split('-')[0]);
              if (!isNaN(firstNumber)) {
                repsValue = firstNumber;
              }
            } else {
              // Try to parse as integer
              const parsedReps = parseInt(exercise.reps);
              if (!isNaN(parsedReps)) {
                repsValue = parsedReps;
              }
            }
          }
          
          exercisesToInsert.push({
            workout_plan_id: workoutPlanId,
            name: exercise.name,
            sets: exercise.sets,
            reps: repsValue, // Use the parsed integer value
            instructions: exercise.instructions
          });
        });
      });
    });
    
    // Insert all exercises in a batch
    if (exercisesToInsert.length > 0) {
      const { error: exerciseError } = await supabase
        .from('exercises')
        .insert(exercisesToInsert);
        
      if (exerciseError) {
        toast({
          title: "Error saving exercises",
          description: exerciseError.message,
          variant: "destructive"
        });
        throw exerciseError;
      }
    }
    
    toast({
      title: "Success",
      description: "Your workout plan has been saved successfully!",
      variant: "default"
    });
    
    return workoutPlanId;
  } catch (error) {
    console.error('Error saving workout plan:', error);
    toast({
      title: "Error saving workout plan",
      description: error.message || "An unexpected error occurred",
      variant: "destructive"
    });
    throw error;
  }
};
