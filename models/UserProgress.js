import mongoose from "mongoose";

const UserProgressSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    completedTopics: [
      {
        chapterIndex: { type: Number },
        topicIndex: { type: Number },
      },
    ],

    lastViewed: {
      chapterIndex: Number,
      topicIndex: Number,
    },

    progressPercent: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.UserProgress ||
  mongoose.model("UserProgress", UserProgressSchema);
