import "../../style.css";
import Image from "next/image";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import verifyToken from "@/utils/verifyToken";
import Link from "next/link";
import supabase from "@/config/supabase";


import ShowChatButton from "@/components/home/ShowChat";
import Accounts from "@/components/home/Accounts";
import Chats from "@/components/home/Chats";
import Intraction from "@/components/chats/Intraction";


export default async function Page({params}) {
	let chat_id = parseInt(params.chats);
	let redirectError = false; // due to direct won't allowed in try catch
	try { // user account verification
		const cookieStore = cookies();
		const session = cookieStore.get('session');
		if (!session) {
			redirect('/login');
		}
		let user_info = await verifyToken(session.value, process.env.JWT_SESSION_SECRET);
		
		let { data: selectChatsData, error: chatError } = await supabase.from('chats').select('*').eq('id', chat_id).eq('user_id', user_info.userid).single();
		if(!selectChatsData || chatError){
			redirectError = true;
			redirect('/', 'push');
		}
	} catch (error) {
		console.log(`ERROR (/app/chats): ${error}`);
		if(redirectError) redirect('/', 'push');
        redirect('/login');
	}

	return (
		<div className='main-container flex text-white'>

			<div id="id-chat-box" className='h-screen flex-[0_0_260px] bg-black flex flex-col'>
				<div className="flex flex-col h-full">
					<div className="flex flex-col grow">
						<Link href="/">
							<div className="h-12 m-2 flex flex-row items-center text-sm px-4 font-semibold hover:bg-slate-700 rounded-md">
								<Image src="/mindcaseLogoWhite.png" width="30" height="30" alt="image not found!" />
								<span className="pl-2">New chat</span>
							</div>
						</Link>
						<Chats currentChatId={chat_id} />
					</div>
					<div className="p-[15px] mt-auto"> <Accounts /> </div>
				</div>
			</div>

			<div className='h-screen w-full relative bg-[#343541]'>
				<div className="absolute top-0 right-0 p-2.5 w-full box-border z-[5] bg-[#3435418f]" >
					<ShowChatButton />
				</div>
				
				<Intraction chatId={chat_id} />
			</div>
		</div>
	);
}