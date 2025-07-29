import { Router } from "express";
import { createTransaction, deleteTransaction, updateTransaction, getTransactions } from "../controllers/transaction.controller.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = Router()

router.post('/', verifyToken, createTransaction);
router.get('/', verifyToken, getTransactions);
router.put('/:id', verifyToken, updateTransaction);
router.delete('/:id', verifyToken, deleteTransaction);

export default router;
