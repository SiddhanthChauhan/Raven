import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'credentials',
            credentials: {
                email: {label: 'Email' , type: 'text'},
                password: {label: 'Password' , type:'password'},
            },
            async authorize(credentials: any): Promise<any>{
                //try to connect
                await dbConnect();
                try {
                    //find a user using email or username
                    const user = await UserModel.findOne({
                        $or: [
                            //Possibiltiy for undefined status!
                            {email: credentials.identifier}, //no need for credentials.identifier.email in ES6
                            {username: credentials.identifier},
                        ],
                    });

                    //if user not found , throw that error
                    if(!user){
                        throw new Error("User not found with this email or username!");
                    }
                    
                    //checking if the found user is verified
                    if(!user.isVerified){
                        throw new Error("User is not yet verified!");
                    }

                    //checking password
                    const isPasswordCorrect = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    //if password incorrect , throw error
                    if(!isPasswordCorrect){
                        throw new Error("Incorrect Password!");
                    }

                    return user;

                    
                    
                } catch (err:any) {
                    throw new Error(err.message || 'Something went wrong!');
                }
            },
        }),
    ],
    callbacks: {
        //NOTE: For this section to work , refer types/next-auth.d.ts
        async jwt({token , user}){
            if(user){ //while log-in , when user is not yet identified through token
                //Storing user credentials in the JWT token
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }

            return token;
        },

        async session({session , token}){
            if(token){
                //Copying the token data to session for frontend to use
                session.user._id = token._id;
                // //Safer version: (if this crashes)
                // if(session.user){
                //     session.user._id = token._id;
                // }
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }

            return session;
        }
    },
    pages:{
        signIn: '/sign-in' //personal login UI , not nextJs one
    },
    session:{
        strategy: 'jwt'
        //in order to store the login data: two options
        //1. DB sessions , 2. JWT: session stored in token rather than DB
        //Hence on every visit , we check stored tokens(cookies) rather than looking up to DB
    },
    secret: process.env.NEXTAUTH_SECRET,
    //for securing JWT tokens
}