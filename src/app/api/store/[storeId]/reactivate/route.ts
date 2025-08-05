import { getServerSession } from "next-auth";
import { AuthOptions } from "next-auth";
import dbConnect from "@/lib/connection/dbConnect";
import StoreModel from "@/model/Store";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import StorePlanModel from "@/model/StorePlan";

export async function PATCH(req: NextRequest, {params}: {params: {id: string}}) {
    const session = await getServerSession(authOptions)

    if(!session?.user){
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const {planId} = await req.json()
    if(!planId){
          return NextResponse.json({ success: false, message: "Plan ID is required" }, { status: 400 });
    }
    try {
        await dbConnect()
            const store = await StoreModel.findById(params.id)

      if (!store) {
    return NextResponse.json({ success: false, message: "Store not found" }, { status: 404 })
  }

    if (store.ownerId.toString() !== session.user._id) {
    return NextResponse.json({ success: false, message: "Forbidden: Not your store" }, { status: 403 })
  }

  if (store.isActive) {
    return NextResponse.json({ success: false, message: "Store is already active" }, { status: 400 })
  }
      const plan = await StorePlanModel.findById(planId);
    if (!plan) {
      return NextResponse.json({ success: false, message: "Invalid store plan" }, { status: 404 });
    }
    const newExpiry = new Date(Date.now() + plan.durationHours * 60 * 60 * 1000);

    store.isActive = true;
    store.expiresAt = newExpiry;
    store.planId = planId;

  await store.save()

return NextResponse.json({
  success: true,
  message: "Store reactivated successfully",
  store,
});
 
    } catch (error) {
           console.error("Store reactivation error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to reactivate store" },
      { status: 500 }
    ); 
    }
}
