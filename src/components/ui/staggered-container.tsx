"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface StaggeredContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggeredContainer({
  children,
  className,
  staggerDelay = 0.05,
}: StaggeredContainerProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </motion.div>
  );
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function StaggeredItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={item}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 24,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
