import { Request, Response, NextFunction } from 'express';

export const apiKeyMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const apiKey = req.headers['api-key'];

    if (apiKey !== process.env.API_KEY) {
        res.status(403).json({ message: 'Forbidden' }); 
    } else {
        next(); 
    }
};
