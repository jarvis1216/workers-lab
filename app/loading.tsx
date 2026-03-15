export default function Loading() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] px-4"
      style={{
        background:
          "linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 222, 233, 0.06) 50%, rgba(181, 255, 252, 0.06) 100%)",
      }}
    >
      <style>{`
        @keyframes run-bounce {
          0%, 100% {
            transform: translateY(0) translateX(0) scale(1);
          }
          25% {
            transform: translateY(-12px) translateX(4px) scale(1.05);
          }
          50% {
            transform: translateY(0) translateX(8px) scale(1);
          }
          75% {
            transform: translateY(-8px) translateX(12px) scale(1.03);
          }
        }
        .loading-cat {
          display: inline-block;
          animation: run-bounce 1.2s ease-in-out infinite;
        }
      `}</style>

      <span
        className="loading-cat"
        style={{ fontSize: "64px", lineHeight: 1 }}
        aria-hidden
      >
        🐱
      </span>

      <p
        className="mt-5 text-sm font-medium"
        style={{ color: "#A1887F", letterSpacing: "0.04em" }}
      >
        正在为您构建自救通道...
      </p>
    </div>
  );
}
