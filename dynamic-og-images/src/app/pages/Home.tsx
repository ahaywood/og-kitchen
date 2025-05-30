import { RequestInfo } from "rwsdk/worker";

export function Home({ ctx }: RequestInfo) {
  return (
    <div>
      <meta name="og:title" content="Hello, Amy!" />
      <meta name="og:image" content="/og-react" />
      <p>
        {ctx.user?.username
          ? `You are logged in as user ${ctx.user.username}`
          : "You are not logged in"}
      </p>
    </div>
  );
}
