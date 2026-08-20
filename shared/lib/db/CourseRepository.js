import { BaseRepository } from "./BaseRepository";
import Course from "@/models/Course";

export class CourseRepository extends BaseRepository {
  constructor() {
    super(Course);
  }

  async findByUserId(userId, options = {}) {
    return this.find({ userId }, options);
  }
}

export const courseRepository = new CourseRepository();
