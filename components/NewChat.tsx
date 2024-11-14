'use client'
import React from 'react';
import {FaPlus} from "react-icons/fa";
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import mongoose from "mongoose";

const NewChat = () => {
    const router = useRouter();
    const {data: session} = useSession();
    // const userEmail = session?.user?.email ?(session?.user?.email as string) : 'unknown';
    const createNewChat = async () => {
        // const doc = await addDoc(collection(db, "users",userEmail, 'chats'),
        //     {
        //         userId: userEmail,
        //         createdAt: serverTimestamp(),
        //     });
        const id = new mongoose.Types.ObjectId().toString();
        router.push(`/chat/${id}`);
    }
    return (
        <button onClick={createNewChat}
                className="flex items-center justify-center gap-2 w-full border border-white/20 text-xs md:text-base
                bg-[#4A4A4A] px-2 py-1 rounded-md text-white/50 hover:border-white/50 hover:text-white duration-300">
            New Chat
            <FaPlus/>
        </button>
    );
};

export default NewChat;
