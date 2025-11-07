# Posana Website

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Stripe

1. Get your Stripe API keys from: https://dashboard.stripe.com/test/apikeys
2. Copy `.env.example` to `.env`
3. Add your Stripe secret key to `.env`:

```
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
```

### 3. Start the Server

```bash
npm start
```

The server will run on `http://localhost:3000`

### 4. Test the Checkout

1. Go to the shop page
2. Add items to cart
3. Click "View Cart" or go to checkout
4. Fill out the form
5. Click "Complete Order"
6. You'll be redirected to Stripe Checkout

## File Structure

- `server.js` - Express backend server
- `checkout.html` - Checkout page
- `checkout-success.html` - Success page after payment
- `index.html` - Main shop page
- `script.js` - Frontend cart functionality
- `styles.css` - Styling

## API Endpoints

- `POST /create-checkout-session` - Creates a Stripe Checkout session
- `GET /verify-session/:sessionId` - Verifies a checkout session
- `GET /health` - Health check endpoint

## Notes

- Make sure to use Stripe **test** keys for development
- Replace test keys with **live** keys when going to production
- The server serves static files from the current directory




