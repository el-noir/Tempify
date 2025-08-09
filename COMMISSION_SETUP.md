# Commission-Based Store System with Stripe Connect

This guide explains how to implement and use the commission-based system for your Tempify marketplace.

## Overview

The system automatically deducts a commission from each sale and transfers the remaining amount to the store owner's Stripe Connect account. Here's how it works:

1. **Store Owner Setup**: Users must complete Stripe Connect onboarding before creating stores
2. **Commission Calculation**: When a sale occurs, commission is calculated based on the store plan's `commissionPercentage`
3. **Automatic Transfers**: Stripe automatically handles the commission split and transfers the net amount to the store owner

## Architecture Components

### 1. Database Models

#### Updated User Model
- `stripeAccountId`: Stripe Connect account ID
- `stripeAccountStatus`: Account status (pending, active, rejected, restricted)
- `stripeOnboardingComplete`: Whether onboarding is complete

#### Commission Model
- Tracks all commission transactions
- Links orders to commission calculations
- Stores transfer information

#### Updated Order Model
- `stripePaymentIntentId`: Links to Stripe payment
- `commissionProcessed`: Tracks if commission was calculated
- `commissionId`: Reference to commission record

### 2. API Endpoints

#### Stripe Connect Management
- `POST /api/stripe/connect/create-account` - Create Stripe Connect account
- `POST /api/stripe/connect/onboard` - Generate onboarding link
- `GET /api/stripe/connect/status` - Check account status

#### Checkout & Payments
- `POST /api/checkout/create-session` - Create checkout with commission
- `POST /api/stripe/webhook` - Handle Stripe webhooks

#### Analytics
- `GET /api/commissions/analytics` - Commission analytics and reporting

## Setup Instructions

### 1. Install Dependencies

```bash
npm install stripe @stripe/stripe-js
```

### 2. Environment Variables

Add these to your `.env.local`:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# App URLs
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Stripe Webhook Setup

1. Go to your Stripe Dashboard → Webhooks
2. Create a new webhook endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Select these events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `account.updated`
4. Copy the webhook secret to your environment variables

### 4. Database Migration

The models have been updated to support commission tracking. Make sure to update your database schema if you have existing data.

## Usage Flow

### For Store Owners

1. **Complete Stripe Connect Onboarding**:
   ```javascript
   const { createAccount, createOnboardingLink } = useStripeConnect();
   
   // Create account
   await createAccount('US');
   
   // Generate onboarding link
   const { url } = await createOnboardingLink(
     'https://yourapp.com/dashboard/stripe/return',
     'https://yourapp.com/dashboard/stripe/refresh'
   );
   
   // Redirect user to onboarding
   window.location.href = url;
   ```

2. **Create Store**: Only after completing Stripe onboarding
3. **Receive Payments**: Automatic commission deduction and transfer

### For Platform (You)

1. **Set Commission Rates**: Configure `commissionPercentage` in StorePlan model
2. **Monitor Commissions**: Use the analytics API to track earnings
3. **Handle Disputes**: Access commission records for dispute resolution

## Commission Calculation Example

```javascript
// Example: Product costs $100, commission rate is 15%
const productPrice = 100;
const commissionRate = 15; // from StorePlan
const commissionAmount = (productPrice * commissionRate) / 100; // $15
const storeOwnerReceives = productPrice - commissionAmount; // $85
```

## Integration with Frontend

### 1. Stripe Connect Component

```tsx
import { useStripeConnect } from '@/hooks/useStripeConnect';

export function StripeConnectSetup() {
  const { status, loading, createAccount, createOnboardingLink } = useStripeConnect();

  const handleSetup = async () => {
    if (!status?.accountId) {
      await createAccount();
    }
    
    const { url } = await createOnboardingLink(
      `${window.location.origin}/dashboard/stripe/return`,
      `${window.location.origin}/dashboard/stripe/refresh`
    );
    
    window.location.href = url;
  };

  if (status?.onboardingComplete) {
    return <div>✅ Stripe account active</div>;
  }

  return (
    <button onClick={handleSetup} disabled={loading}>
      {loading ? 'Setting up...' : 'Setup Payments'}
    </button>
  );
}
```

### 2. Checkout Integration

```tsx
import { loadStripe } from '@stripe/stripe-js';

const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

async function handleCheckout(productId: string, buyerEmail: string) {
  const response = await fetch('/api/checkout/create-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, buyerEmail })
  });
  
  const { sessionId } = await response.json();
  const stripeInstance = await stripe;
  await stripeInstance?.redirectToCheckout({ sessionId });
}
```

## Testing

### 1. Use Stripe Test Mode
- Use test API keys during development
- Test with Stripe's test card numbers
- Verify webhook events in Stripe Dashboard

### 2. Test Scenarios
- Complete store owner onboarding
- Process test payments
- Verify commission calculations
- Test webhook handling

## Security Considerations

1. **Webhook Verification**: Always verify webhook signatures
2. **Account Validation**: Check Stripe account status before allowing store creation
3. **Commission Integrity**: Use database transactions for commission processing
4. **API Authentication**: Secure all commission-related endpoints

## Monitoring & Analytics

The system provides comprehensive analytics:

- **Total Commissions**: Track platform earnings
- **Commission Rates**: Monitor average commission percentages
- **Store Performance**: See which stores generate most commissions
- **Payment Status**: Track successful vs failed payments

Access analytics via:
```javascript
const analytics = await fetch('/api/commissions/analytics?period=30');
```

## Troubleshooting

### Common Issues

1. **Store Creation Blocked**: User hasn't completed Stripe onboarding
2. **Commission Not Processed**: Check webhook configuration
3. **Transfer Failed**: Verify store owner's Stripe account status
4. **Webhook Signature Verification Failed**: Check webhook secret

### Debug Steps

1. Check Stripe Dashboard for webhook delivery status
2. Review server logs for commission processing errors
3. Verify environment variables are set correctly
4. Test with Stripe CLI for local webhook testing

## Next Steps

1. Implement commission analytics dashboard
2. Add commission rate management for admins
3. Create dispute resolution system
4. Add multi-currency support
5. Implement commission rate tiers based on volume

## Support

For issues with Stripe integration:
- Check Stripe Dashboard logs
- Review webhook event history
- Contact Stripe support for account issues

For commission calculation issues:
- Check commission model calculations
- Verify store plan commission rates
- Review order processing logs
