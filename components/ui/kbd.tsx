import { cn } from "@/lib/utils"

/**
 * Renders a styled kbd element representing a keyboard key.
 *
 * Applies base keyboard styling, merges any provided `className`, and forwards remaining props to the rendered element. The element includes `data-slot="kbd"` to enable contextual styling (e.g., tooltip variants).
 *
 * @param className - Additional class names to append to the component's computed classes
 * @returns A React element for a styled keyboard key
 */
function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "bg-muted text-muted-foreground pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-sm px-1 font-sans text-xs font-medium select-none",
        "[&_svg:not([class*='size-'])]:size-3",
        "in-data-[data-slot=tooltip-content]:bg-background/20 in-data-[data-slot=tooltip-content]:text-background dark:in-data-[data-slot=tooltip-content]:bg-background/10",
        className
      )}
      {...props}
    />
  )
}

function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  )
}

export { Kbd, KbdGroup }