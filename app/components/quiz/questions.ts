import type {
  IndustryQuestion,
  SelectionQuestion,
  SliderQuestion,
  Question,
} from "./types";

// ── 第 0 题：行业与岗位 ────────────────────────────────────────────────────────

const q0: IndustryQuestion = {
  type: "industry",
  id: "industry",
  title: "你在哪个领域打工？",
  subtitle: "选一个最接近的，不会评判你的",
  options: [
    { id: "internet", label: "互联网/科技", emoji: "💻" },
    { id: "finance", label: "金融/银行", emoji: "🏦" },
    { id: "education", label: "教育/培训", emoji: "📚" },
    { id: "medical", label: "医疗/健康", emoji: "🏥" },
    { id: "manufacture", label: "制造/工厂", emoji: "🏭" },
    { id: "retail", label: "零售/电商", emoji: "🛒" },
    { id: "gov", label: "政府/事业单位", emoji: "🏛️" },
    { id: "other", label: "其他行业", emoji: "🌈" },
  ],
};

// ── 第 1 题：🐶 狗粮厚度（薪酬回报比） ───────────────────────────────────────
// 逻辑：给的钱能不能覆盖受的委屈？
// 低分(工资不够看病) → leave score 高；高分(给太多了) → leave score 低

const q1: SliderQuestion = {
  type: "slider",
  id: "q1",
  title: "🐶 狗粮厚度",
  subtitle: "给的钱，能覆盖受的委屈吗？",
  min: 1,
  max: 10,
  step: 1,
  defaultValue: 5,
  minLabel: "工资只够看病",
  maxLabel: "给的实在太多了",
  scoreMapper: (v) => Math.round((10 - v) / 9 * 100),
};

// ── 第 2 题：🔋 电池损耗（身心健康度） ───────────────────────────────────────
// 逻辑：睡眠、情绪、是否抑郁

const q2: SelectionQuestion = {
  type: "selection",
  id: "q2",
  title: "🔋 电池损耗",
  subtitle: "最近的身体和情绪状态……",
  options: [
    { id: "a", label: "每天自然醒，精力充沛", emoji: "☀️", score: 0 },
    { id: "b", label: "靠咖啡续命，但还撑得住", emoji: "☕", score: 35 },
    { id: "c", label: "回到家倒头就睡，啥都不想干", emoji: "🛋️", score: 70 },
    { id: "d", label: "听到微信提示音就心悸", emoji: "💔", score: 100 },
  ],
};

// ── 第 3 题：🧠 智力降级（个人成长性） ───────────────────────────────────────
// 逻辑：简历是在镀金还是在生锈？
// 低分(纯螺丝钉) → leave score 高；高分(每天学新东西) → leave score 低

const q3: SliderQuestion = {
  type: "slider",
  id: "q3",
  title: "🧠 智力降级",
  subtitle: "你的简历，在镀金还是在生锈？",
  min: 1,
  max: 10,
  step: 1,
  defaultValue: 5,
  minLabel: "纯纯的螺丝钉",
  maxLabel: "每天都在学新东西",
  scoreMapper: (v) => Math.round((10 - v) / 9 * 100),
};

// ── 第 4 题：🎭 宫斗烈度（内耗与管理环境） ────────────────────────────────────
// 逻辑：团队氛围、甩锅程度、老板画饼

const q4: SelectionQuestion = {
  type: "selection",
  id: "q4",
  title: "🎭 宫斗烈度",
  subtitle: "你们公司的内部氛围是……",
  options: [
    { id: "a", label: "都在专心做事，环境挺好的", emoji: "🤝", score: 0 },
    { id: "b", label: "全员戏精，甄嬛传既视感", emoji: "🎭", score: 100 },
  ],
};

// ── 第 5 题：🛡️ 财务护城河（现实底气） ──────────────────────────────────────
// 逻辑：存款能撑多久？（防坑题，没钱再痛苦也不能乱辞职）
// 注意：分数代表"有底气离职的能力"，存款越多 score 越高

const q5: SelectionQuestion = {
  type: "selection",
  id: "q5",
  title: "🛡️ 财务护城河",
  subtitle: "核心拷问：你的存款能撑多久？",
  options: [
    { id: "a", label: "下个月房租都没着落了", emoji: "😱", score: 0 },
    { id: "b", label: "撑个半年，没什么问题", emoji: "💰", score: 50 },
    { id: "c", label: "被动收入已经覆盖支出", emoji: "🏖️", score: 100 },
  ],
};

export const QUIZ_QUESTIONS: Question[] = [q0, q1, q2, q3, q4, q5];
