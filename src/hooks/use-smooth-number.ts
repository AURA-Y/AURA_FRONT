import { useEffect, useState } from "react";
import { useSpring, useMotionValue } from "framer-motion";

export function useSmoothNumber(value: number) {
  const motionValue = useMotionValue(value);
  const springValue = useSpring(motionValue, {
    damping: 20,
    stiffness: 100,
  });
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(Math.round(latest));
    });
    return () => unsubscribe();
  }, [springValue]);

  return displayValue;
}
