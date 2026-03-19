"use client";

import { motion } from "framer-motion";
import ProgressCat from "./ProgressCat";

interface QuizHeaderProps {
  current: number;   // 当前题目索引（0-based）
  total: number;     // 总题数
  onBack: () => void;
}

export default function QuizHeader({ current, total, onBack }: QuizHeaderProps) {
  const progress = total > 0 ? (current / total) * 100 : 0;

  return (
    <div
      style={{
        position: "sticky",
        top: "56px",
        zIndex: 40,
        // 给第二层悬浮栏一个半透明底，避免题目内容视觉穿透造成“重合”
        background: "rgba(255, 255, 255, 0.92)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        padding: "10px 20px 8px",
        borderBottom: "1px solid rgba(150, 150, 200, 0.08)",
        boxShadow: "0 6px 18px rgba(150, 150, 200, 0.08)",
      }}
    >
      {/* 返回按钮 + 题目计数 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "6px",
        }}
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          style={{
            background: "none",
            border: "1px solid rgba(150, 150, 200, 0.15)",
            borderRadius: "50px",
            padding: "5px 14px",
            fontSize: "13px",
            color: "#8D6E63",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontWeight: 600,
          }}
        >
          ← 返回
        </motion.button>

        {/* 解压进度猫 */}
        <ProgressCat progress={progress} />

        <span
          style={{
            fontSize: "13px",
            color: "#A1887F",
            fontWeight: 600,
            minWidth: "40px",
            textAlign: "right",
          }}
        >
          {current + 1} / {total}
        </span>
      </div>

      {/* 进度条 */}
      <div
        style={{
          height: "5px",
          background: "rgba(150, 150, 200, 0.12)",
          borderRadius: "99px",
          overflow: "hidden",
        }}
      >
        <motion.div
          animate={{ width: `${progress}%` }}
          initial={{ width: "0%" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{
            height: "100%",
            background: "linear-gradient(to right, #ff9a9e, #fad0c4)",
            borderRadius: "99px",
          }}
        />
      </div>
    </div>
  );
}
