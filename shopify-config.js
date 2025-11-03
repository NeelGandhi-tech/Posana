// Shopify Store Configuration
const SHOPIFY_CONFIG = {
    storeDomain: 'eatposana.com', // Your Shopify store domain
    // For Shopify Storefront API, you'll need an access token
    // Get it from: Shopify Admin > Apps > Manage private apps > Storefront API
    storefrontAccessToken: '', // Add your Storefront API access token here
    // Or use the Cart API (no token needed)
    useCartAPI: true, // Use Cart API (doesn't require API token)
};

// Shopify Cart API endpoints
const SHOPIFY_CART_API = {
    add: (storeDomain, variantId, quantity = 1) => {
        // Shopify Cart API - Add item
        return fetch(`https://${storeDomain}/cart/add.js`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: variantId,
                quantity: quantity
            })
        });
    },
    get: (storeDomain) => {
        // Get cart contents
        return fetch(`https://${storeDomain}/cart.js`)
            .then(res => res.json());
    },
    update: (storeDomain, itemId, quantity) => {
        // Update cart item quantity
        return fetch(`https://${storeDomain}/cart/update.js`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                updates: {
                    [itemId]: quantity
                }
            })
        });
    },
    change: (storeDomain, itemId, quantity) => {
        // Change cart item quantity
        return fetch(`https://${storeDomain}/cart/change.js`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: itemId,
                quantity: quantity
            })
        });
    },
    clear: (storeDomain) => {
        // Clear cart
        return fetch(`https://${storeDomain}/cart/clear.js`, {
            method: 'POST'
        });
    }
};

// Product Variant IDs (you'll need to get these from your Shopify store)
// To find variant IDs: Go to your product in Shopify, view source, or use the Admin API
const PRODUCT_VARIANTS = {
    'cinnavanilla': '', // Add your Cinnavanilla 12-pack variant ID here
    'matcha': '', // Add your Matcha Latte 12-pack variant ID here
    'mango': '' // Add your Mango Coconut variant ID here (if available)
};

// Helper function to get variant ID from product
function getVariantId(productId) {
    // If you don't have variant IDs, you can fetch them from your Shopify store
    // Or hardcode them after finding them in your Shopify admin
    return PRODUCT_VARIANTS[productId];
}

// Shopify Cart Helper Functions
const ShopifyCart = {
    // Add item to Shopify cart
    async addItem(variantId, quantity = 1) {
        try {
            const response = await SHOPIFY_CART_API.add(SHOPIFY_CONFIG.storeDomain, variantId, quantity);
            const data = await response.json();
            
            if (response.ok) {
                return { success: true, data };
            } else {
                throw new Error(data.description || 'Failed to add item to cart');
            }
        } catch (error) {
            console.error('Error adding to Shopify cart:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Get cart contents
    async getCart() {
        try {
            const cart = await SHOPIFY_CART_API.get(SHOPIFY_CONFIG.storeDomain);
            return { success: true, cart };
        } catch (error) {
            console.error('Error getting Shopify cart:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Update cart item
    async updateItem(itemId, quantity) {
        try {
            const response = await SHOPIFY_CART_API.change(SHOPIFY_CONFIG.storeDomain, itemId, quantity);
            const data = await response.json();
            
            if (response.ok) {
                return { success: true, data };
            } else {
                throw new Error(data.description || 'Failed to update cart');
            }
        } catch (error) {
            console.error('Error updating Shopify cart:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Get cart item count for badge
    async getItemCount() {
        try {
            const cart = await SHOPIFY_CART_API.get(SHOPIFY_CONFIG.storeDomain);
            return cart.item_count || 0;
        } catch (error) {
            console.error('Error getting cart count:', error);
            return 0;
        }
    },
    
    // Redirect to Shopify checkout
    redirectToCheckout() {
        window.location.href = `https://${SHOPIFY_CONFIG.storeDomain}/checkout`;
    },
    
    // Redirect to Shopify cart page
    redirectToCart() {
        window.location.href = `https://${SHOPIFY_CONFIG.storeDomain}/cart`;
    }
};

