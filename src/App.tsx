import { useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'motion/react';
import { CoverScreen } from './components/CoverScreen';
import { MainInvitation } from './components/MainInvitation';
import { weddingAudio } from './utils/audioPlayer';

function getGuestNameFromUrl(): string {
  try {
    const params = new URLSearchParams(window.location.search);
    const to = params.get('to');
    if (to && to.trim()) {
      return to.trim();
    }
  } catch {
    // ignore URL errors
  }
  return 'Nama Tamu';
}

export default function App() {
  const [guestName] = useState<string>(() => getGuestNameFromUrl());
  const [isOpened, setIsOpened] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuotaExceeded = () => {
      setQuotaExceeded(true);
    };
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => {
      window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
      weddingAudio.stop();
    };
  }, []);

  const handleOpenInvitation = async () => {
    setIsOpened(true);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    const started = await weddingAudio.start();
    if (started) {
      setIsMusicPlaying(true);
    }
  };

  const handleToggleMusic = async () => {
    if (isMusicPlaying) {
      weddingAudio.stop();
      setIsMusicPlaying(false);
    } else {
      const started = await weddingAudio.start();
      setIsMusicPlaying(started);
    }
  };

  const handleBackToCover = () => {
    setIsOpened(false);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  return (
    <MotionConfig reducedMotion="user">
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}
      <AnimatePresence mode="wait">
        {!isOpened ? (
          <CoverScreen
            key="cover"
            guestName={guestName}
            onOpen={handleOpenInvitation}
          />
        ) : (
          <MainInvitation
            key="main"
            guestName={guestName}
            isMusicPlaying={isMusicPlaying}
            onToggleMusic={handleToggleMusic}
            onBackToCover={handleBackToCover}
          />
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
