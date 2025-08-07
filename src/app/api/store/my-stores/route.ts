import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from 'mongoose'
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/connection/dbConnect";
import StorePlanModel from "@/model/StorePlan";
import StoreModel from "@/model/Store";
import type { StoreResponse } from "@/types/Store";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  console.log("/api/store/my-stores --- Api Hit")

  try {
    await dbConnect();
    const productModelExists = mongoose.models.Product;
        
    const query = StoreModel.find({ ownerId: session.user._id })
      .populate("planId");

    if (productModelExists) {
      query.populate("products");
    }
    console.log('Registered Models:', mongoose.modelNames())


    const stores = await query.lean() as StoreResponse[];

    return NextResponse.json({
      success: true,
      stores: stores.map(store => ({
        ...store,
        id: store._id.toString(), // Properly convert ObjectId to string
        ownerId: store.ownerId.toString(),
        planId: typeof store.planId === 'object' && store.planId._id 
          ? store.planId._id.toString() 
          : store.planId.toString(),
        products: store.products || []
      })),
    }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch stores:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch stores" },
      { status: 500 }
    );
  }
}
