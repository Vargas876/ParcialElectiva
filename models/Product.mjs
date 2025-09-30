import mongoose from 'mongoose';

const inventoryMovementSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['entrada', 'salida'],
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    previousStock: {
        type: Number,
        required: true
    },
    newStock: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    notes: String
});

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['alimento', 'juguete', 'accesorio', 'higiene', 'salud']
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    minStock: {
        type: Number,
        required: true,
        min: 0,
        default: 10
    },
    brand: {
        type: String,
        required: true
    },
    petType: {
        type: String,
        enum: ['perro', 'gato', 'ave', 'roedor', 'todos'],
        default: 'todos'
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    inventoryMovements: [inventoryMovementSchema]
}, {
    timestamps: true
});

// Método para verificar stock disponible
productSchema.methods.hasAvailableStock = function(quantity) {
    return (this.stock - quantity) >= this.minStock;
};

const Product = mongoose.model('Product', productSchema);

export default Product;