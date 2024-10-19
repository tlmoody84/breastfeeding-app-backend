import express, { Request, Response } from 'express';
import { supabase } from '../../supabaseClient'; 

const router = express.Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
    const { user_id, content, timestamp } = req.body;

    if (!user_id || !content || !timestamp) {
        res.status(400).json({ error: "All fields are required." });
        return; 
    }

    const { data, error } = await supabase
        .from('notes')
        .insert([{ user_id, content, timestamp }]);

    if (error) {
        res.status(400).json({ error: error.message });
        return; 
    }

    res.status(201).json(data);
});

router.get('/', async (req: Request, res: Response): Promise<void> => {
    const { data, error } = await supabase.from('notes').select('*');

    if (error) {
        res.status(400).json({ error: error.message });
        return; 
    }

    res.json(data);
});

router.put('/:id', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { user_id, content, timestamp } = req.body;

    if (!user_id || !content || !timestamp) {
        res.status(400).json({ error: "All fields are required." });
        return; 
    }

    const { data, error } = await supabase
        .from('notes')
        .update({ user_id, content, timestamp })
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
        .from('notes')
        .delete()
        .eq('id', id);

    if (error) {
        res.status(400).json({ error: error.message });
        return; 
    }

    res.status(204).send(); 
});

export default router;
