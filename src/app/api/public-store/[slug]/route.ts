import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/connection/dbConnect";
import StoreModel from "@/model/Store";
import ProductModel from "@/model/Product";

export async function GET(
  req: NextRequest,
  context: { params: { slug: string } }
) {
  try {
    await dbConnect();
    const { slug } = context.params;
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

    // Build aggregation pipeline for store with products
    const storePipeline = [
      {
        $match: {
          slug: slug,
          isActive: true,
          expiresAt: { $gt: new Date() }
        }
      },
      {
        $lookup: {
          from: 'storeplans',
          localField: 'planId',
          foreignField: '_id',
          as: 'plan'
        }
      },
      {
        $unwind: '$plan'
      },
      {
        $lookup: {
          from: 'users',
          localField: 'ownerId',
          foreignField: '_id',
          as: 'owner'
        }
      },
      {
        $unwind: '$owner'
      },
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          description: 1,
          isActive: 1,
          expiresAt: 1,
          createdAt: 1,
          updatedAt: 1,
          'plan.title': 1,
          'plan.durationHours': 1,
          'owner.username': 1,
          'owner.name': 1,
          'owner.email': 1
        }
      }
    ];

    // Build aggregation pipeline for products
    const productMatch: any = {
      storeId: { $in: [] } // Will be populated after finding store
    };

    if (search) {
      productMatch.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (minPrice || maxPrice) {
      productMatch.price = {};
      if (minPrice) productMatch.price.$gte = parseFloat(minPrice);
      if (maxPrice) productMatch.price.$lte = parseFloat(maxPrice);
    }

    const productPipeline = [
      { $match: productMatch },
      {
        $addFields: {
          id: { $toString: '$_id' }
        }
      },
      {
        $project: {
          _id: 1,
          id: 1,
          storeId: 1,
          name: 1,
          description: 1,
          price: 1,
          imageUrl: 1,
          quantityAvailable: 1,
          createdAt: 1,
          updatedAt: 1
        }
      },
      {
        $sort: {
          [sortBy]: (sortOrder === 'desc' ? -1 : 1) as 1 | -1
        }
      },
      {
        $facet: {
          products: [
            { $skip: skip },
            { $limit: limit }
          ],
          totalCount: [
            { $count: 'count' }
          ]
        }
      }
    ];

    // First, get the store
    const stores = await StoreModel.aggregate(storePipeline);
    
    if (stores.length === 0) {
      return NextResponse.json(
        { success: false, message: "Store not found or inactive" },
        { status: 404 }
      );
    }

    const store = stores[0];
    
    // Update product pipeline with store ID
    productPipeline[0].$match.storeId = { $in: [store._id] };
    
    // Get products with pagination
    const productResults = await ProductModel.aggregate(productPipeline);
    
    const products = productResults[0]?.products || [];
    const totalCount = productResults[0]?.totalCount[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      store: {
        ...store,
        id: store._id.toString()
      },
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
    console.error("Failed to fetch public store data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch store data" },
      { status: 500 }
    );
  }
}
