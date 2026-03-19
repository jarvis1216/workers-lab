export const contentType = "image/svg+xml";

/**
 * 用纯 SVG 生成 Emoji 图标，避免 next/og 在构建期拉取外部字体资源。
 */
export default function Icon() {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
  <rect x="0" y="0" width="32" height="32" rx="7" fill="#FFFFFF" />
  <text x="16" y="21" text-anchor="middle" font-size="18">🧪</text>
</svg>`.trim();

  return new Response(svg, {
    headers: { "Content-Type": contentType },
  });
}
