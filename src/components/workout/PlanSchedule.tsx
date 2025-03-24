import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import WorkoutDetails from '@/components/WorkoutDetails';
import { WorkoutPlan } from '@/hooks/useWorkoutPlans';
import { Plus } from "lucide-react";

interface PlanScheduleProps {
  loading: boolean;
  userWorkoutPlans: WorkoutPlan[];
  selectedPlan: WorkoutPlan | null;
  setSelectedPlan: (plan: WorkoutPlan) => void;
  onCreatePlan: () => void;
}

const PlanSchedule: React.FC<PlanScheduleProps> = ({
  loading,
  userWorkoutPlans,
  selectedPlan,
  setSelectedPlan,
  onCreatePlan
}) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-fitcraft-primary"></div>
        <p className="mt-2 text-slate-600">Loading your workout plans...</p>
      </div>
    );
  }

  if (userWorkoutPlans.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-700 mb-4">You don't have any workout plans yet.</p>
        <button 
          className="bg-fitcraft-primary hover:bg-fitcraft-secondary text-white px-4 py-2 rounded-md flex items-center mx-auto"
          onClick={onCreatePlan}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Your First Plan
        </button>
      </div>
    );
  }

  return (
    <div>
      {userWorkoutPlans.length > 1 && (
        <div className="mb-6">
          <Label className="text-sm font-medium text-slate-700 mb-2 block">Your Workout Plans</Label>
          <Select 
            value={selectedPlan?.id} 
            onValueChange={(value) => {
              const plan = userWorkoutPlans.find(p => p.id === value);
              if (plan) setSelectedPlan(plan);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a workout plan" />
            </SelectTrigger>
            <SelectContent>
              {userWorkoutPlans.map((plan) => (
                <SelectItem key={plan.id} value={plan.id}>{plan.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      {selectedPlan ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedPlan.exercises && selectedPlan.exercises.length > 0 ? (
            Array.from({ length: Math.ceil(selectedPlan.exercises.length / 5) }).map((_, dayIndex) => {
              const dayExercises = selectedPlan.exercises.slice(dayIndex * 5, (dayIndex + 1) * 5);
              return (
                <WorkoutDetails
                  key={dayIndex}
                  title={`Day ${dayIndex + 1}`}
                  description={`Workout ${dayIndex + 1}`}
                  type={dayIndex % 3 === 0 ? "Strength" : dayIndex % 3 === 1 ? "Cardio" : "Mixed"}
                  exercises={dayExercises.map(ex => ({
                    name: ex.name,
                    sets: ex.sets,
                    reps: ex.reps || "10-12",
                    instruction: ex.instructions || "Perform with proper form"
                  }))}
                  isCompleted={false}
                />
              );
            })
          ) : (
            <p className="col-span-full text-center py-8 text-slate-500">
              No exercises found for this workout plan.
            </p>
          )}
        </div>
      ) : (
        <p className="text-center py-8 text-slate-500">
          Select a workout plan to view details.
        </p>
      )}
    </div>
  );
};

export default PlanSchedule;
