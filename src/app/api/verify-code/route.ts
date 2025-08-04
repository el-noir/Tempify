import dbConnect from "@/lib/connection/dbConnect";
import UserModel from "@/model/User";
import { success } from "zod";

export async function POST (request: Request){
    await dbConnect()

    try {
        const {username, code} = await request.json()

        const decodedUsername = decodeURIComponent(username)
        console.log("User to verify", decodedUsername)

        const user = await UserModel.findOne({username: decodedUsername})

        if(!user){
            return Response.json({
                            
                success: false,
                message: "User not found"
            },
            {status: 500}
            )
        }

        const isCodeValid = user.verifyCode ===code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if(isCodeValid && isCodeNotExpired){
          await user.save()
          console.log("Code is valid")
         return Response.json(
            {
                success: true,
                message: "Account verified successfully"
            },
            {status: 200}
        )
        } else if(!isCodeNotExpired){
            return Response.json({
                success: false,
                message: "Verification code has been expired, please signup again to get a new code"
            }, {status: 400})
        } else {
                        return Response.json(
            {
                success: false,
                message: "Incorrect Verification code"
            },
            {status: 400} )
        }

     } catch (error) {
        console.error("Error verifying user", error)
        return Response.json(
            {
                success: false,
                message: "Error verifying user"
            },
            {status: 500}
        )    
    }
}

