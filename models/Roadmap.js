import mongoose from "mongoose";

const RoadmapSchema = new mongoose.Schema({
  title: String,
  desc: String,
  status: String, // completed | active | locked
  order: Number,
});

export default mongoose.models.Roadmap ||
  mongoose.model("Roadmap", RoadmapSchema);
