import mongoose from "mongoose";

/* =========================
   CONTENT BLOCK (ARTICLE BODY)
========================= */
const ContentBlockSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["heading", "text", "list", "code", "output"],
      required: true,
    },

    text: String, // heading / paragraph / output
    items: [String], // bullet points
    code: String, // code snippet
    language: String, // java, js, python
  },
  { _id: false }
);

/* =========================
   FLASHCARD (REVISION)
========================= */
const FlashcardSchema = new mongoose.Schema(
  {
    question: String,
    answer: String,
  },
  { _id: false }
);

/* =========================
   QUIZ (PRACTICE)
========================= */
const QuizSchema = new mongoose.Schema(
  {
    question: String,
    options: [String],
    correctAnswer: String,
  },
  { _id: false }
);

/* =========================
   TOPIC
========================= */
const TopicSchema = new mongoose.Schema({
  title: String,

  // 🔥 MAIN LEARNING CONTENT (GFG-style)
  content: [ContentBlockSchema],

  // 🎥 Optional videos
  videos: [String],

  // 🧠 Revision
  flashcards: [FlashcardSchema],

  // 📝 Practice
  quiz: [QuizSchema],
});

/* =========================
   CHAPTER
========================= */
const ChapterSchema = new mongoose.Schema({
  chapterTitle: String,
  duration: String,
  topics: [TopicSchema],
  videos: [String],
  completed: { type: Boolean, default: false },
});

/* =========================
   COURSE
========================= */
const CourseSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },

    title: String,
    description: String,
    difficulty: String,
    includeVideos: Boolean,
    category: [String],

    chapters: [ChapterSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Course || mongoose.model("Course", CourseSchema);
