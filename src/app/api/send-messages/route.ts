import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import { Message } from "@/src/model/User";

export async function POST(request : Request){
    await dbConnect();

    const { username , content } = await request.json();//getting the data from the json

    try {
        //finding a user with that username
        const user = await UserModel.findOne({username}); //Maybe: .exec() needed!

        if(!user){
            return Response.json(
                {success: false , message: 'User not found'},
                {status: 404},
            );
        }

        //if user exists -> check if the user is accepting messages
        if(!user.isAcceptingMessages){
            return Response.json(
                {
                    success: false , message: 'User is not accepting messages!',
                },
                {
                    status: 403, //current action is forbidden!
                }

            );
        }

        const newMessage = {content , createdAt: new Date()};

        //Pushing the new message into the user's message array
        user.messages.push(newMessage as Message);

        //Finally done!
        await user.save();

        return Response.json(
            {success: true , message: 'Message Sent Successfully!'},
            {status: 201},
        );


    } catch (error) {
        console.error('Error sending messages' , error);
        return Response.json(
            { success: false , message: 'Internal Server error!'},
            {status: 500},
        );
    }

}