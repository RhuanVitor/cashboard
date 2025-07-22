import { Router } from "express";
import userRoutes from "./user.routes.js";
import transactionRoutes from "./transaction.route.js"

const router = Router();

router.use('/user', userRoutes)
router.use('/transactions', transactionRoutes)

export default router;