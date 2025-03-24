import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Apple, Plus } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Meal {
  name: string;
  meal: string;
  calories: number;
  time: string;
}

interface MealPlanProps {
  mealPlan: {
    name: string;
    dailyCalories: number;
    todayMeals: Meal[];
  } | null;
  defaultMeals: Meal[];
  onAddMealPlan?: () => void;
}

const TodayMealPlan: React.FC<MealPlanProps> = ({ mealPlan, defaultMeals, onAddMealPlan }) => {
  const navigate = useNavigate();

  return (
    <Card className="md:col-span-1 bg-white rounded-lg shadow-lg p-6 border-l-4 border-fitcraft-secondary">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Apple className="w-5 h-5 mr-2 text-fitcraft-primary" />
          Today's Meal Plan
        </CardTitle>
        {mealPlan ? (
          <CardDescription>
            {mealPlan.name} ({mealPlan.dailyCalories} calories)
          </CardDescription>
        ) : (
          <CardDescription>Suggested meals</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {(mealPlan ? mealPlan.todayMeals : defaultMeals).map((meal, index) => (
            <div key={index} className="flex justify-between items-center border-b pb-2">
              <div>
                <div className="text-fitcraft-dark font-medium">
                  {meal.name} ({meal.time})
                </div>
                <div className="text-sm text-slate-600">{meal.meal}</div>
              </div>
              <div className="text-slate-600">{meal.calories} cal</div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          className="w-full bg-fitcraft-primary hover:bg-fitcraft-secondary"
          onClick={() => navigate('/meal-plan')}
        >
          View Full Meal Plan
        </Button>
        {!mealPlan && onAddMealPlan && (
          <Button
            variant="outline"
            className="ml-2 border-fitcraft-primary text-fitcraft-primary hover:bg-fitcraft-primary/10"
            onClick={onAddMealPlan}
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default TodayMealPlan;
