import express, { Request, Response } from 'express';
import { supabase } from '../../../supabaseClient'; 

const router = express.Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400).json({ error: "All fields are required." });
        return; 
    }

    const { data, error } = await supabase
        .from('users')
        .insert([{ username, email, password }]);

    if (error) {
        res.status(400).json({ error: error.message });
        return; 
    }

    res.status(201).json(data);
});

router.get('/', async (req: Request, res: Response): Promise<void> => {
    const { data, error } = await supabase.from('users').select('*');

    if (error) {
        res.status(400).json({ error: error.message });
    }

    res.json(data);
});

router.put('/:id', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400).json({ error: "All fields are required." });
        return; 
    }

    const { data, error } = await supabase
        .from('users')
        .update({ username, email, password })
        .eq('id', id);

    if (error) {
        res.status(400).json({ error: error.message });
        return; 
    }

    res.json(data);
});

router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

    if (error) {
        res.status(400).json({ error: error.message });
        return; 
    }

    res.status(204).send(); 
});

export default router;
