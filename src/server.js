"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const userRoutes_1 = __importDefault(require("./api/routes/userRoutes"));
const feedsRoutes_1 = __importDefault(require("./api/routes/feedsRoutes"));
const notesRoutes_1 = __importDefault(require("./api/routes/notesRoutes"));
const posts_1 = __importDefault(require("./api/posts"));
const likesRoutes_1 = __importDefault(require("./api/routes/likesRoutes"));
const recipesRoutes_1 = __importDefault(require("./api/routes/recipesRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
// Updated CORS origin
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:4001',
        'https://breastfeeding-frontend-jnlj2zga3-tlmoody84s-projects.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Welcome to the Breastfeeding API!');
});
// Moved app.post and routes to be before the listen call
app.post('/api/likes/:imageId/like', (req, res) => {
    const imageId = req.params.imageId;
    res.status(200).send({ message: 'Like added successfully', imageId });
});
// Set up routes
app.use('/api/users', userRoutes_1.default);
app.use('/api/feeds', feedsRoutes_1.default);
app.use('/api/notes', notesRoutes_1.default);
app.use('/api/posts', posts_1.default);
app.use('/api/likes', likesRoutes_1.default);
app.use('/api/recipes', recipesRoutes_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});
// Single app.listen call
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
exports.default = app;
