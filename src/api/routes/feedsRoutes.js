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
const supabaseClient_1 = require("../../supabaseClient");
const router = express_1.default.Router();
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { author_name, title, content, author_id } = req.body;
    if (!title || !content || (!author_name && !author_id)) {
        res.status(400).json({ error: "Title, content, and either author_name or author_id are required." });
        return;
    }
    let finalAuthorId = author_id;
    if (author_name) {
        const { data: authorData, error: authorError } = yield supabaseClient_1.supabase
            .from('users')
            .select('id')
            .eq('username', author_name)
            .single();
        if (authorError || !authorData) {
            res.status(400).json({ error: "Author not found." });
            return;
        }
        finalAuthorId = authorData.id;
    }
    const { data, error } = yield supabaseClient_1.supabase
        .from('feeds')
        .insert([{ author_id: finalAuthorId, title, content }]);
    if (error) {
        res.status(400).json({ error: error.message });
        return;
    }
    res.status(201).json(data);
}));
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, error } = yield supabaseClient_1.supabase.from('feeds').select('*');
    if (error) {
        res.status(400).json({ error: error.message });
        return;
    }
    res.json(data);
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, content, author_id } = req.body;
    if (!title && !content && !author_id) {
        res.status(400).json({ error: "At least one field (title, content, author_id) must be provided for update." });
        return;
    }
    const { data, error } = yield supabaseClient_1.supabase
        .from('feeds')
        .update({ title, content, author_id })
        .eq('id', id);
    if (error) {
        res.status(400).json({ error: error.message });
        return;
    }
    res.json(data);
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { data, error } = yield supabaseClient_1.supabase
        .from('feeds')
        .delete()
        .eq('id', id);
    if (error) {
        res.status(400).json({ error: error.message });
        return;
    }
    res.status(204).send();
}));
exports.default = router;
