import { sql } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

// -------------------------------PRIVATE--------------------------------- //

const commonColumns = {
	id: t.uuid("id").primaryKey().default(sql`uuid_generate_v4()`),
	createdAt: t.timestamp("created_at", { withTimezone: true }).defaultNow(),
	updatedAt: t
		.timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.$onUpdate(() => new Date()),
};

// -------------------------------PUBLIC--------------------------------- //

export const users = pgTable("users", {
	...commonColumns,
	name: t.text("name").notNull(),
	email: t.text("email").notNull(),
	password: t.text("password").notNull(),
});

export const tasks = pgTable("tasks", {
	...commonColumns,
	title: t.text("title").notNull(),
	status: t.text("status").notNull(),
	description: t.text("description"),
	// userId: t
	// 	.uuid("user_id")
	// 	.notNull()
	// 	.references(() => UserTable.id, { onDelete: "cascade" }),
});
