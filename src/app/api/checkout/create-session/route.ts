import { NextRequest, NextResponse } from 'next/server';
import { stripeConnect } from '@/lib/stripe';
import StoreModel from '@/model/Store';
import StorePlanModel from '@/model/StorePlan';
import ProductModel from '@/model/Product';
import UserModel from '@/model/User';
import OrderModel from '@/model/Order';
import dbConnect from '@/lib/connection/dbConnect';

export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const { productId, quantity = 1, buyerEmail, buyerName } = await req.json();

        if (!productId || !buyerEmail) {
            return NextResponse.json(
                { success: false, message: 'Product ID and buyer email are required' },
                { status: 400 }
            );
        }

        // Find the product and populate store and plan
        const product = await ProductModel.findById(productId);
        if (!product) {
            return NextResponse.json(
                { success: false, message: 'Product not found' },
                { status: 404 }
            );
        }

        // Find the store and populate plan
        const store = await StoreModel.findById(product.storeId).populate('planId');
        if (!store || !store.isActive) {
            return NextResponse.json(
                { success: false, message: 'Store not found or inactive' },
                { status: 404 }
            );
        }

        // Check if store has expired
        if (store.expiresAt && new Date() > store.expiresAt) {
            return NextResponse.json(
                { success: false, message: 'Store has expired' },
                { status: 400 }
            );
        }

        // Find the store owner
        const storeOwner = await UserModel.findById(store.ownerId);
        if (!storeOwner || !storeOwner.stripeAccountId || !storeOwner.stripeOnboardingComplete) {
            return NextResponse.json(
                { success: false, message: 'Store owner Stripe account not set up' },
                { status: 400 }
            );
        }

        const plan = store.planId as any; // Since it's populated
        const totalAmount = product.price * quantity;
        const commissionAmount = Math.round((totalAmount * plan.commissionPercentage) / 100);
        const netAmount = totalAmount - commissionAmount;

        // Create order record
        const order = new OrderModel({
            storeId: store._id,
            productId: product._id,
            buyerEmail,
            buyerName,
            quantity,
            totalPrice: totalAmount,
            stripeSessionId: '', // Will be updated after session creation
            status: 'pending',
            commissionProcessed: false,
        });

        // Create Stripe checkout session with application fee
        const successUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
        const cancelUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`;

        const session = await stripeConnect.createCheckoutSession(
            totalAmount,
            commissionAmount,
            storeOwner.stripeAccountId,
            successUrl,
            cancelUrl,
            {
                orderId: String(order._id),
                storeId: String(store._id),
                productId: String(product._id),
                commissionAmount: commissionAmount.toString(),
            }
        );

        // Update order with session ID
        order.stripeSessionId = session.id;
        await order.save();

        return NextResponse.json({
            success: true,
            sessionId: session.id,
            sessionUrl: session.url,
            orderId: order._id,
            totalAmount,
            commissionAmount,
            netAmount,
        });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
