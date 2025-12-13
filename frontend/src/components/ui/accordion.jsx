import React, { useState } from "react";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";

export const Accordion = ({ type = "single", defaultValue = [], children }) => {
    const [openItems, setOpenItems] = useState(defaultValue);

    const toggleItem = (value) => {
        if (type === "single") {
            setOpenItems(openItems.includes(value) ? [] : [value]);
        } else {
            setOpenItems(
                openItems.includes(value)
                    ? openItems.filter((v) => v !== value)
                    : [...openItems, value]
            );
        }
    };

    return (
        <div>
            {React.Children.map(children, (child) =>
                React.cloneElement(child, { isOpen: openItems, toggleItem })
            )}
        </div>
    );
};

export const AccordionItem = ({ value, children, isOpen = [], toggleItem }) => (
    <div className="border border-border rounded-md mb-2">
        {React.Children.map(children, (child) =>
            React.cloneElement(child, { value, isOpen, toggleItem })
        )}
    </div>
);

export const AccordionTrigger = ({ children, value, isOpen = [], toggleItem }) => (
    <button
        onClick={() => toggleItem(value)}
        className="w-full flex items-center justify-between p-3 hover:bg-muted transition-colors"
    >
        {children}
        <ChevronDown
            className={clsx("w-4 h-4 transition-transform", isOpen?.includes(value) && "rotate-180")}
        />
    </button>
);

export const AccordionContent = ({ children, value, isOpen = [] }) => {
    if (!isOpen?.includes(value)) return null;

    return <div className="px-4 pb-3 border-t border-border">{children}</div>;
};
