"use client";

import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface TypingAnimationProps
  extends Omit<HTMLMotionProps<"div">, "children"> {
  children: string;
  className?: string;
  duration?: number;
  delay?: number;
  startOnView?: boolean;
}

export function TypingAnimation({
  children,
  className,
  duration = 100,
  delay = 0,
  startOnView = false,
  ...props
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState<string>("");
  const [started, setStarted] = useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(elementRef, {
    amount: 0.3,
    once: true,
  });

  useEffect(() => {
    if (!startOnView) {
      const startTimeout = setTimeout(() => {
        setStarted(true);
      }, delay);
      return () => clearTimeout(startTimeout);
    }

    if (!isInView) return;

    const startTimeout = setTimeout(() => {
      setStarted(true);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [delay, startOnView, isInView]);

  useEffect(() => {
    if (!started) return;

    const graphemes = Array.from(children);
    let i = 0;
    const typingEffect = setInterval(() => {
      if (i < graphemes.length) {
        setDisplayedText(graphemes.slice(0, i + 1).join(""));
        i++;
      } else {
        clearInterval(typingEffect);
      }
    }, duration);

    return () => {
      clearInterval(typingEffect);
    };
  }, [children, duration, started]);

  return (
    <motion.div
      ref={elementRef}
      className={cn(
        "text-4xl font-bold leading-[5rem] tracking-[-0.02em]",
        className
      )}
      {...props}
    >
      {displayedText}
    </motion.div>
  );
}
