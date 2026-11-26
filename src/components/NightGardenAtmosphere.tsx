import type { CSSProperties } from 'react';
import { motion } from 'motion/react';
import { WEDDING_IMAGES } from '../data/weddingData';

interface StarPoint {
  top: string;
  left: string;
  size: number;
  duration: string;
  delay: string;
  gold?: boolean;
}

const STAR_POINTS: StarPoint[] = [
  { top: '6%', left: '14%', size: 2, duration: '3.6s', delay: '0s' },
  { top: '11%', left: '78%', size: 2.5, duration: '4.4s', delay: '0.8s', gold: true },
  { top: '18%', left: '28%', size: 1.5, duration: '5.1s', delay: '1.4s' },
  { top: '24%', left: '86%', size: 2, duration: '3.8s', delay: '0.3s' },
  { top: '31%', left: '9%', size: 2.5, duration: '4.7s', delay: '2.1s', gold: true },
  { top: '37%', left: '64%', size: 1.5, duration: '4.2s', delay: '1.1s' },
  { top: '44%', left: '21%', size: 2, duration: '5.4s', delay: '0.5s' },
  { top: '52%', left: '91%', size: 2.5, duration: '3.9s', delay: '1.7s', gold: true },
  { top: '59%', left: '42%', size: 1.5, duration: '4.6s', delay: '2.5s' },
  { top: '66%', left: '12%', size: 2, duration: '5.0s', delay: '0.9s' },
  { top: '73%', left: '75%', size: 2.5, duration: '4.1s', delay: '1.9s', gold: true },
  { top: '81%', left: '33%', size: 1.5, duration: '3.7s', delay: '0.2s' },
  { top: '88%', left: '84%', size: 2, duration: '4.9s', delay: '1.3s' },
  { top: '93%', left: '19%', size: 2.5, duration: '4.3s', delay: '2.2s', gold: true },
];

export function StarrySkyLayer({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none absolute inset-0 overflow-hidden ${className}`}
    >
      {STAR_POINTS.map((star, idx) => {
        const style: CSSProperties & {
          '--twinkle-duration': string;
          '--twinkle-delay': string;
        } = {
          top: star.top,
          left: star.left,
          width: `${star.size}px`,
          height: `${star.size}px`,
          '--twinkle-duration': star.duration,
          '--twinkle-delay': star.delay,
        };
        return (
          <span
            key={idx}
            style={style}
            className={`animate-star-twinkle absolute rounded-full ${
              star.gold
                ? 'bg-[#E6C487] shadow-[0_0_6px_rgba(230,196,135,0.75)]'
                : 'bg-[#E9E1DA]/85 shadow-[0_0_4px_rgba(233,225,218,0.5)]'
            }`}
          />
        );
      })}
    </div>
  );
}

const DRIFTING_LEAVES = [
  { left: '12%', top: '8%', delay: 0, duration: 9, size: 7, gold: true },
  { left: '84%', top: '12%', delay: 2.1, duration: 10.5, size: 6, gold: false },
  { left: '24%', top: '18%', delay: 4.2, duration: 11, size: 5, gold: true },
  { left: '72%', top: '6%', delay: 1.4, duration: 9.5, size: 7, gold: false },
  { left: '9%', top: '42%', delay: 3.3, duration: 10, size: 6, gold: true },
  { left: '88%', top: '48%', delay: 5.0, duration: 11.5, size: 5, gold: false },
];

export function DriftingLeavesLayer() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none select-none absolute inset-0 overflow-hidden"
    >
      {DRIFTING_LEAVES.map((leaf, i) => (
        <motion.span
          key={i}
          style={{
            left: leaf.left,
            top: leaf.top,
            width: leaf.size,
            height: leaf.size * 1.4,
          }}
          initial={{ opacity: 0, y: 0, x: 0, rotate: 0 }}
          animate={{
            opacity: [0, 0.75, 0.55, 0],
            y: [0, 90, 180, 260],
            x: [0, i % 2 === 0 ? 18 : -18, i % 2 === 0 ? -8 : 10, i % 2 === 0 ? 22 : -22],
            rotate: [0, 65, 130, 210],
          }}
          transition={{
            duration: leaf.duration,
            delay: leaf.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className={`absolute rounded-full ${
            leaf.gold ? 'bg-[#C9A96E]/65' : 'bg-[#A6A098]/55'
          }`}
        />
      ))}
    </div>
  );
}

/**
 * Keeps the gold arch line and classical pillars 100% static on the base layer,
 * while swaying only the corner foliage overlays and delicate botanical branches.
 */
export function AnimatedBackgroundWithTrees({
  src = WEDDING_IMAGES.heroBackdrop,
  alt = 'Langit malam berbintang dengan pepohonan berayun, bingkai lengkung emas, dan reruntuhan klasik',
  opacityClass = 'opacity-95',
}: {
  src?: string;
  alt?: string;
  opacityClass?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none select-none absolute inset-0 overflow-hidden"
    >
      {/* Static Base Layer: gold arch border, stars, and classical ruins stay completely still */}
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        className={`w-full h-full object-cover object-center ${opacityClass}`}
      />

      {/* Top-left foliage clusters strictly outside/over leaves (away from arch curve) */}
      <motion.div
        style={{
          transformOrigin: '0% 0%',
          WebkitMaskImage:
            'radial-gradient(ellipse 30% 18% at 10% 4%, #000 50%, transparent 92%)',
          maskImage:
            'radial-gradient(ellipse 30% 18% at 10% 4%, #000 50%, transparent 92%)',
        }}
        animate={{
          rotate: [-1.5, 3.2, -1.5],
          x: [-2, 6, -2],
          y: [0, 3, 0],
        }}
        transition={{
          duration: 5.8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 scale-[1.03]"
      >
        <img
          src={src}
          alt=""
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover object-center ${opacityClass}`}
        />
      </motion.div>

      {/* Top-right foliage clusters strictly outside arch curve */}
      <motion.div
        style={{
          transformOrigin: '100% 0%',
          WebkitMaskImage:
            'radial-gradient(ellipse 30% 18% at 90% 4%, #000 50%, transparent 92%)',
          maskImage:
            'radial-gradient(ellipse 30% 18% at 90% 4%, #000 50%, transparent 92%)',
        }}
        animate={{
          rotate: [1.5, -3.2, 1.5],
          x: [2, -6, 2],
          y: [0, 3, 0],
        }}
        transition={{
          duration: 6.4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 scale-[1.03]"
      >
        <img
          src={src}
          alt=""
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover object-center ${opacityClass}`}
        />
      </motion.div>

      {/* Swaying layered botanical canopies in all 4 corners (independent of the static gold arch line) */}
      <AnimatedTreeCanopy position="both" />
      <StarrySkyLayer />
      <DriftingLeavesLayer />
    </div>
  );
}

export function AnimatedTreeCanopy({
  position = 'top',
}: {
  position?: 'top' | 'bottom' | 'both';
}) {
  const showTop = position === 'top' || position === 'both';
  const showBottom = position === 'bottom' || position === 'both';

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none select-none absolute inset-0 overflow-hidden"
    >
      {showTop && (
        <>
          <svg
            viewBox="0 0 240 240"
            fill="none"
            className="animate-sway-left absolute -top-3 -left-4 w-52 sm:w-64 opacity-75"
          >
            <path
              d="M-10 12 C38 35, 78 60, 132 76 M44 38 C60 68, 68 94, 64 124 M88 58 C114 46, 140 38, 168 42"
              stroke="#7A756D"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <ellipse cx="44" cy="58" rx="22" ry="13" transform="rotate(-18 44 58)" fill="#58534C" fillOpacity="0.7" />
            <ellipse cx="78" cy="38" rx="24" ry="14" transform="rotate(14 78 38)" fill="#706B63" fillOpacity="0.65" />
            <ellipse cx="114" cy="60" rx="21" ry="12" transform="rotate(-10 114 60)" fill="#49453F" fillOpacity="0.72" />
            <ellipse cx="58" cy="98" rx="19" ry="11" transform="rotate(28 58 98)" fill="#66615A" fillOpacity="0.65" />
            <ellipse cx="146" cy="42" rx="17" ry="10" transform="rotate(8 146 42)" fill="#8B857C" fillOpacity="0.55" />
            <ellipse cx="30" cy="112" rx="16" ry="10" transform="rotate(-24 30 112)" fill="#5E5952" fillOpacity="0.6" />
            <circle cx="96" cy="76" r="2.5" fill="#C9A96E" fillOpacity="0.75" />
          </svg>

          <svg
            viewBox="0 0 240 240"
            fill="none"
            className="animate-sway-right absolute -top-3 -right-4 w-52 sm:w-64 opacity-75"
          >
            <path
              d="M250 14 C198 38, 156 62, 102 78 M192 42 C176 72, 168 98, 172 128 M146 62 C120 50, 94 42, 66 46"
              stroke="#7A756D"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <ellipse cx="192" cy="60" rx="22" ry="13" transform="rotate(18 192 60)" fill="#58534C" fillOpacity="0.7" />
            <ellipse cx="156" cy="40" rx="24" ry="14" transform="rotate(-14 156 40)" fill="#706B63" fillOpacity="0.65" />
            <ellipse cx="120" cy="62" rx="20" ry="12" transform="rotate(12 120 62)" fill="#49453F" fillOpacity="0.72" />
            <ellipse cx="176" cy="102" rx="18" ry="11" transform="rotate(-24 176 102)" fill="#66615A" fillOpacity="0.65" />
            <ellipse cx="88" cy="46" rx="16" ry="9" transform="rotate(-8 88 46)" fill="#8B857C" fillOpacity="0.55" />
            <circle cx="194" cy="86" r="5" fill="#C9A96E" fillOpacity="0.6" />
            <circle cx="138" cy="76" r="2.5" fill="#E6C487" fillOpacity="0.75" />
          </svg>
        </>
      )}

      {showBottom && (
        <>
          <svg
            viewBox="0 0 240 190"
            fill="none"
            className="animate-sway-bottom-left absolute -bottom-3 -left-3 w-52 sm:w-64 opacity-70"
          >
            <path
              d="M-8 184 C32 148, 74 126, 124 118 M40 150 C62 124, 76 104, 80 80"
              stroke="#7A756D"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <ellipse cx="42" cy="134" rx="22" ry="13" transform="rotate(-22 42 134)" fill="#5A554E" fillOpacity="0.7" />
            <ellipse cx="80" cy="146" rx="24" ry="13" transform="rotate(10 80 146)" fill="#706B63" fillOpacity="0.65" />
            <ellipse cx="78" cy="100" rx="18" ry="11" transform="rotate(-35 78 100)" fill="#4A4540" fillOpacity="0.72" />
            <ellipse cx="114" cy="122" rx="18" ry="10" transform="rotate(-8 114 122)" fill="#827C73" fillOpacity="0.55" />
            <circle cx="66" cy="118" r="2.5" fill="#C9A96E" fillOpacity="0.7" />
          </svg>

          <svg
            viewBox="0 0 240 190"
            fill="none"
            className="animate-sway-bottom-right absolute -bottom-3 -right-3 w-52 sm:w-64 opacity-70"
          >
            <path
              d="M248 184 C208 148, 166 126, 116 118 M200 150 C178 124, 164 104, 160 80"
              stroke="#7A756D"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <ellipse cx="198" cy="134" rx="22" ry="13" transform="rotate(22 198 134)" fill="#5A554E" fillOpacity="0.7" />
            <ellipse cx="160" cy="146" rx="24" ry="13" transform="rotate(-10 160 146)" fill="#706B63" fillOpacity="0.65" />
            <ellipse cx="162" cy="100" rx="18" ry="11" transform="rotate(35 162 100)" fill="#4A4540" fillOpacity="0.72" />
            <ellipse cx="126" cy="122" rx="18" ry="10" transform="rotate(8 126 122)" fill="#827C73" fillOpacity="0.55" />
            <circle cx="174" cy="118" r="2.5" fill="#C9A96E" fillOpacity="0.7" />
          </svg>
        </>
      )}
    </div>
  );
}
