import { BaseRepository } from "./BaseRepository";
import Notebook from "@/models/Notebook";

export class NotebookRepository extends BaseRepository {
  constructor() {
    super(Notebook);
  }

  async findByUserId(userId, options = {}) {
    return this.find({ userId }, options);
  }
}

export const notebookRepository = new NotebookRepository();
