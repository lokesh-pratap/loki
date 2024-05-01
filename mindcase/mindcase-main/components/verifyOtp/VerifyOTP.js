"use client";
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function VerifyOTP() {
    const [isVerified, setIsVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    async function verify_otp() {
        setLoading(true);
        const code = document.getElementById('inp-verify-otp').value;
        
        let repsonse = await fetch('/api/auth/signup/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                code: code
            })
        });
        
        let data = await repsonse.json();
        console.log(data);
        
        if(data.error){
            setLoading(false);
            setError(data.error);
        }
        
        if(data.state){
            document.getElementById('inp-verify-otp').value = "";
            setError(null);
            setLoading(false);
            setIsVerified(true);
        }
    }

    async function save_user_info() {
        setLoading(true);
        const username = document.getElementById('inp-verify-firstname').value;
        const lastname = document.getElementById('inp-verify-lastname').value;

        let response = await fetch('/api/auth/signup/saveinfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                lastname: lastname
            })
        });

        let data = await response.json();
        console.log(data);

        if(data.error){
            setLoading(false);
            setError(data.error);
        }
        
        if(data.state){
            setLoading(false);
            router.push('/login');
        }
    }

    return (<>
        <div className="text-center font-bold text-3xl my-7"> {isVerified ? <>Tell us about you</> : <>Verify your OTP</> }</div>
        <div>
            {
                isVerified ?
                <></>
                :
                <div className="my-4 text-sm">
                    <p className="text-center">
                        We sent an OTP to your email.
                    </p>
                </div>    
            }
            
            {
                isVerified ?
                <div>
                    <Input id="inp-verify-firstname" className="p-6 mb-2" type="text" placeholder="First name" />
                    <Input id="inp-verify-lastname" className="p-6 mb-2" type="text" placeholder="Last name" />

                    {
                        loading ?
                            <Button disabled onClick={save_user_info} className="bg-emerald-600 hover:bg-emerald-700 w-full py-6 text-sm">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Continue
                            </Button>

                        :
                        <Button onClick={save_user_info} className="bg-emerald-600 hover:bg-emerald-700 w-full py-6 text-sm">Continue</Button>
                    }
                </div>
                :
                <div>
                    <Input id="inp-verify-otp" className="p-6 mb-2" type="text" placeholder="OTP" />
                    {error && <div className="text-center text-red-500 text-sm my-2">{error}</div>}

                    {
                        loading ?
                            <Button disabled onClick={verify_otp} className="bg-emerald-600 hover:bg-emerald-700 w-full py-6 text-sm"> 
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Verify
                            </Button>
                        :
                        <Button onClick={verify_otp} className="bg-emerald-600 hover:bg-emerald-700 w-full py-6 text-sm">Verify</Button>
                    }
                </div>
            }
        </div>
    </>);
}