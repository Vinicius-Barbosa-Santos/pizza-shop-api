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
  .derive(async ({ jwt, removeCookie, set, cookie, request }) => {
    return {
      signUser: async (payload: Static<typeof jwtPayload>) => {
        const token = await jwt.sign(payload);

        set.headers["Set-Cookie"] = `auth=${token}; HttpOnly; Path=/; Max-Age=${
          60 * 60 * 24 * 7
        }`;
      },
      signOut: () => {
        removeCookie("auth");
      },

      getCurrentUser: async () => {
        const raw = (cookie as any)?.auth;
        const authHeader = request.headers.get("authorization") || undefined;
        const bearer = authHeader?.startsWith("Bearer ")
          ? authHeader.slice(7).trim()
          : undefined;

        let cookieToken: string | undefined;
        if (typeof raw === "string") {
          cookieToken = raw;
        } else if (raw?.value && typeof raw.value === "string") {
          cookieToken = raw.value;
        } else if (
          raw?.initial?.value &&
          typeof raw.initial.value === "string"
        ) {
          cookieToken = raw.initial.value;
        }

        const token = (cookieToken ?? bearer) || "";
        const payload = await jwt.verify(token);

        if (!payload) {
          throw new Error("Unauthorized");
        }

        return {
          userId: payload.sub,
          restaurantId: payload.restaurantId,
        };
      },
    };
  });
