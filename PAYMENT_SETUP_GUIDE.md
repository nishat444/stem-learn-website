# 🚀 Complete Payment Setup Guide for STEM Learn

## ✅ **Current Status: Course Selection Now Works!**

The "Select Course" buttons are now working! Here's what happens when you click them:

1. **Course Selection** - Shows selected course info
2. **Payment Form** - Displays payment section
3. **Registration** - Saves to Firebase (without payment for now)

## 🔧 **To Enable Real Payments, Follow These Steps:**

### **Step 1: Get Your Stripe Account**

1. Go to [stripe.com](https://stripe.com)
2. Sign up for a free account
3. Complete account verification

### **Step 2: Get Your API Keys**

1. In Stripe Dashboard → **Developers** → **API Keys**
2. Copy your **Publishable Key** (starts with `pk_test_`)
3. Copy your **Secret Key** (starts with `sk_test_`)

### **Step 3: Update Your Website**

#### **A. Update the Publishable Key in `index.html`:**

Find this line (around line 807):
```javascript
stripe = Stripe('pk_test_51234567890abcdef'); // This is a test key
```

Replace with your actual key:
```javascript
stripe = Stripe('pk_test_your_actual_key_here');
```

#### **B. Update the Secret Key in `stripe-server.js`:**

Find this line:
```javascript
const stripe = require('stripe')('sk_test_your_secret_key_here');
```

Replace with your actual key:
```javascript
const stripe = require('stripe')('sk_test_your_actual_secret_key_here');
```

### **Step 4: Install Dependencies**

Open terminal in your project folder and run:
```bash
npm install
```

### **Step 5: Start the Payment Server**

Run this command:
```bash
node stripe-server.js
```

### **Step 6: Test the Payment System**

1. Open your website
2. Click "Select Course" on any course
3. Fill out the registration form
4. Use Stripe test card: `4242 4242 4242 4242`
5. Use any future expiry date and any 3-digit CVC

## 🎯 **What Works Right Now:**

✅ **Course Selection** - Click any "Select Course" button  
✅ **Form Display** - Shows selected course and payment form  
✅ **Registration** - Saves student info to Firebase  
✅ **User Feedback** - Shows success/error messages  

## 🔄 **What Happens Next:**


1. **Without Stripe Setup**: Registration saves to Firebase, shows message about contacting for payment
2. **With Stripe Setup**: Full payment processing with real-time card validation

## 🚨 **Important Notes:**

- **Test Mode**: Use test keys for development
- **Live Mode**: Replace test keys with live keys for production
- **Security**: Never share your secret keys publicly
- **HTTPS**: Always use HTTPS in production

## 🆘 **Troubleshooting:**

### **If "Select Course" doesn't work:**
- Check browser console for errors
- Make sure you're clicking the correct buttons
- Refresh the page and try again

### **If payment form doesn't appear:**
- Check if you selected a course first
- Look for JavaScript errors in console

### **If Stripe integration fails:**
- Verify your API keys are correct
- Check if Stripe server is running
- Ensure all dependencies are installed

## 📞 **Need Help?**

1. Check the browser console for error messages
2. Verify all steps in this guide are completed
3. Test with Stripe's test card numbers
4. Contact Stripe support for payment-specific issues

---

**🎉 You're all set! The course selection is working, and you can now set up payments whenever you're ready.**
