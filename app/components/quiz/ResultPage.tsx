"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { calculateScore, getResultLevel } from "./scoreCalculator";
import type { Answers } from "./types";

// 生成诊断编号
function genDiagnosisId(): string {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `WL-${date}-${rand}`;
}

// 格式化今天日期
function formatDate(): string {
  const now = new Date();
  return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
}

interface Props {
  answers: Answers;
  onRetry: () => void;
  onExit: () => void;
}

export default function ResultPage({ answers, onRetry, onExit }: Props) {
  const score = calculateScore(answers);
  const level = getResultLevel(score);
  const [displayScore, setDisplayScore] = useState(0);
  const [saved, setSaved] = useState(false);
  const diagnosisId = useRef(genDiagnosisId());
  const diagnosisDate = useRef(formatDate());

  // 分数滚动动画
  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const duration = 1200;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * score));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  // 分享报告：复制链接到剪贴板并 toast 提示
  const shareUrl = "www.saveniuma.org";
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      // clipboard error
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      style={{ padding: "24px 20px 60px", maxWidth: "520px", margin: "0 auto" }}
    >
      {/* ── 病历单标题 ── */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "24px",
          paddingBottom: "16px",
          borderBottom: "1.5px dashed rgba(93, 64, 55, 0.2)",
        }}
      >
        <div style={{ fontSize: "28px", marginBottom: "6px" }}>🏥</div>
        <h1
          style={{
            fontSize: "18px",
            fontWeight: 900,
            color: "#5D4037",
            margin: 0,
            letterSpacing: "0.08em",
          }}
        >
          打工人健康诊断报告
        </h1>
        <p style={{ fontSize: "12px", color: "#BCAAA4", margin: "4px 0 0", letterSpacing: "0.06em" }}>
          Workers Lab · 自救实验室
        </p>
      </div>

      {/* ── 病历信息栏 ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px",
          marginBottom: "20px",
          fontSize: "12px",
          color: "#A1887F",
        }}
      >
        <div>
          <span style={{ color: "#BCAAA4" }}>诊断编号：</span>
          <span style={{ fontWeight: 700, color: "#8D6E63" }}>{diagnosisId.current}</span>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ color: "#BCAAA4" }}>确诊日期：</span>
          <span style={{ fontWeight: 700, color: "#8D6E63" }}>{diagnosisDate.current}</span>
        </div>
      </div>

      {/* ── 分数区 ── */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        style={{
          background: level.bgColor,
          border: "none",
          borderRadius: "20px",
          padding: "24px 20px",
          textAlign: "center",
          marginBottom: "20px",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(150, 150, 200, 0.1)",
        }}
      >
        {/* 装饰水印 */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "120px",
            opacity: 0.04,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {level.emoji}
        </div>

        <p style={{ fontSize: "13px", color: "#A1887F", margin: "0 0 8px", fontWeight: 600 }}>
          离职紧迫度评分
        </p>

        <div
          style={{
            display: "inline-flex",
            alignItems: "baseline",
            gap: "4px",
            marginBottom: "10px",
          }}
        >
          <span
            style={{
              fontSize: "72px",
              fontWeight: 900,
              color: level.stampColor,
              lineHeight: 1,
            }}
          >
            {displayScore}
          </span>
          <span style={{ fontSize: "22px", color: level.stampColor, fontWeight: 700 }}>
            / 100
          </span>
        </div>

        {/* 确诊等级印章 */}
        <motion.div
          initial={{ rotate: -8, scale: 0.7, opacity: 0 }}
          animate={{ rotate: -6, scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
          style={{
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "center",
            border: `2.5px solid ${level.stampColor}`,
            borderRadius: "12px",
            padding: "8px 20px",
            marginTop: "4px",
          }}
        >
          <span style={{ fontSize: "20px", marginBottom: "2px" }}>{level.emoji}</span>
          <span
            style={{
              fontSize: "16px",
              fontWeight: 900,
              color: level.stampColor,
              letterSpacing: "0.06em",
            }}
          >
            {level.title}
          </span>
          <span style={{ fontSize: "11px", color: level.stampColor, opacity: 0.75, marginTop: "2px" }}>
            {level.subtitle}
          </span>
        </motion.div>
      </motion.div>

      {/* ── 主治医生评语 ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        style={{
          background: "rgba(255, 255, 255, 0.9)",
          border: "none",
          borderRadius: "16px",
          padding: "18px 18px",
          marginBottom: "20px",
          boxShadow: "0 10px 30px rgba(150, 150, 200, 0.1)",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            color: "#BCAAA4",
            margin: "0 0 10px",
            fontWeight: 700,
            letterSpacing: "0.08em",
          }}
        >
          【主治医生评语】
        </p>
        {level.commentary.split("\n\n").map((para, i) => (
          <p
            key={i}
            style={{
              fontSize: "14px",
              color: "#5D4037",
              margin: i === 0 ? 0 : "10px 0 0",
              lineHeight: 1.75,
            }}
          >
            {para}
          </p>
        ))}
      </motion.div>

      {/* ── 治疗建议 ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.4 }}
        style={{
          background: "rgba(255, 255, 255, 0.85)",
          border: "none",
          borderRadius: "14px",
          padding: "14px 18px",
          marginBottom: "28px",
          display: "flex",
          alignItems: "flex-start",
          gap: "10px",
          boxShadow: "0 10px 30px rgba(150, 150, 200, 0.1)",
        }}
      >
        <span style={{ fontSize: "18px", flexShrink: 0, marginTop: "1px" }}>💊</span>
        <div>
          <p style={{ fontSize: "12px", color: "#BCAAA4", margin: "0 0 4px", fontWeight: 700, letterSpacing: "0.06em" }}>
            治疗建议
          </p>
          <p style={{ fontSize: "14px", color: "#8D6E63", margin: 0, lineHeight: 1.6, fontWeight: 600 }}>
            {level.suggestion}
          </p>
        </div>
      </motion.div>

      {/* ── 操作按钮 ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.35 }}
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
      >
        {/* 分享报告：复制链接到剪贴板 */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleShare}
          style={{
            width: "100%",
            background: saved
              ? "linear-gradient(to right, #66BB6A, #81C784)"
              : "linear-gradient(to right, #ff9a9e, #fad0c4)",
            color: "#fff",
            border: "none",
            borderRadius: "50px",
            padding: "15px 0",
            fontSize: "16px",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 10px 30px rgba(150, 150, 200, 0.1)",
            letterSpacing: "0.04em",
            transition: "background 0.3s",
          }}
        >
          {saved ? "✅ 链接已复制到剪切板，赶紧去分享吧" : "📤 分享我的确诊报告"}
        </motion.button>

        {/* 再测一次 */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onRetry}
          style={{
            width: "100%",
            background: "rgba(255, 255, 255, 0.9)",
            border: "none",
            borderRadius: "50px",
            padding: "13px 0",
            fontSize: "15px",
            fontWeight: 600,
            color: "#5D4037",
            cursor: "pointer",
            letterSpacing: "0.04em",
            boxShadow: "0 10px 30px rgba(150, 150, 200, 0.1)",
          }}
        >
          🔄 重新测一次
        </motion.button>

        {/* 回主页 */}
        <button
          onClick={onExit}
          style={{
            background: "none",
            border: "none",
            color: "#BCAAA4",
            fontSize: "13px",
            cursor: "pointer",
            padding: "6px 0",
            textAlign: "center",
            textDecoration: "underline",
            textDecorationColor: "rgba(188, 170, 164, 0.4)",
          }}
        >
          回到主页
        </button>
      </motion.div>
    </motion.div>
  );
}
