import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Dumbbell, TrendingUp } from 'lucide-react';
import React from 'react';

interface StatusCardsProps {
  streak: number;
  progress: number;
  hasWorkoutPlan: boolean;
}

const StatusCards: React.FC<StatusCardsProps> = ({ streak, progress, hasWorkoutPlan }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card className="bg-white border-l-4 border-fitcraft-primary rounded-lg shadow-lg p-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Dumbbell className="w-5 h-5 mr-2 text-fitcraft-primary" />
            Workout Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-fitcraft-dark">{streak} days</div>
          <p className="text-sm text-slate-500">
            {streak > 0 ? 'Keep it up!' : 'Start your streak today!'}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white border-l-4 border-fitcraft-secondary rounded-lg shadow-lg p-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-fitcraft-primary" />
            Plan Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-2">
            <Progress value={progress} />
          </div>
          <p className="text-sm text-slate-500">
            {progress > 0 ? `${progress}% complete` : 'Start your fitness plan'}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white border-l-4 border-fitcraft-accent rounded-lg shadow-lg p-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <CheckCircle2 className="w-5 h-5 mr-2 text-fitcraft-primary" />
            Today's Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-fitcraft-dark">
            {hasWorkoutPlan ? '2/4' : '0/4'}
          </div>
          <p className="text-sm text-slate-500">Goals completed</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatusCards;
