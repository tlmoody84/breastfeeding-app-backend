"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiKeyMiddleware = void 0;
const apiKeyMiddleware = (req, res, next) => {
    const apiKey = req.headers['api-key'];
    if (apiKey !== process.env.API_KEY) {
        res.status(403).json({ message: 'Forbidden' });
    }
    else {
        next();
    }
};
exports.apiKeyMiddleware = apiKeyMiddleware;
