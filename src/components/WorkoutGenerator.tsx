
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Check, Save, AlertTriangle } from "lucide-react";
import { toast } from '@/hooks/use-toast';
import { generateWorkoutPlan, saveWorkoutPlan, WorkoutPlan } from '@/services/workoutService';
import { supabase } from '@/integrations/supabase/client';

interface WorkoutGeneratorProps {
  formData: any;
  onComplete: () => void;
}

const WorkoutGenerator: React.FC<WorkoutGeneratorProps> = ({ formData, onComplete }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const navigate = useNavigate();

  const generatePlan = async () => {
    try {
      // Check if user is logged in
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to generate a workout plan.",
          variant: "destructive"
        });
        navigate('/login');
        return;
      }
      
      setIsGenerating(true);
      
      // Map form data to the expected format
      const request = {
        userProfile: {
          age: formData.age,
          gender: formData.gender,
          height: formData.height,
          weight: formData.weight,
          activityLevel: formData.activityLevel,
          sleepHours: formData.sleepHours
        },
        fitnessGoals: {
          primaryGoal: formData.primaryGoal,
          targetWeight: formData.targetWeight,
          timeframe: formData.timeframe
        },
        preferences: {
          workoutPreference: formData.workoutPreference,
          equipment: "not specified", // This could be added to the form later
          workoutDuration: formData.workoutDuration,
          workoutFrequency: formData.workoutFrequency,
          dietaryRestrictions: formData.dietaryRestrictions
        }
      };
      
      const plan = await generateWorkoutPlan(request);
      setWorkoutPlan(plan);
      
      // Check if we received a fallback plan
      if (plan.fallbackReason) {
        setUsingFallback(true);
      }
      
      toast({
        title: "Workout plan generated",
        description: "Your personalized workout plan is ready!",
      });
    } catch (error) {
      console.error('Error generating workout plan:', error);
      toast({
        title: "Generation failed",
        description: "Failed to generate workout plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSavePlan = async () => {
    if (!workoutPlan) return;
    
    try {
      // Check if user is logged in
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save a workout plan.",
          variant: "destructive"
        });
        navigate('/login');
        return;
      }
      
      setIsSaving(true);
      const planId = await saveWorkoutPlan(workoutPlan);
      
      toast({
        title: "Plan saved",
        description: "Your workout plan has been saved successfully.",
      });
      
      // Complete the onboarding
      onComplete();
      
      // Navigate to workout plan page
      navigate('/workout-plan');
    } catch (error) {
      console.error('Error saving workout plan:', error);
      toast({
        title: "Error saving plan",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSkip = () => {
    // Skip generating AI workout plan
    onComplete();
    navigate('/dashboard');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Personalized Workout Plan</CardTitle>
        <CardDescription>
          Our AI will create a custom 4-week workout plan based on your profile.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!workoutPlan ? (
          <div className="flex flex-col items-center justify-center py-10">
            {isGenerating ? (
              <>
                <Loader2 className="h-10 w-10 text-fitcraft-primary animate-spin mb-4" />
                <p className="text-center text-slate-600">
                  Creating your personalized workout plan...
                  <br />
                  This may take a moment.
                </p>
              </>
            ) : (
              <>
                <p className="text-center text-slate-600 mb-6">
                  Ready to get your AI-generated workout plan?
                  <br />
                  Click below to generate a plan tailored to your goals and preferences.
                </p>
                <Button onClick={generatePlan} className="bg-fitcraft-primary hover:bg-fitcraft-secondary">
                  Generate My Workout Plan
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {usingFallback && (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-amber-800">Using Backup Plan</h4>
                  <p className="text-xs text-amber-700 mt-1">
                    We couldn't connect to our AI service. We've created a standard plan for you instead. 
                    You can still save this plan and modify it later.
                  </p>
                </div>
              </div>
            )}
            
            <div>
              <h3 className="text-xl font-bold text-fitcraft-dark">{workoutPlan.plan_name}</h3>
              <p className="text-slate-600 mt-1">{workoutPlan.plan_description}</p>
            </div>
            
            <div className="space-y-4">
              {workoutPlan.weeks.slice(0, 1).map((week) => (
                <div key={week.week_number} className="space-y-3">
                  <h4 className="font-semibold text-fitcraft-dark">Week {week.week_number} Preview</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {week.days.slice(0, 2).map((day) => (
                      <div key={day.day_number} className="border rounded-md p-3">
                        <h5 className="font-medium text-fitcraft-dark">Day {day.day_number}: {day.name}</h5>
                        <ul className="mt-2 space-y-1">
                          {day.exercises.slice(0, 3).map((exercise, idx) => (
                            <li key={idx} className="text-sm text-slate-600">
                              {exercise.name} - {exercise.sets} sets of {exercise.reps}
                            </li>
                          ))}
                          {day.exercises.length > 3 && (
                            <li className="text-sm text-slate-500 italic">
                              +{day.exercises.length - 3} more exercises
                            </li>
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>
                  {week.days.length > 2 && (
                    <p className="text-sm text-slate-500 italic">
                      +{week.days.length - 2} more days in this week
                    </p>
                  )}
                </div>
              ))}
              {workoutPlan.weeks.length > 1 && (
                <p className="text-sm text-slate-500 italic">
                  +{workoutPlan.weeks.length - 1} more weeks in full plan
                </p>
              )}
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-semibold text-fitcraft-dark">Notes</h4>
              <p className="text-sm text-slate-600 mt-1">{workoutPlan.notes}</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleSkip} disabled={isGenerating || isSaving}>
          Skip for Now
        </Button>
        
        {workoutPlan && (
          <Button 
            className="bg-fitcraft-primary hover:bg-fitcraft-secondary"
            onClick={handleSavePlan}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Plan
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default WorkoutGenerator;
