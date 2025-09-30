import cors from 'cors';
import express from 'express';
import connectDB from './config/connect-db.mjs';
import authRoutes from './routes/authRoutes.mjs';
import productRoutes from './routes/productRoutes.mjs';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar a MongoDB
connectDB();

// Rutas
app.get('/', (req, res) => {
    res.json({
        message: 'API eCommerce Productos para Mascotas',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            products: '/api/products'
        }
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export default app;