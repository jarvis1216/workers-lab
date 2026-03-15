// ── 题目类型 ──────────────────────────────────────────────────────────────────

/** 行业岗位选择（第 0 题专用） */
export interface IndustryQuestion {
  type: "industry";
  id: string;
  title: string;
  subtitle?: string;
  options: Array<{
    id: string;
    label: string;
    emoji: string;
  }>;
}

/** 选项卡题（点击后自动跳转） */
export interface SelectionQuestion {
  type: "selection";
  id: string;
  title: string;
  subtitle?: string;
  options: Array<{
    id: string;
    label: string;
    emoji?: string;
    /** 该选项对应的分数权重，后续填入 */
    score: number;
  }>;
}

/** 滑动条题（需点击"下一题"跳转） */
export interface SliderQuestion {
  type: "slider";
  id: string;
  title: string;
  subtitle?: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  minLabel: string;
  maxLabel: string;
  /** 将滑动值转为分数的函数，后续填入 */
  scoreMapper: (value: number) => number;
}

export type Question = IndustryQuestion | SelectionQuestion | SliderQuestion;

// ── 用户答案存储 ───────────────────────────────────────────────────────────────

export type Answers = Record<string, string | number>;
