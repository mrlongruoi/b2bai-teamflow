/**
 * Loads the server-side ORPC instrumentation module by dynamically importing "@/lib/orpc.server".
 *
 * Invoking this function triggers the imported module's top-level initialization and side effects.
 */
export async function register() {
  // Conditionally import if facing runtime compatibility issues
  // if (process.env.NEXT_RUNTIME === "nodejs") {
  await import("@/lib/orpc.server");
  // }
}