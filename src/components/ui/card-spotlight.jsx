// Aceternity UI - Card Spotlight Component
// Card with spotlight hover effect

import { cn } from "@/lib/utils";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

export const CardSpotlight = ({
  children,
  className,
  radius = 350,
  color = "#f97316",
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={cn(
        "group relative rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 overflow-hidden",
        className
      )}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              ${radius}px circle at ${mouseX}px ${mouseY}px,
              ${color}15,
              transparent 80%
            )
          `,
        }}
      />
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              ${radius}px circle at ${mouseX}px ${mouseY}px,
              ${color}10,
              transparent 80%
            )
          `,
        }}
      />
      {children}
    </div>
  );
};

export default CardSpotlight;
