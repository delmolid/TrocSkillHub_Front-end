import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva("block rounded-[10px] px-4 py-3 text-sm font-bold shadow-sm", {
  variants: {
    variant: {
      error: "bg-white text-red-600",
      success:
        "border border-green-300 bg-green-50 text-center text-green-600",
    },
  },
  defaultVariants: {
    variant: "error",
  },
})

function Alert({
  className,
  variant = "error",
  ...props
}: React.ComponentProps<"p"> & VariantProps<typeof alertVariants>) {
  return (
    <p
      data-slot="alert"
      data-variant={variant}
      className={cn(alertVariants({ variant, className }))}
      {...props}
    />
  )
}

export { Alert, alertVariants }
