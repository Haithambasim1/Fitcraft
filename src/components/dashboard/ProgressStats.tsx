import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import React from 'react';

interface StatItem {
  name: string;
  goal: number;
  current: number;
  unit?: string;
}

interface ProgressStatsProps {
  stats: StatItem[];
}

const ProgressStats: React.FC<ProgressStatsProps> = ({ stats }) => {
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle className="text-fitcraft-dark font-semibold">Your Progress Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{stat.name}</span>
                <span className="text-sm text-muted-foreground">
                  {stat.current}/{stat.goal} {stat?.unit}
                </span>
              </div>
              <Progress
                value={stat.goal > 0 ? (stat.current / stat.goal) * 100 : 0}
                className="h-2"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressStats;
