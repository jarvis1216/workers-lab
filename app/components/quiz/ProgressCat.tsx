"use client";

import { motion, AnimatePresence } from "framer-motion";

interface CatStage {
  threshold: number;
  face: string;
  zzz: boolean;
  label: string;
}

const STAGES: CatStage[] = [
  { threshold: 0,  face: "(´-ω-｀)",    zzz: true,  label: "猫猫在睡觉" },
  { threshold: 18, face: "(˘ω˘ ?)",     zzz: false, label: "开始回神..." },
  { threshold: 35, face: "(=^•ω•^=)",   zzz: false, label: "坐起来了！" },
  { threshold: 55, face: "ฅ(^•ω•^ฅ)",  zzz: false, label: "在伸懒腰~" },
  { threshold: 72, face: "ヾ(≧▽≦*)ノ", zzz: false, label: "解压成功！" },
];

interface Props {
  /** 0–100 的进度百分比 */
  progress: number;
}

export default function ProgressCat({ progress }: Props) {
  const stage =
    [...STAGES].reverse().find((s) => progress >= s.threshold) ?? STAGES[0];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        padding: "4px 0 2px",
        userSelect: "none",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={stage.face}
          initial={{ opacity: 0, y: 4, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.85 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          style={{
            fontSize: "14px",
            color: "#8D6E63",
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {stage.face}

          {/* 飘动的 zzz */}
          {stage.zzz && (
            <motion.span
              animate={{ opacity: [0.9, 0.2, 0.9], y: [0, -3, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              style={{ fontSize: "11px", color: "#BCAAA4" }}
            >
              zzz
            </motion.span>
          )}
        </motion.span>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.span
          key={stage.label}
          initial={{ opacity: 0, x: 6 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -6 }}
          transition={{ duration: 0.28, delay: 0.05 }}
          style={{
            fontSize: "11px",
            color: "#BCAAA4",
            fontWeight: 500,
          }}
        >
          {stage.label}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
