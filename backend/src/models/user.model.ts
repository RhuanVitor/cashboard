import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document{
    name: string,
    email: string,
    password: string,
}

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    }
});

export const User = mongoose.model<IUser>('User', userSchema);
