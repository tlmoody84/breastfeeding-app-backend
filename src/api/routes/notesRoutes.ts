// notesRoutes.ts
import express, { Request, Response } from 'express';
import { supabase } from '../../../supabaseClient'; // Adjust the path if necessary

const router = express.Router();

// Create a new note (POST)
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const { user_id, content, timestamp } = req.body;

    // Validate the input
    if (!user_id || !content || !timestamp) {
        res.status(400).json({ error: "All fields are required." });
        return; // Ensure the function exits after sending the response
    }

    // Insert new note into the database
    const { data, error } = await supabase
        .from('notes')
        .insert([{ user_id, content, timestamp }]);

    // Handle any errors
    if (error) {
        res.status(400).json({ error: error.message });
        return; // Ensure the function exits after sending the response
    }

    // Return the newly created note
    res.status(201).json(data);
});

// Get all notes (GET)
router.get('/', async (req: Request, res: Response): Promise<void> => {
    const { data, error } = await supabase.from('notes').select('*');

    // Handle any errors
    if (error) {
        res.status(400).json({ error: error.message });
        return; // Ensure the function exits after sending the response
    }

    // Return the notes
    res.json(data);
});

// Update a note (PUT)
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { user_id, content, timestamp } = req.body;

    // Validate the input
    if (!user_id || !content || !timestamp) {
        res.status(400).json({ error: "All fields are required." });
        return; // Ensure the function exits after sending the response
    }

    const { data, error } = await supabase
        .from('notes')
        .update({ user_id, content, timestamp })
        .eq('id', id);

    // Handle any errors
    if (error) {
        res.status(400).json({ error: error.message });
        return; // Ensure the function exits after sending the response
    }

    res.json(data);
});

// Delete a note (DELETE)
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

    // Handle any errors
    if (error) {
        res.status(400).json({ error: error.message });
        return; // Ensure the function exits after sending the response
    }

    res.status(204).send(); // No content to send back
});

// Export the router
export default router;
