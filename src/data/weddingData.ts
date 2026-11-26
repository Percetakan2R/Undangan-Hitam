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
  coverBackdrop:
    '/src/assets/images/midnight_starry_background_1795676673736.jpg',
  coverCouple:
    '/src/assets/images/cartoon_cover_couple_1795676556372.jpg',
  heroBackdrop:
    '/src/assets/images/midnight_starry_background_1795676673736.jpg',
  withLoveTop:
    '/src/assets/images/cartoon_with_love_top_1795677163685.jpg',
  withLoveBottom:
    '/src/assets/images/cartoon_arrum_wide_1795677165385.jpg',
  groom:
    '/src/assets/images/cartoon_groom_portrait_1795676557430.jpg',
  bride:
    '/src/assets/images/cartoon_bride_portrait_1795676557870.jpg',
  locationMap:
    'https://lh3.googleusercontent.com/aida/ALJJyrDYD5vlFcVYVhRcBtdpwL8Tby_U51w4P_h0u3RXtyzzqHDs6TWW3_IXzLIrwETaf4PSs6naGHT1LEwY62sQGJZXmNBPDuzGCN_2nysDqI2aOCeJxCGQIQLIf78zZMNIOOkfwGX2-dRirnyn0SaPWRmFZfdiawpj_kg9-jwtsRdo8S_5jOfEtmCpIyKFhgJ32WoQb_ZP7Ig3oHs1gwlsFwBvsowema2SaPG5DcuTQObLPUb0QA',
};

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'galeri-1',
    src: '/src/assets/images/cartoon_gallery_walk_1795676558227.jpg',
    alt: 'Ilustrasi kartun Rafi dan Alesha berjalan bergandengan di antara pilar batu klasik di bawah langit malam berbintang',
    caption: 'Langkah bersama di bawah langit malam berbintang',
    aspectClass: 'aspect-[4/3]',
    spanClass: 'col-span-2',
  },
  {
    id: 'galeri-2',
    src: '/src/assets/images/cartoon_gallery_arch_1795676558214.jpg',
    alt: 'Ilustrasi kartun prewedding Rafi dan Alesha di bawah lengkungan kuil batu',
    caption: 'Janji suci dalam bingkai arsitektur klasik',
    aspectClass: 'aspect-[3/4]',
  },
  {
    id: 'galeri-3',
    src: '/src/assets/images/cartoon_gallery_bouquet_1795676559477.jpg',
    alt: 'Ilustrasi kartun dekat Rafi dan Alesha dengan buket mawar emas dan anggrek putih',
    caption: 'Mawar emas dan anggrek putih saksi ketulusan cinta',
    aspectClass: 'aspect-[3/4]',
  },
];

export const COUPLE_INFO = {
  groomShort: 'Rafi',
  brideShort: 'Alesha',
  groomFull: 'Rafi Pratama, S.T.',
  groomParents: 'Putra pertama dari Bapak Hendra Wijaya & Ibu Ratna Sari',
  brideFull: 'Alesha Zahra, S.Ars.',
  brideParents: 'Putri kedua dari Bapak Ahmad Fauzi & Ibu Nurul Hidayah',
  hashtag: '#sehidupsematiRAFIALESHA',
  dateDisplay: '12 . 12 . 2026',
  fullDateText: 'Sabtu, 12 Desember 2026',
  targetIso: '2026-12-12T08:00:00+07:00',
  venueShort: 'Harjosari Kidul, Adiwerna, Tegal',
  venueFull: 'Desa Harjosari Kidul, Kec. Adiwerna, Kab. Tegal',
  mapsUrl: 'https://maps.google.com/?q=Harjosari+Kidul+Adiwerna+Tegal',
  calendarUrl:
    'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Pernikahan+Rafi+%26+Alesha&dates=20261212T010000Z/20261212T070000Z&location=Harjosari+Kidul,+Adiwerna,+Tegal&details=Akad+Nikah+(08.00-10.00+WIB)+%26+Resepsi+Pernikahan+(11.00-14.00+WIB)+Rafi+%26+Alesha',
};

export const WEDDING_EVENTS = [
  {
    id: 'akad',
    title: 'Akad Nikah',
    date: 'Sabtu, 12 Desember 2026',
    time: '08.00 – 10.00 WIB',
    location: 'Desa Harjosari Kidul, Kec. Adiwerna, Kab. Tegal',
  },
  {
    id: 'resepsi',
    title: 'Resepsi Pernikahan',
    date: 'Sabtu, 12 Desember 2026',
    time: '11.00 – 14.00 WIB',
    location: 'Desa Harjosari Kidul, Kec. Adiwerna, Kab. Tegal',
  },
];

export const WISH_STICKERS = [
  { id: 'sakinah', label: 'Sakinah Mawaddah Warahmah', badge: 'Doa Restu' },
  { id: 'barakallah', label: 'Barakallahu Lakuma wa Baraka ‘Alaikuma', badge: 'Barakallah' },
  { id: 'happy', label: 'Selamat Menempuh Hidup Baru!', badge: 'Bahagia Selalu' },
  { id: 'forever', label: 'Langgeng Hingga Jannah', badge: 'Sehidup Semati' },
];

export const INITIAL_WISHES: WishItem[] = [
  {
    id: 'wish-1',
    name: 'Nadia Putri',
    attendance: 'Hadir',
    message:
      'Alhamdulillah akhirnya Rafi & Alesha! Lancar sampai hari H ya, semoga menjadi keluarga yang sakinah, mawaddah, dan warahmah. Aamiin.',
    date: '25 Nov 2026',
    likes: 89,
    liked: false,
    replies: [],
  },
  {
    id: 'wish-2',
    name: 'Dimas & Istri',
    attendance: 'Tidak Hadir',
    message:
      'Selamat menempuh hidup baru, Rafi & Alesha. Mohon maaf berhalangan hadir, doa terbaik selalu menyertai kalian berdua.',
    date: '24 Nov 2026',
    likes: 92,
    liked: false,
    replies: [],
  },
];
