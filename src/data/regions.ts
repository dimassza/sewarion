export interface Province {
  id: string;
  name: string;
  cities: string[];
}

export const INDONESIAN_PROVINCES: Province[] = [
  { id: 'aceh', name: 'Aceh', cities: ['Banda Aceh', 'Langsa', 'Lhokseumawe', 'Sabang', 'Subulussalam', 'Aceh Besar', 'Aceh Utara', 'Bireuen'] },
  { id: 'sumut', name: 'Sumatera Utara', cities: ['Medan', 'Binjai', 'Gunungsitoli', 'Padangsidimpuan', 'Pematangsiantar', 'Sibolga', 'Tanjungbalai', 'Tebing Tinggi', 'Deli Serdang', 'Karo', 'Simalungun'] },
  { id: 'sumbar', name: 'Sumatera Barat', cities: ['Padang', 'Bukittinggi', 'Payakumbuh', 'Pariaman', 'Padang Panjang', 'Sawahlunto', 'Solok', 'Agam', 'Tanah Datar', 'Pasaman'] },
  { id: 'riau', name: 'Riau', cities: ['Pekanbaru', 'Dumai', 'Kampar', 'Siak', 'Bengkalis', 'Indragiri Hilir', 'Indragiri Hulu', 'Pelalawan', 'Rokan Hulu', 'Rokan Hilir'] },
  { id: 'kepri', name: 'Kepulauan Riau', cities: ['Tanjungpinang', 'Batam', 'Bintan', 'Karimun', 'Anambas', 'Natuna', 'Lingga'] },
  { id: 'jambi', name: 'Jambi', cities: ['Jambi', 'Sungai Penuh', 'Muaro Jambi', 'Batanghari', 'Bungo', 'Kerinci', 'Merangin', 'Sarolangun', 'Tebo'] },
  { id: 'sumsel', name: 'Sumatera Selatan', cities: ['Palembang', 'Lubuklinggau', 'Pagar Alam', 'Prabumulih', 'Banyuasin', 'Ogan Ilir', 'Ogan Komering Ilir', 'Muara Enim'] },
  { id: 'babel', name: 'Kepulauan Bangka Belitung', cities: ['Pangkalpinang', 'Bangka', 'Bangka Barat', 'Bangka Tengah', 'Bangka Selatan', 'Belitung', 'Belitung Timur'] },
  { id: 'bengkulu', name: 'Bengkulu', cities: ['Bengkulu', 'Rejang Lebong', 'Kepahiang', 'Muko-Muko', 'Seluma', 'Kaur', 'Lebong', 'Bengkulu Utara'] },
  { id: 'lampung', name: 'Lampung', cities: ['Bandar Lampung', 'Metro', 'Lampung Selatan', 'Lampung Tengah', 'Lampung Utara', 'Lampung Barat', 'Pringsewu', 'Pesawaran'] },
  { id: 'dki', name: 'DKI Jakarta', cities: ['Jakarta Barat', 'Jakarta Pusat', 'Jakarta Selatan', 'Jakarta Timur', 'Jakarta Utara', 'Kepulauan Seribu'] },
  { id: 'jabar', name: 'Jawa Barat', cities: ['Bandung', 'Bekasi', 'Depok', 'Bogor', 'Cimahi', 'Cirebon', 'Sukabumi', 'Tasikmalaya', 'Banjar', 'Karawang', 'Sumedang', 'Garut', 'Cianjur', 'Subang', 'Purwakarta'] },
  { id: 'banten', name: 'Banten', cities: ['Serang', 'Cilegon', 'Tangerang', 'Tangerang Selatan', 'Pandeglang', 'Lebak'] },
  { id: 'jateng', name: 'Jawa Tengah', cities: ['Semarang', 'Surakarta (Solo)', 'Magelang', 'Pekalongan', 'Salatiga', 'Tegal', 'Banyumas (Purwokerto)', 'Kudus', 'Jepara', 'Cilacap', 'Klaten'] },
  { id: 'diy', name: 'DI Yogyakarta', cities: ['Yogyakarta', 'Sleman', 'Bantul', 'Kulon Progo', 'Gunungkidul'] },
  { id: 'jatim', name: 'Jawa Timur', cities: ['Surabaya', 'Malang', 'Batu', 'Blitar', 'Kediri', 'Madiun', 'Mojokerto', 'Pasuruan', 'Probolinggo', 'Sidoarjo', 'Gresik', 'Banyuwangi', 'Jember'] },
  { id: 'bali', name: 'Bali', cities: ['Denpasar', 'Badung', 'Gianyar', 'Buleleng', 'Tabanan', 'Karangasem', 'Klungkung', 'Bangli', 'Jembrana'] },
  { id: 'ntb', name: 'Nusa Tenggara Barat', cities: ['Mataram', 'Bima', 'Lombok Barat', 'Lombok Tengah', 'Lombok Timur', 'Lombok Utara', 'Sumbawa', 'Sumbawa Barat', 'Dompu'] },
  { id: 'ntt', name: 'Nusa Tenggara Timur', cities: ['Kupang', 'Sikka (Maumere)', 'Ende', 'Manggarai', 'Manggarai Barat (Labuan Bajo)', 'Alor', 'Belu', 'Flores Timur', 'Sumba Timur'] },
  { id: 'kalbar', name: 'Kalimantan Barat', cities: ['Pontianak', 'Singkawang', 'Kubu Raya', 'Mempawah', 'Sambas', 'Sintang', 'Ketapang', 'Kapuas Hulu'] },
  { id: 'kalteng', name: 'Kalimantan Tengah', cities: ['Palangkaraya', 'Kotawaringin Timur (Sampit)', 'Kotawaringin Barat (Pangkalan Bun)', 'Kapuas', 'Barito Utara', 'Katingan'] },
  { id: 'kalsel', name: 'Kalimantan Selatan', cities: ['Banjarmasin', 'Banjarbaru', 'Banjar (Martapura)', 'Tanah Laut', 'Kotabaru', 'Tabalong', 'Barito Kuala'] },
  { id: 'kaltim', name: 'Kalimantan Timur', cities: ['Samarinda', 'Balikpapan', 'Bontang', 'Kutai Kartanegara', 'Kutai Timur', 'Berau', 'Penajam Paser Utara'] },
  { id: 'kalut', name: 'Kalimantan Utara', cities: ['Tanjung Selor', 'Tarakan', 'Nunukan', 'Malinau', 'Bulungan'] },
  { id: 'sulut', name: 'Sulawesi Utara', cities: ['Manado', 'Bitung', 'Kotamobagu', 'Tomohon', 'Minahasa', 'Minahasa Utara', 'Sangihe', 'Talaud'] },
  { id: 'gorontalo', name: 'Gorontalo', cities: ['Gorontalo', 'Boalemo', 'Bone Bolango', 'Pohuwato'] },
  { id: 'sulteng', name: 'Sulawesi Tengah', cities: ['Palu', 'Banggai', 'Donggala', 'Morowali', 'Poso', 'Toli-Toli', 'Sigi'] },
  { id: 'sulbar', name: 'Sulawesi Barat', cities: ['Mamuju', 'Majene', 'Polewali Mandar', 'Mamasa'] },
  { id: 'sulsel', name: 'Sulawesi Selatan', cities: ['Makassar', 'Palopo', 'Parepare', 'Gowa', 'Maros', 'Bone', 'Toraja Utara', 'Tana Toraja', 'Bulukumba', 'Bantaeng'] },
  { id: 'sultra', name: 'Sulawesi Tenggara', cities: ['Kendari', 'Baubau', 'Kolaka', 'Konawe', 'Muna', 'Wakatobi'] },
  { id: 'maluku', name: 'Maluku', cities: ['Ambon', 'Tual', 'Maluku Tengah', 'Maluku Tenggara', 'Kepulauan Tanimbar'] },
  { id: 'malut', name: 'Maluku Utara', cities: ['Ternate', 'Tidore Kepulauan', 'Halmahera Barat', 'Halmahera Utara', 'Halmahera Selatan'] },
  { id: 'papua', name: 'Papua', cities: ['Jayapura', 'Biak Numfor', 'Kepulauan Yapen', 'Keerom', 'Sarmi'] },
  { id: 'papuabarat', name: 'Papua Barat', cities: ['Manokwari', 'Fakfak', 'Kaimana', 'Teluk Wondama'] },
  { id: 'papuaselatan', name: 'Papua Selatan', cities: ['Merauke', 'Boven Digoel', 'Asmat', 'Mappi'] },
  { id: 'papuatengah', name: 'Papua Tengah', cities: ['Nabire', 'Mimika (Timika)', 'Paniai', 'Puncak Jaya'] },
  { id: 'papuapegunungan', name: 'Papua Pegunungan', cities: ['Wamena (Jayawijaya)', 'Lanny Jaya', 'Tolikara', 'Yalim'] },
  { id: 'papuabaratdaya', name: 'Papua Barat Daya', cities: ['Sorong', 'Raja Ampat', 'Tambrauw', 'Maybrat'] }
];
