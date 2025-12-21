import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    (<input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-base text-white file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-slate-950 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#f97316] focus-visible:border-[#f97316] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-colors",
        className
      )}
      ref={ref}
      {...props} />)
  );
})
Input.displayName = "Input"

export { Input }
