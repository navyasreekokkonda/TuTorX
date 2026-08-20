import mongoose from "mongoose";

const FlashcardSchema = new mongoose.Schema({
  question: String,
  answer: String,
});

const NotebookSchema = new mongoose.Schema({
  userId: String,
  title: String,
  summary: String,
  notes: String,
  easyExplanation: String,
  flashcards: [FlashcardSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Notebook ||
  mongoose.model("Notebook", NotebookSchema);
