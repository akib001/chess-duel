import { env } from "@/common/utils/envConfig";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export default pool;
