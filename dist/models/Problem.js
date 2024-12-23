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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const ProblemSchema = new mongoose_1.Schema({
    problem_name: { type: String, required: true },
    sector: { type: String, required: true },
    problem_description: { type: String },
    affected_regions: { type: [String] },
    solution_name: { type: String, required: true },
    solution_description: { type: String },
    technology_used: { type: [String] },
    adaptation_required: { type: String },
    examples_in_africa: { type: [String] },
    references: { type: [String] },
    deleted_at: { type: Date, default: null },
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });
// Create a text index on relevant fields for full-text search
ProblemSchema.index({
    problem_name: "text",
    sector: "text",
    problem_description: "text",
    solution_name: "text",
    solution_description: "text",
});
exports.default = mongoose_1.default.model("Problem", ProblemSchema);
