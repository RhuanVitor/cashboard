import { Router } from "express";
import userRoutes from "./user.routes";
import transactionRoutes from "./transaction.route"

const router = Router();

router.use('/user', userRoutes)
router.use('/transactions', transactionRoutes)

export default router;