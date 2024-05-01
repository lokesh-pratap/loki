import { NextResponse } from "next/server";
import supabase from "@/config/supabase";
import { cookies } from "next/headers";
import verifyToken from "@/utils/verifyToken";
import { getAiResponse } from "@/config/openai";

export async function POST(req, res){

    try {
        const cookieStore = cookies();
        const session = cookieStore.get('session');
        const data = await req.json();
        
        if(!session) return NextResponse.json({error: "You are not logged in!"});
        let user_info = await verifyToken(session.value, process.env.JWT_SESSION_SECRET);

        if(!data.message) return NextResponse.json({error: "Invalid message!"}); // Middleware won't allow this to happen :(

        let reply = await getAiResponse(data.message);
        if(!reply.message.content) return NextResponse.json({error: "AI not responding!"});
        
        let title = data.message.slice(0, 36);

        const {data:insertChatData, error:insertChatError} = await supabase.from('chats').insert({ user_id: user_info.userid, title: title }).select();
        if(insertChatError) return NextResponse.json({error: "Error while creating chat!"});

        const {data:insertMessageData, error:insertMessageError} = await supabase.from('messages').insert({ chat_id: insertChatData[0].id, user_id: user_info.userid, user_request: data.message, ai_response: reply.message.content}).select();
        if(insertMessageError) return NextResponse.json({error: "Error while generating response!"});
        
        return NextResponse.json({state: true, status: "Created!", chat_id: insertChatData[0].id});

    } catch (error) {
        console.log(`ERROR (/api/chat/create): ${error}`);
        return NextResponse.json({ error: `${error}` });
    }
}