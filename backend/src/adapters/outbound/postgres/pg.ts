import { Pool } from "pg";

export function createPgPool() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL not set");
  return new Pool({ connectionString: url });
}

