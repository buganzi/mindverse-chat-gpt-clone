import { openai } from '@ai-sdk/openai';

import {
    convertToCoreMessages,
    Message,
    StreamData,
    streamText,
} from 'ai';

import { auth } from '@/auth';
import {
    deleteChatById,
    getChatById,
    saveChat,
    saveMessages,
} from '@/db/queries';
import {
    getMostRecentUserMessage,
    generateTitleFromUserMessage
} from '@/lib/utils';
import mongoose from "mongoose";

export const maxDuration = 60;


export async function POST(request: Request) {
    const {
        id,
        messages,
    }: { id: string; messages: Array<Message>;} =
        await request.json();
    console.log('id', id);


    const session = await auth();

    if (!session || !session.user || !session.user.id) {
        const result = await streamText({
            model: openai('gpt-4-turbo'),
            system: 'You are a helpful assistant.',
            messages,
        });

        return result.toDataStreamResponse();
    }

    const coreMessages = convertToCoreMessages(messages);
    const userMessage = getMostRecentUserMessage(coreMessages);

    if (!userMessage) {
        return new Response('No user message found', { status: 400 });
    }

    const chat = await getChatById({ id });

    if (!chat) {
        const title = await generateTitleFromUserMessage({ message: userMessage });
        await saveChat({ id, userId: session.user.id, title });
    }

    await saveMessages({
        messages: [
            { ...userMessage, _id: new mongoose.Types.ObjectId(), createdAt: new Date(), chatId: id },
        ],
    });

    const streamingData = new StreamData();

    const result = await streamText({
        model: openai('gpt-4-turbo'),
        system: 'You are a helpful assistant.',
        messages: coreMessages,
        maxSteps: 5,
        onFinish: async ({ responseMessages }) => {
            if (session.user && session.user.id) {
                try {

                    await saveMessages({
                        messages: responseMessages.map(
                            (message) => {
                                const messageId = new mongoose.Types.ObjectId();

                                if (message.role === 'assistant') {
                                    streamingData.appendMessageAnnotation({
                                        messageIdFromServer: messageId.toString(),
                                    });
                                }

                                return {
                                    id: messageId,
                                    chatId: id,
                                    role: message.role,
                                    content: message.content[0].text,
                                    createdAt: new Date(),
                                };
                            }
                        ),
                    });
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (error) {
                    console.error('Failed to save chat');
                }
            }

            streamingData.close();
        },
        experimental_telemetry: {
            isEnabled: true,
            functionId: 'stream-text',
        },
    });

    return result.toDataStreamResponse({
        data: streamingData,
    });
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return new Response('Not Found', { status: 404 });
    }

    const session = await auth();

    if (!session || !session.user) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        const chat = await getChatById({ id });

        if (chat?.userId !== session.user.id) {
            return new Response('Unauthorized', { status: 401 });
        }

        await deleteChatById({ id });

        return new Response('Chat deleted', { status: 200 });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return new Response('An error occurred while processing your request', {
            status: 500,
        });
    }
}
