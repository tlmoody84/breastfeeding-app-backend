import express, { Request, Response } from 'express';
import { supabase } from '../supabaseClient'; 

const router = express.Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
    const { title, content, author_id } = req.body;

    if (!title || !content || !author_id) {
        res.status(400).json({ error: "All fields are required." });
        return;
    }

    const { data, error } = await supabase
        .from('posts')
        .insert([{ title, content, author_id }]);

    if (error) {
        res.status(400).json({ error: error.message });
        return;
    }

    res.status(201).json(data);
});

router.get('/', async (req: Request, res: Response): Promise<void> => {
    const { data, error } = await supabase.from('posts').select('*');

    if (error) {
        res.status(400).json({ error: error.message });
        return;
    }

    res.json(data);
});

router.post('/:postId/comments', async (req: Request, res: Response): Promise<void> => {
    const { postId } = req.params;
    const { content, author_id } = req.body;

    if (!content || !author_id) {
        res.status(400).json({ error: "Content and author ID are required." });
        return;
    }

    const { data, error } = await supabase
        .from('comments') 
        .insert([{ post_id: postId, content, author_id }]); 

    if (error) {
        res.status(400).json({ error: error.message });
        return;
    }

    res.status(201).json(data);
});

router.get('/:postId/comments', async (req: Request, res: Response): Promise<void> => {
    const { postId } = req.params;

    const { data, error } = await supabase
        .from('comments') 
        .select('*')
        .eq('post_id', postId); 

    if (error) {
        res.status(400).json({ error: error.message });
        return;
    }

    res.json(data);
});

export default router;
