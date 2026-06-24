import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
  __arenaNextJsPostgresqlDrizzle?: NodePgDatabase;
};

function getPool(): Pool {
  if (globalForDb.__arenaNextJsPostgresqlPool) {
    return globalForDb.__arenaNextJsPostgresqlPool;
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required");
  }

  const pool = new Pool({ connectionString: databaseUrl });

  if (process.env.NODE_ENV !== "production") {
    globalForDb.__arenaNextJsPostgresqlPool = pool;
  }

  return pool;
}

function getDb(): NodePgDatabase {
  if (globalForDb.__arenaNextJsPostgresqlDrizzle) {
    return globalForDb.__arenaNextJsPostgresqlDrizzle;
  }

  const instance = drizzle(getPool());

  if (process.env.NODE_ENV !== "production") {
    globalForDb.__arenaNextJsPostgresqlDrizzle = instance;
  }

  return instance;
}

export const pool = new Proxy({} as Pool, {
  get(_target, prop, receiver) {
    const realPool = getPool();
    const value = Reflect.get(realPool, prop, receiver);
    if (typeof value === "function") {
      return value.bind(realPool);
    }
    return value;
  },
});

export const db = new Proxy({} as NodePgDatabase, {
  get(_target, prop, receiver) {
    const realDb = getDb();
    const value = Reflect.get(realDb, prop, receiver);
    if (typeof value === "function") {
      return value.bind(realDb);
    }
    return value;
  },
});
