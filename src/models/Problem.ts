import mongoose, { Schema, Document } from "mongoose";

export interface IProblem extends Document {
  problem_name: string;
  sector: string;
  problem_description: string;
  affected_regions: string[];
  solution_name: string;
  solution_description: string;
  technology_used: string[];
  adaptation_required: string;
  examples_in_africa: string[];
  references: string[];
  deleted_at?: Date | null;
  created_at?: Date;
  updated_at?: Date;
}

const ProblemSchema: Schema = new Schema(
  {
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
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } } // Enable timestamps
);

export default mongoose.model<IProblem>("Problem", ProblemSchema);
