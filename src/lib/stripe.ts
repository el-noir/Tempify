import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-07-30.basil',
});

// Stripe Connect helper functions
export const stripeConnect = {
    // Create a Stripe Connect account for store owners
    async createAccount(email: string, country: string = 'US') {
        try {
            const account = await stripe.accounts.create({
                type: 'express',
                country,
                email,
                capabilities: {
                    card_payments: { requested: true },
                    transfers: { requested: true },
                },
                business_type: 'individual',
            });
            return account;
        } catch (error) {
            console.error('Error creating Stripe Connect account:', error);
            throw error;
        }
    },

    // Create an account link for onboarding
    async createAccountLink(accountId: string, refreshUrl: string, returnUrl: string) {
        try {
            const accountLink = await stripe.accountLinks.create({
                account: accountId,
                refresh_url: refreshUrl,
                return_url: returnUrl,
                type: 'account_onboarding',
            });
            return accountLink;
        } catch (error) {
            console.error('Error creating account link:', error);
            throw error;
        }
    },

    // Get account status
    async getAccount(accountId: string) {
        try {
            const account = await stripe.accounts.retrieve(accountId);
            return account;
        } catch (error) {
            console.error('Error retrieving account:', error);
            throw error;
        }
    },

    // Create a transfer to the connected account
    async createTransfer(amount: number, accountId: string, metadata?: Record<string, string>) {
        try {
            const transfer = await stripe.transfers.create({
                amount: Math.round(amount * 100), // Convert to cents
                currency: 'usd',
                destination: accountId,
                metadata,
            });
            return transfer;
        } catch (error) {
            console.error('Error creating transfer:', error);
            throw error;
        }
    },

    // Create a payment intent with application fee (commission)
    async createPaymentIntent(
        amount: number,
        applicationFeeAmount: number,
        connectedAccountId: string,
        metadata?: Record<string, string>
    ) {
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(amount * 100), // Convert to cents
                currency: 'usd',
                application_fee_amount: Math.round(applicationFeeAmount * 100),
                transfer_data: {
                    destination: connectedAccountId,
                },
                metadata,
            });
            return paymentIntent;
        } catch (error) {
            console.error('Error creating payment intent:', error);
            throw error;
        }
    },

    async createCheckoutSession(
        amount: number,
        applicationFeeAmount: number,
        connectedAccountId: string,
        successUrl: string,
        cancelUrl: string,
        metadata?: Record<string, string>
    ) {
        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: 'Store Purchase',
                            },
                            unit_amount: Math.round(amount * 100),
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: successUrl,
                cancel_url: cancelUrl,
                payment_intent_data: {
                    application_fee_amount: Math.round(applicationFeeAmount * 100),
                    transfer_data: {
                        destination: connectedAccountId,
                    },
                    metadata,
                },
                metadata,
            });
            return session;
        } catch (error) {
            console.error('Error creating checkout session:', error);
            throw error;
        }
    },
};

export default stripe;
