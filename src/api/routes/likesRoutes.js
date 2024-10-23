"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supabaseClient_1 = require("../../supabaseClient");
const router = (0, express_1.Router)();
const generateTempUserId = () => {
    return 'temp_' + Math.random().toString(36).substr(2, 9);
};
const addLikeToImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: imageId } = req.params;
    let { user_id } = req.body;
    if (!user_id) {
        user_id = generateTempUserId();
    }
    try {
        const { data: existingLike, error: checkError } = yield supabaseClient_1.supabase
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
        const { data, error } = yield supabaseClient_1.supabase
            .from('image_votes')
            .insert([{ user_id, image_id: imageId }]);
        if (error) {
            console.error('Error adding like:', error);
            res.status(500).json({ error: 'Error liking image' });
            return;
        }
        res.status(200).json({ message: 'Image liked successfully', data });
    }
    catch (error) {
        console.error('Error handling like:', error);
        res.status(500).json({ error: 'Error liking image' });
    }
});
router.post('/:id/like', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Like request received for image ID:', req.params.id);
    yield addLikeToImage(req, res);
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: imageId } = req.params;
    const { data, error } = yield supabaseClient_1.supabase
        .from('image_votes')
        .select('*')
        .eq('image_id', imageId);
    if (error) {
        res.status(400).json({ message: error.message });
        return;
    }
    res.status(200).json(data);
}));
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, error } = yield supabaseClient_1.supabase
        .from('image_votes')
        .select('user_id, image_id');
    if (error) {
        res.status(400).json({ message: error.message });
        return;
    }
    res.status(200).json(data);
}));
exports.default = router;
