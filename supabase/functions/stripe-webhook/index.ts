
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import Stripe from 'https://esm.sh/stripe@12.0.0?dts'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return new Response('Missing stripe-signature header', { status: 400 })
  }

  const body = await req.text()
  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`)
    return new Response(`Webhook signature verification failed: ${err.message}`, { status: 400 })
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        
        // Get the user ID and check if this is a lifetime payment
        const userId = session.metadata.userId
        const isLifetime = session.metadata.isLifetime === 'true'
        
        if (!userId) {
          console.error('No user ID found in session metadata')
          break
        }
        
        if (isLifetime) {
          // This is a one-time payment for lifetime access
          const paymentIntentId = session.payment_intent
          const customerId = session.customer
          
          // Get product details
          const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
          const productId = lineItems.data[0]?.price?.product
          
          let productName = 'Lifetime Access'
          if (productId) {
            const product = await stripe.products.retrieve(productId)
            productName = product.name || 'Lifetime Access'
          }
          
          // Save the lifetime subscription details
          const { error } = await supabaseClient
            .from('subscriptions')
            .upsert({
              user_id: userId,
              stripe_customer_id: customerId,
              stripe_subscription_id: paymentIntentId, // Using payment intent as identifier
              plan_id: 'lifetime',
              plan_name: productName,
              status: 'lifetime', // Special status for lifetime access
              current_period_start: new Date().toISOString(),
              current_period_end: new Date(2099, 12, 31).toISOString(), // Far future date
              updated_at: new Date().toISOString(),
            })
          
          if (error) {
            console.error('Error saving lifetime subscription:', error)
          }
        } 
        else if (session.mode === 'subscription') {
          // Handle regular subscription
          const subscriptionId = session.subscription
          const customerId = session.customer
          
          // Retrieve the subscription to get plan details
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          const priceId = subscription.items.data[0].price.id
          const productId = subscription.items.data[0].price.product
          
          // Get product name
          const product = await stripe.products.retrieve(productId)
          
          // Save subscription details to Supabase
          const { error } = await supabaseClient
            .from('subscriptions')
            .upsert({
              user_id: userId,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              plan_id: priceId,
              plan_name: product.name,
              status: subscription.status,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              updated_at: new Date().toISOString(),
            })
          
          if (error) {
            console.error('Error saving subscription:', error)
          }
        }
        break
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object
        const subscriptionId = subscription.id
        
        // Find the subscription in the database
        const { data: existingSubscription, error: findError } = await supabaseClient
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subscriptionId)
          .single()
        
        if (findError) {
          console.error('Error finding subscription:', findError)
          break
        }
        
        if (!existingSubscription) {
          console.error('Subscription not found in database')
          break
        }
        
        // Update the subscription status
        const { error: updateError } = await supabaseClient
          .from('subscriptions')
          .update({
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscriptionId)
        
        if (updateError) {
          console.error('Error updating subscription:', updateError)
        }
        break
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        const subscriptionId = subscription.id
        
        // Update the subscription status to canceled
        const { error } = await supabaseClient
          .from('subscriptions')
          .update({
            status: 'canceled',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscriptionId)
        
        if (error) {
          console.error('Error updating subscription:', error)
        }
        break
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error(`Webhook error: ${err.message}`)
    return new Response(`Webhook error: ${err.message}`, { status: 500 })
  }
})
