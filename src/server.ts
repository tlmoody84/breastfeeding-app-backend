import express, { Request, Response } from 'express';
import cors from 'cors';
import { supabase } from '../supabaseClient'; // Ensure you import your Supabase client
import userRoutes from './api/routes/userRoutes';  // Users route
import feedsRoutes from './api/routes/feedsRoutes'; // Feeds route
import notesRoutes from './api/routes/notesRoutes'; // Notes route
import postsRouter from './api/posts'; // Import posts router
import likesRoutes from './api/routes/likesRoutes';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
    origin: ['http://localhost:4000', 'http://localhost:4001'], // Allow both origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific methods
    credentials: true, // Allow credentials if your requests require them 
}));
app.use(express.json()); // To parse JSON request bodies

// Define a root route
app.get('/', (req, res) => {
    res.send('Come let your boobs hang freely!');
});

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/feeds', feedsRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/posts', postsRouter); 
app.use('/api/likes', likesRoutes);

// Like an image
app.post('/api/likes/:imageId/like', async (req: Request, res: Response):Promise<void> => {
    const { imageId } = req.params;
    const { user_id } = req.body;

    // Validate input
    if (!user_id) {
         res.status(400).json({ error: 'User ID is required' });
    }

    try {
        // Insert the like into the database
        const { data, error } = await supabase
            .from('image_votes') // Ensure this matches your actual table name
            .insert([{ user_id, image_id: imageId }]);

        if (error) {
            console.error('Error adding like:', error);
             res.status(500).json({ error: 'Error liking image' });
        }

        // Successfully liked the image
        res.status(200).json({ message: 'Image liked successfully', data });
    } catch (error) {
        console.error('Error handling like:', error);
        res.status(500).json({ error: 'Error liking image' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Export routes if needed (this is optional)
export default { feedsRoutes, notesRoutes, postsRouter, likesRoutes };
