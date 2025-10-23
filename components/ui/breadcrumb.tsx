import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"

function Breadcrumb({ ...props }: React.ComponentProps<"nav">) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />
}

/**
 * Renders an ordered list element that serves as the breadcrumb list container.
 *
 * The element includes a data-slot of "breadcrumb-list" and a set of default classes for layout and styling;
 * any additional `className` is merged with those defaults and other provided props are spread onto the `<ol>`.
 *
 * @param className - Additional class names to append to the default breadcrumb list classes
 * @param props - Other attributes and event handlers for the underlying `<ol>` element
 * @returns The rendered ordered list element containing breadcrumb items
 */
function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm wrap-break-words sm:gap-2.5",
        className
      )}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  )
}

function BreadcrumbLink({
  asChild,
  className,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn("hover:text-foreground transition-colors", className)}
      {...props}
    />
  )
}

/**
 * Renders the current page label within a breadcrumb as a non-interactive span.
 *
 * The element is marked with `data-slot="breadcrumb-page"`, `aria-disabled="true"`, and
 * `aria-current="page"`. Default styling (`text-foreground font-normal`) is applied and
 * merged with any provided `className`.
 *
 * @param className - Additional CSS classes to merge with the component's default classes
 * @param props - Additional props passed through to the underlying `span` element
 */
function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      aria-disabled="true"
      aria-current="page"
      className={cn("text-foreground font-normal", className)}
      {...props}
    />
  )
}

/**
 * Render a breadcrumb separator list item used between breadcrumb items.
 *
 * Renders an <li> with `data-slot="breadcrumb-separator"` and `aria-hidden="true"`. Child SVGs are sized consistently; if `children` is not provided a ChevronRight icon is rendered with `aria-hidden="true"` and `focusable="false"`.
 *
 * @param children - Content to render inside the separator; when omitted a ChevronRight icon is used.
 * @param className - Additional CSS class names applied to the separator container.
 * @returns The list item element representing the breadcrumb separator.
 */
function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5", className)}
      {...props}
    >
      {children ?? <ChevronRight aria-hidden="true" focusable="false" />}
    </li>
  )
}

/**
 * Renders a breadcrumb overflow control that indicates there are additional items.
 *
 * The component outputs a span with data-slot="breadcrumb-ellipsis", an accessible
 * MoreHorizontal icon, and a screen-reader-only label "More".
 *
 * @param className - Additional CSS classes to apply to the container
 * @returns A span element containing the ellipsis icon and an sr-only "More" label
 */
function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      aria-hidden="true"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More</span>
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}