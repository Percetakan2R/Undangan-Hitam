import { motion } from 'motion/react';
import { Mail } from 'lucide-react';
import { COUPLE_INFO, WEDDING_IMAGES } from '../data/weddingData';
import { SmartImage } from './SmartImage';
import { AnimatedBackgroundWithTrees } from './NightGardenAtmosphere';

interface CoverScreenProps {
  guestName: string;
  onOpen: () => void;
}

export function CoverScreen({ guestName, onOpen }: CoverScreenProps) {
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
        {/* Top Oval Couple Portrait */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.2, 0, 0, 1] }}
          className="pt-4 flex flex-col items-center"
        >
          <div className="w-48 sm:w-52 aspect-[3/4] rounded-full overflow-hidden border border-[#E9E1DA]/50 bg-[#100E0A] shadow-2xl">
            <SmartImage
              src={WEDDING_IMAGES.coverCouple}
              alt="Ilustrasi kartun mempelai Rafi dan Alesha dalam busana pengantin hitam"
              loading="eager"
              fallbackLabel="Rafi & Alesha"
              className="w-full h-full object-cover object-top"
            />
          </div>
        </motion.div>

        {/* Couple Title & Guest Greeting */}
        <section className="w-full flex flex-col items-center text-center gap-6 my-6">
          <div className="flex flex-col items-center gap-1.5">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="font-body text-sm text-[#D0C5B5] tracking-wider"
            >
              The Wedding of
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 14, letterSpacing: '0.12em' }}
              animate={{ opacity: 1, y: 0, letterSpacing: '0.06em' }}
              transition={{ duration: 0.7, delay: 0.22, ease: [0.2, 0, 0, 1] }}
              className="font-display text-4xl sm:text-[42px] leading-tight uppercase text-gold-shimmer text-balance"
            >
              {COUPLE_INFO.groomShort} &amp; {COUPLE_INFO.brideShort}
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
