"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

import QuizHeader from "./QuizHeader";
import IndustryPicker from "./IndustryPicker";
import SelectionCardUI from "./SelectionCard";
import SliderPanel from "./SliderQuestion";
import ResultPage from "./ResultPage";

import { QUIZ_QUESTIONS } from "./questions";
import type { Answers } from "./types";

type Phase = "quiz" | "result";
type Direction = 1 | -1;

const SLIDE_VARIANTS = {
  enter: (dir: Direction) => ({
    x: dir > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (dir: Direction) => ({
    x: dir > 0 ? "-100%" : "100%",
    opacity: 0,
  }),
};

const SLIDE_TRANSITION = {
  duration: 0.35,
  ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
};

interface QuizContainerProps {
  onExit: () => void;
}

export default function QuizContainer({ onExit }: QuizContainerProps) {
  const [phase, setPhase] = useState<Phase>("quiz");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<Direction>(1);
  const [answers, setAnswers] = useState<Answers>({});

  const total = QUIZ_QUESTIONS.length;
  const question = QUIZ_QUESTIONS[currentIndex];

  // ── 前进 ─────────────────────────────────────────────────────────────────
  const goNext = useCallback(() => {
    if (currentIndex < total - 1) {
      setDirection(1);
      setCurrentIndex((i) => i + 1);
    } else {
      setPhase("result");
    }
  }, [currentIndex, total]);

  // ── 后退 ─────────────────────────────────────────────────────────────────
  const goBack = useCallback(() => {
    if (currentIndex === 0) {
      onExit();
    } else {
      setDirection(-1);
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex, onExit]);

  // ── 选项卡 / 行业选择：记录答案后自动跳题 ──────────────────────────────
  const handleSelect = useCallback(
    (questionId: string, optionId: string) => {
      setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
      setTimeout(() => goNext(), 180);
    },
    [goNext]
  );

  // ── 滑动条：仅记录，不跳题 ──────────────────────────────────────────────
  const handleSliderChange = useCallback((questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  // ── 重新测试 ─────────────────────────────────────────────────────────────
  const handleRetry = useCallback(() => {
    setAnswers({});
    setCurrentIndex(0);
    setDirection(1);
    setPhase("quiz");
  }, []);

  // ── 结果页 ───────────────────────────────────────────────────────────────
  if (phase === "result") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{ minHeight: "calc(100vh - 56px)", overflowY: "auto" }}
      >
        <ResultPage answers={answers} onRetry={handleRetry} onExit={onExit} />
      </motion.div>
    );
  }

  // ── 答题阶段 ─────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "calc(100vh - 56px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <QuizHeader current={currentIndex} total={total} onBack={goBack} />

      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
            key={question.id}
            custom={direction}
            variants={SLIDE_VARIANTS}
            initial="enter"
            animate="center"
            exit="exit"
            transition={SLIDE_TRANSITION}
            style={{
              position: "absolute",
              inset: 0,
              overflowY: "auto",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {question.type === "industry" && (
              <IndustryPicker
                question={question}
                selected={answers[question.id] as string | undefined}
                onSelect={(optId) => handleSelect(question.id, optId)}
              />
            )}

            {question.type === "selection" && (
              <SelectionCardUI
                question={question}
                selected={answers[question.id] as string | undefined}
                onSelect={(optId) => handleSelect(question.id, optId)}
              />
            )}

            {question.type === "slider" && (
              <SliderPanel
                question={question}
                value={answers[question.id] as number | undefined}
                onChange={(val) => handleSliderChange(question.id, val)}
                onNext={goNext}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
