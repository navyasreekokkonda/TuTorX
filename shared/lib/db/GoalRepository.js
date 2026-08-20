import { BaseRepository } from "./BaseRepository";
import Goal from "@/models/Goal";

export class GoalRepository extends BaseRepository {
  constructor() {
    super(Goal);
  }

  async findByUserId(userId, options = {}) {
    return this.find({ userId }, options);
  }
}

export const goalRepository = new GoalRepository();
