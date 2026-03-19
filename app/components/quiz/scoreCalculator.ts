import type { Answers, WeightMap } from "./types";
import { QUIZ_DATA } from "./questions";

export interface AuditTotals {
  gain: Record<string, number>;
  loss: Record<string, number>;
  gainSum: number;
  lossSum: number;
  roi: number;
}

export interface QuestionContribution {
  questionId: string;
  questionText: string;
  answerValue?: string | number;
  answerLabel?: string;
  gain: Record<string, number>;
  loss: Record<string, number>;
  extraLoss: number;
}

function getSelectedOptionWeight(questionId: string, answers: Answers): WeightMap | undefined {
  const q = QUIZ_DATA.questions.find((x) => x.id === questionId);
  if (!q) return undefined;

  if (q.type === "select" || q.type === "branch_selector") {
    const selected = answers[questionId] as string | undefined;
    if (!selected) return undefined;
    return q.options.find((o) => o.value === selected)?.weight;
  }

  if (q.type === "slider_discrete") {
    const idx = (answers[questionId] as number | undefined) ?? 1;
    const option = q.options[Math.max(0, Math.min(q.options.length - 1, idx))];
    return option?.weight;
  }

  return undefined;
}

function mapLinearLossForQ4(answers: Answers): WeightMap {
  // q4: 0-24, linear_loss -> time loss 0..10
  const raw = (answers["q4"] as number | undefined) ?? 9;
  const t = Math.max(0, Math.min(24, raw));
  const normalized = t / 24; // 0..1
  return { time: Math.round(normalized * 10) };
}

/**
 * 2.0 审计版：按题目 weight 拆成 Gain/Loss，并计算 ROI。
 * ROI = (sumGain / sumLoss) * 100
 *
 * 说明：
 * - gain/loss 维度由 QUIZ_DATA.scoring_logic 提供
 * - JSON 中出现但不在 gain/loss 维度里的 key（例如 risk/pressure/commute_loss/health_loss/culture_loss）
 *   会被映射到相近的 loss 维度（commute_loss->commute, health_loss->health, culture_loss->culture），
 *   risk/pressure 会进入 lossSum 作为额外现实压力项（不进入雷达图）。
 */
export function calculateAuditTotals(answers: Answers): AuditTotals {
  const r = calculateResult(answers);
  return r.totals;
}

export interface ResultModel {
  totals: AuditTotals;
  contributions: QuestionContribution[];
  risk: number;
  pressure: number;
  roiGrade: { grade: "S" | "A" | "B" | "C"; label: string };
  finalAdvice: { title: string; detail: string };
}

function getRoiGrade(roi: number) {
  if (roi >= 180) return { grade: "S" as const, label: "S级-神仙下凡" };
  if (roi >= 130) return { grade: "A" as const, label: "A级-互不相欠" };
  if (roi >= 90) return { grade: "B" as const, label: "B级-带薪坐牢" };
  return { grade: "C" as const, label: "C级-慢性自杀" };
}

function getFinalAdvice(roi: number, risk: number, pressure: number) {
  // risk 越高越不建议立刻走；pressure 高也倾向“骑驴找马”
  const financialTight = risk >= 5;
  if (roi < 80) {
    if (financialTight) {
      return {
        title: "结论：骑驴找马",
        detail: "你很难受，但现金流更重要。先止血（睡眠/通勤/边界），同步面试与储备金，拿到下家再走。",
      };
    }
    return {
      title: "结论：即刻走",
      detail: "这是一份负收益资产。优先保命：设定离开时间线（≤30天），把简历/作品集/面试准备立即启动。",
    };
  }
  if (roi < 120) {
    return {
      title: "结论：骑驴找马",
      detail:
        pressure >= 4
          ? "你承担得太多，不适合裸辞。用 4-8 周做系统性跳槽准备，同时优化最痛的损耗项。"
          : "可先稳住，但别麻木。给自己设一个明确的离开触发条件（如绩效/业务下滑/健康预警）。",
    };
  }
  if (roi < 180) {
    return {
      title: "结论：再苟半年",
      detail: "ROI 还行，属于可继续盘的资产。建议把收益最大化（谈薪/争资源）并保持可跳状态。",
    };
  }
  return {
    title: "结论：甚至建议不用走",
    detail: "这份工作属于高收益低损耗的稀有标的。你唯一要做的是：别被系统当成永动机，守住边界。",
  };
}

/**
 * 2.0 统一结果模型：ROI + 维度拆解 + 题目贡献明细 + 建议
 */
export function calculateResult(answers: Answers): ResultModel {
  const gainDims = new Set(QUIZ_DATA.scoring_logic.gain_dimensions);
  const lossDims = new Set(QUIZ_DATA.scoring_logic.loss_dimensions);

  const gain: Record<string, number> = {};
  const loss: Record<string, number> = {};
  let extraLoss = 0;
  let risk = 0;
  let pressure = 0;

  const contributions: QuestionContribution[] = [];

  const apply = (w: WeightMap | undefined) => {
    if (!w) return;
    for (const [k, v] of Object.entries(w)) {
      if (gainDims.has(k)) {
        gain[k] = (gain[k] ?? 0) + v;
        continue;
      }

      // 显式映射
      if (k === "commute_loss") {
        loss["commute"] = (loss["commute"] ?? 0) + v;
        continue;
      }
      if (k === "health_loss") {
        loss["health"] = (loss["health"] ?? 0) + v;
        continue;
      }
      if (k === "culture_loss") {
        loss["culture"] = (loss["culture"] ?? 0) + v;
        continue;
      }

      if (lossDims.has(k)) {
        loss[k] = (loss[k] ?? 0) + v;
        continue;
      }

      // risk / pressure 等：作为额外 loss
      extraLoss += v;
    }
  };

  const applyForContribution = (qid: string, w: WeightMap | undefined, answerValue?: string | number) => {
    const q = QUIZ_DATA.questions.find((x) => x.id === qid);
    const gainC: Record<string, number> = {};
    const lossC: Record<string, number> = {};
    let extra = 0;

    if (w) {
      for (const [k, v] of Object.entries(w)) {
        if (gainDims.has(k)) {
          gainC[k] = (gainC[k] ?? 0) + v;
          continue;
        }
        if (k === "commute_loss") {
          lossC["commute"] = (lossC["commute"] ?? 0) + v;
          continue;
        }
        if (k === "health_loss") {
          lossC["health"] = (lossC["health"] ?? 0) + v;
          continue;
        }
        if (k === "culture_loss") {
          lossC["culture"] = (lossC["culture"] ?? 0) + v;
          continue;
        }
        if (lossDims.has(k)) {
          lossC[k] = (lossC[k] ?? 0) + v;
          continue;
        }
        extra += v;
      }
    }

    // 获取 answerLabel（select/branch_selector/slider_discrete）
    let answerLabel: string | undefined;
    if (q && (q.type === "select" || q.type === "branch_selector")) {
      const selected = answers[qid] as string | undefined;
      answerLabel = q.options.find((o) => o.value === selected)?.label;
    }
    if (q && q.type === "slider_discrete") {
      const idx = (answers[qid] as number | undefined) ?? 1;
      answerLabel = q.options[Math.max(0, Math.min(q.options.length - 1, idx))]?.label;
    }

    contributions.push({
      questionId: qid,
      questionText: q?.text ?? qid,
      answerValue,
      answerLabel,
      gain: gainC,
      loss: lossC,
      extraLoss: extra,
    });
  };

  // 遍历所有题：select/branch_selector/slider_discrete
  for (const q of QUIZ_DATA.questions) {
    if (q.id === "q4") continue; // slider 连续题单独处理
    const w = getSelectedOptionWeight(q.id, answers);
    // 记录风险/压力（用于最终建议）
    if (q.id === "q2") risk += w?.risk ?? 0;
    if (q.id === "q3") pressure += w?.pressure ?? 0;
    apply(w);
    applyForContribution(q.id, w, answers[q.id]);
  }

  // 连续 slider：q4
  const w4 = mapLinearLossForQ4(answers);
  apply(w4);
  applyForContribution("q4", w4, answers["q4"] ?? 0);

  const gainSum = Object.values(gain).reduce((a, b) => a + b, 0);
  const lossSumBase = Object.values(loss).reduce((a, b) => a + b, 0);
  const lossSum = lossSumBase + Math.max(0, extraLoss);
  const roi = lossSum <= 0 ? 999 : (gainSum / lossSum) * 100;

  const totals: AuditTotals = { gain, loss, gainSum, lossSum, roi };

  return {
    totals,
    contributions,
    risk,
    pressure,
    roiGrade: getRoiGrade(roi),
    finalAdvice: getFinalAdvice(roi, risk, pressure),
  };
}

// ── 语录（按 ROI 档位） ───────────────────────────────────────────────────────

export interface AuditQuoteLevel {
  minRoi: number;
  emoji: string;
  title: string;
  subtitle: string;
  commentary: string;
}

export const AUDIT_QUOTES: AuditQuoteLevel[] = [
  {
    minRoi: 180,
    emoji: "💎",
    title: "高收益资产",
    subtitle: "继续持有，谨防被薅秃",
    commentary:
      "你这份工作 ROI 过高，属于“可以继续盘”的优质资产。唯一风险是：你越能扛，越容易被当成永动机。记得把边界写进合同里（至少写进聊天记录）。",
  },
  {
    minRoi: 120,
    emoji: "✅",
    title: "尚可接受",
    subtitle: "能活，但别忘了升级",
    commentary:
      "收益和损耗差不多打平。你现在的状态像温水泡脚：舒服，但不治病。建议：把可迁移能力刷到下一档，别把稳定当成终点。",
  },
  {
    minRoi: 80,
    emoji: "⚠️",
    title: "低效消耗",
    subtitle: "建议审计复盘，准备止损",
    commentary:
      "损耗开始吞掉收益了。你不是不够努力，你是努力方向被系统性浪费。把简历当成逃生舱常备物资，定期检修。",
  },
  {
    minRoi: 0,
    emoji: "🚨",
    title: "负收益资产",
    subtitle: "建议立刻止损",
    commentary:
      "你在用命换钱，还是换不到钱。继续持有只会让损耗复利增长。实验室建议：先保命，再谈理想；先撤离，再谈情怀。",
  },
];

export function getAuditQuoteByRoi(roi: number): AuditQuoteLevel {
  return AUDIT_QUOTES.find((q) => roi >= q.minRoi) ?? AUDIT_QUOTES[AUDIT_QUOTES.length - 1];
}
