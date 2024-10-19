import express, { Request, Response, Router } from 'express';
import { supabase } from '../../supabaseClient';

const router = Router();

// Helper function to handle errors
const handleError = (res: Response, error: unknown) => {
    const message = (error as Error).message || 'An unexpected error occurred';
    console.error(message); // Log the error for debugging
    res.status(500).json({ error: message });
};

// Create a recipe
router.post('/', async (req: Request, res: Response):Promise<void> => {
    const { title, ingredients, instructions, author_id } = req.body;

    const { data, error } = await supabase
        .from('recipes')
        .insert([{ title, ingredients, instructions, author_id }]);

    if (error)  res.status(400).json({ error: error.message });
    res.status(201).json(data);
});

// Read all recipes
router.get('/', async (req: Request, res: Response) => {
    const { data, error } = await supabase.from('recipes').select('*');
    if (error) return handleError(res, error);
    res.json(data);
});

// Update a recipe
router.put('/:id', async (req: Request, res: Response):Promise<void> => {
    const { title, ingredients, instructions } = req.body;

    const { data, error } = await supabase
        .from('recipes')
        .update({ title, ingredients, instructions })
        .eq('id', req.params.id);

    if (error)  res.status(400).json({ error: error.message });
    res.json(data);
});

// Delete a recipe
router.delete('/:id', async (req: Request, res: Response):Promise<void> => {
    const { data, error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', req.params.id);

    if (error)  res.status(400).json({ error: error.message });
    res.json({ message: 'Recipe deleted successfully' });
});

export default router;
