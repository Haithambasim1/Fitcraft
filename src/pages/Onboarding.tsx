import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Dumbbell, ArrowRight, ArrowLeft, CheckCheck } from 'lucide-react';
import WorkoutGenerator from '@/components/WorkoutGenerator';

const steps = [
  { id: "basic", name: "Basic Info" },
  { id: "goals", name: "Fitness Goals" },
  { id: "lifestyle", name: "Lifestyle" },
  { id: "preferences", name: "Preferences" },
  { id: "generate", name: "Generate Plan" },
  { id: "complete", name: "Complete" }
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Basic Info
    age: '',
    gender: '',
    height: '',
    weight: '',
    
    // Fitness Goals
    primaryGoal: '',
    targetWeight: '',
    timeframe: '',
    
    // Lifestyle
    activityLevel: '',
    sleepHours: '',
    dietaryRestrictions: [] as string[],
    
    // Preferences
    workoutPreference: '',
    workoutDuration: '',
    workoutFrequency: '',
    mealPreference: '',
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleMultiSelectChange = (item: string) => {
    setFormData(prev => {
      const existing = [...prev.dietaryRestrictions];
      const index = existing.indexOf(item);
      
      if (index > -1) {
        existing.splice(index, 1);
      } else {
        existing.push(item);
      }
      
      return {
        ...prev,
        dietaryRestrictions: existing
      };
    });
  };
  
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const handleComplete = () => {
    toast({
      title: "Profile setup complete!",
      description: "Your personalized fitness plan is ready.",
    });
    
    // In a real app, we would save the user's profile data here
    navigate('/dashboard');
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Basic Info
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input 
                    id="age"
                    name="age"
                    type="number" 
                    placeholder="25"
                    value={formData.age}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select 
                    value={formData.gender} 
                    onValueChange={(value) => handleSelectChange('gender', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input 
                    id="height"
                    name="height"
                    type="number" 
                    placeholder="175"
                    value={formData.height}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input 
                    id="weight"
                    name="weight"
                    type="number" 
                    placeholder="70"
                    value={formData.weight}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        );
      
      case 1: // Fitness Goals
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Primary Goal</Label>
                <RadioGroup 
                  value={formData.primaryGoal}
                  onValueChange={(value) => handleSelectChange('primaryGoal', value)}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weight-loss" id="weight-loss" />
                    <Label htmlFor="weight-loss">Weight Loss</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="muscle-gain" id="muscle-gain" />
                    <Label htmlFor="muscle-gain">Muscle Gain</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="improve-fitness" id="improve-fitness" />
                    <Label htmlFor="improve-fitness">Improve Fitness</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="maintain-weight" id="maintain-weight" />
                    <Label htmlFor="maintain-weight">Maintain Weight</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {(formData.primaryGoal === 'weight-loss' || formData.primaryGoal === 'muscle-gain') && (
                <div className="space-y-2">
                  <Label htmlFor="targetWeight">Target Weight (kg)</Label>
                  <Input 
                    id="targetWeight"
                    name="targetWeight"
                    type="number" 
                    placeholder="65"
                    value={formData.targetWeight}
                    onChange={handleInputChange}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="timeframe">Timeframe</Label>
                <Select 
                  value={formData.timeframe} 
                  onValueChange={(value) => handleSelectChange('timeframe', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-month">1 month</SelectItem>
                    <SelectItem value="3-months">3 months</SelectItem>
                    <SelectItem value="6-months">6 months</SelectItem>
                    <SelectItem value="12-months">12 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      
      case 2: // Lifestyle
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="activityLevel">Activity Level</Label>
                <Select 
                  value={formData.activityLevel} 
                  onValueChange={(value) => handleSelectChange('activityLevel', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                    <SelectItem value="light">Lightly active (light exercise 1-3 days/week)</SelectItem>
                    <SelectItem value="moderate">Moderately active (moderate exercise 3-5 days/week)</SelectItem>
                    <SelectItem value="active">Very active (hard exercise 6-7 days/week)</SelectItem>
                    <SelectItem value="very-active">Extra active (very hard exercise & physical job)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sleepHours">Average Hours of Sleep</Label>
                <Select 
                  value={formData.sleepHours} 
                  onValueChange={(value) => handleSelectChange('sleepHours', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sleep hours" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="less-than-5">Less than 5 hours</SelectItem>
                    <SelectItem value="5-6">5-6 hours</SelectItem>
                    <SelectItem value="7-8">7-8 hours</SelectItem>
                    <SelectItem value="more-than-8">More than 8 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Dietary Restrictions (select all that apply)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {['Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free', 'Keto', 'Paleo', 'Low-carb', 'Low-fat'].map((item) => (
                    <div key={item} className="flex items-center space-x-2">
                      <Checkbox 
                        id={item.toLowerCase()} 
                        checked={formData.dietaryRestrictions.includes(item.toLowerCase())}
                        onCheckedChange={() => handleMultiSelectChange(item.toLowerCase())}
                      />
                      <Label htmlFor={item.toLowerCase()}>{item}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 3: // Preferences
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Workout Preference</Label>
                <RadioGroup 
                  value={formData.workoutPreference}
                  onValueChange={(value) => handleSelectChange('workoutPreference', value)}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="home" id="home" />
                    <Label htmlFor="home">Home Workouts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="gym" id="gym" />
                    <Label htmlFor="gym">Gym Workouts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="outdoor" id="outdoor" />
                    <Label htmlFor="outdoor">Outdoor Activities</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mixed" id="mixed" />
                    <Label htmlFor="mixed">Mixed</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="workoutDuration">Preferred Workout Duration</Label>
                <Select 
                  value={formData.workoutDuration} 
                  onValueChange={(value) => handleSelectChange('workoutDuration', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15-30">15-30 minutes</SelectItem>
                    <SelectItem value="30-45">30-45 minutes</SelectItem>
                    <SelectItem value="45-60">45-60 minutes</SelectItem>
                    <SelectItem value="60+">60+ minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="workoutFrequency">Preferred Workout Frequency</Label>
                <Select 
                  value={formData.workoutFrequency} 
                  onValueChange={(value) => handleSelectChange('workoutFrequency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2-3">2-3 times per week</SelectItem>
                    <SelectItem value="3-4">3-4 times per week</SelectItem>
                    <SelectItem value="4-5">4-5 times per week</SelectItem>
                    <SelectItem value="6+">6+ times per week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mealPreference">Meal Plan Preference</Label>
                <Select 
                  value={formData.mealPreference} 
                  onValueChange={(value) => handleSelectChange('mealPreference', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select meal preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simple">Simple (few ingredients, easy prep)</SelectItem>
                    <SelectItem value="balanced">Balanced (variety with moderate prep)</SelectItem>
                    <SelectItem value="gourmet">Gourmet (diverse meals, more prep time)</SelectItem>
                    <SelectItem value="meal-prep">Meal prep focused (batch cooking)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      
      case 4: // Generate Plan
        return (
          <WorkoutGenerator formData={formData} onComplete={() => nextStep()} />
        );
      
      case 5: // Complete
        return (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCheck className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-fitcraft-dark">You're all set!</h3>
              <p className="text-slate-600 mt-2">
                We have all the information we need to create your personalized fitness plan.
                Your dashboard is ready with your workout plan and nutrition guidance.
              </p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2">
          <Dumbbell className="h-8 w-8 text-fitcraft-primary" />
          <span className="font-bold text-3xl text-fitcraft-dark">FitCraft</span>
        </div>
        <h1 className="text-2xl font-bold text-fitcraft-dark mt-4">Let's personalize your fitness journey</h1>
        <p className="text-slate-600 mt-2">
          We'll use this information to create your AI-powered fitness plan
        </p>
      </div>
      
      <div className="w-full max-w-3xl mb-8">
        <div className="relative">
          <div className="absolute top-2 left-0 w-full">
            <Progress value={(currentStep / (steps.length - 1)) * 100} className="h-2" />
          </div>
          <div className="relative z-10 flex justify-between">
            {steps.map((step, index) => (
              <div 
                key={step.id} 
                className={`flex flex-col items-center ${
                  index <= currentStep ? "text-fitcraft-primary" : "text-slate-400"
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  index <= currentStep ? "bg-fitcraft-primary text-white" : "bg-slate-200"
                }`}>
                  {index < currentStep ? (
                    <CheckCheck className="h-5 w-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="text-xs font-medium hidden md:block">{step.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>{steps[currentStep].name}</CardTitle>
          <CardDescription>
            {currentStep === 0 && "Tell us about yourself"}
            {currentStep === 1 && "What do you want to achieve?"}
            {currentStep === 2 && "Tell us about your lifestyle"}
            {currentStep === 3 && "How do you like to work out?"}
            {currentStep === 4 && "Your profile is complete"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          {currentStep < steps.length - 1 ? (
            <Button 
              onClick={nextStep}
              className="bg-fitcraft-primary hover:bg-fitcraft-secondary"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleComplete}
              className="bg-fitcraft-primary hover:bg-fitcraft-secondary"
            >
              Complete Setup
              <CheckCheck className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Onboarding;
