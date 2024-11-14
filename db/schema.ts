import mongoose from 'mongoose';

const { Schema, model , models} = mongoose;

// User Schema
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        maxlength: 64,
    }
}, { timestamps: true });

const User = models.User || model('User', userSchema);

// Chat Schema
const chatSchema = new Schema({
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
});

const Chat = models.Chat || model('Chat', chatSchema);

// Message Schema
const messageSchema = new Schema({
    chatId: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    content: {
        type: Schema.Types.Mixed,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
});

const Message = models.Message || model('Message', messageSchema);

export { User, Chat, Message, chatSchema };
