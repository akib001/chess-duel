import { Pool } from "pg";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

interface User {
  username: string;
  email: string;
  password: string;
}

const users: User[] = [
  { username: "alice", email: "alice@example.com", password: "password123" },
  { username: "bob", email: "bob@example.com", password: "password456" },
  {
    username: "charlie",
    email: "charlie@example.com",
    password: "password789",
  },
];

async function seedUsers(): Promise<void> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const data = await client.query(
        "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) ON CONFLICT (username) DO NOTHING",
        [user.username, user.email, hashedPassword]
      );

      console.log(data);
    }

    await client.query("COMMIT");
    console.log("Users seeded successfully");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error seeding users:", error);
  } finally {
    client.release();
  }
}

// Run the seeder if this script is executed directly
if (require.main === module) {
  seedUsers().then(() => process.exit());
}

export { seedUsers };
