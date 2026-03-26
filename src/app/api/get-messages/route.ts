import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import { getServerSession } from "next-auth";
import { User } from 'next-auth'
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from 'mongoose'

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json(
            { success: false, messsage: 'Not Authenticated' },
            { status: 401 },
        )
    }

    const userId = new mongoose.Types.ObjectId(user._id);//converting the string id into DB Object Type

    try {
        //creating an aggregation pipeline
        const user = await UserModel.aggregate([
            { $match: { _id: userId } }, //Selecting only the current user
            { $unwind: '$messages' },//every message is now broken down into documents
            { $sort: { 'messages: createdAt': -1 } },//recent message appears first
            {
                $group: {
                    _id: '$_id',
                    messages: { $push: '$messages' }
                }
            }


        ])
        //Note: Maybe ".exec()" needs to be added here!

        if (!user || user.length === 0) {
            return Response.json(
                { message: 'User not found', success: false },
                { status: 404 }
            );
        }

        return Response.json(
            { messages: user[0].messages },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return Response.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }
}
