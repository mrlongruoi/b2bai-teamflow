import { Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Renders a spinning loader icon for indicating loading state.
 *
 * @param className - Additional class names merged with the default "size-4 animate-spin".
 * @param props - Additional SVG props forwarded to the underlying icon element.
 * @returns An SVG element with an `aria-label` of "Loading" and the combined classes.
 */
function Spinner({ className, ...props }: Readonly<React.ComponentProps<"svg">>) {
  return (
    <Loader2Icon
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }