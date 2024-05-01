import { NextResponse } from "next/server";
import supabase from "@/config/supabase";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';

export async function POST(req, res){
    try {
        const cookieStore = cookies();
        const data = await req.json();

        let { data: users, error } = await supabase.from('users').select("*").eq('email', data.email);
        
        if(error) return NextResponse.json({error: error});
        if (!users[0]?.email) return NextResponse.json({error: "Invalid email!"});
        
        let passwordHash = users[0].password; // Direct `users[0].password` pass to compareSync won't work
        let isValidPassword = bcrypt.compareSync(data.password, passwordHash);
        if(!isValidPassword) return NextResponse.json({error: "Invalid password!"});

        let session_payload = {
            userid: users[0].id,
            username: users[0].name,
            email: users[0].email
        }
        
        const session_token = jwt.sign(session_payload, process.env.JWT_SESSION_SECRET, { expiresIn: '7d' }); // Session valid for 7 days

        const oneHour = 7 * 24 * 60 * 60 * 1000;
        cookieStore.set('session', session_token, { expires: Date.now() + oneHour });
        return NextResponse.json({state: true, status: "Logged In!"});

    } catch (error) {
        console.log(`ERROR (/api/auth/login): ${error}`);
        return NextResponse.json({ error: `${error}` });
    }
}