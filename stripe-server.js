const express = require('express');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_your_secret_key_here');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Create payment intent endpoint for registration fee
app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, course, monthlyPrice, studentName, grade, parentEmail, phone, message } = req.body;

    // Create payment intent for registration fee only
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // £10 registration fee in pence
      currency: currency,
      metadata: {
        course: course,
        monthlyPrice: monthlyPrice,
        studentName: studentName,
        grade: grade,
        parentEmail: parentEmail,
        phone: phone,
        message: message,
        paymentType: 'registration'
      },
      description: `STEM Learn - ${course} course registration fee`,
      // Add this to disable postal code requirement
      payment_method_options: {
      card: {
          request_three_d_secure: 'automatic'
      }
  }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create subscription for monthly payments
app.post('/create-subscription', async (req, res) => {
  try {
    const { course, monthlyPrice, cardholderName, email } = req.body;

    // Create a customer first
    const customer = await stripe.customers.create({
      name: cardholderName,
      email: email,
    });

    // Create a product for the course
    const product = await stripe.products.create({
      name: `STEM Learn - ${course}`,
      description: `Monthly subscription for ${course} course`,
    });

    // Create a price for the monthly subscription
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: monthlyPrice * 100, // Convert to pence
      currency: 'gbp',
      recurring: {
        interval: 'month',
      },
    });

    // Create the subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: price.id }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    res.json({
      subscriptionId: subscription.id,
      customerId: customer.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook endpoint for handling payment events
app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, 'wh_endpoint_secret_here'); // Replace with your webhook secret
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      // Here you can add logic to save the successful payment to your database
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Stripe server running on port ${PORT}`);
});