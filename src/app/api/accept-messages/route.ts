import dbConnect from "@/src/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/src/model/User";
import { getServerSession } from "next-auth";
import { User } from 'next-auth'
import { success } from "zod";

export async function POST(request: Request) {
    await dbConnect();

    //getting an authenticated user
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }

    //if user found -> get user id
    const userId = user.id;
    const { acceptMessages } = await request.json();
    //FIX: Maybe it would be isAcceptingMessages

    try {
        //update the user
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessages: acceptMessages },
            { new: true },
        );

        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: 'Unable to find user to update message acceptance status',
                },
                { status: 404 }
            );
        }

        // Successfully updated message acceptance status
        return Response.json(
            {
                success: true,
                message: 'Message acceptance status updated successfully',
                updatedUser,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error while updating message acceptance status', error);
        return Response.json(
            { success: false, message: 'Error while updating message acceptance status' },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 },
        )
    }
    // const userId = user.id;

    try {
        //get the user
        const foundUser = await UserModel.findById(user._id);
        //we could have extracted the userId before as we did in POST route

        if (!foundUser) {
            return Response.json(
                { success: false, message: 'User not found' },
                { status: 404 },
            )
        }

        //return the user's message acceptance status
        return Response.json(
            {
                success: true,
                isAcceptingMessages: foundUser.isAcceptingMessages,
            },
            {
                status: 200
            }
        );
    } catch (error) {
        console.error('Error retrieving message acceptance status:', error);
        return Response.json(
            { success: false, message: 'Error retrieving message acceptance status' },
            { status: 500 }
        );
    }
}