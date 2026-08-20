import { connectDB } from "@/lib/db";

/**
 * BaseRepository
 * Abstract repository providing standard CRUD operations.
 * Ensures DB connection before query execution and decouples services from Mongoose specifics.
 */
export class BaseRepository {
  /**
   * @param {import("mongoose").Model} model - Mongoose Model
   */
  constructor(model) {
    this.model = model;
  }

  async ensureConnected() {
    try {
      await connectDB();
      this.useInMemory = false;
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        if (!this.useInMemory) {
          console.warn(`[BaseRepository] MongoDB offline/paused (${err.message}). Using local in-memory fallback for ${this.model.modelName}.`);
          this.useInMemory = true;
          if (!this.memoryStore) this.memoryStore = new Map();
        }
      } else {
        throw err;
      }
    }
  }

  _getMemoryList(query = {}) {
    if (!this.memoryStore) this.memoryStore = new Map();
    const all = Array.from(this.memoryStore.values());
    return all.filter((item) => {
      for (const [key, val] of Object.entries(query)) {
        if (item[key] !== val) return false;
      }
      return true;
    });
  }

  async findById(id) {
    await this.ensureConnected();
    if (this.useInMemory) {
      if (!this.memoryStore) this.memoryStore = new Map();
      return this.memoryStore.get(String(id)) || null;
    }
    return this.model.findById(id).lean();
  }

  async findOne(query = {}) {
    await this.ensureConnected();
    if (this.useInMemory) {
      const list = this._getMemoryList(query);
      return list[0] || null;
    }
    return this.model.findOne(query).lean();
  }

  async find(query = {}, { page = 1, limit = 20, sort = { createdAt: -1 } } = {}) {
    await this.ensureConnected();
    if (this.useInMemory) {
      const items = this._getMemoryList(query);
      const total = items.length;
      return {
        items: items.slice((page - 1) * limit, page * limit),
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
      };
    }
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.model.find(query).sort(sort).skip(skip).limit(limit).lean(),
      this.model.countDocuments(query),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(data) {
    await this.ensureConnected();
    if (this.useInMemory) {
      if (!this.memoryStore) this.memoryStore = new Map();
      const id = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
      const doc = { _id: id, id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...data };
      this.memoryStore.set(String(id), doc);
      return doc;
    }
    const doc = await this.model.create(data);
    return doc.toObject();
  }

  async updateById(id, data) {
    await this.ensureConnected();
    if (this.useInMemory) {
      if (!this.memoryStore) this.memoryStore = new Map();
      const existing = this.memoryStore.get(String(id));
      if (!existing) return null;
      const updated = { ...existing, ...data, updatedAt: new Date().toISOString() };
      this.memoryStore.set(String(id), updated);
      return updated;
    }
    return this.model.findByIdAndUpdate(id, { $set: data }, { new: true }).lean();
  }

  async deleteById(id) {
    await this.ensureConnected();
    if (this.useInMemory) {
      if (!this.memoryStore) this.memoryStore = new Map();
      const existing = this.memoryStore.get(String(id)) || null;
      this.memoryStore.delete(String(id));
      return existing;
    }
    return this.model.findByIdAndDelete(id).lean();
  }
}
