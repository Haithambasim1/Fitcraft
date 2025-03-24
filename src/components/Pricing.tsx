import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { isAuthenticated } from '@/lib/auth';
import { createCheckoutSession } from '@/lib/stripe';
import { Check, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    name: 'Free Trial',
    price: '$0',
    duration: '7 days',
    description: 'Try FitCraft risk-free and experience AI fitness planning',
    features: [
      'Basic workout plans',
      'Simple meal recommendations',
      'Progress tracking',
      'Access to exercise library',
      'Mobile app access',
    ],
    notIncluded: [
      'Advanced AI training customization',
      'Detailed nutrition plans',
      'Priority support',
      'Body composition analysis',
    ],
    buttonText: 'Start Free Trial',
    buttonVariant: 'outline',
    priceId: 'free_trial',
  },
  {
    name: 'Premium',
    price: '$15',
    duration: 'one-time payment',
    description: 'The complete FitCraft experience with lifetime access',
    features: [
      'Advanced AI workout plans',
      'Personalized nutrition programs',
      'Detailed progress analytics',
      'Body composition tracking',
      'Unlimited plan adjustments',
      'Priority support',
      'Exclusive workout library',
      'Recipe database access',
      'Workout video tutorials',
    ],
    notIncluded: [],
    buttonText: 'Get Lifetime Access',
    buttonVariant: 'primary',
    isPopular: true,
    priceId: 'price_lifetime',
  },
  {
    name: 'Annual',
    price: '$9.99',
    duration: 'per month, billed annually',
    description: 'Our best value plan with everything included',
    features: [
      'All Premium features',
      'Save 33% vs monthly plan',
      'Annual fitness assessment',
      'Quarterly consultation',
      'Goal-specific programs',
      'Early access to new features',
    ],
    notIncluded: [],
    buttonText: 'Get Annual Plan',
    buttonVariant: 'outline',
    priceId: 'price_annual',
  },
];

const Pricing = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');

  const handlePurchase = async (priceId: string, planName: string) => {
    try {
      // Check if user is authenticated
      const isUserAuthenticated = await isAuthenticated();

      if (!isUserAuthenticated) {
        toast({
          title: 'Authentication required',
          description: 'Please log in to purchase a plan',
          variant: 'destructive',
        });
        navigate('/login');
        return;
      }

      if (priceId === 'free_trial') {
        // Handle free trial logic - redirect to onboarding
        toast({
          title: 'Free trial activated',
          description: 'Your 7-day free trial has started!',
        });
        navigate('/onboarding');
        return;
      }

      // For paid plans, create a checkout session
      const { url } = await createCheckoutSession(priceId, paymentMethod);

      if (url) {
        // Redirect to Checkout
        window.location.href = url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error starting checkout:', error);
      toast({
        title: 'Error',
        description: 'There was a problem processing your request. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <section className="section-padding bg-slate-50" id="pricing">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-fitcraft-dark">
            Simple, Transparent <span className="text-fitcraft-primary">Pricing</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Choose the plan that fits your fitness journey
          </p>
        </div>

        <div className="text-center mb-8">
          <p className="text-slate-600 mb-3">Select your preferred payment method:</p>
          <div className="inline-block">
            <Select
              value={paymentMethod}
              onValueChange={(value: 'stripe' | 'paypal') => setPaymentMethod(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Payment Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stripe">Credit Card</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl p-8 border ${
                plan.isPopular
                  ? 'border-fitcraft-primary shadow-lg relative'
                  : 'border-slate-200 shadow-sm'
              }`}
            >
              {plan.isPopular && (
                <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-fitcraft-primary text-white text-xs font-bold uppercase py-1 px-4 rounded-full">
                  Most Popular
                </span>
              )}

              <h3 className="text-xl font-bold mb-2 text-fitcraft-dark">{plan.name}</h3>
              <div className="flex items-end gap-1 mb-4">
                <span className="text-3xl font-bold text-fitcraft-dark">{plan.price}</span>
                <span className="text-slate-500 mb-1">{plan.duration}</span>
              </div>
              <p className="text-slate-600 mb-6 pb-6 border-b border-slate-100">
                {plan.description}
              </p>

              {plan.features.length > 0 && (
                <div className="mb-6">
                  <p className="font-medium mb-3 text-fitcraft-dark">Included:</p>
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-fitcraft-accent mt-0.5 shrink-0" />
                        <span className="text-slate-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {plan.notIncluded.length > 0 && (
                <div className="mb-6">
                  <p className="font-medium mb-3 text-fitcraft-dark">Not included:</p>
                  <ul className="space-y-2">
                    {plan.notIncluded.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <X className="w-5 h-5 text-slate-300 mt-0.5 shrink-0" />
                        <span className="text-slate-400">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Button
                className={`w-full mt-4 ${
                  plan.buttonVariant === 'primary'
                    ? 'bg-fitcraft-primary hover:bg-fitcraft-secondary text-white'
                    : 'border-fitcraft-primary text-fitcraft-primary hover:bg-fitcraft-primary/5'
                }`}
                variant={plan.buttonVariant === 'primary' ? 'default' : 'outline'}
                onClick={() => handlePurchase(plan.priceId, plan.name)}
              >
                {plan.buttonText} {paymentMethod === 'paypal' ? 'with PayPal' : ''}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-500 mb-2">All plans include a 30-day money-back guarantee</p>
          <p className="text-slate-600 font-medium">
            Have questions?{' '}
            <a href="#" className="text-fitcraft-primary hover:underline">
              Contact our team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
