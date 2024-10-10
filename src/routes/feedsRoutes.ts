import express, { Request, Response } from 'express';
import { supabase } from '../../supabaseClient'; // Make sure to import your Supabase client

const router = express.Router();

// Create a new feed
router.post('/',  async (req: Request, res: Response): Promise<void> => {
    const { user_id, timestamp, duration, type } = req.body;

    // Validate the input
    if (!user_id || !timestamp || !duration || !type) {
         res.status(400).json({ error: "All fields are required." });
    }

    // Insert new feed into the database
    const { data, error } = await supabase
        .from('feeds')
        .insert([{ user_id, timestamp, duration, type }]);

    // Handle any errors
    if (error) {
         res.status(400).json({ error: error.message });
    }

    // Return the newly created feed
     res.status(201).json(data);
});

// Get all feeds
router.get('/', async (req: Request, res: Response): Promise<void> => {
    const { data, error } = await supabase.from('feeds').select('*');

    // Handle any errors
    if (error) {
         res.status(400).json({ error: error.message });
    }

    // Return the feeds
     res.json(data);
});

export default router;
