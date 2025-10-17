import { router } from "@/app/router";
import { RPCHandler } from "@orpc/server/fetch";

const handler = new RPCHandler(router);

/**
 * Forwards an incoming Request to the RPC handler and returns the handler's response or a 404 "Not found" response.
 *
 * @param request - The incoming HTTP Request; it is included in the RPC context as `context.request`.
 * @returns The Response produced by the RPC handler if available, otherwise a Response with body "Not found" and status 404.
 */
async function handleRequest(request: Request) {
  const { response } = await handler.handle(request, {
    prefix: "/rpc",
    context: {
      request,
    }, // Provide initial context if needed
  });

  return response ?? new Response("Not found", { status: 404 });
}

export const HEAD = handleRequest;
export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;