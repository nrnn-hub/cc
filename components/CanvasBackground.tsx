import React, { useEffect, useRef } from 'react';

export const CanvasBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let mouse = { x: width / 2, y: height / 2 };
    
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Procedural fish parameters
    const segments = 40;
    const segmentLength = 15;
    const points: { x: number, y: number, angle: number }[] = [];
    for (let i = 0; i < segments; i++) {
      points.push({ x: width / 2, y: height / 2, angle: 0 });
    }

    let animationFrameId: number;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Update head
      const dx = mouse.x - points[0].x;
      const dy = mouse.y - points[0].y;
      points[0].angle = Math.atan2(dy, dx);
      
      // Move head towards mouse smoothly
      points[0].x += dx * 0.1;
      points[0].y += dy * 0.1;

      // Update body
      for (let i = 1; i < segments; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const angle = Math.atan2(prev.y - curr.y, prev.x - curr.x);
        curr.angle = angle;
        curr.x = prev.x - Math.cos(angle) * segmentLength;
        curr.y = prev.y - Math.sin(angle) * segmentLength;
      }

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Draw spine
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < segments; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw ribs
      for (let i = 2; i < segments - 2; i += 2) {
        const p = points[i];
        // Rib size decreases towards the tail
        const ribSize = Math.sin((i / segments) * Math.PI) * 40;
        
        const angle1 = p.angle + Math.PI / 2;
        const angle2 = p.angle - Math.PI / 2;

        ctx.beginPath();
        // Left rib
        ctx.moveTo(p.x, p.y);
        ctx.quadraticCurveTo(
          p.x + Math.cos(angle1) * ribSize * 0.5 - Math.cos(p.angle) * 10,
          p.y + Math.sin(angle1) * ribSize * 0.5 - Math.sin(p.angle) * 10,
          p.x + Math.cos(angle1) * ribSize,
          p.y + Math.sin(angle1) * ribSize
        );
        // Right rib
        ctx.moveTo(p.x, p.y);
        ctx.quadraticCurveTo(
          p.x + Math.cos(angle2) * ribSize * 0.5 - Math.cos(p.angle) * 10,
          p.y + Math.sin(angle2) * ribSize * 0.5 - Math.sin(p.angle) * 10,
          p.x + Math.cos(angle2) * ribSize,
          p.y + Math.sin(angle2) * ribSize
        );
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Draw head
      ctx.save();
      ctx.translate(points[0].x, points[0].y);
      ctx.rotate(points[0].angle);
      ctx.beginPath();
      ctx.moveTo(15, 0);
      ctx.lineTo(-10, -10);
      ctx.lineTo(-10, 10);
      ctx.closePath();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fill();
      ctx.restore();

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
};
