import { DocumentData } from "firebase/firestore";
import Image from "next/image";
import React from "react";
import {mindVerseAvatar} from "@/app/assets";
interface Props {
    message: DocumentData;
}

const MessageItem = ({ message }: Props) => {
    const isMindVerse = message.role !== "user";
    return (
        <div className={`py-5 text-white `}>
            <div className="flex space-x-2.5 md:space-x-5 md:px-10">
                {isMindVerse && (<div className="border border-gray-600 w-9 h-9 rounded-full p-1 overflow-hidden">
                    <Image
                        src={mindVerseAvatar}
                        alt="userImage"
                        width={100}
                        height={100}
                        className="w-full h-full rounded-full object-cover"
                    />
                </div>)}

                <div
                    className={`flex flex-col max-w-md ${
                        isMindVerse ? "items-start" : "items-end w-full"
                    }`}
                >
                    <p
                        className={`${
                            isMindVerse ? "bg-[#2F2F2F30]" : "bg-[#2F2F2F]"
                        } px-4 py-2 rounded-lg shadow-sm text-base font-medium tracking-wide whitespace-pre-wrap`}
                    >
                        {message.content}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MessageItem;
