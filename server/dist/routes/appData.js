"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AppData_1 = __importDefault(require("../models/AppData"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.protect);
router.get('/', async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        const data = await AppData_1.default.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
router.post('/', async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        const { title, content } = req.body;
        const newData = await AppData_1.default.create({
            user: req.user._id,
            title,
            content,
        });
        res.status(201).json(newData);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
router.put('/:id', async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        const data = await AppData_1.default.findById(req.params.id);
        if (!data) {
            res.status(404).json({ message: 'Data not found' });
            return;
        }
        if (data.user.toString() !== req.user._id.toString()) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        const updatedData = await AppData_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedData);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        const data = await AppData_1.default.findById(req.params.id);
        if (!data) {
            res.status(404).json({ message: 'Data not found' });
            return;
        }
        if (data.user.toString() !== req.user._id.toString()) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        await data.deleteOne();
        res.json({ message: 'Data removed' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=appData.js.map