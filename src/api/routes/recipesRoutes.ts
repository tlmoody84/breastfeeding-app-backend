import express, { Request, Response } from 'express';
import { supabase } from '../../../supabaseClient';

const router = express.Router();

// Create a recipe
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const { title, ingredients, instructions, author_id } = req.body;

    try {
        const { data, error } = await supabase
            .from('recipes')
            .insert([{ title, ingredients, instructions, author_id }]);

        if (error) {
             res.status(400).json({ error });
        }
        res.status(201).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An unexpected error occurred' });
    }
});

// Read all recipes
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { data, error } = await supabase.from('recipes').select('*');
        if (error) {
             res.status(400).json({ error });
        }
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

// Update a recipe
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
    const { title, ingredients, instructions } = req.body;

    try {
        const { data, error } = await supabase
            .from('recipes')
            .update({ title, ingredients, instructions })
            .eq('id', req.params.id);

        if (error) {
             res.status(400).json({ error });
        }
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

// Delete a recipe
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const { data, error } = await supabase
            .from('recipes')
            .delete()
            .eq('id', req.params.id);

        if (error) {
             res.status(400).json({ error });
        }
        res.json({ message: 'Recipe deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

export default router;
