import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Get the current user's session
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''));

    if (userError) {
      console.error('User error:', userError);
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { priceId, successUrl, cancelUrl } = await req.json();

    if (!priceId) {
      return new Response(JSON.stringify({ error: 'Price ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // If this is a free trial, don't create a checkout session
    if (priceId === 'free_trial') {
      // Insert a free trial subscription record
      const { error: subscriptionError } = await supabaseClient.from('subscriptions').insert({
        user_id: user.id,
        plan_id: 'free_trial',
        plan_name: 'Free Trial',
        status: 'trialing',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      });

      if (subscriptionError) {
        console.error('Error creating free trial subscription:', subscriptionError);
        return new Response(JSON.stringify({ error: 'Failed to create free trial' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(
        JSON.stringify({
          url: successUrl || `${req.headers.get('origin')}/dashboard?checkout=success`,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // PayPal price mapping
    const priceMap: Record<string, { amount: string; description: string }> = {
      price_lifetime: { amount: '15.00', description: 'FitCraft Lifetime Access' },
      price_annual: { amount: '119.88', description: 'FitCraft Annual Subscription' },
    };

    const priceDetails = priceMap[priceId] || {
      amount: '15.00',
      description: 'FitCraft Subscription',
    };

    // For now, create a simple redirect URL to PayPal checkout
    // In a production environment, you'd use the PayPal SDK to create a proper checkout session

    // For this example, we'll create a basic checkout URL
    // This is a simplified example - a real implementation would use the PayPal API

    const paypalBaseUrl = 'https://www.paypal.com/cgi-bin/webscr';
    const businessEmail =
      Deno.env.get('PAYPAL_BUSINESS_EMAIL') || 'your-business-email@example.com';

    const paypalUrl = new URL(paypalBaseUrl);
    paypalUrl.searchParams.append('cmd', '_xclick');
    paypalUrl.searchParams.append('business', businessEmail);
    paypalUrl.searchParams.append('item_name', priceDetails.description);
    paypalUrl.searchParams.append('amount', priceDetails.amount);
    paypalUrl.searchParams.append('currency_code', 'USD');
    paypalUrl.searchParams.append(
      'return',
      successUrl || `${req.headers.get('origin')}/dashboard?checkout=success`
    );
    paypalUrl.searchParams.append(
      'cancel_return',
      cancelUrl || `${req.headers.get('origin')}/pricing?checkout=canceled`
    );
    paypalUrl.searchParams.append('custom', user.id); // For identifying the user

    // Log the user's intent to purchase
    await supabaseClient.from('payment_attempts').insert({
      user_id: user.id,
      plan_id: priceId,
      payment_method: 'paypal',
      amount: priceDetails.amount,
      status: 'initiated',
    });

    return new Response(JSON.stringify({ url: paypalUrl.toString() }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
