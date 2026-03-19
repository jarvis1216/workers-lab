// ── 题目类型 ──────────────────────────────────────────────────────────────────

export type BranchId = "big_tech" | "gov_state" | "agency" | "remote";
export type BaselineTrackValue = "A" | "B" | "C" | "D";

export type WeightMap = Record<string, number>;

export interface QuizOption {
  label: string;
  value: string;
  branch?: BranchId;
  weight?: WeightMap;
}

export interface BaseQuestion {
  id: string;
  module?: string;
  branch?: BranchId;
  text: string;
}

export interface BranchSelectorQuestion extends BaseQuestion {
  type: "branch_selector";
  options: QuizOption[];
}

export interface SelectQuestion extends BaseQuestion {
  type: "select";
  options: QuizOption[];
}

/**
 * 连续滑动条（例如 Q4 工时 8-16）
 * weightLogic: linear_loss 表示将 slider 值映射成某个 loss 维度权重
 */
export interface SliderQuestionContinuous extends BaseQuestion {
  type: "slider";
  min: number;
  max: number;
  step?: number;
  weight_logic: "linear_loss";
}

/**
 * 离散滑动条（例如 Q11：4 档，带数值反馈）
 * 用 slider 交互，但分值来自 options 的 weight。
 */
export interface SliderQuestionDiscrete extends BaseQuestion {
  type: "slider_discrete";
  options: QuizOption[];
}

export type Question =
  | BranchSelectorQuestion
  | SelectQuestion
  | SliderQuestionContinuous
  | SliderQuestionDiscrete;

// ── 用户答案存储 ───────────────────────────────────────────────────────────────

export type Answers = Record<string, string | number>;

export interface QuizConfig {
  version: string;
  scoring_logic: {
    gain_dimensions: string[];
    loss_dimensions: string[];
  };
  questions: Question[];
}
