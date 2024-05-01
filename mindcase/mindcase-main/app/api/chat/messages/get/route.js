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
        
        let { data: selectMessagesData, error } = await supabase.from('messages').select('*').eq('user_id', parseInt(user_info.userid)).eq('chat_id', parseInt(data.chat_id));
        
        if(error) return NextResponse.json({error: "Unable to fetch data!"});

        return NextResponse.json({state: true, status: "fetched!", messages: selectMessagesData});
    } catch (error) {
        console.log(`ERROR (/api/chat/messages/get): ${error}`);
        return NextResponse.json({ error: `${error}` });
    }
}