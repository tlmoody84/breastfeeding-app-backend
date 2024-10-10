// File: middleware/apiKeyMiddleware.ts
import { Request, Response, NextFunction } from 'express';

export const apiKeyMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const apiKey = req.headers['api-key'];

    // Check if API key is valid
    if (apiKey !== process.env.API_KEY) {
        res.status(403).json({ message: 'Forbidden' }); // Send the response without returning
    } else {
        next(); // Call next if the API key is valid
    }
};
