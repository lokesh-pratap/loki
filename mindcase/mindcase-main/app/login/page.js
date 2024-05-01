import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";

import LoginButton from "@/components/login/LoginButton";
import GoogleAuth from "@/components/GoogleAuth";

export default function Page() {

    return (
        <div className="flex flex-col items-center">
            <header>
                <Image className="mt-8" src="/mindcaseLogoBlack.png" width="35" height="35" alt="image not found!" />
            </header>
            <main className="m-36 w-80">
                <div className="text-center font-bold text-3xl p-7">Welcome back</div>
                <div>
                    <div>
                        <Input id="inp-login-email" className="p-6 mb-2" type="text" placeholder="Email Address" />
                        <Input id="inp-login-pwd" className="p-6 mb-7" type="password" placeholder="Password" />
                        <LoginButton />
                    </div>
                    <div className="my-4 text-sm">
                        <p className="text-center">
                            Don't have an account?
                            <Link href="/signup" className="m-2 text-emerald-500">Sign up</Link>
                        </p>
                    </div>
                    <div className="flex items-center w-full my-2.5">
                        <div className="mx-2 bg-gray-700 h-px grow"></div>
                        <div className="text-xs">OR</div>
                        <div className="mx-2 bg-gray-700 h-px grow"></div>
                    </div>
                    <div>
                        <GoogleAuth />
                    </div>
                </div>
            </main>
        </div>
    );
}