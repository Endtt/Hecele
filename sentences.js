// Okuma cümleleri. Uygulama, yalnızca açık harflerle yazılabilen cümleleri gösterir.
const SENTENCES = [
  // A N E T İ L
  'Ela ile Ali.', 'Anne ile Ela.', 'Ela, nane al.', 'Ali, tane al.',
  // + O K U R I M
  'Ela, kalem al.', 'Ali ekmek al.', 'Anne ekmek al.', 'Ela ile Ali okula.', 'Ali, mantı al.', 'Anne, ekmek ile kek al.',
  // + Ü S Ö Y D Z
  'Ela süt ister.', 'Ali muz ister.', 'Anne süt aldı.', 'Kedi süt ister.', 'Ela yemek ister.', 'Ela sarı kalem aldı.',
  'Ali kırmızı kalem aldı.', 'Dede sarı muz aldı.', 'Ela uzun yol yürüdü.', 'Ali ile Ela okula yürüdü.', 'Atlas süt ister.', 'Atlas okula yürüdü.',
  // + Ç B G C Ş
  'Ela çiçek aldı.', 'Anne çay içer.', 'Ali gece uyudu.', 'Bugün güneş sıcak.', 'Kuşlar şarkı söyler.', 'Ali balık yedi.',
  'Dede bize geldi.', 'Ela gül kokladı.', 'Çocuklar okulda ders çalışır.', 'Ali çok güzel yazdı.', 'Atlas bisiklet sürer.',
  // + P H V Ğ F J
  'Ali kitap okur.', 'Ela pasta yer.', 'Anne pazardan havuç aldı.', 'Baba arabayı yıkadı.', 'Ela ile Ali parkta oynadı.',
  'Kuşlar ağaçta öter.', 'Dağ çok yüksek.', 'Ali futbol oynar.', 'Atlas okula gitti.', 'Atlas çok güzel okuyor.',

  // Okuma kartları (ANETİL → OK): 3, 4 ve 5 sözcüklü cümleler
  // A N E T İ L
  'Ali lila lale al.', 'Nail, ninene tatili anlat.',
  // + O
  'Altan otele in.', 'Nine on tane nane al.',
  // + K
  'Okan keki tat.', 'Kaan takla at.',
  // 3 sözcüklü
  'İlke, anten tak.', 'Altan, kalkan al.', 'Anne, kekini tat.', 'Ekin, etiket tak.', 'Ela, atlet katla.',
  'Nail, inek otlat.', 'Talat, teneke al.', 'Ali, kaleni anlat.', 'Kenan, konakta kal.', 'Lale, laleni kokla.',
  // 4 sözcüklü
  'Ali, iki kek al.', 'Kaan, iki ok at.', 'Ela, iki toka tak.', 'Altan, iki olta al.', 'Nil, ak lale kokla.',
  'Lale, naneli kek al.', 'İlke, iki nota ekle.', 'Nail, iki inek otlat.', 'Nil, naneli keki tat.', 'Okan, kanala olta at.',
  'İlke, iki etiket tak.', 'Ekin, alana kanola ek.', 'Ela, kekine nane ekle.', 'Lale, koala taklit et.', 'Nalan, keten atlet al.',
  'Ali, tekneni kanala it.', 'Ela, lekeli etek katla.', 'Ali, atletine etiket tak.', 'Kenan, antik konakta kal.', 'Nalan, kilitli kaleni anlat.',
  // 5 sözcüklü
  'Kaan, tek tek ok at.', 'Ali, iki tane kek al.', 'Ela, etek ile toka al.', 'Talat, iki kilo et al.', 'Ali, keki al, kokla, tat.',
  'Anne, iki tane lale ek.', 'Kenan, not et, ilan ilet.', 'Okan, kanala in, olta at.', 'İlke, lale ile toka tak.', 'Ekin, iki tane kanola ek.',
  'Lale, nane ek, lale kokla.', 'Nil, ilk naneli keki tat.', 'Okan, kano ile kanala in.', 'Nail, iki tane inek otlat.', 'Ela, etek al, etiketini tak.',
  'Lale, laleni kokla, nane ek.', 'Nail, inek otlat, kanola ek.', 'Altan, kalene iki kilit tak.', 'Nalan, koala taklit et, atla.', 'Nil, kaliteli keten etek al.',
  // Okuma metinleri (Onat, Tekne)
  'Alo Onat, alo.', 'Elli ton ot al.', 'On tane at otlat.', 'Ninen ile at otlat.',
  'Kilitli olan ne?', 'Kilitli olan tekne.', 'O tekne Tekin’in,', 'Tekin’e olta iletin.',
  // Okuma metinleri (Kakaolu Kek, Ruken ile Rana)
  'Tuna ne koktu?', 'Kakaolu kek koktu.', 'Elli tane kek kutula.', 'Utku ile ilet okula.',
  'Ruken erken kalkar.', 'Tekli koltukta oturur.', 'Rana ona Kirli Rakun’u okur.', 'Korkak Tekir’i okur.',
];
