import 'dotenv/config';
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { Pool } = require('pg');

const file = process.argv[2];
if (!file) {
  console.error('Usage: node run-sql.mjs <file.sql>');
  process.exit(1);
}

const sql = fs.readFileSync(file, 'utf8');
const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const pool = new Pool({ connectionString: url });
pool.query(sql)
  .then(() => console.log('SQL applied:', file))
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => pool.end());
