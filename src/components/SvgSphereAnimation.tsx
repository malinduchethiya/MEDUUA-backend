import React, { useEffect, useRef } from 'react';
import animeImport from 'animejs';

const anime: any = (animeImport as any).default || animeImport;

/**
 * Generates the 20 layered 3D cross-sectional SVG paths of the CodePen
 * "SVG sphere animation with anime.js" (by Julian Garnier) in a 440x440 viewBox.
 * Each slice lies along the diagonal axis from bottom-right (361.6, 361.2) to top-left (78.4, 78.8)
 * with organic harmonic wave contours across the 20 cross-sections.
 */
const SPHERE_PATHS: string[] = Array.from({ length: 20 }, (_, idx) => {
  const total = 20;
  // Normalized slice position u in [-0.94, +0.94] from bottom-right to top-left
  const t = idx / (total - 1);
  const u = 0.925 - t * 1.85;

  const R = 196; // Sphere outer radius inside 440x440 viewBox
  const d = u * R; // Signed distance along the (1, 1)/sqrt(2) axis
  const sliceRadius = Math.sqrt(Math.max(12, R * R - d * d));

  // Center of this cross-sectional slice in SVG coordinates
  const invSqrt2 = Math.SQRT1_2;
  const cx = 220 + d * invSqrt2;
  const cy = 220 + d * invSqrt2;

  // Major semi-axis (perpendicular to diagonal: (-1, 1)/sqrt(2))
  const majorA = sliceRadius;
  // Minor semi-axis (foreshortened 3D tilt along diagonal: (1, 1)/sqrt(2))
  const minorB = sliceRadius * 0.36;

  // Envelope for organic multi-lobe harmonic undulation (strongest in middle slices, subtle at poles)
  const envelope = Math.sin(t * Math.PI);
  const numSamples = 64;
  const pts: Array<{ x: number; y: number }> = [];

  for (let k = 0; k < numSamples; k++) {
    const theta = (k / numSamples) * Math.PI * 2;

    // Harmonic surface waves matching the sculpted CodePen sphere rings
    const wave1 = Math.sin(theta * 5 + idx * 0.55) * 6.8 * Math.pow(envelope, 1.35);
    const wave2 = Math.cos(theta * 3 - idx * 0.4) * 4.2 * envelope;
    const wave3 = Math.sin(theta * 8 + idx * 0.85) * 2.4 * Math.pow(envelope, 1.8);

    const localMajor = (majorA + wave1 + wave3) * Math.cos(theta);
    const localMinor = (minorB + wave2 + wave1 * 0.45) * Math.sin(theta);

    // Rotate by -45 degrees: major axis along (-1, 1)/sqrt(2), minor axis along (1, 1)/sqrt(2)
    const x = cx - localMajor * invSqrt2 + localMinor * invSqrt2;
    const y = cy + localMajor * invSqrt2 + localMinor * invSqrt2;

    pts.push({ x, y });
  }

  // Convert closed sample ring into smooth cubic Catmull-Rom -> Bezier SVG path
  let pathData = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  for (let k = 0; k < numSamples; k++) {
    const p0 = pts[(k - 1 + numSamples) % numSamples];
    const p1 = pts[k];
    const p2 = pts[(k + 1) % numSamples];
    const p3 = pts[(k + 2) % numSamples];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    pathData += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }

  return `${pathData} Z`;
});

export const SvgSphereAnimation: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const gradientRef = useRef<SVGLinearGradientElement | null>(null);

  useEffect(() => {
    const svgEl = svgRef.current;
    const gradientEl = gradientRef.current;
    if (!svgEl || !gradientEl) return;

    const spherePathEls = Array.from(svgEl.querySelectorAll('.sphere path')) as SVGPathElement[];
    const pathLength = spherePathEls.length;
    const animations: any[] = [];

    // 1. Create individual paused path animations sought by the breathing loop
    spherePathEls.forEach((pathEl, i) => {
      animations.push(
        anime({
          targets: pathEl,
          stroke: {
            value: ['rgba(255,75,75,1)', 'rgba(80,80,80,.35)'],
            duration: 500,
          },
          translateX: [2, -4],
          translateY: [2, -4],
          easing: 'easeOutQuad',
          autoplay: false,
        })
      );
    });

    // 2. Continuous sine-wave breathing loop (CodePen breathAnimation)
    const breathAnimation = anime({
      begin: () => {
        for (let i = 0; i < pathLength; i++) {
          const anim = animations[i];
          if (anim) anim.play();
        }
      },
      update: (ins: any) => {
        spherePathEls.forEach((_pathEl, i) => {
          const percent = (1 - Math.sin(i * 0.35 + 0.0022 * ins.currentTime)) / 2;
          const anim = animations[i];
          if (anim) {
            anim.seek(anim.duration * percent);
          }
        });
      },
      duration: Infinity,
      autoplay: false,
    });

    // 3. Intro stroke-dashoffset draw-in timeline (CodePen introAnimation)
    const introAnimation = anime
      .timeline({
        autoplay: false,
      })
      .add(
        {
          targets: spherePathEls,
          strokeDashoffset: {
            value: [anime.setDashoffset, 0],
            duration: 3900,
            easing: 'easeInOutCirc',
            delay: anime.stagger(190, { direction: 'reverse' }),
          },
          duration: 2000,
          delay: anime.stagger(60, { direction: 'reverse' }),
          easing: 'linear',
        },
        0
      );

    // 4. Gradient lighting shift animation (CodePen shadowAnimation)
    const shadowAnimation = anime(
      {
        targets: gradientEl,
        x1: '25%',
        x2: '25%',
        y1: '0%',
        y2: '75%',
        duration: 30000,
        easing: 'easeOutQuint',
        autoplay: false,
      },
      0
    );

    // Initialize and play exactly as in the CodePen demo
    introAnimation.play();
    breathAnimation.play();
    shadowAnimation.play();

    return () => {
      breathAnimation.pause();
      introAnimation.pause();
      shadowAnimation.pause();
      anime.remove(spherePathEls);
      anime.remove(gradientEl);
    };
  }, []);

  return (
    <div className="sphere-animation relative flex items-center justify-center w-full max-w-[540px] aspect-square mx-auto select-none">
      {/* Subtle ambient glow behind the 3D sphere */}
      <div
        className="absolute inset-8 rounded-full pointer-events-none opacity-45 blur-3xl"
        style={{
          background:
            'radial-gradient(circle at 38% 38%, rgba(255, 75, 75, 0.22), rgba(201, 166, 107, 0.14) 48%, transparent 75%)',
        }}
      />

      <svg
        ref={svgRef}
        className="sphere w-full h-full overflow-visible drop-shadow-[0_28px_60px_rgba(0,0,0,0.75)]"
        viewBox="0 0 440 440"
        stroke="rgba(80,80,80,.35)"
        strokeWidth="1"
        fillRule="evenodd"
        strokeLinecap="square"
      >
        <defs>
          <linearGradient
            ref={gradientRef}
            id="sphereGradient"
            x1="5%"
            x2="5%"
            y1="0%"
            y2="15%"
          >
            <stop stopColor="#373734" offset="0%" />
            <stop stopColor="#242423" offset="50%" />
            <stop stopColor="#0D0D0C" offset="100%" />
          </linearGradient>
        </defs>
        <g className="sphere">
          {SPHERE_PATHS.map((d, index) => (
            <path key={index} fill="url(#sphereGradient)" d={d} />
          ))}
        </g>
      </svg>
    </div>
  );
};

export default SvgSphereAnimation;
