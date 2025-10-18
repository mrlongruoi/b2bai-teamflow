/**
 * Registers runtime server bindings by conditionally loading the ORPC server module.
 *
 * If the NEXT_RUNTIME environment variable equals "nodejs", dynamically imports "@/lib/orpc.server"; otherwise no action is taken.
 */
export async function register() {
  // Conditionally import if facing runtime compatibility issues
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("@/lib/orpc.server");
  }
}