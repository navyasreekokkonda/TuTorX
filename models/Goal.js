import mongoose from "mongoose";

const GoalSchema = new mongoose.Schema({
  userId: String,
  text: String,
  completed: Boolean,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Goal || mongoose.model("Goal", GoalSchema);
