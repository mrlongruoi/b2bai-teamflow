import { router } from "@/app/router";
import { RPCHandler } from "@orpc/server/fetch";

const handler = new RPCHandler(router);

/**
 * Routes an incoming HTTP request through the RPC handler and returns its HTTP response.
 *
 * @param request - The incoming HTTP Request to route to the RPC handler
 * @returns The `Response` produced by the RPC handler, or a 404 `Response` with body "Not found" if no response was produced
 */
async function handleRequest(request: Request) {
  const { response } = await handler.handle(request, {
    prefix: "/rpc",
    context: {}, // Provide initial context if needed
  });

  return response ?? new Response("Not found", { status: 404 });
}

export const HEAD = handleRequest;
export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;