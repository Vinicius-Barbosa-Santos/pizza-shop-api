import postgres from "postgres";
import { env } from "../env";

import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

import chalk from "chalk";

const connection = postgres(env.DATABASE_URL, {
  max: 1,
});
const db = drizzle(connection);

await migrate(db, { migrationsFolder: "drizzle" });
await connection.end();

console.log(chalk.green("Migration completed"));

process.exit();
