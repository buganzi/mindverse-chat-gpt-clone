import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {CoreMessage, CoreUserMessage, generateText, Message, ToolInvocation} from "ai";
import {openai} from "@ai-sdk/openai";
import {IMessage} from "@/db/queries";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getMostRecentUserMessage(messages: Array<CoreMessage>) {
    const userMessages = messages.filter((message) => message.role === 'user');
    return userMessages.at(-1);
}

export async function generateTitleFromUserMessage({
                                                       message,
                                                   }: {
    message: CoreUserMessage;
}) {
    const { text: title } = await generateText({
        model: openai('gpt-3.5-turbo'),
        system: `\n
    - you will generate a short title based on the first message a user begins a conversation with
    - ensure it is not more than 80 characters long
    - the title should be a summary of the user's message
    - do not use quotes or colons`,
        prompt: JSON.stringify(message),
    });

    return title;
}

interface ApplicationError extends Error {
    info: string;
    status: number;
}

export const fetcher = async (url: string) => {
    const res = await fetch(url);

    if (!res.ok) {
        const error = new Error(
            'An error occurred while fetching the data.'
        ) as ApplicationError;

        error.info = await res.json();
        error.status = res.status;

        throw error;
    }

    return res.json();
};

export function convertToUIMessages(
    messages: Array<IMessage>
): Array<Message> {
    return messages.reduce((chatMessages: Array<Message>, message) => {

        let textContent = '';
        const toolInvocations: Array<ToolInvocation> = [];

        if (typeof message.content === 'string') {
            textContent = message.content;
        }

        chatMessages.push({
            id: message.id,
            role: message.role as Message['role'],
            content: textContent,
            toolInvocations,
        });

        return chatMessages;
    }, []);
}
