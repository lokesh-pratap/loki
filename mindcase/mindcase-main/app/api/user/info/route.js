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
        
        let { data: users, error:userError } = await supabase.from('users').select('*').eq('id', user_info.userid);
        if(userError) return NextResponse.json({error: "Unable to fetch data!"});

        return NextResponse.json({state: true, status: "fetched!", userinfo: {
            id: users[0].id,
            name: users[0].name,
            email: users[0].email,
            profileImage: users[0].profile_image,
        }});

    } catch (error) {
        console.log(`ERROR (/api/user/info): ${error}`);
        return NextResponse.json({ error: `${error}` });
    }
}