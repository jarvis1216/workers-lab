"use client";

import { motion } from "framer-motion";
import type { IndustryQuestion } from "./types";

interface Props {
  question: IndustryQuestion;
  selected: string | undefined;
  onSelect: (optionId: string) => void;
}

export default function IndustryPicker({ question, selected, onSelect }: Props) {
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
        }}
      >
        {question.options.map((opt, i) => (
          <motion.button
            key={opt.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelect(opt.id)}
            style={{
              background:
                selected === opt.id
                  ? "linear-gradient(to right, #ff9a9e, #fad0c4)"
                  : "rgba(255, 255, 255, 0.95)",
              border: "none",
              borderRadius: "20px",
              padding: "16px 12px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 10px 30px rgba(150, 150, 200, 0.1)",
              transition: "background 0.2s, box-shadow 0.2s",
            }}
          >
            <span style={{ fontSize: "28px", lineHeight: 1 }}>{opt.emoji}</span>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: selected === opt.id ? "#fff" : "#5D4037",
                textAlign: "center",
                lineHeight: 1.3,
              }}
            >
              {opt.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
