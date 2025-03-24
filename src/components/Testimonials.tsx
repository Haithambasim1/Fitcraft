
import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    image: 'https://randomuser.me/api/portraits/women/12.jpg',
    role: 'Lost 26 lbs in 4 months',
    content: "FitCraft has completely changed my approach to fitness. The AI-generated workout plans feel like they were made by a personal trainer who really knows me. The meal plans are delicious and I never feel like I'm on a diet!",
    rating: 5
  },
  {
    name: 'Michael Chen',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    role: 'Gained 15 lbs of muscle',
    content: "As someone who's tried many fitness apps before, FitCraft stands out because it truly adapts to my progress. When I got stronger, the workouts got more challenging at just the right pace. The nutrition guidance has been key to my muscle gains.",
    rating: 5
  },
  {
    name: 'Emily Rodriguez',
    image: 'https://randomuser.me/api/portraits/women/65.jpg',
    role: 'Marathon runner',
    content: "I was skeptical about AI training plans at first, but FitCraft proved me wrong. My endurance has improved significantly, and the app somehow knows exactly when to push me harder and when to schedule recovery. Highly recommended!",
    rating: 4
  }
];

const Testimonials = () => {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-fitcraft-dark">
            Transformations from Real <span className="text-fitcraft-primary">Users</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Hear from people who have achieved their fitness goals with FitCraft's AI-powered approach
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm card-hover"
            >
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-fitcraft-dark">{testimonial.name}</h3>
                  <p className="text-sm text-fitcraft-primary">{testimonial.role}</p>
                </div>
              </div>
              
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i}
                    className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`}
                  />
                ))}
              </div>
              
              <p className="text-slate-600 italic">"{testimonial.content}"</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-fitcraft-primary/10 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4 text-fitcraft-dark">
            Ready to start your transformation?
          </h3>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Join thousands of users who have achieved their fitness goals with FitCraft's personalized AI approach.
          </p>
          <button className="fitcraft-button">
            Try FitCraft Free for 14 Days
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
