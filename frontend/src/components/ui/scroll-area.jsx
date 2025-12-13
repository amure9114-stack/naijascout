import React from "react";
import clsx from "clsx";

export const ScrollArea = React.forwardRef(
    ({ className, children, ...props }, ref) => (
        <div
            ref={ref}
            className={clsx("overflow-y-auto overflow-x-hidden", className)}
            {...props}
        >
            {children}
        </div>
    )
);

ScrollArea.displayName = "ScrollArea";
