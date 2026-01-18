import { createMiddleware } from "@tanstack/react-start";
import { getHeaders } from "@tanstack/react-start/server";
import { getSession } from "@/lib/auth/auth-client";

function isLocalDev() {
  const nodeEnv = process.env.NODE_ENV;
  if (nodeEnv === "production") return false;

  try {
    const headers = getHeaders() as Record<string, string | undefined>;
    const host = headers["host"] || headers["Host"] || "";
    return host.startsWith("localhost") || host.startsWith("127.0.0.1");
  } catch {
    return nodeEnv !== "production";
  }
}

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  if (isLocalDev()) {
    const devContext: {
      user: {
        id: string | undefined
        name: string | undefined
        image: string | null | undefined
      }
      isAuthenticated: boolean
    } = {
      user: {
        id: "dev-user",
        name: "Dev User",
        image: "",
      },
      isAuthenticated: true,
    }

    return next({
      context: devContext,
    })
  }

  const { data: session } = await getSession({
    fetchOptions: {
      headers: getHeaders() as HeadersInit,
    },
  })

  const sessionContext: {
    user: {
      id: string | undefined
      name: string | undefined
      image: string | null | undefined
    }
    isAuthenticated: boolean
  } = {
    user: {
      id: session?.user?.id,
      name: session?.user?.name,
      image: session?.user?.image ?? null,
    },
    isAuthenticated: !!session?.user,
  }

  return next({
    context: sessionContext,
  })
})
