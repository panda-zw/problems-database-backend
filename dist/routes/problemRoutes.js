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
        const search = req.query.search?.toString().trim() || "";
        const skip = (page - 1) * limit;
        // Initialize the query
        const query = {
            $and: [
                {
                    $or: [
                        { deleted_at: { $exists: false } },
                        { deleted_at: null },
                    ],
                },
            ],
        };
        // Add search conditions
        if (search) {
            const isPartialSearch = search.length < 3 || !/\s/.test(search);
            if (isPartialSearch) {
                query.$and.push({
                    $or: [
                        { problem_name: { $regex: search, $options: "i" } },
                        { sector: { $regex: search, $options: "i" } },
                        { problem_description: { $regex: search, $options: "i" } },
                        { affected_regions: { $regex: search, $options: "i" } },
                        { solution_name: { $regex: search, $options: "i" } },
                        { solution_description: { $regex: search, $options: "i" } },
                        { technology_used: { $regex: search, $options: "i" } },
                        { adaptation_required: { $regex: search, $options: "i" } },
                        { examples_in_africa: { $regex: search, $options: "i" } },
                    ],
                });
            }
            else {
                query.$and.push({ $text: { $search: search } });
            }
        }
        const [problems, total] = await Promise.all([
            Problem_1.default.find(query)
                .select("problem_name sector problem_description affected_regions solution_name solution_description technology_used adaptation_required examples_in_africa references")
                .skip(skip)
                .limit(limit),
            Problem_1.default.countDocuments(query),
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
        const problem = await Problem_1.default.findOne({
            _id: req.params.id,
            deleted_at: { $exists: false }, // Exclude soft-deleted problem
        });
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
    const problem = await Problem_1.default.findOne({
        _id: id,
        deleted_at: { $exists: false }, // Exclude soft-deleted problem
    });
    if (!problem) {
        res.status(404).json({ message: "Problem not found" });
        return;
    }
    try {
        const updatedProblem = await Problem_1.default.findByIdAndUpdate(id, req.body, {
            new: true, // Return the updated document
            runValidators: true, // Validate before saving
        });
        res.status(200).json(updatedProblem);
    }
    catch (error) {
        console.error("Error updating problem:", error);
        res.status(500).json({ message: error.message });
    }
});
// Soft delete a problem by ID
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const problem = await Problem_1.default.findOne({
        _id: id,
        deleted_at: { $exists: false }, // Ensure it's not already deleted
    });
    if (!problem) {
        res.status(404).json({ message: "Problem not found or already deleted" });
        return;
    }
    try {
        problem.deleted_at = new Date(); // Set the deleted_at field
        await problem.save();
        res
            .status(200)
            .json({ message: "Problem deleted successfully (soft delete)" });
    }
    catch (error) {
        console.error("Error soft deleting problem:", error);
        res.status(500).json({ message: error.message });
    }
});
exports.default = router;
