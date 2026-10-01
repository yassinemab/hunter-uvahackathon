"use client";

import { useEffect, useRef } from "react";
import { RobinHoodAnimator } from "./robin-animator";
import styles from "./robin-feedback.module.css";

export type RobinAnimation = "idle" | "correct" | "incorrect" | "lose-arrow";

/** The original offline SVG mascot, owned by this component's React lifecycle. */
export default function RobinMascot({
  state = "idle",
  variant = "scene",
  className = "",
}: {
  state?: RobinAnimation;
  variant?: "scene" | "portrait";
  className?: string;
}) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    const element = container.current;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animator = new RobinHoodAnimator(element, { background: false });
    const svg = element.querySelector("svg");
    svg?.setAttribute("aria-hidden", "true");
    svg?.removeAttribute("role");
    if (variant === "portrait") svg?.setAttribute("viewBox", "210 75 205 230");
    void animator.play(state);

    const updateMotion = () => {
      animator.setReducedMotion(media.matches);
      void animator.play(state);
    };
    media.addEventListener("change", updateMotion);
    return () => {
      media.removeEventListener("change", updateMotion);
      animator.destroy();
    };
  }, [state, variant]);

  return (
    <div
      ref={container}
      aria-hidden="true"
      className={`${styles.mascot} ${variant === "portrait" ? styles.portrait : styles.scene} ${className}`}
    />
  );
}
