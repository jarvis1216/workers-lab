"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

const DEFAULT_HINTS = [
  "正在清算沉没成本...",
  "正在评估身心健康...",
  "正在扫描职业天花板...",
  "正在核对通勤损耗...",
  "正在计算市场溢价...",
  "正在压缩情绪波动...",
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function InterstitialScreen({
  title,
  durationMs = 1600,
}: {
  title: string;
  durationMs?: number;
}) {
  const hints = useMemo(() => DEFAULT_HINTS, []);
  const [fullHint, setFullHint] = useState(() => pickRandom(hints));
  const [typedHint, setTypedHint] = useState("");

  useEffect(() => {
    let charIndex = 0;
    let timeout: number;

    const typeNext = () => {
      const next = fullHint.slice(0, charIndex + 1);
      setTypedHint(next);
      charIndex += 1;

      if (charIndex < fullHint.length) {
        timeout = window.setTimeout(typeNext, 50);
      } else {
        // 打完一行后稍作停顿，再换下一句
        timeout = window.setTimeout(() => {
          const nextHint = pickRandom(hints);
          setFullHint(nextHint);
        }, 500);
      }
    };

    setTypedHint("");
    charIndex = 0;
    timeout = window.setTimeout(typeNext, 80);

    return () => window.clearTimeout(timeout);
  }, [fullHint, hints]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      style={{
        minHeight: "calc(100vh - 56px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 背景扫描光带 */}
      <motion.div
        aria-hidden
        animate={{ y: ["-30%", "130%"] }}
        transition={{ duration: 1.6, ease: "linear", repeat: Infinity }}
        style={{
          position: "absolute",
          left: "-20%",
          right: "-20%",
          height: "80px",
          background:
            "linear-gradient(90deg, rgba(255,222,233,0) 0%, rgba(255,222,233,0.22) 45%, rgba(181,255,252,0.22) 55%, rgba(181,255,252,0) 100%)",
          filter: "blur(10px)",
          transform: "skewY(-8deg)",
          opacity: 0.7,
        }}
      />

      <div style={{ position: "relative", width: "100%", maxWidth: "420px" }}>
        {/* 实验室感 SVG 雷达扫描 */}
        <motion.svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          style={{ margin: "0 auto 14px", display: "block" }}
        >
          <defs>
            <radialGradient id="radar-bg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(181,255,252,0.25)" />
              <stop offset="100%" stopColor="rgba(255,222,233,0.08)" />
            </radialGradient>
          </defs>
          <circle cx="60" cy="60" r="52" fill="url(#radar-bg)" stroke="rgba(150,150,200,0.28)" strokeWidth="1.5" />
          <circle cx="60" cy="60" r="36" fill="none" stroke="rgba(150,150,200,0.21)" strokeWidth="1" />
          <circle cx="60" cy="60" r="20" fill="none" stroke="rgba(150,150,200,0.16)" strokeWidth="1" />
          <line x1="60" y1="8" x2="60" y2="112" stroke="rgba(150,150,200,0.2)" strokeWidth="1" />
          <line x1="8" y1="60" x2="112" y2="60" stroke="rgba(150,150,200,0.2)" strokeWidth="1" />
          <motion.line
            x1="60"
            y1="60"
            x2="110"
            y2="60"
            stroke="rgba(255,154,158,0.9)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ rotate: 0, originX: 60, originY: 60 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
          />
          <motion.circle
            cx="60"
            cy="60"
            r="4"
            fill="#ff9a9e"
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.svg>

        <div style={{ fontSize: "15px", color: "#5D4037", fontWeight: 800, marginBottom: "10px" }}>
          {title}
        </div>

        {/* 打字机效果文案 */}
        <div
          style={{
            fontSize: "13px",
            color: "#A1887F",
            fontWeight: 600,
            minHeight: "18px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}
        >
          <span>{typedHint}</span>
          <motion.span
            aria-hidden
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            style={{ width: 10, height: 14, background: "rgba(150,150,200,0.6)", borderRadius: 999 }}
          />
        </div>

        {/* 分析中进度条（无限循环） */}
        <div
          style={{
            marginTop: "18px",
            height: "8px",
            background: "rgba(150,150,200,0.14)",
            borderRadius: "999px",
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(150,150,200,0.08)",
          }}
        >
          <motion.div
            animate={{ x: ["-30%", "100%"] }}
            transition={{ duration: durationMs / 1000, ease: "easeInOut", repeat: Infinity }}
            style={{
              height: "100%",
              width: "45%",
              background: "linear-gradient(to right, #ff9a9e, #fad0c4)",
              borderRadius: "999px",
              opacity: 0.85,
            }}
          />
        </div>

        <div style={{ marginTop: "10px", fontSize: "11px", color: "#BCAAA4", fontWeight: 600 }}>
          分析中 · 请稍候
        </div>
      </div>
    </motion.div>
  );
}

