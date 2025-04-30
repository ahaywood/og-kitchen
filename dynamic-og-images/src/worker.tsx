import { defineApp, ErrorResponse } from "@redwoodjs/sdk/worker";
import { route, render, prefix } from "@redwoodjs/sdk/router";
import { Document } from "@/app/Document";
import { Home } from "@/app/pages/Home";
import { setCommonHeaders } from "@/app/headers";
import { userRoutes } from "@/app/pages/user/routes";
import { sessions, setupSessionStore } from "./session/store";
import { Session } from "./session/durableObject";
import { db, setupDb } from "./db";
import type { User } from "@prisma/client";
import { env } from "cloudflare:workers";
import { ImageResponse } from "workers-og";
import Og from "./app/components/og";
export { SessionDurableObject } from "./session/durableObject";

export type AppContext = {
  session: Session | null;
  user: User | null;
};

export default defineApp([
  setCommonHeaders(),
  async ({ ctx, request, headers }) => {
    await setupDb(env);
    setupSessionStore(env);

    try {
      ctx.session = await sessions.load(request);
    } catch (error) {
      if (error instanceof ErrorResponse && error.code === 401) {
        await sessions.remove(request, headers);
        headers.set("Location", "/user/login");

        return new Response(null, {
          status: 302,
          headers,
        });
      }

      throw error;
    }

    if (ctx.session?.userId) {
      ctx.user = await db.user.findUnique({
        where: {
          id: ctx.session.userId,
        },
      });
    }
  },
  render(Document, [
    route("/", () => new Response("Hello, World!")),
    route("/og", () => {
      const title = "Hello, World!";
      const html = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; width: 100vw; font-family: sans-serif; background: #160f29">
          <div style="display: flex; width: 100vw; padding: 40px; color: white;">
            <h1 style="font-size: 60px; font-weight: 600; margin: 0; font-family: 'Bitter'; font-weight: 500">${title}</h1>
          </div>
        </div>
      `;

      return new ImageResponse(html, {
        width: 1200,
        height: 630,
      });
    }),
    route("/og-react", () => {
      const title = "Hello, Adele!";
      const og = <Og title={title} />;

      return new ImageResponse(og, {
        width: 1200,
        height: 630,
      });
    }),
    prefix("/user", userRoutes),
  ]),
]);
