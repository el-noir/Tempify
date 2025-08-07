import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from 'mongoose'
import { authOptions } from "../../../auth/[...nextauth]/options";
import dbConnect from "@/lib/connection/dbConnect";
import StoreModel from "@/model/Store";
import {updateSchema} from '@/lib/validations'

export async function GET(req: NextRequest, { params }: { params: { storeId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  console.log("Deleting store with ID:", params.storeId);

  try {
    await dbConnect();
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(params.storeId)) {
      return NextResponse.json(
        { success: false, message: "Invalid store ID format" },
        { status: 400 }
      );
    }
    
    const store = await StoreModel.findById(params.storeId);
    if (!store) {
      return NextResponse.json(
        { success: false, message: "Store not found" },
        { status: 404 }
      );
    }

    if (store.ownerId.toString() !== session.user._id) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    // Soft delete - set isActive to false
    store.isActive = false;
    await store.save();

    return NextResponse.json(
      { success: true, message: "Store deleted (soft)" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Store deletion error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
