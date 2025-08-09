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

        const { country = 'US' } = await req.json();

        // Find the user
        const user = await UserModel.findById(session.user._id);
        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        // Check if user already has a Stripe account
        if (user.stripeAccountId) {
            return NextResponse.json(
                { success: false, message: 'Stripe account already exists' },
                { status: 400 }
            );
        }

        // Create Stripe Connect account
        const account = await stripeConnect.createAccount(user.email, country);

        // Update user with Stripe account ID
        user.stripeAccountId = account.id;
        user.stripeAccountStatus = 'pending';
        user.stripeOnboardingComplete = false;
        await user.save();

        return NextResponse.json({
            success: true,
            message: 'Stripe Connect account created successfully',
            accountId: account.id,
        });
    } catch (error) {
        console.error('Error creating Stripe Connect account:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
