import { Router, Request, Response, NextFunction } from "express";
import Problem from "../models/Problem";

const router: Router = Router();

// Get all problems
router.get(
  "/",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.max(1, parseInt(req.query.limit as string) || 10);
      const search = req.query.search?.toString().trim() || "";

      const skip = (page - 1) * limit;

      // Build the query object
      const query: Record<string, any> = { 
        $or: [
          { deleted_at: { $exists: false } }, 
          { deleted_at: null }
        ]
      };

      if (search) {
        // Check if search is partial (shorter than 3 characters or no full words)
        const isPartialSearch = search.length < 3 || !/\s/.test(search);

        if (isPartialSearch) {
          query.$or = [
            { problem_name: { $regex: search, $options: "i" } },
            { sector: { $regex: search, $options: "i" } },
            { problem_description: { $regex: search, $options: "i" } },
            { affected_regions: { $regex: search, $options: "i" } },
            { solution_name: { $regex: search, $options: "i" } },
            { solution_description: { $regex: search, $options: "i" } },
            { technology_used: { $regex: search, $options: "i" } },
            { adaptation_required: { $regex: search, $options: "i" } },
            { examples_in_africa: { $regex: search, $options: "i" } },
          ];
        } else {
          // Use full-text search for longer, more specific queries
          query.$text = { $search: search };
        }
      }

      const [problems, total] = await Promise.all([
        Problem.find(query)
          .select(
            "problem_name sector problem_description affected_regions solution_name solution_description technology_used adaptation_required examples_in_africa references"
          )
          .skip(skip)
          .limit(limit),
        Problem.countDocuments(query),
      ]);

      res.status(200).json({
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        data: problems,
      });
    } catch (error: any) {
      next(error);
    }
  }
);



// Add a new problem
router.post("/", async (req: Request, res: Response) => {
  try {
    const problem = new Problem(req.body);
    const savedProblem = await problem.save();
    res.status(201).json(savedProblem);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Get a single problem by ID
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const problem = await Problem.findOne({
      _id: req.params.id,
      deleted_at: { $exists: false }, // Exclude soft-deleted problem
    });
    if (!problem) {
      res.status(404).json({ message: "Problem not found" });
      return;
    }
    res.status(200).json(problem);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Update a problem by ID
router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const problem = await Problem.findOne({
    _id: id,
    deleted_at: { $exists: false }, // Exclude soft-deleted problem
  });
  if (!problem) {
    res.status(404).json({ message: "Problem not found" });
    return;
  }

  try {
    const updatedProblem = await Problem.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Validate before saving
    });

    res.status(200).json(updatedProblem);
  } catch (error: any) {
    console.error("Error updating problem:", error);
    res.status(500).json({ message: error.message });
  }
});

// Soft delete a problem by ID
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const problem = await Problem.findOne({
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
  } catch (error: any) {
    console.error("Error soft deleting problem:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
