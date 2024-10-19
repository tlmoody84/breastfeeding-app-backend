import express, { Request, Response } from 'express';
import { supabase } from '../../supabaseClient';

const router = express.Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
    const { author_name, title, content, author_id } = req.body;

    if (!title || !content || (!author_name && !author_id)) {
        res.status(400).json({ error: "Title, content, and either author_name or author_id are required." });
        return;
    }

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

        finalAuthorId = authorData.id; 
    }

    const { data, error } = await supabase
        .from('feeds')
        .insert([{ author_id: finalAuthorId, title, content }]);

    if (error) {
        res.status(400).json({ error: error.message });
        return;
    }

    res.status(201).json(data);
});

router.get('/', async (req: Request, res: Response): Promise<void> => {
    const { data, error } = await supabase.from('feeds').select('*');

    if (error) {
        res.status(400).json({ error: error.message });
        return;
    }

    res.json(data);
});

router.put('/:id', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { title, content, author_id } = req.body;

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

    res.status(204).send(); 
});

export default router;
