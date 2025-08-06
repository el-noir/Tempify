import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from 'mongoose'
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/connection/dbConnect";
import ProductModel from "@/model/Product";
import StoreModel from "@/model/Store";
import { success } from "zod";
import {updateSchema} from '@/lib/validations'
import {z} from 'zod'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await dbConnect();

    const productModelExists = mongoose.models.Product;
    
    const query = StoreModel.find({ ownerId: session.user._id })
      .populate("planId");

    if (productModelExists) {
      query.populate("products");
    }

    const stores = await query.lean();

    return NextResponse.json({
      success: true,
      stores: stores.map(store => ({
        ...store,
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

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
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
      { success: false, message: "Invalid input", errors:  errorTree },
      { status: 400 }
    );
  }

  try {
    await dbConnect()

    const store = await StoreModel.findById(params.id);

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
    if (description) store.description = description;

    await store.save();

    return NextResponse.json(
      { success: true, message: "Store updated", store },
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

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await dbConnect();

    const store = await StoreModel.findById(params.id);

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