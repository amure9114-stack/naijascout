import React from "react";
import clsx from "clsx";

export const Input = React.forwardRef(
    ({ className, type = "text", ...props }, ref) => (
        <input
            type={type}
            className={clsx(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            ref={ref}
            {...props}
        />
    )
);

Input.displayName = "Input";
