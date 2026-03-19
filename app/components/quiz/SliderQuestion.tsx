"use client";

import { motion } from "framer-motion";
import type {
  SliderQuestionContinuous,
  SliderQuestionDiscrete,
} from "./types";

interface Props {
  question: SliderQuestionContinuous | SliderQuestionDiscrete;
  value: number | undefined; // continuous: slider value; discrete: index
  onChange: (value: number) => void; // continuous: value; discrete: index
  onNext: () => void;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function formatNumber(n: number) {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

function getQ4WorkHourCopy(hours: number) {
  if (hours <= 4) return "神仙生活，公司是你家";
  if (hours <= 9) return "标准打工人";
  if (hours <= 14) return "透支预警";
  return "这是在修仙还是在拼命？";
}

export default function SliderPanel({ question, value, onChange, onNext }: Props) {
  const isDiscrete = question.type === "slider_discrete";

  const min = isDiscrete ? 0 : question.min;
  const max = isDiscrete ? question.options.length - 1 : question.max;
  const step = isDiscrete ? 1 : (question.step ?? 1);
  const defaultContinuous = isDiscrete ? min : (min + (max - min) * 0.5);
  const current = clamp(value ?? (isDiscrete ? Math.floor((max + min) / 2) : defaultContinuous), min, max);

  const pct = max === min ? 0 : ((current - min) / (max - min)) * 100;
  const discreteLabel = isDiscrete ? question.options[current]?.label : undefined;

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
        {question.text}
      </motion.h2>

      {/* 当前值大图展示 */}
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <motion.div
          key={current}
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          style={{ display: "inline-flex", alignItems: "center", gap: "12px" }}
        >
          <span style={{ fontSize: "40px", lineHeight: 1 }}>{isDiscrete ? "🧾" : "⏳"}</span>
          <span
          style={{
            fontSize: "52px",
            fontWeight: 900,
            color: "#5D4037",
            lineHeight: 1,
          }}
          >
            {isDiscrete ? current + 1 : formatNumber(current)}
          </span>
          <span style={{ fontSize: "20px", color: "#BCAAA4", fontWeight: 600 }}>
            / {isDiscrete ? (max + 1) : question.max}
          </span>
        </motion.div>
        {isDiscrete && discreteLabel && (
          <div style={{ marginTop: "10px", fontSize: "14px", color: "#A1887F", fontWeight: 600, lineHeight: 1.5 }}>
            {discreteLabel}
          </div>
        )}
        {!isDiscrete && question.id === "q4" && (
          <div style={{ marginTop: "10px", fontSize: "14px", color: "#A1887F", fontWeight: 700, lineHeight: 1.5 }}>
            {getQ4WorkHourCopy(current)}
          </div>
        )}
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
          min={min}
          max={max}
          step={step}
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

      {!isDiscrete && (
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
          <span style={{ maxWidth: "42%", textAlign: "left" }}>{formatNumber(min)}h</span>
          <span style={{ maxWidth: "42%", textAlign: "right" }}>{formatNumber(max)}h</span>
        </div>
      )}
      {isDiscrete && <div style={{ height: "12px", marginBottom: "24px" }} />}

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
