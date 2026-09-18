"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const appDataSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });
const AppData = mongoose_1.default.model('AppData', appDataSchema);
exports.default = AppData;
//# sourceMappingURL=AppData.js.map