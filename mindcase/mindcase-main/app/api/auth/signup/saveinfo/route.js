import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import supabase from "@/config/supabase";

import verifyToken from "@/utils/verifyToken";

export async function POST(req) {
    try {
        const data = await req.json();
        const cookieStore = cookies();
        const otp_token = cookieStore.get('otp_token');

        if(!otp_token) return NextResponse.json({ error: "OTP token not found!" });
        if(!data.username) return NextResponse.json({ error: "Invaild username!" });
        if(!data.lastname) return NextResponse.json({error: "Invaild lastname!"});

        let otp_data = await verifyToken(otp_token.value, process.env.JWT_OTP_SECRET);

        const name = data.username + ' ' + data.lastname;
        const { updateUser, updateError } = await supabase
            .from('users')
            .update({ name: name })
            .eq('email', otp_data.email)
            .select();

        if (updateError) return NextResponse.json({ error: "Something went wrong!" });
        
        let { data: selectUser, selectError } = await supabase.from('users').select("*").eq('email', otp_data.email);
        if (selectError) return NextResponse.json({ error: "Something went wrong!" });

        if(selectUser[0]?.name == name) {
            cookieStore.delete('otp_token');
            return NextResponse.json({ state: true, status: "Username saved successfully!" });
        }

        return NextResponse.json({ error: "Something went wrong!"});
    } catch (error) {
        console.log(`ERROR (/api/auth/signup/saveinfo): ${error}`);
        return NextResponse.json({ error: "Something went wrong!"});
    }
}