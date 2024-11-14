'use client';
import React, {useEffect, useRef, useState} from 'react';
import {ImArrowUpRight2} from "react-icons/im";
import ModelSelection from "@/components/ModelSelection";
import {useChat} from "ai/react";
import {BsArrowDownCircle} from "react-icons/bs";
import MessageItem from "@/components/Message";

const suggestedActions = [
    {
        action: 'What might life look like in the year 2500?',
    },
    {
        action: 'Plan a relaxing trip to an imaginary country.',
    },
    {
        action: 'Give tips for writing a fantasy story inspired by African mythology.',
    },
    {
        action: 'How would an AI assistant make my day more productive?',
    },
];

const ChatInput = ({id}: { id: string }) => {

    const [pasteValue, setPasteValue] = useState('');

    const {messages, input, handleInputChange, handleSubmit, isLoading} = useChat({});

    // update input value when pasting
    React.useEffect(() => {
        if (pasteValue) {
            // @ts-expect-error it is fine
            handleInputChange({target: {value: pasteValue}});
        }
    }, [pasteValue]);

    const bottomRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({behavior: "smooth"});
        }
    }, [messages]);
    return (
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-5 w-full h-full">
            <div className="flex flex-col justify-center h-[100%] p-5 overflow-hidden w-full">
                {messages.length === 0 && (
                    <div className="flex flex-1 items-center justify-center pt-10">
                        <div className="max-w-3xl mx-auto">
                            <div className="flex flex-col flex-grow justify-center items-center gap-5">
                                <h2 className="text-xl md:text-3xl font-semibold text-white px-4">
                                    Start with mindverse chat
                                </h2>
                                <div
                                    className="grid sm:grid-cols-2 gap-2 w-full max-w-3xl items-center justify-center">
                                    {suggestedActions.map((suggestedAction, index) => (
                                        <button
                                            key={index}
                                            onClick={async () => setPasteValue(suggestedAction.action)}
                                            className="text-left border border-[#4A4A4A] rounded-lg px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
                                        >
                                            {/*<span className="font-medium">{suggestedAction.action}</span>*/}
                                            <span className="text-muted-foreground">
                                                    {suggestedAction.action}
                                                </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="w-full md:hidden mt-2"/>
                        </div>
                    </div>
                )}
                {messages.length > 0 && (
                    <div className="flex-1 overflow-y-scroll pt-10">
                        <div className="max-w-3xl mx-auto">
                            <div className="flex flex-col flex-grow justify-center gap-5">
                                {messages.map((message, index) => (
                                    <div key={message.id}>
                                        <MessageItem message={message}/>
                                        {index < messages.length - 1 && <div className=""/>}
                                    </div>
                                ))}
                            </div>
                            <div ref={bottomRef}/>
                        </div>
                    </div>
                )}
                <div className="w-full flex flex-col items-center justify-center max-w-3xl mx-auto pt-3 pb-3 px-4">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white/10 rounded-lg flex items-center px-4 py-2.5 w-full">
                        <input type="text"
                               placeholder="Type your message here"
                               onChange={handleInputChange}
                               value={input}
                               className="w-full bg-transparent w-full text-white placeholder:text-gray-400 font-medium tracking-wide px-3 outline-none w-full"
                               disabled={isLoading}
                        />
                        <button
                            type={"submit"}
                            disabled={!input || isLoading}
                            className="p-2.5 rounded-full text-black bg-white disabled:bg-white/30">
                            <ImArrowUpRight2 className="text-sm -rotate-45 text-black/80"/>
                        </button>
                    </form>
                    {id && (
                        <p className="text-xs mt-2 font-medium tracking-wide">
                            ChatGPT can make mistakes. Check important info.
                        </p>
                    )}
                    <div className="w-full md:hidden mt-2">
                        <ModelSelection/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatInput;
