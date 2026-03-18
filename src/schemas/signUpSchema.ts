import { z } from 'zod'

export const usernameValidation = z
    .string()
    .min(4,"username should be atleast 4 characters long!")
    .max(26 , "username should be less than 26 characters!")
    .regex(/^[a-zA-Z0-9_]+$/,"Username must not contain special characters!")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid email address!"}),
    password: z.string().min(6,{message: "Password should be atleast 6 characters long!"})
    .max(20 ,{message: "Password should be less than 20 characters!"})
});