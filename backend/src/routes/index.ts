import { Router } from "express";
import userRoutes from "./user.routes.js";
import transactionRoutes from "./transaction.route.js"
import categoryRoutes from "./category.route.js"

const router = Router();

router.use('/users', userRoutes);
router.use('/transactions', transactionRoutes);
router.use('/categories', categoryRoutes);

export default router;