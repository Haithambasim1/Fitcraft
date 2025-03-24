
import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle, ChevronRight } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="section-padding bg-gradient-to-br from-fitcraft-primary/20 via-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-fitcraft-dark">
                Start Your Fitness Journey <span className="text-fitcraft-primary">Today</span>
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Join thousands of users who have transformed their health and fitness with FitCraft's AI-powered approach.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  'Personalized workout plans that evolve with you',
                  'Nutrition guidance tailored to your preferences',
                  'Progress tracking to keep you motivated',
                  'AI coaching available 24/7'
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-fitcraft-accent mt-0.5 shrink-0" />
                    <span className="text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-fitcraft-primary hover:bg-fitcraft-secondary text-white px-8">
                  Start 14-Day Free Trial
                </Button>
                <Button variant="outline" size="lg" className="border-slate-300 text-slate-700">
                  Learn More <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
              </div>
              
              <p className="text-sm text-slate-500 mt-4">
                No credit card required. Cancel anytime.
              </p>
            </div>
            
            <div className="relative">
              <div className="bg-fitcraft-light rounded-xl p-6 relative z-10">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-fitcraft-dark mb-2">
                    Your First Week with FitCraft
                  </h3>
                  <p className="text-slate-600">
                    Here's what to expect when you sign up
                  </p>
                </div>
                
                <div className="space-y-6">
                  {[
                    {
                      day: 'Day 1',
                      title: 'Profile & Goal Setting',
                      description: 'Complete your fitness profile and set your goals'
                    },
                    {
                      day: 'Day 2',
                      title: 'Your Custom Plans',
                      description: 'Receive your personalized workout and nutrition plans'
                    },
                    {
                      day: 'Day 3-6',
                      title: 'Start Your Journey',
                      description: 'Begin following your plans with guidance and tracking'
                    },
                    {
                      day: 'Day 7',
                      title: 'First Check-in',
                      description: 'Review your progress and adjust plans as needed'
                    }
                  ].map((step, index) => (
                    <div key={index} className="flex items-start gap-4 relative">
                      {index < 3 && (
                        <div className="absolute left-7 top-10 bottom-0 border-l-2 border-dashed border-fitcraft-primary/30"></div>
                      )}
                      <div className="w-14 h-14 rounded-full bg-fitcraft-primary/20 flex items-center justify-center shrink-0 z-10">
                        <span className="text-fitcraft-primary font-bold">{step.day}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-fitcraft-dark">
                          {step.title}
                        </h4>
                        <p className="text-slate-600 text-sm">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-r from-fitcraft-primary/20 to-fitcraft-accent/20 rounded-xl transform rotate-3 -z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
