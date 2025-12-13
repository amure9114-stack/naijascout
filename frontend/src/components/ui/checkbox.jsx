import React from "react";
import clsx from "clsx";

export const Checkbox = React.forwardRef(
    ({ className, id, checked, onCheckedChange, ...props }, ref) => (
        <input
            type="checkbox"
            id={id}
            checked={checked}
            onChange={(e) => onCheckedChange?.(e.target.checked)}
            className={clsx("w-4 h-4 rounded border-2 border-input cursor-pointer", className)}
            ref={ref}
            {...props}
        />
    )
);

Checkbox.displayName = "Checkbox";
