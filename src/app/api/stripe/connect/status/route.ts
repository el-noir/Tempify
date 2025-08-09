import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { stripeConnect } from '@/lib/stripe';
import UserModel from '@/model/User';
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

        // Find the user
        const user = await UserModel.findById(session.user.id);
        if (!user || !user.stripeAccountId) {
            return NextResponse.json(
                { success: false, message: 'Stripe account not found' },
                { status: 404 }
            );
        }

        // Get account status from Stripe
        const account = await stripeConnect.getAccount(user.stripeAccountId);

        // Update user status based on Stripe account
        let status: 'pending' | 'active' | 'rejected' | 'restricted' = 'pending';
        let onboardingComplete = false;

        if (account.charges_enabled && account.payouts_enabled) {
            status = 'active';
            onboardingComplete = true;
        } else if (account.requirements?.disabled_reason) {
            status = 'restricted';
        }

        // Update user in database
        user.stripeAccountStatus = status;
        user.stripeOnboardingComplete = onboardingComplete;
        await user.save();

        return NextResponse.json({
            success: true,
            accountId: account.id,
            status,
            onboardingComplete,
            chargesEnabled: account.charges_enabled,
            payoutsEnabled: account.payouts_enabled,
            requirements: account.requirements,
        });
    } catch (error) {
        console.error('Error getting account status:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
