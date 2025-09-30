import jwt from 'jsonwebtoken';

const SECRET_KEY = 'clave_secreta'; 

export const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        SECRET_KEY,
        { expiresIn: '24h' }
    );
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        return null;
    }
};