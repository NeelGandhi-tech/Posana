# Quick Stripe Setup Guide

## Option 1: Use Stripe Test Keys (FREE - Recommended)

1. **Sign up for Stripe** (if you don't have an account):
   - Go to https://dashboard.stripe.com/register
   - It's FREE for testing!

2. **Get your test API keys**:
   - Go to https://dashboard.stripe.com/test/apikeys
   - Copy your **Publishable key** (starts with `pk_test_...`)
   - Copy your **Secret key** (starts with `sk_test_...`)

3. **Set your secret key** (in terminal):
   ```bash
   export STRIPE_SECRET_KEY=sk_test_your_actual_key_here
   ```

4. **Update checkout.html** with your publishable key:
   - Open `checkout.html`
   - Find line ~496: `const stripeKey = 'pk_test_...';`
   - Replace with your actual publishable key

5. **Restart the server**:
   ```bash
   # Stop current server (Ctrl+C)
   node server.js
   ```

## Option 2: Use Demo Mode (No Stripe Account Needed)

If you just want to see how it works without setting up Stripe:

The checkout page will show a demo version. You can still test the flow, but it won't process real payments.

## Testing the Checkout

1. Go to http://localhost:3000
2. Add items to cart
3. Click "View Cart"
4. Fill out the form
5. Click "Complete Order"
6. You'll be redirected to Stripe Checkout!

## Stripe Test Cards

Use these cards in test mode:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Any future expiry date (e.g., 12/25)
- Any 3-digit CVC (e.g., 123)
- Any ZIP code (e.g., 12345)

