import mongoose from "mongoose";

const AIPracticeSessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  pattern: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
    enum: ["Easy", "Medium", "Hard"],
  },
  problems: [
    {
      title: String,
      description: String,
      constraints: String,
      input_format: String,
      output_format: String,
      sample_input: String,
      sample_output: String,
      test_cases: [
        {
          input: String,
          expected_output: String,
        },
      ],
      starter_code: {
        javascript: String,
        java: String,
        python: String,
      },
    },
  ],
  solvedProblems: [
    {
      problemIndex: Number,
      passed: Number,
      total: Number,
      code: String,
      language: String,
      submittedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.AIPracticeSession ||
  mongoose.model("AIPracticeSession", AIPracticeSessionSchema);
