"use client";

import { motion } from "framer-motion";
import type { SelectionQuestion } from "./types";

interface Props {
  question: SelectionQuestion;
  selected: string | undefined;
  /** 点击选项后立即触发（外部负责自动跳题） */
  onSelect: (optionId: string) => void;
}

export default function SelectionCard({ question, selected, onSelect }: Props) {
  return (
    <div style={{ padding: "24px 20px 32px" }}>
      <h2
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
      </h2>
      {question.subtitle && (
        <p style={{ fontSize: "17px", fontWeight: 600, color: "#A1887F", margin: "0 0 24px", lineHeight: 1.5 }}>
          {question.subtitle}
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {question.options.map((opt, i) => {
          const isSelected = selected === opt.id;
          return (
            <motion.button
              key={opt.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(opt.id)}
              style={{
                background: isSelected
                  ? "linear-gradient(to right, #ff9a9e, #fad0c4)"
                  : "rgba(255, 255, 255, 0.95)",
                border: "none",
                borderRadius: "20px",
                padding: "16px 18px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                textAlign: "left",
                boxShadow: "0 10px 30px rgba(150, 150, 200, 0.1)",
                transition: "background 0.2s, box-shadow 0.2s",
              }}
            >
              {opt.emoji && (
                <span style={{ fontSize: "24px", lineHeight: 1, flexShrink: 0 }}>
                  {opt.emoji}
                </span>
              )}
              <span
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: isSelected ? "#fff" : "#5D4037",
                  lineHeight: 1.4,
                }}
              >
                {opt.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
