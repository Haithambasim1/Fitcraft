
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useWorkoutPlans } from '@/hooks/useWorkoutPlans';
import { useNavigate } from 'react-router-dom';
import WorkoutPlanHeader from '@/components/workout/WorkoutPlanHeader';
import PlanSchedule from '@/components/workout/PlanSchedule';
import TodaysWorkout from '@/components/workout/TodaysWorkout';

const WorkoutPlan = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("schedule");
  const { 
    userWorkoutPlans, 
    loading, 
    selectedPlan, 
    setSelectedPlan, 
    todayWorkout, 
    planStats 
  } = useWorkoutPlans();

  const handleCreatePlan = () => {
    navigate('/onboarding');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <WorkoutPlanHeader 
            selectedPlan={selectedPlan} 
            planStats={planStats} 
          />
          
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="today">Today's Workout</TabsTrigger>
            </TabsList>
            
            <TabsContent value="schedule" className="mt-6">
              <PlanSchedule 
                loading={loading}
                userWorkoutPlans={userWorkoutPlans}
                selectedPlan={selectedPlan}
                setSelectedPlan={setSelectedPlan}
                onCreatePlan={handleCreatePlan}
              />
            </TabsContent>
            
            <TabsContent value="today" className="mt-6">
              <TodaysWorkout 
                todayWorkout={todayWorkout} 
                loading={loading} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WorkoutPlan;
