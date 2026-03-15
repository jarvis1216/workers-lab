"use client";

import { motion } from "framer-motion";

/* 马卡龙色系：浅粉 #FFDEE9 → 浅蓝 #B5FFFC，透明度 0.3，若隐若现的云团感 */
const BUBBLES = [
  {
    size: 120,
    gradient: "linear-gradient(135deg, rgba(255, 222, 233, 0.3), rgba(181, 255, 252, 0.3))",
    initialX: "10%",
    initialY: "15%",
    duration: 18,
    xRange: [0, 30, -20, 10],
    yRange: [0, -40, 20, -10],
    borderRadius: "63% 37% 54% 46% / 55% 48% 52% 45%",
  },
  {
    size: 90,
    gradient: "linear-gradient(135deg, rgba(181, 255, 252, 0.3), rgba(255, 222, 233, 0.3))",
    initialX: "75%",
    initialY: "10%",
    duration: 22,
    xRange: [0, -25, 15, -5],
    yRange: [0, 35, -15, 25],
    borderRadius: "40% 60% 45% 55% / 58% 42% 60% 40%",
  },
  {
    size: 150,
    gradient: "linear-gradient(135deg, rgba(255, 222, 233, 0.3), rgba(200, 230, 255, 0.3))",
    initialX: "55%",
    initialY: "60%",
    duration: 25,
    xRange: [0, 20, -30, 5],
    yRange: [0, -25, 40, -15],
    borderRadius: "55% 45% 38% 62% / 46% 54% 44% 56%",
  },
  {
    size: 80,
    gradient: "linear-gradient(135deg, rgba(200, 230, 255, 0.3), rgba(181, 255, 252, 0.3))",
    initialX: "20%",
    initialY: "70%",
    duration: 20,
    xRange: [0, -15, 25, -10],
    yRange: [0, 30, -20, 10],
    borderRadius: "48% 52% 60% 40% / 52% 44% 56% 48%",
  },
  {
    size: 110,
    gradient: "linear-gradient(135deg, rgba(255, 222, 233, 0.3), rgba(181, 255, 252, 0.3))",
    initialX: "85%",
    initialY: "55%",
    duration: 28,
    xRange: [0, 25, -10, 20],
    yRange: [0, -30, 15, -25],
    borderRadius: "60% 40% 50% 50% / 40% 60% 42% 58%",
  },
];

export default function FloatingBubbles() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {BUBBLES.map((bubble, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            left: bubble.initialX,
            top: bubble.initialY,
            width: bubble.size,
            height: bubble.size,
            background: bubble.gradient,
            borderRadius: bubble.borderRadius,
            filter: "blur(2px)",
            backdropFilter: "blur(1px)",
          }}
          animate={{
            x: bubble.xRange,
            y: bubble.yRange,
            borderRadius: [
              bubble.borderRadius,
              "50% 50% 40% 60% / 45% 55% 45% 55%",
              "38% 62% 55% 45% / 58% 42% 52% 48%",
              bubble.borderRadius,
            ],
            scale: [1, 1.05, 0.97, 1.02, 1],
          }}
          transition={{
            duration: bubble.duration,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.33, 0.66, 1],
          }}
        />
      ))}
    </div>
  );
}
