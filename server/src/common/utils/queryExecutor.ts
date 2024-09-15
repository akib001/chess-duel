import pool from "@/config/database";

export const executeQuery = async <T>(
  query: string,
  params?: any[]
): Promise<T[]> => {
  const client = await pool.connect();
  try {
    const result = await client.query(query, params);
    return result.rows;
  } finally {
    client.release();
  }
};
