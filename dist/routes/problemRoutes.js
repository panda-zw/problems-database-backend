"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Problem_1 = __importDefault(require("../models/Problem"));
const router = (0, express_1.Router)();
// Get all problems
router.get("/", async (req, res, next) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 10);
        const skip = (page - 1) * limit;
        const [problems, total] = await Promise.all([
            Problem_1.default.find().skip(skip).limit(limit),
            Problem_1.default.countDocuments(),
        ]);
        res.status(200).json({
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            data: problems,
        });
    }
    catch (error) {
        next(error);
    }
});
// Add a new problem
router.post("/", async (req, res) => {
    try {
        const problem = new Problem_1.default(req.body);
        const savedProblem = await problem.save();
        res.status(201).json(savedProblem);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Get a single problem by ID
router.get("/:id", async (req, res) => {
    try {
        const problem = await Problem_1.default.findById(req.params.id);
        if (!problem) {
            res.status(404).json({ message: "Problem not found" });
            return;
        }
        res.status(200).json(problem);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Update a problem by ID
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const problem = await Problem_1.default.findById(id);
    if (!problem) {
        res.status(404).json({ message: "Problem not found" });
        return;
    }
    try {
        const updatedProblem = await Problem_1.default.findByIdAndUpdate(id, req.body, {
            new: true, // Return the updated document
            runValidators: true, // Validate before saving
        });
        if (!updatedProblem) {
            res.status(404).json({ message: "Problem not found" });
            return;
        }
        res.status(200).json(updatedProblem);
    }
    catch (error) {
        console.error("Error updating problem:", error);
        res.status(500).json({ message: error.message });
    }
});
/**
 * Delete Problem by ID
 * @route DELETE /api/problems/:id
 */
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const problem = await Problem_1.default.findById(id);
    if (!problem) {
        res.status(404).json({ message: "Problem not found" });
        return;
    }
    try {
        const deletedProblem = await Problem_1.default.findByIdAndDelete(id);
        if (!deletedProblem) {
            res.status(404).json({ message: "Problem not found" });
            return;
        }
        res.status(200).json({ message: "Problem deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting problem:", error);
        res.status(500).json({ message: error.message });
    }
});
exports.default = router;
