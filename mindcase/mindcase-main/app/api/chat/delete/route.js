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
        
        if(!data.chatId) return NextResponse.json({error: "Invalid chat id!"});

        const {data:deleteChatData, error:deleteChatError} = await supabase.from('chats').delete().eq('id', parseInt(data.chatId)).select();
        if(deleteChatError) return NextResponse.json({error: "Error while deleting chat!"});
        
        return NextResponse.json({state: true, status: "Deleted!"});
    } catch (error) {
        console.log(`ERROR (/api/chat/create): ${error}`);
        return NextResponse.json({ error: `${error}` });
    }
}