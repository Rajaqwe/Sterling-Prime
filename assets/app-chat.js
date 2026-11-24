(()=>{const q=s=>document.querySelector(s),rm=matchMedia('(prefers-reduced-motion:reduce)').matches,src=q('#cur img').src;
/* rotating word */
const r=q('#rot'),W=['brand','story','thanks','name','promise'];let wi=0;
if(r&&!rm)setInterval(()=>{r.classList.add('out');setTimeout(()=>{wi=(wi+1)%W.length;r.textContent=W[wi];r.classList.remove('out');r.classList.add('pre');void r.offsetWidth;r.classList.remove('pre')},450)},3000);
/* brand strip */
const bs=q('#bms');if(bs){const N={'portronics':'Portronics','boat':'boAt','borosil-larah':'Borosil / Larah','wonderchef':'Wonderchef','pebble':'Pebble','noise':'Noise','cross':'Cross','jbl-harman':'JBL / Harman','milton':'Milton','adidas':'Adidas','carlton-london':'Carlton London','prestige':'Prestige','lenovo':'Lenovo','philips':'Philips'},L=Object.keys(N),h=L.map(i=>`<span class="bm-item"><img src="assets/brand_logos/${i}.svg" alt="" loading="lazy" onerror="this.remove()"><span class="bm-name">${N[i]}</span></span>`).join('');bs.innerHTML=h+h}
/* occasion tiles: load dedicated sized trust photos with folder fallbacks + local file:// preview */
const ocImgs=[...document.querySelectorAll('#occasions .oc-i')];
ocImgs.forEach(im=>{
  const tile=im.closest('.oc-t'),slug=im.dataset.ocSlug||'',p=IH[+im.dataset.n-1];
  const candidates=[
    slug?'assets/occasions/'+slug+'.webp':'',
    slug?'assets/Occasions/'+slug+'.webp':'',
    slug?'assets/trust/'+slug+'.webp':'',
    slug?'assets/Trust/'+slug+'.webp':'',
    p?p.u:''
  ].filter(Boolean);
  let step=0;
  const ok=()=>{if(im.naturalWidth>0)tile&&tile.classList.add('has-photo')};
  const next=()=>{
    step++;
    if(step<candidates.length){im.src=candidates[step];return}
    tile&&tile.classList.remove('has-photo');
  };
  im.addEventListener('load',ok);
  im.addEventListener('error',next);
  if(im.complete){im.naturalWidth>0?ok():next()}
});
if(location.protocol==='file:'){
  const ocH=q('#occasions h2');
  if(ocH){
    const bar=document.createElement('span');bar.className='oc-preview-bar';
    const inp=document.createElement('input');inp.type='file';inp.accept='image/*';inp.multiple=true;inp.hidden=true;
    const btn=document.createElement('button');btn.type='button';btn.className='oc-preview-btn';btn.textContent='Preview occasion photos (pick up to 6)';
    const rst=document.createElement('button');rst.type='button';rst.className='oc-preview-btn';rst.textContent='Reset';rst.hidden=true;
    const defSrcs=ocImgs.map(im=>im.getAttribute('src'));const urls=[];
    btn.onclick=()=>inp.click();
    inp.onchange=()=>{
      const files=[...inp.files].slice(0,ocImgs.length);if(!files.length)return;
      files.forEach((f,idx)=>{const u=URL.createObjectURL(f);urls.push(u);ocImgs[idx].src=u});
      rst.hidden=false;inp.value='';
    };
    rst.onclick=()=>{
      urls.splice(0).forEach(u=>URL.revokeObjectURL(u));
      ocImgs.forEach((im,idx)=>{im.closest('.oc-t')?.classList.remove('has-photo');im.src=defSrcs[idx]});
      rst.hidden=true;
    };
    bar.append(btn,rst,inp);ocH.appendChild(bar);
  }
}
const oc=q('.oc-g');if(oc)oc.addEventListener('click',e=>{const t=e.target.closest('.oc-t');if(!t)return;const k=t.dataset.k.toLowerCase(),c=[...document.querySelectorAll('#chips .chip')].find(b=>b.textContent.toLowerCase().includes(k));
if(c)c.click();else{const i=q('#q');i.value=k;i.dispatchEvent(new Event('input'))}q('#catalogue').scrollIntoView({behavior:rm?'auto':'smooth'})});
/* journey: scroll-linked progress, butterfly flies down the line */
const w=q('#jnw');if(w){const li=[...w.querySelectorAll('.jn-s li')];q('#jnb').src=src;
const upd=()=>{const b=w.getBoundingClientRect(),p=Math.max(0,Math.min(1,(innerHeight*.58-b.top)/b.height));w.style.setProperty('--p',p.toFixed(4));const y=p*b.height;li.forEach(l=>l.classList.toggle('on',l.offsetTop+l.offsetHeight/2<=y+10))};
addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);upd()}
/* brief form -> WhatsApp */
const f=q('#bf');if(f)f.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(f),m=`Hi Sterling Prime, I would like a gifting plan.\nCompany: ${d.get('c')||'-'}\nOccasion: ${d.get('o')}\nQuantity: ${d.get('q')}\nBudget per gift: ${d.get('b')}`;window.open('https://wa.me/918758294908?text='+encodeURIComponent(m),'_blank','noopener')});
/* nav: mobile menu + scrollspy */
const nv=q('nav'),mb=q('#mb');if(mb){mb.onclick=()=>{const o=nv.classList.toggle('open');mb.setAttribute('aria-expanded',o)};nv.querySelectorAll('.nl a').forEach(a=>a.addEventListener('click',()=>{nv.classList.remove('open');mb.setAttribute('aria-expanded',false)}))}
if('IntersectionObserver'in window){const links=[...nv.querySelectorAll('.nl a.l')],map={};links.forEach(a=>map[a.getAttribute('href').slice(1)]=a);
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){links.forEach(a=>a.classList.remove('act'));map[e.target.id]&&map[e.target.id].classList.add('act')}}),{rootMargin:'-45% 0px -50% 0px'});
Object.keys(map).forEach(id=>{const el=document.getElementById(id);el&&io.observe(el)})}
})();

;
(function(){
var WA='918758294908',log=document.getElementById('log'),box=document.getElementById('box'),foot=document.getElementById('foot'),inp=document.getElementById('in'),err=document.getElementById('err');
var D={},cur=0,started=false,wait=function(ms){return new Promise(function(r){setTimeout(r,ms)})};
var QTY=['30 - 50','50 - 100','101 - 250','251 - 500','500+'];
var BUD=['Under Rs 100','Under Rs 250','Under Rs 500','Under Rs 1000','Under Rs 1500','Under Rs 2000','Under Rs 3000','Under Rs 5000'];
var email=function(v){return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)};
var phone=function(v){return v.replace(/\D/g,'').length>=10};
var S=[
{say:['Hi there! How are you doing?','Looking for trending corporate gift options within your budget? \uD83C\uDF81'],cta:"Yes, let's go"},
{say:['To shortlist the right ones, I need a few quick details \uD83D\uDE42','How many gifts are you planning to order?'],opts:QTY,key:'Quantity'},
{say:["What's your budget per gift?"],opts:BUD,key:'Budget per person'},
{say:['Which email should I send the options to?'],text:'Your email id',ok:email,bad:'Please enter a valid email address.',key:'Email'},
{say:['Could I have your phone number? (Promise, no spam \uD83D\uDE4F)'],text:'Type your answer...',ok:phone,bad:'Please enter a valid phone number.',key:'Phone'},
{say:['Thanks! Anything else to add about your requirement? E.g. gifting occasion, product preferences, delivery timeline.'],text:'Type your answer...',ok:function(){return true},key:'Notes'},
{say:["Thanks! I've noted everything. Tap below and we'll share your catalogue and curated options on WhatsApp."],end:true}
];
function down(){log.scrollTop=log.scrollHeight}
function row(cls,html){var r=document.createElement('div');r.className='row '+cls;r.innerHTML=html;log.appendChild(r);down();return r}
function me(t){var r=row('me','<div class="b"></div>');r.firstChild.textContent=t;down()}
async function say(lines){var b;for(var k=0;k<lines.length;k++){var r=row('',(k?'<div class="sp"></div>':'<div class="av"><img src="assets/chat/aanya-profile.jpg" alt="Aanya"></div>')+'<div class="b"><span class="dots"><span></span><span></span><span></span></span></div>');await wait(k?900:1300);b=r.lastChild;b.textContent=lines[k];down();if(k<lines.length-1)await wait(300)}return b}
async function run(n){
cur=n;var s=S[n],b=await say(s.say);
if(s.cta){var btn=document.createElement('button');btn.className='o';btn.textContent=s.cta;b.appendChild(btn);var nt=document.createElement('div');nt.className='note';nt.textContent='By clicking above you accept our Privacy Policy';b.appendChild(nt);down();btn.onclick=function(){btn.disabled=true;me(s.cta);run(n+1)}}
else if(s.opts){var w=document.createElement('div');w.className='opts';s.opts.forEach(function(o){var x=document.createElement('button');x.className='o';x.textContent=o;x.onclick=function(){w.remove();me(o);D[s.key]=o;run(n+1)};w.appendChild(x)});log.appendChild(w);down()}
else if(s.text){inp.placeholder=s.text;inp.value='';err.textContent='';foot.classList.add('on');down();setTimeout(down,60);setTimeout(down,400);inp.focus({preventScroll:true})}
else{var a=document.createElement('a');a.className='o';a.target='_blank';a.rel='noopener';a.textContent='Get catalogue on WhatsApp';var m="Hi Sterling Prime, I'd like corporate gift options.\n"+Object.keys(D).map(function(k){return k+': '+D[k]}).join('\n');a.href='https://wa.me/'+WA+'?text='+encodeURIComponent(m);b.appendChild(a);down()}
}
document.getElementById('f').onsubmit=function(e){e.preventDefault();var s=S[cur],v=inp.value.trim();
if(!s.ok(v)){err.textContent=s.bad;down();return}
foot.classList.remove('on');me(v||'Nothing more');D[s.key]=v||'Nothing more';run(cur+1)};
var tz=document.getElementById('tz'),tzGone=false,tzT;
function showTz(){if(!tzGone&&!box.classList.contains('open'))tz.classList.add('on')}
function open(){clearTimeout(tzT);tz.classList.remove('on');box.classList.add('open');document.getElementById('fab').style.display='none';if(!started){started=true;run(0)}}
function close(){box.classList.remove('open');document.getElementById('fab').style.display='flex';tzT=setTimeout(showTz,1200)}
tz.onclick=function(e){if(e.target.id==='tzx'){tzGone=true;tz.classList.remove('on');return}open()};
tz.onkeydown=function(e){if(e.key==='Enter')open()};
document.getElementById('fab').onclick=open;document.getElementById('x').onclick=close;
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&box.classList.contains('open'))close()});
tzT=setTimeout(showTz,1200);
})();

;
(()=>{
  const isLocal = location.protocol === 'file:';
  const getTrustCandidates = im => {
    if (im._trustCandidates) return im._trustCandidates;
    const raw = im.getAttribute('src') || '';
    const m = raw.match(/^(assets\/(?:trust|Trust)\/)([^/.]+)(\.[a-z0-9]+)$/i);
    if (!m) {
      im._trustCandidates = [];
      return im._trustCandidates;
    }
    const base = m[2], ext = m[3].toLowerCase();
    const bases = [base];
    if (base.includes('_')) bases.push(base.replace(/_/g, '-'));
    else if (base.includes('-')) bases.push(base.replace(/-/g, '_'));
    const exts = [ext, '.png', '.jpg', '.jpeg', '.webp'].filter((v, i, a) => a.indexOf(v) === i);
    const dirs = ['assets/trust/', 'assets/Trust/'];
    const list = [];
    for (const b of bases) {
      for (const e of exts) {
        for (const d of dirs) {
          const cand = d + b + e;
          if (cand !== raw && !list.includes(cand)) list.push(cand);
        }
      }
    }
    im._trustCandidates = list;
    return list;
  };
  const tryAltCase = im => {
    const list = getTrustCandidates(im);
    const idx = +(im.dataset.altIdx || 0);
    if (idx < list.length) {
      im.dataset.altIdx = String(idx + 1);
      im.src = list[idx];
      return true;
    }
    return false;
  };

  // Also add assets/Trust/ case-fallback to value-card photos
  document.querySelectorAll('#about .v .v-photo').forEach(im => {
    im.addEventListener('error', () => { tryAltCase(im); });
  });

  document.querySelectorAll('.trust-pic').forEach(fig => {
    const im = fig.querySelector('img');
    if (!im) return;
    const slot = fig.dataset.trustSlot || 'photo';
    const onOk = () => {
      if (im.naturalWidth > 0) {
        fig.classList.remove('is-missing', 'is-local');
        fig.querySelectorAll('.trust-local-hint,.trust-local-btn,input[type=file]').forEach(el => el.remove());
      }
    };
    const onFail = () => {
      if (tryAltCase(im)) return;
      fig.classList.add('is-missing');
      if (isLocal && !fig.querySelector('.trust-local-btn')) {
        fig.classList.add('is-local');
        const hint = document.createElement('span');
        hint.className = 'trust-local-hint';
        hint.textContent = 'Save as assets/trust/' + slot + '.png — or preview now:';
        const inp = document.createElement('input');
        inp.type = 'file';
        inp.accept = 'image/*';
        inp.hidden = true;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'trust-local-btn';
        btn.textContent = 'Choose photo';
        btn.onclick = e => { e.stopPropagation(); inp.click(); };
        fig.onclick = () => { if (fig.classList.contains('is-missing')) inp.click(); };
        inp.onchange = () => {
          const f = inp.files && inp.files[0];
          if (!f) return;
          im.src = URL.createObjectURL(f);
        };
        fig.append(hint, btn, inp);
      }
    };
    im.addEventListener('load', onOk);
    im.addEventListener('error', onFail);
    if (im.complete) { im.naturalWidth > 0 ? onOk() : onFail(); }
  });
})();
