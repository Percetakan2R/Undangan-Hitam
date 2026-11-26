import midnightStarryBg from '../assets/images/midnight_starry_background_1795676673736.jpg';
import khitanCoverBoy from '../assets/images/khitan_cover_boy_1795680275667.jpg';
import khitanChildPortrait from '../assets/images/khitan_child_portrait_1795680276388.jpg';
import khitanFamilyTop from '../assets/images/khitan_family_top_1795680276691.jpg';
import khitanDoaWide from '../assets/images/khitan_doa_wide_1795680277055.jpg';
import khitanGalleryMosque from '../assets/images/khitan_gallery_mosque_1795680278729.jpg';
import khitanGalleryQuran from '../assets/images/khitan_gallery_quran_1795680278912.jpg';

export type AttendanceStatus = 'Hadir' | 'Masih Ragu' | 'Tidak Hadir';

export interface WishReply {
  id: string;
  author: string;
  message: string;
  date: string;
}

export interface WishItem {
  id: string;
  name: string;
  attendance: AttendanceStatus;
  message: string;
  sticker?: string;
  date: string;
  likes: number;
  liked?: boolean;
  replies: WishReply[];
}

export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  caption: string;
  aspectClass: string;
  spanClass?: string;
}

export const WEDDING_IMAGES = {
  coverBackdrop: midnightStarryBg,
  coverBoy: khitanCoverBoy,
  heroBackdrop: midnightStarryBg,
  withLoveTop: khitanFamilyTop,
  withLoveBottom: khitanDoaWide,
  childPortrait: khitanChildPortrait,
};

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'galeri-1',
    src: khitanGalleryMosque,
    alt: 'Ilustrasi kartun Ananda Rafi berjalan bersama ayah dan ibu di pelataran masjid berhias lentera emas di bawah langit berbintang',
    caption: 'Langkah penuh syukur menuju kedewasaan bersama keluarga',
    aspectClass: 'aspect-[4/3]',
    spanClass: 'col-span-2',
  },
  {
    id: 'galeri-2',
    src: khitanGalleryQuran,
    alt: 'Ilustrasi kartun Ananda Rafi mengenakan baju koko hitam emas dan peci sambil memegang Al-Qur’an di dekat lentera',
    caption: 'Tumbuh menjadi anak sholeh yang cinta Al-Qur’an',
    aspectClass: 'aspect-[3/4]',
  },
  {
    id: 'galeri-3',
    src: khitanCoverBoy,
    alt: 'Ilustrasi kartun Ananda Rafi tersenyum memberi salam di taman malam berbintang dengan bunga anggrek putih',
    caption: 'Doa restu keluarga dan kerabat di hari penuh berkah',
    aspectClass: 'aspect-[3/4]',
  },
];

export const COUPLE_INFO = {
  childShort: 'Rafi',
  childFull: 'Muhammad Rafi Pratama',
  parentsFull: 'Putra pertama dari Bapak Hendra Wijaya & Ibu Ratna Sari',
  hashtag: '#WalimatulKhitanRafi',
  dateDisplay: '12 . 12 . 2026',
  fullDateText: 'Sabtu, 12 Desember 2026',
  targetIso: '2026-12-12T08:00:00+07:00',
  venueShort: 'Harjosari Kidul, Adiwerna, Tegal',
  venueFull: 'Desa Harjosari Kidul, Kec. Adiwerna, Kab. Tegal',
  mapsUrl: 'https://maps.google.com/?q=Harjosari+Kidul+Adiwerna+Tegal',
  calendarUrl:
    'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Walimatul+Khitan+Muhammad+Rafi+Pratama&dates=20261212T010000Z/20261212T070000Z&location=Harjosari+Kidul,+Adiwerna,+Tegal&details=Pengajian+%26+Doa+Bersama+(08.00-10.00+WIB)+%26+Resepsi+Walimatul+Khitan+(11.00-14.00+WIB)+Ananda+Muhammad+Rafi+Pratama',
};

export const WEDDING_EVENTS = [
  {
    id: 'pengajian',
    title: 'Pengajian & Doa Bersama',
    date: 'Sabtu, 12 Desember 2026',
    time: '08.00 – 10.00 WIB',
    location: 'Desa Harjosari Kidul, Kec. Adiwerna, Kab. Tegal',
  },
  {
    id: 'resepsi',
    title: 'Resepsi Walimatul Khitan',
    date: 'Sabtu, 12 Desember 2026',
    time: '11.00 – 14.00 WIB',
    location: 'Desa Harjosari Kidul, Kec. Adiwerna, Kab. Tegal',
  },
];

export const WISH_STICKERS = [
  { id: 'sholeh', label: 'Semoga Menjadi Anak Sholeh & Berbakti', badge: 'Anak Sholeh' },
  { id: 'barakallah', label: 'Barakallahu Fiikum, Tambah Berkah & Cerdas', badge: 'Barakallah' },
  { id: 'sembuh', label: 'Lekas Pulih, Sehat Selalu & Semakin Dewasa!', badge: 'Sehat Selalu' },
  { id: 'doa', label: 'Semoga Jadi Kebanggaan Orang Tua & Agama', badge: 'Doa Terbaik' },
];

export const INITIAL_WISHES: WishItem[] = [
  {
    id: 'wish-1',
    name: 'Ustadz Fauzan & Keluarga',
    attendance: 'Hadir',
    message:
      'Barakallahu fiikum untuk Ananda Rafi. Semoga kelak menjadi anak yang sholeh, cerdas, berbakti kepada kedua orang tua, dan selalu dalam lindungan Allah SWT. Aamiin.',
    date: '25 Nov 2026',
    likes: 89,
    liked: false,
    replies: [],
  },
  {
    id: 'wish-2',
    name: 'Tante Nadia & Om Dimas',
    attendance: 'Tidak Hadir',
    message:
      'Selamat khitan ya Rafi jagoan! Lekas sembuh, tambah sehat, dan makin rajin belajarnya. Maaf belum bisa hadir langsung, doa terbaik selalu untuk Rafi.',
    date: '24 Nov 2026',
    likes: 92,
    liked: false,
    replies: [],
  },
];
