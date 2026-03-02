import { env } from "../env";
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { registerRestaurant } from "./routes/register-restaurant";
import { sendAuthLink } from "./routes/send-auth-link";
import { authenticateFromLink } from "./routes/authenticate-from-link";
import { signOut } from "./routes/sign-out";
import { getProfile } from "./routes/get-profile";

const app = new Elysia()
  .use(
    cors({
      origin: env.AUTH_REDIRECT_URL,
      credentials: true,
    }),
  )
  .use(registerRestaurant)
  .use(sendAuthLink)
  .use(authenticateFromLink)
  .use(signOut)
  .use(getProfile);

app.listen(env.PORT, () => {
  console.log(`🦊 HTTP server running at http://localhost:${env.PORT}`);
});
