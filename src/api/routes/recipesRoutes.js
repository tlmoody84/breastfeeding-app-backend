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
// Helper function to handle errors
const handleError = (res, error) => {
    const message = error.message || 'An unexpected error occurred';
    console.error(message); // Log the error for debugging
    res.status(500).json({ error: message });
};
// Create a recipe
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, ingredients, instructions, author_id } = req.body;
    const { data, error } = yield supabaseClient_1.supabase
        .from('recipes')
        .insert([{ title, ingredients, instructions, author_id }]);
    if (error)
        res.status(400).json({ error: error.message });
    res.status(201).json(data);
}));
// Read all recipes
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, error } = yield supabaseClient_1.supabase.from('recipes').select('*');
    if (error)
        return handleError(res, error);
    res.json(data);
}));
// Update a recipe
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, ingredients, instructions } = req.body;
    const { data, error } = yield supabaseClient_1.supabase
        .from('recipes')
        .update({ title, ingredients, instructions })
        .eq('id', req.params.id);
    if (error)
        res.status(400).json({ error: error.message });
    res.json(data);
}));
// Delete a recipe
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, error } = yield supabaseClient_1.supabase
        .from('recipes')
        .delete()
        .eq('id', req.params.id);
    if (error)
        res.status(400).json({ error: error.message });
    res.json({ message: 'Recipe deleted successfully' });
}));
exports.default = router;
