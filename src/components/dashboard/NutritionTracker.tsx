import NutritionLogDialog from '@/components/nutrition/NutritionLogDialog';
import NutritionPlanGenerator from '@/components/nutrition/NutritionPlanGenerator';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useNutritionPlans } from '@/hooks/useNutritionPlans';
import { Plus, Utensils } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NutritionTracker = ({ profile }: { profile: any }) => {
  const navigate = useNavigate();
  const [logOpen, setLogOpen] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const { plans, logs, logNutrition, fetchNutritionPlans } = useNutritionPlans();

  // Get the most recent log
  const todayLog = logs.length > 0 ? logs[0] : null;
  const latestPlan = plans.length > 0 ? plans[0] : null;

  // Calculate percentages for progress bars
  const proteinPercentage =
    latestPlan && todayLog?.daily_protein
      ? Math.min(Math.round((todayLog.daily_protein / latestPlan.protein_target) * 100), 100)
      : 0;

  const carbsPercentage =
    latestPlan && todayLog?.daily_carbs
      ? Math.min(Math.round((todayLog.daily_carbs / latestPlan.carbs_target) * 100), 100)
      : 0;

  const fatPercentage =
    latestPlan && todayLog?.daily_fat
      ? Math.min(Math.round((todayLog.daily_fat / latestPlan.fat_target) * 100), 100)
      : 0;

  return (
    <>
      {showGenerator ? (
        <Card className="col-span-1 md:col-span-3 bg-white rounded-lg shadow-lg p-6 border border-fitcraft-secondary">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Create Nutrition Plan</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowGenerator(false)}>
                Cancel
              </Button>
            </div>
            <CardDescription>
              Generate a personalized nutrition plan based on your goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NutritionPlanGenerator
              onComplete={() => {
                fetchNutritionPlans();
                setShowGenerator(false);
              }}
              profile={profile}
            />
          </CardContent>
        </Card>
      ) : (
        <Card className="col-span-1 md:col-span-3 bg-white rounded-lg shadow-lg p-6 border border-fitcraft-secondary">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <Utensils className="w-5 h-5 mr-2 text-fitcraft-primary" />
                Nutrition Tracker
              </CardTitle>
              <Button
                onClick={() => setLogOpen(true)}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                Log Today
              </Button>
            </div>
            <CardDescription>Track your daily nutrition intake</CardDescription>
          </CardHeader>

          <CardContent className="pb-2">
            {latestPlan ? (
              <>
                <div className="mb-4">
                  <h3 className="font-medium text-sm mb-1">Current Plan: {latestPlan.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Goal:{' '}
                    {latestPlan.goal.charAt(0).toUpperCase() +
                      latestPlan.goal.slice(1).replace('-', ' ')}{' '}
                    •{latestPlan.daily_calories} calories/day
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>
                        Protein ({todayLog?.daily_protein || 0}g / {latestPlan.protein_target}g)
                      </span>
                      <span>{proteinPercentage}%</span>
                    </div>
                    <Progress value={proteinPercentage} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>
                        Carbs ({todayLog?.daily_carbs || 0}g / {latestPlan.carbs_target}g)
                      </span>
                      <span>{carbsPercentage}%</span>
                    </div>
                    <Progress value={carbsPercentage} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>
                        Fat ({todayLog?.daily_fat || 0}g / {latestPlan.fat_target}g)
                      </span>
                      <span>{fatPercentage}%</span>
                    </div>
                    <Progress value={fatPercentage} className="h-2" />
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">
                  You don't have a nutrition plan yet. Create one to start tracking your nutrition
                  goals.
                </p>
              </div>
            )}
          </CardContent>

          <CardFooter className="pt-2">
            {latestPlan ? (
              <div className="w-full grid grid-cols-2 gap-2">
                <Button
                  onClick={() => navigate('/meal-plan')}
                  variant="default"
                  className="w-full text-sm"
                >
                  View Full Plan
                </Button>
                <Button
                  onClick={() => setShowGenerator(true)}
                  variant="outline"
                  className="w-full text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Create New Plan
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setShowGenerator(true)}
                className="w-full bg-fitcraft-primary hover:bg-fitcraft-secondary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Generate Nutrition Plan
              </Button>
            )}
          </CardFooter>
        </Card>
      )}

      <NutritionLogDialog
        open={logOpen}
        onOpenChange={setLogOpen}
        onSubmit={logNutrition}
        defaultValues={todayLog}
      />
    </>
  );
};

export default NutritionTracker;
