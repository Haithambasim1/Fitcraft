
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  goal: z.enum(["weight-loss", "muscle-gain", "maintenance", "health", "performance"]),
  dailyCalories: z.coerce.number().min(1000, "Must be at least 1000 calories").max(5000, "Must be at most 5000 calories").optional(),
  days: z.coerce.number().min(1, "Must be at least 1 day").max(14, "Must be at most 14 days").default(7),
  preferences: z.string().optional(),
  restrictions: z.string().optional(),
  weight: z.coerce.number().min(40, "Must be at least 40 kg").max(200, "Must be at most 200 kg").optional(),
  height: z.coerce.number().min(140, "Must be at least 140 cm").max(220, "Must be at most 220 cm").optional(),
  age: z.coerce.number().min(18, "Must be at least 18 years").max(100, "Must be at most 100 years").optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  activityLevel: z.enum(["sedentary", "light", "moderate", "active", "very active"]).optional(),
});

type NutritionPlanGeneratorProps = {
  onComplete: () => void;
  profile?: any;
};

const NutritionPlanGenerator: React.FC<NutritionPlanGeneratorProps> = ({ 
  onComplete,
  profile,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goal: profile?.goal || "weight-loss",
      days: 7,
      preferences: "",
      restrictions: "",
      weight: profile?.weight || undefined,
      height: profile?.height || undefined,
      age: undefined,
      gender: undefined,
      activityLevel: "moderate",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      
      // Format preferences and restrictions as arrays
      const preferences = values.preferences 
        ? values.preferences.split(',').map(p => p.trim()).filter(p => p) 
        : [];
        
      const restrictions = values.restrictions 
        ? values.restrictions.split(',').map(r => r.trim()).filter(r => r) 
        : [];
      
      // Call the edge function to generate a nutrition plan
      const { data, error } = await supabase.functions.invoke('generate-nutrition-plan', {
        body: {
          goal: values.goal,
          dailyCalories: values.dailyCalories,
          days: values.days,
          preferences,
          restrictions,
          weight: values.weight,
          height: values.height,
          age: values.age,
          gender: values.gender,
          activityLevel: values.activityLevel,
        },
      });
      
      if (error) {
        throw error;
      }
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to generate nutrition plan');
      }
      
      toast({
        title: "Success",
        description: "Your nutrition plan has been created!",
      });
      
      // Call onComplete to refresh data
      onComplete();
      
    } catch (error: any) {
      console.error('Error generating nutrition plan:', error);
      toast({
        title: "Error",
        description: `Failed to generate nutrition plan: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Create a Nutrition Plan</h2>
        <p className="text-slate-600 mt-1">
          Tell us about your nutrition goals and preferences
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="goal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nutrition Goal</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your goal" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="weight-loss">Weight Loss</SelectItem>
                    <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="health">General Health</SelectItem>
                    <SelectItem value="performance">Athletic Performance</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="dailyCalories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Daily Calories (optional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="We'll calculate if not provided"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Leave empty to automatically calculate
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Days in Plan</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Number of days to generate (1-14)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="preferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Food Preferences (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., chicken, fish, vegetarian, high-protein"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Separate with commas
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="restrictions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dietary Restrictions (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., gluten-free, dairy-free, peanut allergy"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Separate with commas
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <h3 className="text-md font-semibold pt-2">Additional Information (optional)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (kg)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height (cm)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="activityLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select activity level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                      <SelectItem value="light">Light (1-3 days/week)</SelectItem>
                      <SelectItem value="moderate">Moderate (3-5 days/week)</SelectItem>
                      <SelectItem value="active">Active (6-7 days/week)</SelectItem>
                      <SelectItem value="very active">Very Active (twice/day)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-fitcraft-primary hover:bg-fitcraft-secondary"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Create Nutrition Plan"
            )}
          </Button>
        </form>
      </Form>
    </Card>
  );
};

export default NutritionPlanGenerator;
