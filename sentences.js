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
  // Okuma kitapları (A, B): metin satırları
  'Anne o ne?', 'Onat o 1 at.', 'Nine o ne?', 'Onat o ot.', 'Eline ot al.', 'Ata ot at.', 'Tonton ata ot at.', 'Onat not al.', 'Ali oteli anlat.', 'Ali Onat’a oteli anlat.', 'Onat ile otele in.', 'Ailene olta al.', 'On tane olta al.', 'İlke o 1 konak.', 'Laleli 1 konak.', 'O konak Nil ninenin.', 'Nil ninen Tokat’ta.', 'Ninene kek al.', 'Nil ninen ile kal.', 'Okan takla at.', 'Tekin ile takla at.', 'Kenan ile takla at.', 'Tek tek takla at.', 'On takla at.', 'Atla, atla kalk.', 'Kalk Kaan, kalk.', 'Kalk, inek otlat.', 'Kalk Kenan, kalk.', 'Kalk, Ekin’e anlat.', 'Kalk İlke, kalk.', 'Kalk, keki tat.', 'Utku ne koktu?', 'Okan nane koktu.', 'Tutku kekik koktu.', 'Tuna kek koktu.', 'Tuna okullu.', 'Oku Tuna, oku.', 'Nil’e konuk ol.', 'Tane tane oku.', 'Konu konu oku.', 'Kuleli konutu oku.', 'Rana İlker’i ara.', 'İlker’e tarak al.', 'Kara tarak al.', 'Rana Nur’u ara.', 'Nur’a terlik al.', 'Renkli terlik al.', 'Kareli renkli terlik al.', 'Turan erken kalk.', 'Elli kilo erik al.', 'İri iri erik al.', 'Kantar ile erikleri tart.', 'Erikleri kutulat.', 'Kutulara etiket tak.', 'İnekler ile atlar,', 'Koklar ot ararlar.', 'Kurtlar ile kartallar,', 'Koklar et ararlar.', 'Tilkiler ile rakunlar,', 'Et ile ot ararlar.', 'Akın atkını tak.', 'Kalın atkını tak.', 'Rana tokanı tak.', 'Renkli tokanı tak.', 'Nine takını tak.', 'Altın takını tak.', 'Anıl arıları okur.', 'Arılar kanatlı olur.', 'Arılar antenli olur.', 'Arılar aklını kullanır.', 'Arılar nektarı tanır.', 'Konar, kekikten nektar alır.', 'Tarık konutu tanıttı.', 'Akın’a tek tek anlattı.', 'O konut altı katlı.', 'İlk katı kiralıktı.', 'Akın o konutu unuttu.', 'İki katlı 1 konut tuttu.', 'Mine elma alalım.', 'Nineme elma alalım.', 'On kilo elma alalım.', 'Minik minik elma alalım.', 'Alalım Meral, alalım.', 'Elmalar tatlı olur.', 'Ninem mutlu olur.', 'Alo Melek, alo.', 'Markete in.', 'Minik Emel’e mama al.', 'Ekmek ile makarna al.', 'Elma ile limon al.', 'Armut ile lokum al.', 'Unutma mutlaka al.', 'Irmak o Ata’m.', 'O akıllı 1 komutan.', 'Milletine inanan.', 'Milletini kurtaran.', 'Ata’mı tanırım.', 'Ata’mı anlarım.', 'Ata’mı anlatırım.', 'Meral al.', 'Meral manto al.', 'Meral mor manto al.', 'Meral iki mor manto al.', 'Metin kullan.', 'Metin keman kullan.', 'Metin kara keman kullan.', 'Metin, Kerem ile kara keman kullan.', 'Emine at.', 'Emine kalemi at.', 'Emine kırık kalemi at.', 'Emine o kırık kalemi at.', 'Kerem kule.', 'Kerem o kule.', 'Kerem o renkli kule.', 'Kerem o en renkli kule.', 'Ülkü ütüle.', 'Ülkü etek ütüle.', 'Ülkü etek, atlet ütüle.', 'Ülkü iki etek, on atlet ütüle.', 'Tülin önemli.', 'Tülin okumak önemli.', 'Tülin öykü okumak önemli.', 'Tülin anlayarak öykü okumak önemli.', 'Sude söyle.', 'Sude tekerleme söyle.', 'Sude, Sinan’a tekerleme söyle.', 'Sude, Sinan’a komik tekerleme söyle.', 'Kedi yedi.', 'Kedi mama yedi.', 'Kara kedi mama yedi.', 'Kara kedi sulu mama yedi.', 'Rüya yaktı.', 'Rüya kına yaktı.', 'Rüya eline kına yaktı.', 'Rüya iki eline kına yaktı.', 'Serkan otlat.', 'Serkan koyun otlat.', 'Serkan sekiz koyun otlat.', 'Serkan sekiz koyunu yaylada otlat.', 'Serkan sekiz koyunu yüksek yaylada otlat.', 'Demet yüzdü.', 'Demet derede yüzdü.', 'Demet köydeki derede yüzdü.', 'Demet köydeki derin derede yüzdü.', 'Ziya yedi.', 'Ziya zeytin yedi.', 'Ziya tuzlu zeytin yedi.', 'Ziya dokuz tuzlu zeytin yedi.', 'Çınar çitledi.', 'Çınar çekirdek çitledi.', 'Çınar tuzlu çekirdek çitledi.', 'Çınar çok tuzlu çekirdek çitledi.', 'Burak sarıldı.', 'Burak ninesine sarıldı.', 'Burak ninesine, dedesine sarıldı.', 'Burak ninesine, dedesine sımsıkı sarıldı.', 'Gamze gördü.', 'Gamze balina gördü.', 'Gamze beyaz balina gördü.', 'Gamze büyük beyaz balina gördü.', 'Gamze bir büyük beyaz balina gördü.', 'Canan suladı.', 'Canan çiçekleri suladı.', 'Canan önündeki çiçekleri suladı.', 'Canan camın önündeki çiçekleri suladı.', 'Şakir sattı.', 'Şakir soda sattı.', 'Şakir şişe soda sattı.', 'Şakir on şişe soda sattı.', 'Şenay almış.', 'Şenay şeker almış.', 'Şenay beşli şeker almış.', 'Şenay çikolatalı beşli şeker almış.', 'Gönül oyna.', 'Gönül keçilerle oyna.', 'Gönül cici keçilerle oyna.', 'Gönül küçük cici keçilerle oyna.', 'Gönül çayırda küçük cici keçilerle oyna.', 'Şengül almış.', 'Şengül şemsiye almış.', 'Şengül şirin şemsiye almış.', 'Şengül şirin bir şemsiye almış.', 'Şengül beyaz şirin bir şemsiye almış.', 'Poyraz almış.', 'Poyraz pazardan almış.', 'Poyraz pazardan patlıcan almış.', 'Poyraz pazardan patlıcan, portakal almış.', 'Poyraz pazardan patlıcan, portakal, karpuz almış.', 'Pınar patladı.', 'Pınar top patladı.', 'Pınar küçük top patladı.', 'Pınar küçük pembe top patladı.', 'Karga düşürdü.', 'Karga peyniri düşürdü.', 'Karga gagasındaki peyniri düşürdü.', 'Karga ötünce gagasındaki peyniri düşürdü.', 'Hasan hastalandı.', 'Hasan çok hastalandı.', 'Hasan üşütünce çok hastalandı.', 'Hasan dışarıda üşütünce çok hastalandı.', 'Vedat topladı.', 'Vedat vişne topladı.', 'Vedat vişne, kavun topladı.', 'Vedat vişne, kavun, kivi topladı.', 'Vedat ovadan vişne, kavun, kivi topladı.', 'Çağrı yağdı.', 'Çağrı yağmur yağdı.', 'Çağrı bahçeye yağmur yağdı.', 'Çağrı bizim bahçeye yağmur yağdı.', 'Fare topladı.', 'Fare fındık topladı.', 'Fare fındık, fıstık topladı.', 'Fare fındık, fıstık, ceviz topladı.', 'Jale gitmiş.', 'Jale Japonya’ya gitmiş.', 'Jale öğrenmeye Japonya’ya gitmiş.', 'Jale judo öğrenmeye Japonya’ya gitmiş.',
];
