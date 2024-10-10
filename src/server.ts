import express from 'express';
import cors from 'cors';
import { supabase } from '../supabaseClient'; // Ensure you import your Supabase client
import userRoutes from './api/routes/userRoutes';  // Users route
import feedsRoutes from './api/routes/feedsRoutes';  // Feeds route
import notesRoutes from './api/routes/notesRoutes';  // Notes route
import postsRouter from './api/posts'; // Import posts router

const app = express();
const PORT = process.env.PORT || 4001;

// Middleware
app.use(cors());
app.use(express.json());  // To parse JSON request bodies

// Define a root route
app.get('/', (req, res) => {
    res.send('Come let your boobs hang freely!');
});

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/feeds', feedsRoutes);
app.use('/api/notes', notesRoutes);
app.use('/posts', postsRouter); // Using posts router

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
