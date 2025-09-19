import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
    return res.status(401).json({ message: 'Token missing after Bearer' });
  }
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
        (req as any).user = decoded;
        
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
    
};
