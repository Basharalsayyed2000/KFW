"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const youthRoutes_1 = __importDefault(require("./routes/youthRoutes")); // Ensure correct path
const app = (0, express_1.default)();
const PORT = 3000;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use('/youth', youthRoutes_1.default);
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));