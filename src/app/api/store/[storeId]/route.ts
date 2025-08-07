import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from 'mongoose'
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/connection/dbConnect";
import StoreModel from "@/model/Store";
import ProductModel from "@/model/Product";
import {updateSchema} from '@/lib/validations'
import {success, z} from 'zod'

export async function GET(  req: NextRequest,
  context: { params: { storeId: string } }){
    const session = await getServerSession(authOptions)

    if(!session || !session.user){
        return NextResponse.json({
            success: false,
            message: "Unauthorized"
        },{status: 401})
    }
    
    try {
      await dbConnect()
        const store = await StoreModel.findById(params.id).populate("planId").populate("products")

        if(!store){
            return NextResponse.json({
                success: false,
                message: "Store not found"
            }, {status: 404})
        }

        if(store.ownerId.toString() !== session.user._id){
               return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 })
        }

        return NextResponse.json({success: true, store}, {status:201})
    
    } catch (error) {
           console.error("Failed to fetch store data:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch store data" },
      { status: 500 }
    )
    }

}



export async function PATCH(  req: NextRequest,
  context: { params: { storeId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    const errorTree = z.treeifyError(parsed.error);
    return NextResponse.json(
      { success: false, message: "Invalid input", errors: errorTree },
      { status: 400 }
    );
  }

  try {
    await dbConnect()
    
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

    const { name, description } = parsed.data;
    if (name) store.name = name;
    if (description !== undefined) store.description = description;

    await store.save();

    return NextResponse.json(
      { 
        success: true, 
        message: "Store updated", 
        store: {
          ...store.toObject(),
          id: store._id.toString()
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: { storeId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { storeId } = context.params;
  console.log("Deleting store with ID:", storeId);

  try {
    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(storeId)) {
      return NextResponse.json({
        success: false,
        message: "Invalid store ID format",
      }, { status: 400 });
    }

    const store = await StoreModel.findById(storeId);

    if (!store) {
      return NextResponse.json({
        success: false,
        message: "Store not found",
      }, { status: 404 });
    }

    if (store.ownerId.toString() !== session.user._id) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    // 1. Delete all products belonging to the store
    await ProductModel.deleteMany({ storeId: store._id });

    // 2. Delete the store itself
    await store.deleteOne(); // or StoreModel.findByIdAndDelete(storeId)

    return NextResponse.json(
      { success: true, message: "Store and associated products deleted successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error deleting store and products:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}