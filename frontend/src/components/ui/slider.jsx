import React from "react";
import clsx from "clsx";

export const Slider = ({ value, onValueChange, min = 0, max = 100, step = 1, className }) => {
    return (
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value?.[0] || value}
            onChange={(e) => onValueChange?.([Number(e.target.value)])}
            className={clsx(
                "w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider",
                className
            )}
        />
    );
};

Slider.displayName = "Slider";
