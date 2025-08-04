import dbConnect from '@/lib/connection/dbConnect'
import UserModel from '@/model/User'
import {success, z} from 'zod'
import { usernameValidation } from '@/lib/validations/signUpSchema'

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
    await dbConnect()

try {
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }
    
        const result = UsernameQuerySchema.safeParse(queryParam)
        console.log(result)
    
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
                    return Response.json({
                success: false,
                message: usernameErrors?.length > 0
                ? usernameErrors.join(', ')
                : 'Invalid query paramaters',
            }, {status: 400})
        }
    
        const {username} = result.data;
    
        const existingVerifiedUser = await UserModel.findOne({username, isVerified: true})
    
        if(existingVerifiedUser){
            return Response.json({
                success: false,
                message: "Username is alread taken",
            }, {status: 400})
        }
           return Response.json({
                success: true,
                message: "Username is unique",
            }, {status: 200})
} catch (error) {
             console.error("Error checking username", error)
        return Response.json(
            {
                success: false,
                message: "Error checking username"
            },
            {status: 500}
        )  
}
}
