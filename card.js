// Motor de tarjetas de Fiel (mismo diseño que la demo).
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = (t) => String(t ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const initials = (n) => String(n || '').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
const ic = (n, s = 20) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="9.5" width="16" height="10.5" rx="1.5"/><path d="M3 9.5h18M12 9.5V20M12 9.5C10 9.5 7.5 9 7.5 7s3-2.5 4.5 2.5zM12 9.5c2 0 4.5-.5 4.5-2.5s-3-2.5-4.5 2.5z"/></svg>`;
const FINISHES=[['onix','Ónix y oro'],['joya','Joya'],['guilloche','Guilloché'],['artdeco','Art déco'],['terciopelo','Terciopelo'],['perla','Perla'],['oro','Lámina de oro'],['lino','Lino'],['pizarra','Pizarra'],['origami','Origami'],['grano','Risografía'],['acuarela','Acuarela'],['metal','Black metálico'],['anodizado','Metal de color'],['cromo','Cromo'],['carbono','Fibra de carbono'],['holo','Holográfico'],['neon','Neón'],['vidrio','Vidrio'],['aurora','Aurora'],['malla','Malla de color'],['halo','Halo'],['seda','Seda'],['mate','Mate'],['grad','Degradado'],['cuero','Cuero'],['cuadricula','Cuadrícula'],['ondas','Ondas'],['rayos','Rayos'],['puntos','Puntos'],['rayas','Rayas'],['terrazo','Terrazo'],['marmol','Mármol'],['papel','Papel'],['blanco','Blanco minimal'],['ticket','Ticket retro']];
const FL=Object.fromEntries(FINISHES);
const FGROUPS=[['Elegantes',['onix','joya','guilloche','artdeco','terciopelo','perla','marmol','blanco']],['Metálicos',['metal','oro','anodizado','cromo','carbono']],['Modernos',['vidrio','aurora','malla','halo','seda','holo','neon','cuadricula','mate','grad']],['Texturas',['cuero','lino','pizarra','terrazo','papel','grano','acuarela']],['Con carácter',['ondas','rayos','origami','puntos','rayas','ticket']]];
const LIGHT=['metal','holo','carbono','neon','vidrio','aurora','cuero','malla','cuadricula','halo','onix','guilloche','artdeco','pizarra','joya'],DARK=['papel','marmol','ticket','cromo','terrazo','blanco','oro','perla','lino','grano','acuarela'];
const SHAPES=[['dot','Punto'],['star','Estrella'],['heart','Corazón'],['bolt','Rayo'],['cup','Taza'],['burger','Hamburguesa'],['scissors','Tijera'],['crown','Corona'],['ball','Pelota'],['logo','Mi isotipo']];
const ANIMS=[['stamp','Sello de goma'],['foil','Lámina dorada'],['rings','Onda expansiva'],['glow','Resplandor'],['flip','Giro'],['rain','Lluvia de sellos'],['ink','Golpe de tinta'],['sparkle','Destellos'],['wave','Ola'],['confetti','Confeti'],['shine','Brillo'],['bounce','Rebote']];
const LOGOMODES=[['circulo','Insignia'],['centro','Al centro'],['grabado','Grabado'],['fondo','Grande de fondo'],['patron','Patrón'],['esquina','En la esquina'],['solo','Logotipo protagonista']];
const LOGOCOLORS=[['original','Colores originales'],['ink','Monocromo'],['brand','Color de acento']];
const FONTS=[['geist','Moderna','"Geist",system-ui,sans-serif',700],['instrument','Editorial','"Instrument Serif",Georgia,serif',400],['playfair','Elegante','"Playfair Display",Georgia,serif',700],['cormorant','Lujo','"Cormorant Garamond",Georgia,serif',600],['fraunces','Cálida','"Fraunces",Georgia,serif',700],['unbounded','Impacto','"Unbounded",sans-serif',700],['syne','Creativa','"Syne",sans-serif',700],['archivo','Deportiva','"Archivo Black",sans-serif',400],['bebas','Retro','"Bebas Neue","Arial Narrow",sans-serif',400],['baloo','Juvenil','"Baloo 2",sans-serif',700],['dmmono','Técnica','"DM Mono",ui-monospace,monospace',500]];
const FONTMAP=Object.fromEntries(FONTS.map(f=>[f[0],{label:f[1],css:f[2],w:f[3]}]));
const loadedFonts={};
function fontOf(s){if(s.font==='custom'&&s.fontFam){if(s.fontUrl&&!loadedFonts[s.fontFam]&&window.FontFace){loadedFonts[s.fontFam]=1;try{const ff=new FontFace(s.fontFam,`url(${s.fontUrl})`);ff.load().then(f=>document.fonts.add(f)).catch(()=>{})}catch{}}return{label:'Mi tipografía',css:`"${s.fontFam}",sans-serif`,w:400}}return FONTMAP[s.font]||FONTMAP.geist}
const PRESETS=['#e4572e','#d9a21b','#c9a14a','#2f9e6b','#39ff88','#2b6cb0','#8b5cf6','#e2559b','#c8a6ff','#1c1c1c','#f4f4f2'];
const PRESETS2=['#f2a541','#f3e2b3','#00d1ff','#ffb3d9','#b08d57','#ffffff','#111111'];
const PERS={
  elegante:{label:'Elegante',why:'transmite exclusividad',recs:[{n:'Noche de gala',finish:'onix',font:'cormorant',logoMode:'grabado',anim:'foil'},{n:'Joyería',finish:'joya',font:'playfair',logoMode:'centro',anim:'shine'},{n:'Billete fino',finish:'guilloche',font:'instrument',logoMode:'circulo',anim:'rings'}]},
  atrevida:{label:'Atrevida',why:'llama la atención y se siente con energía',recs:[{n:'Neón eléctrico',finish:'neon',font:'unbounded',logoMode:'solo',anim:'confetti'},{n:'Aurora',finish:'aurora',font:'syne',logoMode:'fondo',anim:'bounce'},{n:'Fuego',finish:'grad',font:'archivo',logoMode:'patron',anim:'ink'}]},
  calida:{label:'Cálida',why:'se siente cercana y hecha a mano',recs:[{n:'Papel artesanal',finish:'papel',font:'fraunces',logoMode:'circulo',anim:'ink'},{n:'Ticket de la casa',finish:'ticket',font:'fraunces',logoMode:'centro',anim:'ink'},{n:'Terracota',finish:'mate',font:'playfair',logoMode:'fondo',anim:'shine'}]},
  minimalista:{label:'Minimalista',why:'deja respirar a tu logo',recs:[{n:'Monocromo',finish:'mate',font:'geist',logoMode:'solo',anim:'shine'},{n:'Vidrio esmerilado',finish:'vidrio',font:'geist',logoMode:'circulo',anim:'shine'},{n:'Black',finish:'metal',font:'dmmono',logoMode:'circulo',anim:'ink'}]},
  juvenil:{label:'Juvenil',why:'se ve divertida y fresca',recs:[{n:'Pop',finish:'puntos',font:'baloo',logoMode:'fondo',anim:'confetti'},{n:'Holograma',finish:'holo',font:'syne',logoMode:'circulo',anim:'confetti'},{n:'Rayas',finish:'rayas',font:'baloo',logoMode:'patron',anim:'bounce'}]},
  clasica:{label:'Clásica',why:'tiene un aire de toda la vida',recs:[{n:'Ticket clásico',finish:'ticket',font:'bebas',logoMode:'centro',anim:'ink'},{n:'Papel',finish:'papel',font:'playfair',logoMode:'circulo',anim:'ink'},{n:'Mármol',finish:'marmol',font:'cormorant',logoMode:'solo',anim:'shine'}]},
  deportiva:{label:'Deportiva',why:'transmite movimiento y rendimiento',recs:[{n:'Carbono',finish:'carbono',font:'archivo',logoMode:'patron',anim:'bounce'},{n:'Neón de cancha',finish:'neon',font:'unbounded',logoMode:'solo',anim:'confetti'},{n:'Rayas de equipo',finish:'rayas',font:'bebas',logoMode:'fondo',anim:'bounce'}]}
};
/* Tipo de negocio libre: el emoji y las ideas de premio salen de lo que escriba la tienda */
const KIND=[
  [/caf[eé]|cafeter|coffee/,'☕',['Un café gratis','Un postre gratis']],
  [/hambur|burger/,'🍔',['Hamburguesa clásica gratis','Papas gratis']],
  [/pizz/,'🍕',['Una pizza personal gratis','Bebida gratis']],
  [/sushi/,'🍣',['Un roll gratis']],
  [/restaur|comida|parrill|arepa|cocina|food|empanad/,'🍽️',['Un plato gratis','Postre de la casa']],
  [/barber/,'💈',['Corte gratis','Perfilado de barba gratis']],
  [/u[ñn]as|nail|belleza|est[eé]tica|spa|peluq|sal[oó]n/,'💅',['Manicure gratis','Tratamiento gratis']],
  [/gym|gimnas|crossfit|fitness|box|yoga|pilates/,'💪',['Una clase gratis','Una semana gratis']],
  [/p[aá]del|tenis|cancha|complejo/,'🎾',['1 hora de cancha gratis','Alquiler de pala gratis']],
  [/panad|pasteler|reposter|dulcer|torta|cupcake/,'🥐',['Un pan dulce gratis','Una porción de torta gratis']],
  [/helad/,'🍦',['Un helado gratis']],
  [/deportiv/,'👟',['15% de descuento','Unas medias gratis']],
  [/ropa|moda|boutique/,'🛍️',['10% de descuento','Un accesorio de regalo']],
  [/accesor|joyer|bisuter|detalle|regalo/,'✨',['Un accesorio sorpresa','10% de descuento']],
  [/\bbar\b|licor|cervec|cocteler/,'🍻',['Una cerveza gratis','2x1 en tragos']],
  [/lavad|autolav|car ?wash/,'🚗',['Lavado gratis']],
  [/mascota|pet|veterin|grooming/,'🐾',['Baño gratis para tu mascota']],
  [/flor/,'💐',['Un ramo pequeño gratis']],
  [/farmac/,'💊',['5% de descuento']],
  [/libr|papeler/,'📚',['10% de descuento']]
];
function kindOf(type){const t=(type||'').toLowerCase();return KIND.find(k=>k[0].test(t))||[null,'⭐',['Un producto gratis','10% de descuento']]}
const TCIDEAS=['Válido con compras desde $','No acumulable con otras promociones','Válido de lunes a jueves','Solo en tienda física','No aplica delivery','Un premio por persona','Sujeto a disponibilidad'];
const hex2rgb=h=>{h=h.replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');const n=parseInt(h,16);return[n>>16&255,n>>8&255,n&255]};
const rgb2hex=(r,g,b)=>'#'+[r,g,b].map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');
const lum=h=>{const[r,g,b]=hex2rgb(h).map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*r+.7152*g+.0722*b};
const mix=(a,b,t)=>{const A=hex2rgb(a),B=hex2rgb(b);return rgb2hex(...A.map((v,i)=>v+(B[i]-v)*t))};
function inkFor(s){if(LIGHT.includes(s.finish))return'#f6f6f3';if(DARK.includes(s.finish))return'#1f1b16';const L=s.finish==='grad'?(lum(s.accent)+lum(s.a2))/2:lum(s.accent);return L>.45?'#141414':'#ffffff'}
function uiColor(s){const L=lum(s.accent);if(L<.05)return mix(s.a2||'#d8c6a3','#ffffff',.15);if(L<.12)return mix(s.accent,'#ffffff',.5);if(L<.25)return mix(s.accent,'#ffffff',.3);return s.accent}
function stampFor(s){if(LIGHT.includes(s.finish))return uiColor(s);if(DARK.includes(s.finish))return lum(s.accent)>.5?'#1f1b16':s.accent;return inkFor(s)}
function shapeSVG(s,shape=s.shape){
  const o='<svg viewBox="0 0 24 24" aria-hidden="true">',c='</svg>';
  switch(shape){
    case'star':return o+'<path fill="currentColor" d="M12 2.8l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 16.8l-5.4 2.9 1-6.1L3.2 9.3l6.1-.9z"/>'+c;
    case'heart':return o+'<path fill="currentColor" d="M12 20.5s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.9c0 5.4-7.5 10-7.5 10z"/>'+c;
    case'bolt':return o+'<path fill="currentColor" d="M13 2 4.5 13.5H11L10 22l8.5-11.5H13z"/>'+c;
    case'cup':return o+'<path fill="currentColor" d="M4.5 8.5h12v4.5a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5z"/><path fill="none" stroke="currentColor" stroke-width="1.8" d="M16.5 10.2h1.3a2.3 2.3 0 0 1 0 4.6h-1.6"/><path fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" d="M8.5 3.5c0 1.2 1.2 1.2 1.2 2.6M12 3.5c0 1.2 1.2 1.2 1.2 2.6"/>'+c;
    case'burger':return o+'<path fill="currentColor" d="M3.8 11a8.2 6.2 0 0 1 16.4 0z"/><rect fill="currentColor" x="3" y="12.4" width="18" height="2.8" rx="1.4"/><path fill="currentColor" d="M4.2 16.6h15.6a3 3 0 0 1-3 3H7.2a3 3 0 0 1-3-3z"/>'+c;
    case'scissors':return o+'<g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="6.5" cy="17.5" r="2.8"/><circle cx="17.5" cy="17.5" r="2.8"/><path d="M8.6 15.6 18 3.5M15.4 15.6 6 3.5"/></g>'+c;
    case'crown':return o+'<path fill="currentColor" d="M3 8l4.5 4L12 4.5l4.5 7.5L21 8l-2 11H5z"/>'+c;
    case'ball':return o+'<circle cx="12" cy="12" r="8.5" fill="currentColor"/><path d="M5 7.5c3 1.5 4.5 4.5 4 9M19 16.5c-3-1.5-4.5-4.5-4-9" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="1.6"/>'+c;
    case'logo':{const src=s.isoM||s.iso||s.wordmM||s.wordm;return src?`<span class="lmask" style="--m:url(${src})"></span>`:`<span style="font-family:${fontOf(s).css.replace(/"/g,"'")};font-weight:${fontOf(s).w};font-size:13px">${initials(s.name)}</span>`}
    default:return o+'<circle fill="currentColor" cx="12" cy="12" r="7"/>'+c;
  }
}
/* Logo rendering: original image or a clean single-color silhouette via CSS mask */
function logoColor(s){return s.logoColor==='brand'?stampFor(s):inkFor(s)}
function markHTML(s,pref='iso'){
  const k=pref==='word'?(s.wordm?'wordm':'iso'):(s.iso?'iso':'wordm'),src=s[k];
  if(!src)return initials(s.name);
  return s.logoColor==='original'?`<img src="${src}" alt="">`:`<span class="lmask" style="--m:url(${s[k+'M']||src});background:${logoColor(s)}"></span>`;
}
function patternURI(s){const svg=`<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><text x='16' y='22' font-family='Arial,sans-serif' font-weight='800' font-size='13' text-anchor='middle' fill='${inkFor(s)}'>${initials(s.name)}</text><text x='48' y='54' font-family='Arial,sans-serif' font-weight='800' font-size='13' text-anchor='middle' fill='${inkFor(s)}'>${initials(s.name)}</text></svg>`;
  return 'data:image/svg+xml,'+encodeURIComponent(svg).replace(/'/g,'%27')}

/* ---------- Card ---------- */
const ratioOf=(s,k)=>{const m=k==='word'?(s.m_wordm||s.m_iso):(s.iso?s.m_iso:s.m_wordm);return m?Math.max(.25,Math.min(6,m.ratio)):1};
const fitBox=(r,W,H)=>r>=W/H?{w:W,h:Math.round(W/r)}:{w:Math.round(H*r),h:H};
const hasLogo=s=>!!(s.iso||s.wordm);
function badgeHTML(s){
  if(!hasLogo(s))return`<div class="logo">${initials(s.name)}</div>`;
  const r=ratioOf(s);if(r>=.8&&r<=1.25)return`<div class="logo">${markHTML(s)}</div>`;
  const b=fitBox(r,r>1?104:34,r>1?30:42);return`<div class="logo-free" style="width:${b.w}px;height:${b.h}px">${markHTML(s)}</div>`}
function embossHTML(s){
  const k=s.iso?'iso':'wordm',m=s[k+'M']||s[k],r=ratioOf(s),b=fitBox(r,r>1?200:110,r>1?90:84),dark=DARK.includes(s.finish);
  if(!m)return`<div class="logo-emb txt" style="font-family:${fontOf(s).css.replace(/"/g,"'")}">${initials(s.name)}</div>`;
  const L=(c,x,y)=>`<span class="lmask" style="--m:url(${m});background:${c};transform:translate(${x}px,${y}px)"></span>`;
  return`<div class="logo-emb" style="width:${b.w}px;height:${b.h}px">${dark?L('rgba(0,0,0,.22)',-1,-1)+L('rgba(255,255,255,.55)',1.2,1.2)+L('rgba(0,0,0,.035)',0,0):L('rgba(255,255,255,.16)',-1,-1)+L('rgba(0,0,0,.6)',1.2,1.2)+L('rgba(255,255,255,.035)',0,0)}</div>`}
function cardHTML(s,stamps,o={}){
  const ink=inkFor(s),stamp=stampFor(s),lm=s.logoMode||'circulo',F=fontOf(s);
  let d='';for(let i=0;i<s.needed;i++)d+=`<i class="${i<stamps?'on':''}"></i>`;
  let layer='';const src=s.iso||s.wordm,msrc=s.isoM||s.wordmM||src;
  if(lm==='fondo'){const r=ratioOf(s);layer=hasLogo(s)?(r>1.3?`<div class="logo-bg" style="width:74%;aspect-ratio:${r};right:5%;bottom:12%;transform:rotate(-6deg)">${markHTML(s)}</div>`:`<div class="logo-bg" style="width:52%;aspect-ratio:${Math.max(r,.6)};right:-2%;bottom:-8%">${markHTML(s)}</div>`):`<div class="logo-bg">${initials(s.name)}</div>`}
  else if(lm==='grabado')layer=embossHTML(s);
  else if(lm==='esquina'){const b=fitBox(ratioOf(s),78,28);layer=hasLogo(s)?`<div class="logo-corner" style="width:${b.w}px;height:${b.h}px">${markHTML(s)}</div>`:`<div class="logo-corner txt">${initials(s.name)}</div>`}
  else if(lm==='patron'){const P_=s.pat;
    layer=src&&P_?(s.logoColor==='original'?`<div class="logo-pat" style="background:url(${P_.o}) 0 0/${P_.w}px ${P_.h}px repeat"></div>`:`<div class="logo-pat" style="background:${logoColor(s)};-webkit-mask:url(${P_.m}) 0 0/${P_.w}px ${P_.h}px repeat;mask:url(${P_.m}) 0 0/${P_.w}px ${P_.h}px repeat"></div>`)
    :`<div class="logo-pat" style="background:url(${patternURI(s)}) 0 0/64px 64px repeat"></div>`}
  else if(lm==='centro'){if(src){const r=ratioOf(s),b=fitBox(r,r>1?170:80,r>1?64:80);layer=`<div class="logo-center bare" style="width:${b.w}px;height:${b.h}px">${markHTML(s)}</div>`}else layer=`<div class="logo-center">${markHTML(s)}</div>`}
  const wb=fitBox(ratioOf(s,'word'),170,36);
  const head=lm==='solo'?`<div class="wordmark">${src?`<span class="wm-box" style="width:${wb.w}px;height:${wb.h}px">${markHTML(s,'word')}</span>`:esc(s.name)}</div>`
    :`${['circulo'].includes(lm)?badgeHTML(s):''}<div class="cname"><span class="ccat">${esc(s.type)}</span><b>${esc(s.name)}</b></div>`;
  const bottom=o.prize?`<span class="prize-badge" style="background:${stamp};color:${lum(stamp)>.45?'#111':'#fff'}">${ic('gift',14)} Premio listo para retirar</span>`:`<div class="reward">Premio · ${esc(s.reward)}${(s.terms||'').trim()?'<span class="tcf">*Aplican condiciones</span>':''}</div>`;
  return `<div class="card f-${s.finish}${o.big?' big':''}" data-font="${s.font}" style="--a:${s.accent};--a2:${s.a2};--ink:${ink};--stamp:${stamp};--cf:${F.css.replace(/"/g,"'")};--cfw:${F.w};--cls:${s.font==='bebas'?'.05em':'0'}">
    <div class="card-glow"></div>${layer}<div class="card-shine"></div>
    <div class="card-top">${head}<div class="count">${stamps}<span>/${s.needed}</span></div></div>
    <div class="card-bottom"><div class="dots">${d}</div>${bottom}</div></div>`;
}
/* ---------- Effects ---------- */
function inkAt(host,target,color){
  if(RM||!target)return;const hr=host.getBoundingClientRect(),tr=target.getBoundingClientRect();
  const e=document.createElement('div');e.className='inkfx';e.style.setProperty('--c',color);
  e.style.left=(tr.left-hr.left+tr.width/2+host.scrollLeft)+'px';e.style.top=(tr.top-hr.top+tr.height/2+host.scrollTop)+'px';
  host.appendChild(e);setTimeout(()=>e.remove(),800);
}
function confetti(colors){
  if(RM)return;const c=document.createElement('canvas');c.className='fx';c.style.position='fixed';document.body.appendChild(c);
  const W=innerWidth,H=innerHeight;c.width=W*2;c.height=H*2;const x=c.getContext('2d');x.scale(2,2);
  const p=[];for(let i=0;i<120;i++)p.push({x:W/2+(Math.random()-.5)*60,y:H*.38,vx:(Math.random()-.5)*10,vy:-Math.random()*10-3,s:5+Math.random()*6,r:Math.random()*6,vr:(Math.random()-.5)*.35,c:colors[i%colors.length]});
  const t0=performance.now();
  (function f(t){x.clearRect(0,0,W,H);p.forEach(q=>{q.vy+=.3;q.vx*=.99;q.x+=q.vx;q.y+=q.vy;q.r+=q.vr;x.save();x.translate(q.x,q.y);x.rotate(q.r);x.fillStyle=q.c;x.fillRect(-q.s/2,-q.s/4,q.s,q.s/2);x.restore()});
    if(t-t0<2000)requestAnimationFrame(f);else c.remove()})(t0);
}
const retrig=(el,cls)=>{if(!el)return;el.classList.remove(cls);void el.offsetWidth;el.classList.add(cls)};
function rubberAt(host,target,s,card){
  if(RM||!target)return;const hr=host.getBoundingClientRect(),tr=target.getBoundingClientRect(),col=uiColor(s);
  const e=document.createElement('div');e.className='rubber';e.style.setProperty('--c',col);e.innerHTML=shapeSVG(s);
  e.style.left=(tr.left-hr.left+tr.width/2+host.scrollLeft)+'px';e.style.top=(tr.top-hr.top+tr.height/2+host.scrollTop)+'px';
  host.appendChild(e);setTimeout(()=>{retrig(card,'thud');inkAt(host,target,col)},300);setTimeout(()=>e.remove(),760);
}
function sparkAt(host,target,colors){
  if(RM||!target)return;const hr=host.getBoundingClientRect(),tr=target.getBoundingClientRect();
  for(let i=0;i<14;i++){const e=document.createElement('i');e.className='spark';const a=Math.PI*2*i/14+Math.random()*.4,d=34+Math.random()*40;
    e.style.setProperty('--c',colors[i%colors.length]);e.style.setProperty('--dx',Math.cos(a)*d+'px');e.style.setProperty('--dy',Math.sin(a)*d+'px');
    const z=6+Math.random()*8;e.style.width=e.style.height=z+'px';
    e.style.left=(tr.left-hr.left+tr.width/2+host.scrollLeft)+'px';e.style.top=(tr.top-hr.top+tr.height/2+host.scrollTop)+'px';host.appendChild(e);setTimeout(()=>e.remove(),950)}
}
function waveCard(card){if(!card||RM)return;card.querySelectorAll('.dots i').forEach((d,i)=>d.style.animationDelay=(i*55)+'ms');retrig(card,'waving');setTimeout(()=>card.classList.remove('waving'),1400)}
function rainAt(host,target,s){
  if(RM||!target)return;const hr=host.getBoundingClientRect(),tr=target.getBoundingClientRect(),col=uiColor(s);
  for(let i=0;i<9;i++)setTimeout(()=>{const e=document.createElement('div');e.className='raindrop';e.style.setProperty('--c',i%3?col:'#ffffff');
    e.style.setProperty('--h',(90+Math.random()*80)+'px');e.style.setProperty('--dx',((Math.random()-.5)*16)+'px');e.style.setProperty('--r',((Math.random()-.5)*120)+'deg');
    const z=12+Math.random()*10;e.style.width=e.style.height=z+'px';e.innerHTML=shapeSVG(s);
    e.style.left=(tr.left-hr.left+tr.width/2+(Math.random()-.5)*60+host.scrollLeft)+'px';e.style.top=(tr.top-hr.top+tr.height/2+host.scrollTop)+'px';host.appendChild(e);setTimeout(()=>e.remove(),850)},i*70);
  setTimeout(()=>inkAt(host,target,col),620);
}
function ringsAt(host,target,col){
  if(RM||!target)return;const hr=host.getBoundingClientRect(),tr=target.getBoundingClientRect();
  for(let i=0;i<3;i++)setTimeout(()=>{const e=document.createElement('div');e.className='shock';e.style.setProperty('--c',col);
    e.style.left=(tr.left-hr.left+tr.width/2+host.scrollLeft)+'px';e.style.top=(tr.top-hr.top+tr.height/2+host.scrollTop)+'px';host.appendChild(e);setTimeout(()=>e.remove(),900)},i*140);
}
function effect(s,host,target,card){
  const col=uiColor(s);
  if(s.anim==='foil'){retrig(card,'foiling');setTimeout(()=>sparkAt(host,target,['#f4e7c6','#d6bf8c','#ffffff']),350)}
  else if(s.anim==='rings'){ringsAt(host,target,col);inkAt(host,target,col)}
  else if(s.anim==='glow'){card.style.setProperty('--gl',col);retrig(card,'glowing');inkAt(host,target,col)}
  else if(s.anim==='flip'){retrig(card,'flipping');setTimeout(()=>inkAt(host,target,col),620)}
  else if(s.anim==='rain')rainAt(host,target,s);
  else if(s.anim==='stamp')rubberAt(host,target,s,card);
  else if(s.anim==='sparkle'){sparkAt(host,target,[col,'#ffffff',mix(col,'#ffffff',.5)]);inkAt(host,target,col)}
  else if(s.anim==='wave'){waveCard(card);inkAt(host,target,col)}
  else if(s.anim==='ink')inkAt(host,target,col);
  else if(s.anim==='confetti')confetti([col,'#ffffff',mix(col,'#ffffff',.5),s.a2,'#d8c6a3']);
  else if(s.anim==='bounce'){retrig(card,'bump');inkAt(host,target,col)}
  else{retrig(card,'shining');inkAt(host,target,'rgba(255,255,255,.55)')}
}
function paletteOf(d){const b={};for(let i=0;i<d.length;i+=4){if(d[i+3]<200)continue;const r=d[i],g=d[i+1],bl=d[i+2],mx=Math.max(r,g,bl),mn=Math.min(r,g,bl);
    const key=(r>>5)+'-'+(g>>5)+'-'+(bl>>5),w=(mx-mn)/255+.12;const k=b[key]||(b[key]={r:0,g:0,b:0,w:0});k.r+=r*w;k.g+=g*w;k.b+=bl*w;k.w+=w}
  const top=Object.values(b).sort((a,c)=>c.w-a.w).map(k=>rgb2hex(k.r/k.w,k.g/k.w,k.b/k.w));const out=[];
  top.forEach(h=>{if(out.length<4&&out.every(o=>{const A=hex2rgb(o),B=hex2rgb(h);return Math.abs(A[0]-B[0])+Math.abs(A[1]-B[1])+Math.abs(A[2]-B[2])>90}))out.push(h)});return out}
function processLogo(src){return new Promise(res=>{const img=new Image();img.onload=()=>{
  const MAX=1000,sc=Math.min(1,MAX/Math.max(img.width||MAX,img.height||MAX)),W=Math.max(1,Math.round((img.width||MAX)*sc)),H=Math.max(1,Math.round((img.height||MAX)*sc));
  const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d',{willReadFrequently:true});x.imageSmoothingQuality='high';x.drawImage(img,0,0,W,H);
  const im=x.getImageData(0,0,W,H),d=im.data,orig=new Uint8ClampedArray(d),border=[];
  for(let i=0;i<W;i++)border.push(i,(H-1)*W+i);for(let j=0;j<H;j++)border.push(j*W,j*W+W-1);
  // ¿Ya trae transparencia? (PNG sin fondo) -> no tocamos nada
  let tr=0;for(let i=3;i<d.length;i+=16)if(d[i]<250)tr++;const hasAlpha=tr>(d.length/16)*.01;
  let op=0,r=0,g=0,b=0;border.forEach(p=>{const i=p*4;if(d[i+3]>200){op++;r+=d[i];g+=d[i+1];b+=d[i+2]}});
  let removed=false,bgc=null;const tol=26,soft=34;
  if(!hasAlpha&&op>border.length*.9){r/=op;g/=op;b/=op;let sim=0;border.forEach(p=>{const i=p*4;if(Math.abs(d[i]-r)+Math.abs(d[i+1]-g)+Math.abs(d[i+2]-b)<30)sim++});
    if(sim>border.length*.85){removed=true;bgc=[r,g,b];const seen=new Uint8Array(W*H),st=[];
      border.forEach(p=>{if(!seen[p]){seen[p]=1;st.push(p)}});
      while(st.length){const p=st.pop(),i=p*4,dist=Math.abs(d[i]-r)+Math.abs(d[i+1]-g)+Math.abs(d[i+2]-b);
        if(dist>tol+soft)continue;if(dist>tol){d[i+3]=Math.min(d[i+3],Math.round((dist-tol)/soft*255));continue}
        d[i+3]=0;const px=p%W,py=(p/W)|0;
        if(px>0&&!seen[p-1]){seen[p-1]=1;st.push(p-1)}if(px<W-1&&!seen[p+1]){seen[p+1]=1;st.push(p+1)}
        if(py>0&&!seen[p-W]){seen[p-W]=1;st.push(p-W)}if(py<H-1&&!seen[p+W]){seen[p+W]=1;st.push(p+W)}}
      x.putImageData(im,0,0)}}
  const bbox=(arr,th)=>{let x0=W,y0=H,x1=-1,y1=-1;for(let y=0;y<H;y++)for(let xx=0;xx<W;xx++){if(arr[(y*W+xx)*4+3]>th){if(xx<x0)x0=xx;if(xx>x1)x1=xx;if(y<y0)y0=y;if(y>y1)y1=y}}return[x0,y0,x1,y1]};
  let [x0,y0,x1,y1]=bbox(d,24);
  if(x1<0){res(null);return}
  const pad=Math.round(Math.max(x1-x0,y1-y0)*.04),ow=x1-x0+1+pad*2,oh=y1-y0+1+pad*2;
  const crop=cv=>{const o=document.createElement('canvas');o.width=ow;o.height=oh;o.getContext('2d').drawImage(cv,x0-pad,y0-pad,ow,oh,0,0,ow,oh);return o.toDataURL('image/png')};
  // Versión de un color: conserva letras y detalles claros como huecos, no los rellena
  const K=bgc||[255,255,255],md=new Uint8ClampedArray(d);let opq=0,lite=0;
  for(let i=0;i<md.length;i+=4){if(md[i+3]>128){opq++;if(Math.abs(md[i]-K[0])+Math.abs(md[i+1]-K[1])+Math.abs(md[i+2]-K[2])<70)lite++}}
  const frac=opq?lite/opq:0;
  if(frac>.02&&frac<.7){for(let i=0;i<md.length;i+=4){const dist=Math.abs(md[i]-K[0])+Math.abs(md[i+1]-K[1])+Math.abs(md[i+2]-K[2]);if(dist<70)md[i+3]=Math.round(md[i+3]*Math.max(0,(dist-40)/30))}}
  const mc=document.createElement('canvas');mc.width=W;mc.height=H;mc.getContext('2d').putImageData(new ImageData(md,W,H),0,0);const mono=crop(mc);
  const png=crop(c);let raw=null;
  if(removed){const rc=document.createElement('canvas');rc.width=W;rc.height=H;rc.getContext('2d').putImageData(new ImageData(orig,W,H),0,0);const o=document.createElement('canvas');const [a0,b0,a1,b1]=[0,0,W-1,H-1];o.width=W;o.height=H;o.getContext('2d').drawImage(rc,0,0);raw=o.toDataURL('image/png')}
  let ls=0,lw=0,dk=0,lt=0;for(let i=0;i<d.length;i+=16){const al=d[i+3]/255;if(al>.5){const L=(.2126*d[i]+.7152*d[i+1]+.0722*d[i+2])/255;ls+=al*L;lw+=al;if(L<.22)dk++;if(L>.85)lt++}}const cnt=Math.max(1,lw);
  res({png,mono,raw,lum:lw?ls/lw:.5,darkFrac:dk/cnt,lightFrac:lt/cnt,ratio:ow/oh,rawRatio:W/H,removed,hadAlpha:hasAlpha,trimmed:(ow<W-4||oh<H-4),palette:paletteOf(d)})};
  img.onerror=()=>res(null);img.src=src})}
function recsFor(t){
  const P_=PERS[t.personality],pal=t.palette&&t.palette.length?t.palette:[t.accent,t.a2],c1=pal[0],c2=pal[1]||mix(c1,'#ffffff',.45);
  return P_.recs.map(r=>({...r,accent:c1,a2:c2,logoColor:(t.iso||t.wordm)?(DARK.includes(r.finish)?'original':'ink'):t.logoColor}));
}
function loadImg(src){return new Promise(r=>{const i=new Image();if(/^https?:/.test(src))i.crossOrigin='anonymous';i.onload=()=>r(i);i.onerror=()=>r(null);i.src=src})}
async function buildPattern(t){
  const src=t.iso||t.wordm,msrc=t.isoM||t.wordmM||src;if(!src){t.pat=null;return}
  const [io,im]=await Promise.all([loadImg(src),loadImg(msrc)]);if(!io)return;
  const ratio=io.width/io.height,lh=ratio>2.2?14:ratio>1.35?17:20,lw=lh*ratio;
  const W=Math.round(lw+Math.max(26,lw*.9)),H=Math.round(lh*3.1),S2=3;
  const draw=img=>{const c=document.createElement('canvas');c.width=W*S2;c.height=H*S2;const x=c.getContext('2d');x.scale(S2,S2);
    [[ (W/2-lw)/2, (H/2-lh)/2 ],[ (W/2-lw)/2+W/2, (H/2-lh)/2+H/2 ]].forEach(([px,py])=>x.drawImage(img,px,py,lw,lh));
    x.drawImage(img,(W/2-lw)/2+W/2-W,(H/2-lh)/2+H/2,lw,lh);return c.toDataURL('image/png')};
  t.pat={o:draw(io),m:draw(im||io),w:W,h:H};
}

const miniLogo=(s,sz=34)=>{const bg=DARK.includes(s.finish)?'#ede6d8':LIGHT.includes(s.finish)?'#1d1d22':s.accent;const fake={...s,logoColor:s.logoColor==='original'?'original':'ink'};
  return `<div class="mini" style="width:${sz}px;height:${sz}px;background:${bg};color:${DARK.includes(s.finish)?'#1f1b16':LIGHT.includes(s.finish)?uiColor(s):inkFor(s)}">${s.iso||s.wordm?markHTML(fake):initials(s.name)}</div>`};
export { FINISHES, FL, FGROUPS, LIGHT, DARK, SHAPES, ANIMS, LOGOMODES, LOGOCOLORS, FONTS, FONTMAP, PRESETS, PRESETS2, PERS, KIND, kindOf, TCIDEAS,
  lum, mix, inkFor, uiColor, stampFor, shapeSVG, markHTML, cardHTML, miniLogo, effect, processLogo, recsFor, buildPattern, fontOf, hasLogo };
