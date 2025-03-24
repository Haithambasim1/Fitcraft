
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NutritionLogForm from './NutritionLogForm';
import { NutritionLog } from '@/hooks/useNutritionPlans';

interface NutritionLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (log: NutritionLog) => Promise<any>;
  defaultValues?: Partial<NutritionLog>;
}

const NutritionLogDialog: React.FC<NutritionLogDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues
}) => {
  // Transform the string date into a Date object for the form
  const formattedDefaultValues = defaultValues ? {
    ...defaultValues,
    // Convert string date to Date object if it exists
    date: defaultValues.date ? new Date(defaultValues.date) : undefined
  } : undefined;

  const handleSubmit = async (values: any) => {
    await onSubmit({
      date: values.date.toISOString().split('T')[0],
      daily_calories: values.daily_calories,
      daily_protein: values.daily_protein,
      daily_carbs: values.daily_carbs,
      daily_fat: values.daily_fat,
      weight: values.weight,
      notes: values.notes
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Log Nutrition</DialogTitle>
          <DialogDescription>
            Track your daily nutrition intake and weight to monitor your progress
          </DialogDescription>
        </DialogHeader>
        <NutritionLogForm
          onSubmit={handleSubmit}
          defaultValues={formattedDefaultValues}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NutritionLogDialog;
