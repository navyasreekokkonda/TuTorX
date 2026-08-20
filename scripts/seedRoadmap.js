import dotenv from "dotenv";
dotenv.config({ path: ".env.local" }); // 👈 LOAD ENV FIRST

import { connectDB } from "../lib/db.js";
import Roadmap from "../models/Roadmap.js";

if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI not found. Check .env.local location.");
  process.exit(1);
}

await connectDB();

await Roadmap.deleteMany();

await Roadmap.insertMany([
  {
    title: "Programming Fundamentals",
    desc: "Variables, loops, conditions, functions",
    order: 1,
    status: "completed",
  },
  {
    title: "Object Oriented Programming",
    desc: "Classes, inheritance, polymorphism",
    order: 2,
    status: "active",
  },
  {
    title: "Database Architecture",
    desc: "SQL, NoSQL, indexing",
    order: 3,
    status: "locked",
  },
  {
    title: "System Design",
    desc: "Scalability, load balancing",
    order: 4,
    status: "locked",
  },
]);

console.log("✅ Roadmap seeded successfully");
process.exit(0);
