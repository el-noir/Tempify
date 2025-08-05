import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/connection/dbConnect";
import { getServerSession } from "next-auth";
import StoreModel from "@/model/Store";
import ProductModel from "@/model/Product";
import { addProductSchema } from "@/lib/validations";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { success } from "zod";


export async function POST(req: NextRequest, {params}: {params:{storeId: string}}){
    const session = await getServerSession(authOptions)
    if(!session || !session.user){
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const storeId = params.storeId;

    if(!storeId || storeId.length !==24){
            return NextResponse.json({ success: false, message: "Invalid store ID" }, { status: 400 });
    }

    const body = await req.json();
    const parse = addProductSchema.safeParse(body);

    if (!parse.success) {
      return NextResponse.json({ success: false, message: "Invalid product data", errors: parse.error.format() }, { status: 400 });
    }

    try {
        await dbConnect()

        const store = await StoreModel.findById(storeId)
        if(!store){
          return NextResponse.json({
            success: false,
            message: "Store not found"
          }, {status: 404})
        }

        
    if (store.ownerId.toString() !== session.user._id) {
      return NextResponse.json({ success: false, message: "You are not the owner of this store" }, { status: 403 });
    }

    const {name, description, price, imageUrl, quantityAvailable} = parse.data;

    const product = new ProductModel({
        storeId,
        name,
        description,
        price,
        imageUrl,
        quantityAvailable
    })

    await product.save()

    // add product to store
    store.products.push(product._id)
    await store.save()

    return NextResponse.json({
        success: true,
        message: "Product created succesfully",
        product
    }, {status: 201})
    
    } catch (error) {
            console.error("Error creating product:", error);
    return NextResponse.json({
      success: false,
      message: "Internal Server Error",
    }, { status: 500 });
    }
}

