// Fiel · app (sin dependencias). Habla directo con Supabase (Auth + PostgREST + Storage + Functions).
import * as K from '/card.js';
const C = window.FIEL_CONFIG;
const $ = (s, r = document) => r.querySelector(s);
const app = $('#app'), nav = $('#nav'), sw = $('#sheet-wrap'), sheet = $('#sheet'), toastEl = $('#toast');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const first = (n) => String(n || '').split(' ')[0];
const initials = (n) => String(n || '?').split(/\s+/).slice(0, 2).map((x) => x[0] || '').join('').toUpperCase();
const fmtCed = (c) => (c ? c[0] + '-' + c.slice(1).replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '');
const fmtPhone = (p) => (p ? p.replace(/^(\d{4})(\d{3})(\d{4})$/, '$1 $2 $3') : '');
const waLink = (phone, text) => 'https://wa.me/58' + String(phone).replace(/\D/g, '').replace(/^0/, '') + (text ? '?text=' + encodeURIComponent(text) : '');
const slugify = (n) => n.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'tienda';
const fmtDate = (d) => new Date(d).toLocaleDateString('es-VE', { day: 'numeric', month: 'short' });
const fmtTime = (d) => new Date(d).toLocaleString('es-VE', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });

/* ---------- Íconos ---------- */
const P = {
  wallet: '<path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h12A1.5 1.5 0 0 1 19 6.5V8"/><rect x="3" y="8" width="18" height="12" rx="2.5"/><circle cx="16.5" cy="14" r="1.3"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 20.5a8 8 0 0 1 16 0"/>',
  stamp: '<path d="M9.5 3.5h5l-1 6h4a1.5 1.5 0 0 1 1.5 1.5v3H5v-3a1.5 1.5 0 0 1 1.5-1.5h4z"/><path d="M5 17.5h14"/>',
  gift: '<rect x="4" y="9.5" width="16" height="10.5" rx="1.5"/><path d="M3 9.5h18M12 9.5V20M12 9.5C10 9.5 7.5 9 7.5 7s2.6-2.4 4.5 2.5c1.9-4.9 4.5-4.4 4.5-2.5s-2.5 2.5-4.5 2.5"/>',
  users: '<circle cx="9" cy="8.5" r="3.3"/><path d="M3 19.5a6 6 0 0 1 12 0"/><path d="M15.5 5.6a3.2 3.2 0 0 1 0 6.1M17 14a5.5 5.5 0 0 1 4 5.5"/>',
  store: '<path d="M4 9.5 5.5 4h13L20 9.5"/><path d="M4 9.5a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0"/><path d="M5.5 11.5V20h13v-8.5"/><path d="M10 20v-4.5h4V20"/>',
  back: '<path d="M14.5 5.5 8 12l6.5 6.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  check: '<path d="M5 12.5 10 17.5 19 7"/>',
  msg: '<path d="M4 18.5V6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v8a2.5 2.5 0 0 1-2.5 2.5H8z"/>',
  shield: '<path d="M12 3.5 19 6v5.5c0 4.5-3 8-7 9.5-4-1.5-7-5-7-9.5V6z"/>',
  qr: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><path d="M14 14h2v2h-2zM18 18h2v2h-2zM14 18h2M18 14h2"/>',
  lock: '<rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  card: '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M3 10h18"/>',
  cog: '<circle cx="12" cy="12" r="3"/><path d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6 6l1.6 1.6M16.4 16.4 18 18M6 18l1.6-1.6M16.4 7.6 18 6"/>',
  out: '<path d="M14 4h4.5A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H14"/><path d="M10 8l-4 4 4 4M6 12h10"/>',
  upload: '<path d="M12 15V4M7.5 8.5 12 4l4.5 4.5"/><path d="M4 15.5V19a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3.5"/>',
  face: '<path d="M4 8V6.5A2.5 2.5 0 0 1 6.5 4H8M16 4h1.5A2.5 2.5 0 0 1 20 6.5V8M20 16v1.5a2.5 2.5 0 0 1-2.5 2.5H16M8 20H6.5A2.5 2.5 0 0 1 4 17.5V16"/><path d="M9 9.5v1M15 9.5v1M12 9.5v3.5h-1M9.5 16a3.5 3.5 0 0 0 5 0"/>',
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.8v.2"/>',
};
const ic = (n, s = 20) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ''}</svg>`;
const LOGO = '<img class="logo" src="/assets/logo.svg" alt="fiel">';

/* ---------- UI helpers ---------- */
let tt;
function toast(t) { toastEl.textContent = t; toastEl.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove('show'), 3000); }
function openSheet(html) { sheet.innerHTML = html; sheet.scrollTop = 0; sw.classList.add('open'); }
function closeSheet() { sw.classList.remove('open'); }
sw.addEventListener('click', (e) => { if (e.target === sw) closeSheet(); });
const loading = () => { app.innerHTML = '<div class="spinner"></div>'; };
function setNav(items, active) {
  if (!items) { nav.classList.add('hide'); return; }
  nav.classList.remove('hide');
  nav.innerHTML = items.map(([href, label, icon]) => `<button class="${href === active ? 'on' : ''}" data-go="${href}">${ic(icon, 22)}<span>${label}</span></button>`).join('');
}
const cedField = (id, val = '', ac = 'off') => `<div class="pair"><select class="inp" id="${id}p" aria-label="Tipo de cédula"><option${val[0] === 'E' ? '' : ' selected'}>V</option><option${val[0] === 'E' ? ' selected' : ''}>E</option></select><input class="inp" id="${id}" name="${ac === 'username' ? 'username' : id}" inputmode="numeric" autocomplete="${ac}" placeholder="24567890" maxlength="10" value="${val ? val.slice(1) : ''}"></div>`;
const readCed = (id) => { const d = ($('#' + id)?.value || '').replace(/\D/g, ''); return d ? $('#' + id + 'p').value + d : ''; };
const telField = (id) => `<div class="pair"><select class="inp" id="${id}p" aria-label="Operadora">${['0414', '0424', '0412', '0416', '0426', '0422'].map((p) => `<option>${p}</option>`).join('')}</select><input class="inp" id="${id}" inputmode="numeric" autocomplete="tel" placeholder="1234567" maxlength="8"></div>`;
const readTel = (id) => { const d = ($('#' + id)?.value || '').replace(/\D/g, ''); return d ? $('#' + id + 'p').value + d : ''; };
const blockedSheet = (h, p) => openSheet(`<div class="bigicon warn">${ic('lock', 26)}</div><h2>${h}</h2><p>${p}</p><div class="btns"><button class="primary" data-close>Entendido</button></div>`);

/* ---------- API (Supabase por REST) ---------- */
const SKEY = 'fiel.session.v1';
let session = null;
try { session = JSON.parse(localStorage.getItem(SKEY) || 'null'); } catch { session = null; }
const saveSession = (s) => { session = s; try { s ? localStorage.setItem(SKEY, JSON.stringify(s)) : localStorage.removeItem(SKEY); } catch {} };
class NetErr extends Error {}

/* ---------- Face ID / huella (WebAuthn del propio teléfono) ---------- */
const BKEY = 'fiel.bio.v1', LKEY = 'fiel.locked.v1';
const lsGet = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };
const lsSet = (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const isApple = /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
const BIO = isApple ? 'Face ID' : 'tu huella';
const BIO_T = isApple ? 'Face ID o Touch ID' : 'huella o rostro';
const b64u = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64u = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4)), (c) => c.charCodeAt(0));
let bioOk = null;
async function bioSupported() {
  if (bioOk !== null) return bioOk;
  bioOk = !!(window.PublicKeyCredential && window.isSecureContext && navigator.credentials);
  if (bioOk && !/iPhone|iPad|iPod|Android|Macintosh/.test(navigator.userAgent)) { try { bioOk = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable(); } catch { bioOk = false; } }
  return bioOk;
}
const bioInfo = () => lsGet(BKEY);
async function bioEnable(u) {
  const cred = await navigator.credentials.create({ publicKey: {
    challenge: crypto.getRandomValues(new Uint8Array(32)),
    rp: { name: 'Fiel', id: location.hostname },
    user: { id: new TextEncoder().encode(u.id), name: fmtCed(u.cedula), displayName: u.full_name },
    pubKeyCredParams: [{ type: 'public-key', alg: -7 }, { type: 'public-key', alg: -257 }],
    authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required', residentKey: 'discouraged' },
    timeout: 60000, attestation: 'none' } });
  lsSet(BKEY, { id: b64u(cred.rawId), uid: u.id, ced: u.cedula, name: u.full_name });
  try { sessionStorage.setItem('fiel.unlocked', '1'); } catch {}
}
async function bioCheck() {
  const b = bioInfo(); if (!b) throw new Error('Face ID no está activado.');
  await navigator.credentials.get({ publicKey: {
    challenge: crypto.getRandomValues(new Uint8Array(32)), rpId: location.hostname,
    allowCredentials: [{ type: 'public-key', id: unb64u(b.id), transports: ['internal'] }],
    userVerification: 'required', timeout: 60000 } });
}
function bioOff() { lsSet(BKEY, null); const l = lsGet(LKEY); lsSet(LKEY, null); return l; }
// Guarda la sesión "bajo llave": solo se recupera con Face ID / huella.
function bioLock() { if (session && bioInfo()) { lsSet(LKEY, session); saveSession(null); me = null; } try { sessionStorage.removeItem('fiel.unlocked'); } catch {} }
const bioErr = (e) => e && e.name === 'NotSupportedError' ? `Este teléfono no permite usar ${BIO} aquí. Revisa que tenga ${BIO} activado en Ajustes del teléfono.` : e && (e.name === 'NotAllowedError' || e.name === 'AbortError') ? `No se confirmó con ${BIO}. Intenta otra vez o entra con tu contraseña.` : (e?.message || 'No se pudo usar ' + BIO + '.');

async function refreshIfNeeded() {
  if (!session) return;
  if (session.expires_at && Date.now() / 1000 < session.expires_at - 60) return;
  const r = await fetch(`${C.supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
    method: 'POST', headers: { apikey: C.supabaseKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: session.refresh_token }),
  }).catch(() => null);
  if (!r) return; // sin red: seguimos con el token actual
  if (!r.ok) { saveSession(null); return; }
  const j = await r.json();
  saveSession({ ...j, expires_at: j.expires_at || Math.floor(Date.now() / 1000) + j.expires_in });
}
async function api(path, { method = 'GET', body, headers = {}, single = false, raw = false } = {}) {
  await refreshIfNeeded();
  const h = { apikey: C.supabaseKey, ...headers };
  if (session?.access_token) h.Authorization = 'Bearer ' + session.access_token;
  if (body !== undefined && !(body instanceof Blob)) h['Content-Type'] = 'application/json';
  if (single) h.Accept = 'application/vnd.pgrst.object+json';
  let r;
  try { r = await fetch(C.supabaseUrl + path, { method, headers: h, cache: 'no-store', body: body === undefined ? undefined : body instanceof Blob ? body : JSON.stringify(body) }); }
  catch { throw new NetErr('Sin conexión. Revisa tu internet.'); }
  if (raw) return r;
  const txt = await r.text();
  const data = txt ? (() => { try { return JSON.parse(txt); } catch { return txt; } })() : null;
  if (!r.ok) {
    if (r.status === 401 && session) { saveSession(null); }
    throw new Error((data && (data.message || data.error_description || data.msg || data.error)) || 'Algo salió mal. Intenta de nuevo.');
  }
  return data;
}
const db = {
  get: (table, q = '', opt) => api(`/rest/v1/${table}?${q}`, opt),
  insert: (table, row) => api(`/rest/v1/${table}`, { method: 'POST', body: row, headers: { Prefer: 'return=representation' } }).then((d) => (Array.isArray(d) ? d[0] : d)),
  update: (table, q, patch) => api(`/rest/v1/${table}?${q}`, { method: 'PATCH', body: patch, headers: { Prefer: 'return=representation' } }),
  del: (table, q) => api(`/rest/v1/${table}?${q}`, { method: 'DELETE' }),
  rpc: (fn, args = {}) => api(`/rest/v1/rpc/${fn}`, { method: 'POST', body: args }),
};
const uid = () => session?.user?.id;
const emailFor = (ced) => `${ced.toLowerCase()}@cuentas.fiel.app`;
async function signIn(ced, password) {
  let r;
  try {
    r = await fetch(`${C.supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: 'POST', headers: { apikey: C.supabaseKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailFor(ced), password }),
    });
  } catch { throw new Error('Sin conexión. Revisa tu internet.'); }
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(/invalid/i.test(j.error_description || j.msg || '') ? 'Cédula o contraseña incorrecta.' : 'No pudimos entrar. Intenta de nuevo.');
  saveSession({ ...j, expires_at: j.expires_at || Math.floor(Date.now() / 1000) + j.expires_in });
  me = null;
  const b = bioInfo(); if (b && b.uid !== j.user?.id) bioOff(); else lsSet(LKEY, null);
  try { sessionStorage.setItem('fiel.unlocked', '1'); } catch {}
}
async function signOut(forget) {
  if (bioInfo() && !forget) { bioLock(); location.hash = '#/entrar'; toast(`Sesión cerrada. Vuelve a entrar con ${BIO}.`); return; }
  if (forget) { const l = bioOff(); if (l?.refresh_token && !session) saveSession(l); }
  try { await api('/auth/v1/logout', { method: 'POST' }); } catch {}
  saveSession(null); me = null; location.hash = '#/';
}
let me = null;
async function loadMe(force) {
  if (!session) return null;
  if (me && !force) return me;
  try { me = await db.get('profiles', `id=eq.${uid()}&select=*`, { single: true }); } catch (e) { if (!session) return null; throw e; }
  return me;
}
let cfgCache = null;
const fmtBs = (n) => Number(n).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const bcvDay = (cfg) => cfg.bcv_date ? new Date(cfg.bcv_date + 'T12:00:00').toLocaleDateString('es-VE', { day: 'numeric', month: 'short' }) : 'hoy';
const bsLine = (cfg, eur) => cfg.bcv_rate > 0 ? `€${eur} = <b style="color:var(--fg)">Bs ${fmtBs(eur * cfg.bcv_rate)}</b> · tasa BCV del ${bcvDay(cfg)} (Bs ${fmtBs(cfg.bcv_rate)} por €)` : '';
const getConfig = async () => cfgCache || (cfgCache = await db.get('app_config', 'id=eq.1&select=*', { single: true }).catch(() => ({ price_eur: 20, kit_eur: 60, bcv_rate: 0, trial_days: 14, support_phone: C.support })));

/* ---------- Cola sin señal (sellos) ---------- */
const QKEY = 'fiel.queue.v1';
const getQueue = () => { try { return JSON.parse(localStorage.getItem(QKEY) || '[]'); } catch { return []; } };
const setQueue = (q) => { try { localStorage.setItem(QKEY, JSON.stringify(q)); } catch {} };
async function flushQueue() {
  const q = getQueue(); if (!q.length || !session) return;
  const left = []; let sent = 0;
  for (const it of q) {
    try { await db.rpc('stamp_customers', { p_store: it.store, p_cedulas: it.cedulas, p_qty: it.qty, p_channel: it.channel, p_ref: it.ref || null, p_offline_at: it.at }); sent++; }
    catch (e) { if (e instanceof NetErr) left.push(it); }
  }
  setQueue(left);
  if (sent) toast(`Señal de vuelta: enviamos ${sent} sello${sent > 1 ? 's' : ''} guardado${sent > 1 ? 's' : ''}`);
}
window.addEventListener('online', () => { flushQueue(); if (location.hash.includes('/sellar')) route(); });
window.addEventListener('offline', () => { if (location.hash.includes('/sellar')) route(); });

/* ---------- Tarjeta ---------- */
const DEF_LOOK = { finish: 'metal', accent: '#c9a14a', a2: '#f3e2b3', font: 'geist', shape: 'dot', logoMode: 'circulo', logoColor: 'original', anim: 'ink', personality: 'minimalista' };
const LEGACY_FINISH = { metal: 'metal', color: 'mate', grad: 'grad', papel: 'papel', blanco: 'blanco' };
function look(st) {
  const d = st.design || {};
  const s = { ...DEF_LOOK, ...d, name: st.name, type: st.business_type || '', reward: st.reward, needed: st.needed, terms: st.terms || '' };
  if (!d.finish && d.style) s.finish = LEGACY_FINISH[d.style] || 'metal';
  if (!s.iso && !s.wordm && d.logo) { s.iso = d.logo; s.m_iso = { ratio: 1 }; }
  if (!K.FL[s.finish]) s.finish = 'metal';
  return s;
}
const cardHTML = (st, stamps = 0, o = {}) => K.cardHTML(st.finish ? st : look(st), stamps, o);
function cellsHTML(st, n) {
  const s = look(st), ui = K.uiColor(s); let h = '';
  for (let i = 0; i < s.needed; i++) h += `<div class="cell${i < n ? ' on' : ''}" style="--ui:${ui}">${i < n ? K.shapeSVG(s) : i + 1}</div>`;
  return h + `<div class="cell gift">${ic('gift', 18)}</div>`;
}
function lum(h) { const n = parseInt(String(h).replace('#', ''), 16); const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255; return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255; }
const termsHTML = (t, title = 'Términos y condiciones del premio') => { const li = String(t || '').split(/\n+/).map((x) => x.trim()).filter(Boolean); return li.length ? `<div class="terms"><b>${title}</b><ul>${li.map((l) => `<li>${esc(l)}</li>`).join('')}</ul></div>` : ''; };

/* ---------- QR (librería cargada al usarla) ---------- */
let qrLib = null;
function loadQR() {
  if (qrLib) return qrLib;
  qrLib = new Promise((res, rej) => { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js'; s.onload = () => res(window.qrcode); s.onerror = rej; document.head.appendChild(s); });
  return qrLib;
}
async function qrInto(el, text) {
  try { const qrcode = await loadQR(); const q = qrcode(0, 'M'); q.addData(text); q.make(); el.innerHTML = q.createSvgTag({ cellSize: 6, margin: 2, scalable: true }); }
  catch { el.innerHTML = `<p style="color:#111;font-size:13px;word-break:break-all">${esc(text)}</p>`; }
}
const storeURL = (slug) => `${location.origin}/#/t/${slug}`;



/* ---------- Router ---------- */
const routes = [];
const on = (re, fn) => routes.push([re, fn]);
async function route() {
  closeSheet();
  const h = location.hash.replace(/^#/, '') || '/';
  for (const [re, fn] of routes) {
    const m = h.match(re);
    if (m) { try { await fn(...m.slice(1)); } catch (e) { showError(e); } window.scrollTo(0, 0); return; }
  }
  location.hash = '#/';
}
window.addEventListener('hashchange', route);
function showError(e) {
  console.error(e);
  setNav(null);
  app.innerHTML = `<div class="empty"><div class="bigicon warn">${ic('info', 26)}</div><h2 style="margin-top:14px">Algo salió mal</h2><p>${esc(e.message || 'Intenta de nuevo.')}</p>
    <button class="primary" data-act="reload">Intentar de nuevo</button><a class="ghost" style="margin-top:10px" href="${waLink(C.support, 'Hola, la app de Fiel me mostró un error: ' + (e.message || ''))}" target="_blank" rel="noopener">Escribir a soporte</a></div>`;
}
const needAuth = (next) => { if (!session) { sessionStorage.setItem('fiel.next', next || location.hash); location.hash = '#/entrar'; return true; } return false; };
const goNext = () => { const n = sessionStorage.getItem('fiel.next'); sessionStorage.removeItem('fiel.next'); location.hash = n && n !== '#/entrar' && n !== '#/registro' ? n : '#/cartera'; };
async function offerBio() {
  if (bioInfo() || localStorage.getItem('fiel.bio.asked') || !(await bioSupported())) return;
  try { localStorage.setItem('fiel.bio.asked', '1'); } catch {}
  setTimeout(() => openSheet(`<div class="bigicon">${ic('face', 26)}</div><h2>Entra con <em>${BIO}</em></h2><p>La próxima vez no tendrás que escribir tu contraseña. Tu ${isApple ? 'cara' : 'huella'} no sale de tu teléfono: Fiel nunca la ve ni la guarda.</p><div class="btns"><button class="primary" data-act="bioon">Activar ${BIO}</button><button class="ghost" data-close>Ahora no</button></div>`), 450);
}
const clientNav = (a) => setNav([['#/cartera', 'Cartera', 'wallet'], ['#/perfil', 'Perfil', 'user']], a);

/* ---------- Bienvenida ---------- */
on(/^\/$/, async () => {
  if (session) { location.hash = '#/cartera'; return; }
  setNav(null);
  const demo = [{ name: 'Molienda Café', business_type: 'Cafetería', reward: 'Un café gratis', needed: 8, design: { finish: 'papel', accent: '#7a4a2a', a2: '#c89f7a', font: 'fraunces' } },
    { name: 'Kaiser Barber', business_type: 'Barbería', reward: 'Corte gratis', needed: 6, design: { finish: 'onix', accent: '#c9a14a', a2: '#f3e2b3', font: 'cormorant' } },
    { name: 'Toro Burgers', business_type: 'Hamburguesería', reward: 'Combo gratis', needed: 10, design: { finish: 'anodizado', accent: '#e4572e', a2: '#f2a541', font: 'unbounded' } }];
  app.innerHTML = `<section class="hero">${LOGO}<h1>Todas tus tarjetas de fidelidad, <em>en un solo lugar</em>.</h1>
    <p class="lead">Suma sellos diciendo tu cédula al pagar y recibe tus premios por WhatsApp.</p>
    <div class="stack">${demo.map((d, i) => cardHTML(d, [5, 3, 7][i])).join('')}</div>
    <a class="primary" href="#/registro">Crear mi cuenta</a><a class="ghost" style="margin-top:10px" href="#/entrar">Ya tengo cuenta</a>
    <p class="hint">¿Tienes un negocio? Crea tu cuenta y registra tu tienda desde tu perfil.</p></section>`;
});

/* ---------- Registro ---------- */
on(/^\/registro$/, async () => {
  setNav(null);
  app.innerHTML = `<div class="top"><a class="iconbtn" href="#/" aria-label="Volver">${ic('back')}</a></div>
    <h1>Crea tu <em>cuenta</em></h1><p class="lead">Tu cédula y tu teléfono hacen que cada tarjeta sea solo tuya.</p>
    <form class="form" id="rf" novalidate>
      <label class="flabel" for="rn">Nombre y apellido</label><input class="inp" id="rn" autocomplete="name" placeholder="Daniel Herrera" maxlength="80">
      <label class="flabel" for="rc">Cédula</label>${cedField('rc', '', 'username')}
      <label class="flabel" for="rt">Teléfono con WhatsApp</label>${telField('rt')}
      <label class="flabel" for="rp">Contraseña</label><input class="inp" id="rp" type="password" autocomplete="new-password" placeholder="Mínimo 6 caracteres">
      <label class="flabel" for="rp2">Repite la contraseña</label><input class="inp" id="rp2" type="password" autocomplete="new-password" placeholder="Igual a la anterior">
      <label class="check"><input type="checkbox" id="rlg"> <span>Acepto los <button type="button" class="linkbtn" style="padding:0" data-act="legal">Términos y la Política de privacidad</button> de Fiel.</span></label>
      <p class="err" id="rerr" role="alert"></p>
      <button class="primary" type="submit" id="rbtn">Crear mi cuenta</button>
    </form><p class="hint">¿Ya tienes cuenta? <a href="#/entrar">Entrar</a></p>`;
});
async function submitRegister() {
  const name = $('#rn').value.trim(), ced = readCed('rc'), tel = readTel('rt'), p1 = $('#rp').value, p2 = $('#rp2').value, er = $('#rerr');
  er.textContent = '';
  if (name.split(/\s+/).length < 2) return (er.textContent = 'Escribe tu nombre y apellido.');
  if (!/^[VE][0-9]{6,9}$/.test(ced)) return (er.textContent = 'Revisa tu cédula.');
  if (!/^04(12|14|16|22|24|26)[0-9]{7}$/.test(tel)) return (er.textContent = 'El teléfono debe tener 7 dígitos después de la operadora.');
  if (p1.length < 6) return (er.textContent = 'La contraseña debe tener mínimo 6 caracteres.');
  if (p1 !== p2) return (er.textContent = 'Las contraseñas no coinciden.');
  if (!$('#rlg').checked) return (er.textContent = 'Acepta los Términos y la Política de privacidad para continuar.');
  const b = $('#rbtn'); b.disabled = true; b.textContent = 'Creando tu cuenta…';
  try {
    const r = await fetch(`${C.supabaseUrl}/functions/v1/register`, { method: 'POST', headers: { apikey: C.supabaseKey, 'Content-Type': 'application/json' }, body: JSON.stringify({ full_name: name, cedula: ced, phone: tel, password: p1 }) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || 'No pudimos crear la cuenta.');
    await signIn(ced, p1);
    toast(`¡Bienvenido a Fiel, ${first(name)}!`);
    goNext(); offerBio();
  } catch (e) { er.textContent = e.message; b.disabled = false; b.textContent = 'Crear mi cuenta'; }
}

/* ---------- Entrar ---------- */
on(/^\/entrar$/, async () => {
  if (session) { goNext(); return; }
  setNav(null);
  const b = bioInfo(), locked = b && lsGet(LKEY);
  app.innerHTML = `<div class="top"><a class="iconbtn" href="#/" aria-label="Volver">${ic('back')}</a></div>
    <h1>${locked ? `Hola, <em>${esc(first(b.name))}</em>` : 'Bienvenido <em>de vuelta</em>'}</h1>
    ${locked ? `<div class="glass pad" style="text-align:center;margin-top:14px"><button class="bioBtn" data-act="biounlock" aria-label="Entrar con ${BIO}">${ic('face', 40)}</button>
      <button class="primary" style="margin-top:14px" data-act="biounlock">Entrar con ${BIO}</button><p class="err" id="berr" role="alert"></p>
      <p class="small" style="margin-top:6px">${fmtCed(b.ced)} · <button class="linkbtn" style="padding:0" data-act="biowho">¿No eres tú?</button></p></div>
      <p class="small" style="text-align:center;margin:22px 0 4px">O entra con tu contraseña</p>` : '<p class="lead">Entra con tu cédula y tu contraseña.</p>'}
    <form class="form" id="lf" novalidate>
      <label class="flabel" for="lc">Cédula</label>${cedField('lc', '', 'username')}
      <label class="flabel" for="lp">Contraseña</label><input class="inp" id="lp" name="password" type="password" autocomplete="current-password" placeholder="Tu contraseña">
      <p class="err" id="lerr" role="alert"></p>
      <button class="primary" type="submit" id="lbtn">Entrar</button>
    </form>
    <p class="hint"><button class="linkbtn" data-act="forgot">¿Olvidaste tu contraseña?</button><br>¿No tienes cuenta? <a href="#/registro">Créala aquí</a></p>`;
  if (locked) { $('#lc').value = b.ced.slice(1); const p = $('#lcp'); if (p) p.value = b.ced[0]; if (!window.__bioAuto) { window.__bioAuto = 1; setTimeout(() => { window.__bioSilent = 1; $('[data-act="biounlock"]')?.click(); }, 350); } }
});
let fails = 0;
async function submitLogin() {
  const ced = readCed('lc'), pw = $('#lp').value, er = $('#lerr');
  er.textContent = '';
  if (!ced) return (er.textContent = 'Escribe tu cédula.');
  if (!pw) return (er.textContent = 'Escribe tu contraseña.');
  const b = $('#lbtn'); b.disabled = true; b.textContent = 'Entrando…';
  try { await signIn(ced, pw); fails = 0; goNext(); offerBio(); }
  catch (e) { fails++; er.innerHTML = esc(e.message) + (fails >= 2 ? ' <button type="button" class="linkbtn" data-act="forgot">¿La olvidaste?</button>' : ''); b.disabled = false; b.textContent = 'Entrar'; }
}

/* ---------- Cartera ---------- */
on(/^\/cartera$/, async () => {
  if (needAuth('#/cartera')) return;
  clientNav('#/cartera'); loading();
  const u = await loadMe();
  if (!u) { location.hash = '#/entrar'; return; }
  offerBio();
  const [cards, prizes] = await Promise.all([
    db.get('cards', `user_id=eq.${uid()}&select=stamps,last_visit_at,store_id,stores(id,name,slug,business_type,reward,needed,terms,design,verify_status)&order=last_visit_at.desc.nullslast`),
    db.get('rewards', `user_id=eq.${uid()}&status=eq.pendiente&select=code,reward,store_id,created_at,expires_at,stores(name)&order=created_at.desc`),
  ]);
  const h = new Date().getHours(), hi = h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches';
  app.innerHTML = `<div class="top"><div class="av">${initials(u.full_name)}</div><div class="rt"><small class="eyebrow">${hi}</small><b style="font-size:20px">${esc(first(u.full_name))}</b></div></div>
    ${prizes.length ? `<div class="section"><span class="eyebrow">Premios listos para retirar</span><div class="list">${prizes.map((p) => `<button class="prizecard" data-act="prize" data-code="${p.code}" data-reward="${esc(p.reward)}" data-store="${esc(p.stores?.name)}" data-exp="${p.expires_at}">${ic('gift', 22)}<div class="rt"><b>${esc(p.reward)}</b><small>${esc(p.stores?.name)} · vence ${fmtDate(p.expires_at)}</small></div><span class="code">${p.code}</span></button>`).join('')}</div></div>` : ''}
    <div class="section"><span class="eyebrow">Mi cartera · ${cards.length}</span>
    ${cards.length ? `<div class="wallet">${cards.map((c) => `<a class="item" href="#/tarjeta/${c.store_id}">${cardHTML(c.stores, c.stamps, { prize: prizes.some((p) => p.store_id === c.store_id) })}</a>`).join('')}</div>`
      : `<div class="glass pad" style="text-align:center"><p>Todavía no tienes tarjetas.</p><p class="small" style="margin-top:6px">En tu próxima compra en una tienda con Fiel, dile tu cédula al cajero o escanea su QR. Tu tarjeta aparecerá aquí.</p><div class="notice info" style="text-align:left;margin-top:14px">${ic('info', 16)}<span>Tu cédula: <b>${fmtCed(u.cedula)}</b></span></div></div>`}</div>`;
});

/* ---------- Detalle de tarjeta ---------- */
on(/^\/tarjeta\/([0-9a-f-]{36})$/, async (sid) => {
  if (needAuth()) return;
  clientNav('#/cartera'); loading();
  const [card, hist, prize] = await Promise.all([
    db.get('cards', `user_id=eq.${uid()}&store_id=eq.${sid}&select=stamps,stores(*)`, { single: true }),
    db.get('stamps', `user_id=eq.${uid()}&store_id=eq.${sid}&select=qty,channel,created_at&order=created_at.desc&limit=30`),
    db.get('rewards', `user_id=eq.${uid()}&store_id=eq.${sid}&status=eq.pendiente&select=code,reward,terms,expires_at&limit=1`),
  ]);
  const st = card.stores, left = st.needed - card.stamps, pz = prize[0], u = await loadMe();
  app.innerHTML = `<div class="top"><a class="iconbtn" href="#/cartera" aria-label="Volver">${ic('back')}</a><b class="sp">${esc(st.name)}${st.verify_status === 'verificada' ? ' <span class="tag ok">Verificada</span>' : ''}</b></div>
    <div class="pv-host" id="cdh">${cardHTML(st, card.stamps, { prize: !!pz })}</div>
    <div class="glass" style="margin-top:14px"><div class="cgrid">${cellsHTML(st, card.stamps)}</div></div>
    ${pz ? `<div class="glass pad" style="margin-top:14px;text-align:center"><span class="eyebrow">Premio por retirar</span><h2>${esc(pz.reward)}</h2><div class="bigcode">${pz.code}</div><p class="small">Muéstralo en caja o escríbelo en tu pedido en línea. Vence el ${fmtDate(pz.expires_at)}.</p></div>`
      : `<p class="lead" style="margin-top:14px">Te falta${left > 1 ? 'n' : ''} <b style="color:var(--fg)">${left} sello${left > 1 ? 's' : ''}</b> para: ${esc(st.reward)}</p>`}
    ${termsHTML(pz ? pz.terms : st.terms)}
    <div class="section"><span class="eyebrow">Cómo sumar sellos</span><div class="glass pad"><p>Cuando pagues en ${esc(st.name)}, dile al cajero tu cédula. Si compras en línea, la tienda te sella con el mismo número.</p><p style="margin-top:8px;font-size:22px;font-weight:700;color:var(--fg)">${fmtCed(u.cedula)}</p></div></div>
    <div class="section"><span class="eyebrow">Historial</span><div class="list">${hist.map((h) => `<div class="row"><div class="av">${ic('stamp', 18)}</div><div class="rt"><b>+${h.qty} sello${h.qty > 1 ? 's' : ''}${h.channel === 'online' ? '<span class="tag">En línea</span>' : ''}</b><small>${fmtTime(h.created_at)}</small></div></div>`).join('') || '<p class="empty">Todavía no hay sellos aquí.</p>'}</div></div>`;
  const seenK = 'fiel.seen.' + sid; let seen = null; try { seen = localStorage.getItem(seenK); } catch {}
  try { localStorage.setItem(seenK, String(card.stamps)); } catch {}
  if (seen !== null && card.stamps > +seen && !pz) setTimeout(() => { const c = $('#cdh .card'), dot = c?.querySelectorAll('.dots i')[card.stamps - 1]; if (c) K.effect(look(st), $('#cdh'), dot || c, c); }, 450);
});

/* ---------- Página pública de la tienda (QR) ---------- */
on(/^\/t\/([a-z0-9-]+)$/, async (slug) => {
  setNav(session ? [['#/cartera', 'Cartera', 'wallet'], ['#/perfil', 'Perfil', 'user']] : null, '');
  loading();
  const rows = await db.get('stores', `slug=eq.${slug}&select=id,name,slug,business_type,reward,needed,terms,design,verify_status,zone,instagram`);
  const st = rows[0];
  if (!st) { app.innerHTML = `<div class="empty"><h2>Tienda no encontrada</h2><p>Revisa el enlace o el QR.</p><a class="primary" href="#/">Ir a Fiel</a></div>`; return; }
  app.innerHTML = `<div class="top">${LOGO}</div><span class="eyebrow">${esc(st.business_type)}${st.zone ? ' · ' + esc(st.zone) : ''}</span>
    <h1>${esc(st.name)}${st.verify_status === 'verificada' ? ' <span class="tag ok">Verificada</span>' : ''}</h1>
    ${cardHTML(st, 0)}
    <p class="lead" style="margin-top:16px">Junta <b style="color:var(--fg)">${st.needed} sellos</b> y gana: <b style="color:var(--fg)">${esc(st.reward)}</b>.</p>
    ${termsHTML(st.terms)}
    <button class="primary" data-act="join" data-slug="${st.slug}">${session ? 'Agregar a mi cartera' : 'Crear mi cuenta y agregarla'}</button>
    ${session ? '' : `<a class="ghost" style="margin-top:10px" href="#/entrar" data-act="setnext" data-next="#/t/${st.slug}">Ya tengo cuenta</a>`}
    <p class="hint">Después, en cada compra solo dices tu cédula al pagar.</p>`;
});
async function joinStore(slug) {
  if (!session) { sessionStorage.setItem('fiel.next', '#/t/' + slug); location.hash = '#/registro'; return; }
  try { const r = await db.rpc('join_store', { p_slug: slug }); toast(`${r.name} ya está en tu cartera`); location.hash = '#/tarjeta/' + r.store_id; }
  catch (e) { toast(e.message); }
}

/* ---------- Perfil ---------- */
on(/^\/perfil$/, async () => {
  if (needAuth('#/perfil')) return;
  clientNav('#/perfil'); loading();
  const u = await loadMe(true);
  const stores = await db.rpc('my_stores').catch(() => []);
  const ROLE = { dueno: 'Dueño', encargado: 'Encargado', cajero: 'Cajero', mesonero: 'Mesonero', personalizado: 'Equipo' };
  app.innerHTML = `<h1>Perfil</h1>
    <div class="glass pad" style="display:flex;gap:14px;align-items:center"><div class="av" style="width:56px;height:56px;font-size:18px">${initials(u.full_name)}</div><div class="rt"><b style="font-size:18px">${esc(u.full_name)}</b><small>${fmtCed(u.cedula)} · ${fmtPhone(u.phone)}</small></div></div>
    ${u.is_admin ? `<div class="section"><span class="eyebrow">Administración</span><div class="list"><a class="row" href="#/admin/tiendas"><div class="av">${ic('shield')}</div><div class="rt"><b>Panel de administración</b><small>Tiendas, pagos y configuración</small></div></a></div></div>` : ''}
    <div class="section"><span class="eyebrow">Mi negocio</span><div class="list">
      ${stores.map((s) => `<a class="row" href="#/tienda/${s.id}/sellar"><div class="av">${initials(s.name)}</div><div class="rt"><b>${esc(s.name)}${s.verify_status === 'verificada' ? '<span class="tag ok">Verificada</span>' : ''}</b><small>${ROLE[s.role] || s.role} · ${s.status === 'prueba' ? 'En prueba gratis' : s.status}</small></div>${ic('store')}</a>`).join('')}
      <a class="row" href="#/nueva-tienda"><div class="av">${ic('plus')}</div><div class="rt"><b>${stores.length ? 'Registrar otro negocio' : '¿Tienes un negocio?'}</b><small>Crea tu tarjeta de fidelidad. 14 días gratis.</small></div></a>
    </div></div>
    ${(await bioSupported()) ? `<div class="section"><span class="eyebrow">Seguridad</span><div class="list"><button class="row" data-act="${bioInfo() ? 'biooff' : 'bioon'}"><div class="av">${ic('face')}</div><div class="rt"><b>Entrar con ${BIO}${bioInfo() ? '<span class="tag ok">Activado</span>' : ''}</b><small>${bioInfo() ? `Te lo pedimos cada vez que abres Fiel. Toca para desactivarlo.` : `Entra sin escribir tu contraseña. Tu ${isApple ? 'cara' : 'huella'} no sale de tu teléfono.`}</small></div></button></div></div>` : ''}
    <div class="section"><span class="eyebrow">Ayuda</span><div class="list">
      <button class="row" data-act="install"><div class="av">${ic('upload')}</div><div class="rt"><b>Agregar a la pantalla de inicio</b><small>Abre Fiel con un toque, como una app</small></div></button>
      <a class="row" href="${waLink(C.support, `Hola, soy ${u.full_name}. Necesito ayuda con Fiel.`)}" target="_blank" rel="noopener"><div class="av">${ic('msg')}</div><div class="rt"><b>Escribir a soporte</b><small>Por WhatsApp</small></div></a>
      <button class="row" data-act="legal"><div class="av">${ic('shield')}</div><div class="rt"><b>Términos y privacidad</b><small>Qué datos guardamos y para qué</small></div></button>
    </div></div>
    <button class="ghost" style="margin-top:22px" data-act="logout">${ic('out', 18)} Cerrar sesión</button>`;
});

/* ---------- Nueva tienda ---------- */
on(/^\/nueva-tienda$/, async () => {
  if (needAuth('#/nueva-tienda')) return;
  setNav(null);
  const cfg = await getConfig();
  app.innerHTML = `<div class="top"><a class="iconbtn" href="#/perfil" aria-label="Volver">${ic('back')}</a></div>
    <h1>Registra tu <em>tienda</em></h1><p class="lead">Usamos tu misma cuenta. Empiezas con ${cfg.trial_days} días gratis, con todas las funciones.</p>
    <form class="form" id="nsf" novalidate>
      <label class="flabel" for="nsn">Nombre del negocio</label><input class="inp" id="nsn" maxlength="40" placeholder="Ej: Bulls Burgers">
      <label class="flabel" for="nst">¿Qué vendes?</label><input class="inp" id="nst" maxlength="40" placeholder="Ej: Hamburguesería, barbería, café…">
      <label class="flabel" for="nsz">Zona o ciudad</label><input class="inp" id="nsz" maxlength="60" placeholder="Ej: Av. Bolívar, Maracay">
      <label class="flabel" for="nsp">WhatsApp del negocio</label>${telField('nsp')}
      <label class="flabel" for="nsi">Instagram (opcional)</label><input class="inp" id="nsi" maxlength="31" placeholder="@tunegocio">
      <label class="flabel" for="nsr">Premio</label><input class="inp" id="nsr" maxlength="40" placeholder="Ej: Combo gratis">
      <span class="flabel">Sellos para ganarlo</span><div class="chips" id="nsneed">${[6, 8, 10, 12].map((n) => `<button type="button" class="chip${n === 10 ? ' on' : ''}" data-act="pick" data-v="${n}">${n} sellos</button>`).join('')}</div>
      <span class="flabel">Plan</span><div class="chips" id="nsplan"><button type="button" class="chip on" data-act="pick" data-v="mensual">Plan Fiel · €${cfg.price_eur}/mes</button><button type="button" class="chip" data-act="pick" data-v="kit">Plan + Kit · €${cfg.kit_eur} (incluye 1er mes)</button></div>
      ${cfg.bcv_rate > 0 ? `<p class="small">Pagas en bolívares por Pago Móvil a la tasa oficial del BCV del día. Hoy: ${bsLine(cfg, cfg.price_eur)}.</p>` : ''}
      <label class="check"><input type="checkbox" id="nslg"> <span>Acepto los <button type="button" class="linkbtn" style="padding:0" data-act="legal">Términos para tiendas</button>.</span></label>
      <p class="err" id="nserr" role="alert"></p><button class="primary" type="submit" id="nsbtn">Crear mi tienda</button>
    </form>`;
});
async function submitNewStore() {
  const name = $('#nsn').value.trim(), type = $('#nst').value.trim(), zone = $('#nsz').value.trim(), phone = readTel('nsp'), ig = $('#nsi').value.trim().replace(/^@/, ''), reward = $('#nsr').value.trim() || 'Un producto gratis';
  const needed = +$('#nsneed .chip.on').dataset.v, plan = $('#nsplan .chip.on').dataset.v, er = $('#nserr');
  er.textContent = '';
  if (name.length < 2) return (er.textContent = 'Escribe el nombre de tu negocio.');
  if (!type) return (er.textContent = 'Cuéntanos qué vendes.');
  if (!/^04(12|14|16|22|24|26)[0-9]{7}$/.test(phone)) return (er.textContent = 'Revisa el WhatsApp del negocio.');
  if (!$('#nslg').checked) return (er.textContent = 'Acepta los Términos para tiendas.');
  const clash = await db.get('stores', `name=ilike.${encodeURIComponent(name)}&verify_status=eq.verificada&select=id`).catch(() => []);
  if (clash.length) return (er.innerHTML = `Ya existe una tienda verificada con ese nombre. Si es tuya, <a href="${waLink(C.support, 'Hola, quiero registrar mi tienda ' + name + ' pero el nombre ya existe en Fiel.')}" target="_blank" rel="noopener">escríbenos</a>.`);
  const b = $('#nsbtn'); b.disabled = true; b.textContent = 'Creando…';
  let slug = slugify(name);
  const taken = await db.get('stores', `slug=like.${slug}*&select=slug`).catch(() => []);
  if (taken.some((t) => t.slug === slug)) { let i = 2; while (taken.some((t) => t.slug === `${slug}-${i}`)) i++; slug = `${slug}-${i}`; }
  try {
    const st = await db.insert('stores', { owner_id: uid(), name, slug, business_type: type, zone, phone, instagram: ig || null, plan, reward, needed, design: { ...DEF_LOOK, finish: 'anodizado', accent: '#2b6cb0', a2: '#9fe7ff', personality: 'minimalista' } });
    toast(`¡${name} está lista!`);
    location.hash = `#/tienda/${st.id}/tienda`;
  } catch (e) { er.textContent = e.message; b.disabled = false; b.textContent = 'Crear mi tienda'; }
}

/* ---------- Panel de la tienda ---------- */
const storeCache = {};
async function loadStore(id, force) {
  if (!force && storeCache[id]) return storeCache[id];
  const [st, team] = await Promise.all([db.get('stores', `id=eq.${id}&select=*`, { single: true }), db.rpc('store_team', { p_store: id })]);
  const meRow = team.find((t) => t.user_id === uid());
  const isOwner = st.owner_id === uid();
  const can = { stamp: isOwner || meRow?.can_stamp, redeem: isOwner || meRow?.can_redeem, clients: isOwner || meRow?.can_view_clients, design: isOwner || meRow?.can_design, owner: isOwner };
  return (storeCache[id] = { st, team, me: meRow, can });
}
function storeNav(id, tab, can) {
  const items = [];
  if (can.stamp) items.push([`#/tienda/${id}/sellar`, 'Sellar', 'stamp']);
  if (can.redeem) items.push([`#/tienda/${id}/canjear`, 'Canjear', 'gift']);
  if (can.clients) items.push([`#/tienda/${id}/clientes`, 'Clientes', 'users']);
  if (can.design || can.owner) items.push([`#/tienda/${id}/tienda`, 'Mi tienda', 'store']);
  items.push(['#/cartera', 'Cartera', 'wallet']);
  setNav(items, `#/tienda/${id}/${tab}`);
}
const storeHead = (st, sub) => `<div class="top"><div class="av">${(() => { const L = look(st), src = L.iso || L.wordm; return src ? `<img src="${esc(src)}" alt="">` : initials(st.name); })()}</div><div class="rt"><small class="eyebrow">${sub}</small><b style="font-size:19px">${esc(st.name)}${st.verify_status === 'verificada' ? ' <span class="tag ok">Verificada</span>' : ''}</b></div></div>`;
function planBanner(st) {
  if (st.status === 'vencida' || st.status === 'suspendida') return `<div class="notice warn">${ic('lock', 16)}<span>Tu plan está ${st.status}. Tus clientes conservan sus sellos, pero no puedes sellar hasta renovar en Mi tienda › Plan.</span></div>`;
  if (st.status === 'prueba') { const d = Math.max(0, Math.ceil((new Date(st.trial_ends_at) - Date.now()) / 864e5)); return `<div class="notice info">${ic('info', 16)}<span>Prueba gratis: te quedan <b>${d} día${d === 1 ? '' : 's'}</b>.</span></div>`; }
  return '';
}

let S = { qty: 1, channel: 'tienda', extra: [] };
on(/^\/tienda\/([0-9a-f-]{36})\/sellar$/, async (id) => {
  if (needAuth()) return; loading();
  const { st, can, me: m } = await loadStore(id, true);
  storeNav(id, 'sellar', can);
  if (!can.stamp) { app.innerHTML = `<div class="empty"><p>No tienes permiso para sellar en esta tienda.</p></div>`; return; }
  const r = st.rules || {}, split = r.split || 'una', q = getQueue().filter((x) => x.store === id).length;
  const u = await loadMe();
  app.innerHTML = `${storeHead(st, 'Sellar en')}${planBanner(st)}
    ${navigator.onLine ? `<div class="onbar"><i></i>En línea${q ? ` · ${q} pendiente${q > 1 ? 's' : ''} por enviar` : ''}</div>` : `<div class="offbar"><i></i>Sin señal: puedes seguir sellando. Se envía solo al volver la conexión.</div>`}
    <form class="glass pad form" id="sf" novalidate>
      <p class="small">Sellando como <b style="color:var(--fg)">${esc(u.full_name)}</b>${m ? ` · ${m.role === 'dueno' ? 'Dueño' : m.role}` : ''}</p>
      <div class="seg">${[['tienda', 'En tienda'], ['online', 'En línea']].map(([v, l]) => `<button type="button" class="${S.channel === v ? 'on' : ''}" data-act="channel" data-v="${v}">${l}</button>`).join('')}</div>
      <label class="flabel" for="sc">Cédula del cliente</label>${cedField('sc')}
      ${split === 'una' ? `<p class="small">${ic('users', 14)} Cuenta compartida: 1 sello por compra.</p>` : `<div id="extras">${S.extra.map((x, i) => `<span class="flabel">Persona ${i + 2} de la cuenta</span><div class="extra">${cedField('ex' + i, x.ced)}<button type="button" class="iconbtn sm" data-act="exdel" data-i="${i}" aria-label="Quitar">✕</button></div>${split === 'minimo' ? `<label class="check"><input type="checkbox" class="exok" data-i="${i}"${x.ok ? ' checked' : ''}> Consumió desde $${r.splitMin || 10}</label>` : ''}`).join('')}
        ${S.extra.length + 1 < (r.splitMax || 6) ? `<button type="button" class="ghost inline" style="margin-top:8px" data-act="exadd">${ic('plus', 16)} Otra persona en esta cuenta</button>` : ''}</div>`}
      ${r.ref ? `<label class="flabel" for="sref">Referencia de la venta (opcional)</label><input class="inp" id="sref" placeholder="Factura, pedido o nota">` : ''}
      <span class="flabel">Sellos por esta compra</span>
      <div class="qty">${[1, 2, 3].map((n) => `<button type="button" class="chip${S.qty === n ? ' on' : ''}" data-act="qty" data-n="${n}">${n} sello${n > 1 ? 's' : ''}</button>`).join('')}</div>
      <p class="err" id="serr" role="alert"></p>
      <button class="primary" type="submit" id="sbtn">${ic('stamp')} Sellar</button>
    </form>
    <p class="hint">¿Cliente nuevo? Que escanee el QR de tu tienda (Mi tienda › QR) y se registre en un minuto.</p>`;
});
function syncExtra() { S.extra.forEach((x, i) => { const v = readCed('ex' + i); if (v) x.ced = v; const c = document.querySelector(`.exok[data-i="${i}"]`); if (c) x.ok = c.checked; }); }
const MSG = {
  first: (n, st, s) => `¡Hola ${n}! 🎉 Ya tienes tu tarjeta de ${st.name} en Fiel. Llevas ${s} de ${st.needed} sellos para: ${st.reward}.`,
  sello: (n, st, s) => `¡Gracias por venir, ${n}! Sumaste un sello en ${st.name}. Vas ${s} de ${st.needed}.`,
  casi: (n, st) => `¡${n}, te falta solo 1 sello para tu ${st.reward.toLowerCase()} en ${st.name}! Te esperamos 🙌`,
  premio: (n, st, s, code) => `¡Lo lograste, ${n}! 🎁 Tu ${st.reward.toLowerCase()} te espera en ${st.name}. Tu código es ${code}. Vence en 30 días.`,
};
async function submitStamp(id) {
  const { st } = await loadStore(id); const er = $('#serr'); er.textContent = '';
  const ced = readCed('sc'); if (!/^[VE][0-9]{6,9}$/.test(ced)) { er.textContent = 'Escribe la cédula del cliente.'; $('#sc').focus(); return; }
  const split = st.rules?.split || 'una'; syncExtra();
  const skipped = []; let ceds = [ced];
  if (split !== 'una') S.extra.forEach((x) => { if (!x.ced) return; if (split === 'minimo' && !x.ok) skipped.push(x.ced); else ceds.push(x.ced); });
  ceds = [...new Set(ceds)];
  const ref = $('#sref')?.value?.trim() || null, b = $('#sbtn'); b.disabled = true;
  const args = { p_store: id, p_cedulas: ceds, p_qty: S.qty, p_channel: S.channel, p_ref: ref };
  try {
    const res = await db.rpc('stamp_customers', args);
    S.extra = []; b.disabled = false; $('#sc').value = '';
    showStampResult(st, res, skipped);
  } catch (e) {
    b.disabled = false;
    if (e instanceof NetErr) {
      const q = getQueue(); q.push({ store: id, cedulas: ceds, qty: S.qty, channel: S.channel, ref, at: new Date().toISOString() }); setQueue(q); S.extra = []; $('#sc').value = '';
      openSheet(`<div class="bigicon warn">${ic('stamp', 26)}</div><h2>Sello <em>guardado</em></h2><p>No hay señal. Quedó guardado en este teléfono y se envía solo cuando vuelva la conexión.</p><div class="btns"><button class="primary" data-close>Seguir sellando</button></div>`);
    } else if (/máximo|permiso|plan/i.test(e.message)) blockedSheet('No se pudo sellar', esc(e.message));
    else er.textContent = e.message;
  }
}
function showStampResult(st, res, skipped) {
  const rows = res.stamped || [], miss = res.missing || [];
  if (!rows.length) {
    openSheet(`<div class="bigicon">${ic('user', 26)}</div><h2>Cliente <em>nuevo</em></h2><p>${miss.map(fmtCed).join(', ')} todavía no tiene cuenta en Fiel.</p><p class="small">Pídele que escanee el QR de tu tienda o que entre a Fiel y se registre con su cédula. Luego lo sellas.</p><div class="btns"><a class="primary wa" href="${waLink(C.support, '')}" style="display:none"></a><button class="primary" data-act="showqr" data-id="${st.id}">Mostrar mi QR</button><button class="ghost" data-close>Cerrar</button></div>`);
    return;
  }
  const item = (x) => {
    const n = first(x.name), kind = x.reward_code ? 'premio' : x.first ? 'first' : x.stamps === x.needed - 1 ? 'casi' : 'sello';
    const msg = MSG[kind](n, st, x.stamps, x.reward_code);
    return `<div class="row"><div class="av">${initials(x.name)}</div><div class="rt"><b>${esc(x.name)}${x.reward_code ? '<span class="tag gold">Premio</span>' : ''}</b><small>${x.reward_code ? 'Código ' + x.reward_code : `${x.stamps} de ${x.needed} sellos`}</small></div>${st.rules?.waAfter !== false ? `<a class="iconbtn sm wa" href="${waLink(x.phone, msg)}" target="_blank" rel="noopener" aria-label="Avisar por WhatsApp">${ic('msg', 16)}</a>` : ''}</div>`;
  };
  openSheet(`<div class="bigicon ok">${ic('check', 28)}</div><h2>${rows.some((x) => x.reward_code) ? 'Tarjeta <em>completa</em>' : '<em>Sellado</em>'}</h2>
    <div class="list" style="text-align:left;margin-top:12px">${rows.map(item).join('')}</div>
    ${skipped.length ? `<p class="small" style="text-align:left;margin-top:10px">Sin sello por no llegar al monto: ${skipped.map(fmtCed).join(', ')}</p>` : ''}
    ${miss.length ? `<p class="small" style="text-align:left;margin-top:6px">Sin cuenta en Fiel todavía: ${miss.map(fmtCed).join(', ')}</p>` : ''}
    <div class="btns"><button class="primary" data-close>Seguir sellando</button></div>`);
}

on(/^\/tienda\/([0-9a-f-]{36})\/canjear$/, async (id) => {
  if (needAuth()) return; loading();
  const { st, can } = await loadStore(id);
  storeNav(id, 'canjear', can);
  if (!can.redeem) { app.innerHTML = `<div class="empty"><p>No tienes permiso para entregar premios.</p></div>`; return; }
  const pend = await db.get('rewards', `store_id=eq.${id}&status=eq.pendiente&select=code,reward,created_at,profiles!rewards_user_id_fkey(full_name)&order=created_at.desc&limit=30`).catch(() => []);
  app.innerHTML = `${storeHead(st, 'Canjear premios en')}
    <form class="glass pad form" id="cf" novalidate><label class="flabel" for="code">Código del cliente</label>
      <input class="inp" id="code" autocomplete="off" placeholder="FIEL-8KQ2" maxlength="9" style="text-transform:uppercase;font-size:22px;letter-spacing:.1em;font-family:ui-monospace,Menlo,monospace">
      <p class="err" id="cerr" role="alert"></p><button class="primary" type="submit">${ic('check')} Validar código</button></form>
    <div class="section"><span class="eyebrow">Por entregar · ${pend.length}</span><div class="list">${pend.map((p) => `<button class="row" data-act="fillcode" data-code="${p.code}"><div class="av">${initials(p.profiles?.full_name)}</div><div class="rt"><b>${esc(p.profiles?.full_name || 'Cliente')}</b><small>${p.code} · ${fmtDate(p.created_at)}</small></div>${ic('gift')}</button>`).join('') || '<p class="empty">No hay premios pendientes.</p>'}</div></div>`;
});
async function submitCode(id) {
  const raw = $('#code').value.toUpperCase().replace(/\s/g, ''); const code = raw.startsWith('FIEL-') ? raw : 'FIEL-' + raw.replace(/^FIEL/, '');
  const er = $('#cerr'); er.textContent = '';
  if (code.length < 9) { er.textContent = 'Escribe el código completo.'; return; }
  try {
    const r = await db.rpc('check_reward', { p_store: id, p_code: code });
    if (!r.found) { er.textContent = 'Código no encontrado en tu tienda. Revisa que esté bien escrito.'; return; }
    if (r.status === 'entregado') return blockedSheet('Este premio ya se entregó', `${r.code} se entregó a ${esc(r.customer)} el ${fmtTime(r.delivered_at)}${r.delivered_by ? ' por ' + esc(r.delivered_by) : ''}. No se puede usar dos veces.`);
    if (r.status === 'vencido') return blockedSheet('Este premio venció', `${r.code} venció el ${fmtDate(r.expires_at)}.`);
    openSheet(`<div class="bigicon gold">${ic('gift', 26)}</div><h2>Código <em>válido</em></h2><p>Entrega el premio y márcalo para que no se pueda volver a usar.</p>
      <div class="terms" style="text-align:left"><b>${esc(r.reward)}</b>${esc(r.customer)} · ${fmtCed(r.cedula)}<br>${r.code} · ganado el ${fmtDate(r.created_at)}</div>
      ${termsHTML(r.terms, 'Revisa las condiciones antes de entregar')}
      <div class="btns"><button class="primary" data-act="deliver" data-code="${r.code}" data-id="${id}">Marcar como entregado</button><button class="ghost" data-close>Cancelar</button></div>`);
  } catch (e) { er.textContent = e instanceof NetErr ? 'Canjear necesita señal, así un premio no se usa dos veces.' : e.message; }
}

on(/^\/tienda\/([0-9a-f-]{36})\/clientes$/, async (id) => {
  if (needAuth()) return; loading();
  const { st, can } = await loadStore(id);
  storeNav(id, 'clientes', can);
  const rows = await db.get('cards', `store_id=eq.${id}&select=stamps,last_visit_at,profiles(full_name,cedula,phone)&order=last_visit_at.desc.nullslast&limit=500`);
  const days = (d) => (d ? Math.floor((Date.now() - new Date(d)) / 864e5) : null);
  app.innerHTML = `${storeHead(st, 'Clientes de')}
    <div class="kpis"><div class="kpi"><small>Clientes</small><b>${rows.length}</b></div><div class="kpi"><small>Casi listos</small><b>${rows.filter((r) => r.stamps >= st.needed - 1).length}</b></div><div class="kpi"><small>+30 días</small><b>${rows.filter((r) => days(r.last_visit_at) >= 30).length}</b></div></div>
    <input class="inp" id="cq" placeholder="Buscar por nombre, cédula o teléfono" style="margin-bottom:12px">
    <div class="list" id="clist">${rows.map((r) => { const p = r.profiles || {}, d = days(r.last_visit_at), late = d >= 30, msg = late ? `¡Hola ${first(p.full_name)}! Te extrañamos en ${st.name}. Llevas ${r.stamps} de ${st.needed} sellos para tu ${st.reward.toLowerCase()} 😉` : `¡Hola ${first(p.full_name)}! Te escribimos de ${st.name}. Llevas ${r.stamps} de ${st.needed} sellos.`;
      return `<div class="row" data-s="${esc((p.full_name + ' ' + p.cedula + ' ' + p.phone).toLowerCase())}"><div class="av">${initials(p.full_name)}</div><div class="rt"><b>${esc(p.full_name)}${late ? `<span class="tag warn">${d} días</span>` : ''}</b><small>${fmtCed(p.cedula)} · ${r.stamps}/${st.needed} · ${d === null ? 'Sin visitas' : d === 0 ? 'Hoy' : `Hace ${d} días`}</small></div><a class="iconbtn sm wa" href="${waLink(p.phone, msg)}" target="_blank" rel="noopener" aria-label="WhatsApp">${ic('msg', 16)}</a></div>`; }).join('') || '<p class="empty">Todavía no tienes clientes. Comparte tu QR.</p>'}</div>`;
  $('#cq').addEventListener('input', (e) => { const q = e.target.value.toLowerCase().replace(/[.\-\s]/g, ''); document.querySelectorAll('#clist .row').forEach((r) => (r.style.display = !q || r.dataset.s.replace(/[.\-\s]/g, '').includes(q) ? '' : 'none')); });
});

let MT = 'tarjeta';
on(/^\/tienda\/([0-9a-f-]{36})\/tienda$/, async (id) => {
  if (needAuth()) return; loading();
  const { st, can, team } = await loadStore(id, true);
  storeNav(id, 'tienda', can);
  const tabs = [['tarjeta', 'Tarjeta'], ['qr', 'QR'], ...(can.owner ? [['equipo', 'Equipo'], ['reglas', 'Reglas'], ['plan', 'Plan'], ['verificar', 'Verificar']] : [])];
  if (!tabs.some((t) => t[0] === MT)) MT = 'tarjeta';
  let body = '';
  const d = st.design || {};
  if (MT === 'tarjeta') body = dzOpen(st);
  else if (MT === 'qr') body = `<div class="glass pad" style="text-align:center"><b style="font-size:18px">${esc(st.name)}</b><p class="small">Escanea y suma sellos</p><div class="qrbox" id="qrb"></div><p class="small" style="word-break:break-all">${esc(storeURL(st.slug))}</p></div>
    <div class="btns" style="display:flex;flex-direction:column;gap:10px;margin-top:14px"><button class="ghost" data-act="copy" data-v="${esc(storeURL(st.slug))}">Copiar enlace</button><a class="ghost" href="${waLink('', '')}" style="display:none"></a>
    <a class="ghost" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(`Suma sellos en ${st.name} con Fiel y gana: ${st.reward}. Agrega tu tarjeta aquí: ${storeURL(st.slug)}`)}">${ic('msg', 16)} Compartir por WhatsApp</a></div>
    <p class="hint">Imprímelo para la caja o compártelo en tu Instagram.</p>`;
  else if (MT === 'equipo') body = `<p class="lead">Dale acceso a tu equipo. Cada persona entra con su propia cuenta de Fiel y solo ve lo que le permites.</p>
    <div class="list">${team.map((t) => `<div class="row"><div class="av">${initials(t.full_name)}</div><div class="rt"><b>${esc(t.full_name)}<span class="tag${t.role === 'dueno' ? ' ok' : ''}">${{ dueno: 'Dueño', encargado: 'Encargado', cajero: 'Cajero', mesonero: 'Mesonero' }[t.role] || t.role}</span>${t.active ? '' : '<span class="tag bad">Sin acceso</span>'}</b><small>${fmtPhone(t.phone)} · ${t.today} sellos hoy</small></div>${t.role !== 'dueno' && t.active ? `<button class="iconbtn sm" data-act="rmmember" data-u="${t.user_id}" aria-label="Quitar acceso">✕</button>` : ''}</div>`).join('')}</div>
    <form class="glass pad form" id="mf" style="margin-top:16px" novalidate><b>Dar acceso a alguien</b><p class="small">Esa persona debe tener cuenta en Fiel (se registra gratis como cliente).</p>
      <label class="flabel" for="mc">Su cédula</label>${cedField('mc')}
      <span class="flabel">Rol</span><div class="chips" id="mrole">${[['mesonero', 'Mesonero · solo sella'], ['cajero', 'Cajero · sella y entrega premios'], ['encargado', 'Encargado · además ve clientes']].map(([v, l], i) => `<button type="button" class="chip${i === 1 ? ' on' : ''}" data-act="pick" data-v="${v}">${l}</button>`).join('')}</div>
      <p class="err" id="merr"></p><button class="primary" type="submit">Dar acceso</button></form>`;
  else if (MT === 'reglas') { const r = st.rules || {}; body = `<form class="form" id="rlf" novalidate>
      <div class="glass pad form"><b>Máximo de sellos por persona del equipo al día</b><p class="small">Evita sellos de más. Desmarca para no tener límite.</p>
        <div class="pair"><input class="inp" id="rlim" inputmode="numeric" value="${r.limit ?? 40}"><label class="check" style="flex:none;align-items:center"><input type="checkbox" id="rlon"${r.limitOn !== false ? ' checked' : ''}> Con límite</label></div></div>
      <div class="glass pad form" style="margin-top:12px"><b>Cuentas compartidas</b><p class="small">Qué pasa cuando varias personas pagan juntas.</p>
        <div class="chips" id="rsplit">${[['una', '1 sello por compra'], ['persona', '1 sello por persona'], ['minimo', '1 por persona desde un monto']].map(([v, l]) => `<button type="button" class="chip${(r.split || 'una') === v ? ' on' : ''}" data-act="pick" data-v="${v}">${l}</button>`).join('')}</div>
        <div class="pair" style="margin-top:8px"><label class="flabel" style="flex:1;align-self:center">Monto mínimo ($)</label><input class="inp" id="rmin" inputmode="numeric" value="${r.splitMin ?? 10}" style="max-width:110px"></div>
        <div class="pair"><label class="flabel" style="flex:1;align-self:center">Máximo de personas por cuenta</label><input class="inp" id="rmax" inputmode="numeric" value="${r.splitMax ?? 6}" style="max-width:110px"></div></div>
      <div class="glass pad" style="margin-top:12px"><label class="check"><input type="checkbox" id="rwa"${r.waAfter !== false ? ' checked' : ''}> Botón de WhatsApp después de sellar</label><label class="check"><input type="checkbox" id="rref"${r.ref ? ' checked' : ''}> Pedir referencia de la venta al sellar</label></div>
      <p class="err" id="rlerr"></p><button class="primary" type="submit">Guardar reglas</button></form>`; }
  else if (MT === 'plan') {
    const cfg = await getConfig(); const pays = await db.get('payments', `store_id=eq.${id}&select=*&order=created_at.desc&limit=10`).catch(() => []);
    const eur = st.plan === 'kit' && !pays.some((p) => p.status === 'validado') ? cfg.kit_eur : cfg.price_eur; const bs = cfg.bcv_rate > 0 ? fmtBs(eur * cfg.bcv_rate) : null;
    const rev = pays.find((p) => p.status === 'pendiente');
    body = `<div class="glass pad"><span class="eyebrow">Tu plan</span><h2>${st.plan === 'kit' ? 'Plan Fiel + Kit' : 'Plan Fiel'}</h2><p>Estado: <b style="color:var(--fg)">${{ prueba: 'Prueba gratis', activa: 'Activa', porvencer: 'Por vencer', vencida: 'Vencida', suspendida: 'Suspendida' }[st.status]}</b>${st.paid_until ? ` · hasta el ${fmtDate(st.paid_until)}` : st.status === 'prueba' ? ` · termina el ${fmtDate(st.trial_ends_at)}` : ''}</p>
      <p style="margin-top:8px">Monto a pagar: <b style="color:var(--fg)">€${eur}</b>${bs ? ` · <b style="color:var(--fg)">Bs ${bs}</b>` : ''}</p>${bs ? `<p class="small" style="margin-top:4px">Tasa oficial BCV del ${bcvDay(cfg)}: Bs ${fmtBs(cfg.bcv_rate)} por €. Se actualiza sola cada día.</p>` : ''}</div>
      ${rev ? `<div class="notice info">${ic('info', 16)}<span>Tu pago con referencia ${esc(rev.reference)} está en revisión. Te avisamos al confirmarlo.</span></div>` : `<form class="glass pad form" id="pyf" style="margin-top:12px" novalidate><b>Reportar Pago Móvil</b><p class="small">Pide los datos de Pago Móvil por WhatsApp a soporte y reporta aquí tu pago.</p>
      <a class="ghost inline" style="align-self:flex-start" target="_blank" rel="noopener" href="${waLink(cfg.support_phone || C.support, `Hola, quiero pagar el plan de ${st.name} en Fiel. ¿Me pasas los datos de Pago Móvil?`)}">${ic('msg', 16)} Pedir datos de pago</a>
      <label class="flabel" for="pyb">Banco desde el que pagaste</label><input class="inp" id="pyb" maxlength="40" placeholder="Ej: Banesco">
      <label class="flabel" for="pyr">Número de referencia</label><input class="inp" id="pyr" inputmode="numeric" maxlength="20" placeholder="Ej: 004512">
      <p class="err" id="pyerr"></p><button class="primary" type="submit">Reportar pago</button></form>`}
      <div class="section"><span class="eyebrow">Historial</span><div class="list">${pays.map((p) => `<div class="row"><div class="rt"><b>Ref ${esc(p.reference)}<span class="tag ${p.status === 'validado' ? 'ok' : p.status === 'rechazado' ? 'bad' : ''}">${p.status}</span></b><small>${fmtDate(p.created_at)} · €${p.amount_eur}</small></div></div>`).join('') || '<p class="empty">Sin pagos todavía.</p>'}</div></div>`;
  } else if (MT === 'verificar') {
    const v = st.verify_status;
    body = v === 'verificada' ? `<div class="notice ok">${ic('check', 16)}<span>Tu tienda está verificada. Tus clientes ven la insignia.</span></div>`
      : v === 'pendiente' ? `<div class="notice info">${ic('info', 16)}<span>Tu verificación está en revisión. Envíanos tu código <b>${esc(st.verify_code)}</b> por WhatsApp desde el número del negocio si aún no lo hiciste.</span></div><a class="primary wa" target="_blank" rel="noopener" href="${waLink(C.support, `Hola Fiel, soy de ${st.name}. Mi código de verificación es ${st.verify_code}.`)}">${ic('msg', 18)} Enviar código por WhatsApp</a>`
      : `${v === 'rechazada' ? `<div class="notice warn">${ic('info', 16)}<span>La verificación anterior fue rechazada${st.verify_note ? ': ' + esc(st.verify_note) : ''}. Inténtalo de nuevo.</span></div>` : ''}
        <p class="lead">Verifica tu tienda para que tus clientes vean la insignia <span class="tag ok">Verificada</span>. Con una sola forma basta:</p>
        <div class="glass pad"><b>Por WhatsApp (la más rápida)</b><p class="small">Envía un código al WhatsApp de Fiel desde el número de tu negocio (${fmtPhone(st.phone)}).</p><button class="primary wa" data-act="verify" data-m="whatsapp" data-id="${id}">${ic('msg', 18)} Generar código y enviarlo</button></div>
        <div class="glass pad" style="margin-top:12px"><b>Por Instagram</b><p class="small">Envía el código por mensaje directo a @${C.instagram} desde el Instagram de tu negocio.</p><button class="ghost" data-act="verify" data-m="instagram" data-id="${id}">Generar código para Instagram</button></div>`;
  }
  app.innerHTML = `${storeHead(st, 'Mi tienda')}${planBanner(st)}<div class="chips" style="margin:6px 0 16px">${tabs.map(([k, l]) => `<button class="chip${MT === k ? ' on' : ''}" data-act="mt" data-v="${k}" data-id="${id}">${l}</button>`).join('')}</div>${body}`;
  if (MT === 'qr') qrInto($('#qrb'), storeURL(st.slug));
});
/* ---------- Editor de diseño (igual que la demo) ---------- */
let DZ = null; // { id, s, dirty, font }
const dzStamps = () => Math.min(3, DZ.s.needed - 1);
const DZ_BACK = [
  { name: 'Molienda Café', type: 'Cafetería', finish: 'papel', accent: '#7a4a2a', a2: '#c89f7a', font: 'fraunces', logoMode: 'circulo', reward: 'Un café gratis', needed: 8 },
  { name: 'Kaiser Barber', type: 'Barbería', finish: 'carbono', accent: '#c9a14a', a2: '#f3e2b3', font: 'bebas', logoMode: 'circulo', reward: 'Corte gratis', needed: 6 },
];
function dzOpen(st) {
  if (!DZ || DZ.id !== st.id || !DZ.dirty) DZ = { id: st.id, s: look(st), dirty: false, font: null };
  return `<div class="dz" id="dz">${dzHTML()}</div><div class="dzsave${DZ.dirty ? ' show' : ''}" id="dzsave"><span>Tienes cambios sin guardar</span><button class="ghost" data-act="dz" data-op="discard">Descartar</button><button class="primary" data-act="dz" data-op="save" id="dzbtn">Guardar</button></div>`;
}
function dzHTML() {
  const t = DZ.s, recs = K.recsFor(t), ideas = K.kindOf(t.type)[2], P_ = K.PERS[t.personality] || K.PERS.minimalista;
  const chips = (k, list) => `<div class="chips" data-k="${k}">${list.map(([v, l]) => `<button type="button" class="chip${t[k] === v ? ' on' : ''}" data-act="dz" data-op="opt" data-v="${v}">${l}</button>`).join('')}</div>`;
  return `<div class="pv"><div class="pv-host" id="pvh"><div id="pv">${K.cardHTML(t, dzStamps())}</div></div>
    <div class="pv-actions"><button type="button" class="ghost inline" data-act="dz" data-op="test">${ic('stamp', 15)} Probar animación</button><small>Así la ve tu cliente</small></div></div>
  <div class="sec"><span class="eyebrow">01 · Tu marca</span><h3>Cuéntanos <em>quién eres</em></h3>
    <label class="flabel" for="dzn">Nombre del negocio</label><input class="inp" id="dzn" value="${esc(t.name)}" maxlength="24">
    <label class="flabel" for="dzt">¿Qué tipo de negocio es?</label><input class="inp" id="dzt" value="${esc(t.type)}" maxlength="32" placeholder="Restaurante, barbería, tienda de ropa…">
    <span class="flabel">Personalidad de tu marca</span>
    <div class="chips">${Object.entries(K.PERS).map(([k, p]) => `<button type="button" class="chip${t.personality === k ? ' on' : ''}" data-act="dz" data-op="pers" data-v="${k}">${p.label}</button>`).join('')}</div></div>
  <div class="sec"><span class="eyebrow">02 · Tu logo</span><h3>Sube tu logo, <em>lo dejamos listo</em></h3>
    <p>Si tienes isotipo (el símbolo) y logotipo (el nombre), sube los dos.</p>
    <div class="pnghint">${ic('info', 16)}<span><b>Para el mejor resultado, súbelo en PNG con fondo transparente.</b> Así se ve exacto, sin perder letras ni detalles. Si solo lo tienes en JPG o con fondo blanco, se lo quitamos y puedes volver al original si algo no se ve bien.</span></div>
    <div class="slots2">${['iso', 'wordm'].map((k) => { const v = t[k], m = t['m_' + k]; return `<label class="lslot" for="up-${k}"><div class="ph${v ? ' has' : ''}">${v ? `<img src="${esc(v)}" alt="">` : ic('upload', 22)}</div>
      <b>${k === 'iso' ? 'Isotipo' : 'Logotipo'}</b><small>${k === 'iso' ? 'El símbolo solo' : 'El nombre o el logo completo'}</small>
      ${m && v ? `<div class="ok">${m.hadAlpha ? '<span class="tag ok">PNG transparente</span>' : m.removed ? (t['bg_' + k] ? '<span class="tag">Con fondo original</span>' : '<span class="tag ok">Fondo quitado</span>') : '<span class="tag ok">Listo</span>'}</div>${m.removed && m.raw ? `<button type="button" class="linkbtn bgt" data-act="dz" data-op="bgtoggle" data-k="${k}">${t['bg_' + k] ? 'Quitar el fondo' : '¿Se cortó algo? Usar con su fondo'}</button>` : ''}${v ? `<button type="button" class="linkbtn bgt" data-act="dz" data-op="rmlogo" data-k="${k}">Quitar</button>` : ''}` : ''}
      <input type="file" id="up-${k}" accept="image/png,image/jpeg,image/webp" hidden></label>`; }).join('')}</div>
    ${t.lowContrast ? `<p class="pnghint" style="margin:4px 0 0">${ic('info', 16)}<span>Tu logo y el fondo de la tarjeta tienen colores parecidos, así que lo pusimos en <b>Monocromo</b> para que se lea. Si prefieres sus colores originales, elige un estilo de tarjeta más ${K.inkFor(t) === '#ffffff' ? 'claro' : 'oscuro'}.</span></p>` : ''}
    <span class="flabel">Cómo se ve el logo</span>${chips('logoColor', K.LOGOCOLORS)}
    <span class="flabel">Dónde va el logo</span>${chips('logoMode', K.LOGOMODES)}</div>
  <div class="sec"><span class="eyebrow">03 · Recomendado para ti</span><h3>Diseños hechos <em>para tu marca</em></h3>
    <p>${t.palette ? 'Usamos los colores de tu logo' : 'Usamos tus colores actuales'} y la personalidad ${P_.label.toLowerCase()}, que ${P_.why}.</p>
    <div class="recs">${recs.map((r, i) => `<div class="glass rec">${K.cardHTML({ ...t, ...r }, dzStamps())}
      <div class="rec-h"><div><b>${r.n}</b><small>${K.FL[r.finish]} · tipografía ${K.FONTMAP[r.font].label.toLowerCase()}</small></div><button type="button" class="ghost inline sm" data-act="dz" data-op="userec" data-i="${i}">Usar este</button></div></div>`).join('')}</div></div>
  <div class="sec"><span class="eyebrow">04 · Ajustes finos</span><h3>Hazla <em>tuya</em></h3>
    <span class="flabel">Estilo de la tarjeta</span>
    <div data-k="finish">${K.FGROUPS.map(([g, ids]) => `<div class="fgroup"><span class="fglabel">${g}</span><div class="thumbs">${ids.map((v) => `<button type="button" class="thumb-btn${t.finish === v ? ' on' : ''}" data-act="dz" data-op="opt" data-v="${v}"><div class="card f-${v}" style="--a:${t.accent};--a2:${t.a2}"><div class="card-glow"></div></div>${K.FL[v]}</button>`).join('')}</div></div>`).join('')}</div>
    ${t.palette ? `<span class="flabel">Colores de tu logo</span><div class="swatches">${t.palette.map((c) => `<button type="button" style="background:${c}" data-act="dz" data-op="color" data-c="${c}" aria-label="Usar ${c} como principal"></button>`).join('')}</div>` : ''}
    <span class="flabel">Color principal</span><div class="swatches" data-c="accent">${K.PRESETS.map((c) => `<button type="button" class="${t.accent === c ? 'on' : ''}" style="background:${c}" data-act="dz" data-op="color" data-c="${c}" aria-label="Color ${c}"></button>`).join('')}<input type="color" id="dzac" value="${t.accent}" aria-label="Otro color principal"></div>
    <span class="flabel">Color secundario</span><div class="swatches" data-c="a2">${K.PRESETS2.map((c) => `<button type="button" class="${t.a2 === c ? 'on' : ''}" style="background:${c}" data-act="dz" data-op="color2" data-c="${c}" aria-label="Color ${c}"></button>`).join('')}<input type="color" id="dzac2" value="${t.a2}" aria-label="Otro color secundario"></div>
    <span class="flabel">Tipografía</span>
    <div class="chips" data-k="font">${K.FONTS.map(([v, l, css]) => `<button type="button" class="chip${t.font === v ? ' on' : ''}" data-act="dz" data-op="opt" data-v="${v}"><span class="aa" style="font-family:${css.replace(/"/g, "'")}">Aa</span>${l}</button>`).join('')}${t.fontFam ? `<button type="button" class="chip${t.font === 'custom' ? ' on' : ''}" data-act="dz" data-op="opt" data-v="custom"><span class="aa" style="font-family:'${t.fontFam}'">Aa</span>Mi tipografía</button>` : ''}</div>
    <label class="ghost inline" for="upfont" style="align-self:flex-start;cursor:pointer">${ic('upload', 15)} Subir mi tipografía (.ttf, .otf, .woff)<input type="file" id="upfont" accept=".ttf,.otf,.woff,.woff2" hidden></label>
    <span class="flabel">Forma del sello</span>
    <div class="chips" data-k="shape">${K.SHAPES.map(([v, l]) => `<button type="button" class="chip${t.shape === v ? ' on' : ''}" data-act="dz" data-op="opt" data-v="${v}">${K.shapeSVG(t, v)}${l}</button>`).join('')}</div>
    <label class="flabel" for="dzneed">Sellos para ganar el premio: <b style="color:var(--fg)" id="dzneedv">${t.needed}</b></label><input type="range" id="dzneed" min="4" max="15" value="${t.needed}">
    <label class="flabel" for="dzr">Premio</label><input class="inp" id="dzr" value="${esc(t.reward)}" maxlength="40">
    <div class="chips">${ideas.map((i) => `<button type="button" class="chip" data-act="dz" data-op="idea" data-v="${esc(i)}">${ic('gift', 14)} ${esc(i)}</button>`).join('')}</div>
    <label class="flabel" for="dzc">Términos y condiciones del premio <span style="text-transform:none;letter-spacing:0;font-weight:400">(opcional · una por línea)</span></label>
    <div class="tcwrap"><textarea class="inp" id="dzc" maxlength="240" placeholder="Ej: Válido con compras desde $60&#10;No acumulable con otras promociones">${esc(t.terms || '')}</textarea><span class="tccount" id="dzcc">${(t.terms || '').length}/240</span></div>
    <div class="chips">${K.TCIDEAS.map((i) => `<button type="button" class="chip" data-act="dz" data-op="tcadd" data-v="${esc(i)}">${ic('plus', 13)} ${esc(i)}${i.endsWith('$') ? '…' : ''}</button>`).join('')}</div>
    <p class="small" style="margin:-2px 0 4px">El cliente las ve en su tarjeta, al ganar el premio, y el cajero al canjear el código.</p>
    <span class="flabel">Animación al sellar</span>${chips('anim', K.ANIMS)}</div>
  <div class="sec"><span class="eyebrow">05 · Resultado final</span><h3>Así se ve <em>tu marca</em></h3>
    <p>Con todo lo que configuraste, así queda tu marca en cada lugar de Fiel. Desliza para verlos.</p>
    <div class="uses" id="uses">${dzUses()}</div></div>`;
}
function dzUses() {
  const t = DZ.s, n = dzStamps();
  const wallet = `<div class="scene">${DZ_BACK.map((b, i) => `<div class="w" style="transform:translate(-50%,-50%) translateY(${-40 + i * 16}px) scale(${0.52 + i * 0.03});filter:brightness(${0.55 + i * 0.2})">${K.cardHTML(b, 3)}</div>`).join('')}<div class="w" style="transform:translate(-50%,-50%) translateY(16px) scale(.6)">${K.cardHTML(t, n)}</div></div>`;
  let cells = ''; for (let i = 0; i < 8; i++) cells += `<div class="cell${i < 5 ? ' on' : ''}" style="--ui:${K.uiColor(t)}">${i < 5 ? K.shapeSVG(t) : ''}</div>`;
  const chat = `<div class="scene"><div class="chat"><div class="chat-h">${K.miniLogo(t, 26)}<span>${esc(t.name)}</span></div><div class="chat-b"><div class="bubble">¡Hola Ana! Sumaste 1 sello en ${esc(t.name)}. Llevas ${n} de ${t.needed}. Te falta${t.needed - n > 1 ? 'n' : ''} ${t.needed - n} para: ${esc(t.reward)}.</div></div></div></div>`;
  const head = `<div class="scene" style="padding:14px;place-items:stretch;align-content:center"><div style="display:flex;gap:10px;align-items:center">${K.miniLogo(t, 40)}<div style="min-width:0"><small style="font-size:10px;color:var(--muted);letter-spacing:.12em;text-transform:uppercase">Panel de</small><b style="display:block;font-size:15px">${esc(t.name)}</b></div></div></div>`;
  return [['Tarjeta en la cartera', wallet], ['Sellos', `<div class="scene"><div class="cells">${cells}</div></div>`], ['Mensaje de WhatsApp', chat], ['Encabezado de tu panel', head]].map(([l, h]) => `<div class="use">${h}<small>${l}</small></div>`).join('');
}
function dzDirty() { if (!DZ) return; DZ.dirty = true; $('#dzsave')?.classList.add('show'); }
function dzPreview() {
  const t = DZ.s, pv = $('#pv'); if (!pv) return;
  pv.innerHTML = K.cardHTML(t, dzStamps());
  const us = $('#uses'); if (us) { const x = us.scrollLeft; us.innerHTML = dzUses(); us.scrollLeft = x; }
  document.querySelectorAll('.dz .thumb-btn .card').forEach((c) => { c.style.setProperty('--a', t.accent); c.style.setProperty('--a2', t.a2); });
  document.querySelectorAll('.dz [data-k="shape"] .chip').forEach((b) => { const v = b.dataset.v; b.innerHTML = K.shapeSVG(t, v) + (K.SHAPES.find((x) => x[0] === v) || [])[1]; });
}
function dzChips() {
  const t = DZ.s;
  document.querySelectorAll('.dz [data-k]').forEach((g) => { const k = g.dataset.k; g.querySelectorAll('[data-v]').forEach((b) => b.classList.toggle('on', t[k] === b.dataset.v)); });
  document.querySelectorAll('.dz [data-c="accent"] [data-c]').forEach((b) => b.classList.toggle('on', b.dataset.c === t.accent));
  document.querySelectorAll('.dz [data-c="a2"] [data-c]').forEach((b) => b.classList.toggle('on', b.dataset.c === t.a2));
  const a = $('#dzac'), b = $('#dzac2'); if (a) a.value = t.accent; if (b) b.value = t.a2;
}
function dzRedraw() { const el = $('#dz'); if (!el) return; const y = window.scrollY; el.innerHTML = dzHTML(); window.scrollTo(0, y); }
async function dzSetLogo(kind, src) {
  toast('Procesando tu logo…');
  const r = await K.processLogo(src); if (!r) { toast('No pudimos leer esa imagen. Prueba con otra.'); return; }
  const t = DZ.s;
  t[kind] = r.png; t[kind + 'M'] = r.mono; t['bg_' + kind] = false;
  t['m_' + kind] = { ratio: r.ratio, rawRatio: r.rawRatio, removed: r.removed, hadAlpha: r.hadAlpha, png: r.png, mono: r.mono, raw: r.raw };
  if (kind === 'iso' && r.ratio > 1.7 && !t.wordm) { t.wordm = r.png; t.wordmM = r.mono; t.m_wordm = t.m_iso; }
  if (r.palette.length) { t.palette = r.palette; t.accent = r.palette[0]; t.a2 = r.palette[1] || K.mix(t.accent, '#ffffff', 0.45); }
  const darkCard = K.inkFor(t) === '#ffffff' || K.lum(K.inkFor(t)) > 0.6;
  t.lowContrast = darkCard ? r.darkFrac > 0.12 : r.lightFrac > 0.3; t.logoColor = t.lowContrast ? 'ink' : 'original';
  await K.buildPattern(t); dzDirty(); dzRedraw();
  toast(t.lowContrast ? (darkCard ? 'Tu logo es oscuro: lo mostramos claro para que se lea en tu tarjeta' : 'Tu logo es claro: lo mostramos oscuro para que se lea en tu tarjeta') : r.hadAlpha ? 'Listo: tu PNG sin fondo quedó perfecto' : r.removed ? 'Listo: le quitamos el fondo. Revisa que se vea completo' : 'Listo: logo recortado');
}
async function dzUpload(id, data, name, type = 'image/png') {
  const blob = data instanceof Blob ? data : await (await fetch(data)).blob();
  const ext = type === 'image/png' ? 'png' : name.split('.').pop();
  const path = `${id}/${name.replace(/\.[^.]+$/, '')}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`;
  await api(`/storage/v1/object/logos/${path}`, { method: 'POST', body: blob, headers: { 'Content-Type': type, 'x-upsert': 'true' } });
  return `${C.supabaseUrl}/storage/v1/object/public/logos/${path}`;
}
async function dzSave() {
  const id = DZ.id, t = DZ.s, b = $('#dzbtn'); if (b) { b.disabled = true; b.textContent = 'Guardando…'; }
  try {
    const cache = new Map();
    const up = (v, name) => { if (typeof v !== 'string' || !v.startsWith('data:')) return v; if (!cache.has(v)) cache.set(v, dzUpload(id, v, name)); return cache.get(v); };
    // Sube todas las imágenes nuevas a la vez
    const pend = []; const q = (v, n) => { const r = up(v, n); if (r instanceof Promise) pend.push(r); };
    [t.m_iso, t.m_wordm].forEach((m, i) => { if (m) { const k = i ? 'logotipo' : 'isotipo'; q(m.png, k); q(m.mono, k + '-mono'); if (m.raw) q(m.raw, k + '-original'); } });
    q(t.iso, 'isotipo'); q(t.isoM, 'isotipo-mono'); q(t.wordm, 'logotipo'); q(t.wordmM, 'logotipo-mono'); if (t.pat) { q(t.pat.o, 'patron'); q(t.pat.m, 'patron-mono'); }
    if (pend.length && b) b.textContent = 'Subiendo tu logo…';
    await Promise.all(pend);
    const meta = async (m, k) => m ? { ratio: m.ratio, rawRatio: m.rawRatio, ratioOrig: m.ratioOrig, removed: !!m.removed, hadAlpha: !!m.hadAlpha, png: await up(m.png, k), mono: await up(m.mono, k + '-mono'), raw: m.raw ? await up(m.raw, k + '-original') : null } : null;
    if (b) b.textContent = 'Guardando…';
    const design = {
      finish: t.finish, accent: t.accent, a2: t.a2, font: t.font, shape: t.shape, logoMode: t.logoMode, logoColor: t.logoColor, anim: t.anim, personality: t.personality,
      palette: t.palette || null, lowContrast: !!t.lowContrast, bg_iso: !!t.bg_iso, bg_wordm: !!t.bg_wordm,
      m_iso: await meta(t.m_iso, 'isotipo'), m_wordm: await meta(t.m_wordm, 'logotipo'),
      iso: await up(t.iso, 'isotipo'), isoM: await up(t.isoM, 'isotipo-mono'), wordm: await up(t.wordm, 'logotipo'), wordmM: await up(t.wordmM, 'logotipo-mono'),
      pat: t.pat ? { o: await up(t.pat.o, 'patron'), m: await up(t.pat.m, 'patron-mono'), w: t.pat.w, h: t.pat.h } : null,
      fontFam: t.fontFam || null, fontUrl: t.fontUrl || null,
    };
    if (DZ.font) { const f = DZ.font, ext = f.name.split('.').pop().toLowerCase(); design.fontUrl = await dzUpload(id, f, 'tipografia.' + ext, { ttf: 'font/ttf', otf: 'font/otf', woff: 'font/woff', woff2: 'font/woff2' }[ext] || 'font/ttf'); DZ.font = null; t.fontUrl = design.fontUrl; }
    const name = (t.name || '').trim(), type = (t.type || '').trim(), reward = (t.reward || '').trim();
    if (name.length < 2) throw new Error('Escribe el nombre del negocio.');
    if (!reward) throw new Error('Escribe el premio.');
    await db.update('stores', `id=eq.${id}`, { design, name, business_type: type, reward, needed: t.needed, terms: (t.terms || '').trim() });
    DZ = null; delete storeCache[id]; toast('Diseño guardado. Tus clientes ya lo ven.'); route();
  } catch (e) { toast(e.message || 'No se pudo guardar.'); if (b) { b.disabled = false; b.textContent = 'Guardar'; } }
}
async function dzAct(a) {
  const t = DZ?.s; if (!t) return; const op = a.dataset.op;
  switch (op) {
    case 'pers': t.personality = a.dataset.v; dzDirty(); dzRedraw(); break;
    case 'opt': { const k = a.closest('[data-k]').dataset.k; t[k] = a.dataset.v; dzDirty(); dzPreview(); dzChips(); break; }
    case 'color': t.accent = a.dataset.c; dzDirty(); dzPreview(); dzChips(); break;
    case 'color2': t.a2 = a.dataset.c; dzDirty(); dzPreview(); dzChips(); break;
    case 'userec': { const r = K.recsFor(t)[+a.dataset.i]; ['finish', 'font', 'logoMode', 'anim', 'accent', 'a2', 'logoColor'].forEach((k) => (t[k] = r[k])); dzDirty(); dzRedraw(); window.scrollTo({ top: 0, behavior: 'smooth' }); toast(`Diseño "${r.n}" aplicado`); break; }
    case 'idea': t.reward = a.dataset.v; $('#dzr').value = t.reward; dzDirty(); dzPreview(); break;
    case 'tcadd': { const v = a.dataset.v, ta = $('#dzc'), cur = (t.terms || '').trim(); if (cur.split('\n').includes(v)) { toast('Esa condición ya está'); break; } t.terms = ((cur ? cur + '\n' : '') + v).slice(0, 240); ta.value = t.terms; $('#dzcc').textContent = t.terms.length + '/240'; ta.focus(); if (v.endsWith('$')) ta.setSelectionRange(t.terms.length, t.terms.length); dzDirty(); dzPreview(); break; }
    case 'test': { const card = $('#pv .card'), dot = card?.querySelectorAll('.dots i')[dzStamps()]; if (dot) { dot.classList.add('on'); setTimeout(() => dot.classList.remove('on'), 1600); } K.effect(t, $('#pvh'), dot || card, card); break; }
    case 'bgtoggle': { const k = a.dataset.k, m = t['m_' + k]; if (!m || !m.raw) break; const on = !t['bg_' + k]; t['bg_' + k] = on; t[k] = on ? m.raw : m.png; t[k + 'M'] = on ? m.raw : m.mono; if (!m.ratioOrig) m.ratioOrig = m.ratio; m.ratio = on ? m.rawRatio : m.ratioOrig;
      if (k === 'iso' && t.m_wordm === m) { t.wordm = t.iso; t.wordmM = t.isoM; } await K.buildPattern(t); dzDirty(); dzRedraw(); toast(on ? 'Usando tu logo con su fondo original' : 'Fondo quitado de nuevo'); break; }
    case 'rmlogo': { const k = a.dataset.k; t[k] = null; t[k + 'M'] = null; t['m_' + k] = null; t['bg_' + k] = false; if (!t.iso && !t.wordm) { t.palette = null; t.lowContrast = false; t.logoColor = 'original'; } await K.buildPattern(t); dzDirty(); dzRedraw(); break; }
    case 'discard': DZ = null; route(); break;
    case 'save': dzSave(); break;
  }
}
function dzInput(el) {
  const t = DZ?.s; if (!t) return false;
  const id = el.id;
  if (id === 'dzn') t.name = el.value; else if (id === 'dzt') t.type = el.value; else if (id === 'dzr') t.reward = el.value;
  else if (id === 'dzc') { t.terms = el.value; $('#dzcc').textContent = el.value.length + '/240'; }
  else if (id === 'dzneed') { t.needed = +el.value; $('#dzneedv').textContent = t.needed; }
  else if (id === 'dzac') { t.accent = el.value; dzChips(); } else if (id === 'dzac2') { t.a2 = el.value; dzChips(); }
  else return false;
  dzDirty(); dzPreview(); return true;
}
async function dzFile(el) {
  const f = el.files[0]; if (!f || !DZ) return;
  if (el.id === 'up-iso' || el.id === 'up-wordm') {
    if (f.size > 8 * 1024 * 1024) { toast('El archivo es muy pesado (máximo 8 MB).'); return; }
    const r = new FileReader(); r.onload = () => dzSetLogo(el.id === 'up-iso' ? 'iso' : 'wordm', r.result); r.readAsDataURL(f);
  } else if (el.id === 'upfont') {
    if (f.size > 2 * 1024 * 1024) { toast('La tipografía pesa mucho (máximo 2 MB).'); return; }
    try { const fam = 'MarcaFont' + Date.now(); const ff = new FontFace(fam, await f.arrayBuffer()); await ff.load(); document.fonts.add(ff);
      DZ.font = f; DZ.s.fontFam = fam; DZ.s.fontUrl = null; DZ.s.font = 'custom'; dzDirty(); dzRedraw(); toast('Tu tipografía ya está en la tarjeta'); }
    catch { toast('No pudimos leer ese archivo de fuente'); }
  }
}

/* ---------- Admin ---------- */
on(/^\/admin\/(tiendas|pagos|config)$/, async (tab) => {
  if (needAuth()) return; loading();
  const u = await loadMe(true);
  if (!u.is_admin) { location.hash = '#/perfil'; return; }
  setNav([['#/admin/tiendas', 'Tiendas', 'store'], ['#/admin/pagos', 'Pagos', 'card'], ['#/admin/config', 'Ajustes', 'cog'], ['#/perfil', 'Perfil', 'user']], '#/admin/' + tab);
  let body = '';
  if (tab === 'tiendas') {
    const rows = await db.get('stores', 'select=id,name,slug,business_type,zone,phone,instagram,status,plan,verify_status,verify_method,verify_code,trial_ends_at,paid_until,created_at,profiles!stores_owner_id_fkey(full_name,phone)&order=created_at.desc');
    const pend = rows.filter((r) => r.verify_status === 'pendiente');
    body = `<div class="kpis"><div class="kpi"><small>Tiendas</small><b>${rows.length}</b></div><div class="kpi"><small>Pagando</small><b>${rows.filter((r) => r.status === 'activa').length}</b></div><div class="kpi"><small>Por verificar</small><b>${pend.length}</b></div></div>
      <div class="list">${rows.map((r) => `<button class="row" data-act="ashop" data-id="${r.id}"><div class="av">${initials(r.name)}</div><div class="rt"><b>${esc(r.name)}<span class="tag ${r.status === 'activa' ? 'ok' : r.status === 'prueba' ? '' : 'warn'}">${r.status}</span>${r.verify_status === 'pendiente' ? '<span class="tag warn">Por verificar</span>' : r.verify_status === 'verificada' ? '<span class="tag ok">✓</span>' : ''}</b><small>${esc(r.business_type)} · ${esc(r.zone || '')} · ${esc(r.profiles?.full_name || '')}</small></div></button>`).join('') || '<p class="empty">Todavía no hay tiendas.</p>'}</div>`;
    window.__adminStores = rows;
  } else if (tab === 'pagos') {
    const rows = await db.get('payments', 'select=*,stores(name)&order=created_at.desc&limit=100');
    body = `<div class="list">${rows.map((p) => `<div class="row" style="flex-wrap:wrap"><div class="rt"><b>${esc(p.stores?.name)}<span class="tag ${p.status === 'validado' ? 'ok' : p.status === 'rechazado' ? 'bad' : 'warn'}">${p.status}</span></b><small>Ref ${esc(p.reference)} · ${esc(p.bank || '')} · Bs ${p.amount_bs} · ${fmtTime(p.created_at)}</small></div>${p.status === 'pendiente' ? `<div style="display:flex;gap:8px;width:100%"><button class="primary" style="height:42px;margin:0" data-act="apay" data-id="${p.id}" data-ok="1">Validar</button><button class="ghost" style="min-height:42px" data-act="apay" data-id="${p.id}" data-ok="0">Rechazar</button></div>` : ''}</div>`).join('') || '<p class="empty">Sin pagos.</p>'}</div>`;
  } else {
    const cfg = await db.get('app_config', 'id=eq.1&select=*', { single: true });
    body = `<form class="glass pad form" id="cfgf" novalidate>
      <label class="flabel" for="cfp">Precio del plan (€/mes)</label><input class="inp" id="cfp" inputmode="decimal" value="${cfg.price_eur}">
      <label class="flabel" for="cfk">Plan + Kit (€)</label><input class="inp" id="cfk" inputmode="decimal" value="${cfg.kit_eur}">
      <div class="glass pad" style="margin:4px 0 6px"><span class="eyebrow">Tasa BCV del euro</span>
        <h2 style="margin:4px 0 2px">Bs ${fmtBs(cfg.bcv_rate || 0)} <small style="font-size:14px;color:var(--muted);font-weight:500">por €</small></h2>
        <p class="small">${cfg.bcv_auto ? `Automática · tasa oficial del ${bcvDay(cfg)}${cfg.bcv_checked_at ? ` · revisada ${fmtTime(cfg.bcv_checked_at)}` : ''}<br>Se revisa cada hora de 6 am a 8 pm, de lunes a sábado.` : 'Manual: la escribes tú.'}</p>
        ${cfg.bcv_error && cfg.bcv_auto ? `<div class="notice warn">${ic('info', 16)}<span>La última revisión falló (${esc(cfg.bcv_error)}). Se mantiene la tasa anterior.</span></div>` : ''}
        <label class="check"><input type="checkbox" id="cfa"${cfg.bcv_auto ? ' checked' : ''}> Actualizar sola con la tasa oficial del BCV</label>
        <div id="cfrw"${cfg.bcv_auto ? ' hidden' : ''}><label class="flabel" for="cfr">Tasa manual (Bs por €)</label><input class="inp" id="cfr" inputmode="decimal" value="${cfg.bcv_rate}"></div>
        ${cfg.bcv_auto ? '<button type="button" class="ghost" style="margin-top:8px" data-act="bcvnow">Actualizar ahora</button>' : ''}</div>
      <label class="flabel" for="cft">Días de prueba</label><input class="inp" id="cft" inputmode="numeric" value="${cfg.trial_days}">
      <label class="flabel" for="cfs">WhatsApp de soporte</label><input class="inp" id="cfs" inputmode="numeric" value="${cfg.support_phone}">
      <p class="err" id="cferr"></p><button class="primary" type="submit">Guardar</button></form>`;
  }
  app.innerHTML = `<div class="top">${LOGO}<span class="tag">Admin</span></div><h1>${{ tiendas: 'Tiendas', pagos: 'Pagos', config: 'Ajustes' }[tab]}</h1>${body}`;
});
function adminShop(id) {
  const r = (window.__adminStores || []).find((x) => x.id === id); if (!r) return;
  openSheet(`<div class="av" style="width:60px;height:60px;margin:0 auto;font-size:20px">${initials(r.name)}</div><h2>${esc(r.name)}</h2><p>${esc(r.business_type)} · ${esc(r.zone || '')}</p>
    <div class="terms" style="text-align:left"><b>Dueño: ${esc(r.profiles?.full_name || '')}</b>WhatsApp negocio: ${fmtPhone(r.phone)}${r.instagram ? `<br>Instagram: @${esc(r.instagram)}` : ''}<br>Plan: ${r.plan} · Estado: ${r.status}<br>Prueba hasta: ${fmtDate(r.trial_ends_at)}${r.paid_until ? `<br>Pagado hasta: ${fmtDate(r.paid_until)}` : ''}<br>Verificación: ${r.verify_status}${r.verify_code ? ` · código ${esc(r.verify_code)} por ${esc(r.verify_method)}` : ''}</div>
    <div class="btns">
      ${r.verify_status === 'pendiente' ? `<button class="primary" data-act="averify" data-id="${r.id}" data-v="verificada">Aprobar verificación</button><button class="ghost danger" data-act="averify" data-id="${r.id}" data-v="rechazada">Rechazar verificación</button>` : ''}
      <a class="ghost" target="_blank" rel="noopener" href="${waLink(r.phone, `Hola, te escribimos de Fiel sobre ${r.name}.`)}">${ic('msg', 16)} Escribir por WhatsApp</a>
      <button class="ghost" data-act="astatus" data-id="${r.id}" data-v="activa">Activar 30 días</button>
      ${r.status === 'suspendida' ? `<button class="ghost" data-act="astatus" data-id="${r.id}" data-v="prueba">Reactivar</button>` : `<button class="ghost danger" data-act="astatus" data-id="${r.id}" data-v="suspendida">Suspender</button>`}
      <a class="ghost" href="#/t/${r.slug}">Ver página pública</a>
    </div>`);
}

/* ---------- Instalar en pantalla de inicio ---------- */
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPrompt = e; });
function installSheet() {
  if (deferredPrompt) { deferredPrompt.prompt(); deferredPrompt = null; return; }
  const ios = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const steps = ios ? ['Abre Fiel en <b>Safari</b>.', 'Toca el botón <b>Compartir</b> (el cuadrado con la flecha).', 'Elige <b>“Agregar a pantalla de inicio”</b>.', 'Toca <b>Agregar</b>.'] : ['Abre Fiel en <b>Chrome</b>.', 'Toca el menú <b>⋮</b> arriba a la derecha.', 'Elige <b>“Instalar app”</b> o <b>“Agregar a pantalla principal”</b>.', 'Confirma.'];
  openSheet(`<div class="bigicon">${ic('upload', 26)}</div><h2>Fiel en tu <em>pantalla de inicio</em></h2><ol style="text-align:left;margin:14px 0 0 22px;color:var(--muted);line-height:1.8">${steps.map((s) => `<li>${s}</li>`).join('')}</ol><div class="btns"><button class="primary" data-close>Listo</button></div>`);
}
const LEGAL = `<h2>Términos y <em>privacidad</em></h2><div style="text-align:left;font-size:14px;color:var(--muted);line-height:1.55">
  <p><b style="color:var(--fg)">Qué es Fiel.</b> Fiel guarda tus tarjetas de fidelidad de distintas tiendas. Cada tienda decide su premio, cuántos sellos pide y sus condiciones; Fiel no vende los productos ni entrega los premios.</p>
  <p><b style="color:var(--fg)">Tu cuenta.</b> Es personal. No compartas tu contraseña ni tus códigos. Fiel puede bloquear cuentas usadas para hacer trampa.</p>
  <p><b style="color:var(--fg)">Qué datos guardamos.</b> Nombre, cédula, teléfono y tus sellos, para identificarte en caja y evitar cuentas repetidas. Cada tienda ve solo a sus clientes. No vendemos ni compartimos tus datos.</p>
  <p><b style="color:var(--fg)">Tus derechos.</b> Puedes pedir una copia de tus datos o eliminar tu cuenta escribiéndonos por WhatsApp.</p>
  <p><b style="color:var(--fg)">Tiendas.</b> Pagan un plan mensual por Pago Móvil. Si dejan de pagar, sus clientes conservan los sellos, pero la tienda no puede sellar hasta renovar.</p></div>
  <div class="btns"><button class="primary" data-close>Entendido</button></div>`;

/* ---------- Eventos ---------- */
document.addEventListener('click', async (e) => {
  const go = e.target.closest('[data-go]'); if (go) { location.hash = go.dataset.go; return; }
  if (e.target.closest('[data-close]')) { closeSheet(); return; }
  const a = e.target.closest('[data-act]'); if (!a) return;
  const act = a.dataset.act, hid = (location.hash.match(/tienda\/([0-9a-f-]{36})/) || [])[1];
  switch (act) {
    case 'reload': location.reload(); break;
    case 'legal': openSheet(LEGAL); break;
    case 'install': installSheet(); break;
    case 'dz': await dzAct(a); break;
    case 'logout':
      if (bioInfo()) openSheet(`<div class="bigicon">${ic('out', 26)}</div><h2>¿Cerrar sesión?</h2><p>Puedes volver a entrar con ${BIO}. Si este teléfono no es tuyo o lo vas a prestar, quita también ${BIO}.</p><div class="btns"><button class="primary" data-act="logout1">Cerrar sesión</button><button class="ghost" data-act="logout2">Cerrar y quitar ${BIO}</button><button class="linkbtn" data-close>Cancelar</button></div>`);
      else signOut();
      break;
    case 'bcvnow': { a.disabled = true; a.textContent = 'Consultando BCV…'; try { const r = await db.rpc('admin_refresh_bcv'); cfgCache = null; toast(String(r).startsWith('ok') ? 'Tasa actualizada' : 'No se pudo actualizar: ' + r); } catch (err) { toast(err.message); } route(); break; }
    case 'logout1': closeSheet(); signOut(); break;
    case 'logout2': closeSheet(); signOut(true); break;
    case 'bioon': {
      try { const u = await loadMe(); await bioEnable(u); closeSheet(); toast(`${BIO} activado`); if (location.hash === '#/perfil') route(); }
      catch (err) { closeSheet(); toast(bioErr(err)); }
      break; }
    case 'biooff': openSheet(`<div class="bigicon">${ic('face', 26)}</div><h2>¿Desactivar ${BIO}?</h2><p>Tendrás que escribir tu cédula y contraseña para entrar.</p><div class="btns"><button class="primary" data-act="biooff2">Desactivar</button><button class="ghost" data-close>Cancelar</button></div>`); break;
    case 'biooff2': bioOff(); closeSheet(); toast(`${BIO} desactivado`); route(); break;
    case 'biowho': { const l = bioOff(); if (l?.refresh_token) { saveSession(l); try { await api('/auth/v1/logout', { method: 'POST' }); } catch {} saveSession(null); } route(); break; }
    case 'biounlock': {
      if (!e.isTrusted && !window.__bioSilent) break;
      const er = $('#berr'); if (er) er.textContent = '';
      try {
        await bioCheck();
        const l = lsGet(LKEY); if (!l) { route(); break; }
        saveSession({ ...l, expires_at: 0 }); lsSet(LKEY, null); me = null;
        await refreshIfNeeded();
        if (!session) { bioOff(); toast('Tu sesión venció. Entra con tu contraseña.'); route(); break; }
        try { sessionStorage.setItem('fiel.unlocked', '1'); } catch {}
        goNext();
      } catch (err) { if (!window.__bioSilent) { if (er) er.textContent = bioErr(err); else toast(bioErr(err)); } }
      window.__bioSilent = 0;
      break; }
    case 'forgot': openSheet(`<div class="bigicon">${ic('lock', 26)}</div><h2>¿Olvidaste tu <em>contraseña</em>?</h2><p>Escríbenos por WhatsApp desde el número de tu cuenta con tu cédula y te ayudamos a crear una nueva.</p><div class="btns"><a class="primary wa" target="_blank" rel="noopener" href="${waLink(C.support, 'Hola, olvidé mi contraseña de Fiel. Mi cédula es: ')}">${ic('msg', 18)} Escribir a soporte</a><button class="ghost" data-close>Cancelar</button></div>`); break;
    case 'prize': openSheet(`<div class="bigicon gold">${ic('gift', 26)}</div><h2>${esc(a.dataset.reward)}</h2><p>en ${esc(a.dataset.store)}</p><div class="bigcode">${a.dataset.code}</div><p class="small">Muéstralo en caja o escríbelo en tu pedido en línea. Vence el ${fmtDate(a.dataset.exp)}.</p><div class="btns"><button class="primary" data-close>Listo</button></div>`); break;
    case 'join': joinStore(a.dataset.slug); break;
    case 'setnext': sessionStorage.setItem('fiel.next', a.dataset.next); break;
    case 'pick': a.parentElement.querySelectorAll('.chip').forEach((c) => c.classList.toggle('on', c === a)); break;
    case 'channel': S.channel = a.dataset.v; a.parentElement.querySelectorAll('button').forEach((c) => c.classList.toggle('on', c === a)); break;
    case 'qty': S.qty = +a.dataset.n; a.parentElement.querySelectorAll('.chip').forEach((c) => c.classList.toggle('on', c === a)); break;
    case 'exadd': { const sc = readCed('sc'); syncExtra(); S.extra.push({ ced: '', ok: false }); await route(); if (sc) { $('#sc').value = sc.slice(1); $('#scp').value = sc[0]; } $('#ex' + (S.extra.length - 1))?.focus(); break; }
    case 'exdel': { const sc = readCed('sc'); syncExtra(); S.extra.splice(+a.dataset.i, 1); await route(); if (sc) { $('#sc').value = sc.slice(1); $('#scp').value = sc[0]; } break; }
    case 'fillcode': $('#code').value = a.dataset.code; $('#code').focus(); break;
    case 'deliver': try { await db.rpc('deliver_reward', { p_store: a.dataset.id, p_code: a.dataset.code }); closeSheet(); toast('Premio entregado'); route(); } catch (err) { toast(err.message); } break;
    case 'showqr': MT = 'qr'; location.hash = `#/tienda/${a.dataset.id}/tienda`; route(); break;
    case 'mt': MT = a.dataset.v; route(); break;
    case 'copy': try { await navigator.clipboard.writeText(a.dataset.v); toast('Enlace copiado'); } catch { toast(a.dataset.v); } break;
    case 'rmmember': if (!confirmOnce(a, 'Toca otra vez para quitar el acceso')) break; try { await db.update('store_members', `store_id=eq.${hid}&user_id=eq.${a.dataset.u}`, { active: false }); toast('Acceso quitado'); delete storeCache[hid]; route(); } catch (err) { toast(err.message); } break;
    case 'verify': {
      const code = 'FIEL-' + Math.floor(1000 + Math.random() * 9000), m = a.dataset.m, sname = storeCache[a.dataset.id]?.st?.name || 'mi tienda';
      try {
        await db.update('stores', `id=eq.${a.dataset.id}`, { verify_status: 'pendiente', verify_method: m, verify_code: code }); delete storeCache[a.dataset.id];
        if (m === 'whatsapp') window.open(waLink(C.support, `Hola Fiel, soy de ${sname}. Mi código de verificación es ${code}.`), '_blank');
        else openSheet(`<h2>Tu código</h2><div class="bigcode">${code}</div><p>Envíalo por mensaje directo a <b>@${C.instagram}</b> desde el Instagram de tu negocio.</p><div class="btns"><button class="primary" data-close>Listo</button></div>`);
        route();
      } catch (err) { toast(err.message); }
      break;
    }
    case 'ashop': adminShop(a.dataset.id); break;
    case 'averify': try { await db.update('stores', `id=eq.${a.dataset.id}`, { verify_status: a.dataset.v }); closeSheet(); toast(a.dataset.v === 'verificada' ? 'Tienda verificada' : 'Verificación rechazada'); route(); } catch (err) { toast(err.message); } break;
    case 'astatus': try { const patch = { status: a.dataset.v }; if (a.dataset.v === 'activa') patch.paid_until = new Date(Date.now() + 30 * 864e5).toISOString(); await db.update('stores', `id=eq.${a.dataset.id}`, patch); closeSheet(); toast('Listo'); route(); } catch (err) { toast(err.message); } break;
    case 'apay': try { await db.rpc('admin_validate_payment', { p_payment: a.dataset.id, p_ok: a.dataset.ok === '1' }); toast(a.dataset.ok === '1' ? 'Pago validado: tienda activa 30 días' : 'Pago rechazado'); route(); } catch (err) { toast(err.message); } break;
  }
});
function confirmOnce(el, msg) { if (el.dataset.armed) return true; el.dataset.armed = '1'; toast(msg); setTimeout(() => delete el.dataset.armed, 3000); return false; }
document.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = e.target.id, hid = (location.hash.match(/tienda\/([0-9a-f-]{36})/) || [])[1];
  if (id === 'rf') submitRegister();
  else if (id === 'lf') submitLogin();
  else if (id === 'nsf') submitNewStore();
  else if (id === 'sf') submitStamp(hid);
  else if (id === 'cf') submitCode(hid);
  else if (id === 'mf') {
    const ced = readCed('mc'), role = $('#mrole .chip.on').dataset.v, er = $('#merr'); er.textContent = '';
    if (!ced) { er.textContent = 'Escribe la cédula.'; return; }
    try { const r = await db.rpc('add_member', { p_store: hid, p_cedula: ced, p_role: role }); toast(`${first(r.name)} ya tiene acceso`); delete storeCache[hid]; route();
      setTimeout(() => openSheet(`<div class="bigicon ok">${ic('check', 26)}</div><h2>Acceso <em>listo</em></h2><p>${esc(r.name)} ya puede entrar a Fiel con su cuenta. Avísale:</p><div class="btns"><a class="primary wa" target="_blank" rel="noopener" href="${waLink(r.phone, `Hola ${first(r.name)}, ya tienes acceso a la tienda en Fiel. Entra en ${location.origin}, ve a tu Perfil › Mi negocio y empieza a sellar.`)}">${ic('msg', 18)} Avisar por WhatsApp</a><button class="ghost" data-close>Cerrar</button></div>`), 300);
    } catch (err) { er.textContent = err.message; }
  } else if (id === 'rlf') {
    const lim = parseInt($('#rlim').value, 10), mn = parseInt($('#rmin').value, 10), mx = parseInt($('#rmax').value, 10), er = $('#rlerr');
    if (!(lim > 0 && lim <= 1000) || !(mn > 0) || !(mx >= 2 && mx <= 20)) { er.textContent = 'Revisa los números (personas por cuenta: de 2 a 20).'; return; }
    const st = storeCache[hid].st, rules = { ...(st.rules || {}), limit: lim, limitOn: $('#rlon').checked, split: $('#rsplit .chip.on').dataset.v, splitMin: mn, splitMax: mx, waAfter: $('#rwa').checked, ref: $('#rref').checked };
    try { await db.update('stores', `id=eq.${hid}`, { rules }); toast('Reglas guardadas'); delete storeCache[hid]; route(); } catch (err) { er.textContent = err.message; }
  } else if (id === 'pyf') {
    const ref = $('#pyr').value.replace(/\D/g, ''), bank = $('#pyb').value.trim(), er = $('#pyerr');
    if (ref.length < 6) { er.textContent = 'La referencia debe tener al menos 6 dígitos.'; return; }
    const cfg = await getConfig(), st = storeCache[hid].st, eur = st.plan === 'kit' ? cfg.kit_eur : cfg.price_eur;
    try { await db.insert('payments', { store_id: hid, amount_eur: eur, amount_bs: Math.round(eur * (cfg.bcv_rate || 0) * 100) / 100, bank, reference: ref }); toast('Recibimos tu pago. Te avisamos al confirmarlo.'); route(); } catch (err) { er.textContent = err.message; }
  } else if (id === 'cfgf') {
    const num = (s) => parseFloat(String($(s).value).replace(',', '.'));
    const auto = $('#cfa').checked;
    const patch = { price_eur: num('#cfp'), kit_eur: num('#cfk'), bcv_auto: auto, ...(auto ? {} : { bcv_rate: num('#cfr') }), trial_days: parseInt($('#cft').value, 10), support_phone: $('#cfs').value.replace(/\D/g, ''), updated_at: new Date().toISOString() };
    if (Object.values(patch).some((v) => typeof v === 'number' && !(v >= 0))) { $('#cferr').textContent = 'Revisa los números.'; return; }
    try { await db.update('app_config', 'id=eq.1', patch); cfgCache = null; if (auto) await db.rpc('admin_refresh_bcv').catch(() => {}); toast('Ajustes guardados'); route(); } catch (err) { $('#cferr').textContent = err.message; }
  }
});
document.addEventListener('input', (e) => { dzInput(e.target); });
document.addEventListener('change', async (e) => {
  if (e.target.id === 'cfa') { const w = $('#cfrw'); if (w) w.hidden = e.target.checked; return; }
  if (['up-iso', 'up-wordm', 'upfont'].includes(e.target.id)) { await dzFile(e.target); e.target.value = ''; }
});

if (bioInfo() && session) { let u = null; try { u = sessionStorage.getItem('fiel.unlocked'); } catch {} if (!u) { const h = location.hash; bioLock(); if (h && !/^#\/(entrar|registro)?$/.test(h)) sessionStorage.setItem('fiel.next', h); location.hash = '#/entrar'; } }
route();
flushQueue();
