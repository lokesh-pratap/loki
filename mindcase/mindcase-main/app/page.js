import "./style.css";
import Image from "next/image";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import verifyToken from "@/utils/verifyToken";
import Link from "next/link";

import Version from "@/components/home/Version";
import ShowChatButton from "@/components/home/ShowChat";
import IntractionInput from "@/components/home/IntractionInput";
import Accounts from "@/components/home/Accounts";
import Chats from "@/components/home/Chats";

export default async function Page() {
	try { // user account verification
		const cookieStore = cookies();
		const session = cookieStore.get('session');
	
		if (!session) {
			redirect('/login');
		}
		await verifyToken(session.value, process.env.JWT_SESSION_SECRET);
	} catch (error) {
		console.log(`ERROR (/app): ${error}`);
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
						<Chats currentChatId={null} />
					</div>
					<div className="p-[15px] mt-auto" > <Accounts /> </div>
				</div>
			</div>

			<div className='h-screen grow flex flex-col relative bg-[#343541]' >
				<div className="absolute top-0 right-0 p-2.5 w-full box-border z-[5] bg-[#3435418f]" >
					<ShowChatButton />
					<Version title={"mindcase"} />
				</div>

				<div className="flex-1 flex h-full flex-col items-center justify-center font-medium text-xl">
					<div className="my-2"> <Image className="mt-8" src="/mindcaseLogoWhite.png" width="65" height="65" alt="image not found!" /> </div>
					<div>How can I help you today?</div>
					<div className="text-xs">"Creating a new chat might take some time. Streaming text while creating a new chat not supported yet!"</div>
				</div>
				<div>
					<IntractionInput/>
				</div>
			</div>
		</div>
	);
}