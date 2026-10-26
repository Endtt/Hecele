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

const STICKERS = ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🐔','🐧','🐦','🐤','🦆','🦉','🐴','🦄','🐝','🦋','🐢','🐙','🐬','🐳','🦒'];
const up = s => s.toLocaleUpperCase('tr-TR');
const $app = document.getElementById('app');
const rnd = n => Math.floor(Math.random() * n);
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/* ---------- Kayıt ---------- */
let S = load();
function load() {
  try {
    const j = JSON.parse(localStorage.getItem('hecele') || '{}');
    return { unlocked: Math.min(Math.max(j.unlocked ?? 4, 1), ORDER.length), stars: j.stars || 0,
             album: j.album || 0, history: j.history || [], stats: j.stats || {},
             speed: j.speed || 1, made: j.made || 0, booksRead: j.booksRead || [] };
  } catch { return { unlocked: 4, stars: 0, album: 0, history: [], stats: {}, speed: 1, made: 0, booksRead: [] }; }
}
function save() { try { localStorage.setItem('hecele', JSON.stringify(S)); } catch {} }

/* ---------- Ses ---------- */
const synth = window.speechSynthesis;
let voice = null;
let speechLog = [];
const trVoices = () => synth.getVoices().filter(v => v.lang.replace('_', '-').toLowerCase().startsWith('tr'));
let voiceChosen = false;   // gelişmiş ses bulundu ya da elle seçildi: voice'u açıkça ata
function pickVoice() {
  const tr = trVoices();
  let idx = -1;
  try { idx = parseInt(localStorage.getItem('hecele-voice') ?? '-1', 10); } catch {}
  if (idx >= 0 && tr[idx]) { voice = tr[idx]; voiceChosen = true; return; }
  const good = tr.find(v => /premium|enhanced|geliştirilmiş|genişletilmiş|gelişmiş/i.test(v.name + ' ' + v.voiceURI));
  voice = good || tr[0] || null;
  voiceChosen = !!good;
}
if (synth) { pickVoice(); synth.addEventListener?.('voiceschanged', pickVoice); synth.onvoiceschanged = pickVoice; }

// iOS Safari: cancel() hemen ardından speak() gelirse konuşma yutulur; bu yüzden kısa bekleriz.
function say(parts, rate = 0.8, hooks = []) {
  if (!synth) return;
  const list = [].concat(parts);
  const run = () => {
    if (!voice) pickVoice();
    list.forEach((p, i) => {
      const u = new SpeechSynthesisUtterance(p);
      u.lang = 'tr-TR';
      if (voice && voiceChosen) u.voice = voice;   // varsayılan sesi iOS seçer; seçilmiş sesi biz atarız
      u.rate = rate * (S.speed || 1);
      u.onstart = () => { speechLog.push('başladı'); hooks[i]?.(); };
      u.onend = () => speechLog.push('bitti');
      u.onerror = e => speechLog.push('hata: ' + e.error);
      synth.speak(u);
    });
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
function sylPool(more) {
  const L = letters();
  const vs = L.filter(c => VOWELS.has(c)), cs = L.filter(c => !VOWELS.has(c));
  const out = new Set();
  for (const v of vs) for (const c of cs) { if (c !== 'ğ') out.add(c + v); out.add(v + c); }
  // Hece çalışmasında kapalı heceler de (tan, ner, kil...) çıksın
  if (more) for (const v of vs) for (const c of cs) for (const d of cs) if (c !== 'ğ') out.add(c + v + d);
  for (const w of wordPool()) for (const s of w.split('-')) out.add(s);
  return [...out];
}
// Zorlandığı öğeler (yanlış > doğru) 4 kat sık, iyice pekişenler daha seyrek çıkar
function weight(x) {
  const st = S.stats[x]; if (!st) return 1;
  return st.no > st.ok ? 4 : (st.ok >= 3 && st.ok > st.no * 2 ? 0.4 : 1);
}
function pick(pool, avoid) {
  const n = newest();
  const withNew = pool.filter(x => x.includes(n));
  let src = withNew.length && Math.random() < 0.4 ? withNew : pool;
  if (src.length > 1) src = src.filter(x => x !== avoid);
  let r = Math.random() * src.reduce((t, x) => t + weight(x), 0);
  for (const x of src) { r -= weight(x); if (r <= 0) return x; }
  return src[src.length - 1];
}
function earnStar(n = 1) {
  const before = S.album;
  S.stars += n; S.album = Math.min(STICKERS.length, S.album + n); save();
  return STICKERS.slice(before, S.album);
}
function record(item, ok) {
  const st = S.stats[item] ||= { ok: 0, no: 0 };
  st[ok ? 'ok' : 'no']++;
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
  const f = { home, letters: lettersView, letter: letterView, syl: sylView, build: buildView, read: readView, sent: sentView, write: writeView, album: albumView, make: makeView, books: booksView, book: bookView, bookend: bookEndView, quiz: quizView, result: resultView, settings: settingsView }[view];
  if (view === 'syl' && !cur.item) nextSyl(true);
  $app.innerHTML = f();
  if (view === 'write') initCanvas();
  if (view === 'make' && cur.say) { const w = cur.say; cur.say = null; say(w, 0.7); }
}

function home() {
  return `
    <h1 class="home-title">📖 Hecele</h1>
    <p class="home-sub">Haydi okumayı öğrenelim! &nbsp; ⭐ ${S.stars}</p>
    <div class="menu">
      <button class="m1" data-act="go" data-v="letters"><span>🔤</span>Harfler</button>
      <button class="m2" data-act="go" data-v="syl"><span>🧩</span>Heceler</button>
      <button class="m3" data-act="go" data-v="read"><span>📚</span>Oku</button>
      <button class="m7" data-act="go" data-v="make"><span>🧱</span>Kelime Kur</button>
      <button class="m5" data-act="go" data-v="sent"><span>💬</span>Cümle</button>
      <button class="m8" data-act="go" data-v="books"><span>📕</span>Kitap</button>
      <button class="m6" data-act="go" data-v="write"><span>✍️</span>Yaz</button>
      <button class="m4" data-act="go" data-v="quiz"><span>🎯</span>Oyun</button>
    </div>
    <div class="row">
      <button class="btn ghost" data-act="go" data-v="build">🛠️ Hece Kur</button>
      <button class="btn ghost" data-act="go" data-v="album">🏆 Albüm</button>
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
  const pool = sylPool(true);
  // son gösterilenleri tekrar etme (havuzun yarısı kadar, en çok 12)
  const rec = cur.recent ||= [];
  const fresh = pool.filter(x => !rec.includes(x));
  cur.item = pick(fresh.length ? fresh : pool, cur.item);
  rec.push(cur.item); while (rec.length > Math.min(12, Math.floor(pool.length / 2))) rec.shift();
  if (!first) render();
  say(cur.item, 0.7);
}
function sylView() {
  const s = cur.item || '', L = new Set(letters());
  // aynı ünsüzle başlayan hece ailesi
  const c0 = s && !VOWELS.has(s[0]) ? s[0] : null;
  const fam = c0 ? [...L].filter(v => VOWELS.has(v)).map(v => c0 + v) : [];
  // bu heceyi içeren kelimeler
  const ex = s ? wordPool().filter(w => w.split('-').includes(s)).sort(() => Math.random() - .5).slice(0, 6) : [];
  return header('Heceler') + `
    <div class="stage">
      <div class="big-card syl" data-act="say-syl" data-v="${s}">${colorize(s)}</div>
      <p class="hint">Hecenin üstüne dokun, tekrar dinle</p>
      ${fam.length > 1 ? `<div class="row">${fam.map(f => `<button class="chip ${f === s ? 'on' : ''}" data-act="say-syl" data-v="${f}">${f}</button>`).join('')}</div>` : ''}
      ${ex.length ? `<p class="hint">Bu heceyi içeren kelimeler</p><div class="row">${ex.map(w => { const p = w.replace(/-/g, ''); return `<button class="btn ghost" data-act="say-word" data-v="${w}">${EMOJI[p] || ''} ${p}</button>`; }).join('')}</div>` : ''}
      <div class="row">
        <button class="btn big ghost" data-act="blend">🔤 Birleştir</button>
        <button class="btn big" data-act="next-syl">Sıradaki ➡️</button>
      </div>
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
        <button class="btn big ghost" data-act="hard-word">🤔 Zorlandım</button>
        <button class="btn big ghost" data-act="next-word">😊 Okudum ➡️</button>
      </div>
    </div>`;
}

/* Oyun: duy ve seç */
const QN = 10;
function startQuiz() {
  const sy = sylPool(), wd = wordPool(), lt = letters();
  const picWords = wd.filter(w => EMOJI[w.replace(/-/g, '')]);
  const kinds = [];
  if (lt.length >= 2) kinds.push({ pool: lt, w: 2, type: 'hear' });
  if (sy.length >= 2) kinds.push({ pool: sy, w: 4, type: 'hear' });
  if (wd.length >= 2) kinds.push({ pool: wd, w: 3, type: 'hear' });
  if (picWords.length >= 3 && wd.length >= 4) kinds.push({ pool: wd, targets: picWords, w: 3, type: 'pic' });
  const bag = kinds.flatMap(k => Array(k.w).fill(k));
  const qs = [];
  for (let i = 0; i < QN; i++) {
    const k = bag[rnd(bag.length)];
    const target = pick(k.targets || k.pool, qs[i - 1]?.target);
    const others = shuffle(k.pool.filter(x => x !== target)).slice(0, 3);
    qs.push({ target, type: k.type, options: shuffle([target, ...others]) });
  }
  cur = { qs, i: 0, score: 0, tries: 0, locked: false };
  render();
  setTimeout(() => askQ(), 250);
}
const askQ = () => { const q = cur.qs[cur.i]; if (q.type === 'hear') say(q.target.replace(/-/g, ''), 0.7); };
function quizView() {
  if (!cur.qs) { setTimeout(startQuiz, 0); return ''; }
  const q = cur.qs[cur.i];
  const dots = cur.qs.map((_, i) => `<span class="dot ${i < cur.i ? 'done' : i === cur.i ? 'now' : ''}"></span>`).join('');
  const opts = q.options.map(o => `<button class="opt" data-act="answer" data-v="${o}">${o.length === 1 ? up(o) + o : o.replace(/-/g, '')}</button>`).join('');
  const top = q.type === 'pic'
    ? `<div class="emoji-reveal">${EMOJI[q.target.replace(/-/g, '')]}</div><p class="hint">Resim hangi kelime?</p>`
    : `<button class="btn big" data-act="repeat-q">🔊 Dinle</button><p class="hint">Duyduğunu bul!</p>`;
  return header('Oyun') + `
    <div class="progress">${dots}</div>
    <div class="stage">
      ${top}
      <div class="options">${opts}</div>
    </div>`;
}
function answer(btn) {
  if (cur.locked) return;
  const q = cur.qs[cur.i];
  if (btn.dataset.v === q.target) {
    cur.locked = true;
    btn.classList.add('ok');
    if (cur.tries === 0) { cur.score++; record(q.target, true); } else save();
    say(q.type === 'pic' ? q.target.replace(/-/g, '') + '. Aferin!' : 'Aferin!', 0.9);
    setTimeout(() => {
      cur.i++; cur.tries = 0; cur.locked = false;
      if (cur.i >= QN) return finishQuiz();
      render();
      askQ();
    }, 1300);
  } else {
    if (cur.tries === 0) record(q.target, false);
    cur.tries++;
    btn.classList.add('no');
    say(btn.dataset.v.replace(/-/g, ''), 0.7);
  }
}
function finishQuiz() {
  const stars = cur.score >= 9 ? 3 : cur.score >= 7 ? 2 : cur.score >= 4 ? 1 : 0;
  const before = S.album;
  S.stars += stars; S.album = Math.min(STICKERS.length, S.album + stars);
  S.history = [...S.history, cur.score].slice(-10);
  save();
  go('result', { score: cur.score, stars, won: STICKERS.slice(before, S.album) });
  say(stars >= 2 ? 'Harikasın!' : 'Güzel deneme!', 0.9);
}
function resultView() {
  const confetti = cur.stars >= 2 ? '<div class="confetti">' + Array.from({ length: 24 }, (_, i) =>
    `<span style="left:${rnd(100)}%;animation-delay:${(Math.random() * 1.2).toFixed(2)}s">${['⭐', '🎉', '✨', '🎈'][i % 4]}</span>`).join('') + '</div>' : '';
  return confetti + header('Sonuç', false) + `
    <div class="stage">
      <div class="result-stars">${'⭐'.repeat(cur.stars) || '🙂'}</div>
      <div class="example">${QN} sorudan ${cur.score} doğru</div>
      ${cur.won.length ? `<div class="example">Yeni dost: <span class="pic-inline">${cur.won.join(' ')}</span></div>` : ''}
      <div class="row">
        <button class="btn big" data-act="go" data-v="quiz">Tekrar oyna</button>
        <button class="btn big ghost" data-act="home">Ana ekran</button>
      </div>
    </div>`;
}

/* Kelime Kur: karışık heceleri sırayla dizerek kelimeyi oluştur */
function nextMake(first) {
  const all = wordPool().filter(w => w.includes('-'));
  const withPic = all.filter(w => EMOJI[w.replace(/-/g, '')]);
  const pool = withPic.length >= 3 && Math.random() < 0.75 ? withPic : all;   // çoğunlukla resimli kelimeler
  cur.item = pool.length ? pick(pool, cur.item) : null;
  if (cur.item) {
    cur.sy = cur.item.split('-'); cur.placed = 0; cur.done = false; cur.missed = false;
    cur.tiles = shuffle(cur.sy.map((s, i) => ({ s, id: i }))); cur.used = new Set();
    cur.say = cur.item.replace(/-/g, '');
  }
  if (!first) render();
}
function makeView() {
  if (cur.item === undefined) nextMake(true);
  if (!cur.item) return header('Kelime Kur') + `<div class="stage"><p class="hint">Kelime kurmak için iki heceli kelimeler gerekir. Ayarlardan daha fazla harf aç.</p></div>`;
  const w = cur.item.replace(/-/g, ''), pic = EMOJI[w];
  const slots = cur.sy.map((x, i) => `<span class="slot ${i < cur.placed ? 'full' : ''}">${i < cur.placed ? colorize(x) : ''}</span>`).join('');
  const tiles = cur.tiles.filter(t => !cur.used.has(t.id)).map(t => `<button class="tile-syl" data-act="make-pick" data-id="${t.id}" data-v="${t.s}">${colorize(t.s)}</button>`).join('');
  return header('Kelime Kur') + `
    <div class="stage">
      <div class="emoji-reveal">${pic || '🔊'}</div>
      <div class="slots">${slots}</div>
      ${cur.done
        ? `<div class="example">${cur.won ? '🎉 Yeni dost: ' + cur.won.join(' ') : '✅ Aferin!'}</div>
           <button class="btn big" data-act="make-next">Sıradaki ➡️</button>`
        : `<div class="tiles">${tiles}</div>
           <p class="hint">Heceleri doğru sıraya diz</p>
           <button class="btn ghost" data-act="make-hear">🔊 Dinle</button>`}
    </div>`;
}
function makePick(btn) {
  if (cur.done) return;
  const v = btn.dataset.v;
  if (v === cur.sy[cur.placed]) {
    cur.used.add(+btn.dataset.id); cur.placed++;
    if (cur.placed === cur.sy.length) {
      cur.done = true; cur.won = null;
      record(cur.item, !cur.missed);
      S.made++; if (S.made % 5 === 0) cur.won = earnStar(1); else save();
      say(cur.item.replace(/-/g, ''), 0.7);
    } else say(v, 0.7);
    render();
  } else {
    btn.classList.add('no'); cur.missed = true; say(v, 0.7);
    setTimeout(() => btn.classList.remove('no'), 400);
  }
}

/* Kitaplık */
const bookNeed = b => Math.max(...b.pages.flatMap(([t]) => [...t.toLocaleLowerCase('tr-TR').replace(/[^a-zçğıöşü]/g, '')].map(c => ORDER.indexOf(c) + 1)));
function booksView() {
  const items = BOOKS.map((b, i) => {
    const need = bookNeed(b), open = need <= S.unlocked, read = S.booksRead.includes(b.title);
    return open
      ? `<button class="book" data-act="open-book" data-i="${i}"><span>${b.emoji}</span><b>${b.title}</b><small>${read ? '✅ okudun' : b.pages.length + ' sayfa'}</small></button>`
      : `<button class="book locked" disabled><span>🔒</span><b>${b.title}</b><small>${need}. harfe kadar öğrenince açılır</small></button>`;
  }).join('');
  return header('Kitaplık') + `<div class="books">${items}</div>`;
}
function bookView() {
  const b = BOOKS[cur.bi], [text, pic] = b.pages[cur.pg];
  const words = text.split(' ').map((w, i) => `<span class="sw" data-act="say-sw" data-v="${w.replace(/[^\p{L}]/gu, '')}" data-i="${i}">${w}</span>`).join(' ');
  const last = cur.pg === b.pages.length - 1;
  const dots = b.pages.map((_, i) => `<span class="dot ${i < cur.pg ? 'done' : i === cur.pg ? 'now' : ''}"></span>`).join('');
  return header(b.title) + `
    <div class="progress">${dots}</div>
    <div class="stage">
      <div class="emoji-reveal">${pic}</div>
      <div class="big-card sentence">${words}</div>
      <div class="row">
        <button class="icon-btn" data-act="book-prev" ${cur.pg ? '' : 'disabled'}>⬅️</button>
        <button class="btn big" data-act="read-sent">🔊 Oku</button>
        <button class="btn big ghost" data-act="book-next">${last ? 'Bitir 🎉' : '➡️'}</button>
      </div>
    </div>`;
}
function bookEndView() {
  return header('Kitap bitti', false) + `
    <div class="stage">
      <div class="result-stars">🎉</div>
      <div class="example">“${BOOKS[cur.bi].title}” kitabını okudun!</div>
      ${cur.won?.length ? `<div class="example">Yeni dost: <span class="pic-inline">${cur.won.join(' ')}</span></div>` : ''}
      <div class="row">
        <button class="btn big" data-act="go" data-v="books">Kitaplık</button>
        <button class="btn big ghost" data-act="home">Ana ekran</button>
      </div>
    </div>`;
}

/* Cümle okuma */
function sentPool() {
  const L = new Set(letters());
  return SENTENCES.filter(t => [...t.toLocaleLowerCase('tr-TR').replace(/[^a-zçğıöşü]/g, '')].every(c => L.has(c)));
}
function nextSent() { cur.item = sentPool().length ? pick(sentPool(), cur.item) : null; cur.read = false; render(); }
function sentView() {
  if (cur.item === undefined) { const p = sentPool(); cur.item = p.length ? pick(p) : null; }
  if (!cur.item) return header('Cümle') + `<div class="stage"><p class="hint">Cümle okumak için biraz daha harf lazım. Ayarlardan daha fazla harf aç.</p></div>`;
  const words = cur.item.split(' ').map((w, i) => `<span class="sw" data-act="say-sw" data-v="${w.replace(/[^\p{L}]/gu, '')}" data-i="${i}">${w}</span>`).join(' ');
  return header('Cümle') + `
    <div class="stage">
      <div class="big-card sentence">${words}</div>
      <p class="hint">Kelimelere tek tek dokun, sonra “Oku” de</p>
      <div class="row">
        <button class="btn big" data-act="read-sent">🔊 Oku</button>
        <button class="btn big ghost" data-act="next-sent">Sıradaki ➡️</button>
      </div>
    </div>`;
}
function readSentence() {
  const spans = [...document.querySelectorAll('.sw')];
  const words = spans.map(sp => sp.dataset.v);
  say([...words, cur.item], 0.7, spans.map(sp => () => { spans.forEach(x => x.classList.remove('hl')); sp.classList.add('hl'); }));
}

/* Yaz: harf çizme */
function writeView() {
  const L = letters(); cur.wi ??= L.length - 1; cur.upper ??= false;
  const c = L[Math.min(cur.wi, L.length - 1)];
  return header('Yaz') + `
    <div class="stage">
      <canvas id="pad" aria-label="Yazma alanı"></canvas>
      <div class="row">
        <button class="icon-btn" data-act="w-prev">⬅️</button>
        <button class="btn ghost" data-act="w-case">${up(c)} / ${c}</button>
        <button class="icon-btn" data-act="w-next">➡️</button>
      </div>
      <div class="row">
        <button class="btn" data-act="w-clear">🧽 Temizle</button>
        <button class="btn ghost" data-act="say-letter" data-v="${c}">🔊 Dinle</button>
      </div>
      <p class="hint">Parmağınla gri harfin üstünden geç</p>
    </div>`;
}
function writeLetter() { const L = letters(); const c = L[Math.min(cur.wi, L.length - 1)]; return cur.upper ? up(c) : c; }
function initCanvas() {
  const cv = document.getElementById('pad'); if (!cv) return;
  const dpr = window.devicePixelRatio || 1;
  const w = Math.floor(Math.min(window.innerWidth - 32, 560)), h = Math.floor(Math.min(window.innerHeight * 0.42, 380));
  cv.style.width = w + 'px'; cv.style.height = h + 'px'; cv.width = w * dpr; cv.height = h * dpr;
  const g = cv.getContext('2d'); g.scale(dpr, dpr);
  const font = `800 ${h * 0.95}px ui-rounded, "SF Pro Rounded", system-ui, sans-serif`;
  const layer = () => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c.getContext('2d', { willReadFrequently: true }); };
  const ink = layer(), thin = layer(), mask = layer(), maskDil = layer();   // kontrol için görünmez katmanlar
  const glyph = (x, dil) => { x.font = font; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#000'; x.fillText(writeLetter(), w / 2, h * 0.55); if (dil) { x.lineWidth = 44; x.lineJoin = 'round'; x.strokeText(writeLetter(), w / 2, h * 0.55); } };
  const guide = () => {
    g.clearRect(0, 0, w, h);
    for (const x of [ink, thin, mask, maskDil]) x.clearRect(0, 0, w, h);
    glyph(mask, false); glyph(maskDil, true);
    g.fillStyle = '#e6e1cf'; g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(writeLetter(), w / 2, h * 0.55);
    g.strokeStyle = '#d6d0ba'; g.setLineDash([6, 8]); g.lineWidth = 2;
    for (const y of [h * 0.18, h * 0.55, h * 0.92]) { g.beginPath(); g.moveTo(8, y); g.lineTo(w - 8, y); g.stroke(); }
    g.setLineDash([]);
    g.lineWidth = 16; g.lineCap = 'round'; g.lineJoin = 'round';
    for (const [x, lw] of [[ink, 44], [thin, 16]]) { x.lineWidth = lw; x.lineCap = 'round'; x.lineJoin = 'round'; x.strokeStyle = '#000'; }
  };
  guide(); cv._redraw = guide;

  // Harf yeterince kaplandı mı? (kalın iz harfin ne kadarını örtüyor, ince iz harfin dışına taşıyor mu)
  const check = () => {
    const m = mask.getImageData(0, 0, w, h).data, k = ink.getImageData(0, 0, w, h).data;
    const t = thin.getImageData(0, 0, w, h).data, d = maskDil.getImageData(0, 0, w, h).data;
    let glyphPx = 0, covered = 0, inkPx = 0, spill = 0;
    for (let i = 3; i < m.length; i += 12) {   // her 3. piksel
      if (m[i] > 128) { glyphPx++; if (k[i] > 0) covered++; }
      if (t[i] > 0) { inkPx++; if (d[i] < 128) spill++; }
    }
    return glyphPx > 0 && covered / glyphPx >= 0.55 && inkPx > 40 && spill / inkPx <= 0.6;
  };
  cv._check = check;

  let drawing = false, done = false;
  const pos = e => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  cv.addEventListener('pointerdown', e => {
    if (done) return;
    drawing = true; cv.setPointerCapture(e.pointerId);
    const [x, y] = pos(e); g.strokeStyle = '#1d4ed8';
    for (const c of [g, ink, thin]) { c.beginPath(); c.moveTo(x, y); c.lineTo(x + 0.1, y + 0.1); c.stroke(); }
  });
  cv.addEventListener('pointermove', e => {
    if (!drawing) return; const [x, y] = pos(e);
    for (const c of [g, ink, thin]) { c.lineTo(x, y); c.stroke(); }
  });
  const stop = () => {
    if (!drawing) return; drawing = false;
    if (!done && check()) { done = true; writeSuccess(); }
  };
  cv.addEventListener('pointerup', stop); cv.addEventListener('pointercancel', stop);
}
function writeSuccess() {
  const L = letters(), c = L[Math.min(cur.wi, L.length - 1)];
  const last = cur.upper && cur.wi >= L.length - 1;
  const note = document.querySelector('.hint'); if (note) note.textContent = last ? '🎉 Bütün harfleri yazdın!' : '✅ Aferin!';
  document.getElementById('pad')?.classList.add('ok');
  say(last ? 'Bütün harfleri yazdın!' : 'Aferin!', 0.9);
  setTimeout(() => {
    if (view !== 'write') return;
    if (!cur.upper) cur.upper = true;                       // önce küçük harf, sonra büyüğü
    else if (cur.wi < L.length - 1) { cur.wi++; cur.upper = false; }
    render();
  }, 1300);
}

/* Albüm */
function albumView() {
  const items = STICKERS.map((e, i) => `<div class="sticker ${i < S.album ? '' : 'off'}">${i < S.album ? e : '❔'}</div>`).join('');
  return header('Albüm') + `
    <div class="stage">
      <p class="hint">${S.album} / ${STICKERS.length} dost topladın. Oyunda yıldız kazandıkça yeni dostlar gelir!</p>
      <div class="album">${items}</div>
    </div>`;
}

/* Birleştir: harfleri tek tek vurgula, sonra heceyi yavaş oku */
function blend() {
  const card = document.querySelector('.big-card.syl'); if (!card || !cur.item) return;
  const spans = [...card.querySelectorAll('.v,.c')];
  say(cur.item, 0.5);
  spans.forEach((sp, i) => setTimeout(() => { spans.forEach(x => x.classList.remove('hl')); sp.classList.add('hl'); }, i * 550));
  setTimeout(() => spans.forEach(x => x.classList.remove('hl')), spans.length * 550 + 500);
}

/* Ayarlar (ebeveyn) */
function voiceInfo() {
  if (!synth) return 'Bu tarayıcı sesli okumayı desteklemiyor. Safari ya da Chrome kullanın.';
  if (!voice) pickVoice();
  return voice
    ? `Kullanılan ses: ${trVoices().indexOf(voice) + 1}. (${trVoices().length} Türkçe ses var: ` + trVoices().map(v => `${v.name} [${(v.voiceURI || '').split('.').slice(-3).join('.')}]`).join(', ') + ')'
    : 'Türkçe ses bulunamadı. iPad: Ayarlar > Erişilebilirlik > Seslendirilen İçerik > Sesler > Türkçe sesi indirin. Ayrıca sessiz modu ve ses seviyesini kontrol edin.';
}
function progressHtml() {
  const h = S.history, last = h.slice(-3);
  const avg = last.length ? last.reduce((a, b) => a + b, 0) / last.length : 0;
  const weak = Object.entries(S.stats).filter(([, st]) => st.no > st.ok).sort((a, b) => b[1].no - a[1].no).slice(0, 8).map(([k]) => k.replace(/-/g, ''));
  return `<div class="progress-box">
    <b>İlerleme</b>
    <div>Son oyunlar: ${h.length ? h.map(x => `${x}/${QN}`).join(' · ') : 'henüz oyun oynanmadı'}</div>
    ${last.length >= 3 && avg >= 8 ? '<div class="ready">🌟 Son 3 oyunda ortalama ' + avg.toFixed(1) + '/10. Atlas yeni harfe hazır olabilir.</div>' : ''}
    ${weak.length ? `<div>Zorlandığı yerler: <b>${weak.join(', ')}</b> (daha sık tekrar çıkar)</div>` : ''}
  </div>`;
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
      ${progressHtml()}
      <p class="small">Harf sırası Maarif Modeli 1. sınıf ses gruplarını izler: A N E T İ L · O K U R I M · Ü S Ö Y D Z · Ç B G C Ş · P H V Ğ F J.
      Yeni harf açıldıkça Heceler, Oku ve Oyun bölümleri sadece açık harflerle yapılabilen hece ve kelimeleri gösterir.</p>
      <div>
        <b>Okuma hızı</b>
        <div class="row">
          ${[['🐢 Yavaş', 0.75], ['Normal', 1], ['🐇 Hızlı', 1.25]].map(([t, v]) => `<button class="btn ghost ${S.speed === v ? 'on' : ''}" data-act="speed" data-v="${v}">${t}</button>`).join('')}
        </div>
      </div>
      <div>
        <div class="row">
          <button class="btn ghost" data-act="test-voice">🔊 Sesi dene</button>
          <button class="btn ghost" data-act="next-voice">🔁 Sesi değiştir</button>
        </div>
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
    case 'blend': blend(); break;
    case 'pick-c': cur.c = v; render(); say(cur.c + cur.v, 0.7); break;
    case 'pick-v': cur.v = v; render(); say(cur.c + cur.v, 0.7); break;
    case 'read-word': {
      const sy = [...document.querySelectorAll('.big-card.word .sy')];
      say([...cur.item.split('-'), cur.item.replace(/-/g, '')], 0.7, sy.map(x => () => { sy.forEach(y => y.classList.remove('hl')); x.classList.add('hl'); }));
      cur.shown = true; document.querySelector('.emoji-reveal').textContent = EMOJI[cur.item.replace(/-/g, '')] || '';
      break;
    }
    case 'hard-word': record(cur.item, false); save(); sayWordBySyllable(cur.item); break;
    case 'next-word': record(cur.item, true); save(); nextWord(); break;
    case 'say-sw': say(v, 0.7); break;
    case 'make-pick': makePick(el); break;
    case 'make-next': nextMake(); break;
    case 'make-hear': say(cur.item.replace(/-/g, ''), 0.7); break;
    case 'open-book': go('book', { bi: +el.dataset.i, pg: 0 }); break;
    case 'book-prev': cur.pg--; render(); break;
    case 'book-next': {
      const b = BOOKS[cur.bi];
      if (cur.pg < b.pages.length - 1) { cur.pg++; render(); break; }
      let won = [];
      if (!S.booksRead.includes(b.title)) { S.booksRead.push(b.title); won = earnStar(1); }
      go('bookend', { bi: cur.bi, won }); say('Aferin! Kitabı bitirdin!', 0.9); break;
    }
    case 'speed': S.speed = parseFloat(v); save(); render(); say('Merhaba Atlas', 0.8); break;
    case 'read-sent': readSentence(); break;
    case 'next-sent': nextSent(); break;
    case 'w-prev': cur.wi = Math.max(0, cur.wi - 1); render(); break;
    case 'w-next': cur.wi = Math.min(letters().length - 1, cur.wi + 1); render(); break;
    case 'w-case': cur.upper = !cur.upper; document.getElementById('pad')?._redraw(); break;
    case 'w-clear': document.getElementById('pad')?._redraw(); break;
    case 'repeat-q': askQ(); break;
    case 'answer': answer(el); break;
    case 'less': S.unlocked = Math.max(1, S.unlocked - 1); save(); render(); break;
    case 'more': S.unlocked = Math.min(ORDER.length, S.unlocked + 1); save(); render(); break;
    case 'test-voice': speechLog = []; say('Merhaba Atlas, hecele ile okumayı öğrenelim', 0.8);
      setTimeout(() => { const i = document.getElementById('voice-info'); if (i) i.textContent = voiceInfo() + ' | Son deneme: ' + (speechLog.join(' > ') || 'hiçbir şey olmadı'); }, 3500); break;
    case 'next-voice': {
      const n = trVoices().length; if (!n) break;
      const cur = Math.max(0, trVoices().indexOf(voice));
      try { localStorage.setItem('hecele-voice', String((cur + 1) % n)); } catch {}
      pickVoice(); speechLog = []; say('Merhaba Atlas, hecele ile okumayı öğrenelim', 0.8);
      setTimeout(() => { const i = document.getElementById('voice-info'); if (i) i.textContent = voiceInfo(); }, 300); break;
    }
    case 'reset-stars': S.stars = 0; save(); render(); break;
  }
});

render();
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
