import { createId } from "@paralleldrive/cuid2";

import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

const userRole = pgEnum("user_role", ["customer", "manager"]);

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  role: userRole("role").default("customer").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
