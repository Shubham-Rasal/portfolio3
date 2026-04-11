import { useEffect, useRef, useState } from "react";
import { prepareWithSegments, layoutNextLine, type LayoutCursor } from "@chenglou/pretext";

interface TextFlowCanvasProps {
  text: string;
  className?: string;
}

function circleIntersection(
  lineY: number,
  mx: number,
  my: number,
  r: number
): { left: number; right: number } | null {
  const dy = lineY - my;
  if (Math.abs(dy) >= r) return null;
  const halfChord = Math.sqrt(r * r - dy * dy);
  return { left: mx - halfChord, right: mx + halfChord };
}

const START_CURSOR: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };

export default function TextFlowCanvas({ text, className }: TextFlowCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const preparedRef = useRef<ReturnType<typeof prepareWithSegments> | null>(null);
  const mouseRef = useRef({ x: -999, y: -999, active: false });
  const radiusRef = useRef(0);
  const rafRef = useRef<number>(0);
  const visibleRef = useRef(true);
  const [ready, setReady] = useState(false);
  const sizeRef = useRef({ width: 0, height: 0 });

  const FONT_SIZE = 18;
  const LINE_HEIGHT = 28;
  const FONT = `${FONT_SIZE}px "Source Serif 4", serif`;
  const COLOR = "#1f2937";
  const EXCLUSION_RADIUS = 70;

  // Prepare text after fonts load
  useEffect(() => {
    document.fonts.ready.then(() => {
      preparedRef.current = prepareWithSegments(text, FONT);
      setReady(true);
    });
  }, [text]);

  // Canvas render loop
  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const ctx = canvas.getContext("2d")!;

    function isAtEnd(cursor: LayoutCursor, prepared: ReturnType<typeof prepareWithSegments>): boolean {
      return cursor.segmentIndex >= prepared.segments.length;
    }

    function draw() {
      if (!visibleRef.current) return;
      const prepared = preparedRef.current;
      if (!prepared) return;

      const { width } = sizeRef.current;
      if (width === 0) return;

      ctx.clearRect(0, 0, width, canvas!.height);

      const { x: mx, y: my, active } = mouseRef.current;

      // Lerp radius
      const target = active ? EXCLUSION_RADIUS : 0;
      radiusRef.current += (target - radiusRef.current) * 0.12;
      const r = radiusRef.current;

      // Draw glow circle
      if (r > 1) {
        const grad = ctx.createRadialGradient(mx, my, 0, mx, my, r);
        grad.addColorStop(0, "rgba(251, 191, 36, 0.22)");
        grad.addColorStop(0.6, "rgba(251, 191, 36, 0.08)");
        grad.addColorStop(1, "rgba(251, 191, 36, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(mx, my, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render text with flow-around
      ctx.font = FONT;
      ctx.fillStyle = COLOR;
      ctx.textBaseline = "top";

      let cursor: LayoutCursor = START_CURSOR;
      let y = 0;
      let lineCount = 0;
      const MAX_LINES = 80;

      while (!isAtEnd(cursor, prepared) && lineCount < MAX_LINES) {
        const lineCenter = y + LINE_HEIGHT / 2;
        const isect = r > 1 ? circleIntersection(lineCenter, mx, my, r) : null;

        if (!isect) {
          const result = layoutNextLine(prepared, cursor, width);
          if (!result) break;
          ctx.fillText(result.text, 0, y);
          cursor = result.end;
        } else {
          const leftWidth = Math.max(0, isect.left - 8);
          const rightStart = isect.right + 8;
          const rightWidth = Math.max(0, width - rightStart);

          if (leftWidth >= rightWidth && leftWidth > 40) {
            const result = layoutNextLine(prepared, cursor, leftWidth);
            if (!result) break;
            ctx.fillText(result.text, 0, y);
            cursor = result.end;
          } else if (rightWidth > 40) {
            const result = layoutNextLine(prepared, cursor, rightWidth);
            if (!result) break;
            ctx.fillText(result.text, rightStart, y);
            cursor = result.end;
          }
          // else: circle covers whole line, skip (text holds position, next scanline tries again)
        }

        y += LINE_HEIGHT;
        lineCount++;
      }

      // Resize canvas height to fit content
      const neededHeight = y + 4;
      if (canvas!.height !== neededHeight) {
        canvas!.height = neededHeight;
        canvas!.style.height = `${neededHeight}px`;
        sizeRef.current.height = neededHeight;
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [ready, text]);

  // ResizeObserver
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    const ro = new ResizeObserver((entries) => {
      const w = Math.floor(entries[0].contentRect.width);
      if (w === sizeRef.current.width) return;
      sizeRef.current.width = w;
      canvas.width = w;
      canvas.style.width = `${w}px`;
    });
    ro.observe(wrapper);
    return () => ro.disconnect();
  }, []);

  // IntersectionObserver — pause rAF when off-screen
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const io = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
    });
    io.observe(canvas);
    return () => io.disconnect();
  }, []);

  // Mouse events
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };
    const onLeave = () => {
      mouseRef.current = { ...mouseRef.current, active: false };
    };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    return () => {
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={`w-full ${className ?? ""}`}>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ display: "block", width: "100%" }}
      />
    </div>
  );
}
