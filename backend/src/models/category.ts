import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document{
    userId: String,
    name: String,
    color?: String 
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