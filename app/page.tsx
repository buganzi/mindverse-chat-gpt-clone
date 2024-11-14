'use client'
import ChatInput from "@/components/ChatInput";
import {useState} from "react";

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

export default function Home() {

    const [pasteValue, setPasteValue] = useState('');
    return (
    <main className="min-h-screen flex flex-col items-center justify-between px-2 h-full">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-5 w-full h-full">
            <div className="flex flex-col flex-grow justify-center items-center gap-5">
                <h2 className="text-xl md:text-3xl font-semibold text-white px-4">
                    Start with mindverse chat
                </h2>
                <div className="grid sm:grid-cols-2 gap-2 w-full max-w-3xl items-center justify-center">
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
            <ChatInput pasteValue={pasteValue}/>
        </div>
    </main>
    );
}
