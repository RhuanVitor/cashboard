import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document{
    userId: string,
    name: string,
    color?: string 
}

const categorySchema = new Schema<ICategory>({
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: false
    }
})

export const Category = mongoose.model<ICategory>('category', categorySchema) 