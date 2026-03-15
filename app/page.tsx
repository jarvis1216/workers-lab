"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import QuizContainer from "./components/quiz/QuizContainer";

// ── 主页卡片 ─────────────────────────────────────────────────────────────────

function ActiveCard({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{
        background: "rgba(255, 255, 255, 0.95)",
        border: "none",
        borderRadius: "24px",
        padding: "28px 24px",
        boxShadow: "0 10px 30px rgba(150, 150, 200, 0.1)",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          background: "#4CAF50",
          color: "#fff",
          fontSize: "11px",
          fontWeight: 700,
          borderRadius: "20px",
          padding: "3px 10px",
          letterSpacing: "0.05em",
        }}
      >
        Active
      </span>

      <div style={{ fontSize: "40px", lineHeight: 1 }}>🚪</div>

      <div>
        <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#5D4037", margin: 0, lineHeight: 1.3 }}>
          离职决策器
        </h2>
        <p style={{ fontSize: "13px", color: "#A1887F", margin: "6px 0 0" }}>
          1.2w 人已确诊
        </p>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={(e) => {
          e.stopPropagation();
          onStart();
        }}
        style={{
          marginTop: "8px",
          background: "linear-gradient(to right, #ff9a9e, #fad0c4)",
          color: "#fff",
          border: "none",
          borderRadius: "50px",
          padding: "12px 0",
          fontSize: "15px",
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: "0 10px 30px rgba(150, 150, 200, 0.1)",
          width: "100%",
          letterSpacing: "0.05em",
        }}
      >
        开始测试 →
      </motion.button>
    </motion.div>
  );
}

function DisabledCard() {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{
        background: "rgba(255, 255, 255, 0.7)",
        border: "none",
        borderRadius: "24px",
        padding: "28px 24px",
        boxShadow: "0 10px 30px rgba(150, 150, 200, 0.1)",
        cursor: "not-allowed",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        position: "relative",
        overflow: "hidden",
        opacity: 0.65,
        filter: "saturate(0.4)",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          background: "rgba(93, 64, 55, 0.15)",
          color: "#8D6E63",
          fontSize: "11px",
          fontWeight: 700,
          borderRadius: "20px",
          padding: "3px 10px",
          letterSpacing: "0.04em",
        }}
      >
        研发中
      </span>

      <div style={{ fontSize: "40px", lineHeight: 1 }}>🧃</div>

      <div>
        <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#8D6E63", margin: 0, lineHeight: 1.3 }}>
          职场黑话脱水机
        </h2>
        <p style={{ fontSize: "13px", color: "#BCAAA4", margin: "6px 0 0" }}>
          实验室研发中...
        </p>
      </div>

      <div
        style={{
          marginTop: "8px",
          background: "rgba(93, 64, 55, 0.08)",
          color: "#BCAAA4",
          border: "none",
          borderRadius: "50px",
          padding: "12px 0",
          fontSize: "15px",
          fontWeight: 700,
          textAlign: "center",
          letterSpacing: "0.05em",
        }}
      >
        即将上线
      </div>
    </motion.div>
  );
}

function ComingSoonCard() {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={() => console.log("[自救实验室] 点击了留言入口")}
      style={{
        background: "rgba(255, 255, 255, 0.8)",
        border: "2px dashed rgba(150, 150, 200, 0.25)",
        borderRadius: "24px",
        padding: "28px 24px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "14px",
        minHeight: "200px",
        textAlign: "center",
        boxShadow: "0 10px 30px rgba(150, 150, 200, 0.1)",
      }}
    >
      <div style={{ fontSize: "36px", lineHeight: 1 }}>💌</div>
      <div>
        <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#A1887F", margin: 0, lineHeight: 1.3 }}>
          敬请期待
        </h2>
        <p style={{ fontSize: "13px", color: "#BCAAA4", margin: "8px 0 0", lineHeight: 1.6 }}>
          点击留言你想做的工具
        </p>
      </div>
    </motion.div>
  );
}

// ── 主页 ──────────────────────────────────────────────────────────────────────

type View = "home" | "quiz";

export default function Home() {
  const [view, setView] = useState<View>("home");

  return (
    <AnimatePresence mode="wait">
      {view === "home" ? (
        <motion.div
          key="home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.25 }}
          style={{
            minHeight: "calc(100vh - 56px)",
            padding: "32px 20px 48px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* 页面标题区 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ textAlign: "center", marginBottom: "36px" }}
          >
            <h1
              style={{
                fontSize: "26px",
                fontWeight: 900,
                color: "#5D4037",
                margin: 0,
                lineHeight: 1.4,
                letterSpacing: "0.02em",
              }}
            >
              选一个今天用得上的工具
            </h1>
            <p style={{ fontSize: "14px", color: "#A1887F", marginTop: "8px" }}>
              打工人专属 · 科学自救
            </p>
          </motion.div>

          {/* 卡片网格 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
              width: "100%",
              maxWidth: "960px",
            }}
          >
            <ActiveCard onStart={() => setView("quiz")} />
            <DisabledCard />
            <ComingSoonCard />
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          key="quiz"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
        >
          <QuizContainer onExit={() => setView("home")} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
