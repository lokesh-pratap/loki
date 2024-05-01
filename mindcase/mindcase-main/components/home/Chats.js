"use client";
import "./Chats.css";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";

import Chat from "@/components/home/Chat";

export default function Chats({currentChatId}) {
    const [chats, setChats] = useState(null);

    async function getChats() {
        const response = await fetch("/api/chat/get");
        const data = await response.json();
        setChats(data.chats);
    }

    useEffect(() => {
        getChats();
    }, []);

    return (<>
        <div id="id-chats" className="h-[100px] grow overflow-y-scroll">
            {
                chats ? 
                    chats.map((chat) => {
                        return <Chat key={chat.id} currentChatId={currentChatId} title={chat.title} chatId={chat.id} path={`/chats/${chat.id}`} />
                    })
                :
                <div className="flex h-full justify-center items-center">
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                </div>
            }

        </div>
    </>);
}