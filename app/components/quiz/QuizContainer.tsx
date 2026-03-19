"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import QuizHeader from "./QuizHeader";
import SelectionCardUI from "./SelectionCard";
import SliderPanel from "./SliderQuestion";
import ResultPage from "./ResultPage";
import InterstitialScreen from "./InterstitialScreen";

import { QUIZ_DATA } from "./questions";
import type { Answers, BranchId, Question } from "./types";

type Phase = "quiz" | "result" | "interstitial";
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

function pickBranchIdFromQ1(answers: Answers): BranchId | null {
  const v = answers["q1"];
  if (v === "A") return "big_tech";
  if (v === "B") return "gov_state";
  if (v === "C") return "agency";
  if (v === "D") return "remote";
  return null;
}

function buildFlow(branch: BranchId | null): string[] {
  const base = ["q1", "q2", "q3", "q4", "q5", "q6", "q7"];
  const branchIds =
    branch === "big_tech"
      ? ["q8_big_tech", "q9_big_tech", "q10_big_tech"]
      : branch === "gov_state"
        ? ["q8_gov_state", "q9_gov_state", "q10_gov_state"]
        : branch === "agency"
          ? ["q8_agency", "q9_agency", "q10_agency"]
          : ["q8_remote", "q9_remote", "q10_remote"];
  const tail = ["q11", "q12"];
  return [...base, ...branchIds, ...tail];
}

function getQuestionById(id: string): Question {
  const q = QUIZ_DATA.questions.find((x) => x.id === id);
  if (!q) {
    return {
      id,
      module: "missing",
      text: "题目缺失（请联系实验室）",
      type: "select",
      options: [{ label: "我知道了", value: "OK" }],
    };
  }
  return q;
}

export default function QuizContainer({ onExit }: QuizContainerProps) {
  const [phase, setPhase] = useState<Phase>("quiz");
  const [interstitialText, setInterstitialText] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<Direction>(1);
  const [answers, setAnswers] = useState<Answers>({});

  const branch = useMemo(() => pickBranchIdFromQ1(answers), [answers]);
  const flow = useMemo(() => buildFlow(branch), [branch]);
  const total = flow.length;
  const questionId = flow[currentIndex];
  const question = useMemo(() => getQuestionById(questionId), [questionId]);

  // ── 仪式感 Loading：Q1-Q3 完成后、进入 Q8 前 ─────────────────────────────
  useEffect(() => {
    if (phase !== "interstitial") return;
    const t = setTimeout(() => {
      setPhase("quiz");
    }, 1600);
    return () => clearTimeout(t);
  }, [phase]);

  // ── 前进 ─────────────────────────────────────────────────────────────────
  const goNext = useCallback(() => {
    if (currentIndex < total - 1) {
      const nextIndex = currentIndex + 1;
      // Q1-Q3 完成后插入一次清算 Loading（从第 3 题跳到第 4 题时）
      if (currentIndex === 2) {
        setInterstitialText("正在进行职场资产清算...");
        setPhase("interstitial");
      }
      // 进入 Q8（从第 7 题到第 8 题）前插入一次分支审计 Loading
      if (currentIndex === 6) {
        const role =
          branch === "big_tech"
            ? "互联网/大厂"
            : branch === "gov_state"
              ? "体制内"
              : branch === "agency"
                ? "乙方"
                : "自由/远程";
        setInterstitialText(`正在加载「${role}」专项审计模块...`);
        setPhase("interstitial");
      }
      setDirection(1);
      setCurrentIndex(nextIndex);
    } else {
      setPhase("result");
    }
  }, [currentIndex, total, branch]);

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

  // ── 全屏 interstitial ────────────────────────────────────────────────────
  if (phase === "interstitial") {
    return (
      <AnimatePresence mode="wait">
        <InterstitialScreen key={interstitialText} title={interstitialText} />
      </AnimatePresence>
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
              // 给首屏题目留出与第二层悬浮栏的视觉间距，避免贴脸重叠
              paddingTop: "10px",
            }}
          >
            {(question.type === "select" || question.type === "branch_selector") && (
              <SelectionCardUI
                question={question}
                selected={answers[question.id] as string | undefined}
                onSelect={(optId) => handleSelect(question.id, optId)}
              />
            )}

            {(question.type === "slider" || question.type === "slider_discrete") && (
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
