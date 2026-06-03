import type { Product, User } from './types';

export const LOGO_URLS = {
  horizontal: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmFPVhr6i4eBm_QpHgdnvdvjeByWpK7RM75Fhqzoy_nSoeiTZ4opwF9phM-w9LeRSOMC6iZneogaABwJ_F9Jf971sxQuE717xV6XMG36E2a6AdaHNsLI1aZRp6BTpStBc04SbvnwTdoukiO7_hLguf55ti4gQgW66S-9Hrk9RQJ3BVz8kVXwb9Hq-oXpxhcdpOSYP3USQ8c-JrqasUgNUPANLHPYtEEjjEsCKdw9fRhs7_uEccIp6Qbd7ZY-HhcJ0ndDae5KGIDT0',
  square: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsJivRYRX_fqq8EQXK7TPmUsulzeeQm4krgXiT8LfBuyuELzP8NXd4Skdh5UySNA8GiajP2c1Kl9ScW30cyp2tiGzCQySg94_W49oEsrEedXx19nZ88t9XbwqVztr5XqSUEJAwI-jSOoMK0oYlnnf7dMJftW6JOAiZoy5qRG8UvH-3ZJStnfphHZ-9AW1WfZtI_QdK1LzbPQVvOWQ7Wfid1OUaEfXX0-JjyTPaOKval79WDIO63XA-c1OBJbU-GW8imz8HXRn-QQA',
  alt: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwWBja2WlkwMwEDyWqAPbwJb3VdYkP8mhKeRUmYl8CZwBZbvLmF5wlw9e6jE_7WqJPJv3qC9fxv4YgW3IE3tnzOHld4PAN7Q2h3-zlwaVeD-3bNYAZF0hJRY29a_tQNfTjU04HseokevddZR5wE0arYZQvEKRtfILNgVv0AzaateA2TrxqMr2Y2ZBpoXNt714OPqgy2pwipH_xC21Orw9LHXHRgY-9GvdTiMBrf1D9-lWyydMF0ncR5hjS00eNqxGwicLjzxTanz8'
};

export const SOCIAL_LOGOS = {
  google: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWp0K-6LW9DOag7uNoZXCH1TA-ua43NsEUj5eXoPclzRaSjOe4O2lCgImWIIWzC-H2DFh31-AtBZVgp9Jp9xASiPUCoiyNYyKwGfpCLfntcQEsALJPUdYcW2bAGcCfsCekX7klX0hmcWsx31VK_q0jMcXkuKREXLW4mJDtB0kPsmziQ3ARXE5ySC_hI5bMt6Y4VYcQCQUHJpO_nVf0zNPIsN3Zkjc83WfXk9lFEUAfB4XM08i1_DEFE2BX_A9rpxTzbNyPNdw4NJY'
};

export const DEFAULT_USER: User = {
  fullName: '',
  email: '',
  isLoggedIn: false,
  trustScore: 0,
  totalRentals: '0',
  isKycVerified: false,
  avatarUrl: ''
};

export const DEFAULT_PRODUCTS: Product[] = [
  // ─── FOTOGRAFI (10 BARANG) ───
  {
    id: 'sony-a7iv-lens',
    name: 'Sony A7 IV + Lens Kit 28-70mm',
    category: 'Fotografi',
    pricePerDay: 350000,
    location: 'Jakarta Barat',
    locationDetail: 'Kec. Palmerah (Binus Anggrek)',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: true,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80'],
    description: 'Sony Alpha A7 IV mendefinisikan ulang standar baru untuk kamera full-frame masa kini. Paket ini sudah dilengkapi dengan lensa zoom standar 28-70mm f/3.5-5.6 yang sangat serbabisa untuk segala kebutuhan dokumentasi, video cinematic, hingga portrait shoot.',
    specs: [
      'Sensor Full-Frame Exmor R CMOS 33.0 MP',
      'Mesin Pemroses BIONZ XR super kencang',
      'Perekaman Video 4K 60p 10-bit 4:2:2',
      'Real-time Eye AF untuk manusia, hewan, dan burung',
      'Stabilisasi Gambar 5-Axis In-Body'
    ]
  },
  {
    id: 'canon-eos-r6',
    name: 'Canon EOS R6 Mirrorless (Body Only)',
    category: 'Fotografi',
    pricePerDay: 320000,
    location: 'Jakarta Selatan',
    locationDetail: 'Kec. Kebayoran Baru',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1619961313053-e4752223d7c6?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1619961313053-e4752223d7c6?w=600&auto=format&fit=crop&q=80'],
    description: 'Canon EOS R6 adalah kamera mirrorless full-frame yang menawarkan kecepatan luar biasa untuk sport photography maupun videografi minim cahaya. Sensor 20MP yang diturunkan dari 1DX Mark III memberikan kualitas gambar noise-free yang legendaris.',
    specs: [
      'Sensor Full-frame CMOS 20 Megapiksel',
      'Prosesor Gambar DIGIC X tangguh',
      'Pengambilan Gambar Kontinu hingga 20 fps',
      'Perekaman Video 4K UHD 60p 10-bit',
      'Stabilisasi Gambar 5-axis In-body (IBIS)'
    ]
  },
  {
    id: 'fujifilm-xt5',
    name: 'Fujifilm X-T5 + Lensa 18-55mm f/2.8-4',
    category: 'Fotografi',
    pricePerDay: 280000,
    location: 'Jakarta Pusat',
    locationDetail: 'Kec. Menteng',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?w=600&auto=format&fit=crop&q=80'],
    description: 'Fujifilm X-T5 mengombinasikan desain retro dial manual yang legendaris dengan teknologi terkini sensor 40 Megapiksel. Sangat cocok bagi fotografer travel yang mengedepankan tone warna film simulation legendaris Fuji.',
    specs: [
      'Sensor APS-C X-Trans CMOS 5 HR 40.2 MP',
      'Film Simulation mode: Nostalgic Neg & Reala Ace',
      'Video 6.2K 30p 10-bit internal recording',
      'Sistem Stabilisasi Gambar 7-Stop IBIS',
      'Lensa Zoom Premium Fujifilm 18-55mm f/2.8-4'
    ]
  },
  {
    id: 'dji-mavic-3',
    name: 'DJI Mavic 3 Cine Premium Combo Drone',
    category: 'Fotografi',
    pricePerDay: 650000,
    location: 'Tangerang',
    locationDetail: 'Kec. Serpong (BSD City)',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: true,
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&auto=format&fit=crop&q=80'],
    description: 'Drone videografi profesional terbaik dengan kamera Hasselblad 4/3 CMOS. Versi Cine mendukung Apple ProRes 422 HQ encoding internal dengan penyimpanan SSD 1TB internal super kencang. Paket Fly More Combo lengkap dengan 3 baterai.',
    specs: [
      'Kamera Hasselblad L2D-20c Sensor 4/3 CMOS',
      'Perekaman Apple ProRes 422 HQ internal',
      'Durasi Terbang Maksimal hingga 46 Menit',
      'Transmisi Video O3+ jangkauan hingga 15km',
      'Sensor rintangan Omnidirectional Omnipresent'
    ]
  },
  {
    id: 'gopro-hero12',
    name: 'GoPro Hero 12 Black Action Camera',
    category: 'Fotografi',
    pricePerDay: 90000,
    location: 'Tangerang',
    locationDetail: 'Kec. Ciputat',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1565849906661-09d665e5d8d5?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1565849906661-09d665e5d8d5?w=600&auto=format&fit=crop&q=80'],
    description: 'Kamera aksi paling tangguh untuk petualangan outdoor, menyelam, bersepeda, hingga motovlog. Dilengkapi HyperSmooth 6.0 untuk video super stabil tanpa goyangan. Paket termasuk mount helm dan tripod mini.',
    specs: [
      'Perekaman Video 5.3K 60fps & 4K 120fps',
      'Stabilisasi Gambar HyperSmooth 6.0 + Horizon Lock',
      'Tahan air tanpa casing hingga kedalaman 10 meter',
      'Daya tahan baterai Enduro tahan suhu dingin',
      'Mendukung Audio Bluetooth untuk Mic nirkabel'
    ]
  },
  {
    id: 'nikon-z6ii',
    name: 'Nikon Z6 II Mirrorless Camera Body',
    category: 'Fotografi',
    pricePerDay: 290000,
    location: 'Depok',
    locationDetail: 'Kec. Cimanggis',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=600&auto=format&fit=crop&q=80'],
    description: 'Nikon Z6 II menghadirkan sensor BSI CMOS 24.5MP dan prosesor EXPEED 6 ganda untuk autofocus cepat dan handal. Sangat disukai fotografer event karena warna kulit (skintone) yang sangat akurat dan tajam.',
    specs: [
      'Sensor BSI CMOS Full-frame 24.5 Megapiksel',
      'Prosesor Gambar EXPEED 6 ganda',
      'Pengambilan Gambar Kontinu 14 fps',
      'Video 4K UHD 60p output via HDMI',
      'Dua slot kartu memori: CFexpress/XQD dan SD'
    ]
  },
  {
    id: 'fujifilm-instax-evo',
    name: 'Fujifilm Instax Mini Evo Hybrid Camera',
    category: 'Fotografi',
    pricePerDay: 60000,
    location: 'Bekasi',
    locationDetail: 'Kec. Bekasi Barat',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80'],
    description: 'Kamera instan hybrid retro yang menggabungkan kemudahan kamera digital dengan sensasi cetak foto instan. Memiliki 100 kombinasi efek lensa dan film untuk hasil foto retro unik.',
    specs: [
      'Layar LCD 3.0 inci untuk review foto sebelum dicetak',
      '10 efek lensa x 10 efek film (100 kombinasi)',
      'Dapat mencetak foto langsung dari smartphone via bluetooth',
      'Penyimpanan kartu memori MicroSD',
      'Menggunakan kertas cetak film Instax Mini standar'
    ]
  },
  {
    id: 'lensa-sony-70200',
    name: 'Lensa Sony FE 70-200mm f/2.8 GM OSS II',
    category: 'Fotografi',
    pricePerDay: 250000,
    location: 'Jakarta Barat',
    locationDetail: 'Kec. Kembangan',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=600&auto=format&fit=crop&q=80'],
    description: 'Lensa zoom telephoto premium G Master generasi kedua yang legendaris. Berat dikurangi hingga 29% dibanding generasi pertama, dengan autofocus super senyap dan tajam ekstrim di semua rentang focal length.',
    specs: [
      'Focal Length: Telephoto Zoom 70-200mm',
      'Aperture Maksimal Konstan f/2.8',
      'Sistem Fokus Linear XD ultra cepat',
      'Optical SteadyShot (OSS) penstabil gambar internal',
      'Bodi kedap debu dan kelembaban cuaca ekstrem'
    ]
  },
  {
    id: 'lighting-godox-sk400',
    name: 'Studio Flash Kit Godox SK400II (2 Light Combo)',
    category: 'Fotografi',
    pricePerDay: 130000,
    location: 'Jakarta Timur',
    locationDetail: 'Kec. Duren Sawit',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&auto=format&fit=crop&q=80'],
    description: 'Paket studio lighting lengkap untuk foto produk, katalog fashion, maupun pas foto. Terdiri dari 2 lampu flash Godox SK400II 400W, 2 softbox 60x90cm, 2 light stand kokoh, dan 1 trigger wireless.',
    specs: [
      'Daya Lampu: 400 Watt per Unit (Dua Lampu)',
      'Sistem Wireless X Godox 2.4G terintegrasi',
      'Suhu Warna Konsisten 5600K',
      'Modeling Lamp 150W yang dapat disesuaikan tingkat dayanya',
      'Bowens mount universal untuk segala jenis modifier'
    ]
  },
  {
    id: 'gimbal-ronin-s',
    name: 'DJI Ronin-S Professional Gimbal Stabilizer',
    category: 'Fotografi',
    pricePerDay: 110000,
    location: 'Jakarta Utara',
    locationDetail: 'Kec. Kelapa Gading',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&auto=format&fit=crop&q=80'],
    description: 'Stabilizer kamera 3-axis profesional untuk kamera DSLR dan mirrorless. Memberikan kestabilan video sinematik kelas hollywood meskipun melakukan pergerakan ekstrim atau berlari.',
    specs: [
      'Kapasitas Beban Maksimal: 3.6 Kilogram',
      'Desain motor offset agar layar LCD kamera tidak terhalang',
      'Baterai Grip tahan hingga 12 jam penggunaan',
      'Fitur kontrol fokus presisi dengan Focus Wheel',
      'Mendukung mode olahraga (Sport Mode) dan timelapse otomatis'
    ]
  },

  // ─── ELEKTRONIK (10 BARANG) ───
  {
    id: 'macbook-m2',
    name: 'MacBook Pro M2 Pro 14-inch',
    category: 'Elektronik',
    pricePerDay: 500000,
    location: 'Depok',
    locationDetail: 'Kec. Pancoran Mas (Depok Baru)',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: true,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80'],
    description: 'MacBook Pro 14" dengan chip Apple M2 Pro menawarkan performa ekstrem yang siap melahap segala kebutuhan pengeditan video 4K/8K, compile kode berskala masif, dan multitasking tanpa hambatan. Layar Liquid Retina XDR yang memukau menawarkan akurasi warna mutlak bagi para desainer profesional.',
    specs: [
      'Apple M2 Pro Chip dengan 10-Core CPU & 16-Core GPU',
      'Unified Memory 16GB RAM',
      'Penyimpanan SSD Super Cepat 512GB',
      'Layar Liquid Retina XDR 14.2 inci ProMotion 120Hz',
      'Daya Tahan Baterai Hingga 18 Jam luar biasa'
    ]
  },
  {
    id: 'ipad-pro-m2',
    name: 'iPad Pro M2 12.9-inch 256GB WiFi',
    category: 'Elektronik',
    pricePerDay: 190000,
    location: 'Jakarta Barat',
    locationDetail: 'Kec. Palmerah (Binus Anggrek)',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80'],
    description: 'Tablet premium terbaik dari Apple ditenagai Chip M2. Layar Liquid Retina XDR Mini-LED memberikan visual super kontras yang indah. Cocok untuk digital artist atau profesional kantor yang butuh mobilitas tinggi. Sudah satu paket dengan Apple Pencil Gen 2.',
    specs: [
      'Chip Apple M2 performa desktop kelas atas',
      'Layar Liquid Retina XDR 12.9 inci Liquid Crystal Mini-LED',
      'Penyimpanan 256GB dengan RAM 8GB',
      'Termasuk Apple Pencil Gen 2 & Magic Keyboard lipat',
      'Port USB-C berkemampuan Thunderbolt 4'
    ]
  },
  {
    id: 'sony-wh1000xm5',
    name: 'Sony WH-1000XM5 ANC Headphone',
    category: 'Elektronik',
    pricePerDay: 120000,
    location: 'Depok',
    locationDetail: 'Kec. Beji (Margonda)',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'],
    description: 'Headphone Over-Ear nirkabel kelas atas dengan peredam bising terbaik di dunia. Memberikan kualitas audio resolusi tinggi tanpa tandingan, panggilan sejernih kristal berkat AI micro-directional pickup, dan kenyamanan pemakaian luar biasa sepanjang hari.',
    specs: [
      'Teknologi Noise Cancelling Terbaik (ANC) Auto NC Optimizer',
      'Driver Kustom 30mm untuk Suara Audiophile presisi',
      'LDAC berkode audio resolusi tinggi / Hi-Res Audio Wireless',
      'Daya Tahan Baterai Hingga 30 Jam dengan pengisian cepat',
      'Fitur Speak-to-Chat otomatis menghentikan lagu saat berbicara'
    ]
  },
  {
    id: 'samsung-tab-s9',
    name: 'Samsung Galaxy Tab S9 Ultra 12/256GB',
    category: 'Elektronik',
    pricePerDay: 210000,
    location: 'Jakarta Selatan',
    locationDetail: 'Kec. Setiabudi',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&auto=format&fit=crop&q=80'],
    description: 'Tablet Android termegah dengan layar raksasa Dynamic AMOLED 2X 14.6 inci. Sangat tangguh dan sudah bersertifikasi tahan air/debu IP68. Cocok untuk menggantikan laptop saat meeting di luar. Termasuk S-Pen.',
    specs: [
      'Layar Raksasa 14.6 inci Dynamic AMOLED 2X 120Hz',
      'Prosesor Snapdragon 8 Gen 2 for Galaxy',
      'Proteksi Tahan Air dan Debu IP68 (Tablet & S-Pen)',
      'RAM 12GB dengan Penyimpanan 256GB (MicroSD Expandable)',
      'Sudah satu paket dengan S-Pen original'
    ]
  },
  {
    id: 'kindle-paperwhite',
    name: 'Amazon Kindle Paperwhite 5 (11th Gen) 16GB',
    category: 'Elektronik',
    pricePerDay: 40000,
    location: 'Jakarta Barat',
    locationDetail: 'Kec. Grogol Petamburan',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80'],
    description: 'E-reader terbaik dengan layar e-ink yang tidak melelahkan mata seperti layar LCD smartphone/tablet. Tampilan tulisan menyerupai kertas cetak asli. Baterai awet berbulan-bulan.',
    specs: [
      'Layar E-ink Carta 6.8 inci bebas pantulan cahaya matahari',
      'Kerapatan Piksel 300 ppi, teks sangat tajam',
      'Pengaturan Cahaya Layar hangat (Warm Light) otomatis',
      'Tahan air IPX8 aman dibaca di kolam renang/bathtub',
      'Kapasitas Memori 16GB memuat ribuan e-book'
    ]
  },
  {
    id: 'printer-portable-hp',
    name: 'HP OfficeJet 200 Portable Wireless Printer',
    category: 'Elektronik',
    pricePerDay: 95000,
    location: 'Jakarta Timur',
    locationDetail: 'Kec. Jatinegara',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59edd6?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1612815154858-60aa4c59edd6?w=600&auto=format&fit=crop&q=80'],
    description: 'Printer mobile super ringkas dengan baterai internal yang dapat dibawa bepergian. Cocok untuk mencetak dokumen rapat, kuitansi, atau tugas di lokasi tanpa colokan listrik.',
    specs: [
      'Mencetak secara nirkabel via HP ePrint & WiFi Direct',
      'Baterai Lithium-ion internal dapat diisi ulang cepat',
      'Kecepatan Cetak hingga 9-10 halaman per menit',
      'Kapasitas Input kertas hingga 50 lembar',
      'Mendukung cetak warna dokumen berkualitas tinggi'
    ]
  },
  {
    id: 'dyson-airwrap',
    name: 'Dyson Airwrap Multi-Styler Complete Long',
    category: 'Elektronik',
    pricePerDay: 180000,
    location: 'Jakarta Utara',
    locationDetail: 'Kec. Penjaringan (PIK)',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80'],
    description: 'Styler penata rambut premium tanpa panas ekstrem yang tidak merusak rambut. Menggunakan efek Coanda aerodinamis untuk mengeriting, meluruskan, dan mengeringkan rambut secara natural.',
    specs: [
      'Motor V9 digital Dyson berkecepatan tinggi',
      'Pengatur Panas Pintar (mengukur suhu 40x per detik)',
      'Dilengkapi 6 kepala penata rambut (long barrels, brushes, dll)',
      'Panjang kabel 2.6 meter fleksibel',
      'Termasuk kotak penyimpanan eksklusif kulit mewah'
    ]
  },
  {
    id: 'anker-powerhouse',
    name: 'Anker 521 Portable Power Station 256Wh',
    category: 'Elektronik',
    pricePerDay: 80000,
    location: 'Tangerang Selatan',
    locationDetail: 'Kec. Serpong Utara (Graha Raya)',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=600&auto=format&fit=crop&q=80'],
    description: 'Genset baterai portable (power station) berteknologi LiFePO4 yang awet hingga 10 tahun penggunaan. Cocok untuk memberi daya gadget, lampu, kulkas mini, dan drone saat berkemah di gunung.',
    specs: [
      'Kapasitas Baterai 256Wh LiFePO4 (Tahan Lama)',
      'Port Lengkap: AC Out 200W, USB-C 60W, 2x USB-A, Car Socket',
      'Layar LCD informatif kapasitas dan daya masuk/keluar',
      'Lampu LED built-in untuk penerangan darurat malam hari',
      'Bobot Ringan hanya 4.3 Kilogram mudah dijinjing'
    ]
  },
  {
    id: 'asus-zenscreen',
    name: 'Asus ZenScreen MB16AH Portable Monitor',
    category: 'Elektronik',
    pricePerDay: 75000,
    location: 'Jakarta Barat',
    locationDetail: 'Kec. Kebon Jeruk',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80'],
    description: 'Monitor portable 15.6 inci super tipis untuk menambah ruang kerja dual-screen laptop Anda saat bekerja di kafe. Menggunakan koneksi praktis USB Type-C atau Micro-HDMI.',
    specs: [
      'Layar 15.6 inci resolusi Full HD (1920x1080) IPS',
      'Konektivitas Dual: USB-C (DisplayPort) & Micro-HDMI',
      'Desain Ultra-Thin tebal hanya 9mm, bobot 730g',
      'Dilengkapi dengan Smart Sleeve lipat yang jadi stand monitor',
      'Fitur Asus Eye Care (Flicker-free & Blue Light Filter)'
    ]
  },
  {
    id: 'huion-kamvas',
    name: 'Huion Kamvas Pro 16 Pen Display Tablet',
    category: 'Elektronik',
    pricePerDay: 110000,
    location: 'Bekasi',
    locationDetail: 'Kec. Bekasi Selatan',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&auto=format&fit=crop&q=80'],
    description: 'Monitor menggambar (pen display) profesional dengan layar laminasi penuh anti-glare. Memberikan akurasi warna luar biasa untuk kebutuhan ilustrasi digital, 3D sculpting, dan editing foto.',
    specs: [
      'Layar 15.6 inci IPS Laminasi Penuh resolusi Full HD',
      'Akurasi Warna: 120% sRGB dengan sudut pandang lebar 178°',
      'Stylus Bebas Baterai PW507 dengan 8192 tingkat tekanan',
      'Mendukung sudut kemiringan (tilt function) pena hingga ±60°',
      '6 Tombol Pintasan (Express Keys) & 1 Touch Bar slider'
    ]
  },

  // ─── PERALATAN CAMPING (10 BARANG) ───
  {
    id: 'tenda-eiger',
    name: 'Tenda Eiger 4P Outpost Dome',
    category: 'Peralatan Camping',
    pricePerDay: 85000,
    location: 'Jakarta Barat',
    locationDetail: 'Kec. Palmerah (Binus Syahdan)',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&auto=format&fit=crop&q=80'],
    description: 'Tenda dome double-layer ultra-kokoh berkapasitas 4 orang yang dirancang khusus untuk menghadapi cuaca gunung ekstrem. Flysheet tahan bocor berkat lapisan PU 3000mm yang menjamin kenyamanan tidur Anda meskipun badai hujan di luar tenda.',
    specs: [
      'Kapasitas Maksimal: 4 Orang Dewasa',
      'Lapisan PU Tahan Air PU 3000mm dengan seam taping penuh',
      'Bahan Frame Fiber Glass kuat dan lentur',
      'Ventilasi jala anti nyamuk untuk sirkulasi optimal',
      'Dilengkapi vestibule depan yang lega untuk memasak'
    ]
  },
  {
    id: 'coleman-sleepingbag',
    name: 'Sleeping Bag Coleman Mummy Style (Suhu Ekstrem)',
    category: 'Peralatan Camping',
    pricePerDay: 35000,
    location: 'Jakarta Timur',
    locationDetail: 'Kec. Pulogadung',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=600&auto=format&fit=crop&q=80'],
    description: 'Kantong tidur hangat model mumi dari Coleman. Dirancang untuk menjaga suhu tubuh tetap nyaman di dataran tinggi dengan cuaca sangat dingin hingga 0°C. Bahan dalam polar katun lembut.',
    specs: [
      'Rating Suhu: 0°C hingga 10°C (Ekstrem)',
      'Desain Model Mumi berkerudung tali serut hangat',
      'Bahan Luar Polyester ripstop tahan angin lembab',
      'Bahan Dalam Dakron & Katun Polar tebal lembut',
      'Termasuk tas kompresi agar packing ringkas'
    ]
  },
  {
    id: 'deuter-carrier',
    name: 'Tas Carrier Deuter Aircontact Pro 60+15L',
    category: 'Peralatan Camping',
    pricePerDay: 75000,
    location: 'Depok',
    locationDetail: 'Kec. Beji (Pondok Cina)',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: true,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80'],
    description: 'Tas gunung premium berkapasitas total 75 Liter dengan backsystem Aircontact terbaik yang sangat empuk dan mendistribusikan beban secara proporsional di punggung. Cocok untuk pendakian ekspedisi 3-5 hari.',
    specs: [
      'Kapasitas: 60 Liter + 15 Liter ekspansi atas',
      'Sistem Punggung: Aircontact VariQuick penyesuaian tinggi pundak',
      'Bantalan pinggul empuk dengan kantong zipper',
      'Sudah termasuk Rain Cover anti-badai Deuter oranye',
      'Bahan Nylon Ballistic tebal anti sobek batu gunung'
    ]
  },
  {
    id: 'kovea-stove',
    name: 'Kompor Camping Kovea Wind Baster (Windproof)',
    category: 'Peralatan Camping',
    pricePerDay: 25000,
    location: 'Tangerang',
    locationDetail: 'Kec. Karawaci',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=600&auto=format&fit=crop&q=80'],
    description: 'Kompor lipat portabel dengan sistem perlindungan angin terintegrasi (windproof). Pengapian sangat stabil dan kencang meski ditiup angin kencang di puncak gunung. Menggunakan gas kaleng ulir/butana standard.',
    specs: [
      'Konsumsi Gas: 140 gram/jam dengan api biru fokus',
      'Sistem Pemantik piezoelektrik built-in instan',
      'Pelindung angin built-in model mangkuk lebar',
      'Braket tatakan panci bergerigi anti-selip',
      'Dilengkapi kotak penyimpanan plastik keras'
    ]
  },
  {
    id: 'naturehike-chair',
    name: 'Kursi Lipat Naturehike Aluminium Portable',
    category: 'Peralatan Camping',
    pricePerDay: 20000,
    location: 'Jakarta Barat',
    locationDetail: 'Kec. Kalideres',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=600&auto=format&fit=crop&q=80'],
    description: 'Kursi camping lipat ultra ringan dengan rangka aluminium alloy berkualitas tinggi. Sangat stabil, nyaman diduduki di depan tenda sambil ngopi, dan ringkas dilipat.',
    specs: [
      'Bahan Rangka: 7075 Aluminium Alloy antikarat',
      'Bahan Dudukan: Kain Oxford 600D tebal tahan gesek',
      'Kapasitas Beban Maksimal: 120 Kilogram',
      'Dimensi Lipat: 37 x 9 cm super hemat tempat',
      'Dilengkapi tas jinjing bertali untuk ditaruh di luar tas'
    ]
  },
  {
    id: 'black-diamond-headlamp',
    name: 'Headlamp Black Diamond Storm 400 Lumens',
    category: 'Peralatan Camping',
    pricePerDay: 15000,
    location: 'Jakarta Selatan',
    locationDetail: 'Kec. Cilandak',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&auto=format&fit=crop&q=80'],
    description: 'Senter kepala (headlamp) taktis berspesifikasi militer dengan kecerahan hingga 400 lumens. Tahan air penuh, tangguh menghadapi badai salju/hujan, dan memiliki mode lampu merah untuk malam hari.',
    specs: [
      'Kekuatan Cahaya: Hingga 400 Lumens (Sangat Terang)',
      'Sertifikasi Tahan Air: IP67 (Tahan tenggelam 1m selama 30 menit)',
      'Mode Lampu: Sorot Jauh, Redup, Strobo, Merah, Hijau, Biru',
      'Menggunakan 4 baterai AAA standard (diberikan penuh)',
      'Fitur memori kecerahan (mengingat setting terakhir)'
    ]
  },
  {
    id: 'nesting-cookset',
    name: 'Nesting Cooking Set DS-308 (Untuk 3-4 Orang)',
    category: 'Peralatan Camping',
    pricePerDay: 18000,
    location: 'Depok',
    locationDetail: 'Kec. Sawangan',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&auto=format&fit=crop&q=80'],
    description: 'Satu set peralatan masak camping komplit berbahan aluminium anodized anti-lengket. Dilengkapi teko air mini, panci sup, wajan penggorengan, dan mangkuk saji plastik ringan.',
    specs: [
      'Bahan: Hard Anodized Aluminium anti-karat ringan',
      'Isi Paket: 1 Panci Besar, 1 Panci Kecil, 1 Wajan, 1 Teko, 3 Mangkuk Plastik, 1 Sendok Nasi, 1 Spons',
      'Gagang Lipat dilapisi silikon pelindung panas merah',
      'Desain nesting (semua alat bisa disusun masuk ke dalam panci utama)',
      'Termasuk kantong jaring pelindung packing'
    ]
  },
  {
    id: 'coolerbox-igloo',
    name: 'Cooler Box Igloo Latitude 50 Qt (47 Liter)',
    category: 'Peralatan Camping',
    pricePerDay: 55000,
    location: 'Tangerang',
    locationDetail: 'Kec. Pinang',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=600&auto=format&fit=crop&q=80'],
    description: 'Kotak pendingin portable berkapasitas besar buatan Amerika Serikat. Menjaga es tetap beku dan bahan makanan/minuman tetap dingin hingga 3 hari di cuaca panas pantai.',
    specs: [
      'Kapasitas: 47 Liter (Muat hingga 85 kaleng soda)',
      'Teknologi Insulasi Cool Riser meningkatkan retensi suhu dingin',
      'Dilengkapi dengan 4 tempat gelas/cup holder pada tutup atas',
      'Saluran pembuangan air es mencair di bagian samping bawah',
      'Gagang samping kokoh dengan penahan beban berat'
    ]
  },
  {
    id: 'hammock-tttm',
    name: 'Hammock Ticket to the Moon Double Size',
    category: 'Peralatan Camping',
    pricePerDay: 20000,
    location: 'Tangerang Selatan',
    locationDetail: 'Kec. Pamulang',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80'],
    description: 'Tempat tidur gantung (hammock) sutra parasut original berukuran double yang sangat luas dan nyaman. Bahan breathable dan cepat kering. Sudah termasuk tali pengikat (straps) premium.',
    specs: [
      'Bahan: Sutra Parasut High-grade Nylon elastis lembut',
      'Dimensi: 320 x 200 cm (Double Size)',
      'Kapasitas Beban Maksimal: 200 Kilogram',
      'Berat Hammock: Hanya 600 gram sangat ringan dibawa',
      'Sudah termasuk 2 tali pengikat nylon tebal (masing-masing 3m)'
    ]
  },
  {
    id: 'binocular-bushnell',
    name: 'Binokular Bushnell PowerView 10x42 (Teropong)',
    category: 'Peralatan Camping',
    pricePerDay: 30000,
    location: 'Jakarta Barat',
    locationDetail: 'Kec. Palmerah (Binus Anggrek)',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=600&auto=format&fit=crop&q=80'],
    description: 'Teropong binokular optik berkualitas tinggi dari Bushnell. Memberikan perbesaran gambar 10x yang sangat tajam dan jernih. Sangat cocok untuk mengamati burung liar, lanskap alam, atau konser.',
    specs: [
      'Perbesaran Optik: 10x dengan diameter lensa objektif 42mm',
      'Sistem Optik Prisma Roof BK-7 tajam',
      'Bahan Lapis Karet (Rubber armored) tahan benturan ringan',
      'Kenop fokus tengah besar untuk penyetelan gambar cepat',
      'Termasuk tas pelindung kain, strap leher, dan lap pembersih'
    ]
  },

  // ─── GAMING (10 BARANG) ───
  {
    id: 'ps5-console',
    name: 'PlayStation 5 Slim (2 Stick + Game Pilihan)',
    category: 'Gaming',
    pricePerDay: 130000,
    location: 'Jakarta Pusat',
    locationDetail: 'Kec. Menteng (Cikini)',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80'],
    description: 'PlayStation 5 Slim versi terbaru dengan SSD 1TB super cepat. Sudah lengkap dengan 2 unit DualSense controller dan beberapa game populer seperti FIFA 24 (FC 24), Marvel\'s Spider-Man 2, dan GTA V. Unit sangat terawat, selalu dibersihkan, siap pakai.',
    specs: [
      'SSD Kustom Ultra-High Speed 1TB',
      'Support Output TV HDR 4K 120Hz',
      'Teknologi Audio 3D Tempest',
      'Termasuk 2 controller DualSense',
      'Dilengkapi kabel HDMI & Power original'
    ]
  },
  {
    id: 'xbox-series-x',
    name: 'Xbox Series X Console 1TB SSD',
    category: 'Gaming',
    pricePerDay: 130000,
    location: 'Jakarta Selatan',
    locationDetail: 'Kec. Kebayoran Baru',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1621259182978-f09e5e2b07ae?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1621259182978-f09e5e2b07ae?w=600&auto=format&fit=crop&q=80'],
    description: 'Konsol game terkuat dari Microsoft dengan visual grafis 4K native yang memukau. Sudah termasuk langganan Xbox Game Pass Ultimate aktif agar Anda dapat memainkan ratusan game gratis sepuasnya.',
    specs: [
      'Prosesor Kustom AMD Zen 2 & RDNA 2 berdaya 12 Teraflops',
      'Penyimpanan SSD NVMe 1TB super cepat (Quick Resume)',
      'Termasuk 1 unit Controller Wireless Xbox Carbon Black',
      'Termasuk Langganan Game Pass Ultimate aktif gratis selama sewa',
      'Output Video 4K @ 120fps dengan Dolby Vision HDR'
    ]
  },
  {
    id: 'nintendo-switch',
    name: 'Nintendo Switch OLED Model Neon Blue/Red',
    category: 'Gaming',
    pricePerDay: 65000,
    location: 'Depok',
    locationDetail: 'Kec. Pancoran Mas',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: true,
    image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&auto=format&fit=crop&q=80'],
    description: 'Handheld konsol Nintendo Switch versi OLED dengan layar warna super vibran dan bezel tipis. Paket sewa sudah termasuk Docking TV, HDMI, dan game seru: Mario Kart 8, Zelda Breath of the Wild, dan FC 24.',
    specs: [
      'Layar OLED 7.0 inci super kontras tajam warna-warni',
      'Penyimpanan Internal 64GB dengan MicroSD tambahan 128GB',
      'Dudukan/stand belakang lebar yang dapat disesuaikan sudutnya',
      'Termasuk Dock dengan port LAN kabel built-in',
      'Sudah diisi 5 game digital populer terinstal siap main'
    ]
  },
  {
    id: 'meta-quest-3',
    name: 'Meta Quest 3 VR Headset 128GB (Virtual Reality)',
    category: 'Gaming',
    pricePerDay: 160000,
    location: 'Jakarta Barat',
    locationDetail: 'Kec. Palmerah (Binus Syahdan)',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=600&auto=format&fit=crop&q=80'],
    description: 'Headset Virtual Reality (VR) generasi terbaru yang tidak memerlukan PC eksternal (standalone). Mendukung fitur mixed reality warna (color passthrough) untuk menggabungkan dunia nyata dan game virtual secara mulus.',
    specs: [
      'Chipset Snapdragon XR2 Gen 2 grafis super detail',
      'Layar Resolusi 4K+ Infinite Display (2064x2208 per mata)',
      '2 Kontroler Touch Plus dengan haptic feedback presisi',
      'Fitur Mixed Reality Passthrough warna beresolusi tinggi',
      'Kapasitas Memori 128GB dengan puluhan game VR terinstal'
    ]
  },
  {
    id: 'rog-laptop',
    name: 'ASUS ROG Strix Gaming Laptop (RTX 4060)',
    category: 'Gaming',
    pricePerDay: 350000,
    location: 'Jakarta Barat',
    locationDetail: 'Kec. Palmerah (Binus Kijang)',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80'],
    description: 'Laptop gaming kelas berat dengan kartu grafis Nvidia RTX 4060. Siap melibas game kompetitif (Valorant, CS2) dengan fps ratusan, maupun game petualangan AAA (Cyberpunk 2077) dengan lancar grafis rata kanan.',
    specs: [
      'Prosesor Intel Core i7 Generasi ke-13 kencang',
      'Kartu Grafis NVIDIA GeForce RTX 4060 Laptop GPU 8GB GDDR6',
      'RAM 16GB DDR5 Dual Channel, SSD 512GB NVMe Gen4',
      'Layar 16 inci WUXGA refresh rate cepat 165Hz IPS-level',
      'Keyboard dengan lampu latar RGB 4-zona dinamis'
    ]
  },
  {
    id: 'steam-deck',
    name: 'Steam Deck OLED 512GB Handheld PC',
    category: 'Gaming',
    pricePerDay: 110000,
    location: 'Depok',
    locationDetail: 'Kec. Beji (Kukusan)',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80'],
    description: 'PC Gaming genggam bersistem operasi SteamOS. Anda dapat memainkan koleksi game PC di akun Steam Anda (seperti Cyberpunk, Elden Ring, Hogwarts Legacy) secara portabel di kasur maupun perjalanan.',
    specs: [
      'Layar sentuh OLED HDR 7.4 inci 90Hz warna menawan',
      'APU Kustom AMD APU 6nm hemat daya baterai',
      'Penyimpanan SSD NVMe 512GB dengan slot MicroSD tambahan',
      'Daya tahan baterai hingga 3-9 jam (tergantung berat game)',
      'Sudah terinstal launcher Steam siap diisi akun Anda'
    ]
  },
  {
    id: 'razer-keyboard',
    name: 'Keyboard Mechanical Razer Huntsman V2 TKL',
    category: 'Gaming',
    pricePerDay: 25000,
    location: 'Tangerang',
    locationDetail: 'Kec. Karawaci',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80'],
    description: 'Keyboard gaming mekanikal super cepat dengan switch optikal analog dari Razer. Desain ringkas tanpa tombol numerik (Tenkeyless) agar ruang gerak mouse gaming lebih bebas.',
    specs: [
      'Razer Clicky Optical Switches (Instan tanpa delay debounce)',
      'Polling Rate hingga 8000Hz super responsif',
      'Bantalan pergelangan tangan (wrist rest) busa kulit empuk magnetik',
      'Tombol keycap PBT double-shot tebal bertekstur kasar',
      'Lampu latar RGB Chroma legendaris Razer customizable'
    ]
  },
  {
    id: 'logitech-gpro-mouse',
    name: 'Mouse Gaming Logitech G Pro X Superlight White',
    category: 'Gaming',
    pricePerDay: 20000,
    location: 'Jakarta Barat',
    locationDetail: 'Kec. Kembangan',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80'],
    description: 'Mouse gaming nirkabel pilihan utama para atlet esports profesional di seluruh dunia. Bobotnya super ringan kurang dari 63 gram, dengan sensor HERO 25K yang sangat akurat tanpa slip.',
    specs: [
      'Bobot Ringan: Kurang dari 63 Gram tanpa mengorbankan durabilitas',
      'Teknologi Nirkabel LIGHTSPEED responsif nol-interferensi',
      'Sensor HERO 25K dengan rentang 100 - 25.600 DPI',
      'Kaki mouse berbahan PTFE murni untuk gesekan licin di mousepad',
      'Daya tahan baterai hingga 70 jam penggunaan aktif'
    ]
  },
  {
    id: 'thrustmaster-wheel',
    name: 'Thrustmaster T300 RS GT Steering Wheel Set',
    category: 'Gaming',
    pricePerDay: 90000,
    location: 'Jakarta Selatan',
    locationDetail: 'Kec. Tebet',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80'],
    description: 'Simulator setir balap (force feedback) profesional untuk game balap mobil (Gran Turismo, Assetto Corsa, F1). Sensasi getaran setir sangat mirip mobil balap sungguhan. Kompatibel dengan PS5, PS4, dan PC.',
    specs: [
      'Motor Brushless berkekuatan force feedback 25 Watt kencang',
      'Sudut putar setir dapat disetel hingga 1080°',
      'Pedal set T3PA GT Edition dengan 3 pedal besi kokoh',
      'Roda setir diameter 28cm dilapisi karet bertekstur nyaman',
      'Sistem klem meja yang aman tidak mudah bergeser'
    ]
  },
  {
    id: 'gaming-chair-secretlab',
    name: 'Kursi Gaming Secretlab Titan EVO (Fabric Black)',
    category: 'Gaming',
    pricePerDay: 70000,
    location: 'Tangerang',
    locationDetail: 'Kec. Cipondoh',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1598550476439-6847785fce6e?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1598550476439-6847785fce6e?w=600&auto=format&fit=crop&q=80'],
    description: 'Kursi ergonomis premium terbaik untuk para gamer maupun pekerja kantoran yang duduk berjam-jam di depan komputer. Meminimalkan pegal di pinggang dan leher secara signifikan.',
    specs: [
      'Bahan: Kain SoftWeave® Plus Breathable dingin di kulit',
      'Sistem Lumbar L-ADAPT 4-arah penahan tulang belakang',
      'Sandaran Tangan (Armrest) 4D dapat diatur ke segala arah',
      'Mendukung sudut rebah sandaran (reclining) hingga 165°',
      'Dilengkapi bantal kepala busa memori magnetik berpendingin gel'
    ]
  },

  // ─── AUDIO (10 BARANG) ───
  {
    id: 'rode-wireless-go',
    name: 'Rode Wireless GO II Dual Channel Mic',
    category: 'Audio',
    pricePerDay: 95000,
    location: 'Bandung',
    locationDetail: 'Kec. Coblong (Dago)',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80'],
    description: 'Sistem mikrofon nirkabel ultra-ringkas dual-channel yang ideal untuk kebutuhan wawancara, vlogging, podcast, dan pembuatan konten media sosial. Suara sangat jernih dan noise-free.',
    specs: [
      'Transmisi digital seri IV 2.4GHz',
      'Jangkauan transmisi hingga 200m',
      'Baterai tahan hingga 7 jam',
      'Output analog 3.5mm TRS & digital USB-C',
      'Dua transmitter dan satu receiver'
    ]
  },
  {
    id: 'jbl-partybox',
    name: 'JBL PartyBox 100 Speaker Bluetooth',
    category: 'Audio',
    pricePerDay: 150000,
    location: 'Tangerang',
    locationDetail: 'Kec. Serpong (BSD)',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: true,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80'],
    description: 'Speaker portable berkekuatan suara dahsyat khas JBL dengan pertunjukan lampu LED dinamis. Sangat cocok untuk acara kumpul keluarga, ulang tahun, gathering, atau camping outdoor.',
    specs: [
      'Output power 160 Watt RMS',
      'Baterai rechargeable hingga 12 jam',
      'Koneksi Bluetooth, USB, Aux, Mic & Gitar',
      'Fitur Bass Boost opsional',
      'Tahan percikan air ringan'
    ]
  },
  {
    id: 'shure-sm7b',
    name: 'Shure SM7B Vocal Studio Microphone',
    category: 'Audio',
    pricePerDay: 90000,
    location: 'Jakarta Barat',
    locationDetail: 'Kec. Kebon Jeruk',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1583244964261-2db9043266b7?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1583244964261-2db9043266b7?w=600&auto=format&fit=crop&q=80'],
    description: 'Mikrofon dinamis legendaris standar industri radio dan podcast profesional. Menghasilkan suara vokal yang bulat, tebal, dan meredam suara dengung ruangan secara maksimal. Memerlukan audio interface.',
    specs: [
      'Tipe: Mikrofon Dinamis dengan respons frekuensi datar',
      'Pola Polar: Kardioid (fokus suara dari depan saja)',
      'Pelindung hembusan angin internal (pop filter built-in)',
      'Sistem shock mounting penahan getaran meja',
      'Memerlukan gain kuat (cocok dipadankan dengan Cloudlifter)'
    ]
  },
  {
    id: 'sennheiser-hd600',
    name: 'Sennheiser HD 600 Audiophile Headphones',
    category: 'Audio',
    pricePerDay: 85000,
    location: 'Bandung',
    locationDetail: 'Kec. Sumur Bandung',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop&q=80'],
    description: 'Headphone open-back legendaris rujukan utama bagi para sound engineer profesional untuk kebutuhan mixing dan mastering audio. Kualitas suara super transparan, akurat, dan panggung suara (soundstage) luas.',
    specs: [
      'Tipe Headphone: Open-back Sirkumaural (Over-ear)',
      'Impedansi Tinggi: 300 Ohm (Memerlukan headphone amplifier)',
      'Respons Frekuensi: 12 - 40.500 Hz sangat detail',
      'Kabel tembaga OFC yang dapat dilepas pasang',
      'Bantalan telinga kain beludru mewah sangat nyaman'
    ]
  },
  {
    id: 'pioneer-dj-controller',
    name: 'Pioneer DDJ-FLX4 DJ Controller Set',
    category: 'Audio',
    pricePerDay: 150000,
    location: 'Jakarta Selatan',
    locationDetail: 'Kec. Senayan',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1571330735066-03add07b417d?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1571330735066-03add07b417d?w=600&auto=format&fit=crop&q=80'],
    description: 'Alat kontrol DJ 2-channel terbaru yang sangat populer untuk pemula maupun profesional. Kompatibel penuh dengan software Rekordbox dan Serato DJ Lite. Dilengkapi fitur Smart Fader pencampur lagu otomatis.',
    specs: [
      'Layout DJ standar klub malam Pioneer DJ',
      'Fitur Smart Fader & Smart Color FX untuk transisi mudah',
      'Konektivitas USB Type-C ke laptop, tablet, atau smartphone',
      'Input Mikrofon jack 1/4 inci jernih langsung ke master output',
      'Termasuk lisensi software Rekordbox DJ bawaan'
    ]
  },
  {
    id: 'bose-quietcomfort',
    name: 'Bose QuietComfort Ultra Noise Cancelling Headphone',
    category: 'Audio',
    pricePerDay: 130000,
    location: 'Jakarta Utara',
    locationDetail: 'Kec. Kelapa Gading',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80'],
    description: 'Headphone premium Bose dengan kenyamanan legendaris dan peredam bising terbaik. Dilengkapi fitur Immersive Audio untuk efek suara spasial seperti mendengarkan konser langsung.',
    specs: [
      'Mode Peredam Bising: Quiet Mode, Aware Mode, Immersion Mode',
      'Fitur Audio Spasial Bose Immersive Audio built-in',
      'Kalibrasi Audio CustomTune menyesuaikan bentuk telinga Anda',
      'Daya tahan baterai hingga 24 jam sekali cas',
      'Bahan earpad kulit sintetis mewah sangat kedap udara'
    ]
  },
  {
    id: 'yamaha-mixer',
    name: 'Yamaha MG10XU 10-Channel Audio Mixer',
    category: 'Audio',
    pricePerDay: 90000,
    location: 'Depok',
    locationDetail: 'Kec. Limo',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&auto=format&fit=crop&q=80'],
    description: 'Mixer audio 10-channel multiguna yang sangat handal untuk panggung musik kecil, rumah ibadah, podcast multi-orang, atau live streaming. Dilengkapi efek reverb SPX digital berkualitas tinggi.',
    specs: [
      'Konsol Mixer 10-Channel: 4 Mic/Line input, 3 Stereo line input',
      'Preamp Mikrofon D-PRE kelas studio dengan sirkuit Darlington',
      'Kompresor Satu Tombol (1-Knob Compressors) pada channel utama',
      'Prosesor Efek Digital SPX dengan 24 program pilihan preset',
      'Fungsi Audio USB interface 2-in/2-out 24-bit/192kHz'
    ]
  },
  {
    id: 'focusrite-scarlett',
    name: 'Focusrite Scarlett 2i2 4th Gen Audio Interface',
    category: 'Audio',
    pricePerDay: 50000,
    location: 'Jakarta Barat',
    locationDetail: 'Kec. Palmerah (Binus Anggrek)',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=600&auto=format&fit=crop&q=80'],
    description: 'Soundcard (audio interface) USB paling laris untuk rekaman vokal dan gitar di rumah. Dilengkapi dengan preamp berfitur Air Mode untuk memberi sentuhan frekuensi tinggi vokal berkarakter.',
    specs: [
      '2 Preamplifier mikrofon dengan gain super besar 69dB',
      'Fitur Auto Gain & Clip Safe mencegah rekaman pecah otomatis',
      'Air Mode untuk menambah karakter vokal renyah berkilau',
      'Converter resolusi tinggi 24-bit / 192kHz kelas studio',
      'Mendukung koneksi langsung instrumen gitar/bass hi-Z'
    ]
  },
  {
    id: 'audio-technica-turntable',
    name: 'Audio-Technica AT-LP120XUSB Turntable',
    category: 'Audio',
    pricePerDay: 110000,
    location: 'Jakarta Selatan',
    locationDetail: 'Kec. Mampang Prapatan',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1539625319138-0139950cdab7?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1539625319138-0139950cdab7?w=600&auto=format&fit=crop&q=80'],
    description: 'Pemutar piringan hitam (turntable) analog berkualitas tinggi dengan motor direct-drive torsi kuat. Dilengkapi port USB terintegrasi untuk mendigitalkan koleksi piringan hitam Anda ke komputer.',
    specs: [
      'Motor Direct-drive DC servo berputar stabil tanpa slip belt',
      'Pilihan Kecepatan Putar: 33-1/3 RPM, 45 RPM, dan 78 RPM',
      'Preamplifier phono internal yang dapat dinyalakan/dimatikan',
      'Cartridge Phono AT-VM95E Dual Magnet jarum hijau premium',
      'Tonearm berbentuk S dengan kontrol redaman hidrolik'
    ]
  },
  {
    id: 'marshall-stanmore',
    name: 'Marshall Stanmore II Home Bluetooth Speaker',
    category: 'Audio',
    pricePerDay: 80000,
    location: 'Tangerang',
    locationDetail: 'Kec. Cipondoh',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=600&auto=format&fit=crop&q=80'],
    description: 'Speaker aktif bluetooth bergaya retro rock n roll klasik khas Marshall. Menghasilkan suara vokal yang renyah dan bass dalam yang seimbang untuk melengkapi ruang tamu Anda.',
    specs: [
      'Daya Output: Total 80 Watt RMS (Class D Amplifiers)',
      'Konektivitas Bluetooth 5.0 aptX berkualitas CD tanpa delay',
      'Input Analog: Jack Aux 3.5mm dan Input kabel RCA',
      'Kenop Kontrol Manual atas: Volume, Bass, Treble warna kuningan',
      'Aplikasi pendukung Marshall Bluetooth untuk update firmware'
    ]
  },

  // ─── FASHION (10 BARANG) ───
  {
    id: 'hugo-boss-tuxedo',
    name: 'Jas Tuxedo Premium Hugo Boss (Size M/L)',
    category: 'Fashion',
    pricePerDay: 200000,
    location: 'Jakarta Selatan',
    locationDetail: 'Kec. Senayan',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&auto=format&fit=crop&q=80'],
    description: 'Jas formal Tuxedo original dari Hugo Boss berwarna hitam pekat klasik. Sangat cocok untuk acara pernikahan formal, wisuda, prom night, gala dinner, atau red carpet event. Kondisi laundry wangi.',
    specs: [
      'Bahan Wool Premium 100% Italia',
      'Termasuk Jas, Celana, Rompi, & Bow Tie',
      'Fit type: Slim Fit modern',
      'Size Jas 48 (setara M-L lokal)',
      'Lebar dada 52cm, Celana size 32'
    ]
  },
  {
    id: 'kebaya-encim-silk',
    name: 'Kebaya Encim Brokat Sutra (Size S/M) + Selendang',
    category: 'Fashion',
    pricePerDay: 90000,
    location: 'Jakarta Barat',
    locationDetail: 'Kec. Kebon Jeruk',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80'],
    description: 'Kebaya encim tradisional bergaya peranakan modern dari bahan sutra halus bermotif bordir bunga handmade. Sangat elegan untuk lamaran, kondangan, kartinian, atau acara wisuda kelulusan.',
    specs: [
      'Bahan: Kombinasi Sutra Organza & Bordir manual',
      'Termasuk: Kebaya Atasan, Rok Kain Lilit, & Selendang senada',
      'Warna: Putih tulang elegan dengan bordir bunga pastel',
      'Ukuran: Size S-M (Lebar Dada 44-46cm)',
      'Kondisi bersih, sudah di-dry clean profesional'
    ]
  },
  {
    id: 'gaun-malam-satin',
    name: 'Gaun Malam Satin Emerald Green Luxury (Size M)',
    category: 'Fashion',
    pricePerDay: 250000,
    location: 'Jakarta Selatan',
    locationDetail: 'Kec. Kebayoran Baru',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: true,
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&auto=format&fit=crop&q=80'],
    description: 'Gaun malam / evening gown mewah berwarna hijau emerald dari bahan satin premium yang jatuh indah di tubuh. Desain a-line dengan belahan kaki elegan (high slit). Sangat berkilau di lampu panggung.',
    specs: [
      'Bahan: Satin Silk Premium tebal jatuh mengkilat',
      'Model: A-line Off-shoulder dengan aksen drapery dada',
      'Dilengkapi resleting belakang jepang yang tersembunyi',
      'Ukuran M: Lingkar Dada 88cm, Lingkar Pinggang 70cm',
      'Panjang Gaun: 155cm (cocok untuk tinggi badan 160-170cm)'
    ]
  },
  {
    id: 'batik-tulis-sutra',
    name: 'Batik Tulis Sutra Solo Premium (Kemeja Pria Size L)',
    category: 'Fashion',
    pricePerDay: 120000,
    location: 'Surakarta',
    locationDetail: 'Kec. Laweyan',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&auto=format&fit=crop&q=80'],
    description: 'Kemeja batik tulis pria berbahan sutra ATBM (Alat Tenun Bukan Mesin) asli Solo. Motif parang kombinasi bunga sogan klasik yang melambangkan wibawa tinggi. Furing dalam halus dingin.',
    specs: [
      'Bahan: 100% Sutra ATBM (Alat Tenun Bukan Mesin) mewah',
      'Proses: Batik Tulis Canting Tangan Asli (bukan cap/print)',
      'Ukuran L: Lebar Dada 56cm, Panjang 75cm, Lengan Panjang',
      'Dilengkapi saku dalam tersembunyi di dada kiri',
      'Furing katun sutra dalam super halus dingin'
    ]
  },
  {
    id: 'chanel-boy-bag',
    name: 'Tas Chanel Boy Bag Medium Caviar Black',
    category: 'Fashion',
    pricePerDay: 450000,
    location: 'Jakarta Utara',
    locationDetail: 'Kec. Penjaringan (PIK)',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80'],
    description: 'Sewa tas branded original Chanel Boy Bag untuk menunjang penampilan Anda di pesta formal atau pemotretan fashion. Kulit bertekstur caviar hitam yang sangat tahan gores dengan rantai warna emas antik.',
    specs: [
      'Bahan: Kulit Lembu Tekstur Caviar Asli (scratch resistant)',
      'Hardware: Logam Rantai Ruthenium Gold antik kokoh',
      'Ukuran: Medium (Panjang 25cm x Tinggi 15cm x Lebar 9cm)',
      'Sudah termasuk kartu otentikasi (Authenticity Card) & Dustbag',
      'Wajib menandatangani kontrak asuransi barang mewah Sewarion'
    ]
  },
  {
    id: 'louboutin-heels',
    name: 'Sepatu Louboutin Heels Black Red Sole (Size 38)',
    category: 'Fashion',
    pricePerDay: 180000,
    location: 'Jakarta Barat',
    locationDetail: 'Kec. Kembangan',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=600&auto=format&fit=crop&q=80'],
    description: 'High heels stiletto ikonik dengan ciri khas sol bawah merah membara (red sole) dari Christian Louboutin. Sangat menawan, membuat kaki terlihat jenjang dan elegan di pesta dansa.',
    specs: [
      'Bahan: Kulit Patent Leather mengkilat warna hitam pekat',
      'Sol Bawah: Signature Christian Louboutin Red Lacquered Sole',
      'Tinggi Heels: 10 cm stiletto runcing kokoh',
      'Ukuran: Size 38 (panjang kaki 24cm)',
      'Dilengkapi dengan box original dan pouch pelindung debu merah'
    ]
  },
  {
    id: 'rolex-submariner',
    name: 'Jam Tangan Rolex Submariner Date Black Dial',
    category: 'Fashion',
    pricePerDay: 500000,
    location: 'Jakarta Pusat',
    locationDetail: 'Kec. Tanah Abang',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&auto=format&fit=crop&q=80'],
    description: 'Sewa jam tangan mewah legendaris Rolex Submariner Date. Dial hitam pekat klasik berpadu dengan rantai besi Oystersteel yang sangat kokoh. Cocok untuk menaikkan prestise di pertemuan bisnis penting.',
    specs: [
      'Bahan Casing & Rantai: Besi Oystersteel antikarat khusus Rolex',
      'Mesin Jam: Automatic Calibre 3235 buatan Rolex sendiri',
      'Fitur Bezel: Cerachrom keramik hitam berputar satu arah',
      'Ketahanan Air: 300 meter (jam diver profesional)',
      'Dilengkapi box kayu mewah, buku panduan, dan sertifikat garansi'
    ]
  },
  {
    id: 'zara-blazer',
    name: 'Zara Double-Breasted Blazer (Navy Blue - Size S)',
    category: 'Fashion',
    pricePerDay: 60000,
    location: 'Tangerang',
    locationDetail: 'Kec. Pinang',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80'],
    description: 'Blazer formal wanita dari Zara bermodel kancing ganda koin emas (double-breasted blazer). Sangat bergaya untuk presentasi sidang kuliah, wawancara kerja, maupun tampilan kasual kantor.',
    specs: [
      'Bahan: Campuran Polyester & Viscose tebal bertekstur',
      'Warna: Biru Dongker (Navy) pekat dengan kancing emas antik',
      'Kerah lapel runcing tajam bergaya modern',
      'Ukuran: Size S (Lebar Dada 44cm, Panjang 68cm)',
      'Kondisi wangi dan terlipat rapi di dalam gantungan baju'
    ]
  },
  {
    id: 'songket-palembang',
    name: 'Kain Songket Palembang Lepus Sutra Emas',
    category: 'Fashion',
    pricePerDay: 130000,
    location: 'Palembang',
    locationDetail: 'Kec. Ilir Barat II',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80'],
    description: 'Kain songket tenun tangan tradisional Palembang motif Lepus Bintang berbenang emas kristal premium. Sangat mewah bersinar untuk busana pengantin tradisi Sumatera atau pesta adat formal.',
    specs: [
      'Bahan: Sutra Palembang asli ditenun manual (tenun tangan)',
      'Benang: Benang emas kristal impor bercahaya tidak kusam',
      'Isi Paket: 1 Lembar Kain Sarung & 1 Lembar Selendang Bahu',
      'Warna dasar merah marun menyatu dengan tenunan emas rapat',
      'Kondisi kering bersih, tidak boleh dicuci air biasa'
    ]
  },
  {
    id: 'rimowa-koper',
    name: 'Koper Rimowa Essential Cabin Green Polycarbonate',
    category: 'Fashion',
    pricePerDay: 150000,
    location: 'Jakarta Barat',
    locationDetail: 'Kec. Palmerah (Binus Anggrek)',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1581553680321-4fffae59fccd?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1581553680321-4fffae59fccd?w=600&auto=format&fit=crop&q=80'],
    description: 'Koper kabin mewah dari Rimowa berbahan polikarbonat berkekuatan tinggi namun super ringan. Roda multiwheel berputar sangat mulus di segala permukaan bandara tanpa suara.',
    specs: [
      'Bahan: High-grade Polycarbonate elastis tahan pecah benturan',
      'Sistem Roda: Rimowa Multiwheel® System 360 derajat senyap',
      'Kunci Keamanan: Kunci kombinasi angka bersertifikat TSA',
      'Ukuran Kabin Pesawat: Volume 36L (55 x 39 x 23 cm)',
      'Warna: Matte Forest Green estetik kekinian'
    ]
  },

  // ─── KENDARAAN (10 BARANG) ───
  {
    id: 'vespa-primavera',
    name: 'Vespa Primavera 150 i-Get ABS',
    category: 'Kendaraan',
    pricePerDay: 180000,
    location: 'Yogyakarta',
    locationDetail: 'Kec. Depok (Sleman)',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80'],
    description: 'Vespa matic Primavera yang stylish dan ikonik untuk berkeliling kota secara santai. Kondisi mesin sangat halus, rutin servis berkala, dan body mulus. Sudah termasuk 2 helm retro original.',
    specs: [
      'Mesin 150cc i-Get berpendingin udara',
      'Sistem pengereman ABS roda depan',
      'Lampu depan LED retro modern',
      'Bagasi luas muat helm half-face',
      'Surat Lengkap STNK aktif'
    ]
  },
  {
    id: 'honda-beat',
    name: 'Honda Beat Sporty CBS FI 2024',
    category: 'Kendaraan',
    pricePerDay: 75000,
    location: 'Jakarta Barat',
    locationDetail: 'Kec. Palmerah (Binus Syahdan)',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&auto=format&fit=crop&q=80'],
    description: 'Motor matic harian super irit dan lincah untuk menembus kemacetan Jakarta menuju area kampus. Kondisi ban tebal, mesin terawat servis AHASS rutin, dan hemat bensin luar biasa.',
    specs: [
      'Mesin eSP 110cc PGM-FI irit bahan bakar',
      'Sistem Rem Combi Brake System (CBS) aman',
      'Bagasi serbaguna 12 Liter muat jas hujan',
      'Dilengkapi charger HP USB di laci depan',
      'Termasuk STNK fisik asli, 2 helm SNI, & jas hujan'
    ]
  },
  {
    id: 'yamaha-nmax',
    name: 'Yamaha NMAX 155 Connected Maxi Scooter',
    category: 'Kendaraan',
    pricePerDay: 130000,
    location: 'Jakarta Selatan',
    locationDetail: 'Kec. Mampang Prapatan',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: true,
    image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600&auto=format&fit=crop&q=80'],
    description: 'Motor matic bongsor premium yang sangat nyaman diduduki dengan selonjoran kaki. Tenaga mesin besar 155cc VVA, stabil melaju di jalur cepat jalan raya kota.',
    specs: [
      'Mesin Blue Core 155cc liquid-cooled VVA bertenaga',
      'Fitur Y-Connect (koneksi layar spidometer ke HP)',
      'Sistem Kunci Pintar (Keyless) praktis tanpa anak kunci',
      'Rem Cakram depan dan belakang pakem',
      'Termasuk 2 helm standar bawaan pabrik & jas hujan'
    ]
  },
  {
    id: 'polygon-cascade',
    name: 'Sepeda Gunung Polygon Cascade 4 MTB',
    category: 'Kendaraan',
    pricePerDay: 40000,
    location: 'Depok',
    locationDetail: 'Kec. Pancoran Mas',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80'],
    description: 'Sepeda gunung (MTB) Polygon dengan rangka alloy ringan untuk gowes pagi olahraga di kota maupun melintasi jalanan berbatu di pedesaan secara tangguh. Suspensi depan empuk.',
    specs: [
      'Rangka AL6 Alloy frame ringan tahan karat',
      'Suspensi Depan Suntour XCE travel 100mm empuk',
      'Transmisi Gigi Shimano Tourney 3x7 Speed (21 Speed)',
      'Sistem Pengereman Rem Cakram Mekanik pakem',
      'Termasuk helm sepeda keselamatan & kunci gembok kabel'
    ]
  },
  {
    id: 'xiaomi-himo-ebike',
    name: 'Sepeda Listrik Lipat Xiaomi Himo Z20',
    category: 'Kendaraan',
    pricePerDay: 60000,
    location: 'Tangerang',
    locationDetail: 'Kec. Cipondoh',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&auto=format&fit=crop&q=80'],
    description: 'Sepeda listrik lipat (e-bike) bergaya perkotaan modern yang praktis dilipat masuk bagasi mobil. Dilengkapi motor asisten kayuhan bertenaga baterai lithium untuk gowes tanpa cape.',
    specs: [
      'Motor Listrik 250W dengan kecepatan maksimal 25km/jam',
      'Kapasitas Baterai Lithium 10Ah (Jangkauan asisten hingga 80km)',
      'Sistem Transmisi Gigi Shimano 6-Speed',
      'Layar LCD setir penunjuk kecepatan dan sisa baterai',
      'Dilengkapi lampu LED malam hari & klakson listrik'
    ]
  },
  {
    id: 'kawasaki-ninja',
    name: 'Kawasaki Ninja 250 FI ABS (2-Silinder)',
    category: 'Kendaraan',
    pricePerDay: 250000,
    location: 'Jakarta Barat',
    locationDetail: 'Kec. Cengkareng',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=600&auto=format&fit=crop&q=80'],
    description: 'Sewa motor sport Kawasaki Ninja 250cc bersuara gahar khas 2-silinder. Kondisi motor prima, tarikan gas kencang responsif, body mulus kinclong dilapisi nano ceramic coating.',
    specs: [
      'Mesin 250cc DOHC 2-Silinder berpendingin cairan',
      'Sistem rem ABS dual channel canggih',
      'Knalpot racing suara padat ngebass (knalpot standar opsional)',
      'Ban balap lebar sangat mencengkeram aspal tikungan',
      'Surat STNK aktif siap jalan jauh luar kota'
    ]
  },
  {
    id: 'helm-agv-rossi',
    name: 'Helm Full Face AGV K3 SV (Rossi Misano Edition)',
    category: 'Kendaraan',
    pricePerDay: 40000,
    location: 'Depok',
    locationDetail: 'Kec. Cilodong',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?w=600&auto=format&fit=crop&q=80'],
    description: 'Helm sport full-face premium dari AGV dengan desain grafis replika pembalap legendaris Valentino Rossi. Busa helm sangat empuk kedap suara angin kencang di kecepatan tinggi.',
    specs: [
      'Bahan Batok: High Resistance Thermoplastic Resin bersertifikasi SNI & DOT',
      'Dilengkapi dengan kaca ganda (Double Visor) anti silau matahari',
      'Kaca utama dilapisi film anti embun Pinlock 70',
      'Sistem ventilasi udara IVS optimal kepala tetap dingin',
      'Ukuran: Size L (Lingkar Kepala 59-60cm)'
    ]
  },
  {
    id: 'mobil-honda-brio',
    name: 'Mobil Honda Brio Satya E CVT (Lepas Kunci)',
    category: 'Kendaraan',
    pricePerDay: 300000,
    location: 'Jakarta Barat',
    locationDetail: 'Kec. Palmerah (Binus Anggrek)',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&auto=format&fit=crop&q=80'],
    description: 'Mobil perkotaan (city car) matic yang sangat lincah dan hemat bensin. Bagasi cukup lega untuk belanjaan bulanan. Disewakan lepas kunci khusus bagi pengguna Sewarion terverifikasi KYC.',
    specs: [
      'Mesin 1.2L i-VTEC CVT responsif hemat bahan bakar',
      'Transmisi Otomatis (Matic) halus bebas capek macet',
      'Sistem AC digital dingin merata seluruh kabin',
      'Radio headunit touchscreen terkoneksi bluetooth audio',
      'Wajib jaminan SIM A aktif asli ditunjukkan saat serah terima'
    ]
  },
  {
    id: 'mobil-toyota-avanza',
    name: 'Mobil Toyota Avanza G CVT (Termasuk Sopir + BBM)',
    category: 'Kendaraan',
    pricePerDay: 550000,
    location: 'Tangerang',
    locationDetail: 'Kec. Tangerang',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80'],
    description: 'Mobil keluarga MPV 7-penumpang sejuta umat yang sangat handal untuk perjalanan dinas kantor, wisuda keluarga besar, atau liburan luar kota. Harga sudah paket lengkap dengan jasa sopir ramah dan bensin.',
    specs: [
      'Kapasitas Penumpang: 7 Orang Dewasa lega nyaman',
      'Harga paket sudah mencakup: Jasa Sopir profesional & Bensin (BBM)',
      'AC Double Blower dingin sampai kursi baris ketiga',
      'Durasi Sewa: Maksimal 12 Jam per Hari kalender',
      'Tidak termasuk biaya tol bandara/dalam kota & parkir'
    ]
  },
  {
    id: 'thule-roofbox',
    name: 'Car Roof Box Thule Motion XT L (450 Liter)',
    category: 'Kendaraan',
    pricePerDay: 70000,
    location: 'Jakarta Timur',
    locationDetail: 'Kec. Cakung',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1506015391300-4802dc74de2e?w=600&auto=format&fit=crop&q=80'],
    description: 'Bagasi tambahan atap mobil (roof box) premium buatan Swedia. Sangat kokoh, aerodinamis tidak bising di jalan tol, dan tahan air hujan 100% untuk perjalanan mudik mudak.',
    specs: [
      'Volume Kapasitas: 450 Liter (Muat hingga 5 tas travel besar)',
      'Sistem Kunci: SlideLock pengunci tutup otomatis yang aman',
      'Mendukung bukaan ganda (DualSide) dari kiri atau kanan koper',
      'Termasuk roof rack / cross bar penjepit atap mobil standard',
      'Pemasangan dibantu gratis oleh tim logistik Sewarion saat kirim'
    ]
  },

  // ─── PERALATAN LAINNYA (10 BARANG) ───
  {
    id: 'epson-projector',
    name: 'Proyektor Epson EB-X400 3300 Lumens',
    category: 'Peralatan Lainnya',
    pricePerDay: 100000,
    location: 'Depok',
    locationDetail: 'Kec. Beji',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1535016120720-40c646be5580?w=600&auto=format&fit=crop&q=80'],
    description: 'Proyektor tingkat kecerahan tinggi 3300 lumens, sangat tajam untuk presentasi di ruangan terang maupun nobar (nonton bareng) film di malam hari. Port input lengkap.',
    specs: [
      'Kecerahan 3300 ANSI Lumens',
      'Resolusi Native XGA (1024x768)',
      'Kontras rasio 15.000:1',
      'Konektivitas HDMI, VGA, USB, RCA',
      'Termasuk kabel HDMI 5 meter & tas proyektor'
    ]
  },
  {
    id: 'aluminium-ladder',
    name: 'Tangga Lipat Aluminium Teleskopik 5 Meter',
    category: 'Peralatan Lainnya',
    pricePerDay: 40000,
    location: 'Jakarta Barat',
    locationDetail: 'Kec. Kebon Jeruk',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1595263155701-44bb587e9742?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1595263155701-44bb587e9742?w=600&auto=format&fit=crop&q=80'],
    description: 'Tangga lipat teleskopik praktis yang tinggi maksimalnya bisa diatur hingga 5 meter. Sangat kokoh untuk memanjat perbaikan genteng bocor, instalasi kabel AC, atau lampu rumah.',
    specs: [
      'Tinggi Maksimal: 5.0 Meter (dapat ditarik bertahap)',
      'Bahan: Aluminium alloy tebal tegap antikarat',
      'Kapasitas Beban Maksimal: 150 Kilogram',
      'Desain lipat praktis hanya tinggi 95cm saat disimpan',
      'Dilengkapi dengan bantalan kaki karet anti-slip aman'
    ]
  },
  {
    id: 'bosch-drill',
    name: 'Bor Listrik Cordless Bosch GSB 120-LI',
    category: 'Peralatan Lainnya',
    pricePerDay: 45000,
    location: 'Depok',
    locationDetail: 'Kec. Limo',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80'],
    description: 'Bor nirkabel (cordless) multifungsi buatan Jerman. Memiliki fitur impak untuk mengebor dinding beton tebal keras, besi, kayu, sekaligus berfungsi sebagai obeng sekrup perakit furnitur.',
    specs: [
      'Tegangan Baterai: 12 Volt Lithium-ion (termasuk 2 baterai + charger)',
      'Torsi Maksimal: 30 Nm dengan 2 kecepatan gir transmisi',
      'Fungsi Impak (Impact Drill) untuk bor tembok batu beton',
      'Termasuk mata bor lengkap set (Kayu, Besi, & Beton)',
      'Termasuk koper plastik Bosch penyimpan alat rapi'
    ]
  },
  {
    id: 'karcher-jetcleaner',
    name: 'High Pressure Washer Karcher K2 (Alat Cuci Jet)',
    category: 'Peralatan Lainnya',
    pricePerDay: 50000,
    location: 'Tangerang',
    locationDetail: 'Kec. Karawaci',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&auto=format&fit=crop&q=80'],
    description: 'Mesin semprot air tekanan tinggi jet cleaner Karcher dari Jerman. Sangat ampuh membersihkan kerak lumut hitam pada paving block pekarangan rumah, pagar besi, atau mencuci bersih motor mobil Anda.',
    specs: [
      'Teknangan Air Maksimal: 110 Bar semprotan kencang tajam',
      'Konsumsi Daya Listrik: 1400 Watt',
      'Laju Aliran Air: Maksimal 360 liter per jam hemat air',
      'Panjang Selang Semprotan: 4 Meter lentur karet tebal',
      'Dilengkapi dengan botol sabun salju cuci motor mobil'
    ]
  },
  {
    id: 'singer-sewing',
    name: 'Mesin Jahit Portable Digital Singer Starlet 6660',
    category: 'Peralatan Lainnya',
    pricePerDay: 70000,
    location: 'Jakarta Barat',
    locationDetail: 'Kec. Palmerah (Binus Kijang)',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1605647540924-852290f6b0d5?w=600&auto=format&fit=crop&q=80'],
    description: 'Mesin jahit digital terkomputerisasi dari Singer. Pengoperasian sangat mudah dengan tombol layar LCD, cocok bagi mahasiswa tata busana / fashion design untuk praktek pembuatan busana.',
    specs: [
      '60 Pola Jahitan built-in bawaan otomatis (dekoratif, elastis)',
      'Sistem pelubang kancing otomatis 4-langkah presisi',
      'Pemasang benang otomatis ke lubang jarum (needle threader)',
      'Lebar dan panjang jahitan dapat diatur secara digital',
      'Menggunakan pedal kaki elektrik responsif'
    ]
  },
  {
    id: 'dyson-vacuum',
    name: 'Vacuum Cleaner Dyson V11 Absolute Cordless',
    category: 'Peralatan Lainnya',
    pricePerDay: 90000,
    location: 'Jakarta Utara',
    locationDetail: 'Kec. Penjaringan (PIK)',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80'],
    description: 'Penyedot debu nirkabel (cordless vacuum) dengan daya hisap terkuat dari Dyson. Layar LCD pintar menampilkan sisa waktu baterai dan peringatan sumbatan kotoran. Sangat bersih menyedot debu tungau kasur.',
    specs: [
      'Daya Hisap: 185 AW menyedot debu partikel mikro tak kasat mata',
      'Filter HEPA 6-lapis menangkap 99.9% debu alergen udara',
      'Baterai tahan hingga 60 menit dalam mode Eco hemat',
      'Dilengkapi 5 kepala hisap berbeda (untuk kasur, sela sofa, dll)',
      'Layar LCD menunjukkan performa sistem real-time'
    ]
  },
  {
    id: 'garrett-metal-detector',
    name: 'Metal Detector Garrett ACE 300i (Detektor Logam)',
    category: 'Peralatan Lainnya',
    pricePerDay: 80000,
    location: 'Jakarta Timur',
    locationDetail: 'Kec. Pulogadung',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&auto=format&fit=crop&q=80'],
    description: 'Alat detektor logam bawah tanah profesional untuk berburu koin kuno, emas terpendam, pipa besi tertanam, atau mendeteksi kabel di dalam beton dinding secara presisi.',
    specs: [
      'Frekuensi Operasi: 8 kHz dengan sensitivitas yang dapat diatur',
      'Layar LCD Digital penunjuk kedalaman koin terpendam',
      'Piringan detektor tahan air (waterproof searchcoil)',
      'Sistem identifikasi audio 3-tingkat nada bunyi logam',
      'Menggunakan 4 baterai AA standard (diberikan penuh)'
    ]
  },
  {
    id: 'travel-wheelchair',
    name: 'Kursi Roda Lipat Travel Aluminium Ringan',
    category: 'Peralatan Lainnya',
    pricePerDay: 40000,
    location: 'Jakarta Utara',
    locationDetail: 'Kec. Kelapa Gading',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1508847154043-be12a3b4dca9?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1508847154043-be12a3b4dca9?w=600&auto=format&fit=crop&q=80'],
    description: 'Kursi roda travel dengan rangka aluminium ultra-ringan. Sangat mudah dilipat menjadi ukuran kecil sehingga muat di bagasi mobil sempit atau dibawa masuk kabin pesawat.',
    specs: [
      'Bobot Kursi Roda: Hanya 8.5 Kilogram (Super Ringan)',
      'Bahan Rangka: Aluminium alloy tebal antikarat kokoh',
      'Kapasitas Beban Maksimal: 100 Kilogram',
      'Bisa dilipat hingga datar dengan gagang dorong ditekuk',
      'Bahan Jok: Kain mesh bernapas tebal dingin dicuci higienis'
    ]
  },
  {
    id: 'portable-ac',
    name: 'AC Portable Sharp 1 PK (Pendingin Ruang Instan)',
    category: 'Peralatan Lainnya',
    pricePerDay: 90000,
    location: 'Jakarta Barat',
    locationDetail: 'Kec. Palmerah (Binus Anggrek)',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80'],
    description: 'AC portable beroda yang dapat dipindahkan dengan mudah ke setiap kamar. Sangat dingin mendinginkan ruangan kamar kos berukuran sedang instan tanpa pasang instalasi tembok luar.',
    specs: [
      'Kapasitas Pendinginan: 1 PK (cocok untuk luas ruang hingga 15m²)',
      'Daya Listrik: 900 Watt',
      'Dilengkapi selang pembuangan udara panas keluar jendela',
      'Fitur penjernih udara plasmacluster built-in Sharp',
      'Termasuk remote control nirkabel & roda bawah geser mudah'
    ]
  },
  {
    id: 'honda-silent-genset',
    name: 'Genset Portable Silent Honda EU22i (2200 Watt)',
    category: 'Peralatan Lainnya',
    pricePerDay: 200000,
    location: 'Tangerang',
    locationDetail: 'Kec. Ciputat',
    isAvailable: true,
    ownerId: 'system',
    isPromoted: false,
    image: 'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?w=600&auto=format&fit=crop&q=80'],
    description: 'Generator listrik bensin (genset) silent bersuara sangat halus dari Honda. Output daya listrik murni berteknologi inverter aman untuk menyuplai peralatan elektronik sensitif (laptop, mixer audio).',
    specs: [
      'Daya Output Maksimal: 2200 Watt (Daya kontinu 1800W)',
      'Tingkat Kebisingan: Sangat Sunyi (Silent) hanya 48-57 dBA',
      'Teknologi Inverter menghasilkan arus sinus murni stabil',
      'Kapasitas Tangki Bensin: 3.6 Liter (tahan hingga 3-8 jam)',
      'Dilengkapi proteksi kelebihan beban (overload) otomatis'
    ]
  }
];

export const ACCESSORIES_ITEMS = [
  {
    id: 'lens-fe2470',
    name: 'Sony FE 24-70mm f/2.8 GM II',
    category: 'Lensa',
    price: 65000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9WCofhzr8uMgSmpeCogsZ7FdbCH-t21BmZ18hRlFT6bB9mILLOgj6Zng2FKDXj5jKLxNGtoqiOiNJ0hKHlZio_857t-pnrL3kAORjQx2PVfXlIKFvI8-u8j5faRcY2NSbbWucDNX0sEKsOAlGK7VPJHhm_FEv2m_w2pZ3daDQCTkdkkXklxUpXf-UD_YGx8oohEit_GCZ33YycTBxKzRMocKvly-AgH9GLgutMVGBbi5sxaQYxq-gbJbzkFZvC7lgUp79_d8MLsg'
  },
  {
    id: 'tripod-manfrotto',
    name: 'Manfrotto Carbon Fiber Tripod',
    category: 'Aksesoris',
    price: 25000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXu3d8uKYiT9Wj9oYuOpPelJBwe2uqgcDPGFcuY9FM3GY4rflNFKCqL_id0OTJ1VFtsUyOI8q9Qsl_5PX6sXFhvC0yClFLedZqtN0sOEwQTtHVb54wgtxOa059BOtwuEfvBNlarUEENk5IxxnZtZakFEsSD_-RqMz2Qr9KuC4iQ_9wVjPacY3yRWRLvuah6reH2UxuBX5CNjAzlNzVISJSbBxdqz4m_wr-70v_oiZ7G-O-VNCWMx78TZY5CF6ys_VPHXpuQZwkRCx6g'
  },
  {
    id: 'sd-lexar',
    name: 'Lexar Professional 128GB V90',
    category: 'Penyimpanan',
    price: 15000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcfxetZ42uNDvNPzX82dIBFXXJiaQXyD5unVrf87USKdSiwXAq13plTsOIAcDoYLjZbMFg_sik-wC36y7LIJ1bSNr1NoJ_gdYmUxTOEsuI5e1iYZC-nU2WZIwqzfcikcSmNVah9mVhC3iRtNW6wIMwmqPetPvwJ_-WITimnmJ-hrE7__ls5MIntBod8Gg7QflJ16djdZ9T8cao6VqoDCAKJx3E_R5qsCPVucG8_ZxtVTNFzpszHF_6lq649ZRFPn9gRdjwXVq_w08'
  },
  {
    id: 'gimbal-dji',
    name: 'DJI RS 3 Pro Gimbal',
    category: 'Stabilizer',
    price: 45000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8dNThKU8-CY4lJXJcAS2DSkAQrnDE89LLJJIox6PTtYA3JxAdJkdqLTv7y78S4LBGNYYY14o1fRm-NkjmNoL9MEZOdQs59rnP7YRdd7CfqXz0TS8gLZgC60GLrFWWwjRC7oZvSc5exfvxP5f6bMqT_J0QRyILfMwfRiI2GzOPdj_X0QYxrrl9IoP4s4vydgCk2xVWDErZpilBl9a9K8UJ3gkBo34-27jlwhe0j9t_acHUiXMw9it8l0xAzssXrNvbLoMnEi_G_s8'
  }
];

export const FOTO_THUMBS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA4YCt6y10z95wzYkyvo6X_iKtfivjhJrwha25cKlaD_OlCVWaAUesSdbEzNrW-_NUHHoE_6nuo5RXnd3-8uyNWttYOOkLyCTcq5wvkwaUxf0qIv8D2dnyHxd_vwCx7ovz4CaBJ2RX1bjvy4dZMkQTH2PDSRWO8I0LRM-OLif9hRRPXnxxiZwUJHu9w50DDcgGmxF7_5DEkXnVWJP0hr0iCbFUaHeKCl-TuTeIEJsYDBTXgiLmsN0WxfLSMOiVdDpJ_0c2xlp0l-ng',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBPl-_l0NP5LLUyDp232RwU6GgiFZAP609GJAGBdWwesVqmeD96aSl_QzQqGivYoiYBXNtK_zZG99hVSixdtOai0Q-p_kuYwr2lmrj10UKFZ3mP8hwA6_m6Ik3MmtHvy2pCo2mchJmt8iiYDaOF5OWvmfak0xYWmL4ZDh0-jwRK46bjhSpa305xHNjLaYfLeh9Sn3RezWfngYfVyBH3Hlab7LHxelIY1-8kRG0W5j8M4smETrs8aRjCdIp9IszLDlj-qtm4jCPGbZc',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCnZY5wUEmDiDm2RD_SdbCn_oLLce8MFXrz43unB7AFLsmg_fLW1gDQ4vL-0eN2cpNcudq-doxc5m0n0Tlfaa9FcVZqGYC5DU6exbJ2EVhwbckj0uw5TWCOujNreTJuPZBvhT72Cuqs1RJTSlNdZkM06n2cwTWq0Fx1GWUlq2uq3M8NK9VI2P18cDT49CWsTytOrl9wZHB331x5zFSb3HBUEbv_GoFK98pPmlHHUZ_0GaV03JilkhCac_quoJSepKm1C71qlyZzcg0'
];

export const VENDOR_PORTRAIT = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFhO6XxswJRyg70DHau79pW54rsK8g7aLZC7TkyUfc9EPmHvXUXQm07OQ6Gb5ubSBHb2qpraIIjgwH2VP0rLOqYByD5MWlW4Ig0UJDr0KijMImnFgMgCZ2pYaENNrNBYGvR2Dgzw-hjC9kcoFKUK2DVCVXFa5-IrjBSiOniSjiE7DyNrN7DzrMUwcUndNjHVQ3K4uWaM_OQep2EitOVvYFksYt_2003r0Xd7Xf0BAsO5RmdUB8dgI1T8S0DS9mmZm9sxq2_aCL_ss';

export const KYC_SELFIE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUh6w_3cW3OKPrwjH6ytBYQhw9Xo3CB3k_oaogOwSXrm2cUCh4K8mbmcLWgGsGRrTTiUXY9VGROrCrJVhDvnDNOT0SeH1YGuObBN_Q00jlEBAp1upMD1NSrM6rXgVYE4fcIb2mVJDJstMuzu4d-SY4JrZj3NX_tBLxMPNibEfL63FM4PBcvBh4Rjik6GrIEADseg_8Oe_DxTJb_4oUSsbTHwN2AkV8ZPrmer4jZ0zgsNqO2YocWuhvZngaGp-pnyolqMLy7Ejtl9M';
