import { NextResponse, NextRequest } from 'next/server'
// export { default } from "next-auth/middleware" //to make it run everywhere
import { getToken } from "next-auth/jwt" //give token to middleware

//Middleware changed to :proxy

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {

    const token = await getToken({ req: request })
    const url = request.nextUrl

    if (token &&
        (
            url.pathname.startsWith('/sign-up') ||
            url.pathname.startsWith('/sign-in') ||
            url.pathname.startsWith('/verify') ||
            url.pathname === '/'
        )
    ) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (!token && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    return NextResponse.next();

}
