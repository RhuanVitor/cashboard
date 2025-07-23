import { Request, Response } from "express";

import { Category } from "../models/category.model.js";

export async function getCategories(req: Request, res: Response){
    const userId = (req as any).userId;

    try{
        const categories = await Category.find({ userId });
        
        res.status(200).json({ categories });
    } catch(error){
        res.status(500).json({
            'msg': 'A server error occurred, please try again later.'
        })

        console.log(`A server error occurred: ${error}`);
    }
}

export async function createCategory(req: Request, res: Response){
    const { name, color } = req.body;
    const userId = (req as any).userId;

    if(!name){
        return res.status(422).json({'msg': 'Name is required!'});
    }
    
    if(!color){
        return res.status(422).json({'msg': 'Color is required!'})
    }

    try{
        const category = new Category({ userId, name, color});
        await category.save();

        return res.status(201).json({ category });
    } catch(error){
        res.status(500).json({
            'msg': 'A server error occurred, please try again later.'
        })

        console.log(`A server error occurred: ${error}`);
    }
}

export async function updateCategory(req: Request, res: Response){
    const { name, color } = req.body;
    const categoryId = req.params.id;
    const userId = (req as any).userId;
}

export async function deleteCategory(req: Request, res: Response){
    const categoryId = req.params.id;
    const userId = (req as any).userId;
}