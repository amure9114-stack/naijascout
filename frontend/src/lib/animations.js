import { animate, useMotionValue } from 'framer-motion';
import { useEffect, useState } from 'react';

export const pageFade = {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
    exit: { opacity: 0, y: 10, transition: { duration: 0.28 } }
};

export const listContainer = {
    initial: {},
    animate: { transition: { staggerChildren: 0.06, delayChildren: 0.06 } }
};

export const listItem = {
    initial: { opacity: 0, y: 8, scale: 0.995 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.42, ease: 'easeOut' } },
    exit: { opacity: 0, y: -6, transition: { duration: 0.22 } }
};

export function useAnimatedNumber(target, duration = 0.9) {
    const mv = useMotionValue(0);
    const [value, setValue] = useState(Math.round(target || 0));
    useEffect(() => {
        const controls = animate(mv, target || 0, {
            duration,
            ease: 'easeOut',
            onUpdate(v) { setValue(Math.round(v)); }
        });
        return () => controls.stop();
    }, [target, duration]);
    return value;
}
