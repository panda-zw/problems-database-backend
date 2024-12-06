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
      const skip = (page - 1) * limit;

      const [problems, total] = await Promise.all([
        Problem.find().skip(skip).limit(limit),
        Problem.countDocuments(),
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
    const problem = await Problem.findById(req.params.id);
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

  const problem = await Problem.findById(id);
  if (!problem) {
    res.status(404).json({ message: "Problem not found" });
    return;
  }

  try {
    const updatedProblem = await Problem.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Validate before saving
    });

    if (!updatedProblem) {
      res.status(404).json({ message: "Problem not found" });
      return;
    }

    res.status(200).json(updatedProblem);
  } catch (error: any) {
    console.error("Error updating problem:", error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * Delete Problem by ID
 * @route DELETE /api/problems/:id
 */
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const problem = await Problem.findById(id);
  if (!problem) {
    res.status(404).json({ message: "Problem not found" });
    return;
  }

  try {
    const deletedProblem = await Problem.findByIdAndDelete(id);

    if (!deletedProblem) {
      res.status(404).json({ message: "Problem not found" });
      return;
    }

    res.status(200).json({ message: "Problem deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting problem:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
