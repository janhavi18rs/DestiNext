import { Plane, Search } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface HeroProps {
  onSearchClick: () => void;
}

export default function Hero({ onSearchClick }: HeroProps) {
  const [isHovered, setIsHovered] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    let animationFrameId: number;
    let rotation = 0;

    const drawGlobe = (x: number, y: number, radius: number) => {
      ctx.save();
      ctx.translate(x, y);

      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = 35;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 12;

      const oceanGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
      oceanGradient.addColorStop(0, '#1e90ff');
      oceanGradient.addColorStop(0.5, '#0077be');
      oceanGradient.addColorStop(1, '#004e89');

      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fillStyle = oceanGradient;
      ctx.fill();

      ctx.shadowColor = 'transparent';

      const drawContinents = () => {
        ctx.fillStyle = '#2d5016';
        ctx.strokeStyle = '#1a3d0a';
        ctx.lineWidth = 1;

        const continentData = [
          { lat: 45, lng: 0 + rotation * 0.5, size: 0.35 },
          { lat: -30, lng: 45 + rotation * 0.5, size: 0.25 },
          { lat: 20, lng: 120 + rotation * 0.5, size: 0.3 },
          { lat: -45, lng: 160 + rotation * 0.5, size: 0.28 },
          { lat: 30, lng: 240 + rotation * 0.5, size: 0.22 },
          { lat: -10, lng: 280 + rotation * 0.5, size: 0.2 },
        ];

        continentData.forEach((continent) => {
          const lat = (continent.lat * Math.PI) / 180;
          const lng = (continent.lng * Math.PI) / 180;

          const x = Math.cos(lat) * Math.sin(lng) * radius;
          const y = Math.sin(lat) * radius;
          const size = continent.size * radius;

          ctx.beginPath();
          ctx.ellipse(x, y, size, size * 0.7, Math.random() * 0.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#4a7c2c';
          const detailSize = size * 0.3;
          ctx.beginPath();
          ctx.ellipse(x + size * 0.3, y - size * 0.2, detailSize, detailSize * 0.6, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#2d5016';
        });
      };

      drawContinents();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1.5;

      for (let i = -90; i <= 90; i += 45) {
        const latRadius = Math.cos((i * Math.PI) / 180) * radius;
        const latY = Math.sin((i * Math.PI) / 180) * radius;

        ctx.beginPath();
        ctx.ellipse(0, latY, latRadius, 3, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (let i = 0; i < 360; i += 45) {
        const angle = ((i + rotation * 0.3) * Math.PI) / 180;
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
        ctx.lineTo(-Math.cos(angle) * radius, -Math.sin(angle) * radius);
        ctx.stroke();
      }

      const highlight = ctx.createRadialGradient(-radius * 0.3, -radius * 0.3, 0, 0, 0, radius * 0.8);
      highlight.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
      highlight.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
      highlight.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = highlight;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const drawAirplane = (x: number, y: number, angle: number, scale: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.scale(scale, scale);

      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.moveTo(-35, 0);
      ctx.lineTo(35, 0);
      ctx.lineTo(40, -4);
      ctx.lineTo(40, 4);
      ctx.lineTo(35, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-8, 0);
      ctx.lineTo(-3, -25);
      ctx.lineTo(3, -25);
      ctx.lineTo(8, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-28, 0);
      ctx.lineTo(-35, 12);
      ctx.lineTo(-30, 12);
      ctx.lineTo(-22, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-2, 0);
      ctx.lineTo(-8, 8);
      ctx.lineTo(-4, 8);
      ctx.lineTo(2, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ff4444';
      ctx.beginPath();
      ctx.arc(0, -2, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(-5, -3, 10, 6);

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-3, -2);
      ctx.lineTo(8, -2);
      ctx.stroke();

      ctx.shadowColor = 'transparent';

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#1a1a2e');
      gradient.addColorStop(0.5, '#16213e');
      gradient.addColorStop(1, '#0f3460');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const globeRadius = Math.min(canvas.width, canvas.height) * 0.15;

      drawGlobe(centerX, centerY, globeRadius);

      const orbitRadius = globeRadius * 2.2;
      const planeAngle = (rotation * Math.PI) / 180;

      const planeX = centerX + Math.cos(planeAngle) * orbitRadius;
      const planeY = centerY + Math.sin(planeAngle) * orbitRadius * 0.4;

      const planeRotation = planeAngle + Math.PI / 2;
      const planeScale = 0.8 + Math.sin(planeAngle) * 0.25;

      ctx.strokeStyle = 'rgba(255, 200, 100, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, orbitRadius, orbitRadius * 0.4, 0, 0, Math.PI * 2);
      ctx.stroke();

      drawAirplane(planeX, planeY, planeRotation, planeScale);

      rotation += 0.3;

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <div className="mb-8 inline-block">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2 mb-8 inline-flex items-center gap-2 shadow-lg">
            <Plane className="w-5 h-5 text-white" />
            <span className="text-white/90 font-medium">Your Journey Begins Here</span>
          </div>
        </div>

        <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight animate-fade-in drop-shadow-lg">
          Explore the World
          <br />
          <span className="bg-gradient-to-r from-yellow-200 via-cyan-200 to-white bg-clip-text text-transparent drop-shadow-lg">
            Like Never Before
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
          Plan your dream vacation with AI-powered itineraries, budget tracking, and immersive destination guides
        </p>

        <button
          onClick={onSearchClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="group relative inline-flex items-center gap-3 bg-white text-gray-900 px-10 py-5 rounded-2xl text-lg font-semibold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
        >
          <Search className={`w-6 h-6 transition-transform duration-300 ${isHovered ? 'rotate-90' : ''}`} />
          <span>Start Planning</span>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        </button>

        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          {[
            { number: '500+', label: 'Destinations' },
            { number: '10K+', label: 'Happy Travelers' },
            { number: '4.9', label: 'Rating' },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 transform hover:scale-105 transition-all duration-300 hover:bg-white/20"
            >
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-white/80 text-sm md:text-base">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-scroll"></div>
        </div>
      </div>
    </div>
  );
}
