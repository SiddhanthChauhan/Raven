import UserModel from "@/src/model/User";
import dbConnect from "@/src/lib/dbConnect";
import { success, z } from 'zod';
import { usernameValidation } from "@/src/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation,
})

export async function GET(request: Request) {
    //try connection
    await dbConnect();

    try {
        //get the search parameters
        const { searchParams } = new URL(request.url); // request.url gives the whole url,
        //  .searchParams provides query parameters

        const queryParams = {
            username: searchParams.get('username') //filter the search params to get the one with username
        }
        //check if the username satisfies validations
        const result = UsernameQuerySchema.safeParse(queryParams);

        //TODO : Try to log the result to check what it contains
        if (!result.success) {
            // username isnt valid
            //extracting the error(optional)
            const errorMessage = result.error.format().username?._errors || [];
            return Response.json(
                {
                    success: false,
                    message: errorMessage?.length > 0 ? errorMessage.join(',') :
                        'Invalid query , try again!',
                },
                {
                    status: 400,
                }
            )
        }

        //Now if username valid -> check if it already exists

        //geting the validated username
        const { username } = result.data;

        const existingVerifiedUsername = await UserModel.findOne({
            username,
            isVerified: true,
        })

        if (existingVerifiedUsername) {
            return Response.json(
                {
                    success: false,
                    message: 'Username is already taken',
                },
                { status: 200 }
            );
        }

        return Response.json(
            {
                success: true,
                message: 'Username Valid , Congratulations!',
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error checking username ', error);
        return Response.json(
            {
                success: false,
                message: 'Error checking username',
            },
            {
                status: 500,
            }
        )
    }
}