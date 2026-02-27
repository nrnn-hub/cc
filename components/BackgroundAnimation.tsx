import React, { useEffect, useRef } from 'react';

export const BackgroundAnimation: React.FC = () => {
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

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetX = mouseX;
    let targetY = mouseY;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    class Segment {
      x: number;
      y: number;
      length: number;
      angle: number;

      constructor(x: number, y: number, length: number) {
        this.x = x;
        this.y = y;
        this.length = length;
        this.angle = 0;
      }

      follow(tx: number, ty: number) {
        const dx = tx - this.x;
        const dy = ty - this.y;
        this.angle = Math.atan2(dy, dx);
        this.x = tx - Math.cos(this.angle) * this.length;
        this.y = ty - Math.sin(this.angle) * this.length;
      }
    }

    const numSegments = 50;
    const segments: Segment[] = [];
    for (let i = 0; i < numSegments; i++) {
      // Segments get slightly shorter towards the tail
      const len = 15 - (i / numSegments) * 10;
      segments.push(new Segment(width / 2, height / 2, len));
    }

    let time = 0;
    let animationFrameId: number;

    const draw = () => {
      time += 0.05;
      
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse follow
      const dx = targetX - mouseX;
      const dy = targetY - mouseY;
      mouseX += dx * 0.05;
      mouseY += dy * 0.05;

      const head = segments[0];
      const angleToMouse = Math.atan2(mouseY - head.y, mouseX - head.x);
      
      // Slither effect
      const slitherX = Math.cos(angleToMouse + Math.PI / 2) * Math.sin(time) * 30;
      const slitherY = Math.sin(angleToMouse + Math.PI / 2) * Math.sin(time) * 30;

      head.follow(mouseX + slitherX, mouseY + slitherY);

      for (let i = 1; i < numSegments; i++) {
        segments[i].follow(segments[i - 1].x, segments[i - 1].y);
      }

      // Draw spine line
      ctx.beginPath();
      ctx.moveTo(segments[0].x, segments[0].y);
      for (let i = 1; i < numSegments; i++) {
        ctx.lineTo(segments[i].x, segments[i].y);
      }
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw segments
      for (let i = 0; i < numSegments; i++) {
        const seg = segments[i];
        
        // Fins (Ribs)
        let ribLength = 0;
        let numRibs = 0;
        
        // First set of large pectoral fins
        if (i > 3 && i < 15) {
          ribLength = Math.sin(((i - 3) / 12) * Math.PI) * 120;
          numRibs = 1;
        } 
        // Second set of pelvic/anal fins
        else if (i > 25 && i < 40) {
          ribLength = Math.sin(((i - 25) / 15) * Math.PI) * 80;
          numRibs = 1;
        }

        if (ribLength > 0) {
          const sweep = 0.5 + Math.sin(time + i * 0.1) * 0.3; // Animate fins slightly
          const ribAngle1 = seg.angle + Math.PI / 2 + sweep;
          const ribAngle2 = seg.angle - Math.PI / 2 - sweep;

          // Draw multiple thin lines for each fin to make it look like feathers/spines
          for (let j = 0; j < 3; j++) {
            const offset = (j - 1) * 0.1;
            const currentRibLength = ribLength * (1 - j * 0.15);
            
            ctx.beginPath();
            ctx.moveTo(seg.x, seg.y);
            
            // Left fin curve
            const cpX1 = seg.x + Math.cos(seg.angle + Math.PI/2) * currentRibLength * 0.5;
            const cpY1 = seg.y + Math.sin(seg.angle + Math.PI/2) * currentRibLength * 0.5;
            const endX1 = seg.x + Math.cos(ribAngle1 + offset) * currentRibLength;
            const endY1 = seg.y + Math.sin(ribAngle1 + offset) * currentRibLength;
            ctx.quadraticCurveTo(cpX1, cpY1, endX1, endY1);
            
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 - j * 0.1})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Right fin curve
            ctx.beginPath();
            ctx.moveTo(seg.x, seg.y);
            const cpX2 = seg.x + Math.cos(seg.angle - Math.PI/2) * currentRibLength * 0.5;
            const cpY2 = seg.y + Math.sin(seg.angle - Math.PI/2) * currentRibLength * 0.5;
            const endX2 = seg.x + Math.cos(ribAngle2 - offset) * currentRibLength;
            const endY2 = seg.y + Math.sin(ribAngle2 - offset) * currentRibLength;
            ctx.quadraticCurveTo(cpX2, cpY2, endX2, endY2);
            ctx.stroke();
          }
        }
        
        // Vertebrae (Chevron shapes)
        if (i > 0 && i % 2 === 0) {
          ctx.save();
          ctx.translate(seg.x, seg.y);
          ctx.rotate(seg.angle);
          
          const size = 8 - (i / numSegments) * 6;
          
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(-size, size);
          ctx.lineTo(-size * 1.5, size * 0.8);
          ctx.lineTo(-size * 0.5, 0);
          ctx.lineTo(-size * 1.5, -size * 0.8);
          ctx.lineTo(-size, -size);
          ctx.closePath();
          
          // Gradient for vertebrae
          const grad = ctx.createLinearGradient(-size * 1.5, 0, 0, 0);
          grad.addColorStop(0, 'rgba(100, 100, 100, 0.8)');
          grad.addColorStop(1, 'rgba(255, 255, 255, 0.9)');
          
          ctx.fillStyle = grad;
          ctx.fill();
          ctx.restore();
        }
      }

      // Draw head
      ctx.save();
      ctx.translate(head.x, head.y);
      ctx.rotate(head.angle);
      
      // Head shape
      ctx.beginPath();
      ctx.moveTo(20, 0); // Snout
      ctx.lineTo(5, 12); // Right cheek
      ctx.lineTo(-10, 8); // Right back
      ctx.lineTo(-5, 0); // Neck center
      ctx.lineTo(-10, -8); // Left back
      ctx.lineTo(5, -12); // Left cheek
      ctx.closePath();
      
      // Head gradient
      const headGrad = ctx.createLinearGradient(-10, 0, 20, 0);
      headGrad.addColorStop(0, 'rgba(50, 50, 50, 1)');
      headGrad.addColorStop(1, 'rgba(200, 200, 200, 1)');
      
      ctx.fillStyle = headGrad;
      ctx.fill();
      
      // Eyes
      ctx.beginPath();
      ctx.arc(8, 5, 2.5, 0, Math.PI * 2);
      ctx.arc(8, -5, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#000';
      ctx.fill();
      
      // Eye glow
      ctx.beginPath();
      ctx.arc(8.5, 4.5, 0.8, 0, Math.PI * 2);
      ctx.arc(8.5, -5.5, 0.8, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      
      ctx.restore();

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.4 }}
    />
  );
};
