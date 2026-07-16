import type { D1Database } from "@cloudflare/workers-types";
import { join } from "path";
import type {
  Profile,
  Skill,
  Hobby,
  Project,
  FamilyMember,
  GalleryItem,
  Message,
  Milestone,
  Video
} from "@/generated/prisma/client";

export interface DbClient {
  profile: {
    findUnique(args: { where: { id: number } }): Promise<Profile | null>;
    update(args: { where: { id: number }; data: any }): Promise<Profile>;
  };
  skill: {
    findMany(args?: { orderBy?: { order: "asc" | "desc" } }): Promise<Skill[]>;
    create(args: { data: any }): Promise<Skill>;
    update(args: { where: { id: number }; data: any }): Promise<Skill>;
    delete(args: { where: { id: number } }): Promise<Skill>;
    count(): Promise<number>;
  };
  hobby: {
    findMany(args?: { orderBy?: { order: "asc" | "desc" } }): Promise<Hobby[]>;
    create(args: { data: any }): Promise<Hobby>;
    update(args: { where: { id: number }; data: any }): Promise<Hobby>;
    delete(args: { where: { id: number } }): Promise<Hobby>;
    count(): Promise<number>;
  };
  project: {
    findMany(args?: { where?: { visible?: boolean }; orderBy?: { order: "asc" | "desc" } }): Promise<Project[]>;
    create(args: { data: any }): Promise<Project>;
    update(args: { where: { id: number }; data: any }): Promise<Project>;
    delete(args: { where: { id: number } }): Promise<Project>;
    count(): Promise<number>;
  };
  familyMember: {
    findMany(args?: { orderBy?: { order: "asc" | "desc" } }): Promise<FamilyMember[]>;
    create(args: { data: any }): Promise<FamilyMember>;
    update(args: { where: { id: number }; data: any }): Promise<FamilyMember>;
    delete(args: { where: { id: number } }): Promise<FamilyMember>;
    count(): Promise<number>;
  };
  galleryItem: {
    findMany(args?: { orderBy?: { order: "asc" | "desc" } }): Promise<GalleryItem[]>;
    create(args: { data: any }): Promise<GalleryItem>;
    update(args: { where: { id: number }; data: any }): Promise<GalleryItem>;
    delete(args: { where: { id: number } }): Promise<GalleryItem>;
    count(): Promise<number>;
  };
  message: {
    findMany(args?: { orderBy?: { createdAt?: "asc" | "desc" } }): Promise<Message[]>;
    findUnique(args: { where: { id: number } }): Promise<Message | null>;
    create(args: { data: any }): Promise<Message>;
    update(args: { where: { id: number }; data: any }): Promise<Message>;
    delete(args: { where: { id: number } }): Promise<Message>;
    count(args?: { where?: { read?: boolean } }): Promise<number>;
  };
  milestone: {
    findMany(args?: { orderBy?: { order: "asc" | "desc" } }): Promise<Milestone[]>;
    create(args: { data: any }): Promise<Milestone>;
    update(args: { where: { id: number }; data: any }): Promise<Milestone>;
    delete(args: { where: { id: number } }): Promise<Milestone>;
    count(): Promise<number>;
  };
  video: {
    findMany(args?: { where?: { featured?: boolean }; orderBy?: { order: "asc" | "desc" }; take?: number }): Promise<Video[]>;
    create(args: { data: any }): Promise<Video>;
    update(args: { where: { id: number }; data: any }): Promise<Video>;
    delete(args: { where: { id: number } }): Promise<Video>;
    count(): Promise<number>;
  };
}

let dbInstance: DbClient | null = null;

class TableHelper<T> {
  constructor(
    private tableName: string,
    private runQuery: (sql: string, params: any[]) => Promise<any[]>,
    private executeQuery: (sql: string, params: any[]) => Promise<{ changes: number; lastInsertRowid?: number }>,
    private booleanFields: string[] = []
  ) {}

  private mapRow(row: any): T {
    if (!row) return row;
    const mapped = { ...row };
    for (const field of this.booleanFields) {
      if (field in mapped) {
        mapped[field] = mapped[field] === 1 || mapped[field] === true || mapped[field] === "true";
      }
    }
    // Convert SQLite datetime strings (e.g. "2026-07-16 18:00:00") or timestamps to Date objects for TS compat
    if ("createdAt" in mapped && typeof mapped.createdAt === "string") {
      mapped.createdAt = new Date(mapped.createdAt);
    }
    if ("updatedAt" in mapped && typeof mapped.updatedAt === "string") {
      mapped.updatedAt = new Date(mapped.updatedAt);
    }
    return mapped as T;
  }

  private mapParams(data: any): { columns: string[]; values: any[] } {
    const columns: string[] = [];
    const values: any[] = [];
    for (const key of Object.keys(data)) {
      columns.push(key);
      let val = data[key];
      if (this.booleanFields.includes(key) && typeof val === "boolean") {
        val = val ? 1 : 0;
      }
      values.push(val);
    }
    return { columns, values };
  }

  async findMany(args?: { where?: any; orderBy?: any; take?: number }): Promise<T[]> {
    let sql = `SELECT * FROM "${this.tableName}"`;
    const params: any[] = [];
    if (args?.where) {
      const clauses: string[] = [];
      for (const key of Object.keys(args.where)) {
        let val = args.where[key];
        if (this.booleanFields.includes(key) && typeof val === "boolean") {
          val = val ? 1 : 0;
        }
        clauses.push(`"${key}" = ?`);
        params.push(val);
      }
      if (clauses.length) {
        sql += ` WHERE ${clauses.join(" AND ")}`;
      }
    }
    if (args?.orderBy) {
      const keys = Object.keys(args.orderBy);
      if (keys.length) {
        const orderClauses = keys.map(k => `"${k}" ${args.orderBy[k].toUpperCase()}`);
        sql += ` ORDER BY ${orderClauses.join(", ")}`;
      }
    }
    if (args?.take !== undefined) {
      sql += ` LIMIT ?`;
      params.push(args.take);
    }
    const rows = await this.runQuery(sql, params);
    return rows.map(r => this.mapRow(r));
  }

  async findUnique(args: { where: { id: number } }): Promise<T | null> {
    const sql = `SELECT * FROM "${this.tableName}" WHERE "id" = ? LIMIT 1`;
    const rows = await this.runQuery(sql, [args.where.id]);
    return rows.length ? this.mapRow(rows[0]) : null;
  }

  async create(args: { data: any }): Promise<T> {
    const { columns, values } = this.mapParams(args.data);
    const sql = `INSERT INTO "${this.tableName}" (${columns.map(c => `"${c}"`).join(", ")}) VALUES (${columns.map(() => "?").join(", ")})`;
    const res = await this.executeQuery(sql, values);
    
    const id = res.lastInsertRowid;
    if (id) {
      const created = await this.findUnique({ where: { id } });
      if (created) return created;
    }
    return { id, ...args.data } as any;
  }

  async update(args: { where: { id: number }; data: any }): Promise<T> {
    const { columns, values } = this.mapParams(args.data);
    const setClauses = columns.map(c => `"${c}" = ?`).join(", ");
    const sql = `UPDATE "${this.tableName}" SET ${setClauses} WHERE "id" = ?`;
    await this.executeQuery(sql, [...values, args.where.id]);
    const updated = await this.findUnique({ where: { id: args.where.id } });
    if (!updated) {
      throw new Error(`Record to update not found: id ${args.where.id}`);
    }
    return updated;
  }

  async delete(args: { where: { id: number } }): Promise<T> {
    const existing = await this.findUnique({ where: { id: args.where.id } });
    if (!existing) {
      throw new Error(`Record to delete not found: id ${args.where.id}`);
    }
    const sql = `DELETE FROM "${this.tableName}" WHERE "id" = ?`;
    await this.executeQuery(sql, [args.where.id]);
    return existing;
  }

  async count(args?: { where?: any }): Promise<number> {
    let sql = `SELECT COUNT(*) as count FROM "${this.tableName}"`;
    const params: any[] = [];
    if (args?.where) {
      const clauses: string[] = [];
      for (const key of Object.keys(args.where)) {
        let val = args.where[key];
        if (this.booleanFields.includes(key) && typeof val === "boolean") {
          val = val ? 1 : 0;
        }
        clauses.push(`"${key}" = ?`);
        params.push(val);
      }
      if (clauses.length) {
        sql += ` WHERE ${clauses.join(" AND ")}`;
      }
    }
    const rows = await this.runQuery(sql, params);
    return rows.length ? Number(rows[0].count) : 0;
  }
}

function createClient(
  runQuery: (sql: string, params: any[]) => Promise<any[]>,
  executeQuery: (sql: string, params: any[]) => Promise<{ changes: number; lastInsertRowid?: number }>
): DbClient {
  return {
    profile: new TableHelper<Profile>("Profile", runQuery, executeQuery),
    skill: new TableHelper<Skill>("Skill", runQuery, executeQuery),
    hobby: new TableHelper<Hobby>("Hobby", runQuery, executeQuery),
    project: new TableHelper<Project>("Project", runQuery, executeQuery, ["visible"]),
    familyMember: new TableHelper<FamilyMember>("FamilyMember", runQuery, executeQuery),
    galleryItem: new TableHelper<GalleryItem>("GalleryItem", runQuery, executeQuery),
    message: new TableHelper<Message>("Message", runQuery, executeQuery, ["read"]),
    milestone: new TableHelper<Milestone>("Milestone", runQuery, executeQuery),
    video: new TableHelper<Video>("Video", runQuery, executeQuery, ["featured"]),
  };
}

export async function getDb(): Promise<DbClient | null> {
  if (dbInstance) return dbInstance;

  const url = process.env.DATABASE_URL;
  if (url?.startsWith("file:")) {
    try {
      let sqlitePath = url.replace("file:", "");
      if (!sqlitePath.startsWith("/") && !sqlitePath.includes(":\\")) {
        sqlitePath = join(process.cwd(), sqlitePath);
      }
      const Database = (await import("better-sqlite3")).default;
      const db = new Database(sqlitePath);

      dbInstance = createClient(
        async (sql, params) => {
          return db.prepare(sql).all(...params);
        },
        async (sql, params) => {
          const res = db.prepare(sql).run(...params);
          return {
            changes: res.changes,
            lastInsertRowid: Number(res.lastInsertRowid),
          };
        }
      );
      return dbInstance;
    } catch (e) {
      console.error("Failed to initialize local better-sqlite3 database:", e);
      return null;
    }
  }

  // On Cloudflare, use D1 Database binding
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = getCloudflareContext();
    const binding = (env as { DB?: D1Database }).DB;
    if (binding) {
      dbInstance = createClient(
        async (sql, params) => {
          const res = await binding.prepare(sql).bind(...params).all();
          return res.results || [];
        },
        async (sql, params) => {
          const res = await binding.prepare(sql).bind(...params).run();
          return {
            changes: res.meta.changes || 0,
            lastInsertRowid: Number(res.meta.last_row_id || res.meta.lastRowId || 0),
          };
        }
      );
      return dbInstance;
    }
  } catch (e) {
    // Not in Cloudflare context
  }

  return null;
}
