import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import {authOptions} from '../../auth/[...nextauth]/options'
import dbConnect from "@/lib/connection/dbConnect";
import StoreModel from "@/model/Store";
import StorePlanModel from "@/model/StorePlan";
import {nanoid} from 'nanoid';

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
    // generate a slug

    // expire data decide

    // create store and save in db

    // return response of success
} catch (error) {
    
}


    


}

