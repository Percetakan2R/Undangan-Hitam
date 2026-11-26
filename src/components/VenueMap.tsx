import { useEffect, useState } from 'react';
import {
  APILoadingStatus,
  APIProvider,
  AdvancedMarker,
  InfoWindow,
  Map as GoogleMap,
  Pin,
  useAdvancedMarkerRef,
  useApiLoadingStatus,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { Loader2, MapPin, Navigation } from 'lucide-react';
import { COUPLE_INFO } from '../data/weddingData';

interface ResolvedVenuePlace {
  position: { lat: number; lng: number };
  displayName: string;
  formattedAddress: string;
}

function isQuotaError(error: unknown): boolean {
  const message =
    error instanceof Error
      ? `${error.name} ${error.message}`
      : String(error ?? '');
  const status =
    typeof error === 'object' && error !== null && 'status' in error
      ? String((error as { status?: unknown }).status ?? '')
      : '';
  const combined = `${message} ${status}`;
  return (
    combined.includes('RESOURCE_EXHAUSTED') ||
    combined.includes('OVER_QUERY_LIMIT') ||
    combined.includes('QuotaExceededError') ||
    combined.includes('OverQuotaMapError') ||
    combined.includes('429')
  );
}

function VenueMapContent() {
  const apiStatus = useApiLoadingStatus();
  const placesLib = useMapsLibrary('places');
  const [markerRef, marker] = useAdvancedMarkerRef();

  const [resolvedPlace, setResolvedPlace] = useState<ResolvedVenuePlace | null>(null);
  const [isSearching, setIsSearching] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoWindowOpen, setInfoWindowOpen] = useState(true);

  useEffect(() => {
    if (apiStatus === APILoadingStatus.AUTH_FAILURE) {
      window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
      setErrorMsg('Peta belum dapat dimuat karena autentikasi atau kuota Google Maps.');
      setIsSearching(false);
    } else if (apiStatus === APILoadingStatus.FAILED) {
      setErrorMsg('Gagal memuat Google Maps. Silakan buka langsung melalui tombol Google Maps.');
      setIsSearching(false);
    }
  }, [apiStatus]);

  useEffect(() => {
    if (!placesLib) return;

    let cancelled = false;
    setIsSearching(true);
    setErrorMsg(null);

    const resolveVenue = async () => {
      try {
        const { places } = await placesLib.Place.searchByText({
          textQuery:
            'Desa Harjosari Kidul, Kecamatan Adiwerna, Kabupaten Tegal, Jawa Tengah, Indonesia',
          fields: ['displayName', 'location', 'formattedAddress'],
          language: 'id',
          region: 'id',
          maxResultCount: 1,
          internalUsageAttributionIds: ['gmp_mcp_codeassist_v1_aistudio'],
        });

        if (cancelled) return;

        const topPlace = places?.[0];
        if (!topPlace?.location) {
          setErrorMsg('Lokasi Harjosari Kidul, Adiwerna belum ditemukan.');
          setIsSearching(false);
          return;
        }

        setResolvedPlace({
          position: {
            lat: topPlace.location.lat(),
            lng: topPlace.location.lng(),
          },
          displayName: topPlace.displayName || 'Harjosari Kidul, Adiwerna',
          formattedAddress:
            topPlace.formattedAddress || COUPLE_INFO.venueFull,
        });
        setIsSearching(false);
      } catch (err: unknown) {
        if (cancelled) return;
        if (isQuotaError(err)) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
          setErrorMsg('Batas kuota Google Maps Platform tercapai untuk sementara.');
        } else {
          setErrorMsg('Gagal memuat koordinat lokasi. Gunakan tombol Google Maps di bawah.');
        }
        setIsSearching(false);
      }
    };

    void resolveVenue();

    return () => {
      cancelled = true;
    };
  }, [placesLib]);

  if (errorMsg) {
    return (
      <div className="w-full h-72 sm:h-80 md:h-[360px] bg-[#100E0A] flex flex-col items-center justify-center gap-3 px-6 text-center">
        <div className="w-11 h-11 rounded-full border border-[#C9A96E]/45 bg-[#1E1B17] flex items-center justify-center">
          <MapPin className="w-5 h-5 text-[#E6C487]" aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-1 max-w-sm">
          <p className="font-title text-sm font-semibold text-[#E9E1DA]">
            {COUPLE_INFO.venueShort}
          </p>
          <p className="font-body text-xs text-[#D0C5B5] leading-relaxed">
            {errorMsg}
          </p>
        </div>
        <a
          href={COUPLE_INFO.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-[#C9A96E] bg-[#1E1B17] px-4 py-2 font-label text-xs font-semibold text-[#E9E1DA] hover:bg-[#2A251F] transition-colors"
        >
          <Navigation className="w-3.5 h-3.5 text-[#E6C487]" aria-hidden="true" />
          <span>Buka di Google Maps</span>
        </a>
      </div>
    );
  }

  if (isSearching || !resolvedPlace) {
    return (
      <div className="w-full h-72 sm:h-80 md:h-[360px] bg-[#100E0A] flex flex-col items-center justify-center gap-2.5 text-center px-6">
        <Loader2
          className="w-6 h-6 text-[#C9A96E] animate-spin"
          aria-hidden="true"
        />
        <p className="font-body text-xs text-[#D0C5B5]">
          Memuat peta Harjosari Kidul, Adiwerna, Tegal...
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-72 sm:h-80 md:h-[360px] bg-[#100E0A]">
      <GoogleMap
        mapId="DEMO_MAP_ID"
        defaultCenter={resolvedPlace.position}
        defaultZoom={15}
        colorScheme="DARK"
        gestureHandling="cooperative"
        mapTypeControl={true}
        streetViewControl={false}
        fullscreenControl={true}
        zoomControl={true}
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        className="w-full h-full"
      >
        <AdvancedMarker
          ref={markerRef}
          position={resolvedPlace.position}
          title={`${resolvedPlace.displayName} — Lokasi Pernikahan Rafi & Alesha`}
          clickable={true}
          onClick={() => setInfoWindowOpen((prev) => !prev)}
        >
          <Pin
            background="#C9A96E"
            borderColor="#100E0A"
            glyphColor="#100E0A"
            scale={1.15}
          />
        </AdvancedMarker>

        {infoWindowOpen && marker && (
          <InfoWindow
            anchor={marker}
            maxWidth={250}
            onCloseClick={() => setInfoWindowOpen(false)}
          >
            <div className="p-1 text-left font-sans text-[#100E0A]">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8B6A32]">
                Lokasi Acara
              </p>
              <p className="mt-0.5 text-sm font-bold text-[#100E0A]">
                {resolvedPlace.displayName}
              </p>
              <p className="mt-1 text-xs leading-snug text-[#4A4035]">
                {resolvedPlace.formattedAddress}
              </p>
              <a
                href={COUPLE_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#8B6A32] underline hover:text-[#664C20]"
              >
                <Navigation className="w-3 h-3" aria-hidden="true" />
                <span>Petunjuk Arah</span>
              </a>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}

export function VenueMap() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="w-full h-72 sm:h-80 md:h-[360px] bg-[#100E0A] flex flex-col items-center justify-center gap-3 px-6 text-center">
        <div className="w-11 h-11 rounded-full border border-[#C9A96E]/45 bg-[#1E1B17] flex items-center justify-center">
          <MapPin className="w-5 h-5 text-[#E6C487]" aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-1 max-w-sm">
          <p className="font-title text-sm font-semibold text-[#E9E1DA]">
            {COUPLE_INFO.venueShort}
          </p>
          <p className="font-body text-xs text-[#D0C5B5] leading-relaxed">
            Kunci Google Maps API belum tersedia di lingkungan saat ini. Buka lokasi langsung melalui Google Maps.
          </p>
        </div>
        <a
          href={COUPLE_INFO.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-[#C9A96E] bg-[#1E1B17] px-4 py-2 font-label text-xs font-semibold text-[#E9E1DA] hover:bg-[#2A251F] transition-colors"
        >
          <Navigation className="w-3.5 h-3.5 text-[#E6C487]" aria-hidden="true" />
          <span>Buka di Google Maps</span>
        </a>
      </div>
    );
  }

  return (
    <APIProvider
      apiKey={apiKey}
      libraries={['places', 'marker']}
      language="id"
      region="ID"
    >
      <VenueMapContent />
    </APIProvider>
  );
}
