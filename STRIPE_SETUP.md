# Stripe Payment Integration Setup

This guide will help you set up Stripe payment processing for your STEM Learn website.

## Prerequisites

1. A Stripe account (create one at https://stripe.com)
2. Node.js installed on your server
3. Your website files

## Setup Steps

### 1. Get Your Stripe Keys

1. Log in to your Stripe Dashboard
2. Go to Developers > API Keys
3. Copy your **Publishable Key** (starts with `pk_test_` for test mode)
4. Copy your **Secret Key** (starts with `sk_test_` for test mode)

### 2. Update Configuration Files

#### Update `index.html`:
Replace `pk_test_your_publishable_key_here` with your actual publishable key:
```javascript
const stripe = Stripe('pk_test_your_actual_publishable_key_here');
```

#### Update `stripe-server.js`:
Replace `sk_test_your_secret_key_here` with your actual secret key:
```javascript
const stripe = require('stripe')('sk_test_your_actual_secret_key_here');
```

### 3. Install Dependencies

Run the following command in your project directory:
```bash
npm install
```

### 4. Set Up Webhook (Optional but Recommended)

1. In your Stripe Dashboard, go to Developers > Webhooks
2. Click "Add endpoint"
3. Set the endpoint URL to: `https://yourdomain.com/webhook`
4. Select events: `payment_intent.succeeded` and `payment_intent.payment_failed`
5. Copy the webhook signing secret
6. Update `stripe-server.js` with your webhook secret:
```javascript
event = stripe.webhooks.constructEvent(req.body, sig, 'whsec_your_webhook_secret_here');
```

### 5. Start the Server

Run the Stripe server:
```bash
node stripe-server.js
```

The server will run on port 3000 by default.

### 6. Test the Integration

1. Open your website
2. Select a course from the pricing section
3. Fill out the registration form
4. Use Stripe's test card numbers:
   - **Success**: 4242 4242 4242 4242
   - **Decline**: 4000 0000 0000 0002
   - Use any future expiry date and any 3-digit CVC

## Course Pricing

The current pricing structure is:
- **Scratch Juniors**: £25/month
- **Young Coders**: £45/month  
- **GCSE Prep**: £60/month

## Security Notes

1. **Never** commit your secret keys to version control
2. Use environment variables for production:
   ```bash
   export STRIPE_SECRET_KEY=sk_live_your_live_secret_key
   export STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
   ```
3. Always use HTTPS in production
4. Validate webhook signatures to ensure requests are from Stripe

## Going Live

When ready for production:
1. Replace test keys with live keys
2. Update the Stripe configuration in both files
3. Set up live webhooks
4. Test thoroughly with real payment methods

## Support

For Stripe-specific issues, consult the [Stripe Documentation](https://stripe.com/docs) or contact Stripe Support.

For website integration issues, check the browser console for error messages.
