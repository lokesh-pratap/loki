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

        if(!data.chat_id) return NextResponse.json({error: "Invalid chat id!"});
        if(!data.message) return NextResponse.json({error: "Invalid message!"});
   

        const {data:insertMessageData, error:insertMessageError} = await supabase.from('messages').insert({ chat_id: data.chat_id, user_id: user_info.userid, user_request: data.message}).select();
        if(insertMessageError) return NextResponse.json({error: "Error while creating response!"});
        
        return NextResponse.json({state: true, status: "Created!", response: insertMessageData[0]});

    } catch (error) {
        console.log(`ERROR (/api/chat/messages/create): ${error}`);
        return NextResponse.json({ error: `${error}` });
    }
}