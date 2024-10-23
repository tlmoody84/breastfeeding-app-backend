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
exports.addLikeToImage = void 0;
const supabaseClient_1 = require("../../supabaseClient");
const addLikeToImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: imageId } = req.params;
    const userId = req.body.user_id;
    const anonId = req.headers['x-anon-id'];
    const { data: image, error: imageError } = yield supabaseClient_1.supabase
        .from('Public_images')
        .select('id')
        .eq('id', imageId)
        .single();
    if (imageError || !image) {
        return res.status(404).json({ message: "Image not found." });
    }
    const { data: existingLike, error: existingLikeError } = yield supabaseClient_1.supabase
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
    const { data, error } = yield supabaseClient_1.supabase
        .from('likes')
        .insert([{ image_id: imageId, user_id: userId || anonId }]);
    if (error) {
        return res.status(400).json({ message: error.message });
    }
    res.status(201).json({ message: 'Like added successfully', like: data });
});
exports.addLikeToImage = addLikeToImage;
