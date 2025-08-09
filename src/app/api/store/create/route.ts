import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import {authOptions} from '../../auth/[...nextauth]/options'
import dbConnect from "@/lib/connection/dbConnect";
import StoreModel from "@/model/Store";
import StorePlanModel from "@/model/StorePlan";
import UserModel from "@/model/User";
import {nanoid} from 'nanoid';
import { success } from "zod";
import { createStoreSchema } from "@/lib/validations";

export async function POST(req:Request) {
    const session = await getServerSession(authOptions)

    if(!session?.user){
        return NextResponse.json(
            {
                success: false,
                message: "Unathorized"
            }, { status: 401}
        )
    }
try {
        // db connecct
        dbConnect()

        const body = await req.json()
        const parseResult = createStoreSchema.safeParse(body)

        if(!parseResult.success){
                return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
        }
    
const {name, description, planId} = parseResult.data;
    
    // check if plan exist in db
    const plan = await StorePlanModel.findById(planId)
    
    if(!plan) {
             return NextResponse.json(
        { success: false, message: "Invalid store plan selected" },
        { status: 404 }
      ) 
    }

    // Check if user has completed Stripe Connect onboarding
    const user = await UserModel.findById(session.user._id);
    if (!user) {
        return NextResponse.json(
            { success: false, message: "User not found" },
            { status: 404 }
        );
    }

    if (!user.stripeAccountId || !user.stripeOnboardingComplete || user.stripeAccountStatus !== 'active') {
        return NextResponse.json(
            { 
                success: false, 
                message: "Stripe Connect account setup required. Please complete your payment setup before creating a store.",
                requiresStripeSetup: true
            },
            { status: 400 }
        );
    }

    // generate a slug
        const slugBase = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")
        const slug = `${slugBase}-${nanoid(6)}`

    // expire data decide
        const expiresAt = new Date(
            Date.now() + plan.durationHours * 60 * 60 * 1000
        )

    // create store and save in db
        const newStore = new StoreModel({
            ownerId: session.user._id,
            planId,
            name,
            slug,
            description,
            expiresAt
        })

        newStore.save()

    // return response of success
    return NextResponse.json({
        success: true,
        message: "Store created successfully",
        store: {
            _id: newStore._id,
            name: newStore.name,
            slug: newStore.slug,
            expiresAt: newStore.expiresAt
        },
    }, {status: 201})

} catch (error) {
        console.error("Store creation error:", error)
    return NextResponse.json(
      { success: false, message: "Failed to create store" },
      { status: 500 }
    )
}

}

