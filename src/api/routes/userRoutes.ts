// usersRoutes.ts
import express, { Request, Response } from 'express';
import { supabase } from '../../../supabaseClient'; // Ensure to import your Supabase client

const router = express.Router();

// Create a new user (POST)
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const { username, email, password } = req.body;

    // Validate the input
    if (!username || !email || !password) {
        res.status(400).json({ error: "All fields are required." });
        return; // Ensure the function exits after sending the response
    }

    // Insert new user into the database
    const { data, error } = await supabase
        .from('users')
        .insert([{ username, email, password }]);

    // Handle any errors
    if (error) {
        res.status(400).json({ error: error.message });
        return; // Ensure the function exits after sending the response
    }

    // Return the newly created user
    res.status(201).json(data);
});

// Get all users (GET)
router.get('/', async (req: Request, res: Response): Promise<void> => {
    const { data, error } = await supabase.from('users').select('*');

    // Handle any errors
    if (error) {
        res.status(400).json({ error: error.message });
        return; // Ensure the function exits after sending the response
    }

    // Return the users
    res.json(data);
});

// Update a user (PUT)
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { username, email, password } = req.body;

    // Validate the input
    if (!username || !email || !password) {
        res.status(400).json({ error: "All fields are required." });
        return; // Ensure the function exits after sending the response
    }

    const { data, error } = await supabase
        .from('users')
        .update({ username, email, password })
        .eq('id', id);

    // Handle any errors
    if (error) {
        res.status(400).json({ error: error.message });
        return; // Ensure the function exits after sending the response
    }

    res.json(data);
});

// Delete a user (DELETE)
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('users')
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
