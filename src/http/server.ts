import { Elysia } from "elysia";
import { env } from "../env";

new Elysia().get("/", () => "Hello, Elysia on Bun!").listen(env.PORT);

console.log(`🦊 Server running at http://localhost:${env.PORT}`);
