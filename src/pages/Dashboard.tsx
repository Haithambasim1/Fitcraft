import NutritionTracker from '@/components/dashboard/NutritionTracker';
import ProgressStats from '@/components/dashboard/ProgressStats';
import StatusCards from '@/components/dashboard/StatusCards';
import TodayMealPlan from '@/components/dashboard/TodayMealPlan';
import TodayWorkout from '@/components/dashboard/TodayWorkout';
import Navbar from '@/components/Navbar';
import { useDashboardData } from '@/hooks/useDashboardData';
import { supabase } from '@/integrations/supabase/client';
import { getUserProfile, requireAuth } from '@/lib/auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const { stats, workoutPlan, mealPlan, isLoading, streak, progress, defaultMeals } =
    useDashboardData();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await requireAuth(navigate);
      if (!isAuth) return;

      try {
        const userProfile = await getUserProfile();
        if (userProfile) {
          setProfile(userProfile);
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    checkAuth();

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        navigate('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fitcraft-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <Navbar />
      <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

          <StatusCards streak={streak} progress={progress} hasWorkoutPlan={!!workoutPlan} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <ProgressStats stats={stats} />

            <NutritionTracker profile={profile} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <TodayWorkout workoutPlan={workoutPlan} />
            <TodayMealPlan mealPlan={mealPlan} defaultMeals={defaultMeals} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
