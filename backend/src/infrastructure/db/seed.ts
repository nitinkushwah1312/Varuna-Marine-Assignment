import 'dotenv/config';
import { createPgPool } from "../../adapters/outbound/postgres/pg";

async function seed() {
  const pool = createPgPool();
  await pool.query("truncate table routes restart identity cascade");
  const data = [
    ['R001','Container','HFO',2024,91.0,5000,12000,4500,true],
    ['R002','BulkCarrier','LNG',2024,88.0,4800,11500,4200,false],
    ['R003','Tanker','MGO',2024,93.5,5100,12500,4700,false],
    ['R004','RoRo','HFO',2025,89.2,4900,11800,4300,false],
    ['R005','Container','LNG',2025,90.5,4950,11900,4400,false],
    // Extra row to demonstrate banking surplus for R001 across years
    ['R001','Container','LNG',2025,88.0,4800,11800,4200,false],
  ];
  for (const r of data) {
    await pool.query(
      `insert into routes (route_id, vessel_type, fuel_type, year, ghg_intensity, fuel_consumption, distance, total_emissions, is_baseline)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9)`, r
    );
  }
  console.log("Seeded routes.");
  await pool.end();
}

seed().catch((e) => { console.error(e); process.exit(1); });
