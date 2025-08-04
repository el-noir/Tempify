import { resend } from "@/lib/resend/resend"
import VerificationEmail from "../../emails/VerificationEmail"
import type { ApiResponse } from "@/types/ApiResponse"

export async function sendVerificationEmail(email: string, username: string, verifyCode: string): Promise<ApiResponse> {
  try {
    console.log("Attempting to send email to:", email)
    console.log("Using verification code:", verifyCode)
    console.log("Resend API Key exists:", !!process.env.RESEND_API_KEY)

    const emailResponse = await resend.emails.send({
      from: "onboarding@resend.dev", // This is Resend's test email
      to: email,
      subject: "True Feedback - Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    })

    console.log("Resend response:", emailResponse)

    if (emailResponse.error) {
      console.error("Resend error:", emailResponse.error)
      return {
        success: false,
        message: `Failed to send verification email: ${emailResponse.error.message}`,
      }
    }

    return {
      success: true,
      message: "Verification email sent successfully",
    }
  } catch (emailError) {
    console.error("Error sending verification email:", emailError)
    return {
      success: false,
      message: "Failed to send verification email",
    }
  }
}
