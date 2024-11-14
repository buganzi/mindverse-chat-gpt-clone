'use client';
import React from 'react';
import {ImArrowUpRight2} from "react-icons/im";
import ModelSelection from "@/components/ModelSelection";
import { useChat } from 'ai/react';

const ChatInput = ({id, pasteValue}: {id: string, pasteValue: string}) => {
    const {
        // messages,
        input, handleInputChange, handleSubmit
    } = useChat({});
    const [
        loading,
        // setLoading
    ] = React.useState(false);

    // update input value when pasting
    React.useEffect(() => {
        if (pasteValue) {
            // @ts-expect-error it is fine
            handleInputChange({target: {value: pasteValue}});
        }
    }, [pasteValue]);
    return (
        <div className="w-full flex flex-col items-center justify-center max-w-3xl mx-auto pt-3 pt-3 px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white/10 rounded-lg flex items-center px-4 py-2.5 w-full">
                <input type="text"
                       placeholder="Type your message here"
                       onChange={handleInputChange}
                       value={input}
                       className="w-full bg-transparent w-full text-white placeholder:text-gray-400 font-medium tracking-wide px-3 outline-none w-full"
                       disabled={loading}
                />
                <button
                    type={"submit"}
                    disabled={!input}
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
                <ModelSelection />
            </div>
        </div>
    );
};

export default ChatInput;
