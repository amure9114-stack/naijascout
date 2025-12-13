import React from "react";
import clsx from "clsx";

export const Badge = ({ className, variant = "default", children, ...props }) => {
    const variants = {
        default: "bg-primary text-primary-foreground",
        outline: "border border-primary text-primary",
        secondary: "bg-secondary text-secondary-foreground",
    };

    return (
        <div
            className={clsx(
                "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

Badge.displayName = "Badge";
