import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CalendarCheck, Dumbbell } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Exercise {
  name: string;
  sets: number;
  reps: string | number;
  instruction?: string;
}

interface TodayWorkoutProps {
  workoutPlan: {
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
  } | null;
}

const TodayWorkout: React.FC<TodayWorkoutProps> = ({ workoutPlan }) => {
  const navigate = useNavigate();

  return (
    <Card className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-fitcraft-primary">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Dumbbell className="w-5 h-5 mr-2 text-fitcraft-primary" />
          Today's Workout
        </CardTitle>
        {workoutPlan ? (
          <CardDescription>
            Day {workoutPlan.daysCompleted + 1} of {workoutPlan.totalDays}
          </CardDescription>
        ) : (
          <CardDescription>No active workout plan</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {workoutPlan?.todayWorkout ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-medium text-lg">{workoutPlan.todayWorkout.name}</h3>
                <p className="text-sm text-slate-600">{workoutPlan.todayWorkout.duration}</p>
              </div>
              <CalendarCheck className="h-5 w-5 text-fitcraft-primary" />
            </div>
            {workoutPlan.todayWorkout.exercises.map((exercise, index) => (
              <div key={index} className="border-b pb-3 last:border-0">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{exercise.name}</span>
                  <span className="text-sm text-slate-600">
                    {exercise.sets} sets × {exercise.reps}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1">{exercise.instruction}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-slate-500 mb-4">No workout scheduled for today</p>
            <Button
              className="bg-fitcraft-primary hover:bg-fitcraft-secondary"
              onClick={() => navigate('/onboarding')}
            >
              Create Workout Plan
            </Button>
          </div>
        )}
      </CardContent>
      {workoutPlan && (
        <CardFooter>
          <Button
            className="w-full bg-fitcraft-primary hover:bg-fitcraft-secondary"
            onClick={() => navigate('/workout-plan')}
          >
            View Full Workout Plan
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default TodayWorkout;
