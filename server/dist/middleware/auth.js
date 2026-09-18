"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Not authorized, no token' });
        return;
    }
    try {
        const token = authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Not authorized, invalid token format' });
            return;
        }
        const jwtSecret = process.env.JWT_SECRET || 'supersecretjwtkey_replace_me_in_production';
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        const user = await User_1.default.findById(decoded.id).select('-password');
        if (!user) {
            res.status(401).json({ message: 'Not authorized, user not found' });
            return;
        }
        req.user = {
            _id: user._id.toString(),
            email: user.email,
            name: user.name,
        };
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};
exports.protect = protect;
//# sourceMappingURL=auth.js.map