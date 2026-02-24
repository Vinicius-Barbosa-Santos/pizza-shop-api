import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from ".";
import { createId } from "@paralleldrive/cuid2";

export const authLinks = pgTable("auth_links", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  code: text("code").notNull().unique(),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
