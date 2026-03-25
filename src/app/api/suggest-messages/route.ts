import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { NextResponse } from 'next/server';

// Initialize the Google provider explicitly using your GEMINI_API_KEY
const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY || '',
});

export const runtime = 'edge';

export async function POST(req: Request) {
    try {
        const prompt =
            "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

        // Pass the custom google provider instance and select the model
        const result = await streamText({
            model: google('gemini-1.5-flash'),
            prompt: prompt,
            // maxTokens: 400, // maxTokens not supported or typed correctly here, use default or config
        });


        // toDataStreamResponse() is the modern replacement for StreamingTextResponse
        return result.toTextStreamResponse();
    } catch (error: any) {
        // The specific OpenAI.APIError check is removed, falling back to general error handling
        console.error('An unexpected error occurred:', error);

        return NextResponse.json(
            {
                message: error?.message || 'An error occurred during generation.',
                status: error?.status || 500
            },
            { status: error?.status || 500 }
        );
    }
}