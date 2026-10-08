"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useRef } from "react";

/** Decorative identity drawing. Its pointer response is disabled for reduced motion. */
export function OrbitMark({ initials = "BK" }: { initials?: string }) {
  const reduceMotion = useReducedMotion();
  const bounds = useRef<DOMRect | null>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 110, damping: 22 });
  const y = useSpring(pointerY, { stiffness: 110, damping: 22 });

  return <div className="orbit-mark" aria-hidden="true">
    <motion.div
      className="orbit-graphic h-full w-full"
      style={reduceMotion ? undefined : { x, y }}
      onPointerEnter={(event) => { bounds.current = event.currentTarget.getBoundingClientRect(); }}
      onPointerMove={(event) => {
        if (reduceMotion || event.pointerType !== "mouse" || !bounds.current) return;
        pointerX.set(((event.clientX - bounds.current.left) / bounds.current.width - 0.5) * 28);
        pointerY.set(((event.clientY - bounds.current.top) / bounds.current.height - 0.5) * 28);
      }}
      onPointerLeave={() => { bounds.current = null; pointerX.set(0); pointerY.set(0); }}
    >
    <svg viewBox="0 0 600 600" fill="none" className="h-full w-full text-accent">
      <g stroke="currentColor" strokeWidth="0.8">
        <circle cx="300" cy="300" r="262" strokeDasharray="1 7" opacity="0.65" />
        <circle cx="300" cy="300" r="222" opacity="0.4" className="orbit-ring orbit-ring-outer" />
        <circle cx="300" cy="300" r="194" opacity="0.65" className="orbit-ring orbit-ring-inner" />
        <ellipse cx="300" cy="300" rx="108" ry="194" opacity="0.35" />
        <ellipse cx="300" cy="300" rx="194" ry="65" strokeDasharray="2 5" opacity="0.55" />
        <ellipse cx="300" cy="300" rx="194" ry="139" opacity="0.25" />
        <path d="M300 10v182m0 216v182M10 300h182m216 0h182M78 522l444-444" opacity="0.65" />
        <circle cx="300" cy="300" r="93" className="orbit-core" />
        <path d="M260 265h-12v70h12m80-70h12v70h-12" strokeWidth="1.5" />
        <path d="M186 294v12m-6-6h12m222-6v12m-6-6h12M294 186h12m-6-6v12m-6 222h12m-6-6v12" />
      </g>
      <g fill="currentColor"><rect x="451" y="143" width="8" height="8" /><rect x="140" y="448" width="8" height="8" /><circle cx="300" cy="38" r="3" /><circle cx="78" cy="300" r="3" /></g>
      <text x="300" y="314" fill="currentColor" textAnchor="middle" className="font-mono" fontSize="38" letterSpacing="-2">{initials}</text>
    </svg>
    </motion.div>
  </div>;
}
