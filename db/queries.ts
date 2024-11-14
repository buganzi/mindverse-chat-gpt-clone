import mongoose, {Document} from 'mongoose';
import { User, Chat, Message } from './schema';

// Connect to MongoDB
await mongoose.connect(process.env.MONGO_URL!, {});

// Define Types for TypeScript
interface IUser extends Document {
    email: string;
    name: string;
}

export interface IChat extends Document {
    _id: mongoose.Types.ObjectId;
    userId: string;
    title: string;
    createdAt: Date;
}

export interface IMessage extends Document {
    chatId: string;
    role: string;
    content: string; // Adjust type as per your content structure
    createdAt: Date;
}

// Get user by email
export async function getUser(email: string): Promise<IUser[]> {
    try {
        return await User.find({ email });
    } catch (error) {
        console.error('Failed to get user from database', error);
        throw error;
    }
}

// Create a new user
export async function createUser(email: string, name: string): Promise<IUser> {

    try {
        return await User.create({ email, name });
    } catch (error) {
        console.error('Failed to create user in database', error);
        throw error;
    }
}

// Save a new chat
export async function saveChat({
                                   id,
                                   userId,
                                   title,
                               }: {
    id: string;
    userId: string;
    title: string;
}): Promise<IChat> {
    try {
        return await Chat.create({
            _id: new mongoose.Types.ObjectId(id),
            createdAt: new Date(),
            userId,
            title,
        });
    } catch (error) {
        console.error('Failed to save chat in database', error);
        throw error;
    }
}

// Delete a chat by its ID
export async function deleteChatById({ id }: { id: string }): Promise<void> {
    try {
        await Message.deleteMany({ chatId: id });
        await Chat.findByIdAndDelete(id);
    } catch (error) {
        console.error('Failed to delete chat by id from database', error);
        throw error;
    }
}

// Get chats by user ID
export async function getChatsByUserId({ id }: { id: string }): Promise<IChat[]> {
    try {
        return await Chat.find({ userId: id }).sort({ createdAt: -1 });
    } catch (error) {
        console.error('Failed to get chats by user from database', error);
        throw error;
    }
}

// Get a specific chat by ID
export async function getChatById({ id }: { id: string }): Promise<IChat | null> {
    try {
        return await Chat.findById(id);
    } catch (error) {
        console.error('Failed to get chat by id from database', error);
        throw error;
    }
}

// Save multiple messages
export async function saveMessages({ messages }: { messages: IMessage[] }): Promise<IMessage[]> {
    try {
        return await Message.insertMany(messages);
    } catch (error) {
        console.error('Failed to save messages in database', error);
        throw error;
    }
}

// Get messages by chat ID
export async function getMessagesByChatId({ id }: { id: string }): Promise<IMessage[]> {
    try {
        return await Message.find({ chatId: id }).sort({ createdAt: 1 });
    } catch (error) {
        console.error('Failed to get messages by chat id from database', error);
        throw error;
    }
}
