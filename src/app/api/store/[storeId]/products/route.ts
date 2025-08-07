import { NextResponse } from "next/server";
import dbConnect from "@/lib/connection/dbConnect";
import ProductModel from "@/model/Product";
import StoreModel from "@/model/Store";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET(
  request: Request,
  { params }: { params: { storeId: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?._id) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  const { storeId } = await params;

  try {
    await dbConnect();

    const store = await StoreModel.findById(storeId);
    if (!store) {
      return NextResponse.json(
        { success: false, message: "Store not found" },
        { status: 404 }
      );
    }

    if (store.ownerId.toString() !== session.user._id) {
      return NextResponse.json(
        { success: false, message: 'Forbidden' },
        { status: 403 }
      );
    }

 const products = await ProductModel.find({ storeId }).sort({ createdAt: -1 }).lean()
const productsWithId = products.map(product => ({
  ...product,
  id: product._id.toString(), 
}))

return NextResponse.json({
  success: true,
  products: productsWithId
}, {status: 200});

  } catch (error) {
    console.error("Error fetching store products:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
