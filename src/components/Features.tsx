
import React from 'react';
import { Brain, Dumbbell, Salad, BarChart3, CalendarClock, MessageSquare } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Plans',
    description: 'Get workout and nutrition plans created specifically for your body, goals, and preferences using advanced AI technology.'
  },
  {
    icon: Dumbbell,
    title: 'Personalized Workouts',
    description: 'Exercises tailored to your fitness level, available equipment, and time constraints - all customized to maximize your results.'
  },
  {
    icon: Salad,
    title: 'Nutrition Guidance',
    description: 'Receive customized meal plans and recipes that align with your fitness goals and dietary preferences.'
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking',
    description: 'Track your workouts, measurements, and nutrition to visualize your progress and stay motivated.'
  },
  {
    icon: CalendarClock,
    title: 'Adaptive Scheduling',
    description: 'Plans that adapt to your schedule changes and life events, ensuring consistency in your fitness journey.'
  },
  {
    icon: MessageSquare,
    title: 'AI Coaching',
    description: 'Get answers to your fitness and nutrition questions anytime with our AI coaching assistant.'
  }
];

const Features = () => {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-fitcraft-dark">
            Powered by AI, Designed for <span className="text-fitcraft-primary">You</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            FitCraft combines cutting-edge AI technology with fitness expertise to deliver a personalized experience that evolves with you.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white border border-slate-200 rounded-xl p-6 card-hover"
            >
              <div className="w-12 h-12 rounded-lg bg-fitcraft-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-fitcraft-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-fitcraft-dark">{feature.title}</h3>
              <p className="text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
