'use strict';

// Maarif Modeli (2024) 1. sınıf ses grupları: ANETİL | OKURIM | ÜSÖYDZ | ÇBGCŞ | PHVĞFJ
const ORDER = ['a','n','e','t','i','l','o','k','u','r','ı','m','ü','s','ö','y','d','z','ç','b','g','c','ş','p','h','v','ğ','f','j'];
const VOWELS = new Set(['e','a','i','o','u','ü','ö','ı']);

// Ünsüzleri sesli okutmak için Türkçe harf adları (TTS "l" yerine "le" der)
const SPEAK = { l:'le', k:'ke', n:'ne', m:'me', t:'te', r:'re', d:'de', s:'se', b:'be', y:'ye', ç:'çe', z:'ze', ş:'şe', g:'ge', c:'ce', p:'pe', h:'he', ğ:'yumuşak ge', f:'fe', j:'je', v:'ve' };

const EXAMPLE = {
  e:['elma','🍎'], l:['limon','🍋'], a:['araba','🚗'], k:['kedi','🐱'], i:['inek','🐄'], n:['nane','🌿'],
  o:['okul','🏫'], m:['muz','🍌'], u:['uçak','✈️'], t:['tavşan','🐰'], ü:['üzüm','🍇'], ö:['öküz','🐂'],
  r:['robot','🤖'], ı:['ışık','💡'], d:['dondurma','🍦'], s:['saat','⏰'], b:['balık','🐟'], y:['yıldız','⭐'],
  ç:['çiçek','🌸'], z:['zürafa','🦒'], ş:['şemsiye','☂️'], g:['gemi','🚢'], c:['civciv','🐥'], p:['pasta','🍰'],
  h:['havuç','🥕'], ğ:['dağ','⛰️'], f:['fil','🐘'], j:['jeton','🪙'], v:['vapur','⛴️'],
};

const up = s => s.toLocaleUpperCase('tr-TR');
const $app = document.getElementById('app');
const rnd = n => Math.floor(Math.random() * n);
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/* ---------- Kayıt ---------- */
let S = load();
function load() {
  try {
    const j = JSON.parse(localStorage.getItem('hecele') || '{}');
    return { unlocked: Math.min(Math.max(j.unlocked ?? 4, 1), ORDER.length), stars: j.stars || 0 };
  } catch { return { unlocked: 4, stars: 0 }; }
}
function save() { try { localStorage.setItem('hecele', JSON.stringify(S)); } catch {} }

/* ---------- Ses ---------- */
const synth = window.speechSynthesis;
let voice = null;
let speechLog = [];
function pickVoice() {
  const vs = synth.getVoices();
  const tr = vs.filter(v => v.lang.replace('_', '-').toLowerCase().startsWith('tr'));
  // Gelişmiş/Premium (indirilmiş) ses varsa onu tercih et
  voice = tr.find(v => /premium|enhanced|geliştirilmiş|genişletilmiş|gelişmiş/i.test(v.name + ' ' + v.voiceURI)) || tr[0] || null;
}
if (synth) { pickVoice(); synth.addEventListener?.('voiceschanged', pickVoice); synth.onvoiceschanged = pickVoice; }

// iOS Safari: cancel() hemen ardından speak() gelirse konuşma yutulur; bu yüzden kısa bekleriz.
function say(parts, rate = 0.8) {
  if (!synth) return;
  const list = [].concat(parts);
  const run = () => {
    if (!voice) pickVoice();
    for (const p of list) {
      const u = new SpeechSynthesisUtterance(p);
      u.lang = 'tr-TR';
      if (voice && /premium|enhanced|geliştirilmiş|genişletilmiş|gelişmiş/i.test(voice.name + ' ' + voice.voiceURI)) u.voice = voice;  // varsayılan sesi iOS seçer, iyi sesi biz
      u.rate = rate;
      u.onstart = () => speechLog.push('başladı');
      u.onend = () => speechLog.push('bitti');
      u.onerror = e => speechLog.push('hata: ' + e.error);
      synth.speak(u);
    }
    if (synth.paused) synth.resume();
  };
  if (synth.speaking || synth.pending) { synth.cancel(); setTimeout(run, 80); } else run();
}
const sayLetter = c => say(SPEAK[c] || c, 0.7);
const sayWord = w => say(w.replace(/-/g, ''), 0.75);
const sayWordBySyllable = w => say([...w.split('-'), w.replace(/-/g, '')], 0.7);

/* ---------- Havuzlar ---------- */
const letters = () => ORDER.slice(0, S.unlocked);
const newest = () => ORDER[S.unlocked - 1];

function wordPool() {
  const L = new Set(letters());
  return [...new Set(WORDS)].filter(w => [...w.replace(/-/g, '')].every(c => L.has(c)));
}
function sylPool() {
  const L = letters();
  const vs = L.filter(c => VOWELS.has(c)), cs = L.filter(c => !VOWELS.has(c));
  const out = new Set();
  for (const v of vs) for (const c of cs) { if (c !== 'ğ') out.add(c + v); out.add(v + c); }
  for (const w of wordPool()) for (const s of w.split('-')) out.add(s);
  return [...out];
}
function pick(pool, avoid) {
  const n = newest();
  const withNew = pool.filter(x => x.includes(n));
  const src = withNew.length && Math.random() < 0.5 ? withNew : pool;
  let x, t = 0;
  do { x = src[rnd(src.length)]; } while (x === avoid && src.length > 1 && t++ < 12);
  return x;
}

/* ---------- Yardımcılar ---------- */
const colorize = t => [...t].map(c => `<span class="${VOWELS.has(c) ? 'v' : 'c'}">${c}</span>`).join('');
const wordHtml = w => w.split('-').map(s => `<span class="sy" data-act="say-syl" data-v="${s}">${colorize(s)}</span>`).join('');
const header = (title, back = true) => `
  <header class="bar">
    ${back ? '<button class="icon-btn" data-act="home" aria-label="Geri">⬅️</button>' : '<span></span>'}
    <h1>${title}</h1>
    <span class="stars">⭐ ${S.stars}</span>
  </header>`;

/* ---------- Ekranlar ---------- */
let view = 'home';
let cur = {};   // ekrana özel durum

function go(v, extra = {}) { view = v; cur = extra; synth?.cancel(); render(); }

function render() {
  const f = { home, letters: lettersView, letter: letterView, syl: sylView, build: buildView, read: readView, quiz: quizView, result: resultView, settings: settingsView }[view];
  if (view === 'syl' && !cur.item) nextSyl(true);
  $app.innerHTML = f();
}

function home() {
  return `
    <h1 class="home-title">📖 Hecele</h1>
    <p class="home-sub">Haydi okumayı öğrenelim! &nbsp; ⭐ ${S.stars}</p>
    <div class="menu">
      <button class="m1" data-act="go" data-v="letters"><span>🔤</span>Harfler</button>
      <button class="m2" data-act="go" data-v="syl"><span>🧩</span>Heceler</button>
      <button class="m3" data-act="go" data-v="read"><span>📚</span>Oku</button>
      <button class="m4" data-act="go" data-v="quiz"><span>🎯</span>Oyun</button>
    </div>
    <div class="row">
      <button class="btn ghost" data-act="go" data-v="build">🛠️ Hece Kur</button>
      <button class="icon-btn" data-act="go" data-v="settings" aria-label="Ayarlar">⚙️</button>
    </div>`;
}

function lettersView() {
  const tiles = ORDER.map((c, i) => i < S.unlocked
    ? `<button class="tile ${i === S.unlocked - 1 ? 'new' : ''}" data-act="letter" data-v="${c}"><span class="${VOWELS.has(c) ? 'v' : 'c'}">${up(c)}${c}</span></button>`
    : `<button class="tile locked" disabled>🔒</button>`).join('');
  return header('Harfler') + `<div class="grid">${tiles}</div>`;
}

function letterView() {
  const c = cur.c, [w, pic] = EXAMPLE[c];
  const wHtml = [...w].map(ch => ch === c ? `<span class="${VOWELS.has(c) ? 'v' : 'c'}">${ch}</span>` : ch).join('');
  return header('Harf') + `
    <div class="stage">
      <div class="big-card letter ${VOWELS.has(c) ? 'v' : 'c'}" data-act="say-letter" data-v="${c}">${up(c)}${c}</div>
      <div class="example" data-act="say-word" data-v="${w}"><span class="pic">${pic}</span>${wHtml}</div>
      <p class="hint">Harfe ve resme dokun, sesini dinle</p>
    </div>`;
}

/* Heceler: kart çevirme */
function nextSyl(first) {
  const pool = sylPool();
  cur.item = pick(pool, cur.item);
  if (!first) render();
  say(cur.item, 0.7);
}
function sylView() {
  return header('Heceler') + `
    <div class="stage">
      <div class="big-card syl" data-act="say-syl" data-v="${cur.item || ''}">${colorize(cur.item || '')}</div>
      <p class="hint">Hecenin üstüne dokun, tekrar dinle</p>
      <button class="btn big" data-act="next-syl">Sıradaki ➡️</button>
    </div>`;
}

/* Hece kur: ünsüz + ünlü */
function buildView() {
  const L = letters();
  const cons = L.filter(c => !VOWELS.has(c) && c !== 'ğ'), vows = L.filter(c => VOWELS.has(c));
  cur.c ??= cons[cons.length - 1] ?? null; cur.v ??= vows[0] ?? null;
  const chips = (arr, key) => arr.map(c => `<button class="chip ${VOWELS.has(c) ? 'v' : 'c'} ${cur[key] === c ? 'on' : ''}" data-act="pick-${key}" data-v="${c}">${c}</button>`).join('');
  const syl = cur.c && cur.v ? cur.c + cur.v : '';
  return header('Hece Kur') + `
    <div class="stage">
      <div class="pick">${chips(cons, 'c')}</div>
      <div class="big-card syl" data-act="say-syl" data-v="${syl}">${syl ? colorize(syl) : '?'}</div>
      <div class="pick">${chips(vows, 'v')}</div>
      <p class="hint">Bir ünsüz ve bir ünlü seç, hecenin sesini dinle</p>
    </div>`;
}

/* Oku: kelime okuma */
function nextWord(first) {
  const pool = wordPool();
  cur.shown = false;
  cur.item = pool.length ? pick(pool, cur.item) : null;
  if (!first) render();
}
function readView() {
  if (cur.item === undefined) nextWord(true);
  if (!cur.item) return header('Oku') + `<div class="stage"><p class="hint">Henüz okunacak kelime yok. Ayarlardan daha fazla harf aç.</p></div>`;
  const w = cur.item, pic = EMOJI[w.replace(/-/g, '')];
  return header('Oku') + `
    <div class="stage">
      <div class="emoji-reveal">${cur.shown && pic ? pic : ''}</div>
      <div class="big-card word">${wordHtml(w)}</div>
      <p class="hint">Hecelere tek tek dokun, sonra “Oku” de</p>
      <div class="row">
        <button class="btn big" data-act="read-word">🔊 Oku</button>
        <button class="btn big ghost" data-act="next-word">Sıradaki ➡️</button>
      </div>
    </div>`;
}

/* Oyun: duy ve seç */
const QN = 10;
function startQuiz() {
  const sy = sylPool(), wd = wordPool(), lt = letters();
  const kinds = [];
  if (lt.length >= 2) kinds.push({ pool: lt, w: 2 });
  if (sy.length >= 2) kinds.push({ pool: sy, w: 4 });
  if (wd.length >= 2) kinds.push({ pool: wd, w: 3 });
  const bag = kinds.flatMap(k => Array(k.w).fill(k));
  const qs = [];
  for (let i = 0; i < QN; i++) {
    const k = bag[rnd(bag.length)];
    const target = pick(k.pool, qs[i - 1]?.target);
    const others = shuffle(k.pool.filter(x => x !== target)).slice(0, 3);
    qs.push({ target, options: shuffle([target, ...others]) });
  }
  cur = { qs, i: 0, score: 0, tries: 0, locked: false };
  render();
  setTimeout(() => say(cur.qs[0].target.replace(/-/g, ''), 0.7), 250);
}
function quizView() {
  if (!cur.qs) { setTimeout(startQuiz, 0); return ''; }
  const q = cur.qs[cur.i];
  const dots = cur.qs.map((_, i) => `<span class="dot ${i < cur.i ? 'done' : i === cur.i ? 'now' : ''}"></span>`).join('');
  const opts = q.options.map(o => `<button class="opt" data-act="answer" data-v="${o}">${o.length === 1 ? up(o) + o : o.replace(/-/g, '')}</button>`).join('');
  return header('Oyun') + `
    <div class="progress">${dots}</div>
    <div class="stage">
      <button class="btn big" data-act="repeat-q">🔊 Dinle</button>
      <p class="hint">Duyduğunu bul!</p>
      <div class="options">${opts}</div>
    </div>`;
}
function answer(btn) {
  if (cur.locked) return;
  const q = cur.qs[cur.i];
  if (btn.dataset.v === q.target) {
    cur.locked = true;
    btn.classList.add('ok');
    if (cur.tries === 0) cur.score++;
    say('Aferin!', 0.9);
    setTimeout(() => {
      cur.i++; cur.tries = 0; cur.locked = false;
      if (cur.i >= QN) return finishQuiz();
      render();
      say(cur.qs[cur.i].target.replace(/-/g, ''), 0.7);
    }, 1100);
  } else {
    cur.tries++;
    btn.classList.add('no');
    say(btn.dataset.v.replace(/-/g, ''), 0.7);
  }
}
function finishQuiz() {
  const stars = cur.score >= 9 ? 3 : cur.score >= 7 ? 2 : cur.score >= 4 ? 1 : 0;
  S.stars += stars; save();
  go('result', { score: cur.score, stars });
  say(stars >= 2 ? 'Harikasın!' : 'Güzel deneme!', 0.9);
}
function resultView() {
  return header('Sonuç', false) + `
    <div class="stage">
      <div class="result-stars">${'⭐'.repeat(cur.stars) || '🙂'}</div>
      <div class="example">${QN} sorudan ${cur.score} doğru</div>
      <div class="row">
        <button class="btn big" data-act="go" data-v="quiz">Tekrar oyna</button>
        <button class="btn big ghost" data-act="home">Ana ekran</button>
      </div>
    </div>`;
}

/* Ayarlar (ebeveyn) */
function voiceInfo() {
  if (!synth) return 'Bu tarayıcı sesli okumayı desteklemiyor. Safari ya da Chrome kullanın.';
  if (!voice) pickVoice();
  return voice
    ? `Türkçe ses bulundu: ${voice.name}. Safari'nin gösterdiği Türkçe sesler: ` + synth.getVoices().filter(v => v.lang.replace('_', '-').toLowerCase().startsWith('tr')).map(v => v.name).join(', ')
    : 'Türkçe ses bulunamadı. iPad: Ayarlar > Erişilebilirlik > Seslendirilen İçerik > Sesler > Türkçe sesi indirin. Ayrıca sessiz modu ve ses seviyesini kontrol edin.';
}
function settingsView() {
  const learned = letters().map(c => `<span>${up(c)}${c}</span>`).join('');
  return header('Ayarlar') + `
    <div class="panel">
      <h2>Atlas hangi harfe kadar geldi?</h2>
      <div class="stepper">
        <button class="icon-btn" data-act="less">➖</button>
        <b>${S.unlocked}</b>
        <button class="icon-btn" data-act="more">➕</button>
      </div>
      <div class="learned">${learned}</div>
      <p class="small">Harf sırası Maarif Modeli 1. sınıf ses gruplarını izler: A N E T İ L · O K U R I M · Ü S Ö Y D Z · Ç B G C Ş · P H V Ğ F J.
      Yeni harf açıldıkça Heceler, Oku ve Oyun bölümleri sadece açık harflerle yapılabilen hece ve kelimeleri gösterir.</p>
      <div>
        <button class="btn ghost" data-act="test-voice">🔊 Sesi dene</button>
        <p class="small" id="voice-info">${voiceInfo()}</p>
      </div>
      <button class="btn ghost" data-act="reset-stars">⭐ Yıldızları sıfırla</button>
    </div>`;
}

/* ---------- Olaylar ---------- */
$app.addEventListener('click', e => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  const v = el.dataset.v;
  switch (el.dataset.act) {
    case 'home': go('home'); break;
    case 'go': go(v); break;
    case 'letter': go('letter', { c: v }); sayLetter(v); break;
    case 'say-letter': sayLetter(v); break;
    case 'say-word': sayWord(v); break;
    case 'say-syl': if (v) say(v, 0.7); break;
    case 'next-syl': nextSyl(); break;
    case 'pick-c': cur.c = v; render(); say(cur.c + cur.v, 0.7); break;
    case 'pick-v': cur.v = v; render(); say(cur.c + cur.v, 0.7); break;
    case 'read-word': sayWordBySyllable(cur.item); cur.shown = true; setTimeout(render, 150); break;
    case 'next-word': nextWord(); break;
    case 'repeat-q': say(cur.qs[cur.i].target.replace(/-/g, ''), 0.7); break;
    case 'answer': answer(el); break;
    case 'less': S.unlocked = Math.max(1, S.unlocked - 1); save(); render(); break;
    case 'more': S.unlocked = Math.min(ORDER.length, S.unlocked + 1); save(); render(); break;
    case 'test-voice': speechLog = []; say('Merhaba Atlas, hecele ile okumayı öğrenelim', 0.8);
      setTimeout(() => { const i = document.getElementById('voice-info'); if (i) i.textContent = voiceInfo() + ' | Son deneme: ' + (speechLog.join(' > ') || 'hiçbir şey olmadı'); }, 3500); break;
    case 'reset-stars': S.stars = 0; save(); render(); break;
  }
});

render();
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
