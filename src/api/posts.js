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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supabaseClient_1 = require("../supabaseClient");
const router = express_1.default.Router();
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, author_id } = req.body;
    if (!title || !content || !author_id) {
        res.status(400).json({ error: "All fields are required." });
        return;
    }
    const { data, error } = yield supabaseClient_1.supabase
        .from('posts')
        .insert([{ title, content, author_id }]);
    if (error) {
        res.status(400).json({ error: error.message });
        return;
    }
    res.status(201).json(data);
}));
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, error } = yield supabaseClient_1.supabase.from('posts').select('*');
    if (error) {
        res.status(400).json({ error: error.message });
        return;
    }
    res.json(data);
}));
router.post('/:postId/comments', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    const { content, author_id } = req.body;
    if (!content || !author_id) {
        res.status(400).json({ error: "Content and author ID are required." });
        return;
    }
    const { data, error } = yield supabaseClient_1.supabase
        .from('comments')
        .insert([{ post_id: postId, content, author_id }]);
    if (error) {
        res.status(400).json({ error: error.message });
        return;
    }
    res.status(201).json(data);
}));
router.get('/:postId/comments', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    const { data, error } = yield supabaseClient_1.supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId);
    if (error) {
        res.status(400).json({ error: error.message });
        return;
    }
    res.json(data);
}));
exports.default = router;
