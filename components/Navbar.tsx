'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { User } from 'next-auth'

function Navbar() {

    //getting the session data ( tells whether the user is logged in or not!)
    const { data: session } = useSession();
    const user: User = session?.user as User;



    return (
        <nav className="p-4 md:p-6 bg-zinc-950 border-b border-zinc-800 text-zinc-300 font-serif">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">


                <Link href="/" className="text-2xl md:text-3xl font-bold mb-4 md:mb-0 tracking-widest text-zinc-100 hover:text-white transition-colors drop-shadow-sm">
                    RAVEN
                </Link>

                <div className="flex items-center space-x-4 md:space-x-6">
                    {session ? (
                        <>

                            <span className="text-sm md:text-base italic text-zinc-400">
                                Greetings, {user.username || user.email}
                            </span>
                            <Button
                                onClick={() => signOut()}
                                className="w-full md:w-auto bg-transparent border border-zinc-700 text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100 transition-all duration-300 tracking-wide"
                                variant="outline"
                            >
                                Depart
                            </Button>
                        </>
                    ) : (
                        <Link href="/sign-in">
                            <Button
                                className="w-full md:w-auto bg-transparent border border-zinc-700 text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100 transition-all duration-300 tracking-wide"
                                variant="outline"
                            >
                                Enter
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar