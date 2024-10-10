import express, { Request, Response } from 'express';
import { supabase } from '../../../supabaseClient'; // Make sure to import your Supabase client

const router = express.Router();

// Create a new note
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

// Get all notes
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

export default router;
