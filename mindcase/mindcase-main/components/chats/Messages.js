import "./Messages.css";
import { Loader2 } from "lucide-react"
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function ResponseMessage({content}){
    return (<>
        <div className="px-[10%] py-3 flex">
            <Avatar className="w-6 h-6">
                <AvatarImage src="/mindcaseLogoWhite.png"/>
                <AvatarFallback>mc</AvatarFallback>
            </Avatar>
            <div className="mx-4">
                <div className="pb-1 text-sm font-semibold">mindcase</div>
                <div className="text-[15px]">{content}</div>
            </div>
        </div>
    </>);
}

function RequestMessage({username, content}){
    return (<>
        <div className="px-[10%] py-3 flex">
            <Avatar className="w-6 h-6">
                <AvatarImage src="https://github.com/shadcn.png"/>
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="mx-4">
                <div className="pb-1 text-sm font-semibold">{username}</div>
                <div className="text-[15px]">{content}</div>
            </div>
        </div>
    </>);
}

export default function Messages({chatId, userInfo, messages}) {
    const messageContainer = useRef(null);
     
    useEffect(() => {
        if(messageContainer.current) messageContainer.current.scrollTop = messageContainer.current.scrollHeight;
    }, [messages]);

    return (<>
        <div ref={messageContainer} id="id-messages" className="h-[100px] pt-10 grow overflow-y-scroll flex flex-col justify-start">
            {
                messages ? 
                    messages.map((message, index) => <span key={index}>
                        {
                            userInfo ?
                                <RequestMessage username={userInfo.name} content={message.user_request}/>
                            :
                            <RequestMessage username="Shad" content={message.user_request}/>
                        }
                        <ResponseMessage content={message.ai_response}/>
                    </span>)
                    
                : 
                <div className="flex justify-center"> <Loader2 className="h-6 w-6 animate-spin" /> </div>
            }
        </div>
    </>);
}