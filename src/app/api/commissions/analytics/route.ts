import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import CommissionModel from '@/model/Commission';
import dbConnect from '@/lib/connection/dbConnect';

export async function GET(req: NextRequest) {
    await dbConnect();

    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);
        const period = searchParams.get('period') || '30'; // days
        const storeId = searchParams.get('storeId');

        // Calculate date range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(period));

        // Build query
        let query: any = {
            createdAt: { $gte: startDate, $lte: endDate }
        };

        // If user is not admin, only show their commissions
        if (session.user.role !== 'admin') {
            query.storeOwnerId = session.user._id;
        }

        // Filter by store if specified
        if (storeId) {
            query.storeId = storeId;
        }

        // Get commission analytics
        const [totalStats, dailyStats, statusStats] = await Promise.all([
            // Total statistics
            CommissionModel.aggregate([
                { $match: query },
                {
                    $group: {
                        _id: null,
                        totalCommissions: { $sum: '$commissionAmount' },
                        totalGross: { $sum: '$grossAmount' },
                        totalNet: { $sum: '$netAmount' },
                        count: { $sum: 1 },
                        avgCommissionRate: { $avg: '$commissionPercentage' }
                    }
                }
            ]),

            // Daily breakdown
            CommissionModel.aggregate([
                { $match: query },
                {
                    $group: {
                        _id: {
                            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
                        },
                        commissions: { $sum: '$commissionAmount' },
                        gross: { $sum: '$grossAmount' },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { '_id.date': 1 } }
            ]),

            // Status breakdown
            CommissionModel.aggregate([
                { $match: query },
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                        amount: { $sum: '$commissionAmount' }
                    }
                }
            ])
        ]);

        // Get recent commissions
        const recentCommissions = await CommissionModel.find(query)
            .populate('storeId', 'name slug')
            .populate('storeOwnerId', 'username email')
            .populate('orderId', 'buyerEmail totalPrice')
            .sort({ createdAt: -1 })
            .limit(10);

        return NextResponse.json({
            success: true,
            data: {
                period: parseInt(period),
                total: totalStats[0] || {
                    totalCommissions: 0,
                    totalGross: 0,
                    totalNet: 0,
                    count: 0,
                    avgCommissionRate: 0
                },
                daily: dailyStats,
                status: statusStats,
                recent: recentCommissions
            }
        });
    } catch (error) {
        console.error('Error getting commission analytics:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
