import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import supabase from "@/config/supabase";

import verifyToken from "@/utils/verifyToken";

export async function POST(req) {
    try {
        const data = await req.json();
        const cookieStore = cookies();
        const otp_token = cookieStore.get('otp_token');

        if(!otp_token) return NextResponse.json({ error: "OTP token not found!" });
        if(!data.code) return NextResponse.json({ error: "Invaild OTP!" });
        
        let otp_data = await verifyToken(otp_token.value, process.env.JWT_OTP_SECRET);
        
        let current_timestamp = Date.now() / 1000;
        if((otp_data.exp - current_timestamp) < 0) return NextResponse.json({ error: "OTP expired!" });

        let { data: otpData, error:otpError } = await supabase.from('otps').select('*').eq('email', otp_data.email).eq('code', data.code);
        if (otpError){
            console.log(otpError);
            return NextResponse.json({ error: "Invaild OTP!" });
        } 
        if (otpData[0]?.code != parseInt(data.code)) return NextResponse.json({ error: "Invaild OTP!" });

        let saltPass = bcrypt.genSaltSync(10);
        let hashPass = bcrypt.hashSync(otp_data.password, saltPass);

        let { data: deleteData, error: deleteError} = await supabase.from('otps').delete().eq('email', otp_data.email).eq('code', data.code);
        if (deleteError) return NextResponse.json({ error: "Something went wrong!" });
        
        const {insertData, insertError} = await supabase
            .from('users')
            .insert([
                { email: otp_data.email, password: hashPass },
            ])
            .select()

        if (insertError) return NextResponse.json({ error: "Something went wrong!" });

        let { data: selectUser, selectError } = await supabase.from('users').select("*").eq('email', otp_data.email);
        if (selectError) return NextResponse.json({ error: "Something went wrong!" });

        if(selectUser[0]?.email) {
            return NextResponse.json({ state: true, status: "Account created successfully!" });
        }
        
        return NextResponse.json({ error: "Something went wrong!" });

    } catch (error) {
        console.log(`ERROR (/api/auth/signup/verify): ${error}`);
        return NextResponse.json({ error: "Something went wrong!"});
    }
}