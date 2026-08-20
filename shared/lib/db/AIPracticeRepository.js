import { BaseRepository } from "./BaseRepository";
import AIPracticeSession from "@/models/AIPracticeSession";

export class AIPracticeRepository extends BaseRepository {
  constructor() {
    super(AIPracticeSession);
  }

  async findByUserId(userId, options = {}) {
    await this.ensureConnected();
    if (this.useInMemory) {
      return this._getMemoryList({ userId });
    }
    const query = this.model.find({ userId }).sort({ createdAt: -1 });
    if (options.limit) {
      query.limit(options.limit);
    }
    if (options.select) {
      query.select(options.select);
    }
    return query.lean();
  }

  async findByIdAndUser(sessionId, userId) {
    await this.ensureConnected();
    if (this.useInMemory) {
      const list = this._getMemoryList({ _id: sessionId, userId });
      return list[0] || null;
    }
    return this.model.findOne({ _id: sessionId, userId }).lean();
  }
}

export const aiPracticeRepository = new AIPracticeRepository();
