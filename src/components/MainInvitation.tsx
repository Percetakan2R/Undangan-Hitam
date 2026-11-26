import { useEffect, useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowDown,
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Heart,
  HelpCircle,
  MapPin,
  Music,
  QrCode,
  Reply,
  Send,
  Share2,
  Smile,
  VolumeX,
  X,
} from 'lucide-react';
import {
  COUPLE_INFO,
  GALLERY_PHOTOS,
  INITIAL_WISHES,
  WEDDING_EVENTS,
  WEDDING_IMAGES,
  WISH_STICKERS,
  type AttendanceStatus,
  type GalleryPhoto,
  type WishItem,
} from '../data/weddingData';
import { SmartImage } from './SmartImage';
import { QrCodeSvg } from './QrCodeSvg';
import { VenueMap } from './VenueMap';
import {
  AnimatedBackgroundWithTrees,
  AnimatedTreeCanopy,
  StarrySkyLayer,
} from './NightGardenAtmosphere';

interface MainInvitationProps {
  guestName: string;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  onBackToCover: () => void;
}

const STORAGE_KEY = 'khitan_rafi_wishes_v1';

interface CountdownTime {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

function getCountdown(): CountdownTime {
  const target = new Date(COUPLE_INFO.targetIso).getTime();
  const diff = Math.max(0, target - Date.now());
  const pad = (n: number) => String(n).padStart(2, '0');
  return {
    days: pad(Math.floor(diff / 86400000)),
    hours: pad(Math.floor((diff % 86400000) / 3600000)),
    minutes: pad(Math.floor((diff % 3600000) / 60000)),
    seconds: pad(Math.floor((diff % 60000) / 1000)),
  };
}

export function MainInvitation({
  guestName,
  isMusicPlaying,
  onToggleMusic,
  onBackToCover,
}: MainInvitationProps) {
  const [countdown, setCountdown] = useState<CountdownTime>(() => getCountdown());
  const [wishes, setWishes] = useState<WishItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as WishItem[];
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_WISHES;
  });

  // Form states
  const [senderName, setSenderName] = useState(
    guestName !== 'Nama Tamu' ? guestName : ''
  );
  const [attendance, setAttendance] = useState<AttendanceStatus>('Hadir');
  const [message, setMessage] = useState('');
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [submittedNotice, setSubmittedNotice] = useState(false);

  // Reply states
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyAuthor, setReplyAuthor] = useState(
    guestName !== 'Nama Tamu' ? guestName : ''
  );
  const [replyText, setReplyText] = useState('');

  // Modal & utility states
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [addressCopied, setAddressCopied] = useState(false);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [customGuestInput, setCustomGuestInput] = useState('');

  useEffect(() => {
    const id = window.setInterval(() => {
      setCountdown(getCountdown());
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));
    } catch {
      // ignore storage errors
    }
  }, [wishes]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsQrOpen(false);
        setLightboxIndex(null);
      } else if (lightboxIndex !== null) {
        if (e.key === 'ArrowRight') {
          setLightboxIndex((prev) =>
            prev === null ? null : (prev + 1) % GALLERY_PHOTOS.length
          );
        } else if (e.key === 'ArrowLeft') {
          setLightboxIndex((prev) =>
            prev === null
              ? null
              : (prev - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length
          );
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIndex]);

  const handleSubmitWish = (e: FormEvent) => {
    e.preventDefault();
    const cleanName = senderName.trim();
    const cleanMsg = message.trim();
    if (!cleanName || !cleanMsg) return;

    const nowFormatted = new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date());

    const newWish: WishItem = {
      id: `wish-${Date.now()}`,
      name: cleanName,
      attendance,
      message: cleanMsg,
      sticker: selectedSticker ?? undefined,
      date: nowFormatted,
      likes: 0,
      liked: false,
      replies: [],
    };

    setWishes((prev) => [newWish, ...prev]);
    setMessage('');
    setSelectedSticker(null);
    setShowStickerPicker(false);
    setSubmittedNotice(true);
    window.setTimeout(() => setSubmittedNotice(false), 3000);
  };

  const handleToggleLike = (id: string) => {
    setWishes((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextLiked = !item.liked;
        return {
          ...item,
          liked: nextLiked,
          likes: nextLiked ? item.likes + 1 : Math.max(0, item.likes - 1),
        };
      })
    );
  };

  const handleSubmitReply = (e: FormEvent, wishId: string) => {
    e.preventDefault();
    const author = replyAuthor.trim() || 'Tamu Undangan';
    const text = replyText.trim();
    if (!text) return;

    const nowFormatted = new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date());

    setWishes((prev) =>
      prev.map((item) =>
        item.id === wishId
          ? {
              ...item,
              replies: [
                ...item.replies,
                {
                  id: `reply-${Date.now()}`,
                  author,
                  message: text,
                  date: nowFormatted,
                },
              ],
            }
          : item
      )
    );
    setReplyText('');
    setReplyingToId(null);
  };

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(COUPLE_INFO.venueFull);
      setAddressCopied(true);
      window.setTimeout(() => setAddressCopied(false), 2200);
    } catch {
      // clipboard fallback ignored
    }
  };

  const handleCopyInviteLink = async () => {
    const targetGuest = customGuestInput.trim() || guestName;
    const url = new URL(window.location.href);
    if (targetGuest && targetGuest !== 'Nama Tamu') {
      url.searchParams.set('to', targetGuest);
    } else {
      url.searchParams.delete('to');
    }
    try {
      await navigator.clipboard.writeText(url.toString());
      setShareLinkCopied(true);
      window.setTimeout(() => setShareLinkCopied(false), 2400);
    } catch {
      // clipboard fallback ignored
    }
  };

  const activePhoto: GalleryPhoto | null =
    lightboxIndex !== null ? GALLERY_PHOTOS[lightboxIndex] : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.2, 0, 0, 1] }}
      className="relative min-h-screen w-full bg-[#100E0A] text-[#E9E1DA] overflow-x-hidden"
    >
      {/* Desktop Top Navigation Bar (3-zone contract, clean & unobtrusive on mobile) */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 z-30 h-14 items-center justify-between gap-8 px-8 bg-[#100E0A]/80 backdrop-blur-md border-b border-[#4D463A]/40">
        <a
          href="#hero-arch"
          className="font-display text-lg tracking-wider text-[#E6C487] whitespace-nowrap shrink-0"
        >
          Khitanan {COUPLE_INFO.childShort}
        </a>

        <nav
          aria-label="Navigasi Undangan"
          className="flex items-center gap-6 text-xs font-medium tracking-wider uppercase text-[#D0C5B5]"
        >
          <a
            href="#with-love"
            className="hover:text-[#E6C487] transition-colors whitespace-nowrap shrink-0"
          >
            Doa
          </a>
          <a
            href="#profil"
            className="hover:text-[#E6C487] transition-colors whitespace-nowrap shrink-0"
          >
            Profil
          </a>
          <a
            href="#rangkaian-acara"
            className="hover:text-[#E6C487] transition-colors whitespace-nowrap shrink-0"
          >
            Acara
          </a>
          <a
            href="#galeri"
            className="hover:text-[#E6C487] transition-colors whitespace-nowrap shrink-0"
          >
            Galeri
          </a>
          <a
            href="#rsvp"
            className="hover:text-[#E6C487] transition-colors whitespace-nowrap shrink-0"
          >
            RSVP
          </a>
        </nav>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onBackToCover}
            className="px-4 py-1.5 text-xs font-medium tracking-wider uppercase rounded-full border border-[#C9A96E]/60 text-[#E9E1DA] hover:bg-[#221F1B] transition-colors whitespace-nowrap shrink-0"
          >
            Sampul
          </button>
        </div>
      </header>

      {/* Floating Utility Controls (QR & Music) */}
      <aside className="fixed right-4 bottom-6 sm:right-6 sm:bottom-8 z-30 flex flex-col gap-2.5">
        <button
          type="button"
          onClick={() => setIsQrOpen(true)}
          aria-label="Tampilkan Kode QR Check-In Tamu"
          title="QR Check-In Tamu"
          className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#E9E1DA] text-[#100E0A] shadow-lg transition-transform duration-150 ease-out hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E]"
        >
          <QrCode className="w-5 h-5" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={onToggleMusic}
          aria-label={isMusicPlaying ? 'Hentikan musik latar' : 'Putar musik latar'}
          title={isMusicPlaying ? 'Musik Aktif' : 'Musik Nonaktif'}
          className={`inline-flex items-center justify-center w-11 h-11 rounded-full shadow-lg transition-all duration-150 ease-out hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E] ${
            isMusicPlaying
              ? 'bg-[#E9E1DA] text-[#100E0A] ring-2 ring-[#C9A96E]'
              : 'bg-[#221F1B] text-[#D0C5B5] border border-[#4D463A]'
          }`}
        >
          {isMusicPlaying ? (
            <Music className="w-5 h-5" aria-hidden="true" />
          ) : (
            <VolumeX className="w-5 h-5" aria-hidden="true" />
          )}
        </button>
      </aside>

      {/* Section 1: Hero Arch */}
      <section
        id="hero-arch"
        className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 py-16 md:pt-20 overflow-hidden bg-[#080706]"
      >
        <div className="absolute inset-0 flex justify-center pointer-events-none select-none">
          <div className="relative w-full max-w-md h-full">
            <AnimatedBackgroundWithTrees
              src={WEDDING_IMAGES.heroBackdrop}
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
          className="absolute inset-0 bg-gradient-to-b from-[#080706]/25 via-transparent to-[#12100D] pointer-events-none"
        />

        <div className="relative z-10 w-full max-w-sm px-8 py-12 flex flex-col items-center text-center gap-6">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-body text-sm text-[#E9E1DA] tracking-wider"
          >
            Walimatul Khitan
          </motion.p>

          <div className="flex flex-col items-center gap-1">
            <motion.span
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="font-headline text-xl sm:text-2xl text-[#C9A96E] tracking-wider"
            >
              Ananda
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 18, letterSpacing: '0.14em' }}
              whileInView={{ opacity: 1, y: 0, letterSpacing: '0.08em' }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.65, delay: 0.2, ease: [0.2, 0, 0, 1] }}
              className="font-display text-3xl sm:text-[42px] leading-tight uppercase text-gold-shimmer text-balance"
            >
              {COUPLE_INFO.childFull}
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.34 }}
            className="flex flex-col items-center gap-1.5"
          >
            <p className="font-body text-xs font-medium text-[#E9E1DA] tracking-wide">
              {COUPLE_INFO.hashtag}
            </p>
            <p className="font-mono text-sm font-semibold text-[#E9E1DA] tracking-[0.15em] tabular-nums">
              {COUPLE_INFO.dateDisplay}
            </p>
          </motion.div>

          <motion.a
            href="#with-love"
            aria-label="Gulir ke bagian doa khitanan"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: [0, 5, 0] }}
            transition={{
              opacity: { duration: 0.5, delay: 0.65 },
              y: { duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.8 },
            }}
            className="inline-flex items-center justify-center w-9 h-12 rounded-full border border-[#E9E1DA]/75 text-[#E9E1DA] transition-colors duration-150 hover:border-[#C9A96E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E]"
          >
            <ArrowDown className="w-4 h-4" aria-hidden="true" />
          </motion.a>
        </div>
      </section>

      {/* Atmospheric Starry & Botanical Night Garden Wrapper for All Lower Sections */}
      <div className="relative w-full overflow-hidden bg-gradient-to-b from-[#12100D] via-[#1B1712] to-[#110E0B]">
        {/* Continuous Starry Backdrop Texture with Moving Trees (replaces plain solid black) */}
        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,169,110,0.12)_0%,transparent_55%),radial-gradient(ellipse_at_bottom,rgba(201,169,110,0.09)_0%,transparent_55%)]" />
          <div className="mx-auto w-full max-w-md h-full flex flex-col">
            <div className="relative w-full h-1/2">
              <AnimatedBackgroundWithTrees
                src={WEDDING_IMAGES.heroBackdrop}
                alt=""
                opacityClass="opacity-45"
              />
            </div>
            <div className="relative w-full h-1/2">
              <AnimatedBackgroundWithTrees
                src={WEDDING_IMAGES.heroBackdrop}
                alt=""
                opacityClass="opacity-45"
              />
            </div>
          </div>
          <StarrySkyLayer />
        </div>

      {/* Main Content Container */}
      <main className="relative z-10 w-full max-w-md md:max-w-3xl lg:max-w-4xl mx-auto">
        {/* Section 2: With Love (QS. Ar-Rum : 21) */}
        <section
          id="with-love"
          className="relative w-full px-6 py-16 flex flex-col items-center text-center gap-6 overflow-hidden"
        >
          <AnimatedTreeCanopy position="top" />
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.55 }}
            className="relative z-10 w-56 sm:w-64 aspect-[4/3] rounded-2xl overflow-hidden border border-[#C9A96E]/45 shadow-xl"
          >
            <SmartImage
              src={WEDDING_IMAGES.withLoveTop}
              alt="Ilustrasi kartun keluarga bahagia Ananda Rafi bersama ayah dan ibu di taman malam berbintang"
              fallbackLabel="Doa & Harapan"
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.55 }}
            className="relative z-10 font-headline text-[28px] sm:text-[32px] uppercase tracking-[0.06em] text-gold-shimmer text-balance"
          >
            Doa &amp; Harapan
          </motion.h2>

          <motion.blockquote
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative z-10 font-body text-sm sm:text-base leading-relaxed text-[#E9E1DA]/90 text-pretty max-w-xl italic"
          >
            “Ya Allah, berkahilah langkah Ananda Muhammad Rafi Pratama menuju
            kedewasaan. Semoga ia tumbuh menjadi anak yang sholeh, sehat,
            cerdas, taat beribadah, serta berbakti kepada kedua orang tua,
            agama, dan bangsa.”
          </motion.blockquote>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative z-10 w-full max-w-2xl aspect-[16/9] rounded-2xl overflow-hidden mt-2 border border-[#C9A96E]/45 shadow-xl"
          >
            <SmartImage
              src={WEDDING_IMAGES.withLoveBottom}
              alt="Ilustrasi kartun Ananda Rafi di teras taman malam di bawah sinar bulan sabit dan lentera emas"
              fallbackLabel="Ananda Rafi"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </section>

        {/* Section 3: Profil Yang Dikhitan */}
        <section
          id="profil"
          className="relative w-full px-6 py-16 flex flex-col items-center text-center gap-10 border-t border-[#C9A96E]/25 overflow-hidden"
        >
          <AnimatedTreeCanopy position="bottom" />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.55 }}
            className="relative z-10 flex flex-col items-center gap-2 max-w-lg"
          >
            <h2 className="font-headline text-[28px] sm:text-[32px] uppercase tracking-[0.06em] text-gold-shimmer text-balance">
              Yang Berbahagia
            </h2>
            <p className="font-body text-xs sm:text-sm text-[#D0C5B5] text-pretty">
              Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud
              menyelenggarakan Walimatul Khitan putra tercinta kami:
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 w-full max-w-sm flex flex-col items-center gap-5"
          >
            <div className="w-44 sm:w-48 aspect-[3/4] rounded-full overflow-hidden border border-[#C9A96E]/70 bg-[#1E1B17] shadow-2xl">
              <SmartImage
                src={WEDDING_IMAGES.childPortrait}
                alt="Foto kartun Ananda Muhammad Rafi Pratama"
                fallbackLabel="Muhammad Rafi Pratama"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <h3 className="font-headline text-2xl sm:text-[26px] text-[#E6C487] text-balance">
                Ananda {COUPLE_INFO.childFull}
              </h3>
              <p className="font-body text-xs sm:text-sm text-[#D0C5B5] text-balance max-w-xs">
                {COUPLE_INFO.parentsFull}
              </p>
            </div>
          </motion.div>
        </section>

        {/* Section 4: Save The Date */}
        <section
          id="save-the-date"
          className="relative w-full px-6 py-16 border-t border-[#C9A96E]/25"
        >
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-xl mx-auto rounded-2xl border border-[#C9A96E]/60 bg-[#1A1713]/80 backdrop-blur-sm px-5 sm:px-8 py-10 flex flex-col items-center text-center gap-6 shadow-2xl"
          >
            <h2 className="font-headline text-[28px] sm:text-[32px] uppercase tracking-[0.06em] text-gold-shimmer">
              Save The Date
            </h2>

            <div className="w-full grid grid-cols-4 gap-2 sm:gap-3">
              {[
                { label: 'Days', value: countdown.days },
                { label: 'Hours', value: countdown.hours },
                { label: 'Minutes', value: countdown.minutes },
                { label: 'Seconds', value: countdown.seconds },
              ].map((slot) => (
                <div
                  key={slot.label}
                  className="rounded-xl bg-[#E9E1DA] text-[#100E0A] py-3.5 px-1 flex flex-col items-center justify-center gap-1 shadow-md"
                >
                  <span className="font-headline text-xl sm:text-2xl font-medium tabular-nums">
                    {slot.value}
                  </span>
                  <span className="font-label text-[11px] font-semibold text-[#3C3934]">
                    {slot.label}
                  </span>
                </div>
              ))}
            </div>

            <p className="font-body text-xs sm:text-sm text-[#D0C5B5] text-pretty max-w-md">
              Dengan memohon rahmat dan ridho Allah SWT, kami mengundang
              Bapak/Ibu/Saudara/i untuk menghadiri acara Walimatul Khitan putra
              kami:
            </p>

            <a
              href={COUPLE_INFO.calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 min-h-[44px] rounded-full border border-[#C9A96E] bg-[#100E0A]/90 text-[#E9E1DA] px-6 py-2.5 font-label text-xs font-semibold tracking-wider uppercase whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-[#221F1B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E]"
            >
              <Bookmark className="w-4 h-4 text-[#E6C487]" aria-hidden="true" />
              <span>Add to Calendar</span>
            </a>
          </motion.div>
        </section>

        {/* Section 5: Rangkaian Acara */}
        <section
          id="rangkaian-acara"
          className="relative w-full px-6 py-16 flex flex-col items-center gap-8 border-t border-[#C9A96E]/25 overflow-hidden"
        >
          <AnimatedTreeCanopy position="top" />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.55 }}
            className="relative z-10 text-center flex flex-col gap-1.5"
          >
            <h2 className="font-headline text-[28px] sm:text-[32px] uppercase tracking-[0.06em] text-gold-shimmer">
              Rangkaian Acara
            </h2>
            <p className="font-body text-xs sm:text-sm text-[#D0C5B5]">
              {COUPLE_INFO.fullDateText}
            </p>
          </motion.div>

          <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            {WEDDING_EVENTS.map((ev, idx) => (
              <motion.article
                key={ev.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.55, delay: idx * 0.1 }}
                className="w-full rounded-2xl border border-[#C9A96E]/45 bg-[#1E1B17]/80 backdrop-blur-sm p-6 flex flex-col justify-between gap-3 text-center shadow-lg"
              >
                <header className="flex flex-col gap-1">
                  <h3 className="font-headline text-[22px] text-[#E6C487]">
                    {ev.title}
                  </h3>
                  <p className="font-body text-xs text-[#D0C5B5]">{ev.date}</p>
                </header>
                <div className="flex flex-col gap-1">
                  <p className="font-body text-sm font-medium text-[#E9E1DA] tabular-nums">
                    {ev.time}
                  </p>
                  <p className="font-body text-xs text-[#D0C5B5] text-balance">
                    {ev.location}
                  </p>
                </div>
              </motion.article>
            ))}

            {/* Google Maps Location Card */}
            <motion.article
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.6 }}
              className="md:col-span-2 w-full rounded-2xl border border-[#C9A96E]/45 bg-[#1E1B17]/80 backdrop-blur-sm overflow-hidden flex flex-col shadow-lg"
            >
              <VenueMap />
              <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1 text-left">
                  <h3 className="font-title text-sm font-semibold text-[#E9E1DA]">
                    Lokasi Acara
                  </h3>
                  <p className="font-body text-xs text-[#D0C5B5] text-balance">
                    {COUPLE_INFO.venueFull}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className="inline-flex items-center justify-center gap-1.5 min-h-[40px] rounded-full border border-[#4D463A] bg-[#100E0A]/90 text-[#D0C5B5] px-4 py-2 font-label text-xs font-semibold whitespace-nowrap shrink-0 transition-colors hover:border-[#C9A96E] hover:text-[#E9E1DA]"
                  >
                    {addressCopied ? (
                      <Check className="w-3.5 h-3.5 text-[#E6C487]" aria-hidden="true" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    )}
                    <span>{addressCopied ? 'Tersalin' : 'Salin Alamat'}</span>
                  </button>
                  <a
                    href={COUPLE_INFO.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 min-h-[40px] rounded-full border border-[#C9A96E] bg-[#100E0A]/90 text-[#E9E1DA] px-4 py-2 font-label text-xs font-semibold whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-[#221F1B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E]"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#C9A96E]" aria-hidden="true" />
                    <span>Google Maps</span>
                  </a>
                </div>
              </div>
            </motion.article>
          </div>
        </section>

        {/* Section 6: Galeri Momen */}
        <section
          id="galeri"
          className="relative w-full px-6 py-16 flex flex-col items-center gap-8 border-t border-[#C9A96E]/25"
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.55 }}
            className="text-center flex flex-col gap-1.5"
          >
            <h2 className="font-headline text-[28px] sm:text-[32px] uppercase tracking-[0.06em] text-gold-shimmer">
              Galeri Momen
            </h2>
            <p className="font-body text-xs sm:text-sm text-[#D0C5B5]">
              Momen Syukur &amp; Kebahagiaan Ananda Rafi
            </p>
          </motion.div>

          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-3">
            {GALLERY_PHOTOS.map((photo, index) => (
              <motion.button
                key={photo.id}
                type="button"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.55, delay: index * 0.1 }}
                onClick={() => setLightboxIndex(index)}
                aria-label={`Lihat foto: ${photo.caption}`}
                className={`group relative overflow-hidden rounded-2xl border border-[#C9A96E]/40 bg-[#1E1B17] text-left shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E] ${
                  index === 0
                    ? 'col-span-2 md:col-span-2 aspect-[4/3] md:aspect-auto md:h-full'
                    : 'aspect-[3/4]'
                }`}
              >
                <SmartImage
                  src={photo.src}
                  alt={photo.alt}
                  fallbackLabel={photo.caption}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-[#100E0A]/85 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-body text-xs text-[#E9E1DA]"
                >
                  {photo.caption}
                </span>
              </motion.button>
            ))}
          </div>
        </section>
      </main>

      {/* Section 7: RSVP & Wishes (Full-bleed backdrop) */}
      <section
        id="rsvp"
        className="relative z-10 w-full px-6 py-16 overflow-hidden border-t border-[#C9A96E]/25"
      >
        <AnimatedTreeCanopy position="both" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-transparent via-[#16130F]/50 to-[#110E0B]/85 pointer-events-none"
        />

        <div className="relative z-10 w-full max-w-md md:max-w-3xl lg:max-w-4xl mx-auto flex flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.55 }}
            className="flex flex-col items-center text-center gap-2"
          >
            <h2 className="font-headline text-[28px] sm:text-[32px] uppercase tracking-[0.06em] text-gold-shimmer">
              RSVP &amp; Wishes
            </h2>
            <p className="font-body text-xs sm:text-sm text-[#D0C5B5]">
              Ucapan Selamat, Doa, &amp; Konfirmasi Kehadiran
            </p>
            <p
              role="status"
              className="font-body text-xs font-medium tracking-wide text-[#E6C487] tabular-nums pt-1"
            >
              {wishes.length} Ucapan &amp; Doa Terkirim
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* RSVP Form */}
            <motion.form
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.12 }}
              transition={{ duration: 0.55 }}
              onSubmit={handleSubmitWish}
              className="md:col-span-5 w-full flex flex-col gap-4 rounded-2xl bg-[#1E1B17]/80 border border-[#4D463A]/60 p-5 sm:p-6 backdrop-blur-sm"
            >
              <label className="w-full flex flex-col gap-2">
                <span className="font-label text-xs font-semibold tracking-wider uppercase text-[#E9E1DA]">
                  Nama Anda
                </span>
                <input
                  type="text"
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Nama Lengkap"
                  className="w-full min-h-[44px] rounded-full bg-[#E9E1DA] text-[#100E0A] placeholder:text-[#4D463A] px-5 py-2.5 font-body text-sm border-0 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
                />
              </label>

              {/* Attendance Selection */}
              <div className="flex flex-col gap-2">
                <span className="font-label text-xs font-semibold tracking-wider uppercase text-[#E9E1DA]">
                  Konfirmasi Kehadiran
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {(['Hadir', 'Masih Ragu', 'Tidak Hadir'] as AttendanceStatus[]).map(
                    (status, idx) => {
                      const active = attendance === status;
                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setAttendance(status)}
                          className={`${
                            idx === 0 ? 'col-span-2' : ''
                          } min-h-[44px] inline-flex items-center justify-center rounded-full border px-4 py-2 font-label text-xs font-semibold tracking-wider whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E] ${
                            active
                              ? 'border-[#C9A96E] bg-[#2D2925] text-[#E6C487]'
                              : 'border-[#4D463A] bg-[#100E0A]/80 text-[#D0C5B5] hover:border-[#C9A96E]/70'
                          }`}
                        >
                          {status}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Wish Textarea */}
              <label className="w-full flex flex-col gap-2">
                <span className="font-label text-xs font-semibold tracking-wider uppercase text-[#E9E1DA]">
                  Ucapan
                </span>
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ucapan & Doa Terbaikmu"
                  className="w-full rounded-2xl bg-[#E9E1DA] text-[#100E0A] placeholder:text-[#4D463A] px-5 py-3 font-body text-sm border-0 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
                />
              </label>

              {/* Sticker Picker */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setShowStickerPicker((v) => !v)}
                    className="inline-flex items-center justify-center gap-1.5 min-h-[40px] rounded-full border border-[#4D463A] bg-[#100E0A]/80 text-[#E9E1DA] px-4 py-1.5 font-label text-xs font-semibold whitespace-nowrap shrink-0 transition-colors hover:border-[#C9A96E]"
                  >
                    <Smile className="w-4 h-4 text-[#E6C487]" aria-hidden="true" />
                    <span>{selectedSticker ? 'Ubah Stiker' : 'Pilih Stiker'}</span>
                  </button>

                  {selectedSticker && (
                    <button
                      type="button"
                      onClick={() => setSelectedSticker(null)}
                      className="text-xs text-[#D0C5B5] hover:text-[#E9E1DA] underline"
                    >
                      Hapus ({selectedSticker})
                    </button>
                  )}
                </div>

                {showStickerPicker && (
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-[#100E0A] border border-[#4D463A]">
                    {WISH_STICKERS.map((st) => {
                      const chosen = selectedSticker === st.badge;
                      return (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => {
                            setSelectedSticker(st.badge);
                            if (!message.trim()) {
                              setMessage(st.label);
                            }
                            setShowStickerPicker(false);
                          }}
                          className={`rounded-lg px-3 py-2 text-left text-xs transition-colors border ${
                            chosen
                              ? 'border-[#C9A96E] bg-[#2D2925] text-[#E6C487]'
                              : 'border-[#4D463A]/60 bg-[#1E1B17] text-[#E9E1DA] hover:border-[#C9A96E]/60'
                          }`}
                        >
                          <div className="font-semibold text-[#E6C487]">{st.badge}</div>
                          <div className="text-[11px] text-[#D0C5B5] truncate">
                            {st.label}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full min-h-[46px] inline-flex items-center justify-center gap-2 rounded-full bg-[#E9E1DA] text-[#100E0A] px-6 py-2.5 font-label text-xs font-semibold tracking-wider uppercase whitespace-nowrap shrink-0 transition-all duration-150 ease-out hover:bg-[#E6C487] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E]"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
                <span>Kirim</span>
              </button>

              {submittedNotice && (
                <p
                  role="status"
                  className="text-center text-xs font-medium text-[#D1FAE5]"
                >
                  Terima kasih! Ucapan dan konfirmasi Anda telah tercatat.
                </p>
              )}
            </motion.form>

            {/* Guestbook Wishes List */}
            <div className="md:col-span-7 w-full flex flex-col gap-3">
              {wishes.map((wish) => {
                const statusStyle =
                  wish.attendance === 'Tidak Hadir'
                    ? 'bg-[#FEE2E2] text-[#7F1D1D]'
                    : wish.attendance === 'Masih Ragu'
                    ? 'bg-[#FEF3C7] text-[#78350F]'
                    : 'bg-[#D1FAE5] text-[#14532D]';

                return (
                  <motion.article
                    key={wish.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.12 }}
                    transition={{ duration: 0.45 }}
                    className="w-full rounded-2xl bg-[#1E1B17]/90 border border-[#4D463A]/60 p-5 flex flex-col gap-3"
                  >
                    <header className="flex items-center justify-between gap-3">
                      <div className="flex flex-col">
                        <h3 className="font-title text-sm font-semibold text-[#E9E1DA]">
                          {wish.name}
                        </h3>
                        {wish.sticker && (
                          <span className="text-[11px] font-medium text-[#E6C487]">
                            {wish.sticker}
                          </span>
                        )}
                      </div>
                      <span
                        role="status"
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-label text-[11px] font-semibold whitespace-nowrap shrink-0 ${statusStyle}`}
                      >
                        {wish.attendance === 'Tidak Hadir' ? (
                          <X className="w-3 h-3" aria-hidden="true" />
                        ) : wish.attendance === 'Masih Ragu' ? (
                          <HelpCircle className="w-3 h-3" aria-hidden="true" />
                        ) : (
                          <Check className="w-3 h-3" aria-hidden="true" />
                        )}
                        <span>{wish.attendance}</span>
                      </span>
                    </header>

                    <p className="font-body text-sm leading-relaxed text-[#E9E1DA] text-pretty">
                      {wish.message}
                    </p>

                    <footer className="flex items-center justify-between pt-1 text-[#998F81]">
                      <span className="font-body text-xs">{wish.date}</span>
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() =>
                            setReplyingToId((curr) =>
                              curr === wish.id ? null : wish.id
                            )
                          }
                          className="inline-flex items-center gap-1 font-label text-xs font-semibold hover:text-[#E6C487] transition-colors"
                        >
                          <Reply className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Balas</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleLike(wish.id)}
                          aria-label={`Sukai ucapan dari ${wish.name}`}
                          className={`inline-flex items-center gap-1 font-label text-xs font-semibold transition-colors tabular-nums ${
                            wish.liked
                              ? 'text-[#E6C487]'
                              : 'hover:text-[#E6C487]'
                          }`}
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${
                              wish.liked ? 'fill-current' : ''
                            }`}
                            aria-hidden="true"
                          />
                          <span>{wish.likes}</span>
                        </button>
                      </div>
                    </footer>

                    {/* Replies Thread */}
                    {wish.replies.length > 0 && (
                      <div className="mt-1 pt-3 border-t border-[#4D463A]/40 flex flex-col gap-2.5">
                        {wish.replies.map((rep) => (
                          <div
                            key={rep.id}
                            className="rounded-xl bg-[#100E0A]/70 px-3.5 py-2.5 flex flex-col gap-1"
                          >
                            <div className="flex items-center justify-between gap-2 text-xs">
                              <span className="font-semibold text-[#E6C487]">
                                {rep.author}
                              </span>
                              <span className="text-[#998F81] text-[11px]">
                                {rep.date}
                              </span>
                            </div>
                            <p className="text-xs text-[#D0C5B5] leading-relaxed">
                              {rep.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Inline Reply Form */}
                    {replyingToId === wish.id && (
                      <form
                        onSubmit={(e) => handleSubmitReply(e, wish.id)}
                        className="mt-1 pt-3 border-t border-[#4D463A]/40 flex flex-col gap-2"
                      >
                        <input
                          type="text"
                          value={replyAuthor}
                          onChange={(e) => setReplyAuthor(e.target.value)}
                          placeholder="Nama Anda"
                          className="w-full rounded-lg bg-[#100E0A] border border-[#4D463A] px-3 py-1.5 text-xs text-[#E9E1DA] placeholder:text-[#998F81] focus:outline-none focus:border-[#C9A96E]"
                        />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Tulis balasan..."
                            className="flex-1 rounded-lg bg-[#100E0A] border border-[#4D463A] px-3 py-1.5 text-xs text-[#E9E1DA] placeholder:text-[#998F81] focus:outline-none focus:border-[#C9A96E]"
                          />
                          <button
                            type="submit"
                            className="rounded-lg bg-[#C9A96E] text-[#100E0A] px-3 py-1.5 text-xs font-semibold hover:bg-[#E6C487] transition-colors shrink-0"
                          >
                            Kirim
                          </button>
                        </div>
                      </form>
                    )}
                  </motion.article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full px-6 py-12 text-center border-t border-[#C9A96E]/25 overflow-hidden">
        <AnimatedTreeCanopy position="bottom" />
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.55 }}
          className="relative z-10 max-w-md mx-auto flex flex-col items-center gap-4"
        >
          <p className="font-body text-xs sm:text-sm text-[#D0C5B5] text-pretty">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
            Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.
          </p>
          <p className="font-headline text-2xl text-gold-shimmer">
            Ananda {COUPLE_INFO.childFull}
          </p>
          <button
            type="button"
            onClick={onBackToCover}
            className="text-xs font-medium text-[#998F81] hover:text-[#E6C487] underline underline-offset-4 transition-colors"
          >
            Kembali ke Sampul Undangan
          </button>
        </motion.div>
      </footer>
      </div>

      {/* QR Check-In & Personal Invite Link Modal */}
      <AnimatePresence>
        {isQrOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#100E0A]/85 backdrop-blur-sm flex items-center justify-center p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="qr-modal-title"
            onClick={() => setIsQrOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl border border-[#C9A96E]/60 bg-[#221F1B] p-6 flex flex-col items-center text-center gap-4"
            >
              <div className="w-full flex items-center justify-between">
                <h3
                  id="qr-modal-title"
                  className="font-headline text-xl text-[#E6C487]"
                >
                  Check-In Tamu
                </h3>
                <button
                  type="button"
                  onClick={() => setIsQrOpen(false)}
                  aria-label="Tutup modal QR"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full text-[#D0C5B5] hover:bg-[#2D2925]"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              <p className="font-title text-sm font-semibold text-[#E9E1DA]">
                {guestName}
              </p>

              <QrCodeSvg value={`KHITAN-RAFI-${guestName}`} size={160} />

              <p className="font-body text-xs text-[#D0C5B5]">
                Tunjukkan kode ini di meja penerima tamu pada hari acara.
              </p>

              {/* Personalize & Copy Invite Link */}
              <div className="w-full pt-3 border-t border-[#4D463A]/50 flex flex-col gap-2 text-left">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#D0C5B5]">
                  Bagikan Link Undangan Tamu
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customGuestInput}
                    onChange={(e) => setCustomGuestInput(e.target.value)}
                    placeholder="Nama tamu (opsional)"
                    className="flex-1 rounded-full bg-[#100E0A] border border-[#4D463A] px-3.5 py-2 text-xs text-[#E9E1DA] placeholder:text-[#998F81] focus:outline-none focus:border-[#C9A96E]"
                  />
                  <button
                    type="button"
                    onClick={handleCopyInviteLink}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#C9A96E] bg-[#100E0A] px-3.5 py-2 text-xs font-semibold text-[#E9E1DA] hover:bg-[#2D2925] shrink-0"
                  >
                    {shareLinkCopied ? (
                      <Check className="w-3.5 h-3.5 text-[#E6C487]" aria-hidden="true" />
                    ) : (
                      <Share2 className="w-3.5 h-3.5 text-[#E6C487]" aria-hidden="true" />
                    )}
                    <span>{shareLinkCopied ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsQrOpen(false)}
                className="w-full min-h-[44px] rounded-full border border-[#C9A96E] px-6 py-2 font-label text-xs font-semibold uppercase tracking-wider text-[#E9E1DA] hover:bg-[#2D2925] transition-colors"
              >
                Tutup
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gallery Lightbox Modal */}
      <AnimatePresence>
        {activePhoto && lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#100E0A]/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label={activePhoto.caption}
            onClick={() => setLightboxIndex(null)}
          >
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              aria-label="Tutup galeri foto"
              className="absolute top-4 right-4 z-10 inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#221F1B] border border-[#4D463A] text-[#E9E1DA] hover:border-[#C9A96E]"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>

            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full flex flex-col items-center gap-4"
            >
              <div className="relative w-full max-h-[75vh] flex items-center justify-center overflow-hidden rounded-2xl border border-[#C9A96E]/40 bg-[#1E1B17]">
                <SmartImage
                  src={activePhoto.src}
                  alt={activePhoto.alt}
                  fallbackLabel={activePhoto.caption}
                  className="max-h-[75vh] w-auto max-w-full object-contain"
                />
              </div>

              <div className="w-full flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIndex(
                      (lightboxIndex - 1 + GALLERY_PHOTOS.length) %
                        GALLERY_PHOTOS.length
                    )
                  }
                  aria-label="Foto sebelumnya"
                  className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-[#4D463A] bg-[#221F1B] text-[#E9E1DA] hover:border-[#C9A96E]"
                >
                  <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                </button>

                <p className="font-body text-xs sm:text-sm text-[#D0C5B5] text-center">
                  {activePhoto.caption} ({lightboxIndex + 1} /{' '}
                  {GALLERY_PHOTOS.length})
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setLightboxIndex((lightboxIndex + 1) % GALLERY_PHOTOS.length)
                  }
                  aria-label="Foto berikutnya"
                  className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-[#4D463A] bg-[#221F1B] text-[#E9E1DA] hover:border-[#C9A96E]"
                >
                  <ChevronRight className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
