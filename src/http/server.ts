import { env } from "../env";
import { Elysia } from "elysia";
import { registerRestaurant } from "./routes/register-restaurant";
import { sendAuthLink } from "./routes/send-auth-link";

const app = new Elysia().use(registerRestaurant).use(sendAuthLink);

app.listen(env.PORT, () => {
  console.log(`🦊 HTTP server running at http://localhost:${env.PORT}`);
});
