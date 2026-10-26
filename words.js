// Kelimeler hece sınırlarıyla yazılır (tire = hece ayırıcı).
// Uygulama, açılmış harflerle yazılabilen kelimeleri otomatik süzer.
const WORDS = `
at et it ne ten net tel ten-te i-nat ant e-lin el e-la al a-la la-le ak kal ka-le kel e-lek ek-le kek
i-le ilk kil A-li i-lan ka-nal a-na na-ne ni-ne an-ne i-nek in en an kan nal
ok on ol kol ki-lo o-na ko-lon
el-ma ka-lem me-kan me-lek mil-li ma-ma ek-mek ko-mik e-min nem mal mo-la
kul kum mum o-ku o-kul ko-ku ku-lak un u-lu
tat ta-ne a-ta tel til-ki ta-mam me-tal ku-tu to-ka kot kat tek-ne mut-lu
ün ün-lü tül kül ü-tü kü-me lü-le tüm kü-tük tü-nel
ön öl kö-le ö-lü ö-lüm ö-nem mö-nü
ar er ir or ur a-ra ka-ra ku-ru mor kü-rek ör-tü kurt kart tar-la ma-rul ter-lik or-man tur-na kar-ne mar-ka ro-man o-kur ek-ran to-run kum-ru
a-rı kırk ka-lın ır-mak ı-lık tır-tıl man-tı a-lın a-nı a-nıt kı-rık o-ku-ma
ad dal de-re de-de de-ri ke-di de-mir du-man dok-tor o-da a-da ka-dın dört dün da-ki-ka dol-ma ö-dül a-dım or-du di-ken dam-la din-le tu-na
su sal sen sol ses sa-de sa-kal san-dal son-ra so-ru sa-at ı-sı ma-sa ka-sa as-ker sak-sı sa-rı si-ne-ma süt sü-rü kı-sa At-las ma-sal san-dık sa-la-ta sa-lon so-kak
ba-ba bal ba-lon bak bir bi-na be-bek ka-bak bu-lut bo-ru bar-dak ba-lık bi-sik-let be-re bant eb-ru bas-ton ba-kır ta-bak bak-kal bod-rum sa-bun a-ra-ba bö-lüm
yol yok yan yer ye-mek yas-tık yı-lan yu-mak yu-nus ya-tak ya-kın a-yak ku-yu o-yun a-yı ya-rım ye-ni ye-di yü-rü bay-rak ma-yo ka-yıt ay-na ka-yak may-mun da-yı tay
çam çay çok çan-ta çi-çek ça-tal ça-kıl çı-nar çor-ba çem-ber ço-ban çe-kiç çi-lek a-çık u-çak bı-çak se-çim ke-çi çü-rük çöl çün-kü ça-tı
az zil zor za-man zeb-ra yaz kız yüz u-zak u-zun ka-zak ka-zan muz me-zar tuz bez ya-zı yıl-dız di-zi do-muz yü-zük ku-zu ö-küz bi-zim ü-züm do-kuz ze-min mız-rak kır-mı-zı zur-na
şu şal şe-ker şem-si-ye şar-kı kuş kış taş baş iş ı-şık a-şı a-teş eş yaş ye-şil şim-di şim-şek şi-şe ka-şık çar-şı baş-ka mı-sır de-niz me-nek-şe
gül göl gün göz gök ge-mi ga-ze-te gri genç gi-tar ge-lin göm-lek göz-lük gö-nül gü-neş gü-zel giz-li bil-gi dal-ga yan-gın zen-gin çiz-gi ge-zi man-gal der-gi gu-rur ga-zoz ger-çek
cam can ce-ket ca-dı cu-ma cü-ce E-ce ge-ce a-cı an-cak sı-cak ço-cuk o-yun-cak bul-ma-ca i-cat u-cuz ba-cak cin cey-lan cüz-dan mer-can ten-ce-re a-ce-le cö-mert
pul pil pas-ta pem-be pi-re pa-ra pa-zar pal-to pa-muk pan-to-lon ki-tap top te-pe ka-pı pa-pat-ya pi-rinç se-pet kalp ço-rap yap-rak kap-lan do-lap ka-pak park pen-ce-re pi-lot tep-si lam-ba so-pa ku-pa pa-ket ip i-pek ya-pı
hep hem hoş hız has-ta ha-lı ha-mur ha-yat he-di-ye hey-kel ho-roz ha-mam he-men ha-ber he-ce He-ce-le hur-ma ha-tı-ra a-hır ba-har ma-hal-le to-hum şe-hir sa-bah ne-hir si-hir bah-çe tah-ta mü-hür
dağ ağ a-ğaç yağ sı-ğır o-ğul doğ-ru a-ğız bağ yağ-mur tuğ-la buğ-day ka-ğıt öğ-le öğ-ret-men gö-ğüs de-ğil do-ğum ku-ğu sağ so-ğan kur-ba-ğa kap-lum-ba-ğa e-ğer oğ-lak sağ-lık
fil fa-re fı-rın fın-dık fi-dan film fe-ner fi-yat fut-bol fır-ça ka-fa sof-ra sı-nıf haf-ta köf-te kaf-tan def-ter fiş fi-kir fır-tı-na zarf se-def zü-ra-fa
jü-ri je-ton ji-let ga-raj ba-gaj a-jan-da a-jan plaj pi-ja-ma ma-saj ej-der jim-nas-tik ja-pon
var ev va-zo va-pur o-va dev vi-da va-tan ka-vun ta-vuk ha-vuç ha-vuz ha-va yu-va ce-viz da-vul av-cı e-vet ö-dev kah-ve gü-ver-cin tav-şan ta-van va-gon çi-vi la-va-bo se-vinç ko-va kav-ga hay-van kar-puz
`.split(/\s+/).filter(Boolean).map(w => w.toLocaleLowerCase('tr-TR'));

// Okuduktan sonra gösterilen küçük ödül resimleri
const EMOJI = {
  el: '✋', ela: '👧', ala: '🎨', ak: '🤍', kale: '🏰', lale: '🌷', kek: '🧁', inek: '🐄', kilo: '⚖️',
  elma: '🍎', kalem: '✏️', melek: '👼', muz: '🍌', okul: '🏫', kulak: '👂', tilki: '🦊', tane: '🔹',
  kutu: '📦', üzüm: '🍇', öküz: '🐂', ütü: '👔', kürek: '🏖️', arı: '🐝', kedi: '🐱', oda: '🚪',
  su: '💧', masa: '🪑', kasa: '🧰', süt: '🥛', balon: '🎈', balık: '🐟', bebek: '👶', kabak: '🎃',
  bulut: '☁️', araba: '🚗', yol: '🛣️', yılan: '🐍', ayı: '🐻', yatak: '🛏️', çay: '🍵', çiçek: '🌸',
  çilek: '🍓', uçak: '✈️', kuş: '🐦', güneş: '☀️', gemi: '🚢', gül: '🌹', göl: '🏞️', göz: '👁️',
  cam: '🪟', ceket: '🧥', pasta: '🍰', top: '⚽', kapı: '🚪', yıldız: '⭐', zil: '🔔', zebra: '🦓',
  şeker: '🍬', şemsiye: '☂️', ağaç: '🌳', dağ: '⛰️', fil: '🐘', fare: '🐭', film: '🎬', jeton: '🪙',
  vapur: '⛴️', havuç: '🥕', kavun: '🍈', tavuk: '🐔', dev: '🧌', ev: '🏠', ay: '🌙', at: '🐴',
  saat: '⏰', kar: '❄️', tavşan: '🐰', kaplan: '🐅', horoz: '🐓', domuz: '🐖', zürafa: '🦒',
  maymun: '🐒', kaplumbağa: '🐢', yaprak: '🍃', çorap: '🧦', pamuk: '☁️', pil: '🔋', kitap: '📖',
  telefon: '📱', lamba: '💡', ışık: '💡', mum: '🕯️', ip: '🧵', kuğu: '🦢', kuzu: '🐑', ceylan: '🦌',
};
