const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_your_secret_key_here');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files (HTML, CSS, JS)

// Product prices in cents (matching your product data)
const PRODUCT_PRICES = {
  'cinnavanilla': 3599, // $35.99
  'matcha': 3599,
  'mango': 3599
};

// Create Stripe Checkout Session
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { items, email, shipping, total } = req.body;

    console.log('Creating checkout session for:', { items, email, total });

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Build line items for Stripe
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: `12-Pack Protein Bars`,
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Calculate subtotal to determine shipping
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = subtotal >= 30 ? 0 : (shipping && shipping.cost ? shipping.cost : 599); // $5.99 default if under $30

    // Add shipping as a line item if needed
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping',
            description: 'Standard shipping',
          },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    // Create Stripe Checkout Session
    const origin = req.headers.origin || 'http://localhost:3000';
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${origin}/checkout-success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout.html`,
      customer_email: email,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 599, // $5.99
              currency: 'usd',
            },
            display_name: 'Standard Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 5,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 1299, // $12.99
              currency: 'usd',
            },
            display_name: 'Express Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 2,
              },
              maximum: {
                unit: 'business_day',
                value: 3,
              },
            },
          },
        },
      ],
      allow_promotion_codes: true,
      metadata: {
        email: email,
        shipping_address: shipping?.address || '',
        shipping_city: shipping?.city || '',
        shipping_state: shipping?.state || '',
        shipping_zip: shipping?.zip || '',
        shipping_country: shipping?.country || 'US',
        shipping_name: shipping?.name || '',
      },
    });

    console.log('✅ Checkout session created:', session.id);
    console.log('📧 Customer email:', email);
    console.log('💰 Total:', `$${total.toFixed(2)}`);

    res.json({ 
      sessionId: session.id,
      url: session.url 
    });
  } catch (error) {
    console.error('❌ Error creating checkout session:', error);
    
    // More helpful error messages
    let errorMessage = 'Failed to create checkout session';
    if (error.message.includes('No such API key') || error.message.includes('Invalid API Key')) {
      errorMessage = 'Stripe API key is invalid. Please set STRIPE_SECRET_KEY with a valid key.';
    } else if (error.message.includes('sk_test_your_secret_key_here') || error.message.includes('Placeholder')) {
      errorMessage = 'Please set up your Stripe secret key. See STRIPE_SETUP.md for instructions.';
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: error.message,
      hint: 'Set your Stripe secret key: export STRIPE_SECRET_KEY=sk_test_...'
    });
  }
});

// Verify checkout session (optional - for success page)
app.get('/verify-session/:sessionId', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    res.json(session);
  } catch (error) {
    console.error('Error retrieving session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Make sure to set STRIPE_SECRET_KEY in your environment`);
  console.log(`💳 Test with Stripe test keys: https://dashboard.stripe.com/test/apikeys`);
  console.log(`\n✨ Stripe Checkout is ready!`);
  console.log(`   - Add items to cart`);
  console.log(`   - Go to checkout page`);
  console.log(`   - Click "Complete Order" to redirect to Stripe Checkout\n`);
  
  // Warn if using placeholder key
  const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_your_secret_key_here';
  if (stripeKey.includes('your_secret_key_here') || stripeKey.includes('Placeholder')) {
    console.log(`⚠️  WARNING: Using placeholder Stripe key!`);
    console.log(`   Set your actual key: export STRIPE_SECRET_KEY=sk_test_...`);
  }
});

