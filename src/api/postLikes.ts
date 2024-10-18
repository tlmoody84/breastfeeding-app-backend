import { Router, Request, Response } from 'express';
import { supabase } from '../../supabaseClient';

const router = Router();

// Add a like to a breastfeeding position image
export const addLikeToImage = async (req: Request, res: Response) => {
    const { id: imageId } = req.params; 

    // Check if the image exists
    const { data: image, error: imageError } = await supabase
        .from('Public_images') // Table containing the images
        .select('id')
        .eq('id', imageId)
        .single();

    if (imageError || !image) {
        return res.status(404).json({ message: "Breastfeeding image not found." });
    }

    const userId = req.body.user_id; // Assuming the user ID is passed in the request body

    // Validate user ID
    if (!userId) {
        return res.status(400).json({ message: "User ID is required." });
    }

    // Check if the user has already liked this image
    const { data: existingLike, error: existingLikeError } = await supabase
        .from('likes') // Table containing the likes
        .select('id')
        .eq('image_id', imageId)
        .eq('user_id', userId)
        .single();

    if (existingLikeError && existingLikeError.code !== 'PGRST116') { // PGRST116 means no rows found
        return res.status(400).json({ message: existingLikeError.message });
    }

    if (existingLike) {
        return res.status(400).json({ message: "You have already liked this image." });
    }

    // Insert the like into the database
    const { data, error } = await supabase
        .from('likes') // Table containing the likes
        .insert([{ image_id: imageId, user_id: userId }]) // Use appropriate column names
        .select();

    if (error) {
        return res.status(400).json({ message: error.message });
    }

    res.status(201).json({ message: 'Like added to breastfeeding image.', like: data });
};

// Export the router to use in your application
export default router;
