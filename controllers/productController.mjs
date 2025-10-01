import Product from '../models/Product.mjs';

// Obtener todos los productos (público)
export const getProducts = async (req, res) => {
    try {
        const { category, petType, status } = req.query;
        const filter = {};

        if (category) filter.category = category;
        if (petType) filter.petType = petType;
        if (status) filter.status = status;

        const products = await Product.find(filter).select('-inventoryMovements');

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener productos',
            error: error.message
        });
    }
};

// Obtener producto por ID (público)
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id).select('-inventoryMovements');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener producto',
            error: error.message
        });
    }
};

// Actualizar inventario (requiere autenticación)
export const updateInventory = async (req, res) => {
    try {
        const { id } = req.params;
        const { type, quantity, notes } = req.body;

        // Validaciones
        if (!type || !quantity) {
            return res.status(400).json({
                success: false,
                message: 'Tipo de novedad y cantidad son obligatorios'
            });
        }

        if (!['entrada', 'salida'].includes(type)) {
            return res.status(400).json({
                success: false,
                message: 'Tipo de novedad debe ser "entrada" o "salida"'
            });
        }

        if (quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: 'La cantidad debe ser mayor a 0'
            });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        const previousStock = product.stock;
        let newStock;

        if (type === 'entrada') {
            newStock = previousStock + quantity;
        } else {
            // Salida
            if (!product.hasAvailableStock(quantity)) {
                return res.status(400).json({
                    success: false,
                    message: `Stock insuficiente. Stock actual: ${product.stock}, Stock mínimo: ${product.minStock}, Disponible: ${product.stock - product.minStock}`
                });
            }
            newStock = previousStock - quantity;
        }

        // Crear registro de movimiento
        const movement = {
            type,
            quantity,
            user: req.user._id,
            previousStock,
            newStock,
            notes
        };

        product.inventoryMovements.push(movement);
        product.stock = newStock;

        await product.save();

        res.status(200).json({
            success: true,
            message: `Inventario actualizado: ${type} de ${quantity} unidades`,
            data: {
                productId: product._id,
                productName: product.name,
                previousStock,
                newStock,
                movement: {
                    type,
                    quantity,
                    date: movement.date
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar inventario',
            error: error.message
        });
    }
};

// Obtener historial de movimientos (requiere autenticación)
export const getInventoryHistory = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id)
            .populate('inventoryMovements.user', 'name email');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            productName: product.name,
            currentStock: product.stock,
            minStock: product.minStock,
            movements: product.inventoryMovements
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener historial',
            error: error.message
        });
    }
};
export const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            category,
            price,
            stock,
            minStock,
            brand,
            petType
        } = req.body;

        // Validaciones
        if (!name || !description || !category || !price || !brand) {
            return res.status(400).json({
                success: false,
                message: 'Faltan campos obligatorios'
            });
        }

        const product = await Product.create({
            name,
            description,
            category,
            price,
            stock: stock || 0,
            minStock: minStock || 10,
            brand,
            petType: petType || 'todos',
            status: 'active'
        });

        res.status(201).json({
            success: true,
            message: 'Producto creado exitosamente',
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear producto',
            error: error.message
        });
    }
};