import type { QuizConfig, Question } from "./types";

/**
 * 离职决策器 2.0（审计版）题库配置
 *
 * 说明：
 * - 基线题 Q1-3
 * - 通用成本题 Q4-7
 * - 分支专项题 Q8-10（根据 Q1 分流，保证每人仍回答 12 题）
 * - 收尾题 Q11-12
 */
export const QUIZ_DATA: QuizConfig = {
  version: "2.0",
  scoring_logic: {
    gain_dimensions: ["salary", "benefits", "growth", "market_value"],
    loss_dimensions: ["time", "commute", "health", "management", "culture"],
  },
  questions: [
    // ── Q1：动态分支选择 ────────────────────────────────────────────────
    {
      id: "q1",
      module: "baseline",
      text: "你目前的职业赛道和环境属于？",
      type: "branch_selector",
      options: [
        {
          label: "互联网大厂/高增长私企",
          value: "A",
          branch: "big_tech",
          weight: { growth: 5 },
        },
        {
          label: "体制内/大型国企/事业单位",
          value: "B",
          branch: "gov_state",
          weight: { growth: 2 },
        },
        {
          label: "乙方/专业服务（客户是爹）",
          value: "C",
          branch: "agency",
          weight: { growth: 4 },
        },
        {
          label: "自由职业/远程/小团队",
          value: "D",
          branch: "remote",
          weight: { growth: 3 },
        },
      ],
    },

    // ── Q2：存款支撑（风险/底气） ──────────────────────────────────────
    {
      id: "q2",
      module: "baseline",
      text: "如果明天丢掉工作，你的存款和家庭能支撑多久？",
      type: "select",
      options: [
        { label: "处于负债或断粮边缘（下个月即告急）", value: "A", weight: { risk: 10 } },
        { label: "勉强支撑 3 个月（需立即找下家）", value: "B", weight: { risk: 5 } },
        { label: "稳稳支撑半年（可以从容选择）", value: "C", weight: { risk: 0 } },
        { label: "支撑 1 年以上（家里有矿/有副业）", value: "D", weight: { risk: -5 } },
      ],
    },

    // ── Q3：责任负担（压力） ──────────────────────────────────────────
    {
      id: "q3",
      module: "baseline",
      text: "你目前的社会角色和责任负担？",
      type: "select",
      options: [
        { label: "职场新人（单身，一人吃饱全家不饿）", value: "A", weight: { pressure: 1 } },
        { label: "事业上升期（工作3-5年，有稳定开销）", value: "B", weight: { pressure: 3 } },
        { label: "职场顶梁柱（有房贷/养老/育儿任务）", value: "C", weight: { pressure: 5 } },
        { label: "资深老兵（重心已不在打工，求稳为主）", value: "D", weight: { pressure: 2 } },
      ],
    },

    // ── Q4：工时（线性损耗） ──────────────────────────────────────────
    {
      id: "q4",
      module: "common_cost",
      text: "算上通勤和隐性加班，每天为工作消耗的真实时间？",
      type: "slider",
      min: 0,
      max: 24,
      step: 0.5,
      weight_logic: "linear_loss",
    },

    // ── Q5：福利（收益） ──────────────────────────────────────────────
    {
      id: "q5",
      module: "common_cost",
      text: "除了月薪，公司的食堂、补贴、福利让你觉得？",
      type: "select",
      options: [
        { label: "极好（省下大笔开支，很有幸福感）", value: "A", weight: { benefits: 5 } },
        { label: "尚可（能解决基本刚需）", value: "B", weight: { benefits: 3 } },
        { label: "中规中矩（聊胜于无）", value: "C", weight: { benefits: 1 } },
        { label: "几乎为零（卖命还得倒贴水钱）", value: "D", weight: { benefits: 0 } },
      ],
    },

    // ── Q6：通勤损耗 ────────────────────────────────────────────────
    {
      id: "q6",
      module: "common_cost",
      text: "每天的通勤过程对你的精神损耗？",
      type: "select",
      options: [
        { label: "几乎无感（居家/步行）", value: "A", weight: { commute_loss: 0 } },
        { label: "丝滑（30分钟内）", value: "B", weight: { commute_loss: 1 } },
        { label: "略显疲惫（30-60分钟）", value: "C", weight: { commute_loss: 3 } },
        { label: "严重损耗（1-2小时）", value: "D", weight: { commute_loss: 5 } },
        { label: "灵魂摧残（2小时以上或跨城出差）", value: "E", weight: { commute_loss: 8 } },
      ],
    },

    // ── Q7：健康预警 ────────────────────────────────────────────────
    {
      id: "q7",
      module: "common_cost",
      text: "最近半年，你的身体是否出现了预警信号？",
      type: "select",
      options: [
        { label: "活力满满（还能去撸铁）", value: "A", weight: { health_loss: 0 } },
        { label: "周期性疲劳（睡一觉能好）", value: "B", weight: { health_loss: 2 } },
        { label: "亚健康明显（脱发/心悸/肠胃紊乱）", value: "C", weight: { health_loss: 5 } },
        { label: "严重躯体化（失眠/情绪崩溃/已确诊）", value: "D", weight: { health_loss: 10 } },
      ],
    },

    // ── Q8-10：big_tech ────────────────────────────────────────────
    {
      id: "q8_big_tech",
      branch: "big_tech",
      text: "领导对你的管理风格更接近？",
      type: "select",
      options: [
        { label: "授意放权/导师型", value: "A", weight: { management: 0 } },
        { label: "理性结果导向", value: "B", weight: { management: 2 } },
        { label: "精细化监控（微操大师）", value: "C", weight: { management: 5 } },
        { label: "PUA/情绪垃圾桶", value: "D", weight: { management: 8 } },
      ],
    },
    {
      id: "q9_big_tech",
      branch: "big_tech",
      text: "团队内部的内耗程度？",
      type: "select",
      options: [
        { label: "并肩作战/效率极高", value: "A", weight: { culture_loss: 0 } },
        { label: "互不干扰/机械协作", value: "B", weight: { culture_loss: 2 } },
        { label: "表面兄弟/疯狂写汇报", value: "C", weight: { culture_loss: 5 } },
        { label: "甩锅为王/步步惊心", value: "D", weight: { culture_loss: 8 } },
      ],
    },
    {
      id: "q10_big_tech",
      branch: "big_tech",
      text: "目前的业务前景你如何看待？",
      type: "select",
      options: [
        { label: "高速增长（能分肉吃）", value: "A", weight: { growth: 5 } },
        { label: "平稳期（能混日子）", value: "B", weight: { growth: 2 } },
        { label: "日落西山（随时裁员）", value: "C", weight: { growth: -3 } },
        { label: "看不懂（心里发毛）", value: "D", weight: { growth: 0 } },
      ],
    },

    // ── Q8-10：gov_state ───────────────────────────────────────────
    {
      id: "q8_gov_state",
      branch: "gov_state",
      text: "人际关系的复杂程度？",
      type: "select",
      options: [
        { label: "简单纯粹/干活就行", value: "A", weight: { culture_loss: 0 } },
        { label: "需要看眼色", value: "B", weight: { culture_loss: 3 } },
        { label: "派系林立/论资排辈", value: "C", weight: { culture_loss: 6 } },
        { label: "步步惊心/如履薄冰", value: "D", weight: { culture_loss: 10 } },
      ],
    },
    {
      id: "q9_gov_state",
      branch: "gov_state",
      text: "工作内容的意义感？",
      type: "select",
      options: [
        { label: "创造社会价值", value: "A", weight: { growth: 5 } },
        { label: "机械重复但稳定", value: "B", weight: { growth: 2 } },
        { label: "形式主义严重", value: "C", weight: { growth: 0 } },
        { label: "纯粹为了卷而卷", value: "D", weight: { growth: -2 } },
      ],
    },
    {
      id: "q10_gov_state",
      branch: "gov_state",
      text: "晋升路径的透明度？",
      type: "select",
      options: [
        { label: "透明公正/有预期", value: "A", weight: { growth: 4 } },
        { label: "论资排辈", value: "B", weight: { growth: 1 } },
        { label: "萝卜岗横行", value: "C", weight: { growth: -2 } },
        { label: "已经看到死亡终点", value: "D", weight: { growth: -5 } },
      ],
    },

    // ── Q8-10：agency（JSON 只给了 q8，这里补齐 q9/q10 以保证 12 题） ─────
    {
      id: "q8_agency",
      branch: "agency",
      text: "客户的专业度与尊重程度？",
      type: "select",
      options: [
        { label: "专业且尊重/平等合作", value: "A", weight: { management: 0 } },
        { label: "甲方是大爷（但给钱）", value: "B", weight: { management: 4 } },
        { label: "既不懂又爱改/夺命Call", value: "C", weight: { management: 7 } },
        { label: "人格凌辱/完全没尊严", value: "D", weight: { management: 10 } },
      ],
    },
    {
      id: "q9_agency",
      branch: "agency",
      text: "交付节奏与项目边界更像？",
      type: "select",
      options: [
        { label: "边界清晰/节奏可控", value: "A", weight: { culture_loss: 1 } },
        { label: "需求常变/加班常态", value: "B", weight: { culture_loss: 4 } },
        { label: "永远救火/多项目并行", value: "C", weight: { culture_loss: 7 } },
        { label: "无限压榨/锅从天上来", value: "D", weight: { culture_loss: 10 } },
      ],
    },
    {
      id: "q10_agency",
      branch: "agency",
      text: "你的成长与作品沉淀情况？",
      type: "select",
      options: [
        { label: "作品能沉淀/能力明显提升", value: "A", weight: { growth: 5 } },
        { label: "有提升但很碎片", value: "B", weight: { growth: 2 } },
        { label: "只会填坑/复用率低", value: "C", weight: { growth: 0 } },
        { label: "长期被消耗/越做越空", value: "D", weight: { growth: -2 } },
      ],
    },

    // ── Q8-10：remote（JSON 未给，这里补齐 3 题保证 12 题） ──────────────
    {
      id: "q8_remote",
      branch: "remote",
      text: "远程/小团队的协作效率如何？",
      type: "select",
      options: [
        { label: "沟通顺畅/目标一致", value: "A", weight: { culture_loss: 0 } },
        { label: "偶尔误会/能解决", value: "B", weight: { culture_loss: 2 } },
        { label: "信息不对称/反复返工", value: "C", weight: { culture_loss: 5 } },
        { label: "长期混乱/全靠自救", value: "D", weight: { culture_loss: 8 } },
      ],
    },
    {
      id: "q9_remote",
      branch: "remote",
      text: "你的收入稳定性更接近？",
      type: "select",
      options: [
        { label: "稳定可预期", value: "A", weight: { salary: 5 } },
        { label: "有波动但可控", value: "B", weight: { salary: 2 } },
        { label: "周期性焦虑", value: "C", weight: { salary: 0 } },
        { label: "高度不确定", value: "D", weight: { salary: -2 } },
      ],
    },
    {
      id: "q10_remote",
      branch: "remote",
      text: "你对未来 6 个月的路线规划？",
      type: "select",
      options: [
        { label: "方向清晰/在积累复利", value: "A", weight: { growth: 4 } },
        { label: "大概知道要做什么", value: "B", weight: { growth: 2 } },
        { label: "走一步算一步", value: "C", weight: { growth: 0 } },
        { label: "完全迷茫", value: "D", weight: { growth: -3 } },
      ],
    },

    // ── Q11：市场溢价（离散 Slider，4 档） ──────────────────────────────
    {
      id: "q11",
      module: "final",
      text: "现在的技能去外面找同等薪水的难度？",
      type: "slider_discrete",
      options: [
        { label: "闭眼拿Offer", value: "A", weight: { market_value: 10 } },
        { label: "3个月能找到", value: "B", weight: { market_value: 5 } },
        { label: "只能平替/甚至降薪", value: "C", weight: { market_value: 0 } },
        { label: "离开即失业", value: "D", weight: { market_value: -5 } },
      ],
    },

    // ── Q12：最后放不下（不计分，留给语录/建议扩展） ─────────────────────
    {
      id: "q12",
      module: "final",
      text: "目前最舍不得、放不下的是？",
      type: "select",
      options: [
        { label: "这里的钱（给得太多了）", value: "A" },
        { label: "这里的名（大厂光环/体面）", value: "B" },
        { label: "这里的稳（不想面对不确定性）", value: "C" },
        { label: "单纯的穷（不敢断粮）", value: "D" },
      ],
    },
  ] as Question[],
};

export const QUIZ_QUESTIONS = QUIZ_DATA.questions;
