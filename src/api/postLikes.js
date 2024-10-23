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
const express_1 = require("express");
const supabaseClient_1 = require("../supabaseClient");
const router = (0, express_1.Router)();
const addLikeToImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: imageId } = req.params;
    const { data: image, error: imageError } = yield supabaseClient_1.supabase
        .from('Public_images')
        .select('id')
        .eq('id', imageId)
        .single();
    if (imageError || !image) {
        return res.status(404).json({ message: "Breastfeeding image not found." });
    }
    const userId = req.body.user_id;
    if (!userId) {
        return res.status(400).json({ message: "User ID is required." });
    }
    const { data: existingLike, error: existingLikeError } = yield supabaseClient_1.supabase
        .from('likes')
        .select('id')
        .eq('image_id', imageId)
        .eq('user_id', userId)
        .single();
    if (existingLikeError && existingLikeError.code !== 'PGRST116') {
        return res.status(400).json({ message: existingLikeError.message });
    }
    if (existingLike) {
        return res.status(400).json({ message: "You have already liked this image." });
    }
    const { data, error } = yield supabaseClient_1.supabase
        .from('likes')
        .insert([{ image_id: imageId, user_id: userId }])
        .select();
    if (error) {
        return res.status(400).json({ message: error.message });
    }
    res.status(201).json({ message: 'Like added to breastfeeding image.', like: data });
});
exports.addLikeToImage = addLikeToImage;
exports.default = router;
