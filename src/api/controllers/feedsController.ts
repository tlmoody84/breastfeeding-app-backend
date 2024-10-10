import { supabase } from '../../../supabaseClient';
import { Request, Response } from 'express';

// Create a new feed
export const createFeed = async (req: Request, res: Response): Promise<Response> => {
    const { user_id, timestamp, duration, type } = req.body;

    const { data, error } = await supabase
        .from('feeds')
        .insert([{ user_id, timestamp, duration, type }]);

    if (error) {
        return res.status(400).json({ error: error.message });
    }
    return res.status(201).json(data);
};

// Get all feeds
export const getFeeds = async (req: Request, res: Response): Promise<Response> => {
    const { data, error } = await supabase.from('feeds').select('*');

    if (error) {
        return res.status(400).json({ error: error.message });
    }
    return res.json(data);
};
