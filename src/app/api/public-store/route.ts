import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/connection/dbConnect";
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
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build aggregation pipeline
    const pipeline: any[] = [
      {
        $match: {
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
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'storeId',
          as: 'products'
        }
      },
      {
        $addFields: {
          productCount: { $size: '$products' },
          totalValue: {
            $sum: '$products.price'
          }
        }
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
          productCount: 1,
          totalValue: 1,
          'plan.title': 1,
          'plan.durationHours': 1,
          'owner.username': 1,
          'owner.name': 1
        }
      }
    ];

    // Add search filter if provided
    if (search) {
      pipeline.unshift({
        $match: {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { slug: { $regex: search, $options: 'i' } }
          ]
        } as any
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
        stores: [
          { $skip: skip },
          { $limit: limit }
        ],
        totalCount: [
          { $count: 'count' }
        ]
      } as any
    });

    const results = await StoreModel.aggregate(pipeline as any);
    
    const stores = results[0]?.stores || [];
    const totalCount = results[0]?.totalCount[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      stores: stores.map((store: any) => ({
        ...store,
        id: store._id.toString()
      })),
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
    console.error("Failed to fetch public stores:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch stores" },
      { status: 500 }
    );
  }
}
