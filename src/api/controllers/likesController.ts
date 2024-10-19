import { Request, Response } from 'express';
import { supabase } from '../../supabaseClient';

export const addLikeToImage = async (req: Request, res: Response) => {
    const { id: imageId } = req.params;
    const userId = req.body.user_id; 
    const anonId = req.headers['x-anon-id']; 

    const { data: image, error: imageError } = await supabase
        .from('Public_images')
        .select('id')
        .eq('id', imageId)
        .single();

    if (imageError || !image) {
        return res.status(404).json({ message: "Image not found." });
    }

    const { data: existingLike, error: existingLikeError } = await supabase
        .from('likes')
        .select('id')
        .or(`image_id.eq.${imageId},user_id.eq.${userId || anonId}`)
        .single();

    if (existingLikeError) {
        return res.status(400).json({ message: existingLikeError.message });
    }

    if (existingLike) {
        return res.status(400).json({ message: "You have already liked this image." });
    }

    const { data, error } = await supabase
        .from('likes')
        .insert([{ image_id: imageId, user_id: userId || anonId }]);

    if (error) {
        return res.status(400).json({ message: error.message });
    }

    res.status(201).json({ message: 'Like added successfully', like: data });
};
