import { auth } from "../auth";

export const signOut = auth.post(
  "/sign-out",
  async ({ signOut: internalSignOut, set }) => {
    internalSignOut();
    set.status = 204;
  },
);
