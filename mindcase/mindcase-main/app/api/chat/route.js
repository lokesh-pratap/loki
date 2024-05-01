import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai';

import verifyToken from "@/utils/verifyToken";

// export const runtime = 'edge'; // not support crypto with it
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


export async function POST(req) {
    try {
        const cookieStore = cookies();
        const session = cookieStore.get('session');
        const data = await req.json();

        if(!session) return NextResponse.json({error: "You are not logged in!"});
        await verifyToken(session.value, process.env.JWT_SESSION_SECRET);

        const response = await openai.chat.completions.create({
            messages: [{ role: 'user', content: data.prompt }],
            model: 'gpt-3.5-turbo',
            stream: true
        });
        const stream = OpenAIStream(response);
        return new StreamingTextResponse(stream);
        
    } catch (error) {
        console.log(`ERROR (/api/chat): ${error}`);
        return new NextResponse.JSON({ error: `${error}` });
    }
}