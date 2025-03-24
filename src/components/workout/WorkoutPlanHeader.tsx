
import React from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Plus } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { WorkoutPlan } from '@/hooks/useWorkoutPlans';

interface WorkoutPlanHeaderProps {
  selectedPlan: WorkoutPlan | null;
  planStats: {
    name: string;
    daysCompleted: number;
    totalDays: number;
    type: string;
    progress: number;
  };
}

const WorkoutPlanHeader: React.FC<WorkoutPlanHeaderProps> = ({ 
  selectedPlan, 
  planStats 
}) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="mr-2 p-2"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-fitcraft-dark">
              {selectedPlan ? selectedPlan.name : planStats.name || "Your Workout Plan"}
            </h1>
            <p className="text-slate-600">
              {selectedPlan ? 
                selectedPlan.description : 
                `${planStats.type} Program • ${planStats.daysCompleted} of ${planStats.totalDays} days completed`}
            </p>
          </div>
        </div>
        
        <Button 
          className="bg-fitcraft-primary hover:bg-fitcraft-secondary hidden md:flex"
          onClick={() => navigate('/onboarding')}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Workout Plan
        </Button>
      </div>
      
      {selectedPlan && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-fitcraft-dark">Overall Progress</span>
            <span className="text-sm text-fitcraft-dark">{planStats.progress}%</span>
          </div>
          <Progress value={planStats.progress} className="h-2" />
        </div>
      )}
    </>
  );
};

export default WorkoutPlanHeader;
