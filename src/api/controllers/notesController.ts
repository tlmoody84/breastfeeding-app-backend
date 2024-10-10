import { supabase } from '../../../supabaseClient';
import { Request, Response } from 'express';

// Create a new note
export const createNote = async (req: Request, res: Response) => {
    const { user_id, note } = req.body;

    const { data, error } = await supabase
        .from('notes')
        .insert([{ user_id, note }]);

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
};

// Get all notes
export const getNotes = async (req: Request, res: Response) => {
    const { data, error } = await supabase.from('notes').select('*');

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
};
