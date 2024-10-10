import express, { Request, Response } from 'express';
import { supabase } from '../../supabaseClient'; // Adjust path as needed

const router = express.Router();

// Create a new post
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const { title, content, author_id } = req.body;

    // Validate the input
    if (!title || !content || !author_id) {
        res.status(400).json({ error: "All fields are required." });
        return;
    }

    // Insert new post into the database
    const { data, error } = await supabase
        .from('posts')
        .insert([{ title, content, author_id }]);

    // Handle any errors
    if (error) {
        res.status(400).json({ error: error.message });
        return;
    }

    // Return the newly created post
    res.status(201).json(data);
});

// Get all posts
router.get('/', async (req: Request, res: Response): Promise<void> => {
    const { data, error } = await supabase.from('posts').select('*');

    // Handle any errors
    if (error) {
        res.status(400).json({ error: error.message });
        return;
    }

    // Return the posts
    res.json(data);
});

export default router;
