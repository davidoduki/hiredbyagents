"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  pulse: number;
  isAgent: boolean;
}

export function NetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0,
      H = 0;
    let animId: number;
    const nodes: Particle[] = [];

    function resize() {
      const parent = canvas!.parentElement;
      W = canvas!.width = parent?.offsetWidth ?? window.innerWidth;
      H = canvas!.height = parent?.offsetHeight ?? 600;
    }

    function makeNode(): Particle {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1,
        pulse: Math.random() * Math.PI * 2,
        isAgent: Math.random() > 0.65,
      };
    }

    resize();
    for (let i = 0; i < 55; i++) nodes.push(makeNode());

    function draw() {
      ctx!.clearRect(0, 0, W, H);

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += 0.02;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;

        const pr = n.r + Math.sin(n.pulse) * 0.5;
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, pr, 0, Math.PI * 2);
        ctx!.fillStyle = n.isAgent ? "#00e5a0" : "#0066ff";
        ctx!.globalAlpha = n.isAgent ? 0.8 : 0.45;
        ctx!.fill();
        ctx!.globalAlpha = 1;

        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const dx = n.x - m.x;
          const dy = n.y - m.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx!.beginPath();
            ctx!.moveTo(n.x, n.y);
            ctx!.lineTo(m.x, m.y);
            const alpha = (1 - dist / 140) * 0.18;
            ctx!.strokeStyle = `rgba(0,229,160,${alpha})`;
            ctx!.lineWidth = 0.5;
            ctx!.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    }

    draw();

    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.38 }}
    />
  );
}
