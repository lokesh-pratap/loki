"use client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings } from "lucide-react";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";

export default function Accounts() {
    const [userInfo, setUserInfo] = useState(null);
    
    async function getUserDetails(){
        let response = await fetch('/api/user/info');
        let data = await response.json();
        setUserInfo(data.userinfo);
    }

    useEffect(() => {
        getUserDetails();
    }, []);

    return (<>
        <DropdownMenu>
            { 
                userInfo ? 
                    <DropdownMenuTrigger className="flex items-center w-full p-2.5 text-left hover:bg-slate-600 rounded-md border-transparent">
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <span className="ml-2.5 text-sm font-medium">{userInfo.name}</span>
                    </DropdownMenuTrigger>
                :
                <></>
            }
            <DropdownMenuContent className="w-56 bg-[#202123] text-white border-slate-800">
                <DropdownMenuItem className="py-2.5 hover:!text-white hover:!bg-slate-700"> <Settings className="h-4 w-4 mr-2" />Settings</DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem className="py-2.5 hover:!text-white hover:!bg-slate-700"><LogOut className="h-4 w-4 mr-2" />Log out</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </>);    
}