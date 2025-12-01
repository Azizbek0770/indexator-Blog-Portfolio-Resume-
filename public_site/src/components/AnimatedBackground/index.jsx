import React, { useEffect, useRef } from 'react';

const AnimatedBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    const linkDistance = 100;
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.fillStyle = `rgba(59, 130, 246, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const createParticles = () => {
      const baseCount = Math.floor((canvas.width * canvas.height) / 15000);
      const maxCount = prefersReduced ? 60 : 160;
      const particleCount = Math.min(maxCount, baseCount);
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };
    createParticles();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      const cellSize = linkDistance;
      const grid = new Map();
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const gx = Math.floor(p.x / cellSize);
        const gy = Math.floor(p.y / cellSize);
        const key = gx + ',' + gy;
        let arr = grid.get(key);
        if (!arr) {
          arr = [];
          grid.set(key, arr);
        }
        arr.push(i);
      }

      const neighbors = [-1, 0, 1];
      const maxDistSq = linkDistance * linkDistance;
      for (const [key, indices] of grid.entries()) {
        const [gxStr, gyStr] = key.split(',');
        const gx = parseInt(gxStr, 10);
        const gy = parseInt(gyStr, 10);
        for (const ix of neighbors) {
          for (const iy of neighbors) {
            const nk = (gx + ix) + ',' + (gy + iy);
            const other = grid.get(nk);
            if (!other) continue;
            for (let a = 0; a < indices.length; a++) {
              const i = indices[a];
              for (let b = 0; b < other.length; b++) {
                const j = other[b];
                if (j <= i) continue;
                const p = particles[i];
                const q = particles[j];
                const dx = p.x - q.x;
                const dy = p.y - q.y;
                const distSq = dx * dx + dy * dy;
                if (distSq < maxDistSq) {
                  const t = 1 - Math.sqrt(distSq) / linkDistance;
                  ctx.strokeStyle = `rgba(59, 130, 246, ${0.2 * t})`;
                  ctx.lineWidth = 1;
                  ctx.beginPath();
                  ctx.moveTo(p.x, p.y);
                  ctx.lineTo(q.x, q.y);
                  ctx.stroke();
                }
              }
            }
          }
        }
      }

      if (!prefersReduced) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default AnimatedBackground;
