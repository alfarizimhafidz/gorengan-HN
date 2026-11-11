export const siteConfig = {
  name: "Gorengan HN",
  subtitle: "HN Company",
  tagline: "Authentic Indonesian Heritage",
  description:
    "Gorengan HN mengangkat kuliner jalanan khas Indonesia ke standar higienis modern. Berdiri sejak 2010, dikenal dengan cita rasa yang berbeda. Diproses dengan minyak kelapa sawit higienis berkualitas prima, rempah bumbu alami, dan disajikan renyah setiap saat.",
  shortDescription: "Cita Rasa Tradisional Kelas Bintang Lima",
  since: 2010,
  yearsServing: 16,
  logo: "/images/logo-hn.jpg",
  logoFull: "/images/logo-hn-full.png",
  contact: {
    address: "Jl. Senopati Raya No. 42, Kebayoran Baru, Jakarta Selatan, 12190",
    addressShort: "Kebayoran Baru, Jakarta Selatan",
    phone: "+62 812-9876-5432",
    phoneLandline: "(021) 720-8899",
    email: "halo@gorenganhn.com",
    emailCatering: "katering@gorenganhn.com",
    whatsapp: "6281298765432",
    hours: "09.00 - 22.00 WIB",
    days: "Senin - Minggu",
  },
  googleMapsLink: "https://maps.app.goo.gl/Vi6ceAEkNbRihLRv9",
  // Untuk embed, user perlu ambil embed code dari Google Maps.
  // Caranya: buka Google Maps > cari lokasi > klik "Share" > tab "Embed a map" > copy src URL.
  googleMapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.0!2d106.8!3d-6.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sGorengan+HN!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid",
  social: {
    instagram: "https://instagram.com/gorenganhn",
    facebook: "https://facebook.com/gorenganhn",
    tiktok: "https://tiktok.com/@gorenganhn",
  },
};

export const navItems = [
  { label: "Beranda", href: "#beranda" },
  { label: "Tentang Kami", href: "#tentang-kami" },
  { label: "Layanan", href: "#layanan" },
  { label: "Berita & Artikel", href: "#berita" },
  { label: "Kontak", href: "#kontak" },
];

export const services = [
  {
    icon: "inventory_2",
    tag: "Terpopuler Kantor",
    title: "Paket Katering Acara & Kantor (Snack Box)",
    description:
      "Pilihan boks higienis isi 5-10 macam gorengan hangat premium lengkap dengan cabe rawit segar & sambal cocol spesial untuk rapat kantor, syukuran, dan arisan.",
    price: "Mulai Rp 18.000 / Box",
    colorClass: "bg-[var(--color-surface-custard)]",
    iconColor: "text-[var(--color-secondary)]",
  },
  {
    icon: "skillet",
    tag: "Pernikahan & Pesta",
    title: "Live Cooking / Gerai On-Site Event",
    description:
      "Booth eksklusif Gorengan HN hadir langsung di pesta pernikahan atau festival Anda, menyajikan gorengan panas fresh langsung dari wajan penggorengan higienis.",
    price: "Mulai 100 Porsi",
    colorClass: "bg-[var(--color-primary-fixed)]",
    iconColor: "text-[var(--color-primary)]",
  },
  {
    icon: "moped",
    tag: "Cepat & Hangat",
    title: "Pemesanan Menu Satuan & Takeaway",
    description:
      "Layanan pesan cepat di gerai maupun delivery online (GrabFood, GoFood, ShopeeFood) dengan kemasan ventilasi khusus penahan kerenyahan tanpa basah uap.",
    price: "Ready Tiap Hari",
    colorClass: "bg-[var(--color-secondary-fixed)]",
    iconColor: "text-[var(--color-secondary)]",
  },
  {
    icon: "ac_unit",
    tag: "Stok Praktis",
    title: "Paket Frozen Gorengan Siap Goreng",
    description:
      "Solusi praktis menikmati tahu isi pedas, bakwan jagung, dan tempe mendoan HN kapan saja di rumah dengan kemasan vacuum kedap udara tahan 3 bulan di freezer.",
    price: "Isi 10 Pcs / Pack",
    colorClass: "bg-[var(--color-surface-custard)]",
    iconColor: "text-[var(--color-secondary)]",
  },
  {
    icon: "handshake",
    tag: "Peluang Usaha",
    title: "Kemitraan Franchise & Reseller",
    description:
      "Program kemitraan wirausaha kuliner dengan modal terjangkau, SOP terstandarisasi, bahan baku siap kirim setiap hari, dan pendampingan pemasaran menyeluruh.",
    price: "ROI Cepat & Teruji",
    colorClass: "bg-[var(--color-primary-fixed)]",
    iconColor: "text-[var(--color-primary)]",
  },
  {
    icon: "redeem",
    tag: "Eksklusif Tradisional",
    title: "Custom Hampers & Paket Hantaran",
    description:
      "Kemasan besek bambu artistik eksklusif dengan pita lurik tradisional dan kartu ucapan kustom, sempurna untuk bingkisan hari raya Idulfitri, Natal, dan buah tangan.",
    price: "Kemasan Besek Mewah",
    colorClass: "bg-[var(--color-tertiary-container)]",
    iconColor: "text-[var(--color-tertiary)]",
  },
];

export const newsArticles = [
  {
    id: 1,
    category: "Tips Kuliner",
    date: "12 Mei 2025",
    title: "Rahasia Pisang Goreng Madu Karamel yang Tetap Renyah Hingga 6 Jam",
    excerpt:
      "Kenali pemilihan pisang raja matang pohon dan teknik karamelisasi madu murni yang menghasilkan tekstur renyah di luar, lembut lumer di dalam.",
    image: "/images/news-pisang-madu.jpg",
    slug: "rahasia-pisang-goreng-madu",
  },
  {
    id: 2,
    category: "Berita Cabang",
    date: "28 April 2025",
    title: "Gorengan HN Resmikan Gerai Konsep Baru di Jakarta Selatan",
    excerpt:
      "Hadir dengan suasana kafe modern berpadu sentuhan kayu hangat, pelanggan kini bisa menikmati kopi tubruk sembari ngemil mendoan panas.",
    image: "/images/news-gerai-senopati.jpg",
    slug: "gerai-baru-jakarta-selatan",
  },
  {
    id: 3,
    category: "Kebersihan & Mutu",
    date: "15 April 2025",
    title: "Standar Emas Dapur Bersih: Bagaimana Kami Menjaga Kualitas Minyak Goreng",
    excerpt:
      "Transparansi proses produksi dan komitmen uji berkala kualitas minyak demi gorengan yang aman, renyah, dan nyaman di tenggorokan.",
    image: "/images/kitchen-hygiene.jpg",
    slug: "standar-dapur-bersih",
  },
];

export const strengths = [
  {
    icon: "water_drop",
    title: "Minyak Higienis Terkontrol",
    description:
      "Digoreng dengan minyak kelapa pilihan berkualitas tinggi yang diganti berkala untuk hasil gorengan renyah tanpa rasa tengik, ringan di tenggorokan, dan minim residu.",
    colorClass: "bg-[var(--color-surface-custard)]",
    iconColor: "text-[var(--color-secondary)]",
  },
  {
    icon: "eco",
    title: "Bahan Baku Segar Pilihan",
    description:
      "Sayuran segar dipasok langsung setiap subuh dari mitra petani lokal, tahu Sumedang asli berserat lembut, dan tempe kedelai non-GMO pilihan kualitas nomor satu.",
    colorClass: "bg-[var(--color-primary-fixed)]",
    iconColor: "text-[var(--color-primary)]",
  },
  {
    icon: "local_dining",
    title: "Racikan Bumbu Warisan",
    description:
      "Menggunakan rempah alami tradisional nusantara tanpa pengawet sintetik, dipadukan bersama cocolan sambal kecap cabai rawit pedas-manis istimewa resep turun temurun.",
    colorClass: "bg-[var(--color-tertiary-container)]",
    iconColor: "text-[var(--color-tertiary)]",
  },
];

export interface MenuProduct {
  id: string;
  name: string;
  category: "Snack Box" | "Gorengan Satuan" | "Frozen" | "Hampers";
  price: number;
  unit: string;
  badge?: string;
  description: string;
  image: string;
  minOrder?: number;
}

export const menuProducts: MenuProduct[] = [
  {
    id: "prod-snackbox-standard",
    name: "Snack Box Kantor Reguler (Isi 5)",
    category: "Snack Box",
    price: 18000,
    unit: "box",
    badge: "Paling Laris",
    description:
      "Kotak higienis berisi 5 macam gorengan hangat premium (Bakwan Jagung, Tahu Isi, Mendoan, Pisang Madu, Risol Sayur) + cabai rawit segar & cocolan sambal kecap.",
    image: "/images/hero-platter.jpg",
    minOrder: 1,
  },
  {
    id: "prod-snackbox-premium",
    name: "Snack Box Rapat Eksekutif (Isi 8 + Air Mineral)",
    category: "Snack Box",
    price: 28000,
    unit: "box",
    badge: "Meeting VVIP",
    description:
      "Paket mewah isi 8 gorengan pilihan spesial dengan kemasan boks tebal motif batik nusantara, air mineral botol 330ml, dan tisu basah sanitasi.",
    image: "/images/hero-platter.jpg",
    minOrder: 1,
  },
  {
    id: "prod-pisang-madu",
    name: "Pisang Goreng Madu Karamel (Porsi 5 Pcs)",
    category: "Gorengan Satuan",
    price: 20000,
    unit: "porsi",
    badge: "Signature HN",
    description:
      "Pisang raja matang pohon berkaramelisasi madu murni hutan, renyah legit di luar dan lumer manis alami di dalam.",
    image: "/images/news-pisang-madu.jpg",
    minOrder: 1,
  },
  {
    id: "prod-tahu-isi",
    name: "Tahu Isi Sayur Pedas Gurih (Porsi 5 Pcs)",
    category: "Gorengan Satuan",
    price: 18000,
    unit: "porsi",
    description:
      "Tahu pong Sumedang lembut dengan isian wortel segar, tauge, kol, dan cincangan ayam bumbu pedas rawit nikmat.",
    image: "/images/hero-platter.jpg",
    minOrder: 1,
  },
  {
    id: "prod-tempe-mendoan",
    name: "Tempe Mendoan Gurih Banyumas (Porsi 5 Pcs)",
    category: "Gorengan Satuan",
    price: 18000,
    unit: "porsi",
    description:
      "Tempe kedelai lembaran berbalut adonan daun bawang kucai wangi, digoreng setengah matang lembut disajikan dengan sambal kecap rawit pedas manis.",
    image: "/images/hero-platter.jpg",
    minOrder: 1,
  },
  {
    id: "prod-bakwan-jagung",
    name: "Bakwan Jagung Manis Super Renyah (Porsi 5 Pcs)",
    category: "Gorengan Satuan",
    price: 18000,
    unit: "porsi",
    description:
      "Pipilan jagung manis segar berpadu daun seledri dan ketumbar sangrai, tekstur garing renyah tidak berminyak.",
    image: "/images/hero-platter.jpg",
    minOrder: 1,
  },
  {
    id: "prod-frozen-mix",
    name: "Paket Frozen Siap Goreng (Isi 10 Pcs Campur)",
    category: "Frozen",
    price: 35000,
    unit: "pack",
    badge: "Praktis di Rumah",
    description:
      "Kemasan vacuum food-grade kedap udara. Tahan hingga 3 bulan di freezer. Cukup goreng 3-4 menit kapan pun Anda ingin gorengan panas fresh.",
    image: "/images/hero-platter.jpg",
    minOrder: 1,
  },
  {
    id: "prod-hampers-besek",
    name: "Custom Hampers Besek Anyaman Tradisional (Isi 15)",
    category: "Hampers",
    price: 75000,
    unit: "besek",
    badge: "Kemasan Mewah",
    description:
      "Besek bambu artistik ramah lingkungan berhias pita tenun lurik nusantara, lengkap dengan kartu ucapan kustom, aneka sambal botol kaca, dan 15 gorengan aneka rasa.",
    image: "/images/hero-platter.jpg",
    minOrder: 1,
  },
];

