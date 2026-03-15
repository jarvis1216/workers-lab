import type { Answers } from "./types";
import { QUIZ_QUESTIONS } from "./questions";

/**
 * 获取单道题的 0-100 离职倾向分数。
 * slider 题通过 scoreMapper 转换；
 * selection 题直接读取对应 option 的 score 字段。
 */
function getQuestionScore(questionId: string, answers: Answers): number {
  const question = QUIZ_QUESTIONS.find((q) => q.id === questionId);
  if (!question) return 50;

  if (question.type === "slider") {
    const raw = (answers[questionId] as number | undefined) ?? question.defaultValue;
    return question.scoreMapper(raw);
  }

  if (question.type === "selection" || question.type === "industry") {
    const selectedId = answers[questionId] as string | undefined;
    if (!selectedId) return 50;
    const opt = question.options.find((o) => o.id === selectedId) as
      | { score?: number }
      | undefined;
    return opt?.score ?? 50;
  }

  return 50;
}

/**
 * 加权总分计算：
 *   Q1(狗粮厚度)  × 0.30
 *   Q2(电池损耗)  × 0.20
 *   Q3(智力降级)  × 0.20
 *   Q4(宫斗烈度)  × 0.20
 *   Q5(财务护城河) × 0.10
 *
 * 返回 0-100 的整数。
 */
export function calculateScore(answers: Answers): number {
  const q1 = getQuestionScore("q1", answers);
  const q2 = getQuestionScore("q2", answers);
  const q3 = getQuestionScore("q3", answers);
  const q4 = getQuestionScore("q4", answers);
  const q5 = getQuestionScore("q5", answers);

  return Math.round(q1 * 0.3 + q2 * 0.2 + q3 * 0.2 + q4 * 0.2 + q5 * 0.1);
}

// ── 结果档位 ──────────────────────────────────────────────────────────────────

export interface ResultLevel {
  minScore: number;
  emoji: string;
  title: string;
  subtitle: string;
  stampColor: string;
  bgColor: string;
  borderColor: string;
  commentary: string;
  suggestion: string;
}

export const RESULT_LEVELS: ResultLevel[] = [
  {
    minScore: 80,
    emoji: "🚨",
    title: "重度离职综合征",
    subtitle: "建议立即手术",
    stampColor: "#C62828",
    bgColor: "rgba(198, 40, 40, 0.06)",
    borderColor: "rgba(198, 40, 40, 0.25)",
    commentary:
      `恭喜你，已经集齐了离职的所有理由。钱给的少、心已死、老板是甄嬛剧组的，再留下去就不是"忍辱负重"了，是自虐。\n\n实验室诊断：你不是离不开这份工作，而是你太善良了。善良的人，请立刻更新简历。`,
    suggestion: "立即更新简历 · 联系猎头 · 设定三个月目标",
  },
  {
    minScore: 60,
    emoji: "⚠️",
    title: "中度焦虑性凑合症",
    subtitle: "保守治疗，持续观察",
    stampColor: "#E65100",
    bgColor: "rgba(230, 81, 0, 0.05)",
    borderColor: "rgba(230, 81, 0, 0.22)",
    commentary:
      `你的状态是标准的"活着但没在生活"。说不难受是假的，说有多难受又说不出口。你大概也知道应该走，但总觉得"再等等"——等年终、等项目结束、等领导想开点。\n\n实验室提醒：等是等不来出路的，能等来的，只有一根白头发。`,
    suggestion: "利用业余时间试水 · 保持面试手感 · 设定离开时间线",
  },
  {
    minScore: 40,
    emoji: "🌡️",
    title: "轻度温水青蛙症",
    subtitle: "症状不明显，但需警惕",
    stampColor: "#F57F17",
    bgColor: "rgba(245, 127, 23, 0.05)",
    borderColor: "rgba(245, 127, 23, 0.22)",
    commentary:
      "你的处境是最危险的——不够痛，所以没动力改变；但也不够好，以至于每天都在消耗你。你像一部用了五年的手机，屏幕没碎，就是卡。\n\n实验室建议：不需要现在就跑，但请认真思考：三年后的你，在哪里？",
    suggestion: "记录每天的工作感受 · 和信任的人聊聊 · 保持学习",
  },
  {
    minScore: 0,
    emoji: "✅",
    title: "症状轻微，建议观察",
    subtitle: "请继续保持，但保持危机意识",
    stampColor: "#2E7D32",
    bgColor: "rgba(46, 125, 50, 0.05)",
    borderColor: "rgba(46, 125, 50, 0.22)",
    commentary:
      `要么你真的找到了一份好工作（0.1% 概率），要么你已经习惯到感觉不到痛了（99.9% 概率）。如果是前者，请给实验室投一份简历。如果是后者……我们不评判，但偶尔试着问问自己：\n\n我还记得"期待上班"是什么感觉吗？`,
    suggestion: "珍惜当下 · 保持危机意识 · 持续成长",
  },
];

export function getResultLevel(score: number): ResultLevel {
  return (
    RESULT_LEVELS.find((l) => score >= l.minScore) ?? RESULT_LEVELS[RESULT_LEVELS.length - 1]
  );
}
