import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./db/migrations",
	schema: "./db/schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		host: process.env.POSTGRES_HOST as string,
		port: 5432,
		user: process.env.POSTGRES_USER as string,
		password: process.env.POSTGRES_PASSWORD as string,
		database: process.env.POSTGRES_DB as string,
		ssl: false,
	},
});
