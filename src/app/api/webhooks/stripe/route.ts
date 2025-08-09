import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import dbConnect from "@/lib/connection/dbConnect";
import ProductModel from "@/model/Product";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature")!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Webhook signature verification failed" },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("Payment succeeded:", paymentIntent.id);
        break;
      
      case "payment_intent.payment_failed":
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        console.log("Payment failed:", failedPayment.id);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    await dbConnect();
    
    console.log("Processing completed checkout session:", session.id);
    
    // Extract order details from session metadata
    const customerName = session.metadata?.customerName;
    const items = session.metadata?.items ? JSON.parse(session.metadata.items) : [];
    
    // Here you would typically:
    // 1. Create an Order record in your database
    // 2. Update product inventory
    // 3. Send confirmation emails
    // 4. Notify store owners
    
    console.log("Order details:", {
      sessionId: session.id,
      customerName,
      customerEmail: session.customer_email,
      items,
      amount: session.amount_total,
    });
    
    // TODO: Implement order creation logic
    // const order = await OrderModel.create({
    //   sessionId: session.id,
    //   customerName,
    //   customerEmail: session.customer_email,
    //   items,
    //   total: session.amount_total! / 100, // Convert from cents
    //   status: 'paid'
    // });
    
  } catch (error) {
    console.error("Error processing checkout session:", error);
  }
}
