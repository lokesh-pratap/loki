import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import supabase from "@/config/supabase";

import verifyToken from "@/utils/verifyToken";

export const dynamic = 'force-dynamic';

export async function GET(req, res){
    try {
        const cookieStore = cookies();
        const session = cookieStore.get('session');
        
        if(!session) return NextResponse.json({error: "You are not logged in!"});
        let user_info = await verifyToken(session.value, process.env.JWT_SESSION_SECRET);
        
        let { data: selectChatsData, error } = await supabase.from('chats').select('*').eq('user_id', user_info.userid).order('created_at', { ascending: false });  // ascending: false (descending), ascending: true (ascending)
        
        if(error) return NextResponse.json({error: "Unable to fetch data!"});

        return NextResponse.json({state: true, status: "fetched!", chats: selectChatsData});

    } catch (error) {
        console.log(`ERROR (/api/chat/get): ${error}`);
        return NextResponse.json({ error: `${error}` });
    }
}