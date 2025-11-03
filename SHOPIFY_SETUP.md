# Shopify Integration Setup Guide

## Quick Setup

Your store is now configured to use Shopify's cart system instead of the custom checkout.

## Step 1: Get Product Variant IDs

You need to find the Variant IDs for your products in Shopify:

1. **Go to your Shopify Admin**: https://eatposana.com/admin
2. **Navigate to Products** and select each product
3. **Find the Variant ID**:
   - Option A: View the product page source code, search for `variant_id` or `variantId`
   - Option B: Use Shopify's GraphQL Admin API to fetch variant IDs
   - Option C: Check the product URL - sometimes variant IDs are visible
   - Option D: Install a browser extension like "Shopify Product & Collection Finder"

4. **For each product, find the 12-pack variant ID:**
   - Cinnavanilla 12-Pack
   - Matcha Latte 12-Pack  
   - Mango Coconut 12-Pack (if available)

## Step 2: Update shopify-config.js

Open `shopify-config.js` and add your variant IDs:

```javascript
const PRODUCT_VARIANTS = {
    'cinnavanilla': '12345678901234', // Replace with your actual variant ID
    'matcha': '12345678901235', // Replace with your actual variant ID
    'mango': '12345678901236' // Replace with your actual variant ID
};
```

## Step 3: Test the Integration

1. **Add items to cart** - Click "Add to Cart" buttons
2. **Items will be added to your Shopify cart**
3. **Cart badge** will show item count from Shopify
4. **"View Cart"** button redirects to `https://eatposana.com/cart`
5. **Checkout** happens on Shopify (your existing Shopify checkout)

## How It Works

- **Cart API**: Uses Shopify's public Cart API (no authentication needed)
- **Add to Cart**: Adds items directly to Shopify cart
- **Cart Badge**: Shows real-time cart count from Shopify
- **Checkout**: Uses your existing Shopify checkout page

## Alternative: Using Shopify Buy Button

If you prefer, you can also embed Shopify Buy Buttons which handle everything automatically. Just add the Buy Button code to your product cards instead.

## Troubleshooting

### "Variant ID not found" error
- Make sure you've added the variant IDs to `shopify-config.js`
- Verify the variant IDs are correct by checking in Shopify admin

### CORS errors
- Shopify Cart API should work from any domain
- If you see CORS errors, check that your store domain is correct

### Cart not updating
- The cart badge updates when items are added
- Try refreshing the page to see the latest cart count

## Next Steps

1. ✅ Get variant IDs from Shopify
2. ✅ Update `shopify-config.js` with your variant IDs
3. ✅ Test adding items to cart
4. ✅ Verify cart badge shows correct count
5. ✅ Test checkout flow on Shopify

Your store now uses Shopify for cart management and checkout! 🎉

