import React from "react";
import clsx from "clsx";

export const Separator = React.forwardRef(
    ({ className, ...props }, ref) => (
        <hr
            ref={ref}
            className={clsx("bg-border h-px", className)}
            {...props}
        />
    )
);

Separator.displayName = "Separator";
