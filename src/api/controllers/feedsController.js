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
exports.deleteFeed = exports.updateFeed = exports.getFeedById = exports.getFeeds = exports.createFeed = void 0;
const supabaseClient_1 = require("../../supabaseClient");
const createFeed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, timestamp, duration, type } = req.body;
    if (!user_id || !timestamp || !duration || !type) {
        return res.status(400).json({ error: "All fields are required." });
    }
    const { data, error } = yield supabaseClient_1.supabase
        .from('feeds')
        .insert([{ user_id, timestamp, duration, type }]);
    if (error) {
        return res.status(400).json({ error: error.message });
    }
    return res.status(201).json(data);
});
exports.createFeed = createFeed;
const getFeeds = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    if (page < 1 || limit < 1) {
        return res.status(400).json({ error: "Page and limit must be positive integers." });
    }
    const { data, error } = yield supabaseClient_1.supabase
        .from('feeds')
        .select('*')
        .range((page - 1) * limit, page * limit - 1);
    if (error) {
        return res.status(400).json({ error: error.message });
    }
    return res.json(data);
});
exports.getFeeds = getFeeds;
const getFeedById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { data, error } = yield supabaseClient_1.supabase
        .from('feeds')
        .select('*')
        .eq('id', id)
        .single();
    if (error) {
        return res.status(404).json({ error: "Feed not found." });
    }
    return res.json(data);
});
exports.getFeedById = getFeedById;
const updateFeed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { user_id, timestamp, duration, type } = req.body;
    if (!user_id && !timestamp && !duration && !type) {
        return res.status(400).json({ error: "At least one field must be provided to update." });
    }
    const updates = {};
    if (user_id)
        updates.user_id = user_id;
    if (timestamp)
        updates.timestamp = timestamp;
    if (duration)
        updates.duration = duration;
    if (type)
        updates.type = type;
    const { data, error } = yield supabaseClient_1.supabase
        .from('feeds')
        .update(updates)
        .eq('id', id);
    if (error) {
        return res.status(400).json({ error: error.message });
    }
    return res.json(data);
});
exports.updateFeed = updateFeed;
const deleteFeed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { data, error } = yield supabaseClient_1.supabase
        .from('feeds')
        .delete()
        .eq('id', id);
    if (error) {
        return res.status(400).json({ error: error.message });
    }
    return res.status(204).send();
});
exports.deleteFeed = deleteFeed;
