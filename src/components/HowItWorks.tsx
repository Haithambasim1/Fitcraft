
import React from 'react';
import { ClipboardList, Sparkles, Calendar, TrendingUp } from 'lucide-react';

const steps = [
  {
    icon: ClipboardList,
    title: 'Tell us about yourself',
    description: 'Share your fitness goals, current level, preferences, and any limitations you might have.',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    icon: Sparkles,
    title: 'AI creates your plan',
    description: 'Our AI analyzes your data to create personalized workout and nutrition plans optimized for your goals.',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    icon: Calendar,
    title: 'Follow your daily plans',
    description: 'Access your customized workouts and meal plans through a simple, easy-to-follow daily schedule.',
    color: 'bg-green-100 text-green-600'
  },
  {
    icon: TrendingUp,
    title: 'Track progress & adapt',
    description: 'Log your workouts and the AI continuously optimizes your plan based on your progress and feedback.',
    color: 'bg-amber-100 text-amber-600'
  }
];

const HowItWorks = () => {
  return (
    <section className="section-padding bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-fitcraft-dark">
            How <span className="text-fitcraft-primary">FitCraft</span> Works
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Four simple steps to your personalized fitness journey
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm card-hover"
            >
              <div className={`w-14 h-14 rounded-full ${step.color} flex items-center justify-center mb-4`}>
                <step.icon className="w-7 h-7" />
              </div>
              <span className="inline-block bg-slate-100 text-slate-500 text-xs font-medium px-2.5 py-1 rounded-full mb-3">
                Step {index + 1}
              </span>
              <h3 className="text-xl font-semibold mb-3 text-fitcraft-dark">{step.title}</h3>
              <p className="text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
        
        <div className="relative mt-16 pt-16 border-t border-slate-200">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-fitcraft-dark">
                Your Plan Adapts As You Progress
              </h3>
              <p className="text-slate-600 mb-6">
                Unlike static workout programs, FitCraft continuously learns from your performance, preferences, and results to optimize your plan for maximum effectiveness.
              </p>
              <ul className="space-y-3">
                {[
                  'Automatically adjusts intensity based on your progress',
                  'Suggests alternative exercises when needed',
                  'Modifies your nutrition plan based on your goals',
                  'Accounts for your feedback and preferences'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-fitcraft-primary/20 flex items-center justify-center mt-0.5">
                      <span className="text-fitcraft-primary text-xs font-bold">✓</span>
                    </div>
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-fitcraft-dark">Workout Progress</h4>
                <span className="text-sm text-slate-500">Last 30 days</span>
              </div>
              <div className="h-60 flex items-end gap-2">
                {[35, 45, 60, 55, 70, 65, 75, 80, 85, 90].map((height, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-fitcraft-primary/20 rounded-t-sm" 
                      style={{ height: `${height}%` }}
                    >
                      <div 
                        className="w-full bg-fitcraft-primary rounded-t-sm animate-pulse" 
                        style={{ height: `${height * 0.7}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-slate-500 mt-1">{index + 1}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Intensity:</span>
                  <span className="text-fitcraft-primary font-medium">Increasing</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Next adjustment:</span>
                  <span className="text-fitcraft-dark font-medium">2 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
