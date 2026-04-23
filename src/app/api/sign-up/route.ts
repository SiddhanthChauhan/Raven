import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/src/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect(); //waiting for the connection to get established

    try {
        const { username, email, password } = await request.json();

        const existingVerifiedUserByUsername = await UserModel.findOne({
            username,
            isVerified: true, //for all those usernames that have not been verified can be used
        });

        if (existingVerifiedUserByUsername) {
            return Response.json(
                {
                    success: false, //no verfication required hence false
                    message: 'Username is already taken!',
                },
                {
                    status: 400,
                }
            )
        }

        const existingUserByEmail = await UserModel.findOne({ email });
        const OTP = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: 'User already verified with this email!',
                    },
                    {
                        status: 400,
                    }
                )
            }
            else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = OTP;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();

            }
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode: OTP,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: [],
            })

            await newUser.save();
        }

        //sending verification email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            OTP
        );
        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message,
                },
                {
                    status: 500
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: 'User registered successfully. Please verify your account.',
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Error registering user!", error); //for the console
        return Response.json(
            {
                success: false,
                message: "Error registering user"//for the frontend
            },
            {
                status: 500
            }
        )
    }
}