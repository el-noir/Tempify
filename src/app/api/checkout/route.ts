import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import dbConnect from "@/lib/connection/dbConnect";
import ProductModel from "@/model/Product";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { items, customerEmail, customerName } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "No items in cart" },
        { status: 400 }
      );
    }

    // Validate items and get product details
    const productIds = items.map((item: any) => item.product.id);
    const products = await ProductModel.find({ _id: { $in: productIds } });

    if (products.length !== items.length) {
      return NextResponse.json(
        { success: false, message: "Some products not found" },
        { status: 400 }
      );
    }

    // Create line items for Stripe
    const lineItems = items.map((item: any) => {
      const product = products.find((p: any) => p._id.toString() === item.product.id);
      if (!product) {
        throw new Error(`Product ${item.product.id} not found`);
      }

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: product.description,
            images: product.imageUrl ? [product.imageUrl] : [],
          },
          unit_amount: Math.round(product.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      };
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/checkout/cancel`,
      customer_email: customerEmail,
      metadata: {
        customerName,
        items: JSON.stringify(items.map((item: any) => ({
          productId: item.product.id,
          quantity: item.quantity,
          storeId: item.product.storeId
        }))),
      },
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });

  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
