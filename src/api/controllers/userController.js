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
exports.getUsers = exports.createUser = void 0;
const supabaseClient_1 = require("../../supabaseClient");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const { data, error } = yield supabaseClient_1.supabase.auth.signUp({
        email,
        password,
    });
    if (error)
        return res.status(400).json({ error: error.message });
    res.status(201).json(data);
});
exports.createUser = createUser;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, error } = yield supabaseClient_1.supabase.from('users').select('*');
    if (error)
        return res.status(400).json({ error: error.message });
    res.json(data);
});
exports.getUsers = getUsers;
