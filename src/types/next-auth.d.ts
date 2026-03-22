import 'next-auth'
import { DefaultSession } from 'next-auth';

//Why this file is neeeded?
//NextAUth does not include id , username , isVerified , etc by default,
//so we extend , the default types
//Basically sayhing : Brother , these xxx fields are also there!!

declare module 'next-auth' {
    interface Session {
        //for external frontend access
        user: {
            _id?: string;
            isVerified?: boolean;
            isAcceptingMessages?: boolean;
            username?: string;
        } & DefaultSession['user'];
    }

    interface User {
        //for internal login phase
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string;
    }
}

//alternate method to declare specific
declare module 'next-auth/jwt'{
    interface JWT {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string;
    }
}

//ENTIRE FLOW:
// User logs in
//    ↓
// authorize() returns user
//    ↓
// jwt() runs → data token me store hota hai
//    ↓
// session() runs → token → session.user me copy hota hai
//    ↓
// Frontend gets session