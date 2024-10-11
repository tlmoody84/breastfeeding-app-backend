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

// Create a new comment on a post
router.post('/:postId/comments', async (req: Request, res: Response): Promise<void> => {
    const { postId } = req.params;
    const { content, author_id } = req.body;

    // Validate the input
    if (!content || !author_id) {
        res.status(400).json({ error: "Content and author ID are required." });
        return;
    }

    // Insert new comment into the database
    const { data, error } = await supabase
        .from('comments') // Ensure you have a 'comments' table
        .insert([{ post_id: postId, content, author_id }]); // Make sure to reference post_id

    // Handle any errors
    if (error) {
        res.status(400).json({ error: error.message });
        return;
    }

    // Return the newly created comment
    res.status(201).json(data);
});

// Get comments for a specific post
router.get('/:postId/comments', async (req: Request, res: Response): Promise<void> => {
    const { postId } = req.params;

    const { data, error } = await supabase
        .from('comments') // Ensure you have a 'comments' table
        .select('*')
        .eq('post_id', postId); // Filter comments by post_id

    // Handle any errors
    if (error) {
        res.status(400).json({ error: error.message });
        return;
    }

    // Return the comments for the specified post
    res.json(data);
});

export default router;
