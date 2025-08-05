import dbConnect from "@/lib/connection/dbConnect";
import StorePlanModel from "@/model/StorePlan";

export async function GET(req: Request) {
    console.log('APi hit');
  await dbConnect();

  try {
    const plans = await StorePlanModel.find().sort({ durationHours: 1 }); // ascending sort

    return Response.json(
      {
        success: true,
        plans,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching plans:", error);
    return Response.json(
      { success: false, message: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}
