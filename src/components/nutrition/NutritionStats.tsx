
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { NutritionLog } from '@/hooks/useNutritionPlans';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface NutritionStatsProps {
  logs: NutritionLog[];
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
}

const NutritionStats: React.FC<NutritionStatsProps> = ({
  logs,
  targetCalories,
  targetProtein,
  targetCarbs,
  targetFat
}) => {
  // Sort logs by date
  const sortedLogs = [...logs].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Format the logs for charts
  const chartData = sortedLogs.map(log => ({
    date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    calories: log.daily_calories || 0,
    protein: log.daily_protein || 0,
    carbs: log.daily_carbs || 0,
    fat: log.daily_fat || 0,
    weight: log.weight || null
  }));

  // Get latest log
  const latestLog = logs.length > 0 
    ? logs.reduce((latest, log) => 
        new Date(log.date) > new Date(latest.date) ? log : latest
      , logs[0])
    : null;

  const caloriesPercentage = latestLog?.daily_calories
    ? Math.min(100, Math.round((latestLog.daily_calories / targetCalories) * 100))
    : 0;

  const proteinPercentage = latestLog?.daily_protein
    ? Math.min(100, Math.round((latestLog.daily_protein / targetProtein) * 100))
    : 0;

  const carbsPercentage = latestLog?.daily_carbs
    ? Math.min(100, Math.round((latestLog.daily_carbs / targetCarbs) * 100))
    : 0;

  const fatPercentage = latestLog?.daily_fat
    ? Math.min(100, Math.round((latestLog.daily_fat / targetFat) * 100))
    : 0;

  // Weight chart data
  const weightData = sortedLogs
    .filter(log => log.weight)
    .map(log => ({
      date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: log.weight
    }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Nutrition Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Calories</span>
                <span className="text-sm text-slate-600">
                  {latestLog?.daily_calories || 0} / {targetCalories} kcal
                </span>
              </div>
              <Progress value={caloriesPercentage} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Protein</span>
                <span className="text-sm text-slate-600">
                  {latestLog?.daily_protein || 0} / {targetProtein} g
                </span>
              </div>
              <Progress value={proteinPercentage} className="h-2 bg-blue-100" indicatorClassName="bg-blue-500" />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Carbs</span>
                <span className="text-sm text-slate-600">
                  {latestLog?.daily_carbs || 0} / {targetCarbs} g
                </span>
              </div>
              <Progress value={carbsPercentage} className="h-2 bg-green-100" indicatorClassName="bg-green-500" />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Fat</span>
                <span className="text-sm text-slate-600">
                  {latestLog?.daily_fat || 0} / {targetFat} g
                </span>
              </div>
              <Progress value={fatPercentage} className="h-2 bg-yellow-100" indicatorClassName="bg-yellow-500" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Calorie Intake</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="calories" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.2} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-slate-500">
                No nutrition logs available
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {weightData.length > 0 && (
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Weight Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weightData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#10b981" 
                    fill="#10b981" 
                    fillOpacity={0.2} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NutritionStats;
