import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import stripe from '@/lib/stripe';
import OrderModel from '@/model/Order';
import CommissionModel from '@/model/Commission';
import StoreModel from '@/model/Store';
import StorePlanModel from '@/model/StorePlan';
import UserModel from '@/model/User';
import dbConnect from '@/lib/connection/dbConnect';

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
    await dbConnect();

    const body = await req.text();
    const headersList = await headers();
    const sig = headersList.get('stripe-signature');

    if (!sig) {
        return NextResponse.json(
            { success: false, message: 'No signature found' },
            { status: 400 }
        );
    }

    let event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return NextResponse.json(
            { success: false, message: 'Webhook signature verification failed' },
            { status: 400 }
        );
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed':
                await handleCheckoutCompleted(event.data.object);
                break;
            case 'payment_intent.succeeded':
                await handlePaymentSucceeded(event.data.object);
                break;
            case 'payment_intent.payment_failed':
                await handlePaymentFailed(event.data.object);
                break;
            case 'account.updated':
                await handleAccountUpdated(event.data.object);
                break;
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ success: true, received: true });
    } catch (error) {
        console.error('Error processing webhook:', error);
        return NextResponse.json(
            { success: false, message: 'Webhook processing failed' },
            { status: 500 }
        );
    }
}

async function handleCheckoutCompleted(session: any) {
    console.log('Processing checkout.session.completed:', session.id);

    // Find the order by session ID
    const order = await OrderModel.findOne({ stripeSessionId: session.id });
    if (!order) {
        console.error('Order not found for session:', session.id);
        return;
    }

    // Update order with payment intent ID
    order.stripePaymentIntentId = session.payment_intent;
    order.status = 'paid';
    await order.save();

    console.log('Order updated to paid:', order._id);
}

async function handlePaymentSucceeded(paymentIntent: any) {
    console.log('Processing payment_intent.succeeded:', paymentIntent.id);

    // Find the order by payment intent ID
    const order = await OrderModel.findOne({ stripePaymentIntentId: paymentIntent.id });
    if (!order) {
        console.error('Order not found for payment intent:', paymentIntent.id);
        return;
    }

    // Skip if commission already processed
    if (order.commissionProcessed) {
        console.log('Commission already processed for order:', order._id);
        return;
    }

    // Get store and plan information
    const store = await StoreModel.findById(order.storeId).populate('planId ownerId');
    if (!store) {
        console.error('Store not found for order:', order._id);
        return;
    }

    const plan = store.planId as any;
    const storeOwner = store.ownerId as any;

    // Calculate commission
    const grossAmount = order.totalPrice;
    const commissionPercentage = plan.commissionPercentage;
    const commissionAmount = Math.round((grossAmount * commissionPercentage) / 100);
    const netAmount = grossAmount - commissionAmount;

    // Create commission record
    const commission = new CommissionModel({
        orderId: order._id,
        storeId: store._id,
        storeOwnerId: storeOwner._id,
        planId: plan._id,
        grossAmount,
        commissionPercentage,
        commissionAmount,
        netAmount,
        status: 'completed', // Since Stripe already handled the transfer
        processedAt: new Date(),
    });

    await commission.save();

    // Update order
    order.commissionProcessed = true;
    order.commissionId = commission._id;
    await order.save();

    console.log('Commission processed for order:', order._id, 'Commission amount:', commissionAmount);
}

async function handlePaymentFailed(paymentIntent: any) {
    console.log('Processing payment_intent.payment_failed:', paymentIntent.id);

    // Find the order by payment intent ID
    const order = await OrderModel.findOne({ stripePaymentIntentId: paymentIntent.id });
    if (!order) {
        console.error('Order not found for payment intent:', paymentIntent.id);
        return;
    }

    // Update order status
    order.status = 'cancelled';
    await order.save();

    console.log('Order marked as cancelled:', order._id);
}

async function handleAccountUpdated(account: any) {
    console.log('Processing account.updated:', account.id);

    // Find user by Stripe account ID
    const user = await UserModel.findOne({ stripeAccountId: account.id });
    if (!user) {
        console.error('User not found for account:', account.id);
        return;
    }

    // Update user status based on account
    let status: 'pending' | 'active' | 'rejected' | 'restricted' = 'pending';
    let onboardingComplete = false;

    if (account.charges_enabled && account.payouts_enabled) {
        status = 'active';
        onboardingComplete = true;
    } else if (account.requirements?.disabled_reason) {
        status = 'restricted';
    }

    user.stripeAccountStatus = status;
    user.stripeOnboardingComplete = onboardingComplete;
    await user.save();

    console.log('User account status updated:', user._id, 'Status:', status);
}
