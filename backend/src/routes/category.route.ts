import { Router } from 'express';

import { verifyToken } from "../middlewares/authMiddleware.js";
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/category.controller.js'; 

const route = Router();

route.get('', verifyToken, getCategories);
route.post('', verifyToken, createCategory);
route.put('/:id', verifyToken, updateCategory);
route.delete('/:id', verifyToken, deleteCategory);

export default route;