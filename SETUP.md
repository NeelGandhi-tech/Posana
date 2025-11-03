# Stripe Checkout Setup Guide

## Quick Start (5 minutes)

### 1. Get Your Stripe Keys

1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy your **Secret Key** (starts with `sk_test_...`)
3. Copy your **Publishable Key** (starts with `pk_test_...`)

### 2. Set Your Stripe Secret Key

**Option A: Environment Variable (Recommended)**
```bash
export STRIPE_SECRET_KEY=sk_test_your_actual_key_here
```

**Option B: Edit server.js**
Replace line 2 in `server.js`:
```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_your_actual_key_here');
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start the Server
```bash
npm start
```

### 5. Test It!
1. Open http://localhost:3000
2. Add items to cart
3. Go to checkout
4. Fill out the form
5. Click "Complete Order"
6. You'll be redirected to Stripe Checkout!

## Testing with Stripe

### Test Card Numbers
- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- Use any future expiry date, any 3-digit CVC, any ZIP

### Test Payment Flow
1. Complete checkout form
2. Redirect to Stripe Checkout page
3. Use test card: `4242 4242 4242 4242`
4. After payment, redirected to success page
5. Cart is automatically cleared

## Features Included

✅ **Cart Tracking** - Items stored in localStorage
✅ **Stripe Checkout** - Secure payment processing
✅ **Shipping Options** - Standard ($5.99) and Express ($12.99)
✅ **Free Shipping** - Automatic for orders over $30
✅ **Success Page** - Order confirmation with details
✅ **Error Handling** - Clear error messages

## Production Deployment

### Before Going Live:
1. Switch to **live** Stripe keys (not test keys)
2. Update `success_url` and `cancel_url` in server.js to your domain
3. Set up webhook endpoints for payment events
4. Test thoroughly with small amounts first

### Environment Variables for Production:
```bash
STRIPE_SECRET_KEY=sk_live_your_live_key_here
PORT=3000
NODE_ENV=production
```

## Troubleshooting

### "Failed to create checkout session"
- Check that your Stripe secret key is correct
- Make sure you're using test keys in test mode
- Check server console for detailed error messages

### "Cart is empty"
- Make sure items are being added to localStorage
- Check browser console for cart errors
- Verify script.js is loading

### Can't connect to backend
- Make sure server is running: `npm start`
- Check that port 3000 is not in use
- Verify CORS is enabled (it is by default)

## Need Help?

- Stripe Docs: https://stripe.com/docs/checkout
- Test your integration: https://dashboard.stripe.com/test/payments

