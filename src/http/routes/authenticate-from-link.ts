import { Elysia, t } from "elysia";
import { auth } from "../auth";
import { db } from "../../db/connection";
import dayjs from "dayjs";
import { authLinks } from "../../db/schema";
import { eq } from "drizzle-orm";

export const authenticateFromLink = new Elysia().use(auth).get(
  "/auth-links/authenticate/",
  async ({ query, jwt: { sign }, set }) => {
    const { code, redirect } = query;

    const authLinkFromCode = await db.query.authLinks.findFirst({
      where(fields, { eq }) {
        return eq(fields.code, code);
      },
    });

    if (!authLinkFromCode) {
      throw new Error("Auth link not found");
    }

    const daysSinceAuthLinkWasCreated = dayjs().diff(
      dayjs(authLinkFromCode.createdAt),
      "days",
    );

    if (daysSinceAuthLinkWasCreated > 7) {
      throw new Error("Auth link expired, please request a new one");
    }

    const managedRestaurant = await db.query.restaurants.findFirst({
      where(fields, { eq }) {
        return eq(fields.managerId, authLinkFromCode.userId);
      },
    });

    const token = await sign({
      sub: authLinkFromCode.userId,
      restaurantId: managedRestaurant?.id,
    });

    // ✅ Setando cookie manualmente (Node/Elysia)
    set.headers["Set-Cookie"] = `auth=${token}; HttpOnly; Path=/; Max-Age=${
      60 * 60 * 24 * 7
    }`;

    await db.delete(authLinks).where(eq(authLinks.code, code));

    // ✅ Redirecionamento correto no Node
    set.status = 302;
    set.headers.Location = redirect || "/";

    return;
  },
  {
    query: t.Object({
      code: t.String(),
      redirect: t.Optional(t.String()),
    }),
  },
);
