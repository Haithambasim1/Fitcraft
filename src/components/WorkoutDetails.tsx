
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Clock, Calendar } from "lucide-react";

interface Exercise {
  name: string;
  sets?: number;
  reps?: string | number;
  instruction?: string;
  duration?: string | number;
}

interface WorkoutDetailsProps {
  title: string;
  description?: string;
  type?: string;
  duration?: string;
  exercises: Exercise[];
  isCompleted?: boolean;
}

const WorkoutDetails: React.FC<WorkoutDetailsProps> = ({
  title,
  description,
  type = "Strength",
  duration = "45 min",
  exercises,
  isCompleted = false
}) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
        </div>
        <div className="flex items-center space-x-4 text-sm text-slate-600 mt-2">
          <div className="flex items-center">
            <Dumbbell className="mr-1 h-4 w-4" />
            {type}
          </div>
          <div className="flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            {duration}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {exercises.map((exercise, index) => (
            <div key={index} className="border-b pb-4 last:border-0">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-fitcraft-dark">{exercise.name}</h3>
                {(exercise.sets && exercise.reps) && (
                  <span className="text-sm text-slate-700">{exercise.sets} sets × {exercise.reps}</span>
                )}
                {exercise.duration && !exercise.sets && (
                  <span className="text-sm text-slate-700">{exercise.duration}</span>
                )}
              </div>
              {exercise.instruction && (
                <p className="text-sm text-slate-600">{exercise.instruction}</p>
              )}
            </div>
          ))}

          {exercises.length === 0 && (
            <p className="text-sm text-slate-500 italic text-center py-4">
              No exercises scheduled for this day.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutDetails;
