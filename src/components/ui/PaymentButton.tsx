import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { isAuthenticated } from '@/lib/auth';
import { createCheckoutSession } from '@/lib/stripe';
import { useNavigate } from 'react-router-dom';

export function PaymentButton() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePayment = async () => {
    try {
      // Check if user is authenticated
      const isUserAuthenticated = await isAuthenticated();

      if (!isUserAuthenticated) {
        toast({
          title: 'Authentication required',
          description: 'Please log in to make a purchase',
          variant: 'destructive',
        });
        navigate('/login');
        return;
      }

      const { url } = await createCheckoutSession('price_lifetime', 'stripe');

      if (url) {
        window.location.href = url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Error',
        description: 'There was a problem processing your request. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Button
      onClick={handlePayment}
      className="w-full bg-fitcraft-primary hover:bg-fitcraft-secondary"
    >
      Subscribe Now
    </Button>
  );
}
