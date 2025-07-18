import mongoose, { Schema, Document } from 'mongoose'

export interface ITransaction extends Document {
  userId: string
  value: number
  date: Date
  category: string
}

const transactionSchema = new Schema<ITransaction>({
  userId: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true
  }
})

export const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema)
