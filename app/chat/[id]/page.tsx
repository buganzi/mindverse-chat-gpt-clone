'use client';
import React, {useEffect, useRef} from 'react';
import {BsArrowDownCircle} from "react-icons/bs";
import MessageItem from "@/components/Message";
import {ImArrowUpRight2} from "react-icons/im";
import {useChat} from "ai/react";
import useSWR, {mutate} from "swr";
import {IMessage} from "@/db/queries";
import {convertToUIMessages, fetcher} from "@/lib/utils";
import {useSession} from "next-auth/react";
import mongoose from "mongoose";

interface Props {
    params: {
        id: string;
    };
}

const ChatPage = ({params: {id}}: Props) => {
    let chatId = id;
    if (!id || id==='') {
        chatId = new mongoose.Types.ObjectId().toString();
    }
    const { data: session } = useSession();
    const {
        data: initialMessages,
    } = useSWR<Array<IMessage>>(session?.user ? `/api/chats/${chatId}/messages` : null, fetcher, {
        fallbackData: [],
    });

    const {
        messages,
        // setMessages,
        handleSubmit,
        handleInputChange,
        input,
        // setInput,
        // append,
        isLoading,
        // stop,
        // data: streamingData,
    } = useChat({
        body: { id:chatId },
        initialMessages: initialMessages !== undefined ?convertToUIMessages(initialMessages):[],
        onFinish: () => {
            mutate('/api/chats');
        },
    });

    const bottomRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({behavior: "smooth"});
        }
    }, [messages]);
    return (
        <div className="flex flex-col justify-center h-[100%] p-5 overflow-hidden">
            <div className="flex-1 overflow-y-scroll pt-10">
                {/*<Chat id={id}/>*/}
                <div className="max-w-3xl mx-auto">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center gap-2 py-5">
                            <p>Type a prompt in below to get started!</p>
                            <BsArrowDownCircle className="text-xl text-green-300 animate-bounce"/>
                        </div>
                    )}
                    {messages.map((message, index) => (
                        <div key={message.id}>
                            <MessageItem message={message}/>
                            {index < messages.length - 1 && <div className=""/>}
                        </div>
                    ))}
                    <div ref={bottomRef}/>
                </div>
            </div>
            {/*<ChatInput id={id}/>*/}
            <div className="w-full flex flex-col items-center justify-center max-w-3xl mx-auto pt-3 pt-3 px-4">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white/10 rounded-full flex items-center px-4 py-2.5 w-full">
                    <input type="text"
                           placeholder="Type your message here"
                           onChange={handleInputChange}
                           value={input}
                           className="w-full bg-transparent w-full text-white placeholder:text-gray-400 font-medium tracking-wide px-3 outline-none w-full"
                           disabled={isLoading}
                    />
                    <button
                        type={"submit"}
                        disabled={!input}
                        className="p-2.5 rounded-full text-black bg-white disabled:bg-white/30">
                        <ImArrowUpRight2 className="text-sm -rotate-45 text-black/80"/>
                    </button>
                </form>
                {chatId && (
                    <p className="text-xs mt-2 font-medium tracking-wide">
                        ChatGPT can make mistakes. Check important info.
                    </p>
                )}
                <div className="w-full mt-2">
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
