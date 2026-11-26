import { motion, useReducedMotion } from 'motion/react';
import { Mail } from 'lucide-react';
import { COUPLE_INFO, WEDDING_IMAGES } from '../data/weddingData';
import { SmartImage } from './SmartImage';
import { AnimatedBackgroundWithTrees } from './NightGardenAtmosphere';

interface CoverScreenProps {
  guestName: string;
  onOpen: () => void;
}

export function CoverScreen({ guestName, onOpen }: CoverScreenProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -24, transition: { duration: 0.4, ease: [0.2, 0, 0, 1] } }}
      className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-between px-6 py-10 bg-[#080706]"
    >
      {/* Atmospheric Starry Arch Backdrop with Moving Background Trees */}
      <div className="absolute inset-0 flex justify-center pointer-events-none select-none">
        <div className="relative w-full max-w-md h-full">
          <AnimatedBackgroundWithTrees
            src={WEDDING_IMAGES.coverBackdrop}
            alt="Langit malam berbintang dengan pepohonan berayun, bingkai lengkung emas, dan reruntuhan klasik"
          />
          <div
            aria-hidden="true"
            className="hidden md:block absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#080706] to-transparent"
          />
          <div
            aria-hidden="true"
            className="hidden md:block absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#080706] to-transparent"
          />
        </div>
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-[#080706]/30 via-transparent to-[#080706]/70 pointer-events-none"
      />

      {/* Centered Editorial Frame */}
      <div className="relative z-10 w-full max-w-md mx-auto flex-1 flex flex-col items-center justify-between py-4">
        {/* Top Oval Child Portrait (Static Frame & Background, Articulated Living Character) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.2, 0, 0, 1] }}
          className="pt-4 flex flex-col items-center"
        >
          <div className="relative w-48 sm:w-52 aspect-[3/4] rounded-full overflow-hidden border border-[#E9E1DA]/55 bg-[#100E0A] shadow-2xl">
            {/* Static Garden & Lantern Background */}
            <SmartImage
              src={WEDDING_IMAGES.coverBgOnly}
              alt="Taman malam berbintang dengan lentera emas"
              loading="eager"
              fallbackLabel="Taman Malam"
              className="absolute inset-0 w-full h-full object-cover object-top pointer-events-none select-none"
            />

            {/* Character Layer 1: Legs anchored on stone pathway */}
            <img
              src={WEDDING_IMAGES.coverBoyLegs}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover object-top pointer-events-none select-none"
            />

            {/* Character Layer 2: Upper Torso + Head hierarchy pivoting at waist */}
            <motion.div
              animate={
                prefersReducedMotion
                  ? undefined
                  : {
                      rotate: [-1.5, 2, -1.5],
                      y: [0, -3.5, 0],
                      scaleY: [1, 1.018, 1],
                    }
              }
              transition={{
                duration: 3.6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{ transformOrigin: '50.8% 68%' }}
              className="absolute inset-0 w-full h-full pointer-events-none select-none"
            >
              <img
                src={WEDDING_IMAGES.coverBoyTorso}
                alt="Ilustrasi kartun Ananda Muhammad Rafi Pratama dalam busana koko hitam emas dan peci"
                className="absolute inset-0 w-full h-full object-cover object-top"
              />

              {/* Character Layer 3: Head + Peci pivoting at neck with natural eye blink */}
              <motion.div
                animate={
                  prefersReducedMotion
                    ? undefined
                    : {
                        rotate: [-4, 4.5, -4],
                        y: [0, -2.5, 0],
                      }
                }
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{ transformOrigin: '50.8% 37.2%' }}
                className="absolute inset-0 w-full h-full"
              >
                <img
                  src={WEDDING_IMAGES.coverBoyHead}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />

                {/* Blinking Eyelids synchronized in head SVG coordinate space (896x1200) */}
                {!prefersReducedMotion && (
                  <svg
                    viewBox="0 0 896 1200"
                    preserveAspectRatio="xMidYMin slice"
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full pointer-events-none"
                  >
                    {/* Left Eye Blink */}
                    <motion.g
                      animate={{
                        opacity: [0, 0, 1, 1, 0],
                      }}
                      transition={{
                        duration: 3.8,
                        times: [0, 0.87, 0.9, 0.94, 0.97],
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    >
                      <ellipse cx="409" cy="360" rx="22" ry="14" fill="#c17344" />
                      <path
                        d="M388 361 Q409 371 430 361"
                        fill="none"
                        stroke="#2b170e"
                        strokeWidth="4.5"
                        strokeLinecap="round"
                      />
                    </motion.g>

                    {/* Right Eye Blink */}
                    <motion.g
                      animate={{
                        opacity: [0, 0, 1, 1, 0],
                      }}
                      transition={{
                        duration: 3.8,
                        times: [0, 0.87, 0.9, 0.94, 0.97],
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    >
                      <ellipse cx="505" cy="359" rx="22" ry="14" fill="#c17344" />
                      <path
                        d="M484 360 Q505 370 526 360"
                        fill="none"
                        stroke="#2b170e"
                        strokeWidth="4.5"
                        strokeLinecap="round"
                      />
                    </motion.g>
                  </svg>
                )}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Event Title & Guest Greeting */}
        <section className="w-full flex flex-col items-center text-center gap-6 my-6">
          <div className="flex flex-col items-center gap-1.5">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="font-body text-sm text-[#D0C5B5] tracking-wider"
            >
              Walimatul Khitan
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 14, letterSpacing: '0.12em' }}
              animate={{ opacity: 1, y: 0, letterSpacing: '0.06em' }}
              transition={{ duration: 0.7, delay: 0.22, ease: [0.2, 0, 0, 1] }}
              className="font-display text-3xl sm:text-[40px] leading-tight uppercase text-gold-shimmer text-balance"
            >
              Ananda {COUPLE_INFO.childShort}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.34 }}
              className="font-mono text-xs tracking-[0.2em] text-[#E6C487] tabular-nums pt-1"
            >
              {COUPLE_INFO.dateDisplay}
            </motion.p>
          </div>

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-16 h-px bg-[#C9A96E]/60"
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex flex-col items-center gap-1.5"
          >
            <p className="font-body text-xs text-[#D0C5B5] tracking-wide">
              Kepada Yth. Bapak/Ibu/Saudara/i
            </p>
            <p className="font-title text-lg font-semibold text-[#E9E1DA] tracking-wide max-w-xs text-balance">
              {guestName}
            </p>
          </motion.div>

          <motion.button
            type="button"
            onClick={onOpen}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center justify-center gap-2.5 min-h-[46px] rounded-full border border-[#C9A96E] bg-[#100E0A]/85 text-[#E9E1DA] px-7 py-2.5 font-label text-xs font-semibold tracking-[0.12em] uppercase whitespace-nowrap shrink-0 transition-colors duration-150 ease-out hover:bg-[#221F1B] hover:border-[#E6C487] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E]"
          >
            <Mail className="w-4 h-4 text-[#E6C487]" aria-hidden="true" />
            <span>Buka Undangan</span>
          </motion.button>
        </section>

        {/* Bottom Breathing Room */}
        <div className="h-8 w-full pointer-events-none" aria-hidden="true" />
      </div>
    </motion.main>
  );
}
