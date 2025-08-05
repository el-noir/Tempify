import { NextResponse } from "next/server"
import dbConnect from "@/lib/connection/dbConnect"
import StorePlanModel from "@/model/StorePlan"

export async function POST(req: Request) {
  await dbConnect()

  try {
    const { title, durationHours, basePrice, commissionPercentage } =
      await req.json()

    if (!title || !durationHours || !basePrice || commissionPercentage==null) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      )
    }

    const finalPrice = Math.floor(
      basePrice - (basePrice * commissionPercentage) / 100
    )

    const plan = new StorePlanModel({
      title,
      durationHours,
      basePrice,
      commissionPercentage,
      finalPrice,
    })

    await plan.save()

    return NextResponse.json(
      { success: true, message: "Plan added successfully", plan },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error adding plan:", error)
    return NextResponse.json(
      { success: false, message: "Failed to add plan" },
      { status: 500 }
    )
  }
}
