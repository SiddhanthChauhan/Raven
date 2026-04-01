'use client'
//added AI comments to this file for future recap

import MessageCard from '@/components/MessageCard';
import { Separator } from '@/components/ui/separator';
import { Message } from '@/src/model/User'
import { acceptMessageSchema } from '@/src/schemas/acceptMessageSchema';
import { ApiResponse } from '@/src/types/apiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import { Switch } from '@/components/ui/switch';
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

function UserDashboard() {
    // --- STATE MANAGEMENT ---
    
    // Holds the array of anonymous messages (missives) received by the user.
    const [messages, setMessages] = useState<Message[]>([]);
    
    // Loading state for fetching the actual messages array (spins the loader icon).
    const [isLoading, setIsLoading] = useState(false); 
    
    // Loading state specifically for the "Accept Messages" toggle switch 
    // to prevent spam-clicking while the API request is in flight.
    const [isSwitchLoading, setIsSwitchLoading] = useState(false); 

    // --- MESSAGE ACTIONS ---
    
    // Optimistically removes a message from the UI without waiting for another API fetch.
    const handleDeleteMessage = (messageId: string) => {
        // We cast _id as 'unknown' then 'string' because MongoDB ObjectIds come back 
        // as complex objects, but we need to compare them as standard strings on the frontend.
        setMessages(messages.filter((message) => (message._id as unknown as string) !== messageId))
    };

    // --- AUTHENTICATION ---
    
    // Retrieves the current user session from NextAuth.
    const { data: session } = useSession();

    // --- FORM & VALIDATION SETUP ---
    
    // We use React Hook Form paired with Zod to handle the toggle switch state 
    // cleanly and ensure schema validation matches the backend expectations.
    const form = useForm({
        resolver: zodResolver(acceptMessageSchema)
    })
    
    // Destructure methods from useForm. 'watch' lets us constantly observe 
    // the current value of the switch to update the UI instantly.
    const { register, watch, setValue } = form;
    const acceptMessages = watch('acceptMessages');

    // --- DATA FETCHING ---
    
    // Fetches the user's current preference: are they currently accepting messages or not?
    // Wrapped in useCallback so it doesn't get recreated on every render, preventing infinite useEffect loops.
    const fetchAcceptMessages = useCallback(async () => {
        setIsSwitchLoading(true); // Lock the switch while fetching data
        try {
            const response = await axios.get<ApiResponse>(('/api/accept-messages'));
            // Update the form state with the DB value, defaulting to false if undefined.
            setValue('acceptMessages', response.data.isAcceptingMessages ?? false);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message ?? 'Failed to fetch message settings');
        } finally {
            setIsSwitchLoading(false); // Unlock the switch when done
        }
    }, [setValue]) // Dependency array: only recreate if 'setValue' function changes

    // Fetches the actual array of messages addressed to this user.
    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true); // Show the main loading spinner
        setIsSwitchLoading(false); // Ensure the switch isn't falsely locked

        try {
            const response = await axios.get<ApiResponse>('/api/get-messages');
            setMessages(response.data.messages || []);
            
            // If triggered manually by the user (clicking the refresh button), show a success toast.
            if (refresh) {
                toast.success('Refreshed Messages', {
                    description: 'Showing latest messages',
                });
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error('Error', {
                description: axiosError.response?.data.message ?? 'Failed to fetch messages',
            });
        } finally {
            setIsLoading(false); // Hide the main loading spinner
            setIsSwitchLoading(false);
        }
    }, [setIsSwitchLoading, setMessages]) // Dependencies for useCallback

    // --- LIFECYCLE HOOKS ---
    
    // Automatically fetch both the settings and the messages when the component first mounts, 
    // but ONLY if the user is successfully logged in (session exists).
    useEffect(() => {
        if (!session || !session.user) return;
        fetchMessages();
        fetchAcceptMessages();
    }, [session, setValue, fetchMessages, fetchAcceptMessages])

    // --- EVENT HANDLERS ---
    
    // Flips the status of whether the user wants to receive anonymous messages.
    const handleSwitchChange = async () => {
        try {
            // Send the *opposite* of the current state to the database to toggle it
            const response = await axios.post<ApiResponse>('/api/accept-messages', {
                acceptMessages: !acceptMessages,
            });
            // Update local form state to reflect the change visually without reloading
            setValue('acceptMessages', !acceptMessages);
            toast.success('Success', {
                description: response.data.message
            });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error('Error', {
                description: axiosError.response?.data.message ?? 'Failed to update message settings'
            });
        }
    };

    // --- RENDER GUARDS ---
    
    // Prevent rendering the dashboard entirely if there is no active session.
    // (Note: In a robust app, Next.js middleware usually redirects them to /sign-in before this point).
    if (!session || !session.user) {
        return <div>Please Login</div>
    }

    // Extract the username safely now that we know the session exists.
    const { username } = session?.user as User;

    // --- UTILITIES ---
    
    // Dynamically construct the base URL depending on the environment 
    // (e.g., http://localhost:3000 in dev, https://raven.com in prod).
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    
    // Construct the public URL (the "Cipher") that the user shares to receive messages.
    const profileUrl = `${baseUrl}/u/${username}`;

    // Copies the generated public URL to the user's clipboard for easy sharing.
    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl);
        toast.success('Url Copied!', {
            description: 'Profile URL has been copied to clipboard.'
        })
    }

    return (
        // Dark, rigid parchment feel with a subtle border instead of heavy shadows
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-8 bg-zinc-950 border border-zinc-800 rounded-sm w-full max-w-6xl font-serif text-zinc-200">

            {/* Changed standard heading to something more atmospheric, separated by a thin rule */}
            <h1 className="text-4xl font-bold mb-6 tracking-wide text-zinc-100 border-b border-zinc-800 pb-4">
                The Sanctum
            </h1>

            <div className="mb-8">
                <h2 className="text-lg font-semibold mb-3 text-zinc-300 tracking-wide">
                    Your Anonymous Cipher
                </h2>{' '}
                <div className="flex items-center">
                    {/* Darkened input field, muted text, italicized for a written feel */}
                    <input
                        type="text"
                        value={profileUrl}
                        disabled
                        className="w-full p-3 mr-4 bg-zinc-900 border border-zinc-800 text-zinc-500 italic rounded-sm focus:outline-none"
                    />
                    <Button
                        onClick={copyToClipboard}
                        className="bg-transparent border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-all duration-300 tracking-wide rounded-sm px-6"
                    >
                        Scribe
                    </Button>
                </div>
            </div>

            <div className="mb-6 flex items-center">
                <Switch
                    {...register('acceptMessages')}
                    checked={acceptMessages}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                // Note: If using shadcn/ui, you might need to adjust the Switch's internal dark mode classes in its component file
                />
                <span className="ml-4 text-zinc-400 italic">
                    Receive Whispers: <span className="text-zinc-200 not-italic">{acceptMessages ? 'Awake' : 'Slumbering'}</span>
                </span>
            </div>

            {/* Replaced standard Separator with a thematic thematic line */}
            <hr className="border-zinc-800 my-8" />

            <Button
                className="mt-2 bg-transparent border border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 rounded-sm transition-colors"
                variant="outline"
                onClick={(e) => {
                    e.preventDefault();
                    fetchMessages(true);
                }}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
                ) : (
                    <RefreshCcw className="h-4 w-4" />
                )}
            </Button>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages.length > 0 ? (
                    messages.map((message, index) => (
                        <MessageCard
                            key={message._id as unknown as string}
                            message={message}
                            onMessageDelete={handleDeleteMessage}
                        />
                    ))
                ) : (
                    // Thematic empty state
                    <div className="col-span-full py-12 border border-dashed border-zinc-800 flex items-center justify-center">
                        <p className="text-zinc-500 italic tracking-wide">
                            The shadows are quiet. No missives have arrived.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}



export default UserDashboard