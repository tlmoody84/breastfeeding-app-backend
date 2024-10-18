import { Router, Request, Response, NextFunction } from 'express';
import { supabase } from '../../../supabaseClient';

const router = Router();

// Function to generate a temporary user ID
const generateTempUserId = () => {
    return 'temp_' + Math.random().toString(36).substr(2, 9);
};

// Controller function to add a like to an image
const addLikeToImage = async (req: Request, res: Response): Promise<void> => {
    const { id: imageId } = req.params;
    let { user_id } = req.body;

    // Generate a temporary user ID if none is provided
    if (!user_id) {
        user_id = generateTempUserId();
    }

    try {
        // Check if the like already exists
        const { data: existingLike, error: checkError } = await supabase
            .from('image_votes')
            .select('*')
            .eq('user_id', user_id)
            .eq('image_id', imageId)
            .single();

        if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means no rows found
            console.error('Error checking existing like:', checkError);
            res.status(500).json({ error: 'Error checking existing like' });
            return;
        }

        // If a like already exists, respond with an error
        if (existingLike) {
            res.status(400).json({ error: 'User has already liked this image' });
            return;
        }

        // Insert the like into the database
        const { data, error } = await supabase
            .from('image_votes') // Adjust to your actual table name
            .insert([{ user_id, image_id: imageId }]);

        if (error) {
            console.error('Error adding like:', error);
            res.status(500).json({ error: 'Error liking image' });
            return;
        }

        // Successfully liked the image
        res.status(200).json({ message: 'Image liked successfully', data });
    } catch (error) {
        console.error('Error handling like:', error);
        res.status(500).json({ error: 'Error liking image' });
    }
};

// Endpoint to like an image
router.post('/:id/like', async (req: Request, res: Response, next: NextFunction) => {
    console.log('Like request received for image ID:', req.params.id);
    await addLikeToImage(req, res);
});

// Endpoint to get likes for a specific image
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    const { id: imageId } = req.params;

    const { data, error } = await supabase
        .from('image_votes') // Adjust to the correct table for likes
        .select('*')
        .eq('image_id', imageId);

    if (error) {
        res.status(400).json({ message: error.message });
        return; // Ensure to exit after sending the response
    }

    res.status(200).json(data);
});

// Endpoint to get all likes (with user_id and image_id)
router.get('/', async (req: Request, res: Response): Promise<void> => {
    const { data, error } = await supabase
        .from('image_votes')
        .select('user_id, image_id'); // Select user_id and image_id

    if (error) {
        res.status(400).json({ message: error.message });
        return;
    }

    res.status(200).json(data);
});

export default router;
