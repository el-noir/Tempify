import { NextResponse } from "next/server";
import dbConnect from "@/lib/connection/dbConnect";
import ProductModel from "@/model/Product";
import type {Store} from '@/model/Store'
import { getServerSession } from "next-auth";
import mongoose, { mongo } from 'mongoose'
import { authOptions } from "../../auth/[...nextauth]/options";
import StoreModel from "@/model/Store";
import { success } from "zod";
import { updateProductSchema } from "@/lib/validations";

export async function GET(_: Request, { params }: { params: { productId: string } }){
  const { productId } = params;

  try {
    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ success: false, message: "Invalid product ID" }, { status: 400 });
    }

    const product = await ProductModel.findById(productId).populate('storeId');

    const store = product?.storeId as Store

    if (!product || !store?.isActive) {
      return NextResponse.json({ success: false, message: "Product or store not found or inactive" }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      product,
      store: {
        name: store.name,
        slug: store.slug
      }
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: { params: { productId: string } }){
    const session = await getServerSession(authOptions)
    const {productId} = params

   if (!session?.user?._id) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
   }

   try{
    await dbConnect()
    const product = await ProductModel.findById(productId).populate('storeId');
    const store = product?.storeId as Store

    if (!product || !store?.isActive) {
      return NextResponse.json({ success: false, message: "Product or store not found or inactive" }, { status: 403 });
    }

    if(!store || store.ownerId.toString() !== session.user._id){
        return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })  
    }

    const body = await request.json()
    const parsed = updateProductSchema.safeParse(body);

    if(!parsed.success){
        return NextResponse.json({
            success: false,
            message: "Invalid input",
            errors: parsed.error.format()
        }, {status: 400})
    }
    Object.assign(product, parsed.data)
    await product.save()

    return NextResponse.json({
        success: true,
        product
    }, {status: 200})
    
   } catch(error){
      console.error("Error updating product:", error);
  return NextResponse.json(
    { success: false, message: "Internal Server Error" },
    { status: 500 }
  );
   }
}

export async function DELETE(_: Request, { params }: { params: { productId: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?._id) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const { productId } = params;

  try {
    await dbConnect();

    const product = await ProductModel.findById(productId).populate('storeId');

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    const store = product.storeId as Store;

    if (!store?.isActive) {
      return NextResponse.json({ success: false, message: "Store is inactive" }, { status: 403 });
    }

    if (store.ownerId.toString() !== session.user._id) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const productId = product._id as mongoose.Types.ObjectId;

    await ProductModel.findByIdAndDelete(productId);

    store.products = store.products.filter(
      (prodId) => prodId.toString() !== productId.toString()
    );
    await store.save();

    return NextResponse.json({ success: true, message: 'Product deleted' });

  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
