import { db } from "../../db/connection";
import { auth } from "../auth";

export const getProfile = auth.get("/me", async ({ getCurrentUser }) => {
  const current = await getCurrentUser();

  const user = await db.query.users.findFirst({
    where(fields, { eq }) {
      return eq(fields.id, current.userId);
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
});
