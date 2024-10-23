import express, { Request, Response } from 'express';
import cors from 'cors';
import userRoutes from './api/routes/userRoutes'
import feedsRoutes from './api/routes/feedsRoutes';
import notesRoutes from './api/routes/notesRoutes';
import postsRouter from './api/posts';
import likesRoutes from './api/routes/likesRoutes';
import recipesRoutes from './api/routes/recipesRoutes';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// Updated CORS origin
app.use(cors({
    origin: [
        'http://localhost:4001', 
        'https://breastfeeding-frontend-jnlj2zga3-tlmoody84s-projects.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the Breastfeeding API!');
});

// Moved app.post and routes to be before the listen call
app.post('/api/likes/:imageId/like', (req: Request, res: Response) => {
    const imageId = req.params.imageId;
    res.status(200).send({ message: 'Like added successfully', imageId });
});

// Set up routes
app.use('/api/users', userRoutes);
app.use('/api/feeds', feedsRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/posts', postsRouter); 
app.use('/api/likes', likesRoutes);
app.use('/api/recipes', recipesRoutes); 

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: Function) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Single app.listen call
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
