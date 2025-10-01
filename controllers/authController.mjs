import User from '../models/User.mjs';
import { generateToken } from '../utils/tokenUtils.mjs';

// Función de registro
export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Nombre, email y contraseña son obligatorios'
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'El email ya está registrado'
            });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'employee',
            status: 'active'
        });

        res.status(201).json({
            success: true,
            message: 'Usuario creado exitosamente',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear usuario',
            error: error.message
        });
    }
};

// Función de login 
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email y contraseña son obligatorios'
            });
        }

        const user = await User.findOne({ email, status: 'active' });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Login exitoso',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error en login',
            error: error.message
        });
    }
};

// Función de verificación de token
export const verifyTokenController = async (req, res) => {
    try {
        const user = req.user;

        res.status(200).json({
            success: true,
            message: 'Token válido',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al verificar token',
            error: error.message
        });
    }
};