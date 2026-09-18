"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const AppData_1 = __importDefault(require("../models/AppData"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Protect all routes
router.use(auth_1.protect);
// @route   GET /api/appdata
router.get('/', async (req, res) => {
    try {
        const data = await AppData_1.default.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// @route   POST /api/appdata
router.post('/', async (req, res) => {
    try {
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
// @route   PUT /api/appdata/:id
router.put('/:id', async (req, res) => {
    try {
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
// @route   DELETE /api/appdata/:id
router.delete('/:id', async (req, res) => {
    try {
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