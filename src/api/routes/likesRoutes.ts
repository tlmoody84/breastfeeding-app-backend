import { Router, Request, Response, NextFunction } from 'express';
import { supabase } from '../../../supabaseClient';

const router = Router();

const generateTempUserId = () => {
    return 'temp_' + Math.random().toString(36).substr(2, 9);
};

const addLikeToImage = async (req: Request, res: Response): Promise<void> => {
    const { id: imageId } = req.params;
    let { user_id } = req.body;

    if (!user_id) {
        user_id = generateTempUserId();
    }

    try {
        const { data: existingLike, error: checkError } = await supabase
            .from('image_votes')
            .select('*')
            .eq('user_id', user_id)
            .eq('image_id', imageId)
            .single();

        if (checkError && checkError.code !== 'PGRST116') { 
            console.error('Error checking existing like:', checkError);
            res.status(500).json({ error: 'Error checking existing like' });
            return;
        }

        if (existingLike) {
            res.status(400).json({ error: 'User has already liked this image' });
            return;
        }

        const { data, error } = await supabase
            .from('image_votes') 
            .insert([{ user_id, image_id: imageId }]);

        if (error) {
            console.error('Error adding like:', error);
            res.status(500).json({ error: 'Error liking image' });
            return;
        }

        res.status(200).json({ message: 'Image liked successfully', data });
    } catch (error) {
        console.error('Error handling like:', error);
        res.status(500).json({ error: 'Error liking image' });
    }
};

router.post('/:id/like', async (req: Request, res: Response, next: NextFunction) => {
    console.log('Like request received for image ID:', req.params.id);
    await addLikeToImage(req, res);
});

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    const { id: imageId } = req.params;

    const { data, error } = await supabase
        .from('image_votes') 
        .select('*')
        .eq('image_id', imageId);

    if (error) {
        res.status(400).json({ message: error.message });
        return; 
    }

    res.status(200).json(data);
});

router.get('/', async (req: Request, res: Response): Promise<void> => {
    const { data, error } = await supabase
        .from('image_votes')
        .select('user_id, image_id'); 

    if (error) {
        res.status(400).json({ message: error.message });
        return;
    }

    res.status(200).json(data);
});

export default router;
