"use client";
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupButton() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function getSignupDetails() {
        setLoading(true);
        const email = document.getElementById('inp-signup-email').value;
        const password = document.getElementById('inp-signup-pwd').value;

        let repsonse = await fetch('/api/auth/signup', {
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
            setLoading(false);
            setError(data.error);
        }

        if(data.state){
            setLoading(false);
            setError(null);
            router.push('/onboarding');
        }
    }

    return (<>
        {error && <div className="text-center text-red-500 text-sm my-2">{error}</div>}

        {
            loading ?
                <Button disabled onClick={getSignupDetails} className="bg-emerald-600 hover:bg-emerald-700 w-full py-6 text-sm">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Continue
                </Button>
            :

            <Button onClick={getSignupDetails} className="bg-emerald-600 hover:bg-emerald-700 w-full py-6 text-sm">Continue</Button>
        }
    </>);
}