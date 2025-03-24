import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export async function createCheckoutSession(
  priceId: string,
  paymentMethod: 'stripe' | 'paypal' = 'stripe',
  successUrl?: string,
  cancelUrl?: string
) {
  try {
    // Get the current session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('Not authenticated');
    }

    console.log('Creating checkout session with:', {
      priceId,
      paymentMethod,
      successUrl,
      cancelUrl,
      userId: session.user.id,
    });

    // Ensure we have the correct authorization header format
    const authHeader = `Bearer ${session.access_token}`;
    console.log('Using auth header:', authHeader.substring(0, 20) + '...');

    const { data, error } = await supabase.functions.invoke(
      paymentMethod === 'stripe' ? 'create-checkout' : 'create-paypal-checkout',
      {
        body: { priceId, successUrl, cancelUrl },
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
      }
    );

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error(error.message || 'Failed to create checkout session');
    }

    if (!data) {
      throw new Error('No data returned from checkout session creation');
    }

    console.log('Checkout session created:', data);
    return data;
  } catch (error) {
    console.error(`Error creating ${paymentMethod} checkout session:`, error);
    toast({
      title: 'Error',
      description:
        error instanceof Error
          ? error.message
          : 'Failed to create checkout session. Please try again.',
      variant: 'destructive',
    });
    throw error;
  }
}

export async function getUserSubscription() {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) return null;

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching subscription:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error getting user subscription:', error);
    return null;
  }
}

interface Subscription {
  status:
    | 'active'
    | 'trialing'
    | 'lifetime'
    | 'canceled'
    | 'incomplete'
    | 'incomplete_expired'
    | 'past_due'
    | 'unpaid';
}

export function isSubscriptionActive(subscription: Subscription | null) {
  if (!subscription) return false;

  return ['active', 'trialing', 'lifetime'].includes(subscription.status);
}
