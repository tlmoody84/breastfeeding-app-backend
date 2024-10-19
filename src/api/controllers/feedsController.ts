import { supabase } from '../../supabaseClient';
import { Request, Response } from 'express';

export const createFeed = async (req: Request, res: Response): Promise<Response> => {
    const { user_id, timestamp, duration, type } = req.body;

    if (!user_id || !timestamp || !duration || !type) {
        return res.status(400).json({ error: "All fields are required." });
    }

    const { data, error } = await supabase
        .from('feeds')
        .insert([{ user_id, timestamp, duration, type }]);

    if (error) {
        return res.status(400).json({ error: error.message });
    }
    return res.status(201).json(data);
};

export const getFeeds = async (req: Request, res: Response): Promise<Response> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (page < 1 || limit < 1) {
        return res.status(400).json({ error: "Page and limit must be positive integers." });
    }

    const { data, error } = await supabase
        .from('feeds')
        .select('*')
        .range((page - 1) * limit, page * limit - 1);

    if (error) {
        return res.status(400).json({ error: error.message });
    }
    return res.json(data);
};

export const getFeedById = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('feeds')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        return res.status(404).json({ error: "Feed not found." });
    }
    return res.json(data);
};

export const updateFeed = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { user_id, timestamp, duration, type } = req.body;

    if (!user_id && !timestamp && !duration && !type) {
        return res.status(400).json({ error: "At least one field must be provided to update." });
    }

    const updates: any = {};
    if (user_id) updates.user_id = user_id;
    if (timestamp) updates.timestamp = timestamp;
    if (duration) updates.duration = duration;
    if (type) updates.type = type;

    const { data, error } = await supabase
        .from('feeds')
        .update(updates)
        .eq('id', id);

    if (error) {
        return res.status(400).json({ error: error.message });
    }
    return res.json(data);
};

export const deleteFeed = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('feeds')
        .delete()
        .eq('id', id);

    if (error) {
        return res.status(400).json({ error: error.message });
    }
    return res.status(204).send(); 
};
