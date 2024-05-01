"use client"
import "./ShowChat.css"
import { AlignLeft } from "lucide-react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ShowChatButton() {
    const [showChat, setShowChat] = useState(false);

    function displayChats() {
        let chatBox = document.getElementById("id-chat-box");
        let chatBoxButton = document.getElementById("id-btn-show-chat");
        if(!chatBox.style.display || chatBox.style.display === "none") {
            chatBox.style.position = "absolute";
            chatBox.style.top = "0";
            chatBox.style.left = "0";
            chatBox.style.zIndex = "1";
            chatBox.style.width = "260px";
            chatBox.style.display = "block";

            chatBoxButton.classList.add("attach-showChatBtn");
            setShowChat(true);
        }
        else {
            chatBox.style.display = "none";
            chatBoxButton.classList.remove("attach-showChatBtn");
            setShowChat(false);
        }
    }

    return (
        <Button id="id-btn-show-chat" onClick={displayChats} className="btn-show-chat" variant="outline" size="icon">
            {showChat ? <X className="h-4 w-4" /> : <AlignLeft className="h-4 w-4" />}
        </Button>
    )
}
