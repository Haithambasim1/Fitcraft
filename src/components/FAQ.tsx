
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does FitCraft use AI to create personalized fitness plans?",
    answer: "FitCraft uses advanced AI algorithms that analyze your fitness goals, current level, body composition, preferences, and limitations to create fully customized workout and nutrition plans. The AI continuously learns from your progress, feedback, and performance to optimize and adjust your plans over time."
  },
  {
    question: "Do I need gym equipment to use FitCraft?",
    answer: "Not at all! FitCraft creates plans based on your available equipment. You can specify that you have no equipment, basic home equipment, or full gym access, and the AI will design workouts accordingly. We have thousands of bodyweight exercises in our library for those without equipment."
  },
  {
    question: "Can FitCraft accommodate dietary restrictions and preferences?",
    answer: "Absolutely. During setup, you can specify any dietary restrictions (vegetarian, vegan, gluten-free, etc.), food allergies, and preferences. The AI will generate meal plans and recipes that respect these requirements while ensuring you get the nutrients needed for your fitness goals."
  },
  {
    question: "How often are the workout and nutrition plans updated?",
    answer: "Your plans automatically adjust based on your progress and feedback. Generally, workout plans are refreshed every 4-6 weeks, but individual exercises may be modified more frequently based on your performance. Nutrition plans adapt to your changing needs, weight changes, and fitness progress."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time with no cancellation fees. If you cancel, you'll continue to have access until the end of your current billing period. We also offer a 30-day money-back guarantee for new subscribers."
  },
  {
    question: "Is FitCraft suitable for beginners?",
    answer: "FitCraft is perfect for beginners! The AI creates plans appropriate for your current fitness level, with proper progression to prevent injury and ensure sustainable results. We include detailed form guides and video tutorials for all exercises to help beginners learn proper technique."
  }
];

const FAQ = () => {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-3xl mx-auto px-6 md:px-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-fitcraft-dark">
            Frequently Asked <span className="text-fitcraft-primary">Questions</span>
          </h2>
          <p className="text-lg text-slate-600">
            Everything you need to know about FitCraft
          </p>
        </div>
        
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border border-slate-200 rounded-lg overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-50 text-left">
                <span className="font-medium text-fitcraft-dark">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 pt-2 text-slate-600">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        <div className="text-center mt-12">
          <p className="text-slate-600">
            Still have questions? <a href="#" className="text-fitcraft-primary font-medium hover:underline">Contact our support team</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
