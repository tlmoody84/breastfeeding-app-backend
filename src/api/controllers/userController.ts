import { supabase } from '../../../supabaseClient';
import { Request, Response } from 'express';

export const createUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
};

export const getUsers = async (req: Request, res: Response) => {
    const { data, error } = await supabase.from('users').select('*');

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
};
