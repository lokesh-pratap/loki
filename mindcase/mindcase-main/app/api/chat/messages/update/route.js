import { NextResponse } from "next/server";
import supabase from "@/config/supabase";
import { cookies } from "next/headers";

import verifyToken from "@/utils/verifyToken";

export async function POST(req, res){

    try {
        const cookieStore = cookies();
        const session = cookieStore.get('session');
        const data = await req.json();
        
        if(!session) return NextResponse.json({error: "You are not logged in!"});
        let user_info = await verifyToken(session.value, process.env.JWT_SESSION_SECRET);

        if(!data.chat_id) return NextResponse.json({error: "Invalid message id!"});
        if(!data.ai_response) return NextResponse.json({error: "Invalid ai response!"});

        const {data:updateMessageData, error:updateMessageError} = await supabase.from('messages').update({ ai_response: data.ai_response}).eq('chat_id', parseInt(data.chat_id)).is('ai_response', null).select();
        if(updateMessageError){
            console.log(updateMessageError);
            return NextResponse.json({error: "Error while updating response!"});
        } 
        
        return NextResponse.json({state: true, status: "Updated!"});

    } catch (error) {
        console.log(`ERROR (/api/chat/messages/update): ${error}`);
        return NextResponse.json({ error: `${error}` });
    }
}