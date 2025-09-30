import express from 'express';
import {
    getInventoryHistory,
    getProductById,
    getProducts,
    updateInventory
} from '../controllers/productController.mjs';
import { authenticate } from '../middlewares/authMiddleware.mjs';

const router = express.Router();

// Rutas públicas
router.get('/', getProducts);
router.get('/:id', getProductById);

// Rutas protegidas (requieren autenticación)
router.post('/:id/inventory', authenticate, updateInventory);
router.get('/:id/history', authenticate, getInventoryHistory);

export default router;