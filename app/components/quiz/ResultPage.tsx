"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  calculateResult,
  getAuditQuoteByRoi,
} from "./scoreCalculator";
import type { Answers } from "./types";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Tooltip,
} from "recharts";

// 生成诊断编号
function genDiagnosisId(): string {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `WL-${date}-${rand}`;
}

// 格式化今天日期
function formatDate(): string {
  const now = new Date();
  return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
}

interface Props {
  answers: Answers;
  onRetry: () => void;
  onExit: () => void;
}

function clamp100(n: number) {
  return Math.max(0, Math.min(100, n));
}

function getDiagnosisConclusion(score: number) {
  if (score >= 85) {
    return {
      title: "神仙工作，请好好干",
      detail:
        "这份工作的综合性价比很高，建议继续持有并争取更高杠杆（谈薪、争资源、扩影响力）。核心策略：保住边界，不要被高绩效反向绑定。",
    };
  }
  if (score >= 65) {
    return {
      title: "可继续观察，建议再苟半年",
      detail:
        "当前是“可接受但不稳态”的工作。短期不必激进离职，但要持续盘点损耗项，并维持外部机会窗口。",
    };
  }
  if (score >= 45) {
    return {
      title: "准备跑路，先打磨简历",
      detail:
        "工作已进入“温水煮人”区间。建议用 4-8 周做系统化跳槽准备：简历、作品、面试节奏、现金流缓冲同步推进。",
    };
  }
  return {
    title: "这地方一秒都别多待",
    detail:
      "当前岗位已明显负收益，优先级是止损和保命。先把睡眠和现金流稳住，再快速执行离开计划。",
  };
}

function generateInsight(
  dimension: "money" | "life" | "path" | "emotion" | "safety" | "market",
  score: number,
  kind: "red" | "black"
) {
  if (dimension === "money") {
    return kind === "red"
      ? "你的现金回报仍有说服力，至少不是纯靠情怀发电。钱这条线还能打，是你当下最现实的缓冲垫。"
      : "现金回报开始失真：你付出的精力正在跑赢收入增长。长期看，这会把你拖进“忙但不值钱”的陷阱。";
  }
  if (dimension === "life") {
    return kind === "red"
      ? "你的身体账户还没有见底，说明损耗可控。这个窗口期很珍贵，可以用于主动调整而不是被动崩盘。"
      : "时间、通勤和健康正在联手透支你。每多撑一个季度，都可能换来更低的恢复能力和更高的决策成本。";
  }
  if (dimension === "path") {
    return kind === "red"
      ? "职业路径仍在向上，说明你并非“原地打转”。这份增长性会在未来议价中持续复利。"
      : "职业路径出现停滞信号：今天做的事，明天未必能写进简历。继续消耗会让你在市场上越来越被动。";
  }
  if (dimension === "emotion") {
    return kind === "red"
      ? "情绪成本处于可管理范围，团队和管理尚未成为高危变量。你至少不用每天在内耗里打卡。"
      : "管理关系与团队内耗正在侵蚀你的心理边界。看似是“沟通问题”，本质是长期情绪税。";
  }
  if (dimension === "safety") {
    return kind === "red"
      ? "你的安全垫还算在线，抗风险能力给了你谈判底气。你不必为了下一顿饭向烂工作低头。"
      : "安全区偏薄，意味着你在关键决策上会被现金流牵制。先补护城河，再谈大动作，胜率更高。";
  }
  // market
  return kind === "red"
    ? "你的市场议价权还在，说明离开当前系统后仍有可迁移价值。这是你最关键的主动权资产。"
    : "市场议价权偏弱，离开后可能面临降薪或等待期拉长。现在更需要“边干边升级”，而不是裸冲。";
}

export default function ResultPage({ answers, onRetry, onExit }: Props) {
  const result = useMemo(() => calculateResult(answers), [answers]);
  const audit = result.totals;
  const roi = Math.round(audit.roi);
  const quote = useMemo(() => getAuditQuoteByRoi(audit.roi), [audit.roi]);

  const [displayScore, setDisplayScore] = useState(0);
  const [saved, setSaved] = useState(false);
  const diagnosisId = useRef(genDiagnosisId());
  const diagnosisDate = useRef(formatDate());

  // 100 分制审计分：收益占总成本比，严格限制在 0-100
  const auditScore = useMemo(() => {
    const total = audit.gainSum + audit.lossSum;
    if (total <= 0) return 50;
    return clamp100((audit.gainSum / total) * 100);
  }, [audit.gainSum, audit.lossSum]);

  const auditScoreText = useMemo(() => {
    const roundedInt = Math.round(displayScore);
    const isIntegerLike = Math.abs(displayScore - roundedInt) < 0.005;
    return isIntegerLike ? String(roundedInt) : displayScore.toFixed(2);
  }, [displayScore]);

  // 排名（模拟正态分布）：Score * 0.95 + Random
  const percentile = useMemo(() => {
    // Box-Muller 生成近似正态随机数（均值 0，标准差 ~ 5）
    const u = 1 - Math.random();
    const v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    const noisy = auditScore * 0.95 + z * 5;
    return Math.max(1, Math.min(99, Math.round(noisy)));
  }, [auditScore]);

  // 六维雷达：钱/命/路/心/底/权
  const radar = useMemo(() => {
    const money = (audit.gain.salary ?? 0) + (audit.gain.benefits ?? 0);
    const lifeLoss = (audit.loss.time ?? 0) + (audit.loss.commute ?? 0) + (audit.loss.health ?? 0);
    const path = audit.gain.growth ?? 0;
    const emotionLoss = (audit.loss.management ?? 0) + (audit.loss.culture ?? 0);
    const safeRaw = Math.max(0, 20 - (result.risk * 2 + result.pressure));
    const market = audit.gain.market_value ?? 0;

    const moneyPct = clamp100((money / 20) * 100);
    const lifePct = clamp100(100 - (lifeLoss / 30) * 100); // 生命余额
    const pathPct = clamp100((path / 15) * 100);
    const emotionPct = clamp100(100 - (emotionLoss / 20) * 100); // 情绪余额
    const safetyPct = clamp100((safeRaw / 20) * 100);
    const marketPct = clamp100((market / 15) * 100);

    const data = [
      { dim: "钱", value: moneyPct },
      { dim: "命", value: lifePct },
      { dim: "路", value: pathPct },
      { dim: "心", value: emotionPct },
      { dim: "底", value: safetyPct },
      { dim: "权", value: marketPct },
    ];

    const scoreByKey = {
      money: moneyPct,
      life: lifePct,
      path: pathPct,
      emotion: emotionPct,
      safety: safetyPct,
      market: marketPct,
    };

    return { data, scoreByKey };
  }, [audit, result.risk, result.pressure]);

  // 当前工作深度审计（与雷达维度一致）
  const deepAudit = useMemo(() => {
    const dims = [
      { key: "money" as const, title: "钱（Hard Cash）", score: radar.scoreByKey.money },
      { key: "life" as const, title: "命（Body Health）", score: radar.scoreByKey.life },
      { key: "path" as const, title: "路（Career Path）", score: radar.scoreByKey.path },
      { key: "emotion" as const, title: "心（Emotion Cost）", score: radar.scoreByKey.emotion },
      { key: "safety" as const, title: "底（Safe Zone）", score: radar.scoreByKey.safety },
      { key: "market" as const, title: "权（Market Value）", score: radar.scoreByKey.market },
    ];

    const red = [...dims]
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((d) => ({
        title: d.title,
        detail: generateInsight(d.key, d.score, "red"),
      }));

    // 黑榜允许为空：仅当明显短板（<=45）才展示
    const black = [...dims]
      .filter((d) => d.score <= 45)
      .sort((a, b) => a.score - b.score)
      .slice(0, 3)
      .map((d) => ({
        title: d.title,
        detail: generateInsight(d.key, d.score, "black"),
      }));

    return { red, black };
  }, [radar]);

  const diagnosis = useMemo(() => getDiagnosisConclusion(auditScore), [auditScore]);

  // 分数滚动动画
  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const duration = 1200;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(eased * auditScore);
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [auditScore]);

  // 分享报告：复制链接到剪贴板并 toast 提示
  const shareUrl = "www.saveniuma.org";
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      // clipboard error
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      style={{ padding: "24px 20px 60px", maxWidth: "520px", margin: "0 auto" }}
    >
      {/* ── 病历单标题 ── */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "24px",
          paddingBottom: "16px",
          borderBottom: "1.5px dashed rgba(93, 64, 55, 0.2)",
        }}
      >
        <div style={{ fontSize: "28px", marginBottom: "6px" }}>🏥</div>
        <h1
          style={{
            fontSize: "18px",
            fontWeight: 900,
            color: "#5D4037",
            margin: 0,
            letterSpacing: "0.08em",
          }}
        >
          离职决策审计报告（2.0）
        </h1>
        <p style={{ fontSize: "12px", color: "#BCAAA4", margin: "4px 0 0", letterSpacing: "0.06em" }}>
          Workers Lab · 自救实验室
        </p>
      </div>

      {/* ── 病历信息栏 ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px",
          marginBottom: "20px",
          fontSize: "12px",
          color: "#A1887F",
        }}
      >
        <div>
          <span style={{ color: "#BCAAA4" }}>诊断编号：</span>
          <span style={{ fontWeight: 700, color: "#8D6E63" }}>{diagnosisId.current}</span>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ color: "#BCAAA4" }}>确诊日期：</span>
          <span style={{ fontWeight: 700, color: "#8D6E63" }}>{diagnosisDate.current}</span>
        </div>
      </div>

      {/* ── 分数区 ── */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          border: "none",
          borderRadius: "20px",
          padding: "24px 20px",
          textAlign: "center",
          marginBottom: "20px",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(150, 150, 200, 0.1)",
        }}
      >
        {/* 装饰水印 */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "120px",
            opacity: 0.04,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          🧾
        </div>

        <p style={{ fontSize: "13px", color: "#A1887F", margin: "0 0 8px", fontWeight: 600 }}>
          审计得分
        </p>

        <div
          style={{
            display: "inline-flex",
            alignItems: "baseline",
            gap: "4px",
            marginBottom: "10px",
          }}
        >
          <span
            style={{
              fontSize: "72px",
              fontWeight: 900,
              color: "#5D4037",
              lineHeight: 1,
            }}
          >
            {auditScoreText}
          </span>
          <span style={{ fontSize: "22px", color: "#A1887F", fontWeight: 700 }}>
            / 100
          </span>
        </div>

        <div style={{ fontSize: "12px", color: "#BCAAA4", fontWeight: 600, marginBottom: "12px" }}>
          你的排名：超过约 {percentile}% 的打工人（模拟）
        </div>

        {/* 语录印章 */}
        <motion.div
          initial={{ rotate: -8, scale: 0.7, opacity: 0 }}
          animate={{ rotate: -6, scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
          style={{
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "center",
            border: "2.5px solid rgba(93, 64, 55, 0.35)",
            borderRadius: "12px",
            padding: "8px 20px",
            marginTop: "4px",
          }}
        >
          <span style={{ fontSize: "20px", marginBottom: "2px" }}>{quote.emoji}</span>
          <span
            style={{
              fontSize: "16px",
              fontWeight: 900,
              color: "#5D4037",
              letterSpacing: "0.06em",
            }}
          >
            {quote.title}
          </span>
          <span style={{ fontSize: "11px", color: "#A1887F", opacity: 0.9, marginTop: "2px" }}>
            {quote.subtitle}
          </span>
        </motion.div>
      </motion.div>

      {/* ── 诊断结论（替代主治医生评语） ───────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        style={{
          background: "rgba(255, 255, 255, 0.9)",
          border: "none",
          borderRadius: "16px",
          padding: "18px 18px",
          marginBottom: "20px",
          boxShadow: "0 10px 30px rgba(150, 150, 200, 0.1)",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            color: "#BCAAA4",
            margin: "0 0 10px",
            fontWeight: 700,
            letterSpacing: "0.08em",
          }}
        >
          【诊断结论】
        </p>
        <p style={{ fontSize: "15px", color: "#5D4037", margin: 0, lineHeight: 1.7, fontWeight: 800 }}>
          {diagnosis.title}
        </p>
        <p style={{ fontSize: "14px", color: "#8D6E63", margin: "10px 0 0", lineHeight: 1.75, fontWeight: 600 }}>
          {diagnosis.detail}
        </p>
      </motion.div>

      {/* ── 雷达图：钱/命/路 ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        style={{
          background: "rgba(255, 255, 255, 0.9)",
          border: "none",
          borderRadius: "16px",
          padding: "14px 12px 6px",
          marginBottom: "20px",
          boxShadow: "0 10px 30px rgba(150, 150, 200, 0.1)",
        }}
      >
        <div style={{ fontSize: "12px", color: "#BCAAA4", fontWeight: 800, letterSpacing: "0.08em", padding: "4px 10px 0" }}>
          【六维资产雷达】
        </div>
        <div style={{ width: "100%", height: 220 }}>
          <ResponsiveContainer>
            <RadarChart data={radar.data}>
              <PolarGrid stroke="rgba(150,150,200,0.25)" />
              <PolarAngleAxis dataKey="dim" tick={{ fill: "#8D6E63", fontSize: 12, fontWeight: 700 }} />
              <Radar
                dataKey="value"
                stroke="#A8E6CF"
                fill="#A8E6CF"
                fillOpacity={0.35}
              />
              <Tooltip
                formatter={(v: any) => [`${v}%`, "占比"]}
                contentStyle={{
                  borderRadius: 12,
                  border: "none",
                  boxShadow: "0 10px 30px rgba(150,150,200,0.15)",
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* ── 当前工作深度审计（与雷达维度一致） ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.42, duration: 0.4 }}
        style={{
          background: "rgba(255, 255, 255, 0.9)",
          border: "none",
          borderRadius: "16px",
          padding: "18px 18px",
          marginBottom: "20px",
          boxShadow: "0 10px 30px rgba(150, 150, 200, 0.1)",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            color: "#BCAAA4",
            margin: "0 0 12px",
            fontWeight: 800,
            letterSpacing: "0.08em",
          }}
        >
          【当前工作深度审计】
        </p>

        <div
          style={{
            background: "linear-gradient(180deg, rgba(255,222,233,0.18), rgba(181,255,252,0.12))",
            borderRadius: 14,
            padding: "12px 14px",
            marginBottom: "14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
            <div style={{ fontSize: "13px", color: "#5D4037", fontWeight: 900 }}>
              🎯 性价比判词：{result.roiGrade.label}
            </div>
            <div style={{ fontSize: "11px", color: "#A1887F", fontWeight: 700 }}>
              风险:{result.risk} · 压力:{result.pressure}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gap: "14px" }}>
          <div>
            <div style={{ fontSize: "13px", color: "#5D4037", fontWeight: 900, marginBottom: 6 }}>
              🟥 红榜：为什么还能苟
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              {deepAudit.red.length === 0 ? (
                <div style={{ fontSize: "13px", color: "#A1887F", fontWeight: 600 }}>
                  目前收益项不突出，建议把“可迁移能力”当作主线资产来补强。
                </div>
              ) : (
                deepAudit.red.map((it, i) => (
                  <div key={i} style={{ fontSize: "13px", color: "#8D6E63", fontWeight: 600, lineHeight: 1.55 }}>
                    <span style={{ color: "#5D4037", fontWeight: 900 }}>{it.title}</span>：{it.detail}
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "13px", color: "#5D4037", fontWeight: 900, marginBottom: 6 }}>
              ⬛ 黑榜：凭什么要提桶
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              {deepAudit.black.length === 0 ? (
                <div style={{ fontSize: "13px", color: "#A1887F", fontWeight: 600 }}>
                  暂无明显黑榜项：这份工作的短板目前未形成高危损耗。
                </div>
              ) : (
                deepAudit.black.map((it, i) => (
                  <div key={i} style={{ fontSize: "13px", color: "#8D6E63", fontWeight: 600, lineHeight: 1.55 }}>
                    <span style={{ color: "#5D4037", fontWeight: 900 }}>{it.title}</span>：{it.detail}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </motion.div>

      {/* ── 操作按钮 ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.35 }}
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
      >
        {/* 分享报告：复制链接到剪贴板 */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleShare}
          style={{
            width: "100%",
            background: saved
              ? "linear-gradient(to right, #66BB6A, #81C784)"
              : "linear-gradient(to right, #ff9a9e, #fad0c4)",
            color: "#fff",
            border: "none",
            borderRadius: "50px",
            padding: "15px 0",
            fontSize: "16px",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 10px 30px rgba(150, 150, 200, 0.1)",
            letterSpacing: "0.04em",
            transition: "background 0.3s",
          }}
        >
          {saved ? "✅ 链接已复制到剪切板，赶紧去分享吧" : "📤 分享我的确诊报告"}
        </motion.button>

        {/* 再测一次 */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onRetry}
          style={{
            width: "100%",
            background: "rgba(255, 255, 255, 0.9)",
            border: "none",
            borderRadius: "50px",
            padding: "13px 0",
            fontSize: "15px",
            fontWeight: 600,
            color: "#5D4037",
            cursor: "pointer",
            letterSpacing: "0.04em",
            boxShadow: "0 10px 30px rgba(150, 150, 200, 0.1)",
          }}
        >
          🔄 重新测一次
        </motion.button>

        {/* 回主页 */}
        <button
          onClick={onExit}
          style={{
            background: "none",
            border: "none",
            color: "#BCAAA4",
            fontSize: "13px",
            cursor: "pointer",
            padding: "6px 0",
            textAlign: "center",
            textDecoration: "underline",
            textDecorationColor: "rgba(188, 170, 164, 0.4)",
          }}
        >
          回到主页
        </button>
      </motion.div>
    </motion.div>
  );
}
