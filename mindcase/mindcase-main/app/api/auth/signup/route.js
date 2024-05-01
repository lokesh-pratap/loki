import { NextResponse } from "next/server";
import supabase from "@/config/supabase";
import { send_mail } from "@/config/email";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(req, res) {
    try {
        const cookieStore = cookies();
        const data = await req.json();

        const check = await checkUserSendedData(data);
        if(!check.state) return NextResponse.json({ error: check.status })
        
        let otp_code = generate_otp_code();
        let otp_payload = {
            type: 1, // 1 - signup, 2 - forgot password
            email: data.email,
            password: data.password
        };
        
        let {error: deleteError} = await supabase.from('otps').delete().eq('email', data.email);
        if (deleteError) return NextResponse.json({ error: "Something went wrong!" });

        const { data:otpData, error } = await supabase
            .from('otps')
            .insert([
                { type: otp_payload.type, email: data.email, code: otp_code },
            ])
            .select()
            

        if(error) return NextResponse.json({ error: "Something went wrong!" });
        console.log(otpData, error);
        let mail_option = {
            from: process.env.GMAIL_ID,
            to: data.email,
            subject: "Verfication code",
            text: `Your one time password for registering your account is ${otp_code}. This code will expire in 1 hour.`
        };
        let email_status = await send_mail(mail_option);

        
        if(email_status.accepted == data.email){
            const otp_token = jwt.sign(otp_payload, process.env.JWT_OTP_SECRET, { expiresIn: '1h' });
            
            const oneHour = 60 * 60 * 1000;
            cookieStore.set('otp_token', otp_token, { expires: Date.now() + oneHour });
            return NextResponse.json({state: true, status: "OTP sent to your email"});
        }

        return NextResponse.json({ error: "Something went wrong!" });

    } catch (error) {
        console.log(`ERROR (/api/auth/signup): ${error}`);
        return NextResponse.json({ error: error });
    }
}

async function checkUserSendedData(data) {
    let check = {
        state: false,
        status: "Something went wrong!"
    };

    try {
        if (data.password.length < 8) {
            check.state = false;
            check.status = "Invalid password length";
        }
        else {
            let { data: users, error } = await supabase.from('users').select("*").eq('email', data.email);
            if (users[0]?.email) {
                check.state = false;
                check.status = "Email already registered!";
                return check;
            }

            check.state = true;
            check.status = "Success";
        }
        return check;
    } catch (error) {
        check.state = false;
        check.status = "Bad request";
        console.log(`ERROR (/api/auth/signup): ${error}`);
        return check;
    }
}

function generate_otp_code() {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}