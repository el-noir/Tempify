import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { stripeConnect } from '@/lib/stripe';
import UserModel from '@/model/User';
import dbConnect from '@/lib/connection/dbConnect';

export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { returnUrl, refreshUrl } = await req.json();

        if (!returnUrl || !refreshUrl) {
            return NextResponse.json(
                { success: false, message: 'Return URL and refresh URL are required' },
                { status: 400 }
            );
        }

        // Find the user
        const user = await UserModel.findById(session.user._id);
        if (!user || !user.stripeAccountId) {
            return NextResponse.json(
                { success: false, message: 'Stripe account not found. Please create an account first.' },
                { status: 404 }
            );
        }

        // Create account link for onboarding
        const accountLink = await stripeConnect.createAccountLink(
            user.stripeAccountId,
            refreshUrl,
            returnUrl
        );

        return NextResponse.json({
            success: true,
            message: 'Onboarding link created successfully',
            url: accountLink.url,
        });
    } catch (error) {
        console.error('Error creating onboarding link:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
