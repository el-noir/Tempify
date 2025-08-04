import type { NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/connection/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                identifier: {label: "Email", type: "text"},
                password: {label: "Password", type: "password"},
            },
            async authorize(credentials: any) : Promise<any> {
                await dbConnect()
                try {
                    const user = await UserModel.findOne({
                        $or: [{email: credentials.identifier}, {username: credentials.identifier}],
                    })

                    if(!user){
                        throw new Error("No user found with this email")
                    }

                    if(!user.isVerified){
                        throw new Error("Please Verify your account before login")
                    }

                    console.log("Login attempt: ", credentials)

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

                    if(isPasswordCorrect){
                        return {
                            _id: user._id,
                            username: user.username,
                            email: user.email,
                            isVerified: user.isVerified,
                        }
                    } else {
                        throw new Error("Incorrect Password")
                    }
                    
                } catch (err: any) {
                    throw new Error(err.message)
                }
            }
        })
    ],
    callbacks: {
        async jwt({token, user}){
            if(user){
            token._id = user._id?.toString()
            token.isVerified = user.isVerified
            token.username = user.username
            token.email = user.email
            }
            return token
        },
        
        async session({session, token}){
            if(token){
        session.user._id = token._id
        session.user.isVerified = token.isVerified
        session.user.username = token.username
        session.user.email = token.email
            }
            return session;
        }
    },
    pages: {
        signIn: '/sign-in',
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, 
    },
      jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
   cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" ? "__Secure-next-auth.session-token" : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}