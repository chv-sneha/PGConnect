import { useEffect } from 'react';

const SparkleTrail = () => {
  useEffect(() => {
    const sparkles: HTMLElement[] = [];
    let mouseX = 0;
    let mouseY = 0;

    const createSparkle = (x: number, y: number) => {
      const sparkle = document.createElement('div');
      const color = 'linear-gradient(45deg, #06ffa5, #00d4aa)';
      const size = Math.random() * 8 + 4; // 4-12px
      const animationDuration = Math.random() * 0.4 + 0.8; // 0.8-1.2s
      
      sparkle.className = 'sparkle';
      sparkle.style.cssText = `
        position: fixed;
        left: ${x - size/2}px;
        top: ${y - size/2}px;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        box-shadow: 0 0 ${size*2}px ${color.split(',')[0].split('(')[1]}, 0 0 ${size*4}px ${color.split(',')[0].split('(')[1]};
        animation: sparkleAnimation ${animationDuration}s ease-out forwards;
      `;
      
      document.body.appendChild(sparkle);
      sparkles.push(sparkle);

      // Remove sparkle after animation
      setTimeout(() => {
        if (sparkle.parentNode) {
          sparkle.parentNode.removeChild(sparkle);
        }
        const index = sparkles.indexOf(sparkle);
        if (index > -1) {
          sparkles.splice(index, 1);
        }
      }, animationDuration * 1000);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Create multiple sparkles with randomness
      if (Math.random() > 0.6) {
        const numSparkles = Math.random() > 0.8 ? 2 : 1;
        for (let i = 0; i < numSparkles; i++) {
          const offsetX = (Math.random() - 0.5) * 30;
          const offsetY = (Math.random() - 0.5) * 30;
          createSparkle(mouseX + offsetX, mouseY + offsetY);
        }
      }
    };

    // Add CSS animation keyframes
    const style = document.createElement('style');
    style.textContent = `
      @keyframes sparkleAnimation {
        0% {
          opacity: 0;
          transform: scale(0) rotate(0deg) translateY(0px);
        }
        20% {
          opacity: 1;
          transform: scale(1.5) rotate(72deg) translateY(-5px);
        }
        50% {
          opacity: 0.9;
          transform: scale(1.8) rotate(180deg) translateY(-10px);
        }
        80% {
          opacity: 0.4;
          transform: scale(1.2) rotate(288deg) translateY(-15px);
        }
        100% {
          opacity: 0;
          transform: scale(0) rotate(360deg) translateY(-20px);
        }
      }
    `;
    document.head.appendChild(style);

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      // Clean up remaining sparkles
      sparkles.forEach(sparkle => {
        if (sparkle.parentNode) {
          sparkle.parentNode.removeChild(sparkle);
        }
      });
      // Remove style
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  return null;
};

export default SparkleTrail;