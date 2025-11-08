import 'dotenv/config';
import { createApp } from "../../adapters/inbound/http/app";
import { createPgPool } from "../../adapters/outbound/postgres/pg";
import { RoutesRepoPg } from "../../adapters/outbound/postgres/RoutesRepoPg";
import { BankingRepoPg, ComplianceRepoPg, RoutesReadRepoPg } from "../../adapters/outbound/postgres/CompliancePg";

const port = Number(process.env.PORT || 3001);

async function main() {
  const pool = createPgPool();
  const routesRepo = new RoutesRepoPg(pool);
  const routesReadRepo = new RoutesReadRepoPg(pool);
  const complianceRepo = new ComplianceRepoPg(pool);
  const bankingRepo = new BankingRepoPg(pool);

  const app = createApp({ routesRepo, routesReadRepo, complianceRepo, bankingRepo });
  app.listen(port, () => console.log(`HTTP listening on :${port}`));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
