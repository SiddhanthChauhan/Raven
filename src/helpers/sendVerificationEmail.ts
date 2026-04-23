import { resend } from "@/src/lib/resend";
import VerificationEmail from "@/emails/VerificationEmails";
import { ApiResponse } from "../types/apiResponse"


export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        if (!process.env.RESEND_API_KEY) {
            return { success: false, message: 'RESEND_API_KEY is not configured.' };
        }

        const { error } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'Acme <onboarding@resend.dev>',
            to: [email],
            subject: 'Raven Verification Code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });

        if (error) {
            console.error('Resend API error:', error);
            return {
                success: false,
                message: error.message || 'Failed to send verification email.',
            };
        }

        return { success: true, message: 'Verification email sent successfully' }
    }
    catch (emailError) {
        console.error('Error sending verification email:', emailError);
        return { success: false, message: 'Failed to send verification email.' }
    }
}