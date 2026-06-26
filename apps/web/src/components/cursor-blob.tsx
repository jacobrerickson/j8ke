"use client";

import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";

// Half of w-72 / h-72 (288px) so the blob centers on the cursor.
const RADIUS = 144;

export function CursorBlob() {
  const reduceMotion = useReducedMotion();

  // Start off-screen until the first pointer move.
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);

  // Loose, laggy follow.
  const springConfig = { stiffness: 50, damping: 18, mass: 1.1 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  useEffect(() => {
    if (reduceMotion) return;
    const handleMove = (e: MouseEvent) => {
      x.set(e.clientX - RADIUS);
      y.set(e.clientY - RADIUS);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [reduceMotion, x, y]);

  if (reduceMotion) return null;

  return (
    <motion.div
      aria-hidden
      style={{ x: smoothX, y: smoothY }}
      animate={{
        backgroundColor: [
          "rgba(45, 212, 191, 0.20)", // teal
          "rgba(96, 165, 250, 0.20)", // blue
          "rgba(129, 140, 248, 0.20)", // indigo
          "rgba(192, 132, 252, 0.20)", // purple
          "rgba(45, 212, 191, 0.20)", // back to teal
        ],
      }}
      transition={{ duration: 24, ease: "linear", repeat: Infinity }}
      className="tw-pointer-events-none tw-fixed tw-left-0 tw-top-0 tw-z-0 tw-hidden tw-h-72 tw-w-72 tw-rounded-full tw-blur-3xl sm:tw-block"
    />
  );
}
