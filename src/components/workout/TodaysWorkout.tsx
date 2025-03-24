import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Dumbbell, Play, Plus } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface TodaysWorkoutProps {
  todayWorkout: {
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
  } | null;
  loading: boolean;
}

const TodaysWorkout: React.FC<TodaysWorkoutProps> = ({ todayWorkout, loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-fitcraft-primary"></div>
        <p className="mt-2 text-slate-600">Loading today's workout...</p>
      </div>
    );
  }

  if (!todayWorkout) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-700 mb-4">No workout planned for today.</p>
        <Button 
          className="bg-fitcraft-primary hover:bg-fitcraft-secondary"
          onClick={() => navigate('/onboarding')}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create a Workout Plan
        </Button>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{todayWorkout.name}</CardTitle>
            <CardDescription>
              <div className="flex items-center mt-1">
                <Clock className="mr-1 h-4 w-4" />
                {todayWorkout.duration}
                <Dumbbell className="ml-3 mr-1 h-4 w-4" />
                {todayWorkout.type}
              </div>
            </CardDescription>
          </div>
          {!todayWorkout.completed && (
            <Button className="bg-fitcraft-primary hover:bg-fitcraft-secondary">
              <Play className="mr-2 h-4 w-4" />
              Start Workout
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {todayWorkout.exercises.map((exercise, index) => (
            <div key={index} className="border-b pb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-fitcraft-dark">{exercise.name}</h3>
                <span className="text-sm text-slate-700">{exercise.sets} sets × {exercise.reps}</span>
              </div>
              <p className="text-sm text-slate-600">{exercise.instruction}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TodaysWorkout;
