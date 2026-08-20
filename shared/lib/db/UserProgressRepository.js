import { BaseRepository } from "./BaseRepository";
import UserProgress from "@/models/UserProgress";

export class UserProgressRepository extends BaseRepository {
  constructor() {
    super(UserProgress);
  }

  async findByUserAndCourse(userId, courseId) {
    await this.ensureConnected();
    if (this.useInMemory) {
      const list = this._getMemoryList({ userId, courseId });
      return list[0] || null;
    }
    return this.model.findOne({ userId, courseId }).lean();
  }

  async bulkFindByUser(userId, options = {}) {
    await this.ensureConnected();
    if (this.useInMemory) {
      return this._getMemoryList({ userId });
    }
    const query = this.model.find({ userId });
    if (options.select) {
      query.select(options.select);
    }
    return query.lean();
  }

  async findOrInitialize(userId, courseId) {
    await this.ensureConnected();
    if (this.useInMemory) {
      let progress = await this.findByUserAndCourse(userId, courseId);
      if (!progress) {
        progress = await this.create({
          userId,
          courseId,
          completedTopics: [],
          progressPercent: 0,
        });
      }
      return progress;
    }
    let progress = await this.model.findOne({ userId, courseId });
    if (!progress) {
      progress = await this.model.create({
        userId,
        courseId,
        completedTopics: [],
        progressPercent: 0,
      });
    }
    return progress;
  }
}

export const userProgressRepository = new UserProgressRepository();
