import express, { Request, Response } from 'express';
import { supabase } from '../../../supabaseClient'; // Adjust the path if necessary

const router = express.Router();

// Create a new feed post (POST)
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const { author_name, title, content, author_id } = req.body;

    // Validate the input
    if (!title || !content || (!author_name && !author_id)) {
        res.status(400).json({ error: "Title, content, and either author_name or author_id are required." });
        return;
    }

    // Retrieve author_id based on author_name if not provided
    let finalAuthorId = author_id;

    if (author_name) {
        const { data: authorData, error: authorError } = await supabase
            .from('users')
            .select('id')
            .eq('username', author_name)
            .single();

        if (authorError || !authorData) {
            res.status(400).json({ error: "Author not found." });
            return;
        }

        finalAuthorId = authorData.id; // Set the final author_id from the username
    }

    // Insert new feed post into the database
    const { data, error } = await supabase
        .from('feeds')
        .insert([{ author_id: finalAuthorId, title, content }]);

    if (error) {
        res.status(400).json({ error: error.message });
        return;
    }

    res.status(201).json(data);
});

// Get all feeds (GET)
router.get('/', async (req: Request, res: Response): Promise<void> => {
    const { data, error } = await supabase.from('feeds').select('*');

    if (error) {
        res.status(400).json({ error: error.message });
        return;
    }

    res.json(data);
});

// Update a feed (PUT)
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { title, content, author_id } = req.body;

    // Validate the input
    if (!title && !content && !author_id) {
        res.status(400).json({ error: "At least one field (title, content, author_id) must be provided for update." });
        return;
    }

    const { data, error } = await supabase
        .from('feeds')
        .update({ title, content, author_id })
        .eq('id', id);

    if (error) {
        res.status(400).json({ error: error.message });
        return;
    }

    res.json(data);
});

// Delete a feed (DELETE)
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('feeds')
        .delete()
        .eq('id', id);

    if (error) {
        res.status(400).json({ error: error.message });
        return;
    }

    res.status(204).send(); // No content to send back
});

// Export the router
export default router;
