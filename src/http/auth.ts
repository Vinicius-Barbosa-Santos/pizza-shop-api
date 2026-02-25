import { env } from "../env";
import { Elysia, t, type Static } from "elysia";
import jwt from "@elysiajs/jwt";
import cookie from "@elysiajs/cookie";

const jwtPayload = t.Object({
  sub: t.String(),
  restaurantId: t.Optional(t.String()),
});

export const auth = new Elysia()
  .use(
    jwt({
      secret: env.JWT_SECRET,
      schema: t.Object({
        sub: t.String(),
        restaurantId: t.Optional(t.String()),
      }),
    }),
  )
  .use(cookie())
  .derive(({ jwt, removeCookie, set }) => {
    return {
      signUser: async (payload: Static<typeof jwtPayload>) => {
        const token = await jwt.sign(payload);

        // ✅ Setando cookie manualmente (Node/Elysia)
        set.headers["Set-Cookie"] = `auth=${token}; HttpOnly; Path=/; Max-Age=${
          60 * 60 * 24 * 7
        }`;
      },

      signOut: () => {
        removeCookie("auth");
      },
    };
  });
