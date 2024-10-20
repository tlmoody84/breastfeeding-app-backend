import express, { Request, Response } from 'express';
import cors from 'cors';
import { supabase } from './src/supabaseClient'; 
import userRoutes from './src/api/routes/userRoutes';
import feedsRoutes from './src/api/routes/feedsRoutes';
import notesRoutes from './src/api/routes/notesRoutes';
import postsRouter from './src/api/posts';
import likesRoutes from './src/api/routes/likesRoutes';
import recipesRoutes from './src/api/routes/recipesRoutes'; 

const app = express();
const PORT = process.env.PORT || 4000;



app.use(cors({
    origin: ['http://localhost:4001', 'https://breastfeeding-frontend.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Come let your boobs hang freely!');
});

app.post('/api/likes/:imageId/like', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); 
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); 
});

app.use('/api/users', userRoutes);
app.use('/api/feeds', feedsRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/posts', postsRouter); 
app.use('/api/likes', likesRoutes);
app.use('/api/recipes', recipesRoutes); 

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
