import mongoose , {Schema , Document} from "mongoose";

export interface Message extends Document{
    content: string;
    createdAt: Date
}

const MessageSchema : Schema<Message> = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: { //instead of createdAt , you could have used 
    // timestamps which automatically creates createdAt and updatedAt
        type: Date,
        required: true,
        default: Date.now,//default value given , so required is redundant
    },
});

export interface User extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    messages: Message[];
}

const UserSchema: Schema<User> = new mongoose.Schema({
    username: {
        type: String,
        required: [true , "Username is required!"],
        trim: true, //trims extra spaces
        unique: true, //only unique values ( but unique to what?)
    },
    email: {
        type: String,
        required: [true , "Email is required!"],
        unique: true,
        match: [/.+\@.+\..+/,"Please use a valid email address"],
    },
    password: {
        type: String,//normally not usually stored as a string but instead
        // hashed using bcrypt!
        required: [true , "Password is required!"],
    },
    verifyCode: {
        type: String,
        required: [true , "Verification Code is required!"],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true , "Verify Code expiry is required!"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessages: {
        type: Boolean,
        default: true,
    },
    messages: [MessageSchema],
});

const UserModel = 
(mongoose.models.User as mongoose.Model<User>) ||
(mongoose.model<User>("User",UserSchema))
//If model already there -> use it else new bana lo!

export default UserModel;