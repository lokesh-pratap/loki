import Link from "next/link";
import { FaGoogle } from "react-icons/fa";

export default function GoogleAuth() {
    return (<div className="py-3.5 border border-gray-300 rounded-md bg-white text-black w-full hover:bg-gray-200 ">
        <Link href="#" className="flex items-center justify-center"> <FaGoogle className="mx-3"/> Continue with Google</Link>
    </div>);
}