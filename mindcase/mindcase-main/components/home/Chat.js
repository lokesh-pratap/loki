import Link from "next/link";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export default function Chat({ currentChatId, chatId, title, path }) {
    let isDeleting = false;
    const router = useRouter();
    if(title.length > 25){
        title = title.slice(0, 22);
        title = title + "...";
    }

    async function deleteChat() {
        if(isDeleting) return;
        isDeleting = true;
        const response = await fetch("/api/chat/delete", {
            method: "POST",
            body: JSON.stringify({
                chatId: chatId
            })
        });
        const data = await response.json();
        if(data.error) return console.log(data.error);
        if(data.state){
            router.push("/");
        }
    }

    return (<div className="flex m-2 p-2 justify-between items-center rounded-md hover:bg-slate-700">
        <Link className="grow" href={path}>
            {title}
        </Link>
        {
            currentChatId === chatId ?
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <MoreHorizontal className="h-4 w-4 text-gray-400 rounded-md" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-[#202123] text-white border-slate-800">
                        <DropdownMenuItem onClick={deleteChat} className="py-2.5 text-rose-400 hover:!text-rose-400 hover:!bg-slate-700">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete chat
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            :
            <></>
        }
    </div>);
}