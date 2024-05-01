"use client";
import "./IntractionInput.css";
import { useCompletion } from 'ai/react';
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizonal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function IntractionInput({ chatId, messages, setMessages }) {
    
    let [newMessage, setNewMessage] = useState(null); // new message to be added in messages array, after creating a message
    let [loading, setLoading] = useState(false);

    const {
        completion, // (store the response and after finish store null) Type: string (or null if there's no result)
        input, // (message or prompt to send to the API) Type: string
        stop, // (stops the request) Type: function (For Future Use)
        isLoading, // ( true when the request is loading, false when it's done or not) Type: boolean
        handleInputChange, // (sets the value of 'input') Type: function
        handleSubmit, // (sends the request) Type: function
    } = useCompletion({
        api: '/api/chat',
        body: {
            chat_id: chatId
        },
        onFinish: async (prompt, completion) => { // To save the response in database
            let response = await fetch('/api/chat/messages/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ chat_id: parseInt(chatId), ai_response: completion })
            });
            console.log(prompt, completion);
            let data = await response.json();

            if (data.error) {
                setNewMessage(null);
                return console.log(data.error);
            }
            if (data.state) {
                setNewMessage(null);
            }
        }
    });
    
    const router = useRouter();
    let sendMsg = chatId ? sendMessage : createNewChat; // if chat is present then send message in chat else create new chat :)

    let holdKey = null;
    function onKeyPress(e) {
        if (holdKey != "Shift" && e.key == "Enter" && !loading) { sendMsg(e); }
        if (!holdKey) holdKey = e.key;
    }
    function onKeyRelease(e) {
        if (holdKey == e.key) holdKey = null;
    }

    async function createNewChat() {
        setLoading(true);

        let response = await fetch('/api/chat/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: input })
        });

        let data = await response.json();

        if (data.error) {
            setLoading(false);
            return console.log(data.error);
        }

        if (data.state) {
            setLoading(false);
            console.log(data);
            router.push(`/chats/${data.chat_id}`);
        }
    }

    async function sendMessage(e) {
        setLoading(true);
        let response = await fetch('/api/chat/messages/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ chat_id: chatId, message: input })
        });
        let data = await response.json();
        if (data.error) {
            setLoading(false);
            return console.log(data.error);
        }

        if(data.response){
            const updatedMessages = [...messages, data.response];
            setMessages(updatedMessages);
            setNewMessage(data.response);
            handleSubmit(e); // Get stream response from AI
            setLoading(false);
        }
    }
    
    useEffect(()=> {
        if(messages && newMessage){
            newMessage.ai_response = completion;
            for(let i=0; i<messages.length; i++){
                if(messages[i].id == newMessage.id){
                    setMessages([...messages.slice(0, i), newMessage, ...messages.slice(i+1)]);
                    break;
                }
            }
        }
    }, [completion, messages, newMessage, setMessages]);

    return (
        <div>
            <div className="flex flex-row items-start p-4 space-x-4">
                <Textarea id="id-inp-intraction" onKeyDown={onKeyPress} onKeyUp={onKeyRelease} onChange={handleInputChange} className="h-[25px] max-h-[100px] px-5 py-4 text-[16px] font-[425] bg-transparent border-gray-400 rounded-[23px] text-white resize-none" placeholder="Message mindcase..." disabled={loading || isLoading} />
                <Button onClick={sendMsg} className="self-center" disabled={loading || isLoading}>
                    { loading || isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizonal className="h-4 w-4" /> }
                </Button>
            </div>
        </div>
    );
}