import express, { Request, Response } from 'express';
import cors from 'cors';
import { supabase } from '../supabaseClient'; 
import userRoutes from './api/routes/userRoutes';
import feedsRoutes from './api/routes/feedsRoutes';
import notesRoutes from './api/routes/notesRoutes';
import postsRouter from './api/posts';
import likesRoutes from './api/routes/likesRoutes';
import recipesRoutes from './api/routes/recipesRoutes'; 

const app = express();
const PORT = process.env.PORT || 4000;


app.use(cors({
    origin: ['http://localhost:4000', 'http://localhost:4001', 'https://breastfeeding-frontend.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Come let your boobs hang freely!');
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
