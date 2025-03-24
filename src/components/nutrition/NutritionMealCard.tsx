
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Flame, Apple } from "lucide-react";

interface NutritionMealCardProps {
  name: string;
  mealTime: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  instructions?: string;
}

const NutritionMealCard: React.FC<NutritionMealCardProps> = ({
  name,
  mealTime,
  description,
  calories,
  protein,
  carbs,
  fat,
  instructions
}) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{name}</CardTitle>
          <div className="flex items-center text-sm text-slate-600">
            <Clock className="h-4 w-4 mr-1" />
            {mealTime}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-slate-600">{description}</p>
        </div>
        
        <div className="flex items-center mb-3">
          <Flame className="h-4 w-4 text-red-500 mr-2" />
          <span className="text-sm font-medium">{calories} calories</span>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-blue-50 p-2 rounded text-center">
            <div className="text-sm font-semibold text-blue-600">{protein}g</div>
            <div className="text-xs text-slate-600">Protein</div>
          </div>
          <div className="bg-green-50 p-2 rounded text-center">
            <div className="text-sm font-semibold text-green-600">{carbs}g</div>
            <div className="text-xs text-slate-600">Carbs</div>
          </div>
          <div className="bg-yellow-50 p-2 rounded text-center">
            <div className="text-sm font-semibold text-yellow-600">{fat}g</div>
            <div className="text-xs text-slate-600">Fat</div>
          </div>
        </div>
        
        {instructions && (
          <div className="mt-2">
            <div className="flex items-center">
              <Apple className="h-4 w-4 text-fitcraft-primary mr-2" />
              <span className="text-sm font-medium">Instructions</span>
            </div>
            <p className="text-xs text-slate-600 mt-1">{instructions}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NutritionMealCard;
