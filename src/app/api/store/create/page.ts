import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import {authOptions} from '../../auth/[...nextauth]/options'
import dbConnect from "@/lib/connection/dbConnect";
import StoreModel from "@/model/Store";
import StorePlanModel from "@/model/StorePlan";
import {nanoid} from 'nanoid';
import { success } from "zod";

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
    // extract name, description, planId from request
    const {name, description, planId} = await req.json();
    
    // check if name and planid exist in the request
    if(!name) {
       return NextResponse.json(
        { success: false, message: "Name is required" },
        { status: 400 }
        )
    }

       if(!planId) {
       return NextResponse.json(
        { success: false, message: "planId is required" },
        { status: 400 }
        )
    }

    // check if plan exist in db
    const plan = await StorePlanModel.findById(planId)
    
    if(!plan) {
             return NextResponse.json(
        { success: false, message: "Invalid store plan selected" },
        { status: 404 }
      ) 
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

