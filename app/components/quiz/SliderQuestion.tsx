"use client";

import { motion } from "framer-motion";
import type { SliderQuestion as SliderQuestionType } from "./types";

interface Props {
  question: SliderQuestionType;
  value: number | undefined;
  onChange: (value: number) => void;
  onNext: () => void;
}

// 根据 1-10 数值返回对应的 emoji 表情
function getValueEmoji(value: number): string {
  if (value <= 2) return "😭";
  if (value <= 4) return "😰";
  if (value <= 6) return "😐";
  if (value <= 8) return "🙂";
  return "😄";
}

export default function SliderPanel({ question, value, onChange, onNext }: Props) {
  const current = value ?? question.defaultValue;
  const pct = ((current - question.min) / (question.max - question.min)) * 100;

  return (
    <div style={{ padding: "24px 20px 40px" }}>
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{
          fontSize: "28px",
          fontWeight: 900,
          color: "#5D4037",
          margin: "0 0 8px",
          lineHeight: 1.35,
          letterSpacing: "-0.01em",
        }}
      >
        {question.title}
      </motion.h2>

      {question.subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{ fontSize: "17px", fontWeight: 600, color: "#A1887F", margin: "0 0 32px", lineHeight: 1.5 }}
        >
          {question.subtitle}
        </motion.p>
      )}

      {/* 当前值大图展示 */}
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <motion.div
          key={current}
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          style={{ display: "inline-flex", alignItems: "center", gap: "12px" }}
        >
          <span style={{ fontSize: "44px", lineHeight: 1 }}>
            {getValueEmoji(current)}
          </span>
          <span
          style={{
            fontSize: "52px",
            fontWeight: 900,
            color: "#5D4037",
            lineHeight: 1,
          }}
          >
            {current}
          </span>
          <span style={{ fontSize: "20px", color: "#BCAAA4", fontWeight: 600 }}>
            / {question.max}
          </span>
        </motion.div>
      </div>

      {/* 滑动条容器 */}
      <div style={{ position: "relative", padding: "10px 0", marginBottom: "8px" }}>
        {/* 轨道背景：浅灰色 */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            height: "6px",
            background: "#E8E8E8",
            borderRadius: "99px",
            transform: "translateY(-50%)",
            pointerEvents: "none",
          }}
        />
        {/* 已选填充：薄荷绿 */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            width: `${pct}%`,
            height: "6px",
            background: "#A8E6CF",
            borderRadius: "99px",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            transition: "width 0.08s ease",
          }}
        />
        {/* 原生 input range，transparent 覆盖 */}
        <input
          type="range"
          min={question.min}
          max={question.max}
          step={question.step}
          value={current}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            position: "relative",
            width: "100%",
            height: "36px",
            background: "transparent",
            zIndex: 1,
          }}
        />
      </div>

      {/* 端点标签 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "12px",
          color: "#A1887F",
          marginBottom: "36px",
          fontWeight: 600,
          lineHeight: 1.4,
        }}
      >
        <span style={{ maxWidth: "42%", textAlign: "left" }}>{question.minLabel}</span>
        <span style={{ maxWidth: "42%", textAlign: "right" }}>{question.maxLabel}</span>
      </div>

      {/* 下一题按钮：蜜桃粉渐变 */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onNext}
        style={{
          width: "100%",
          background: "linear-gradient(to right, #ff9a9e, #fad0c4)",
          color: "#fff",
          border: "none",
          borderRadius: "50px",
          padding: "15px 0",
          fontSize: "16px",
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: "0 10px 30px rgba(150, 150, 200, 0.1)",
          letterSpacing: "0.04em",
        }}
      >
        下一题 →
      </motion.button>
    </div>
  );
}
