import React from "react";

interface SidenoteProps {
  note: string;
  children: React.ReactNode;
  side?: "left" | "right";
}

export default function Sidenote({ note, children, side = "right" }: SidenoteProps) {
  const isRight = side === "right";

  const floatStyle: React.CSSProperties = isRight
    ? {
        float: "right",
        clear: "right",
        width: "14rem",
        marginRight: "-15rem",
        marginTop: "0.15em",
        position: "relative",
      }
    : {
        float: "left",
        clear: "left",
        width: "14rem",
        marginLeft: "-15rem",
        marginTop: "0.15em",
        position: "relative",
      };

  return (
    <span>
      <span
        className="hidden lg:flex items-start gap-2 text-sm text-slate-500 italic leading-snug"
        style={floatStyle}
      >
        {isRight ? (
          <>
            {/* Right side: arrow points left ←, note at tail (right) */}
            <svg width="64" height="32" viewBox="0 0 64 32" fill="none" aria-hidden="true" className="shrink-0 mt-1">
              <path d="M62 8 C48 6, 28 26, 8 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
              <path d="M8 22 L16 16 M8 22 L14 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
            </svg>
            <span className="pt-1 max-w-[10rem]">{note}</span>
          </>
        ) : (
          <>
            {/* Left side: note at tail (left), arrow points right → */}
            <span className="pt-1 max-w-[10rem] text-right">{note}</span>
            <svg width="64" height="32" viewBox="0 0 64 32" fill="none" aria-hidden="true" className="shrink-0 mt-1">
              <path d="M2 8 C16 6, 36 26, 56 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
              <path d="M56 22 L48 16 M56 22 L50 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
            </svg>
          </>
        )}
      </span>
      <span className="border-b border-dotted border-slate-400">{children}</span>
    </span>
  );
}
