"use client";
import { useSession } from "next-auth/react";
import NewChat from "./NewChat";
import ChatRow from "./ChatRow";
import { RiSettings4Line } from "react-icons/ri";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import {fetcher} from "@/lib/utils";
import { IChat } from "@/db/queries";

const SideBar = () => {
    const { data: session } = useSession();
    const {
        data: chats,
        isLoading,
        mutate,
    } = useSWR<Array<IChat>>(session?.user ? '/api/chats' : null, fetcher, {
        fallbackData: [],
    });


    const router = useRouter();

    useEffect(() => {
        if (!chats) {
            router.push("/");
        }
    }, [chats, router]);

    useEffect(() => {
        mutate()
    }, [mutate]);

    return (
        <div className="hidden md:inline-flex flex-col w-full h-screen p-2.5 relative">
            {/* New Chat */}
            <div className="flex items-center justify-between gap-1">
                <Link
                    href={"/"}
                    className="font-bold text-xs md:text-base p-1.5 md:p-2 rounded-md text-white hover:text-white hover:border-white/50 duration-300 ease-in-out"
                >
                    Mindverse Chat
                </Link>
                <RiSettings4Line />
            </div>

            <div className="hidden md:inline mt-4 w-full">
                <NewChat />
            </div>
            {session?.user ? (
                <>
                    <p className="text-white mt-4 px-2 text-sm font-medium">
                        Chat History
                    </p>
                    <div className="mt-4 overflow-y-scroll h-[80%]">
                        {isLoading ? (
                            <div className="flex flex-col flex-1 space-y-2 overflow-auto">
                                {Array.from({ length: 10 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-full h-8 rounded-md shrink-0 animate-pulse bg-zinc-800"
                                    />
                                ))}
                            </div>
                        ) : chats?.length ? (
                            chats?.map((chat, index) => (
                                <ChatRow key={chat?._id.toString()} id={chat?._id.toString()} index={index} />
                            ))
                        ) : (
                            <div className="py-8 text-center">
                                <p className="text-sm text-muted-foreground">No chat history</p>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                !isLoading && (
                    <div className="text-sm font-medium text-center mt-10">
                        <p>Please sign in to view history</p>
                        <Link
                            href={"/signin"}
                            className="text-xs hover:text-white duration-300 mt-2 underline decoration-[1px]"
                        >
                            Sign in
                        </Link>
                    </div>
                )
            )}
        </div>
    );
};

export default SideBar;
