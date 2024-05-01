"use client";
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginButton() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function login() {
        setLoading(true);
        const email = document.getElementById('inp-login-email').value;
        const password = document.getElementById('inp-login-pwd').value;

        let repsonse = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        let data = await repsonse.json();
        console.log(data);

        if(data.error){
            setError(data.error);
        }
        
        setLoading(false);
        if(data.state){
            setError(null);
            router.push('/');
        }
    }

    return (<>
        {error && <div className="text-center text-red-500 text-sm my-2">{error}</div>}

        {
            loading ?
                <Button disabled onClick={login} className="bg-emerald-600 hover:bg-emerald-700 w-full py-6 text-sm">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Continue
                </Button>
            :
            <Button onClick={login} className="bg-emerald-600 hover:bg-emerald-700 w-full py-6 text-sm">Continue</Button>
        }
    </>)
}