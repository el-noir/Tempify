import dbConnect from "@/lib/connection/dbConnect";
import UserModel from "@/model/User";

import bcrypt from "bcryptjs";
import { success } from "zod";

export async function POST(request: Request) {
    await dbConnect()

    const {username, email, password} = await request.json()

    console.log("Sign-up Attempt: ", {username, email});

    // check if username is already taken by a verified user
    const existingUserVerifiedByUsername = await UserModel.findOne({
        username, 
        isVerified: true
    })

    if(existingUserVerifiedByUsername){
        return Response.json({
            success: false,
            message: "Username is already taken",
        }, {status: 400})
    }

    const existingUserByEmail = await UserModel.findOne({
        email
    })

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
    console.log("Generated verification code:", verifyCode)

    if(existingUserByEmail){
        if(existingUserByEmail.isVerified){
                return Response.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          { status: 400 },
        )
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)
            existingUserByEmail.password = hashedPassword
            existingUserByEmail.verifyCode = verifyCode
            existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000) // 1 hour
            existingUserByEmail.username = username // Update username too

            await existingUserByEmail.save()
            console.log("Updating existing unverified user")
        }
    } else {
              const hashedPassword = await bcrypt.hash(password, 10)
      const expiryDate = new Date()
      expiryDate.setHours(expiryDate.getHours() + 1)

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,

      })

            await newUser.save()
      console.log("Created new user")
    }

    console.log("Sending verificaton email...");


    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your email",
      },
      { status: 201 },
    )
}
