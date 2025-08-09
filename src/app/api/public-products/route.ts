import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/connection/dbConnect";
import ProductModel from "@/model/Product";
import StoreModel from "@/model/Store";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;
    
    // Search and filter parameters
    const search = searchParams.get('search') || '';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build aggregation pipeline
    const pipeline: any[] = [
      // First, get all active stores
      {
        $lookup: {
          from: 'stores',
          localField: 'storeId',
          foreignField: '_id',
          as: 'store'
        }
      },
      {
        $unwind: '$store'
      },
      // Filter for active stores only
      {
        $match: {
          'store.isActive': true,
          'store.expiresAt': { $gt: new Date() }
        }
      },
      // Add store information to products
      {
        $addFields: {
          id: { $toString: '$_id' },
          storeName: '$store.name',
          storeSlug: '$store.slug',
          storeId: { $toString: '$store._id' }
        }
      },
      {
        $project: {
          _id: 1,
          id: 1,
          name: 1,
          description: 1,
          price: 1,
          imageUrl: 1,
          quantityAvailable: 1,
          createdAt: 1,
          updatedAt: 1,
          storeName: 1,
          storeSlug: 1,
          storeId: 1
        }
      }
    ];

    // Add search filter if provided
    if (search) {
      pipeline.unshift({
        $match: {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
          ]
        } as any
      });
    }

    // Add price filter if provided
    if (minPrice || maxPrice) {
      const priceMatch: any = {};
      if (minPrice) priceMatch.$gte = parseFloat(minPrice);
      if (maxPrice) priceMatch.$lte = parseFloat(maxPrice);
      
      pipeline.unshift({
        $match: { price: priceMatch } as any
      });
    }

    // Add sorting
    pipeline.push({
      $sort: {
        [sortBy]: (sortOrder === 'desc' ? -1 : 1) as 1 | -1
      } as any
    });

    // Add pagination with facet to get both results and total count
    pipeline.push({
      $facet: {
        products: [
          { $skip: skip },
          { $limit: limit }
        ],
        totalCount: [
          { $count: 'count' }
        ]
      } as any
    });

    const results = await ProductModel.aggregate(pipeline as any);
    
    const products = results[0]?.products || [];
    const totalCount = results[0]?.totalCount[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error("Failed to fetch public products:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
