import { Request, Response } from "express";

import { Transaction } from "../models/transaction.model.js";

export async function getTransactions(req: Request, res: Response){

    const MAX_LIMIT_PER_REQUEST = 3;
    let requestedLimit = parseInt(req.query.limit as string) || 20;
    const limit = Math.min(requestedLimit, MAX_LIMIT_PER_REQUEST);


    const {categoryId, minValue, maxValue, date, startDate, endDate } = req.query;

    const cursor = req.query.cursor as string | undefined;
    const sortBy = (req.query.sorterBy as string) || 'date';
    const orderBy = (req.query.orderBy as string) || 'desc';

    const allowedSortBy = [ 'date', 'value' ];

    const sortOptions: any = {};
    const order = orderBy === 'asc' ? 1 : -1;
    sortOptions[sortBy] = order;
    sortOptions._id = -1;

    if(!allowedSortBy.includes(sortBy)){
        return res.status(422).json({'msg': 'Invalid sort value. Allowed values: date, value'})
    }

    const userId = (req as any).userId;

    const filter: any = { userId };

    if(categoryId){
        filter.categoryId = categoryId;
    }

    if(minValue || maxValue){
        filter.value = {};

        if(minValue) filter.value.$gte = Number(minValue);
        if(maxValue) filter.value.$lte = Number(maxValue);

    }

    if(date){
        const target = new Date(date as string);

        target.setHours(0, 0, 0, 0);

        const next = new Date(target);

        next.setDate(target.getDate() + 1);

        filter.date = { $gte: date, $lte: next};

    } else if(startDate && endDate){
        filter.date = {};
        if(startDate) filter.date.$gte = new Date(startDate as string);
        if(endDate) filter.date.$lte = new Date(endDate as string);
    }

    const isDefaultSortForCursor = sortBy === 'date' && orderBy === 'desc';
    if (cursor && isDefaultSortForCursor) {
        try {
            const [lastDateStr, lastId] = Buffer.from(cursor, 'base64').toString('ascii').split('_');
            const lastDate = new Date(lastDateStr);

            if (!lastDate || !lastId) {
                return res.status(400).json({ msg: 'Formato do cursor inválido.' });
            }
            
            filter.$or = [
                { date: { $lt: lastDate } },
                { date: lastDate, _id: { $lt: lastId } }
            ];
        } catch (error) {
            return res.status(400).json({ msg: 'Erro ao processar o cursor.' });
        }
    }
//

    try{

        const transactions = await Transaction.find(filter)
            .sort(sortOptions)
            .limit(limit);

        let nextCursor: string | null = null;
        if (transactions.length === limit && isDefaultSortForCursor) {
            const lastTransaction = transactions[transactions.length - 1];
            nextCursor = Buffer.from(`${lastTransaction.date.toISOString()}_${lastTransaction._id}`).toString('base64');
        }

        res.status(200).json({
            transactions,
            nextCursor
        });
        
    }catch(error){
        res.status(500).json({
            'msg': 'A server error occurred, please try again later.'
        })

        console.log(`A server error occurred: ${error}`);
    }
}

export async function createTransaction(req: Request, res: Response){
    const { name, value, categoryId, date } = req.body;
    const userId = (req as any).userId; 

    if(!name){
        return res.status(422).json({'msg': 'Name is required!'})
    }

    if(!value){
        return res.status(422).json({'msg': 'Value is required!'})
    }

    if(!categoryId){
        return res.status(422).json({'msg': 'Category ID is required!'})
    }

    if(!date){
        return res.status(422).json({'msg': 'Date is required!'});
    }

    try{
        const transaction = new Transaction({name, value, categoryId, userId, date});

        await transaction.save();

        res.status(201).json({'msg': 'Transaction added successfully!', transaction});
    } catch (error){
        res.status(500).json({
            'msg': 'A server error occurred, please try again later.'
        })

        console.log(`A server error occurred: ${error}`);
    }
}

export async function updateTransaction(req: Request, res: Response){
    const transactionId = req.params.id;
    const userId = (req as any).userId;

    const { name, value, categoryId, date } = req.body

    if(!name){
        return res.status(422).json({'msg': 'Name is required!'})
    }

    if(!value){
        return res.status(422).json({'msg': 'Value is required!'})
    }

    if(!categoryId){
        return res.status(422).json({'msg': 'Category ID is required!'})
    }

    if(!date){
        return res.status(422).json({'msg': 'Date is required!'})
    }

    if(!transactionId){
        return res.status(422).json({'msg': 'The transaction ID is required as a URL parameter!'});
    }

    try{
        const transaction = await Transaction.findOneAndUpdate(
            { _id: transactionId, userId},
            { name, value, categoryId, date },
            { new: true }
        );

        if (!transaction) return res.status(404).json({ msg: 'Transaction not found or unauthorized' });

        res.status(200).json({ msg: 'Updated!', transaction });

    } catch (error){
        res.status(500).json({
            'msg': 'A server error occurred, please try again later.'
        })

        console.log(`A server error occurred: ${error}`);
    }
}

export async function deleteTransaction(req: Request, res: Response){
    const transactionId = req.params.id;
    const userId = (req as any).userId;

    if(!transactionId){
        return res.status(422).json({'msg': 'The transaction ID is required as a URL parameter!'});
    }

    try{
        const transaction = await Transaction.findOneAndDelete(
            { _id: transactionId, userId},
        );

        if (!transaction) return res.status(404).json({ msg: 'Transaction not found or unauthorized' });

        res.status(200).json({ msg: 'Transaction deleted!', transaction });

    } catch (error){
        res.status(500).json({
            'msg': 'A server error occurred, please try again later.'
        })

        console.log(`A server error occurred: ${error}`);
    }    
}