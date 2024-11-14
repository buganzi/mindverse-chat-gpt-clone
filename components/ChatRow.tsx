"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BiSolidTrashAlt } from "react-icons/bi";
import { IoChatboxOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import useSWR from "swr";
import {IChat} from "@/db/queries";
import {fetcher} from "@/lib/utils";
import toast from "react-hot-toast";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
interface Props {
    id: string;
    index: number;
}

const ChatRow = ({ id }: Props) => {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = useSession();
    const [active, setActive] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        data: chats,
        isLoading,
        // mutate,
    } = useSWR<Array<IChat>>(session?.user ? `/api/chats/${id}` : null, fetcher, {
        fallbackData: [],
    });

    useEffect(() => {
        if (!pathname) return;
        setActive(pathname.includes(id));
    }, [pathname, id]);

    const {
        data: chatsSnapshot,
        mutate,
    } = useSWR<Array<IChat>>(session?.user ? '/api/chats' : null, fetcher, {
        fallbackData: [],
    });

    const handleRemoveChat = async () => {
        const deletePromise = fetch(`/api/chat?id=${id}`, {
            method: 'DELETE',
        });
        // await deleteDoc(
        //     doc(db, "users", session?.user?.email as string, "chats", id)
        // );
        // Set default active
        await toast.promise(deletePromise, {
            loading: "Deleting chat...",
            success: "Chat deleted successfully",
            error: "Failed to delete chat",
        });
        mutate();
        if (active) {
            const nextChat = chatsSnapshot?.find((chat) => chat._id.toString() !== id);
            if (nextChat) {
                router.push(`/chat/${nextChat._id.toString()}`);
            } else {
                // No chats available, redirect to the homepage or another default route
                router.push("/");
            }
        } else {
            // Refresh chats
            //mutate('/api/chats');
        }
    };
    let chat: IChat | undefined;
    if (chats) {
        chat = chats[0];
    }

    const chatText = chat?.title || "New Chat";
    const shouldAnimate = active;

    return (
        <Link
            href={`/chat/${id}`}
            className={`flex gap-2 items-center justify-center px-2 py-1.5 hover:bg-white/10 rounded-md mb-2 duration-300 ease-in ${
                active ? "bg-white/10" : "bg-transparent"
            }`}
        >
            <IoChatboxOutline />
            {/* <p className="hidden md:inline-flex truncate flex-1 text-sm font-medium tracking-wide">
        {messages?.docs[messages?.docs?.length - 1]?.data().text || "New Chat"}
      </p> */}
            <div className="relative flex-1 select-none overflow-hidden text-ellipsis break-all">
        <span className="whitespace-nowrap">
          {shouldAnimate ? (
              chat?.title ? (
                  chat.title.split("").map((character: string, index: number) => (
                      <motion.span
                          key={index}
                          variants={{
                              initial: {
                                  opacity: 0,
                                  x: -100,
                              },
                              animate: {
                                  opacity: 1,
                                  x: 0,
                              },
                          }}
                          initial={shouldAnimate ? "initial" : undefined}
                          animate={shouldAnimate ? "animate" : undefined}
                          transition={{
                              duration: 0.25,
                              ease: "easeIn",
                              delay: index * 0.05,
                              staggerChildren: 0.05,
                          }}
                      >
                  <span className="text-sm font-medium tracking-wide text-green-400">
                    {character}
                  </span>
                      </motion.span>
                  ))
              ) : (
                  <span className="text-sm font-medium tracking-wide">
                {isLoading ? <span>....</span> : chatText}
              </span>
              )
          ) : (
              <span className="text-sm font-medium tracking-wide">
              {isLoading ? <span>....</span> : chatText}
            </span>
          )}
        </span>
            </div>
            <BiSolidTrashAlt
                onClick={() => setIsModalOpen(true)}
                className="text-white/50 hover:text-red-700 duration-300 ease-in-out"
            />
            <DeleteConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleRemoveChat}
            />
        </Link>
    );
};

export default ChatRow;
