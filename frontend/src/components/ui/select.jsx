import React, { useState } from "react";
import clsx from "clsx";

export const Select = ({ children, value, onValueChange }) => {
    return (
        <div className="relative">
            {React.Children.map(children, (child) =>
                React.cloneElement(child, { value, onValueChange })
            )}
        </div>
    );
};

export const SelectTrigger = React.forwardRef(({ className, children, value, onValueChange, onClick }, ref) => {
    const [open, setOpen] = useState(false);

    return (
        <button
            ref={ref}
            onClick={() => setOpen(!open)}
            className={clsx(
                "flex items-center justify-between w-full px-3 py-2 border border-input rounded-md bg-background text-sm",
                className
            )}
        >
            {children}
        </button>
    );
});

SelectTrigger.displayName = "SelectTrigger";

export const SelectValue = ({ placeholder }) => <span>{placeholder}</span>;

export const SelectContent = ({ children }) => (
    <div className="absolute top-full left-0 w-full mt-1 bg-background border border-input rounded-md shadow-lg z-50">
        {children}
    </div>
);

export const SelectItem = ({ value, children, onValueChange }) => (
    <div
        onClick={() => onValueChange?.(value)}
        className="px-3 py-2 cursor-pointer hover:bg-accent text-sm"
    >
        {children}
    </div>
);
