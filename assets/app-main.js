/* Butterfly shortlist: add products, a butterfly flies to the tray, the list goes to WhatsApp as a quote request */
const SL_KEY='sp-shortlist-v1',SL_MAX=20,SL_WA='918758294908',slq=s=>document.querySelector(s),slEsc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),slRm=matchMedia('(prefers-reduced-motion:reduce)').matches;
let SL=[];try{SL=(JSON.parse(localStorage.getItem(SL_KEY)||'[]')||[]).filter(x=>x&&x.sku&&x.n)}catch(e){}
const slSave=()=>{try{localStorage.setItem(SL_KEY,JSON.stringify(SL))}catch(e){}};
function slHas(s){return SL.some(x=>x.sku===s)}
function slBtn(p){const on=slHas(p.sku);return `<button type="button" class="sl-add" data-sku="${slEsc(p.sku)}" aria-pressed="${on}" aria-label="${on?'Remove from':'Add to'} shortlist: ${slEsc(p.n)}" title="${on?'In shortlist':'Add to shortlist'}"><svg aria-hidden="true"><use href="#slBf"/></svg><span>${on?'In shortlist':'Add to shortlist'}</span></button>`}
function slSay(t){const l=slq('#slLive');l.textContent='';setTimeout(()=>l.textContent=t,30)}
function slMsg(){const co=slq('#slCo').value.trim(),oc=slq('#slOc').value,mk=n=>"Hi Sterling Prime, I'd like a quote for these shortlisted products:\n\n"+SL.map((x,i)=>`${i+1}. ${String(x.n).slice(0,n)} (SKU: ${x.sku})`).join('\n')+(co?'\n\nCompany: '+co:'')+(oc?(co?'\n':'\n\n')+'Occasion: '+oc:'')+'\n\nPlease share bulk pricing, customisation options and delivery timelines.';let m=mk(200);if(encodeURIComponent(m).length>3500)m=mk(48);return m}
function slPaint(){const n=SL.length;
document.querySelectorAll('.sl-add').forEach(b=>{const on=slHas(b.dataset.sku),nm=(b.closest('.card')&&b.closest('.card').querySelector('b')||{}).textContent||'';b.setAttribute('aria-pressed',on);b.title=on?'In shortlist':'Add to shortlist';b.setAttribute('aria-label',(on?'Remove from':'Add to')+' shortlist: '+nm);b.querySelector('span').textContent=on?'In shortlist':'Add to shortlist'});
const t=slq('#slTray');slq('#slCount').textContent=n;t.setAttribute('aria-label',`Open shortlist, ${n} ${n==1?'item':'items'}`);slq('#slN').textContent=n?`${n} ${n==1?'item':'items'}`:'';if(!n)t.classList.remove('show');
if(typeof curP!=='undefined'&&curP)slDlg(curP);slList()}
function slList(){const l=slq('#slList');
l.innerHTML=SL.length?SL.map(x=>`<div class="sl-it" data-s="${slEsc(x.sku)}"><img src="${slEsc(x.tu||x.u||'')}" alt="" onerror="this.style.visibility='hidden'"><div><b>${slEsc(x.n)}</b><small>${slEsc(x.sku)}${x.b?' · '+slEsc(x.b):''}</small></div><button class="sl-rm" type="button" aria-label="Remove ${slEsc(x.n)}">×</button></div>`).join(''):`<div class="sl-empty"><img src="${slq('#slIcon').src}" alt=""><p>Nothing here yet.<br>Tap "Add to shortlist" on any product.</p></div>`;slUpd()}
function slUpd(){const m=slMsg(),a=slq('#slSend');slq('#slMsg').textContent=SL.length?m:'Add products to see your message.';a.href=SL.length?`https://wa.me/${SL_WA}?text=${encodeURIComponent(m)}`:'#';a.setAttribute('aria-disabled',!SL.length)}
function slDlg(p){const b=slq('#slPop');if(!b||!p)return;const on=slHas(p.sku);b.setAttribute('aria-pressed',on);const lbl=b.querySelector('.sl-pop-lbl');if(lbl)lbl.textContent=on?'Saved ✓':'Shortlist';else b.textContent=on?'Saved ✓':'Shortlist';b.title=on?'In shortlist (tap to remove)':'Add to shortlist';b.setAttribute('aria-label',on?'Remove from shortlist':'Add to shortlist')}
const slCol=['#6a3a94','#b14a98','#ef4b3a','#eed232','#ff9a1f'];
function slSpark(host,x,y,burst){const d=document.createElement('i');d.className='sl-dot';d.style.cssText=`left:${x}px;top:${y}px;background:${slCol[Math.random()*5|0]};--dx:${(Math.random()-.5)*(burst?90:30)}px;--dy:${burst?(Math.random()-.8)*70:10+Math.random()*30}px`;host.appendChild(d);d.onanimationend=()=>d.remove()}
function slBump(host){const t=slq('#slTray');t.classList.remove('bump');void t.offsetWidth;t.classList.add('bump');for(let i=0;i<8;i++)slSpark(host,innerWidth/2,innerHeight-50,1)}
function slFly(from,done){const tr=slq('#slTray'),host=(typeof dlg!=='undefined'&&dlg.open)?dlg:document.body;if(slRm||!from){done(host);return}
const go=()=>{const a=from.getBoundingClientRect(),b=slq('#slIcon').getBoundingClientRect(),sx=a.left+a.width/2,sy=a.top+a.height/2,ex=b.left+b.width/2,ey=b.top+b.height/2,cx=(sx+ex)/2+(Math.random()-.5)*260,cy=Math.min(sy,ey)-130-Math.random()*90,el=new Image();el.src=slq('#slIcon').src;el.className='sl-fly';host.appendChild(el);
const dur=1100,t0=performance.now();let px=sx,py=sy,ls=0;
(function f(now){const k=Math.min(1,(now-t0)/dur),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2,x=(1-e)*(1-e)*sx+2*(1-e)*e*cx+e*e*ex,y=(1-e)*(1-e)*sy+2*(1-e)*e*cy+e*e*ey,wob=Math.sin(k*16)*14*(1-k),ang=Math.atan2(y-py,x-px)*180/Math.PI+90,sc=1.15-.65*e,fl=1-.6*Math.abs(Math.sin(now/52));
if(k>.02)el.style.transform=`translate(${x+wob-23}px,${y-16}px) rotate(${ang}deg) scale(${sc*fl},${sc})`;px=x;py=y;if(now-ls>38){slSpark(host,x+wob,y,0);ls=now}
if(k<1)requestAnimationFrame(f);else{el.remove();done(host)}})(t0)};
if(!tr.classList.contains('show')){tr.classList.add('show');setTimeout(go,320)}else go()}
function slToggle(btn,p){if(!p)return;const i=SL.findIndex(x=>x.sku===p.sku);
if(i>-1){SL.splice(i,1);slSave();slPaint();slSay(p.n+' removed from shortlist');return}
if(SL.length>=SL_MAX){slSay('Shortlist is full. Send this one first, then start another.');return}
SL.push({sku:p.sku,n:p.n,u:p.u||'',tu:p.tu||'',b:(p.b&&String(p.b).toLowerCase()!=='null')?p.b:'',qty:50});slSave();slPaint();slSay(p.n+' added to shortlist');
slq('#slCount').textContent=SL.length-1;slFly(btn,host=>{slq('#slCount').textContent=SL.length;slq('#slTray').classList.add('show');slBump(host)})}
let slLast=null;const slDr=slq('#slDrawer'),slSh=slq('#slShade');
function slOpen(){slLast=document.activeElement;slList();slDr.inert=false;slDr.classList.add('open');slSh.classList.add('open');document.documentElement.classList.add('sl-lock');slq('#slX').focus()}
function slClose(){slDr.classList.remove('open');slSh.classList.remove('open');slDr.inert=true;document.documentElement.classList.remove('sl-lock');slLast&&slLast.focus&&slLast.focus()}
slq('#slIcon').src=document.querySelector('#cur img').src;
slq('#slTray').onclick=slOpen;slq('#slX').onclick=slClose;slSh.onclick=slClose;
addEventListener('keydown',e=>{if(e.key==='Escape'&&slDr.classList.contains('open'))slClose()});
slq('#slList').addEventListener('click',e=>{const it=e.target.closest('.sl-it');if(!it)return;const x=SL.find(y=>y.sku===it.dataset.s);if(!x)return;
if(e.target.closest('.sl-rm')){SL=SL.filter(y=>y!==x);slSave();slPaint();slSay('Removed');return}
const d=e.target.closest('[data-d]');if(d){x.qty=Math.max(1,Math.min(99999,x.qty+(+d.dataset.d)*(x.qty>=100?50:10)));it.querySelector('input').value=x.qty;slSave();slUpd()}});
slq('#slList').addEventListener('input',e=>{if(e.target.tagName!=='INPUT')return;const it=e.target.closest('.sl-it'),x=SL.find(y=>y.sku===it.dataset.s);if(!x)return;x.qty=Math.max(1,Math.min(99999,parseInt(e.target.value)||1));slSave();slUpd()});
['#slCo','#slOc'].forEach(s=>slq(s).addEventListener('input',slUpd));
slq('#slClear').onclick=()=>{SL=[];slSave();slPaint();slSay('Shortlist cleared')};
slq('#slCopy').onclick=async()=>{const m=slMsg(),b=slq('#slCopy');try{await navigator.clipboard.writeText(m)}catch(e){const t=document.createElement('textarea');t.value=m;document.body.appendChild(t);t.select();try{document.execCommand('copy')}catch(_){}t.remove()}b.textContent='Copied ✓';setTimeout(()=>b.textContent='Copy message',1600)};
slq('#slPop').onclick=()=>{if(typeof curP!=='undefined')slToggle(slq('#slPop'),curP)};
slPaint();if(SL.length)slq('#slTray').classList.add('show');

;
const RAW=`BLUE DESK ORGAIZER.jpeg|Blue Desk Organizer|D
BOTTLE PEN HOLDER.JPEG|Premium Bottle Pen Holder|D
CALCULATOR.jpeg|Executive Precision Calculator|D
COASTER SET.JPEG|Premium Artisan Coaster Set|D
COASTER SET (2).jpeg|Premium Coaster Set|D
DESK KIT.JPEG|Executive Precision Desk Kit|D
DESK MAT.jpeg|Professional Shortcut Desk Mat|D
DESK ORGANISER.JPEG|Premium Wooden Desk Organizer with Phone Slot|D
DESK ORGANISER.PNG|Knitted Butterfly Desk Organiser|D
DESK ORGANIZER.JPEG|Elite Desk Station|D
DESK ORGANIZER (2).jpeg|Premium Green Desk Organizer|D
DESK ORGANIZER (3).jpeg|Premium Red Wooden Desk Organizer|D
DESK ORGANIZER (4).jpeg|Premium Desk Organizer with Sign|D
DESK WHITEBOARD.JPEG|Mini Desk Whiteboard|D
GREEN MOBILE STAND.JPEG|Premium Green Phone Stand|D
MOBILE STAND.JPEG|Premium Wooden Phone Display Stand|D
MOBILE STAND.PNG|Premium Mobile Stand with Pen Slot|D
MOBILE STAND (2).JPEG|Phone Display Stand|D
PAPER WEIGHT.JPEG|Artisan Glass Paperweight|D
PHOTO FRAME.jpeg|Executive Commemorative Frame|D
PHOTO FRAME (2).jpeg|Custom Corporate Certificate|D
STAND & STAPLERS.jpeg|Mini Staplers Set|P
BALL PENS.jpeg|Ultimate Color-Pen Set|P
LEATHER PEN SET.jpeg|Vibrant Leather Pen Suite|P
PEN.jpeg|Teal Series Executive Pen|P
PEN (2).jpeg|Executive Medical Gift Set|P
PENS.jpeg|Quad-Color Executive Pen Set|P
PENS (2).jpeg|Executive Ten-Pen Suite|P
PREMIUM PEN.jpeg|Premium Pen Set with Case|P
PROMOTIONAL PENS.jpeg|Premium Medical Promotional Packet|P
PEN HOLDER.jpeg|Anatomical Precision Kidney Model|H
PEN HOLDER (2).jpeg|Premium Ornate Metal Quill Pen|P
PEN HOLDER (3).jpeg|Blue Elephant Plush Pen Holder|F
PEN STAND.JPEG|Walnut Executive Desk Collection|D
PEN STAND (2).JPEG|Premium Legal Gifting Pen Stand|D
PEN STAND (3).JPEG|Remote Control Pen Stand|D
PEN STAND (4).JPEG|Golden Heart Pen Stand|D
PEN STAND (5).jpeg|Stationery Desk Organizer|D
PEN STAND (6).jpeg|Custom Wooden Sign|D
PEN STAND (7).jpeg|Matte Black Pen Stand|D
PEN STAND (8).jpeg|Plush Product Container|F
PEN STAND (9).jpeg|Artisan Fabric Growth Tree|F
PEN STAND HEART.jpeg|Heart Sculpture Pen Stand|D
ACRYLIC PEN STAND.JPEG|Crystal Executive Desk Stand|D
CLIPBOARD.jpeg|Premium Clipboard with Medical Chart|H
FILES ORGANIZER.JPEG|Executive Modern Organizer|D
LOG DIARY.jpeg|Care & Comfort Journal Set|K
LOG DIARY (2).jpeg|Teal Executive Journal|P
LOG DIARY (3).jpeg|Classic Leather Executive Diary|P
PLANNER.jpeg|Executive Geometric Planner|P
ESSENTIAL DESK ORGANISER KIT.JPEG|Essential Desk Organizer Kit|K
EXECUTIVE STATIONARY KIT.JPEG|Crystal Clear Executive Kit|K
OFFICE CORRECTION WRITING KIT.JPEG|Executive Writing Set|K
OFFICE KIT.JPEG|Executive Stationery Presentation Set|K
OFFICE PEN MARKER KIT.JPEG|Office Highlighter Kit|K
OFFICE UTILITY KIT.JPEG|Executive Office Utility Set|K
ORAGANIZE DESK SET.PNG|Executive Desk Organize Gift Set|K
STATIONARY GIFT SET.jpeg|Stationery Gift Set|K
STATIONARY GIFT SET (2).jpeg|Premium Stationery Set|K
STATIONARY KIT.JPEG|Ultimate Corporate Stationery Set|K
STATIONARY KIT (2).JPEG|Professional Stationery Case|K
STATIONARY KIT (3).JPEG|Blue Series Stationery Pouch|K
STATIONARY KIT (4).JPEG|Executive Stationery Kit|K
STATIONARY KIT (5).JPEG|Prime Stationery Suite|K
CHARACTER GIFT SET.jpeg|Executive Character Gift Set|K
ESSENTIAL KIT.JPEG|Blue Essentials Desk Kit|K
GIFT SET.JPEG|Executive Pharma Gift Set|K
GIFT SET (2).JPEG|Golden Compliments Gift Set|K
GIFT SET (3).jpeg|Leather Essentials Duo|K
GIFT SET (4).jpeg|Executive Wellness & Utility Set|K
GIFT SET (5).jpeg|Premium Notebook and Pens Set|K
GIFT SET (6).jpeg|Premium Leather Gift Suite|K
GIFT SET (7).jpeg|Executive Signature Gift Set|K
UTILITY SET.jpeg|Ultimate Pharma Utility Set|K
UTILITY & CARE KIT.JPEG|Professional Utility & Care Set|K
BACK PACK.jpeg|Executive Urban Backpack|B
TRAVEL BACKPACK.jpeg|Executive Travel Backpack|B
FOLDER BAG.jpeg|Executive Geometric Folder Bag|B
LEATHER BAG.jpeg|Premium Leather Document Bag|B
LEATHER POUCH.JPEG|Executive Leather Pouch|B
LEATHER POUCH (2).jpeg|Premium Leather Pencil Case|B
LEATHER POUCH (3).jpeg|Premium Leather Cosmetic Pouch|B
POUCH BAG.jpeg|Premium Crocodile Embossed Pouch|B
BRANDABLE COSMETIC POUCH.jpeg|Blue Cosmetic Pouch|B
CUSTOM BRANDED POUCH.JPEG|Designer Fabric Pouch|B
PREMIUM PATTERNED CASE.JPEG|Premium Patterned Case|B
DOCTOR CASE.JPEG|Executive Care Case|B
ZIPPER TRAVEL KIT.JPEG|Executive Zipper Travel Set|B
DESK CALENDER.jpeg|Premium Wooden Perpetual Desk Calendar|D
DESK CLOCK.JPEG|Executive Desk Clock Plaque|C
DESK CLOCK.PNG|Premium Desk Clock|C
DESK CLOCK (2).jpeg|Premium Silver Desk Clock Set|C
DESK CLOCK (3).jpeg|Executive Medical Desk Clock|C
DESK CLOCK & PEN HOLDER.jpeg|Premium Wooden Desk Suite|C
DESK CLOCK MODEL.jpeg|Premium Desk Clock & Stand|C
DYNAMIC DESK CLOCK.JPEG|Dynamic Dual-Time Desk Clock|C
WALL CLOCKS.jpeg|Artisan Specialty Wall Clocks|C
WOODEN BASE ACRYLIC STAND.JPEG|Wellness Initiative Display|S
WOODEN CLOCK.JPEG|Executive Wooden Clock|C
WOODEN DESK CLOCK.jpeg|Premium Wooden Desk Clock with Pen Holder|C
WOODEN DESK ORGANIZER.JPEG|Premium Wooden Desk Organizer|D
WOODEN DESK ORGANIZER (2).JPEG|Maroon Wood Desk Organizer|D
WOODEN DESK ORGANIZER (3).JPEG|Premium Wooden Pen Rack Organizer|D
WOODEN DESK ORGANIZER (4).jpeg|Wooden Organizer with Phone Slot|D
WOODEN DESK ORGANIZER (5).jpeg|Artisan Wooden Desk Organizer|D
WOODEN FRAME.jpeg|Artisan Wooden Photo Frame|D
WOODEN MATERNITY CLOCK.JPEG|Premium Maternity Clock|C
WOODEN PEN + MOBILE STAND.JPEG|Wooden Desk Organizer with Phone Stand|D
WOODEN PEN STAND.jpeg|Premium Wooden Pen Holder|D
WOODEN PEN STAND (2).JPEG|Premium Wooden Desk Organizer (Glufomin)|D
WOODEN PEN STAND (6).JPEG|Wooden Desk Organizer with Sticky Notes|D
WOODEN TISSUE BOX.JPEG|Luxury Wooden Tissue Dispenser|D
ACRYLC STAND.JPEG|Elite Highlighter Set|P
ACRYLIC STAND.JPEG|Modern Acrylic QR Stand|S
ACRYLIC STAND (2).JPEG|Wellness Initiative Acrylic Display|S
ACRYLIC STAND (3).JPEG|Sterling Acrylic Information Stand|S
ACRYLIC DISPLAY STAND.JPEG|Custom Acrylic Display Stand|S
DISPLAY MODEL.jpeg|Pill-Size Comparison Display|S
DISPLAY STAND.JPEG|Premium Digital Display Stand|S
LETTER DISPLAY.JPEG|Large Pink Letter G Display|S
PROMOTIONAL DISPLAY.jpeg|Premium Promotional Display Object|S
PROMOTIONAL MODEL.jpeg|Premium Transparent Bottle|S
SHOWCASE MODEL.jpeg|Medical Products Platform Display|S
SPINNER STAND.jpeg|Fidget Spinner on Stand|F
ANATOMICAL CLOCK.JPEG|Human Body Anatomical Clock|H
CARDIAC CARE DISPLAY.jpeg|Executive Cardiac Care Display|H
DUMMY MARKETING BOTTLE.PNG|Branded Gifts Bottle Display|S
EMBRYONIC DEVELOPMENT BOARD.JPEG|Embryonic Development Board|H
EMBRYONIC DEVELOPMENT BOARD (2).JPEG|Embryonic Development Board Premium|H
HEALTHCARE DISPLAY.JPEG|Advanced Healthcare Educational Display|H
KIDS HEIGHT CHART.PNG|Kids Height Chart|H
KNEE MODEL.JPEG|Knee Joint Model Plaque|H
MEDICAL CLIPBOARD.JPEG|Premium Medical Clipboard|H
MEDICAL CLIPBOARD (2).JPEG|Premium Medical Clipboard Display|H
MEDICAL DISPLAY.JPEG|Elite Medical Display|H
MEDICAL DISPLAY BOX.JPEG|Elite Medical Display Box|H
MEDICAL ICON DISPLAY.JPEG|Executive Medical Icon Display|H
MEDICAL PRESENTATION BOX.JPEG|Premium Medical Presentation Box|H
MEDICINE TIMER CLOCK (2).JPEG|Premium Medicine Timer Clock|H
OSTEOPOROSIS EDUCATION MODEL.JPEG|Premium Osteoporosis Educational Model|H
OSTEOPOROSIS EDUCATIONAL MODEL.JPEG|Osteoporosis Educational Model Stand|H
OSTEOPOROSIS EDUCATIONAL MODEL (2).JPEG|Osteoporosis Educational Model|H
PREGNANCY DESK CALENDER.JPEG|Pregnancy Desk Calendar|H
PREGNANCY TRACKER WHEEL (2).JPEG|Pregnancy Calculator Wheel|H
STOMACH MODEL.JPEG|Premium Stomach Model|H
BACK SUPPORT PILLOW.PNG|Ergonomic Back Support Pillow|H
CARE & CONFORT KIT.JPEG|Care & Comfort Utility Set|K
HEALTH GIFT KIT.JPEG|Executive Healthcare Gift Collection|K
HEALTH KIT.JPEG|Healthcare Professional Essentials|K
MAGNETC FIDGET DICE.PNG|Magnetic Fidget Dice|F
PLUSH SUITE.jpeg|Premium Elephant Plush Suite|F
PLUSH TOY.jpeg|Premium Plush Toy|F
PLUSH TOY (2).jpeg|Sweet Treat Plush Toy|F
WELL NESS KIT.JPEG|Vitality Wellness & Relaxation Kit|K
WELLNESS DISPLAY STAND.JPEG|Elite Wellness Display Stand|S
WELLNESS JOURNEY KIT.JPEG|Wellness Journey Kit|K
WOMENS DAY FLOWER.JPEG|Women’s Day Rose Keepsake|F
ACRYLIC QR KEYCHAINS.JPEG|Premium QR Keychains|F
CUSTOMISED BRAND SCISSOR.PNG|Premium Office Scissors Orange|P
CUSTOMISED BRAND SCISSOR (2).PNG|Premium Office Scissors Red|P
FABRIC KEYCHAINS.jpeg|Premium Fabric Keychains|F
PENDRIVE.jpeg|Premium USB Drive in Tin|T
SANDWITCH KEYCHAINS.jpeg|Premium Custom Keychains|F
SENSOR LED WTH BRANDING.JPEG|Illuminated Executive Hub|T
TOUCH LAMP SPEAKER.jpeg|Executive Touch Lamp Speaker|T
DEVICE CONTAINER.JPEG|Premium Medical Device Container|H
GIFTING BOX.JPEG|Luxury Presentation Gift Box|K
PRODUCT BOX.JPEG|Premium Medical Product Box|H
TISSUE BOX.jpeg|Premium Orange Tissue Box|D
TISSUE BOX & ORGANIZER.jpeg|Premium Tissue Box with Organizer|D
TISSUE DISPENSER.jpeg|Premium Tissue Dispenser|D`;
const CN={D:'Desk & Wood',P:'Pens & Writing',K:'Kits & Gift Sets',B:'Bags & Pouches',C:'Clocks',S:'Display & Acrylic',H:'Healthcare',F:'Plush & Keychains',T:'Tech & Light'};
const FULL={D:'Desk Organizers & Stands',P:'Pens & Luxury Writing',K:'Executive Combo Gift Sets',B:'Backpacks, Luggage & Travel Bags',C:'Clocks, Watches & Timepieces',S:'Desk Organizers & Stands',H:'Healthcare & Medical Communication',F:'Plush, Keychains & Fun Gifts',T:'Smart Tech & Computer Accessories'},cf=(c,i)=>i>=48&&i<=50?'Diaries, Notebooks & Planners':i>=80&&i<=88?'Wallets, Cardholders & Pouches':FULL[c];
const JUNK_DESC=new Set(['null','undefined','n/a','na','-','none']);
const buildNormMap=obj=>{const m=Object.create(null);if(obj&&typeof obj==='object'){for(const[k,v]of Object.entries(obj))m[String(k).trim().toLowerCase()]=v}return m};
let _descIdRef=null,_descSkuRef=null,_descIdMap=Object.create(null),_descSkuMap=Object.create(null);
function getDescMaps(){
  if(window.PRODUCT_DESCRIPTIONS_BY_ID!==_descIdRef){_descIdRef=window.PRODUCT_DESCRIPTIONS_BY_ID;_descIdMap=buildNormMap(_descIdRef)}
  if(window.PRODUCT_DESCRIPTIONS_BY_SKU!==_descSkuRef){_descSkuRef=window.PRODUCT_DESCRIPTIONS_BY_SKU;_descSkuMap=buildNormMap(_descSkuRef)}
  return{_descIdMap,_descSkuMap};
}
function cleanDescValue(val){
  if(!val)return '';
  if(Array.isArray(val))return val.map(x=>String(x||'').trim()).filter(x=>x&&!JUNK_DESC.has(x.toLowerCase()));
  if(typeof val==='object'){
    const parts=[];
    if(val.summary||val.description)parts.push(String(val.summary||val.description).trim());
    if(Array.isArray(val.bullets||val.features))parts.push(...(val.bullets||val.features));
    if(val.specs&&typeof val.specs==='object'){for(const[k,v]of Object.entries(val.specs))if(v)parts.push(k+': '+v)}
    return cleanDescValue(parts);
  }
  const s=String(val).replace(/\r\n/g,'\n').trim();
  return JUNK_DESC.has(s.toLowerCase())?'':s;
}
function resolveDesc(id,sku,model,d){
  const{_descIdMap:idM,_descSkuMap:skuM}=getDescMaps();
  const idK=id?String(id).trim().toLowerCase():'';
  if(idK&&idM[idK]){const c=cleanDescValue(idM[idK]);if(c&&(!Array.isArray(c)||c.length))return c}
  for(const raw of[sku,model]){
    const k=raw?String(raw).trim().toLowerCase():'';
    if(k&&skuM[k]){const c=cleanDescValue(skuM[k]);if(c&&(!Array.isArray(c)||c.length))return c}
  }
  if(d){
    for(const f of['description','short_description','shortDescription','product_description','productDescription','details','summary','desc','features','specs','specifications']){
      const c=cleanDescValue(d[f]);if(c&&(!Array.isArray(c)||c.length))return c;
    }
  }
  return '';
}
const descToText=desc=>Array.isArray(desc)?desc.join(' '):String(desc||'');
const makeSearchText=p=>(p.n+' '+p.sku+' '+(p.b||'')+' '+(p.c||'')+' '+descToText(p.description)).toLowerCase();
const IH=RAW.split('\n').map((l,i)=>{const[f,n,c]=l.split('|'),id='inhouse_'+String(i+1).padStart(4,'0'),sku='SP-IH-'+String(i+1).padStart(3,'0'),item={id,u:'raw images/'+encodeURIComponent(f),n,c:cf(c,i+1),b:'Sterling Prime In-House',description:resolveDesc(id,sku,sku,null),pr:'',ih:1,sku};item._s=makeSearchText(item);return item});
const BR=[['sterling-prime','Sterling Prime',['Sterling Prime In-House']],['portronics','Portronics',['Portronics']],['borosil-larah','Borosil / Larah',['Borosil']],['wonderchef','Wonderchef',['Wonderchef']],['pebble','Pebble',['Pebble']],['noise','Noise',['Noise']],['cross','Cross',['Cross']],['jbl-harman','JBL / Harman',['JBL']],['boat','boAt',['boAt']],['milton','Milton',['Milton']],['adidas','Adidas',['Adidas']],['carlton-london','Carlton London',['Carlton London']],['prestige','Prestige',['Prestige']],['lenovo','Lenovo',['Lenovo']],['philips','Philips',['Philips']]];
const $=s=>document.querySelector(s),grid=$('#grid'),dlg=$('#dlg'),esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])),fmt=n=>n.toLocaleString('en-IN');
const INITIAL_PRODUCTS=100,PRODUCTS_PER_CLICK=24;
let P=IH,Lc=P,CATS=[],cat='',br='',qs='',shown=INITIAL_PRODUCTS,drawn=0,curP=null;
const REMOVED_PRODUCT_IMAGE_NAMES = new Set(["raw_m1_02102_noise_noise_s06_03.jpg","raw_m1_02103_noise_noise_s06_04.jpg","raw_m1_02104_noise_noise_s06_05.jpg","raw_m1_02105_noise_noise_s06_06.jpg","raw_m1_02107_noise_noise_s08_01.jpg","raw_m1_02108_noise_noise_s08_02.jpg","raw_m1_02109_noise_noise_s08_03.jpg","raw_m1_02110_noise_noise_s08_04.jpg","raw_m1_02111_noise_noise_s08_05.jpg","raw_m1_02112_noise_noise_s08_06.jpg","raw_m1_02605_gift_desk_gift_d_p65_01.jpg","raw_m1_03133_gift_desk_2099.jpg","raw_m1_03153_gift_desk_1299.jpg","raw_m1_03155_gift_desk_2899.jpg","raw_m1_03193_gift_desk_1250.jpg","raw_m1_03194_gift_desk_2999.jpg","raw_m1_03195_gift_desk_er.jpg","raw_m1_03198_gift_desk_gift_d_p62_01.jpg","raw_m1_03199_gift_desk_gift_d_p63_01.jpg","raw_m1_03203_gift_desk_gift_d_p67_01.jpg","raw_m1_03204_gift_desk_gift_d_p68_01.jpg","raw_m1_03209_gift_desk_gift_d_p73_01.jpg","raw_m1_03212_gift_desk_ths_47.jpg","raw_m1_03213_gift_desk_ths_49.jpg","raw_m1_03214_gift_desk_ths_53.jpg","raw_m1_03232_gift_desk_ths_73.jpg","raw_m1_03233_gift_desk_ths_81.jpg","raw_m1_03234_gift_desk_gift_d_p87_01.jpg","raw_m1_03265_gift_desk_gift_d_p95_01.jpg","raw_m1_03369_gift_desk_122.jpg","raw_m1_03809_gift_desk_7001.jpg","raw_m1_04566_gift_desk_9028_6.jpg","raw_m1_04607_gift_desk_m2.jpg","raw_m1_04609_gift_desk_m3.jpg","raw_m1_05514_gift_desk_gift_d_p09_09.jpg","raw_m1_05962_noise_borosi_p20_05.jpg","raw_m1_06024_borosil_borosi_p38_01.jpg","raw_m1_06417_gift_desk_c28.jpg","raw_m1_06516_carlton_london_2390.jpg","raw_m1_06742_gift_desk_j5333.jpg","raw_m1_07496_gift_desk_og55.jpg","raw_m1_09441_gift_desk_71.jpg","raw_m1_09443_gift_desk_68.jpg","raw_m1_11326_gift_desk_cd_110.jpg","raw_m1_11331_gift_desk_142.jpg","raw_m1_11344_gift_desk_235.jpg","raw_m1_11683_lapcare_llp_024.jpg","raw_m1_11684_lapcare_llp_015.jpg","raw_m1_11685_lapcare_llp_012.jpg","raw_m1_11686_lapcare_llp_009.jpg","raw_m1_11690_lapcare_lbs_201.jpg","raw_m1_11691_lapcare_lbs_222.jpg","raw_m1_11692_lapcare_lbs_300.jpg","raw_m1_11693_lapcare_lbs_444.jpg","raw_m1_11695_lapcare_lbs_306.jpg","raw_m1_11699_lapcare_lbs_615.jpg","raw_m1_11700_lapcare_lts_705.jpg","raw_m1_11701_lapcare_axm_034.jpg","raw_m1_11703_lapcare_lox_163.jpg","raw_m1_11704_lapcare_lts_603.jpg","raw_m1_11705_lapcare_lts_300.jpg","raw_m1_11706_lapcare_lox_210.jpg","raw_m1_11707_lapcare_axm_024.jpg","raw_m1_12315_jbl_2200.jpg","raw_m1_12546_gift_desk_2206.jpg","raw_m1_13793_gift_desk_gift_d_p70_03.jpg","raw_m1_13794_gift_desk_gift_d_p70_04.jpg","raw_m1_13799_gift_desk_gift_d_p71_05.jpg","raw_m1_14330_gift_desk_297.jpg","raw_m1_14332_boat_305.jpg","raw_m1_14344_gift_desk_349.jpg","raw_m1_14348_gift_desk_363.jpg","raw_m1_14353_jbl_380.jpg","raw_m1_14933_gift_desk_772.jpg","raw_m1_14967_gift_desk_d01.jpg","raw_m1_18625_amazon_gift_d_p18_01.jpg","raw_m1_18626_amazon_re1048.jpg","raw_m1_19872_gift_desk_dw431.jpg","raw_m1_19873_gift_desk_dw410.jpg","raw_m1_19877_gift_desk_276.jpg","raw_m1_19883_gift_desk_419.jpg","raw_m1_19885_gift_desk_ners.jpg","raw_m1_19897_gift_desk_ika.jpg","raw_m1_19911_gift_desk_dh_58.jpg","raw_m1_19912_gift_desk_dh_59.jpg","raw_m1_19913_gift_desk_ds_08.jpg","raw_m1_19920_gift_desk_9297.jpg","raw_m1_19927_gift_desk_gift.jpg","raw_m1_19931_gift_desk_890.jpg","raw_m1_19935_gift_desk_dh_82.jpg","raw_m1_19943_gift_desk_dh_106.jpg","raw_m1_19945_gift_desk_dh_107.jpg","raw_m1_19948_gift_desk_dh_112.jpg","raw_m1_19949_gift_desk_dh_127.jpg","raw_m1_19951_gift_desk_dh_128.jpg","raw_m1_20009_gift_desk_980.jpg","raw_m1_24556_gift_desk_jwc_27.jpg","raw_m1_24604_jbl_gift_d_p33_01.jpg","raw_m1_24608_gift_desk_ab_69.jpg","raw_m1_24615_gift_desk_ams_76.jpg","raw_m1_24616_gift_desk_ams_78.jpg","raw_m1_28268_gift_desk_gift_13.jpg","raw_m1_29092_idea_corporate_gifts_899.jpg","raw_m1_29155_amazon_5499.jpg","raw_m1_30152_idea_corporate_gifts_idea_c_p55_02.jpg","raw_m1_32138_idea_corporate_gifts_st04.png","raw_m1_33248_idea_corporate_gifts_idea_c_p107_02.jpg","raw_m1_33251_idea_corporate_gifts_idea_c_p108_02.jpg","raw_m1_34265_idea_corporate_gifts_f_11.jpg","raw_m1_35706_idea_corporate_gifts_vs_104.jpg","raw_m1_35733_idea_corporate_gifts_e_193.jpg","raw_m1_35736_idea_corporate_gifts_e_190.jpg","raw_m1_35780_idea_corporate_gifts_b12.jpg","raw_m1_35854_milton_714.jpg","raw_m1_35859_idea_corporate_gifts_1130.jpg","raw_m1_38987_procter_procte_p05_25.jpg","raw_m1_38988_procter_procte_p05_26.jpg","raw_m1_38990_procter_procte_p05_28.jpg","raw_m1_38991_procter_procte_p05_29.jpg","raw_m1_38992_procter_procte_p05_30.jpg","raw_m1_38994_procter_procte_p05_32.jpg","raw_m1_39157_procter_007.jpg","raw_m1_39159_procter_004.jpg","raw_m1_39175_procter_020.jpg","raw_m1_39822_salido_st_17.jpg","raw_m1_39842_salido_phone.jpg","raw_m1_39853_salido_st_020.jpg","raw_m1_39948_salido_asa_86.jpg","raw_m1_40999_tapwell_tapwel_p21_04.jpg","raw_m1_41248_tapwell_860.jpg","raw_m1_41282_tapwell_895.jpg","raw_m1_00167_satya_paul_satya.jpg","raw_m1_01352_gift_desk_qty.jpg","raw_m1_01550_gift_desk_224.jpg","raw_m1_01551_gift_desk_226.jpg","raw_m1_01552_gift_desk_201.jpg","raw_m1_01553_gift_desk_205.jpg","raw_m1_01554_gift_desk_207.jpg","raw_m1_01555_gift_desk_209.jpg","raw_m1_01556_gift_desk_214.jpg","raw_m1_01557_gift_desk_211.jpg","raw_m1_01558_gift_desk_215.jpg","raw_m1_01559_gift_desk_220.jpg","raw_m1_01560_gift_desk_219.jpg","raw_m1_01561_gift_desk_223.jpg","raw_m1_01562_gift_desk_232.jpg","raw_m1_01563_gift_desk_231.jpg","raw_m1_01564_gift_desk_228.jpg","raw_m1_01565_gift_desk_230.jpg","raw_m1_01566_gift_desk_236.jpg","raw_m1_01567_gift_desk_252.jpg","raw_m1_01568_gift_desk_253.jpg","raw_m1_01569_gift_desk_250.jpg","raw_m1_01571_gift_desk_242.jpg","raw_m1_01572_gift_desk_239.jpg","raw_m1_01574_gift_desk_306.jpg","raw_m1_01575_gift_desk_307.jpg","raw_m1_01576_gift_desk_302.jpg","raw_m1_01577_gift_desk_315.jpg","raw_m1_01578_gift_desk_314.jpg","raw_m1_01579_gift_desk_305.jpg","raw_m1_01580_gift_desk_304.jpg","raw_m1_01581_gift_desk_303.jpg","raw_m1_01587_gift_desk_gift_d_p45_14.jpg","raw_m1_01590_gift_desk_108.jpg","raw_m1_01591_gift_desk_102.jpg","raw_m1_01595_gift_desk_114.jpg","raw_m1_01606_gift_desk_105.jpg","raw_m1_01612_gift_desk_120.jpg","raw_m1_01622_gift_desk_285.jpg","raw_m1_01626_gift_desk_135.jpg","raw_m1_02477_gift_desk_1080.jpg","raw_m1_03230_gift_desk_ths_72.jpg","raw_m1_03254_gift_desk_dnga_20.jpg","raw_m1_03258_gift_desk_gift_d_p93_02.jpg","raw_m1_04035_gift_desk_gift_d_p54_27.jpg","raw_m1_04102_gift_desk_gift_d_p56_33.jpg","raw_m1_04657_gift_desk_33999.jpg","raw_m1_04693_gift_desk_400.jpg","raw_m1_07861_gift_desk_dc_02.jpg","raw_m1_07965_gift_desk_dc_08n.jpg","raw_m1_07975_gift_desk_dc_12n.jpg","raw_m1_09068_fabelle_475.jpg","raw_m1_12534_gift_desk_1062.png","raw_m1_13029_gift_desk_4197.jpg","raw_m1_13336_gift_desk_gift_d_p34_10.jpg","raw_m1_13337_gift_desk_gift_d_p34_11.jpg","raw_m1_13338_gift_desk_gift_d_p34_12.jpg","raw_m1_13339_gift_desk_gift_d_p34_13.jpg","raw_m1_13823_gift_desk_gift_d_p72_08.jpg","raw_m1_13894_gift_desk_10382.jpg","raw_m1_15608_gift_desk_p_1499.jpg","raw_m1_15758_pebble_pebble_p10_06.jpg","raw_m1_15918_pebble_pebble_p39_05.jpg","raw_m1_16199_pebble_pbcl10.jpg","raw_m1_16205_pebble_pncl13.jpg","raw_m1_18694_gift_desk_re1013.jpg","raw_m1_18883_gift_desk_dm_701.jpg","raw_m1_19084_gift_desk_gift_d_p12_55.jpg","raw_m1_23511_gift_desk_bw_16.jpg","raw_m1_23861_gift_desk_1040.png","raw_m1_23867_gift_desk_766.png","raw_m1_24473_gift_desk_gift_d_p19_22.png","raw_m1_28378_idea_corporate_gifts_dm_1203.png","raw_m1_28382_idea_corporate_gifts_dm_1204.png","raw_m1_28386_idea_corporate_gifts_dm_1205.png","raw_m1_29030_borosil_idea_c_p06_04.jpg","raw_m1_29117_idea_corporate_gifts_5999.jpg","raw_m1_29938_waterman_waterm_p16_02.jpg","raw_m1_29939_waterman_waterm_p16_03.jpg","raw_m1_32688_idea_corporate_gifts_44775.jpg","raw_m1_32692_idea_corporate_gifts_45003.jpg","raw_m1_32697_idea_corporate_gifts_41781.jpg","raw_m1_32699_idea_corporate_gifts_35328.jpg","raw_m1_32700_idea_corporate_gifts_47613.jpg","raw_m1_32701_idea_corporate_gifts_41433.jpg","raw_m1_32704_idea_corporate_gifts_1885.jpg","raw_m1_32706_idea_corporate_gifts_32141.jpg","raw_m1_32707_idea_corporate_gifts_44385.jpg","raw_m1_32710_idea_corporate_gifts_36713.jpg","raw_m1_32719_idea_corporate_gifts_54533.jpg","raw_m1_32723_idea_corporate_gifts_lion_1060.jpg","raw_m1_32725_idea_corporate_gifts_37286.jpg","raw_m1_32727_idea_corporate_gifts_41490.jpg","raw_m1_32734_idea_corporate_gifts_41337.jpg","raw_m1_32737_idea_corporate_gifts_36379.jpg","raw_m1_32738_idea_corporate_gifts_38245.jpg","raw_m1_32745_idea_corporate_gifts_42588.jpg","raw_m1_32748_cross_45096.jpg","raw_m1_32758_idea_corporate_gifts_43858.jpg","raw_m1_32762_idea_corporate_gifts_36963.jpg","raw_m1_32763_idea_corporate_gifts_38507.jpg","raw_m1_32765_idea_corporate_gifts_36886.jpg","raw_m1_33113_idea_corporate_gifts_dgl_1031.jpg","raw_m1_33548_boat_idea_c_p19_05.jpg","raw_m1_35056_idea_corporate_gifts_idea_c_p03_12.png","raw_m1_36381_idea_corporate_gifts_set.jpg","raw_m1_37040_idea_corporate_gifts_idea_c_p124_04.jpg","raw_m1_37418_idea_corporate_gifts_lt.jpg","raw_m1_39463_salido_a_053.jpg","raw_m1_39488_salido_w11.jpg","raw_m1_39594_salido_aceo_03.jpg","raw_m1_39968_salido_a_70.jpg","raw_m1_40064_salido_asa_20.jpg","raw_m1_40343_jbl_atm_08.jpg"]);
let loadingMoreProducts=false;
const productCardRevealObserver=(!matchMedia('(prefers-reduced-motion:reduce)').matches&&'IntersectionObserver'in window)?new IntersectionObserver(entries=>{entries.filter(e=>e.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top).forEach((entry,index)=>{const el=entry.target;el.style.setProperty('--reveal-delay',Math.min(index,6)*45+'ms');el.classList.add('is-visible');setTimeout(()=>el.style.setProperty('--reveal-delay','0ms'),Math.min(index,6)*45+700);productCardRevealObserver.unobserve(el)})},{rootMargin:'0px 0px 90px 0px',threshold:.08}):null;
function watchProductCards(){grid.querySelectorAll('.card:not([data-product-watched])').forEach(el=>{el.dataset.productWatched='1';const media=el.querySelector('.card-media'),img=el.querySelector('img'),p=Lc[+el.dataset.i],loaded=()=>media.classList.add('is-loaded');const tryNext=()=>{if(p&&REMOTE_BASES.length){if(!img._fbSrcs)withRemoteFallback(img,p.tu||p.u,p.u);img._fbIdx=(img._fbIdx||0)+1;if(img._fbIdx<img._fbSrcs.length){img.src=img._fbSrcs[img._fbIdx];return}}loaded()};if(img.complete){if(img.naturalWidth>0)loaded();else tryNext()}else{img.addEventListener('load',loaded,{once:true});img.addEventListener('error',tryNext)}if(productCardRevealObserver)productCardRevealObserver.observe(el);else el.classList.add('is-visible')})}
function loadNextProducts(){if(loadingMoreProducts||drawn>=Lc.length)return;loadingMoreProducts=true;shown=Math.min(drawn+PRODUCTS_PER_CLICK,Lc.length);draw(false);loadingMoreProducts=false}
function count(el,n){let v=0;const st=Math.ceil(n/40),t=setInterval(()=>{v=Math.min(n,v+st);el.textContent=fmt(v);if(v>=n)clearInterval(t)},30)}
function mq(){$('#mq').innerHTML='<div>'+CATS.map(c=>c+' &bull; ').join('').repeat(CATS.length>12?3:8)+'</div>'}
function marqueeSet(html,hidden=false){const content=hidden?html.replace(/<button /g,'<button tabindex="-1" '):html;return `<div class="catalogue-marquee-set"${hidden?' aria-hidden="true"':''}>${content}</div>`}
function marqueeRow(items,reverse=false,fixedAll=false){const html=items.join('');const rail=`<div class="catalogue-marquee${reverse?' is-reverse':''}" aria-label="${reverse?'More categories':'Categories'}"><div class="catalogue-marquee-track">${marqueeSet(html)}${marqueeSet(html,true)}</div></div>`;return `<div class="category-line">${fixedAll?'<button class="chip all-products-fixed" data-c="">All products</button>':''}${rail}</div>`}
function speedMarquees(){document.querySelectorAll('.catalogue-marquee').forEach(rail=>{const first=rail.querySelector('.catalogue-marquee-set:not([aria-hidden="true"])');if(!first)return;const width=first.scrollWidth||first.getBoundingClientRect().width||1500,pps=rail.id==='brails'?34:44;rail.style.setProperty('--duration',Math.max(18,width/pps)+'s')})}
function pauseMarquee(rail){if(!rail)return;rail.classList.add('is-paused');clearTimeout(rail._resumeTimer);rail._resumeTimer=setTimeout(()=>rail.classList.remove('is-paused'),3000)}
function chips(){const cc={};P.forEach(p=>cc[p.c]=(cc[p.c]||0)+1);CATS=Object.keys(cc);
const categoryItems=CATS.map((k,i)=>`<button class="chip" data-c="${i}">${esc(k)}</button>`);
const perRow=Math.ceil(categoryItems.length/3),rows=[categoryItems.slice(0,perRow),categoryItems.slice(perRow,perRow*2),categoryItems.slice(perRow*2)];
$('#chips').innerHTML=rows.map((items,i)=>items.length?marqueeRow(items,i===1,i===0):'').join('');
const brandItems=P.length>200?BR.map(b=>{const n=P.filter(p=>b[2].includes(p.b)).length;return n?`<button class="chip bchip" data-b="${b[0]}" title="${b[1]}"><img src="assets/brand_logos/${b[0]}.svg" alt=""><span class="bname">${esc(b[1])}</span></button>`:''}).filter(Boolean):[];
$('#brails').innerHTML=brandItems.length?`<div class="catalogue-marquee-track">${marqueeSet(brandItems.join(''))}${marqueeSet(brandItems.join(''),true)}</div>`:'';
mark();mq();requestAnimationFrame(speedMarquees)}
function mark(){document.querySelectorAll('#chips .chip').forEach(c=>{const selected=!br&&c.dataset.c===cat;c.classList.toggle('on',selected);c.setAttribute('aria-pressed',String(selected))});document.querySelectorAll('#brails .chip').forEach(c=>{const selected=!cat&&c.dataset.b===br;c.classList.toggle('on',selected);c.setAttribute('aria-pressed',String(selected))})}
function flt(){const bn=br&&BR.find(b=>b[0]==br)[2],cn=cat===''?'':CATS[cat],tokens=qs?qs.split(/\s+/).filter(Boolean):[];return P.filter(p=>(!cn||p.c===cn)&&(!bn||bn.includes(p.b))&&(!tokens.length||tokens.every(t=>(p._s||makeSearchText(p)).includes(t))))}
const card=(p,i)=>`<div class="card${p.ih?' ih':''}" data-i="${i}"><button type="button" class="card-open"><span class="card-media"><span class="card-skeleton" aria-hidden="true"></span><img loading="${i<4?"eager":"lazy"}" decoding="async" fetchpriority="${i<2?"high":"auto"}" src="${p.tu||p.u}" alt="${esc(p.n)}"></span><div class="m"><b>${esc(p.n)}</b><small>${p.b&&String(p.b).toLowerCase()!=='null'?esc(p.b):''}${p.pr&&String(p.pr).toLowerCase()!=='null'?' · '+esc(p.pr):''}</small></div></button>${slBtn(p)}</div>`;
function draw(reset=true){if(reset){Lc=flt();shown=INITIAL_PRODUCTS;drawn=0;grid.innerHTML='';$('#cnt').textContent=(br||cat!==''||qs)?fmt(Lc.length)+' products':'5000+ products';if(!Lc.length)grid.innerHTML='<p class="sub">No products match.</p>'}
grid.insertAdjacentHTML('beforeend',Lc.slice(drawn,shown).map((p,k)=>card(p,drawn+k)).join(''));drawn=Math.min(shown,Lc.length);watchProductCards();const remaining=Lc.length-drawn;$('#more').style.display=remaining>0?'block':'none';$('#more').textContent=remaining>0?'View '+Math.min(PRODUCTS_PER_CLICK,remaining)+' more products':'All products loaded'}
function pick(e){const b=e.target.closest('.chip');if(!b||!e.currentTarget.contains(b))return;if('b' in b.dataset){br=br===b.dataset.b?'':b.dataset.b;cat=''}else{cat=cat===b.dataset.c?'':b.dataset.c;br='';qs='';$('#q').value=''}mark();draw();pauseMarquee(b.closest('.catalogue-marquee'))}
$('#chips').onclick=$('#brails').onclick=pick;
let _searchT;$('#q').oninput=e=>{clearTimeout(_searchT);const v=e.target.value.trim().toLowerCase();_searchT=setTimeout(()=>{qs=v;if(qs){cat='';mark()}draw()},90)};
['#brails','#chips'].forEach(selector=>{const parent=$(selector);parent.addEventListener('touchstart',e=>pauseMarquee(e.target.closest('.catalogue-marquee')||parent),{passive:true});parent.addEventListener('pointerdown',e=>pauseMarquee(e.target.closest('.catalogue-marquee')||parent))});
let marqueeResizeTimer;addEventListener('resize',()=>{clearTimeout(marqueeResizeTimer);marqueeResizeTimer=setTimeout(speedMarquees,140)},{passive:true});if(document.fonts&&document.fonts.ready)document.fonts.ready.then(speedMarquees);
$('#more').onclick=()=>loadNextProducts();
(()=>{const rm=matchMedia('(prefers-reduced-motion:reduce)').matches,canHover=matchMedia('(hover:hover) and (pointer:fine)').matches;if(rm||!canHover)return;
let active=null,rafId=0,tx=0,ty=0,cx=0,cy=0,gx=50,gy=50;const MAX_TILT=13.5;
const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
function getBaseRect(c){if(c.offsetParent===grid){const gr=grid.getBoundingClientRect();return{left:gr.left+c.offsetLeft,top:gr.top+c.offsetTop,width:c.offsetWidth||1,height:c.offsetHeight||1}}const r=c.getBoundingClientRect();return{left:r.left,top:r.top,width:r.width||1,height:r.height||1}}
function inRect(x,y,r){return x>=r.left&&x<=r.left+r.width&&y>=r.top&&y<=r.top+r.height}
function applyTilt(c,rx,ry){c.style.transform=`perspective(740px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-8px) scale3d(1.036,1.036,1)`;c.style.setProperty('--rx',rx.toFixed(2));c.style.setProperty('--ry',ry.toFixed(2));c.style.setProperty('--gx',gx.toFixed(1)+'%');c.style.setProperty('--gy',gy.toFixed(1)+'%')}
function tick(){if(!active){rafId=0;return}cx+=(tx-cx)*.22;cy+=(ty-cy)*.22;applyTilt(active,cx,cy);if(Math.abs(tx-cx)>.04||Math.abs(ty-cy)>.04)rafId=requestAnimationFrame(tick);else{cx=tx;cy=ty;applyTilt(active,cx,cy);rafId=0}}
function resetCard(c){if(!c)return;c.classList.remove('is-tilting');c.style.transform='';c.style.removeProperty('--rx');c.style.removeProperty('--ry')}
window._resetCardTilt=()=>{if(rafId){cancelAnimationFrame(rafId);rafId=0}if(active){resetCard(active);active=null}tx=ty=cx=cy=0};
grid.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||innerWidth<=700)return;let c=e.target.closest('.card');if(!c||!grid.contains(c)){if(active&&grid.contains(active)&&inRect(e.clientX,e.clientY,getBaseRect(active)))c=active;else{window._resetCardTilt();return}}if(c!==active){if(active)resetCard(active);active=c;cx=0;cy=0;c.classList.add('is-tilting')}const r=getBaseRect(c),nx=clamp((e.clientX-r.left)/r.width,0,1),ny=clamp((e.clientY-r.top)/r.height,0,1);ty=(nx-.5)*2*MAX_TILT;tx=(.5-ny)*2*MAX_TILT;gx=nx*100;gy=ny*100;if(!rafId)rafId=requestAnimationFrame(tick)},{passive:true});
grid.addEventListener('pointerleave',()=>window._resetCardTilt());
grid.addEventListener('pointercancel',()=>window._resetCardTilt());
addEventListener('scroll',()=>{if(active)window._resetCardTilt()},{passive:true});
})();
const dgMedia=$('#dgMedia'),dgCopy=$('#dgCopy'),dgInfo=$('#dgInfo'),dgImg=$('#di'),dgShell=$('#dgShell'),dgRm=matchMedia('(prefers-reduced-motion:reduce)').matches;
let dgToken=0,dgMediaAnim=null,dgCopyAnim=null,dgImgAr=0.78;
const REMOTE_BASES=location.protocol==='file:'?['https://mysterling.in/','https://rajaqwe.github.io/Sterling-Prime/']:[];
function withRemoteFallback(im,primary,alt){
  if(!im)return;
  const srcs=[];
  const push=s=>{if(s&&!srcs.includes(s))srcs.push(s)};
  push(primary);
  if(alt&&alt!==primary)push(alt);
  if(REMOTE_BASES.length){
    for(const u of [primary,alt]){
      if(u&&!/^(?:https?:|data:|blob:)/i.test(u)){
        const clean=u.replace(/^\.?\//,'');
        for(const base of REMOTE_BASES)push(base+clean);
      }
    }
  }
  im._fbSrcs=srcs;
  im._fbIdx=0;
}
function syncModalLayout(){
  if(!dlg.open||!dgShell)return;
  const vw=innerWidth,vh=innerHeight;
  const isPortrait=vw<=680||vh>vw;
  const ar=Math.max(0.5,Math.min(1.4,dgImgAr||0.78));
  dgShell.style.setProperty('--img-ar',ar.toFixed(4));
  if(isPortrait){
    dlg.style.width='';
    dlg.style.height='';
    dgShell.style.removeProperty('--dg-stage-w');
    return;
  }
  const maxW=Math.min(vw*0.92,Math.max(660,Math.min(vw*0.78,1960)));
  const maxH=Math.min(vh*0.9,Math.max(360,Math.min(vh*0.86,1280)));
  let infoW=Math.max(330,Math.min(vw*0.35,840));
  if(infoW>maxW*0.56)infoW=Math.round(maxW*0.52);
  const availStageW=Math.max(220,maxW-infoW);
  /* Measure actual right-panel natural height (with full description) so neither side clips or leaves dead gaps */
  let infoH=0;
  if(dgInfo){
    const cs=getComputedStyle(dgInfo);
    const padY=(parseFloat(cs.paddingTop)||0)+(parseFloat(cs.paddingBottom)||0);
    const gap=parseFloat(cs.rowGap||cs.gap)||12;
    const kids=[...dgInfo.children].filter(el=>!el.hidden&&getComputedStyle(el).display!=='none');
    infoH=padY+kids.reduce((sum,el)=>sum+el.offsetHeight,0)+Math.max(0,kids.length-1)*gap+6;
  }
  const targetH=Math.max(infoH,Math.min(maxH,Math.max(430,vh*0.76)));
  let H=Math.min(maxH,targetH);
  let stageW=H*ar;
  if(stageW>availStageW){
    stageW=availStageW;
    const naturalH=stageW/ar;
    H=Math.min(maxH,Math.max(infoH,Math.min(H,naturalH)));
  }
  const totalW=Math.min(maxW,Math.round(stageW+infoW));
  dgShell.style.setProperty('--dg-stage-w',Math.round(stageW)+'px');
  dlg.style.width=totalW+'px';
  dlg.style.height=Math.round(H)+'px';
}
function bindDgImg(p){
  dgMedia.classList.remove('is-broken');
  withRemoteFallback(dgImg,p.u,p.tu);
  dgImg.onload=()=>{
    dgMedia.classList.remove('is-broken');
    if(dgImg.naturalWidth>0&&dgImg.naturalHeight>0){
      dgImgAr=dgImg.naturalWidth/dgImg.naturalHeight;
      requestAnimationFrame(syncModalLayout);
    }
  };
  dgImg.onerror=()=>{
    dgImg._fbIdx++;
    if(dgImg._fbSrcs&&dgImg._fbIdx<dgImg._fbSrcs.length){
      dgImg.src=dgImg._fbSrcs[dgImg._fbIdx];
      return;
    }
    dgImgAr=0.82;
    dgMedia.classList.add('is-broken');
    requestAnimationFrame(syncModalLayout);
  };
  dgImg.src=dgImg._fbSrcs[0]||p.u;
  dgImg.alt=p.n;
  if(dgImg.complete&&dgImg.naturalWidth>0&&dgImg.naturalHeight>0){
    dgImgAr=dgImg.naturalWidth/dgImg.naturalHeight;
  }
}
const pdBox=$('#productDescription'),pdEl=$('#dd');
function formatDescHTML(desc){
  if(!desc||(Array.isArray(desc)&&!desc.length))return '';
  let items=[];
  if(Array.isArray(desc)){items=desc}
  else{
    const raw=String(desc).trim();
    const lines=raw.split(/\n+/).map(s=>s.replace(/^[\s•▪‣\-*]+/,'').trim()).filter(Boolean);
    if(lines.length>1){items=lines}
    else if(/\s[•|]\s/.test(raw)){items=raw.split(/\s*[•|]\s*/).map(s=>s.trim()).filter(Boolean)}
    else{return '<p>'+esc(raw)+'</p>'}
  }
  const hasBullets=items.length>1||/^[A-Za-z0-9 /&()-]{2,28}:\s+\S/.test(items[0]);
  if(!hasBullets)return '<p>'+esc(items[0])+'</p>';
  return '<ul class="pd-list">'+items.map(line=>{
    const m=line.match(/^([A-Za-z0-9 /&()-]{2,28}):\s+(.+)$/);
    return m?'<li><strong>'+esc(m[1])+':</strong> '+esc(m[2])+'</li>':'<li>'+esc(line)+'</li>';
  }).join('')+'</ul>';
}
addEventListener('resize',()=>{if(dlg.open)requestAnimationFrame(syncModalLayout)},{passive:true});
function fillP(p){
  curP=p;slDlg(p);
  bindDgImg(p);
  $('#dn').textContent=p.n;
  $('#ds').textContent=p.sku+(p.b&&String(p.b).toLowerCase()!=='null'?' · '+p.b:'');
  $('#dc').textContent=p.c+(p.pr&&String(p.pr).toLowerCase()!=='null'?' · '+p.pr:'');
  const descHtml=formatDescHTML(p.description);
  pdEl.innerHTML=descHtml;
  pdBox.hidden=!descHtml;
  if(dgInfo)dgInfo.scrollTop=0;
  $('#sampleProduct').textContent=p.n+(p.sku?' · SKU: '+p.sku:'');
  $('#de').href='https://wa.me/918758294908?text='+encodeURIComponent(`Hi Sterling Prime, I would like to order / get a quote for '${p.n}' (SKU: ${p.sku} | Brand: ${p.b} | Category: ${p.c}). Please share bulk B2B pricing and customization options.`);
  $('#dm').href='mailto:info@mysterling.in?subject='+encodeURIComponent('Enquiry: '+p.n+' ('+p.sku+')')+'&body='+encodeURIComponent(`Hi Sterling Prime, I would like a quote for '${p.n}' (SKU: ${p.sku} | Brand: ${p.b}). Please share bulk B2B pricing and customization options.`);
  const A=Lc.includes(p)?Lc:P,idx=A.indexOf(p);
  if(A.length>1&&idx>-1){[A[(idx+1)%A.length],A[(idx-1+A.length)%A.length]].forEach(n=>{if(n&&n.u){const im=new Image();im.src=n.u}})}
  requestAnimationFrame(syncModalLayout);
}
function openP(p,dir=0){
  if(window._resetCardTilt)window._resetCardTilt();
  const tok=++dgToken;
  if(dgMediaAnim){dgMediaAnim.cancel();dgMediaAnim=null}
  if(dgCopyAnim){dgCopyAnim.cancel();dgCopyAnim=null}
  const animateSwitch=dlg.open&&dir!==0&&!dgRm&&typeof dgMedia.animate==='function';
  if(!animateSwitch){
    fillP(p);
    if(!dlg.open){dlg.showModal();requestAnimationFrame(()=>requestAnimationFrame(syncModalLayout))}
    return;
  }
  const outX=-dir*46,inX=dir*54;
  const outCopyX=-dir*22,inCopyX=dir*26;
  const exM=dgMedia.animate([
    {transform:'translate3d(0,0,0) scale(1)',opacity:1},
    {transform:`translate3d(${outX}px,0,0) scale(.955)`,opacity:0}
  ],{duration:135,easing:'cubic-bezier(.4,0,1,1)',fill:'forwards'});
  const exC=dgCopy.animate([
    {transform:'translate3d(0,0,0)',opacity:1},
    {transform:`translate3d(${outCopyX}px,0,0)`,opacity:0}
  ],{duration:120,easing:'cubic-bezier(.4,0,1,1)',fill:'forwards'});
  dgMediaAnim=exM;dgCopyAnim=exC;
  exM.onfinish=()=>{
    if(tok!==dgToken)return;
    exM.cancel();exC.cancel();
    fillP(p);
    dgMediaAnim=dgMedia.animate([
      {transform:`translate3d(${inX}px,0,0) scale(.965)`,opacity:0},
      {transform:'translate3d(0,0,0) scale(1)',opacity:1}
    ],{duration:310,easing:'cubic-bezier(.22,1,.36,1)',fill:'none'});
    dgCopyAnim=dgCopy.animate([
      {transform:`translate3d(${inCopyX}px,0,0)`,opacity:0},
      {transform:'translate3d(0,0,0)',opacity:1}
    ],{duration:290,delay:28,easing:'cubic-bezier(.22,1,.36,1)',fill:'none'});
  };
}
const sampleDialog=$('#sampleDlg');
$('#getSample').onclick=()=>{if(!curP)return;$('#sampleProduct').textContent=curP.n+(curP.sku?' · SKU: '+curP.sku:'');sampleDialog.showModal();$('#sampleName').focus()};
$('#sampleClose').onclick=()=>sampleDialog.close();
$('#sampleDlg').onclick=e=>{if(e.target===sampleDialog)sampleDialog.close()};
$('#sampleForm').onsubmit=e=>{e.preventDefault();const values=Object.fromEntries(new FormData(e.currentTarget).entries()),p=curP;if(!p)return;
const message=[
'Hi Sterling Prime, I would like to request a sample for this product.',
'Product: '+p.n,'SKU: '+(p.sku||'N/A'),'Category: '+(p.c||'N/A'),
'Name: '+values.name,'Company: '+values.company,'Mobile: '+values.mobile,
'Quantity required: '+values.quantity,'Delivery address: '+values.address,
'Please confirm sample availability, sample charges and dispatch timeline.'
].join('\n');
const url='https://wa.me/918758294908?text='+encodeURIComponent(message);
window.open(url,'_blank','noopener,noreferrer');sampleDialog.close();e.currentTarget.reset();
};
grid.onclick=e=>{const a=e.target.closest('.sl-add');if(a){slToggle(a,Lc[+a.closest('.card').dataset.i]);return}const c=e.target.closest('.card');if(c)openP(Lc[+c.dataset.i])};
const step=d=>{const A=Lc.includes(curP)?Lc:P,i=A.indexOf(curP);if(!A.length)return;openP(A[(i+d+A.length)%A.length],d)};
$('#pv').onclick=()=>step(-1);$('#nx').onclick=()=>step(1);
addEventListener('keydown',e=>{if(dlg.open&&!sampleDialog.open&&e.key=='ArrowLeft'){e.preventDefault();step(-1)}if(dlg.open&&!sampleDialog.open&&e.key=='ArrowRight'){e.preventDefault();step(1)}});
dlg.onclick=e=>{if(e.target==dlg)dlg.close()};dlg.addEventListener('close',()=>{dgToken++;if(dgMediaAnim){dgMediaAnim.cancel();dgMediaAnim=null}if(dgCopyAnim){dgCopyAnim.cancel();dgCopyAnim=null}});
(()=>{
  if(!dgShell)return;
  let sx=0,sy=0,dx=0,swiping=false,locked=false;
  dgShell.addEventListener('touchstart',e=>{
    if(e.touches.length!==1||e.target.closest('button,a,input,textarea,.dg-info'))return;
    sx=e.touches[0].clientX;sy=e.touches[0].clientY;dx=0;swiping=true;locked=false;
  },{passive:true});
  dgShell.addEventListener('touchmove',e=>{
    if(!swiping||e.touches.length!==1)return;
    const cx=e.touches[0].clientX-sx,cy=e.touches[0].clientY-sy;
    if(!locked){
      if(Math.abs(cx)>10&&Math.abs(cx)>Math.abs(cy)){locked=true}
      else if(Math.abs(cy)>12){swiping=false;return}
      else return;
    }
    dx=cx;
    if(!dgRm){
      const drag=Math.max(-90,Math.min(90,dx*.42));
      dgMedia.style.transition='none';
      dgMedia.style.transform=`translate3d(${drag}px,0,0)`;
      dgMedia.style.opacity=String(Math.max(.55,1-Math.abs(drag)/240));
    }
  },{passive:true});
  const endSwipe=()=>{
    if(!swiping)return;
    swiping=false;
    const moved=dx;dx=0;
    dgMedia.style.transition='';dgMedia.style.transform='';dgMedia.style.opacity='';
    if(locked&&Math.abs(moved)>46){step(moved<0?1:-1)}
    locked=false;
  };
  dgShell.addEventListener('touchend',endSwipe,{passive:true});
  dgShell.addEventListener('touchcancel',endSwipe,{passive:true});
})();
chips();draw();
/* pull the full reference catalogue (5000+ products; falls back to live domain on local file:// testing) */
const CATEGORY_FIX={"inhouse_0022":{"name":"Office Stationery Tools","slug":"office-stationery-tools"},"inhouse_0159":{"name":"Office Stationery Tools","slug":"office-stationery-tools"},"inhouse_0160":{"name":"Office Stationery Tools","slug":"office-stationery-tools"},"inhouse_0026":{"name":"Executive Combo Gift Sets","slug":"executive-combo-sets"},"sp_prod_01798":{"name":"Executive Combo Gift Sets","slug":"executive-combo-sets"},"sp_prod_02825":{"name":"Executive Combo Gift Sets","slug":"executive-combo-sets"},"sp_prod_05303":{"name":"Executive Combo Gift Sets","slug":"executive-combo-sets"},"sp_prod_05305":{"name":"Executive Combo Gift Sets","slug":"executive-combo-sets"},"sp_prod_05311":{"name":"Executive Combo Gift Sets","slug":"executive-combo-sets"},"sp_prod_05312":{"name":"Executive Combo Gift Sets","slug":"executive-combo-sets"},"sp_prod_05316":{"name":"Executive Combo Gift Sets","slug":"executive-combo-sets"},"sp_prod_05317":{"name":"Executive Combo Gift Sets","slug":"executive-combo-sets"},"sp_prod_05318":{"name":"Executive Combo Gift Sets","slug":"executive-combo-sets"},"sp_prod_05323":{"name":"Executive Combo Gift Sets","slug":"executive-combo-sets"},"sp_prod_05324":{"name":"Executive Combo Gift Sets","slug":"executive-combo-sets"},"sp_prod_05332":{"name":"Executive Combo Gift Sets","slug":"executive-combo-sets"},"sp_prod_05336":{"name":"Executive Combo Gift Sets","slug":"executive-combo-sets"},"sp_prod_05342":{"name":"Executive Combo Gift Sets","slug":"executive-combo-sets"},"sp_prod_05350":{"name":"Executive Combo Gift Sets","slug":"executive-combo-sets"},"sp_prod_05488":{"name":"Executive Combo Gift Sets","slug":"executive-combo-sets"},"inhouse_0047":{"name":"Executive Combo Gift Sets","slug":"executive-combo-sets"},"inhouse_0062":{"name":"Executive Combo Gift Sets","slug":"executive-combo-sets"},"sp_prod_01622":{"name":"Executive Combo Gift Sets","slug":"executive-combo-sets"},"sp_prod_01623":{"name":"Executive Combo Gift Sets","slug":"executive-combo-sets"},"sp_prod_01624":{"name":"Executive Combo Gift Sets","slug":"executive-combo-sets"},"sp_prod_01625":{"name":"Executive Combo Gift Sets","slug":"executive-combo-sets"},"sp_prod_03266":{"name":"Executive Combo Gift Sets","slug":"executive-combo-sets"},"sp_prod_03267":{"name":"Executive Combo Gift Sets","slug":"executive-combo-sets"},"sp_prod_03268":{"name":"Executive Combo Gift Sets","slug":"executive-combo-sets"},"sp_prod_03269":{"name":"Executive Combo Gift Sets","slug":"executive-combo-sets"},"sp_prod_03270":{"name":"Executive Combo Gift Sets","slug":"executive-combo-sets"},"sp_prod_03271":{"name":"Executive Combo Gift Sets","slug":"executive-combo-sets"},"sp_prod_03272":{"name":"Executive Combo Gift Sets","slug":"executive-combo-sets"},"sp_prod_03273":{"name":"Executive Combo Gift Sets","slug":"executive-combo-sets"},"sp_prod_03274":{"name":"Executive Combo Gift Sets","slug":"executive-combo-sets"},"sp_prod_03278":{"name":"Executive Combo Gift Sets","slug":"executive-combo-sets"},"sp_prod_03279":{"name":"Executive Combo Gift Sets","slug":"executive-combo-sets"},"sp_prod_03280":{"name":"Executive Combo Gift Sets","slug":"executive-combo-sets"},"sp_prod_03284":{"name":"Executive Combo Gift Sets","slug":"executive-combo-sets"},"sp_prod_05300":{"name":"Executive Combo Gift Sets","slug":"executive-combo-sets"},"sp_prod_05314":{"name":"Executive Combo Gift Sets","slug":"executive-combo-sets"},"sp_prod_05328":{"name":"Executive Combo Gift Sets","slug":"executive-combo-sets"},"sp_prod_05330":{"name":"Executive Combo Gift Sets","slug":"executive-combo-sets"},"sp_prod_05331":{"name":"Executive Combo Gift Sets","slug":"executive-combo-sets"},"sp_prod_05339":{"name":"Executive Combo Gift Sets","slug":"executive-combo-sets"},"sp_prod_05340":{"name":"Executive Combo Gift Sets","slug":"executive-combo-sets"},"sp_prod_05341":{"name":"Executive Combo Gift Sets","slug":"executive-combo-sets"},"sp_prod_05343":{"name":"Executive Combo Gift Sets","slug":"executive-combo-sets"},"sp_prod_05351":{"name":"Executive Combo Gift Sets","slug":"executive-combo-sets"},"sp_prod_05490":{"name":"Executive Combo Gift Sets","slug":"executive-combo-sets"},"inhouse_0030":{"name":"Healthcare & Medical Communication","slug":"healthcare-medical"},"inhouse_0122":{"name":"Bottles, Sippers & Flasks","slug":"bottles-sippers-flasks"},"sp_prod_01134":{"name":"Bottles, Sippers & Flasks","slug":"bottles-sippers-flasks"},"sp_prod_01512":{"name":"Bottles, Sippers & Flasks","slug":"bottles-sippers-flasks"},"sp_prod_01539":{"name":"Bottles, Sippers & Flasks","slug":"bottles-sippers-flasks"},"sp_prod_01540":{"name":"Bottles, Sippers & Flasks","slug":"bottles-sippers-flasks"},"sp_prod_01884":{"name":"Bottles, Sippers & Flasks","slug":"bottles-sippers-flasks"},"sp_prod_03635":{"name":"Bottles, Sippers & Flasks","slug":"bottles-sippers-flasks"},"sp_prod_03637":{"name":"Bottles, Sippers & Flasks","slug":"bottles-sippers-flasks"},"sp_prod_04770":{"name":"Bottles, Sippers & Flasks","slug":"bottles-sippers-flasks"},"sp_prod_04866":{"name":"Bottles, Sippers & Flasks","slug":"bottles-sippers-flasks"},"sp_prod_04975":{"name":"Bottles, Sippers & Flasks","slug":"bottles-sippers-flasks"},"sp_prod_05097":{"name":"Bottles, Sippers & Flasks","slug":"bottles-sippers-flasks"},"sp_prod_05158":{"name":"Bottles, Sippers & Flasks","slug":"bottles-sippers-flasks"},"sp_prod_05370":{"name":"Bottles, Sippers & Flasks","slug":"bottles-sippers-flasks"},"sp_prod_05375":{"name":"Bottles, Sippers & Flasks","slug":"bottles-sippers-flasks"},"sp_prod_05378":{"name":"Bottles, Sippers & Flasks","slug":"bottles-sippers-flasks"},"sp_prod_05385":{"name":"Bottles, Sippers & Flasks","slug":"bottles-sippers-flasks"},"sp_prod_05561":{"name":"Bottles, Sippers & Flasks","slug":"bottles-sippers-flasks"},"sp_prod_01432":{"name":"Bottles, Sippers & Flasks","slug":"bottles-sippers-flasks"},"sp_prod_01433":{"name":"Bottles, Sippers & Flasks","slug":"bottles-sippers-flasks"},"sp_prod_01434":{"name":"Bottles, Sippers & Flasks","slug":"bottles-sippers-flasks"},"sp_prod_01435":{"name":"Bottles, Sippers & Flasks","slug":"bottles-sippers-flasks"},"sp_prod_01436":{"name":"Bottles, Sippers & Flasks","slug":"bottles-sippers-flasks"},"sp_prod_01437":{"name":"Bottles, Sippers & Flasks","slug":"bottles-sippers-flasks"},"sp_prod_01438":{"name":"Bottles, Sippers & Flasks","slug":"bottles-sippers-flasks"},"sp_prod_01439":{"name":"Bottles, Sippers & Flasks","slug":"bottles-sippers-flasks"},"sp_prod_05098":{"name":"Bottles, Sippers & Flasks","slug":"bottles-sippers-flasks"},"sp_prod_00283":{"name":"Audio & Bluetooth Speakers","slug":"audio-speakers"},"sp_prod_00651":{"name":"Audio & Bluetooth Speakers","slug":"audio-speakers"},"sp_prod_00700":{"name":"Audio & Bluetooth Speakers","slug":"audio-speakers"},"sp_prod_00709":{"name":"Audio & Bluetooth Speakers","slug":"audio-speakers"},"sp_prod_00712":{"name":"Audio & Bluetooth Speakers","slug":"audio-speakers"},"sp_prod_01026":{"name":"Audio & Bluetooth Speakers","slug":"audio-speakers"},"sp_prod_01027":{"name":"Audio & Bluetooth Speakers","slug":"audio-speakers"},"sp_prod_01223":{"name":"Audio & Bluetooth Speakers","slug":"audio-speakers"},"sp_prod_01529":{"name":"Audio & Bluetooth Speakers","slug":"audio-speakers"},"sp_prod_02266":{"name":"Audio & Bluetooth Speakers","slug":"audio-speakers"},"sp_prod_03784":{"name":"Audio & Bluetooth Speakers","slug":"audio-speakers"},"sp_prod_03788":{"name":"Audio & Bluetooth Speakers","slug":"audio-speakers"},"sp_prod_03789":{"name":"Audio & Bluetooth Speakers","slug":"audio-speakers"},"sp_prod_03810":{"name":"Audio & Bluetooth Speakers","slug":"audio-speakers"},"sp_prod_05208":{"name":"Audio & Bluetooth Speakers","slug":"audio-speakers"},"sp_prod_05492":{"name":"Audio & Bluetooth Speakers","slug":"audio-speakers"},"sp_prod_05533":{"name":"Audio & Bluetooth Speakers","slug":"audio-speakers"},"sp_prod_05592":{"name":"Audio & Bluetooth Speakers","slug":"audio-speakers"},"sp_prod_01850":{"name":"Audio & Bluetooth Speakers","slug":"audio-speakers"},"sp_prod_00297":{"name":"Divine Idols & Pooja Gifts","slug":"divine-idols-pooja"},"sp_prod_00307":{"name":"Divine Idols & Pooja Gifts","slug":"divine-idols-pooja"},"sp_prod_00608":{"name":"Divine Idols & Pooja Gifts","slug":"divine-idols-pooja"},"sp_prod_00901":{"name":"Divine Idols & Pooja Gifts","slug":"divine-idols-pooja"},"sp_prod_01635":{"name":"Divine Idols & Pooja Gifts","slug":"divine-idols-pooja"},"sp_prod_01746":{"name":"Divine Idols & Pooja Gifts","slug":"divine-idols-pooja"},"sp_prod_01747":{"name":"Divine Idols & Pooja Gifts","slug":"divine-idols-pooja"},"sp_prod_01748":{"name":"Divine Idols & Pooja Gifts","slug":"divine-idols-pooja"},"sp_prod_01749":{"name":"Divine Idols & Pooja Gifts","slug":"divine-idols-pooja"},"sp_prod_01750":{"name":"Divine Idols & Pooja Gifts","slug":"divine-idols-pooja"},"sp_prod_02827":{"name":"Divine Idols & Pooja Gifts","slug":"divine-idols-pooja"},"sp_prod_03891":{"name":"Divine Idols & Pooja Gifts","slug":"divine-idols-pooja"},"sp_prod_03896":{"name":"Divine Idols & Pooja Gifts","slug":"divine-idols-pooja"},"sp_prod_04726":{"name":"Divine Idols & Pooja Gifts","slug":"divine-idols-pooja"},"sp_prod_00306":{"name":"Smart Tech & Computer Accessories","slug":"smart-tech-accessories"},"sp_prod_00508":{"name":"Smart Tech & Computer Accessories","slug":"smart-tech-accessories"},"sp_prod_00687":{"name":"Smart Tech & Computer Accessories","slug":"smart-tech-accessories"},"sp_prod_01207":{"name":"Smart Tech & Computer Accessories","slug":"smart-tech-accessories"},"sp_prod_01537":{"name":"Smart Tech & Computer Accessories","slug":"smart-tech-accessories"},"sp_prod_02198":{"name":"Smart Tech & Computer Accessories","slug":"smart-tech-accessories"},"sp_prod_02638":{"name":"Smart Tech & Computer Accessories","slug":"smart-tech-accessories"},"sp_prod_02665":{"name":"Smart Tech & Computer Accessories","slug":"smart-tech-accessories"},"sp_prod_02666":{"name":"Smart Tech & Computer Accessories","slug":"smart-tech-accessories"},"sp_prod_02667":{"name":"Smart Tech & Computer Accessories","slug":"smart-tech-accessories"},"sp_prod_02677":{"name":"Smart Tech & Computer Accessories","slug":"smart-tech-accessories"},"sp_prod_02683":{"name":"Smart Tech & Computer Accessories","slug":"smart-tech-accessories"},"sp_prod_02690":{"name":"Smart Tech & Computer Accessories","slug":"smart-tech-accessories"},"sp_prod_02735":{"name":"Smart Tech & Computer Accessories","slug":"smart-tech-accessories"},"sp_prod_02737":{"name":"Smart Tech & Computer Accessories","slug":"smart-tech-accessories"},"sp_prod_02739":{"name":"Smart Tech & Computer Accessories","slug":"smart-tech-accessories"},"sp_prod_02741":{"name":"Smart Tech & Computer Accessories","slug":"smart-tech-accessories"},"sp_prod_02744":{"name":"Smart Tech & Computer Accessories","slug":"smart-tech-accessories"},"sp_prod_02754":{"name":"Smart Tech & Computer Accessories","slug":"smart-tech-accessories"},"sp_prod_02756":{"name":"Smart Tech & Computer Accessories","slug":"smart-tech-accessories"},"sp_prod_04996":{"name":"Smart Tech & Computer Accessories","slug":"smart-tech-accessories"},"sp_prod_05071":{"name":"Smart Tech & Computer Accessories","slug":"smart-tech-accessories"},"sp_prod_05074":{"name":"Smart Tech & Computer Accessories","slug":"smart-tech-accessories"},"sp_prod_05075":{"name":"Smart Tech & Computer Accessories","slug":"smart-tech-accessories"},"sp_prod_05120":{"name":"Smart Tech & Computer Accessories","slug":"smart-tech-accessories"},"sp_prod_05162":{"name":"Smart Tech & Computer Accessories","slug":"smart-tech-accessories"},"sp_prod_05192":{"name":"Smart Tech & Computer Accessories","slug":"smart-tech-accessories"},"sp_prod_05274":{"name":"Smart Tech & Computer Accessories","slug":"smart-tech-accessories"},"sp_prod_05391":{"name":"Smart Tech & Computer Accessories","slug":"smart-tech-accessories"},"sp_prod_05441":{"name":"Smart Tech & Computer Accessories","slug":"smart-tech-accessories"},"sp_prod_05516":{"name":"Smart Tech & Computer Accessories","slug":"smart-tech-accessories"},"sp_prod_05581":{"name":"Smart Tech & Computer Accessories","slug":"smart-tech-accessories"},"sp_prod_05608":{"name":"Smart Tech & Computer Accessories","slug":"smart-tech-accessories"},"sp_prod_01536":{"name":"Smart Tech & Computer Accessories","slug":"smart-tech-accessories"},"sp_prod_02260":{"name":"Smart Tech & Computer Accessories","slug":"smart-tech-accessories"},"sp_prod_02636":{"name":"Smart Tech & Computer Accessories","slug":"smart-tech-accessories"},"sp_prod_02657":{"name":"Smart Tech & Computer Accessories","slug":"smart-tech-accessories"},"sp_prod_05355":{"name":"Smart Tech & Computer Accessories","slug":"smart-tech-accessories"},"sp_prod_05626":{"name":"Smart Tech & Computer Accessories","slug":"smart-tech-accessories"},"sp_prod_00408":{"name":"Backpacks, Luggage & Travel Bags","slug":"backpacks-luggage-travel"},"sp_prod_00410":{"name":"Backpacks, Luggage & Travel Bags","slug":"backpacks-luggage-travel"},"sp_prod_01030":{"name":"Backpacks, Luggage & Travel Bags","slug":"backpacks-luggage-travel"},"sp_prod_01273":{"name":"Backpacks, Luggage & Travel Bags","slug":"backpacks-luggage-travel"},"sp_prod_01468":{"name":"Backpacks, Luggage & Travel Bags","slug":"backpacks-luggage-travel"},"sp_prod_02625":{"name":"Backpacks, Luggage & Travel Bags","slug":"backpacks-luggage-travel"},"sp_prod_02626":{"name":"Backpacks, Luggage & Travel Bags","slug":"backpacks-luggage-travel"},"sp_prod_02627":{"name":"Backpacks, Luggage & Travel Bags","slug":"backpacks-luggage-travel"},"sp_prod_02629":{"name":"Backpacks, Luggage & Travel Bags","slug":"backpacks-luggage-travel"},"sp_prod_02630":{"name":"Backpacks, Luggage & Travel Bags","slug":"backpacks-luggage-travel"},"sp_prod_02631":{"name":"Backpacks, Luggage & Travel Bags","slug":"backpacks-luggage-travel"},"sp_prod_02794":{"name":"Backpacks, Luggage & Travel Bags","slug":"backpacks-luggage-travel"},"sp_prod_02795":{"name":"Backpacks, Luggage & Travel Bags","slug":"backpacks-luggage-travel"},"sp_prod_05094":{"name":"Backpacks, Luggage & Travel Bags","slug":"backpacks-luggage-travel"},"sp_prod_05114":{"name":"Backpacks, Luggage & Travel Bags","slug":"backpacks-luggage-travel"},"sp_prod_05159":{"name":"Backpacks, Luggage & Travel Bags","slug":"backpacks-luggage-travel"},"sp_prod_05352":{"name":"Backpacks, Luggage & Travel Bags","slug":"backpacks-luggage-travel"},"sp_prod_05427":{"name":"Backpacks, Luggage & Travel Bags","slug":"backpacks-luggage-travel"},"sp_prod_05430":{"name":"Backpacks, Luggage & Travel Bags","slug":"backpacks-luggage-travel"},"sp_prod_05437":{"name":"Backpacks, Luggage & Travel Bags","slug":"backpacks-luggage-travel"},"sp_prod_05498":{"name":"Backpacks, Luggage & Travel Bags","slug":"backpacks-luggage-travel"},"sp_prod_05512":{"name":"Backpacks, Luggage & Travel Bags","slug":"backpacks-luggage-travel"},"sp_prod_05525":{"name":"Backpacks, Luggage & Travel Bags","slug":"backpacks-luggage-travel"},"sp_prod_05594":{"name":"Backpacks, Luggage & Travel Bags","slug":"backpacks-luggage-travel"},"sp_prod_05613":{"name":"Backpacks, Luggage & Travel Bags","slug":"backpacks-luggage-travel"},"sp_prod_00419":{"name":"Desk Organizers & Stands","slug":"desk-organizers-stands"},"sp_prod_00690":{"name":"Desk Organizers & Stands","slug":"desk-organizers-stands"},"sp_prod_01177":{"name":"Desk Organizers & Stands","slug":"desk-organizers-stands"},"sp_prod_01190":{"name":"Desk Organizers & Stands","slug":"desk-organizers-stands"},"sp_prod_01200":{"name":"Desk Organizers & Stands","slug":"desk-organizers-stands"},"sp_prod_01204":{"name":"Desk Organizers & Stands","slug":"desk-organizers-stands"},"sp_prod_01210":{"name":"Desk Organizers & Stands","slug":"desk-organizers-stands"},"sp_prod_01211":{"name":"Desk Organizers & Stands","slug":"desk-organizers-stands"},"sp_prod_01217":{"name":"Desk Organizers & Stands","slug":"desk-organizers-stands"},"sp_prod_01218":{"name":"Desk Organizers & Stands","slug":"desk-organizers-stands"},"sp_prod_01651":{"name":"Desk Organizers & Stands","slug":"desk-organizers-stands"},"sp_prod_01652":{"name":"Desk Organizers & Stands","slug":"desk-organizers-stands"},"sp_prod_01653":{"name":"Desk Organizers & Stands","slug":"desk-organizers-stands"},"sp_prod_02774":{"name":"Desk Organizers & Stands","slug":"desk-organizers-stands"},"sp_prod_02874":{"name":"Desk Organizers & Stands","slug":"desk-organizers-stands"},"sp_prod_03075":{"name":"Desk Organizers & Stands","slug":"desk-organizers-stands"},"sp_prod_03417":{"name":"Desk Organizers & Stands","slug":"desk-organizers-stands"},"sp_prod_03496":{"name":"Desk Organizers & Stands","slug":"desk-organizers-stands"},"sp_prod_03499":{"name":"Desk Organizers & Stands","slug":"desk-organizers-stands"},"sp_prod_03502":{"name":"Desk Organizers & Stands","slug":"desk-organizers-stands"},"sp_prod_03503":{"name":"Desk Organizers & Stands","slug":"desk-organizers-stands"},"sp_prod_04855":{"name":"Desk Organizers & Stands","slug":"desk-organizers-stands"},"sp_prod_04857":{"name":"Desk Organizers & Stands","slug":"desk-organizers-stands"},"sp_prod_04858":{"name":"Desk Organizers & Stands","slug":"desk-organizers-stands"},"sp_prod_04864":{"name":"Desk Organizers & Stands","slug":"desk-organizers-stands"},"sp_prod_04874":{"name":"Desk Organizers & Stands","slug":"desk-organizers-stands"},"sp_prod_04880":{"name":"Desk Organizers & Stands","slug":"desk-organizers-stands"},"sp_prod_04881":{"name":"Desk Organizers & Stands","slug":"desk-organizers-stands"},"sp_prod_04973":{"name":"Desk Organizers & Stands","slug":"desk-organizers-stands"},"sp_prod_04999":{"name":"Desk Organizers & Stands","slug":"desk-organizers-stands"},"sp_prod_05000":{"name":"Desk Organizers & Stands","slug":"desk-organizers-stands"},"sp_prod_05072":{"name":"Desk Organizers & Stands","slug":"desk-organizers-stands"},"sp_prod_05073":{"name":"Desk Organizers & Stands","slug":"desk-organizers-stands"},"sp_prod_05165":{"name":"Desk Organizers & Stands","slug":"desk-organizers-stands"},"sp_prod_05180":{"name":"Desk Organizers & Stands","slug":"desk-organizers-stands"},"sp_prod_05199":{"name":"Desk Organizers & Stands","slug":"desk-organizers-stands"},"sp_prod_05449":{"name":"Desk Organizers & Stands","slug":"desk-organizers-stands"},"sp_prod_05583":{"name":"Desk Organizers & Stands","slug":"desk-organizers-stands"},"sp_prod_01550":{"name":"Desk Organizers & Stands","slug":"desk-organizers-stands"},"sp_prod_03101":{"name":"Desk Organizers & Stands","slug":"desk-organizers-stands"},"sp_prod_03120":{"name":"Desk Organizers & Stands","slug":"desk-organizers-stands"},"sp_prod_03413":{"name":"Desk Organizers & Stands","slug":"desk-organizers-stands"},"sp_prod_03414":{"name":"Desk Organizers & Stands","slug":"desk-organizers-stands"},"sp_prod_03893":{"name":"Desk Organizers & Stands","slug":"desk-organizers-stands"},"sp_prod_05145":{"name":"Desk Organizers & Stands","slug":"desk-organizers-stands"},"sp_prod_05206":{"name":"Desk Organizers & Stands","slug":"desk-organizers-stands"},"sp_prod_05575":{"name":"Desk Organizers & Stands","slug":"desk-organizers-stands"},"sp_prod_00431":{"name":"Wallets, Cardholders & Pouches","slug":"wallets-cardholders-pouches"},"sp_prod_00667":{"name":"Wallets, Cardholders & Pouches","slug":"wallets-cardholders-pouches"},"sp_prod_00668":{"name":"Wallets, Cardholders & Pouches","slug":"wallets-cardholders-pouches"},"sp_prod_01818":{"name":"Wallets, Cardholders & Pouches","slug":"wallets-cardholders-pouches"},"sp_prod_01819":{"name":"Wallets, Cardholders & Pouches","slug":"wallets-cardholders-pouches"},"sp_prod_05099":{"name":"Wallets, Cardholders & Pouches","slug":"wallets-cardholders-pouches"},"sp_prod_05100":{"name":"Wallets, Cardholders & Pouches","slug":"wallets-cardholders-pouches"},"sp_prod_05252":{"name":"Wallets, Cardholders & Pouches","slug":"wallets-cardholders-pouches"},"sp_prod_05337":{"name":"Wallets, Cardholders & Pouches","slug":"wallets-cardholders-pouches"},"sp_prod_05436":{"name":"Wallets, Cardholders & Pouches","slug":"wallets-cardholders-pouches"},"sp_prod_05439":{"name":"Wallets, Cardholders & Pouches","slug":"wallets-cardholders-pouches"},"sp_prod_05440":{"name":"Wallets, Cardholders & Pouches","slug":"wallets-cardholders-pouches"},"sp_prod_05442":{"name":"Wallets, Cardholders & Pouches","slug":"wallets-cardholders-pouches"},"sp_prod_05454":{"name":"Wallets, Cardholders & Pouches","slug":"wallets-cardholders-pouches"},"sp_prod_05456":{"name":"Wallets, Cardholders & Pouches","slug":"wallets-cardholders-pouches"},"sp_prod_05457":{"name":"Wallets, Cardholders & Pouches","slug":"wallets-cardholders-pouches"},"inhouse_0087":{"name":"Wallets, Cardholders & Pouches","slug":"wallets-cardholders-pouches"},"sp_prod_04851":{"name":"Wallets, Cardholders & Pouches","slug":"wallets-cardholders-pouches"},"sp_prod_04988":{"name":"Wallets, Cardholders & Pouches","slug":"wallets-cardholders-pouches"},"sp_prod_00551":{"name":"Dining Sets & Lunch Boxes","slug":"dining-lunch-boxes"},"sp_prod_00892":{"name":"Dining Sets & Lunch Boxes","slug":"dining-lunch-boxes"},"sp_prod_01246":{"name":"Dining Sets & Lunch Boxes","slug":"dining-lunch-boxes"},"sp_prod_01869":{"name":"Dining Sets & Lunch Boxes","slug":"dining-lunch-boxes"},"sp_prod_01871":{"name":"Dining Sets & Lunch Boxes","slug":"dining-lunch-boxes"},"sp_prod_01872":{"name":"Dining Sets & Lunch Boxes","slug":"dining-lunch-boxes"},"sp_prod_01875":{"name":"Dining Sets & Lunch Boxes","slug":"dining-lunch-boxes"},"sp_prod_01876":{"name":"Dining Sets & Lunch Boxes","slug":"dining-lunch-boxes"},"sp_prod_01877":{"name":"Dining Sets & Lunch Boxes","slug":"dining-lunch-boxes"},"sp_prod_03036":{"name":"Dining Sets & Lunch Boxes","slug":"dining-lunch-boxes"},"sp_prod_03063":{"name":"Dining Sets & Lunch Boxes","slug":"dining-lunch-boxes"},"sp_prod_03070":{"name":"Dining Sets & Lunch Boxes","slug":"dining-lunch-boxes"},"sp_prod_03071":{"name":"Dining Sets & Lunch Boxes","slug":"dining-lunch-boxes"},"sp_prod_03072":{"name":"Dining Sets & Lunch Boxes","slug":"dining-lunch-boxes"},"sp_prod_03073":{"name":"Dining Sets & Lunch Boxes","slug":"dining-lunch-boxes"},"sp_prod_03118":{"name":"Dining Sets & Lunch Boxes","slug":"dining-lunch-boxes"},"sp_prod_03119":{"name":"Dining Sets & Lunch Boxes","slug":"dining-lunch-boxes"},"sp_prod_03124":{"name":"Dining Sets & Lunch Boxes","slug":"dining-lunch-boxes"},"sp_prod_03206":{"name":"Dining Sets & Lunch Boxes","slug":"dining-lunch-boxes"},"sp_prod_03208":{"name":"Dining Sets & Lunch Boxes","slug":"dining-lunch-boxes"},"sp_prod_03354":{"name":"Dining Sets & Lunch Boxes","slug":"dining-lunch-boxes"},"sp_prod_03357":{"name":"Dining Sets & Lunch Boxes","slug":"dining-lunch-boxes"},"sp_prod_03364":{"name":"Dining Sets & Lunch Boxes","slug":"dining-lunch-boxes"},"sp_prod_03373":{"name":"Dining Sets & Lunch Boxes","slug":"dining-lunch-boxes"},"sp_prod_03374":{"name":"Dining Sets & Lunch Boxes","slug":"dining-lunch-boxes"},"sp_prod_03377":{"name":"Dining Sets & Lunch Boxes","slug":"dining-lunch-boxes"},"sp_prod_03378":{"name":"Dining Sets & Lunch Boxes","slug":"dining-lunch-boxes"},"sp_prod_03379":{"name":"Dining Sets & Lunch Boxes","slug":"dining-lunch-boxes"},"sp_prod_04890":{"name":"Dining Sets & Lunch Boxes","slug":"dining-lunch-boxes"},"sp_prod_04917":{"name":"Dining Sets & Lunch Boxes","slug":"dining-lunch-boxes"},"sp_prod_05557":{"name":"Dining Sets & Lunch Boxes","slug":"dining-lunch-boxes"},"sp_prod_03102":{"name":"Dining Sets & Lunch Boxes","slug":"dining-lunch-boxes"},"sp_prod_03103":{"name":"Dining Sets & Lunch Boxes","slug":"dining-lunch-boxes"},"sp_prod_03104":{"name":"Dining Sets & Lunch Boxes","slug":"dining-lunch-boxes"},"sp_prod_03105":{"name":"Dining Sets & Lunch Boxes","slug":"dining-lunch-boxes"},"sp_prod_03106":{"name":"Dining Sets & Lunch Boxes","slug":"dining-lunch-boxes"},"sp_prod_03107":{"name":"Dining Sets & Lunch Boxes","slug":"dining-lunch-boxes"},"sp_prod_03108":{"name":"Dining Sets & Lunch Boxes","slug":"dining-lunch-boxes"},"sp_prod_03122":{"name":"Dining Sets & Lunch Boxes","slug":"dining-lunch-boxes"},"sp_prod_03439":{"name":"Dining Sets & Lunch Boxes","slug":"dining-lunch-boxes"},"sp_prod_03446":{"name":"Dining Sets & Lunch Boxes","slug":"dining-lunch-boxes"},"sp_prod_03448":{"name":"Dining Sets & Lunch Boxes","slug":"dining-lunch-boxes"},"sp_prod_04889":{"name":"Dining Sets & Lunch Boxes","slug":"dining-lunch-boxes"},"sp_prod_00552":{"name":"Festive Hampers & Gourmet Foods","slug":"festive-hampers-gourmet"},"sp_prod_00609":{"name":"Festive Hampers & Gourmet Foods","slug":"festive-hampers-gourmet"},"sp_prod_00610":{"name":"Festive Hampers & Gourmet Foods","slug":"festive-hampers-gourmet"},"sp_prod_00611":{"name":"Festive Hampers & Gourmet Foods","slug":"festive-hampers-gourmet"},"sp_prod_00624":{"name":"Festive Hampers & Gourmet Foods","slug":"festive-hampers-gourmet"},"sp_prod_00628":{"name":"Festive Hampers & Gourmet Foods","slug":"festive-hampers-gourmet"},"sp_prod_00636":{"name":"Festive Hampers & Gourmet Foods","slug":"festive-hampers-gourmet"},"sp_prod_00652":{"name":"Festive Hampers & Gourmet Foods","slug":"festive-hampers-gourmet"},"sp_prod_02817":{"name":"Festive Hampers & Gourmet Foods","slug":"festive-hampers-gourmet"},"sp_prod_04691":{"name":"Festive Hampers & Gourmet Foods","slug":"festive-hampers-gourmet"},"sp_prod_04692":{"name":"Festive Hampers & Gourmet Foods","slug":"festive-hampers-gourmet"},"sp_prod_04693":{"name":"Festive Hampers & Gourmet Foods","slug":"festive-hampers-gourmet"},"sp_prod_04885":{"name":"Festive Hampers & Gourmet Foods","slug":"festive-hampers-gourmet"},"sp_prod_04887":{"name":"Festive Hampers & Gourmet Foods","slug":"festive-hampers-gourmet"},"sp_prod_05510":{"name":"Festive Hampers & Gourmet Foods","slug":"festive-hampers-gourmet"},"sp_prod_05546":{"name":"Festive Hampers & Gourmet Foods","slug":"festive-hampers-gourmet"},"sp_prod_00626":{"name":"Festive Hampers & Gourmet Foods","slug":"festive-hampers-gourmet"},"sp_prod_00633":{"name":"Festive Hampers & Gourmet Foods","slug":"festive-hampers-gourmet"},"sp_prod_00617":{"name":"Gift Hampers Packaging & Baskets","slug":"hamper-packaging-baskets"},"sp_prod_01756":{"name":"Gift Hampers Packaging & Baskets","slug":"hamper-packaging-baskets"},"sp_prod_01757":{"name":"Gift Hampers Packaging & Baskets","slug":"hamper-packaging-baskets"},"sp_prod_03640":{"name":"Gift Hampers Packaging & Baskets","slug":"hamper-packaging-baskets"},"sp_prod_04707":{"name":"Gift Hampers Packaging & Baskets","slug":"hamper-packaging-baskets"},"sp_prod_05164":{"name":"Gift Hampers Packaging & Baskets","slug":"hamper-packaging-baskets"},"sp_prod_05302":{"name":"Gift Hampers Packaging & Baskets","slug":"hamper-packaging-baskets"},"sp_prod_05308":{"name":"Gift Hampers Packaging & Baskets","slug":"hamper-packaging-baskets"},"sp_prod_05313":{"name":"Gift Hampers Packaging & Baskets","slug":"hamper-packaging-baskets"},"sp_prod_05322":{"name":"Gift Hampers Packaging & Baskets","slug":"hamper-packaging-baskets"},"sp_prod_05326":{"name":"Gift Hampers Packaging & Baskets","slug":"hamper-packaging-baskets"},"sp_prod_05381":{"name":"Gift Hampers Packaging & Baskets","slug":"hamper-packaging-baskets"},"sp_prod_05431":{"name":"Gift Hampers Packaging & Baskets","slug":"hamper-packaging-baskets"},"sp_prod_04465":{"name":"Gift Hampers Packaging & Baskets","slug":"hamper-packaging-baskets"},"sp_prod_04729":{"name":"Gift Hampers Packaging & Baskets","slug":"hamper-packaging-baskets"},"sp_prod_05181":{"name":"Gift Hampers Packaging & Baskets","slug":"hamper-packaging-baskets"},"sp_prod_05293":{"name":"Gift Hampers Packaging & Baskets","slug":"hamper-packaging-baskets"},"sp_prod_00830":{"name":"Home Appliances & Cookware","slug":"home-appliances-cookware"},"sp_prod_00909":{"name":"Home Appliances & Cookware","slug":"home-appliances-cookware"},"sp_prod_00910":{"name":"Home Appliances & Cookware","slug":"home-appliances-cookware"},"sp_prod_01179":{"name":"Home Appliances & Cookware","slug":"home-appliances-cookware"},"sp_prod_01183":{"name":"Home Appliances & Cookware","slug":"home-appliances-cookware"},"sp_prod_01245":{"name":"Home Appliances & Cookware","slug":"home-appliances-cookware"},"sp_prod_01805":{"name":"Home Appliances & Cookware","slug":"home-appliances-cookware"},"sp_prod_02310":{"name":"Home Appliances & Cookware","slug":"home-appliances-cookware"},"sp_prod_02622":{"name":"Home Appliances & Cookware","slug":"home-appliances-cookware"},"sp_prod_02624":{"name":"Home Appliances & Cookware","slug":"home-appliances-cookware"},"sp_prod_02686":{"name":"Home Appliances & Cookware","slug":"home-appliances-cookware"},"sp_prod_02792":{"name":"Home Appliances & Cookware","slug":"home-appliances-cookware"},"sp_prod_02990":{"name":"Home Appliances & Cookware","slug":"home-appliances-cookware"},"sp_prod_03339":{"name":"Home Appliances & Cookware","slug":"home-appliances-cookware"},"sp_prod_03751":{"name":"Home Appliances & Cookware","slug":"home-appliances-cookware"},"sp_prod_03753":{"name":"Home Appliances & Cookware","slug":"home-appliances-cookware"},"sp_prod_03761":{"name":"Home Appliances & Cookware","slug":"home-appliances-cookware"},"sp_prod_03819":{"name":"Home Appliances & Cookware","slug":"home-appliances-cookware"},"sp_prod_03821":{"name":"Home Appliances & Cookware","slug":"home-appliances-cookware"},"sp_prod_03827":{"name":"Home Appliances & Cookware","slug":"home-appliances-cookware"},"sp_prod_04924":{"name":"Home Appliances & Cookware","slug":"home-appliances-cookware"},"sp_prod_04932":{"name":"Home Appliances & Cookware","slug":"home-appliances-cookware"},"sp_prod_05474":{"name":"Home Appliances & Cookware","slug":"home-appliances-cookware"},"sp_prod_05518":{"name":"Home Appliances & Cookware","slug":"home-appliances-cookware"},"sp_prod_05538":{"name":"Home Appliances & Cookware","slug":"home-appliances-cookware"},"sp_prod_05547":{"name":"Home Appliances & Cookware","slug":"home-appliances-cookware"},"sp_prod_05560":{"name":"Home Appliances & Cookware","slug":"home-appliances-cookware"},"sp_prod_00885":{"name":"Mugs, Cups & Glassware","slug":"mugs-cups-glassware"},"sp_prod_01135":{"name":"Mugs, Cups & Glassware","slug":"mugs-cups-glassware"},"sp_prod_01136":{"name":"Mugs, Cups & Glassware","slug":"mugs-cups-glassware"},"sp_prod_01878":{"name":"Mugs, Cups & Glassware","slug":"mugs-cups-glassware"},"sp_prod_03097":{"name":"Mugs, Cups & Glassware","slug":"mugs-cups-glassware"},"sp_prod_03162":{"name":"Mugs, Cups & Glassware","slug":"mugs-cups-glassware"},"sp_prod_03177":{"name":"Mugs, Cups & Glassware","slug":"mugs-cups-glassware"},"sp_prod_03178":{"name":"Mugs, Cups & Glassware","slug":"mugs-cups-glassware"},"sp_prod_03736":{"name":"Mugs, Cups & Glassware","slug":"mugs-cups-glassware"},"sp_prod_03814":{"name":"Mugs, Cups & Glassware","slug":"mugs-cups-glassware"},"sp_prod_05382":{"name":"Mugs, Cups & Glassware","slug":"mugs-cups-glassware"},"sp_prod_03114":{"name":"Mugs, Cups & Glassware","slug":"mugs-cups-glassware"},"sp_prod_03188":{"name":"Mugs, Cups & Glassware","slug":"mugs-cups-glassware"},"sp_prod_03327":{"name":"Mugs, Cups & Glassware","slug":"mugs-cups-glassware"},"sp_prod_03328":{"name":"Mugs, Cups & Glassware","slug":"mugs-cups-glassware"},"sp_prod_03329":{"name":"Mugs, Cups & Glassware","slug":"mugs-cups-glassware"},"sp_prod_00917":{"name":"Copperware & Traditional Metals","slug":"copperware-traditional"},"sp_prod_00919":{"name":"Copperware & Traditional Metals","slug":"copperware-traditional"},"sp_prod_00921":{"name":"Copperware & Traditional Metals","slug":"copperware-traditional"},"sp_prod_01513":{"name":"Copperware & Traditional Metals","slug":"copperware-traditional"},"sp_prod_01514":{"name":"Copperware & Traditional Metals","slug":"copperware-traditional"},"sp_prod_03356":{"name":"Copperware & Traditional Metals","slug":"copperware-traditional"},"sp_prod_03372":{"name":"Copperware & Traditional Metals","slug":"copperware-traditional"},"sp_prod_03454":{"name":"Copperware & Traditional Metals","slug":"copperware-traditional"},"sp_prod_03747":{"name":"Copperware & Traditional Metals","slug":"copperware-traditional"},"sp_prod_04769":{"name":"Copperware & Traditional Metals","slug":"copperware-traditional"},"sp_prod_01019":{"name":"Power & Charging Gadgets","slug":"power-charging"},"sp_prod_01022":{"name":"Power & Charging Gadgets","slug":"power-charging"},"sp_prod_01180":{"name":"Power & Charging Gadgets","slug":"power-charging"},"sp_prod_01181":{"name":"Power & Charging Gadgets","slug":"power-charging"},"sp_prod_01184":{"name":"Power & Charging Gadgets","slug":"power-charging"},"sp_prod_01187":{"name":"Power & Charging Gadgets","slug":"power-charging"},"sp_prod_01191":{"name":"Power & Charging Gadgets","slug":"power-charging"},"sp_prod_01192":{"name":"Power & Charging Gadgets","slug":"power-charging"},"sp_prod_01236":{"name":"Power & Charging Gadgets","slug":"power-charging"},"sp_prod_01239":{"name":"Power & Charging Gadgets","slug":"power-charging"},"sp_prod_02235":{"name":"Power & Charging Gadgets","slug":"power-charging"},"sp_prod_02297":{"name":"Power & Charging Gadgets","slug":"power-charging"},"sp_prod_02301":{"name":"Power & Charging Gadgets","slug":"power-charging"},"sp_prod_02568":{"name":"Power & Charging Gadgets","slug":"power-charging"},"sp_prod_02606":{"name":"Power & Charging Gadgets","slug":"power-charging"},"sp_prod_05101":{"name":"Power & Charging Gadgets","slug":"power-charging"},"sp_prod_05144":{"name":"Power & Charging Gadgets","slug":"power-charging"},"sp_prod_05147":{"name":"Power & Charging Gadgets","slug":"power-charging"},"sp_prod_05154":{"name":"Power & Charging Gadgets","slug":"power-charging"},"sp_prod_05161":{"name":"Power & Charging Gadgets","slug":"power-charging"},"sp_prod_05172":{"name":"Power & Charging Gadgets","slug":"power-charging"},"sp_prod_05178":{"name":"Power & Charging Gadgets","slug":"power-charging"},"sp_prod_05195":{"name":"Power & Charging Gadgets","slug":"power-charging"},"sp_prod_05277":{"name":"Power & Charging Gadgets","slug":"power-charging"},"sp_prod_01182":{"name":"Clocks, Watches & Timepieces","slug":"clocks-watches-timepieces"},"sp_prod_01193":{"name":"Clocks, Watches & Timepieces","slug":"clocks-watches-timepieces"},"sp_prod_01194":{"name":"Clocks, Watches & Timepieces","slug":"clocks-watches-timepieces"},"sp_prod_01196":{"name":"Clocks, Watches & Timepieces","slug":"clocks-watches-timepieces"},"sp_prod_01197":{"name":"Clocks, Watches & Timepieces","slug":"clocks-watches-timepieces"},"sp_prod_01198":{"name":"Clocks, Watches & Timepieces","slug":"clocks-watches-timepieces"},"sp_prod_01199":{"name":"Clocks, Watches & Timepieces","slug":"clocks-watches-timepieces"},"sp_prod_01201":{"name":"Clocks, Watches & Timepieces","slug":"clocks-watches-timepieces"},"sp_prod_01202":{"name":"Clocks, Watches & Timepieces","slug":"clocks-watches-timepieces"},"sp_prod_01208":{"name":"Clocks, Watches & Timepieces","slug":"clocks-watches-timepieces"},"sp_prod_05620":{"name":"Clocks, Watches & Timepieces","slug":"clocks-watches-timepieces"},"sp_prod_00684":{"name":"Clocks, Watches & Timepieces","slug":"clocks-watches-timepieces"},"sp_prod_03874":{"name":"Clocks, Watches & Timepieces","slug":"clocks-watches-timepieces"},"sp_prod_01213":{"name":"Trophies, Awards & Medals","slug":"trophies-awards-medals"},"sp_prod_01214":{"name":"Trophies, Awards & Medals","slug":"trophies-awards-medals"},"sp_prod_01215":{"name":"Trophies, Awards & Medals","slug":"trophies-awards-medals"},"sp_prod_01216":{"name":"Trophies, Awards & Medals","slug":"trophies-awards-medals"},"sp_prod_01219":{"name":"Trophies, Awards & Medals","slug":"trophies-awards-medals"},"sp_prod_01220":{"name":"Trophies, Awards & Medals","slug":"trophies-awards-medals"},"sp_prod_01221":{"name":"Trophies, Awards & Medals","slug":"trophies-awards-medals"},"sp_prod_01431":{"name":"Perfumes, Fragrances & Personal Care","slug":"perfumes-fragrances-grooming"},"sp_prod_01491":{"name":"Perfumes, Fragrances & Personal Care","slug":"perfumes-fragrances-grooming"},"sp_prod_05087":{"name":"Perfumes, Fragrances & Personal Care","slug":"perfumes-fragrances-grooming"},"sp_prod_05089":{"name":"Perfumes, Fragrances & Personal Care","slug":"perfumes-fragrances-grooming"},"sp_prod_05096":{"name":"Perfumes, Fragrances & Personal Care","slug":"perfumes-fragrances-grooming"},"sp_prod_05506":{"name":"Perfumes, Fragrances & Personal Care","slug":"perfumes-fragrances-grooming"},"sp_prod_05572":{"name":"Perfumes, Fragrances & Personal Care","slug":"perfumes-fragrances-grooming"},"sp_prod_05632":{"name":"Perfumes, Fragrances & Personal Care","slug":"perfumes-fragrances-grooming"},"sp_prod_05104":{"name":"Perfumes, Fragrances & Personal Care","slug":"perfumes-fragrances-grooming"},"sp_prod_01473":{"name":"Corporate Apparel & Wearables","slug":"corporate-apparel-wearables"},"sp_prod_01474":{"name":"Corporate Apparel & Wearables","slug":"corporate-apparel-wearables"},"sp_prod_01475":{"name":"Corporate Apparel & Wearables","slug":"corporate-apparel-wearables"},"sp_prod_01476":{"name":"Corporate Apparel & Wearables","slug":"corporate-apparel-wearables"},"sp_prod_05296":{"name":"Corporate Apparel & Wearables","slug":"corporate-apparel-wearables"},"sp_prod_05513":{"name":"Corporate Apparel & Wearables","slug":"corporate-apparel-wearables"},"sp_prod_05610":{"name":"Corporate Apparel & Wearables","slug":"corporate-apparel-wearables"},"sp_prod_01852":{"name":"Silver, Brass & Metallic Artifacts","slug":"silver-brass-artifacts"},"sp_prod_03505":{"name":"Silver, Brass & Metallic Artifacts","slug":"silver-brass-artifacts"},"sp_prod_03506":{"name":"Silver, Brass & Metallic Artifacts","slug":"silver-brass-artifacts"},"sp_prod_03507":{"name":"Silver, Brass & Metallic Artifacts","slug":"silver-brass-artifacts"},"sp_prod_03508":{"name":"Silver, Brass & Metallic Artifacts","slug":"silver-brass-artifacts"},"sp_prod_03509":{"name":"Silver, Brass & Metallic Artifacts","slug":"silver-brass-artifacts"},"sp_prod_03510":{"name":"Silver, Brass & Metallic Artifacts","slug":"silver-brass-artifacts"},"sp_prod_04081":{"name":"Silver, Brass & Metallic Artifacts","slug":"silver-brass-artifacts"},"sp_prod_04677":{"name":"Silver, Brass & Metallic Artifacts","slug":"silver-brass-artifacts"},"sp_prod_01742":{"name":"Silver, Brass & Metallic Artifacts","slug":"silver-brass-artifacts"},"sp_prod_02919":{"name":"Silver, Brass & Metallic Artifacts","slug":"silver-brass-artifacts"},"sp_prod_02920":{"name":"Silver, Brass & Metallic Artifacts","slug":"silver-brass-artifacts"},"sp_prod_02922":{"name":"Silver, Brass & Metallic Artifacts","slug":"silver-brass-artifacts"},"sp_prod_04548":{"name":"Silver, Brass & Metallic Artifacts","slug":"silver-brass-artifacts"},"sp_prod_03195":{"name":"Barware & Cocktail Sets","slug":"barware-cocktail"},"sp_prod_04834":{"name":"Pens & Luxury Writing","slug":"pens-luxury-writing"},"sp_prod_04839":{"name":"Pens & Luxury Writing","slug":"pens-luxury-writing"},"sp_prod_04841":{"name":"Pens & Luxury Writing","slug":"pens-luxury-writing"},"sp_prod_05265":{"name":"Pens & Luxury Writing","slug":"pens-luxury-writing"},"sp_prod_05288":{"name":"Pens & Luxury Writing","slug":"pens-luxury-writing"},"sp_prod_05338":{"name":"Pens & Luxury Writing","slug":"pens-luxury-writing"},"sp_prod_05388":{"name":"Pens & Luxury Writing","slug":"pens-luxury-writing"},"sp_prod_05399":{"name":"Pens & Luxury Writing","slug":"pens-luxury-writing"},"sp_prod_05400":{"name":"Pens & Luxury Writing","slug":"pens-luxury-writing"},"sp_prod_05405":{"name":"Pens & Luxury Writing","slug":"pens-luxury-writing"},"sp_prod_05408":{"name":"Pens & Luxury Writing","slug":"pens-luxury-writing"},"sp_prod_05410":{"name":"Pens & Luxury Writing","slug":"pens-luxury-writing"},"sp_prod_04842":{"name":"Pens & Luxury Writing","slug":"pens-luxury-writing"},"sp_prod_05179":{"name":"Diaries, Notebooks & Planners","slug":"diaries-notebooks-planners"},"sp_prod_05363":{"name":"Diaries, Notebooks & Planners","slug":"diaries-notebooks-planners"},"sp_prod_05578":{"name":"Diaries, Notebooks & Planners","slug":"diaries-notebooks-planners"},"sp_prod_04946":{"name":"Diaries, Notebooks & Planners","slug":"diaries-notebooks-planners"},"sp_prod_04954":{"name":"Diaries, Notebooks & Planners","slug":"diaries-notebooks-planners"},"sp_prod_05291":{"name":"Employee Onboarding Kits","slug":"employee-onboarding-kits"},"sp_prod_05299":{"name":"Employee Onboarding Kits","slug":"employee-onboarding-kits"},"sp_prod_01124":{"name":"Employee Onboarding Kits","slug":"employee-onboarding-kits"},"sp_prod_05479":{"name":"Employee Onboarding Kits","slug":"employee-onboarding-kits"},"inhouse_0157":{"name":"Plush, Keychains & Fun Gifts","slug":"plush-keychains-fun-gifts"}};
function hydrateCatalog(data){
  if(!Array.isArray(data)||!data.length)return;
  try{
    const ihn={},ihc={};
    IH.forEach(p=>{ihn[p.sku]=p.n;ihc[p.sku]=p.c});
    P=data.filter(d=>!REMOVED_PRODUCT_IMAGE_NAMES.has(String(d.image||'').split('/').pop().split(/[?#]/)[0])).map(d=>{
      const ih=d.type=='inhouse',sku=d.model||d.sku,fix=CATEGORY_FIX[d.id];
      if(fix){d.category_name=fix.name;d.category_slug=fix.slug;d.category=fix.slug;if(ih)ihc[sku]=fix.name;}
      const im=window.PRODUCT_IMAGES_BY_ID&&window.PRODUCT_IMAGES_BY_ID[d.id];
      const finalSku=ih?d.model:(d.sku||d.model);
      const item={
        u:im&&im.original||d.image,
        tu:im&&(im.thumbnail||im.original)||d.image,
        n:ih&&ihn[sku]?ihn[sku]:d.name,
        c:fix?fix.name:(ih&&ihc[sku]?ihc[sku]:d.category_name),
        b:d.brand,
        id:d.id,
        description:resolveDesc(d.id,d.sku,d.model,d),
        pr:ih?'':(d.price||''),
        ih:ih?1:0,
        sku:finalSku
      };
      item._s=makeSearchText(item);
      return item;
    });
    chips();
    draw();
    if(dlg.open&&curP){
      const updated=P.find(x=>x.sku===curP.sku||x.id===curP.id);
      if(updated)fillP(updated);
    }
  }catch(e){}
}
function loadScriptWithFallback(file,onReady){
  const urls=[file,...REMOTE_BASES.map(b=>b+file)];
  let idx=0;
  const next=()=>{
    if(idx>=urls.length)return;
    const s=document.createElement('script');
    s.src=urls[idx++];
    s.onload=()=>onReady&&onReady();
    s.onerror=next;
    document.head.appendChild(s);
  };
  next();
}
loadScriptWithFallback('catalog_data.js',()=>{if(window.CATALOG_DATA)hydrateCatalog(window.CATALOG_DATA)});
if(REMOTE_BASES.length){
  const refreshAll=()=>{
    if(window.CATALOG_DATA){hydrateCatalog(window.CATALOG_DATA);return}
    IH.forEach(p=>{p.description=resolveDesc(p.id,p.sku,p.sku,null);p._s=makeSearchText(p)});
    if(dlg.open&&curP)fillP(curP);
  };
  if(!window.PRODUCT_DESCRIPTIONS_BY_ID&&!window.PRODUCT_DESCRIPTIONS_BY_SKU){
    loadScriptWithFallback('product_descriptions.js',refreshAll);
  }
  if(!window.PRODUCT_IMAGES_BY_ID){
    loadScriptWithFallback('product_images.js',refreshAll);
  }
}
/* creative layer */
(()=>{const T=THREE,rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
mq();
const rs=$('#rs'),FE_ALL=[101,107,114,131,128,133,145,163,1,19,125,91,14,45,63,95,90,140,170,167].map(n=>IH[n-1]);
const FE=FE_ALL,ringStep=360/FE.length;
let ringRadius=Math.min(620,170/(2*Math.sin(Math.PI/FE.length))+14);
rs.innerHTML=FE.map((p,i)=>`<img data-s="${p.sku}" alt="${p.n}" src="${p.u}" loading="lazy" decoding="async" style="transform:rotateY(${i*ringStep}deg) translateZ(${ringRadius}px)" draggable="false">`).join('');
const repositionRing=()=>rs.querySelectorAll('img').forEach((im,i)=>{im.style.transform=`rotateY(${i*ringStep}deg) translateZ(${ringRadius}px)`});
let ra=0,rv=rm?0:.12,dr=0,lx=0,mv=0,mx=0,my=0,tx=0,ty=0,cx=0,cy=0,ss=0,ov=0,hot=0;
rs.onpointerdown=e=>{dr=1;lx=e.clientX;mv=0};
addEventListener('pointerup',()=>dr=0);
addEventListener('pointermove',e=>{mx=e.clientX/innerWidth*2-1;my=e.clientY/innerHeight*2-1;tx=e.clientX;ty=e.clientY;ov=e.target.closest&&e.target.closest('#cbw,dialog,#slTray,#slDrawer')?1:0;hot=e.target.closest&&e.target.closest('a,button,.card,.v,.bt,.oc-t,input,select,label')?1:0;if(dr){const d=e.clientX-lx;lx=e.clientX;mv+=Math.abs(d);ra+=d*.4;rv=d*.1}});
rs.onclick=e=>{const i=e.target.closest('img');if(i&&mv<6)openP(P.find(x=>x.sku==i.dataset.s))};
const io=new IntersectionObserver(a=>a.forEach(e=>e.isIntersecting&&e.target.classList.add('in')));
document.querySelectorAll('h2,.sub,.rv').forEach(e=>{e.classList.add('rv');io.observe(e)});
document.querySelectorAll('.btn').forEach(b=>{b.onmousemove=e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.25}px,${(e.clientY-r.top-r.height/2)*.4}px)`};b.onmouseleave=()=>b.style.transform=''});
let R;try{R=new T.WebGLRenderer({canvas:$('#gl'),alpha:true,antialias:true})}catch(e){}
const sc=new T.Scene(),cam=new T.PerspectiveCamera(40,1,.1,50);cam.position.z=9;sc.add(new T.AmbientLight(0xffffff,.8));const pl=new T.PointLight(0xffffff,1.2);pl.position.set(3,4,6);sc.add(pl);
document.querySelector('#flg').src=document.querySelector('nav img').src;const IMG=$('#cur img');let B=null;const S=[];
function build(){const W=4.2,H=W*375/545,fr=[[0,.44],[.44,.56],[.56,1]],gm=fr.map(([a,b])=>{const t=new T.Texture(IMG);t.needsUpdate=true;t.repeat.set(b-a,1);t.offset.set(a,0);t.anisotropy=4;return{g:new T.PlaneGeometry(W*(b-a),H),m:new T.MeshBasicMaterial({map:t,transparent:true,alphaTest:.03,side:T.DoubleSide})}});
const gh=gm.map(o=>{const m=o.m.clone();m.opacity=.5;m.depthWrite=false;return{g:o.g,m}});
function bf(G=gm){const g=new T.Group(),w=[];g.add(new T.Mesh(G[1].g,G[1].m));[[0,-1],[2,1]].forEach(([i,s])=>{const p=new T.Group(),m=new T.Mesh(G[i].g,G[i].m);p.position.x=s*W*.06;m.position.x=s*W*(fr[i][1]-fr[i][0])/2;p.add(m);g.add(p);w.push([p,s])});g.userData.w=w;return g}
B=bf();
if(!rm)for(let i=0;i<16;i++){const s=bf(gh);s.scale.setScalar(.06+Math.random()*.1);s.userData.p=[Math.random()*6.3,(Math.random()-.5)*3,(Math.random()-.5)*8,Math.random()*9];sc.add(s);S.push(s)}}
IMG.complete&&IMG.naturalWidth?build():IMG.addEventListener('load',build);
const N=160,pp=new Float32Array(N*3),pc=new Float32Array(N*3),pv=[],lf=new Float32Array(N),cl=[[.42,.22,.58],[.69,.28,.6],[.94,.3,.22],[.93,.8,.2]],pg=new T.BufferGeometry();let pi=0;
pg.setAttribute('position',new T.BufferAttribute(pp,3));pg.setAttribute('color',new T.BufferAttribute(pc,3));
const pt=new T.Points(pg,new T.PointsMaterial({size:.14,vertexColors:true,transparent:true,depthWrite:false}));pt.frustumCulled=false;sc.add(pt);
function fit(){if(!R)return;R.setPixelRatio(Math.min(devicePixelRatio,2));R.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()}
addEventListener('resize',fit);fit();
const fl=(g,t,sp)=>g.userData.w.forEach(([p,s])=>p.rotation.y=-s*(.15+(Math.sin(t*sp)+1)*.55)),cu=$('#cur'),pb=$('#pb');
const dc=document.createElement('canvas');dc.id='dust';document.body.appendChild(dc);const dx=dc.getContext('2d'),DD=[],dcl=['#6a3a94','#b14a98','#ef4b3a','#eed232','#ff9a1f'],hov=matchMedia('(hover:hover)').matches;
function dfit(){dc.width=innerWidth;dc.height=innerHeight}addEventListener('resize',dfit);dfit();
function dust(sp){if(!hov)return;for(let n=Math.min(4,Math.floor(sp/5));n>0;n--)DD.push({x:cx+(Math.random()-.5)*14,y:cy+4+Math.random()*8,vx:(Math.random()-.5)*.8,vy:.3+Math.random()*.9,z:2.5+Math.random()*3,l:1,c:dcl[Math.random()*5|0]});
dx.clearRect(0,0,dc.width,dc.height);for(let i=DD.length-1;i>=0;i--){const p=DD[i];p.x+=p.vx;p.y+=p.vy;p.l-=.016;if(p.l<=0){DD.splice(i,1);continue}dx.globalAlpha=p.l;dx.fillStyle=p.c;dx.fillRect(p.x,p.y,p.z,p.z)}dx.globalAlpha=1}
(function a(t){requestAnimationFrame(a);t/=1000;ss+=(scrollY-ss)*.08;
pb.style.width=scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)*100+'%';
if(!dr)ra+=rv,rv+=((rm?0:.12)-rv)*.02;const rsc=Math.max(.52,Math.min(1.35,innerWidth/1250)),rz=Math.min(620,170/(2*Math.sin(Math.PI/FE.length))+14);if(Math.abs(rz-ringRadius)>1){ringRadius=rz;repositionRing()}rs.parentElement.style.height=Math.round(Math.max(540,620*rsc))+'px';rs.style.transform=`scale(${rsc}) rotateX(-8deg) rotateY(${ra}deg)`;
if(!rm){const vx=tx-cx,sp=Math.hypot(vx,ty-cy);cx+=vx*.16;cy+=(ty-cy)*.16;dust(ov?0:sp);cu.style.opacity=ov?0:1;cu.style.transform=`translate(${cx-13}px,${cy-13}px) rotate(${Math.max(-35,Math.min(35,vx*.6))}deg) scale(${hot?1.5:1})`}
if(!R||!B)return;
const w=innerWidth>800,s=Math.min(ss/innerHeight,1),X=w?3.3:1.1;
fl(B,rm?0:t,7);B.scale.setScalar(1.05-.4*s);
B.position.set(X*Math.cos(ss*.0022),(w?0:-2.3*(1-s))+Math.sin(ss*.0017)*(w?1.2:.6)*s+(rm?0:Math.sin(t*1.6)*.25),0);
B.rotation.y+=((mx*.6)-B.rotation.y)*.05;B.rotation.x+=((.35+my*.3)-B.rotation.x)*.05;B.rotation.z=Math.sin(ss*.0022)*.35+(rm?0:Math.sin(t)*.08);
if(!rm){
for(let i=0;i<N;i++){const c=cl[i%4],l=Math.max(lf[i],0);if(lf[i]>0){lf[i]-=.012;for(let d=0;d<3;d++)pp[i*3+d]+=pv[i][d]}pc[i*3]=c[0]*l+.984*(1-l);pc[i*3+1]=c[1]*l+.973*(1-l);pc[i*3+2]=c[2]*l+(1-l)}
pg.attributes.position.needsUpdate=pg.attributes.color.needsUpdate=true;
S.forEach(m=>{const d=m.userData.p,q=d[0]+t*.25+d[3];m.position.set(Math.cos(q)*5.5,Math.sin(q*1.3)*2.6+d[1],d[2]);m.rotation.set(.5,Math.cos(q)*-.8,Math.sin(q)*.3);fl(m,t+d[3],9)})}
R.render(sc,cam)})(0)})();

;
(()=>{const ab=document.querySelector('#about');if(!ab)return;const src=document.querySelector('#cur img').src;ab.querySelectorAll('.eyb img,.abf').forEach(i=>i.src=src);
ab.querySelectorAll('.vi').forEach(i=>{i.loading='lazy';i.decoding='async';i.onload=()=>i.classList.add('ld');i.onerror=()=>{i.parentElement.classList.add('noimg');i.remove()};i.src=IH[+i.dataset.n-1].u});const abBg=ab.querySelector('.ab-bg');let bgRaf=0,bmx=0,bmy=0;
ab.addEventListener('pointermove',e=>{if(!abBg)return;const r=ab.getBoundingClientRect();bmx=(e.clientX-r.left)/r.width-.5;bmy=(e.clientY-r.top)/r.height-.5;if(!bgRaf)bgRaf=requestAnimationFrame(()=>{abBg.style.setProperty('--mx',bmx.toFixed(3));abBg.style.setProperty('--my',bmy.toFixed(3));bgRaf=0})},{passive:true});
const vals=ab.querySelector('.vals'),V=[...ab.querySelectorAll('.v')];
const syncVals=()=>{if(!vals)return;if(innerWidth<=800){vals.style.removeProperty('--cw');V.forEach(v=>v.style.removeProperty('--shift'));return}const w=vals.clientWidth;if(!w)return;const gap=parseFloat(getComputedStyle(vals).columnGap)||14,pad=parseFloat(getComputedStyle(V[0]).paddingLeft)||26,cw=Math.min(840,Math.max(220,Math.floor((w-gap*(V.length-1))*(2.5/(2.5+V.length-1))-pad*2)));vals.style.setProperty('--cw',cw+'px');V.forEach(v=>{const vb=v.querySelector('.vb'),h3=v.querySelector('h3');if(vb&&h3)v.style.setProperty('--shift',Math.max(0,vb.offsetHeight-(h3.offsetTop+h3.offsetHeight))+'px')})};
const activateV=idx=>{if(vals)vals.dataset.active=idx;V.forEach((x,i)=>x.classList.toggle('on',i===idx))};
V.forEach((v,i)=>{v.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch')activateV(i)});v.addEventListener('click',()=>activateV(i));v.addEventListener('focus',()=>activateV(i))});
activateV(0);syncVals();if('ResizeObserver'in window&&vals)new ResizeObserver(syncVals).observe(vals);addEventListener('resize',syncVals,{passive:true});if(document.fonts&&document.fonts.ready)document.fonts.ready.then(syncVals);
const vPhotos=[...ab.querySelectorAll('.v .v-photo')];
const bindVPhoto=im=>{const card=im.closest('.v');if(!card)return;const ok=()=>{if(im.naturalWidth>0){im.style.display='';card.classList.add('has-photo')}};const fail=()=>{card.classList.remove('has-photo');im.style.display='none'};im.addEventListener('load',ok);im.addEventListener('error',fail);if(im.complete){im.naturalWidth>0?ok():fail()}};
vPhotos.forEach(bindVPhoto);
if(location.protocol==='file:'){const vt=ab.querySelector('.ab-vt');if(vt){const bar=document.createElement('span');bar.className='val-preview-bar';const inp=document.createElement('input');inp.type='file';inp.accept='image/*';inp.multiple=true;inp.hidden=true;const btn=document.createElement('button');btn.type='button';btn.className='val-preview-btn';btn.textContent='Test local photos (pick up to 4)';btn.onclick=()=>inp.click();const rst=document.createElement('button');rst.type='button';rst.className='val-preview-btn';rst.textContent='Reset';rst.hidden=true;const defSrcs=vPhotos.map(im=>im.getAttribute('src'));const urls=[];inp.onchange=()=>{const files=[...inp.files].slice(0,vPhotos.length);if(!files.length)return;files.forEach((f,idx)=>{const u=URL.createObjectURL(f);urls.push(u);vPhotos[idx].style.display='';vPhotos[idx].src=u});rst.hidden=false;inp.value=''};rst.onclick=()=>{urls.splice(0).forEach(u=>URL.revokeObjectURL(u));vPhotos.forEach((im,idx)=>{im.closest('.v').classList.remove('has-photo');im.style.display='';im.src=defSrcs[idx]});rst.hidden=true};bar.append(btn,rst,inp);vt.appendChild(bar)}}
const stRm=matchMedia('(prefers-reduced-motion:reduce)').matches,stHov=matchMedia('(hover:hover) and (pointer:fine)').matches;
if(!stRm&&stHov)ab.querySelectorAll('.st').forEach(t=>{const parent=t.parentElement;t.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const pr=parent.getBoundingClientRect(),l=pr.left+t.offsetLeft,tp=pr.top+t.offsetTop,w=t.offsetWidth||1,h=t.offsetHeight||1,x=Math.max(0,Math.min(1,(e.clientX-l)/w))-.5,y=Math.max(0,Math.min(1,(e.clientY-tp)/h))-.5,rx=(-y*22).toFixed(2),ry=(x*22).toFixed(2);t.classList.add('is-tilting');t.style.setProperty('--rx',rx);t.style.setProperty('--ry',ry);t.style.transform=`perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px) scale3d(1.03,1.03,1)`},{passive:true});const clr=()=>{t.classList.remove('is-tilting');t.style.transform='';t.style.removeProperty('--rx');t.style.removeProperty('--ry')};t.addEventListener('pointerleave',clr);t.addEventListener('pointercancel',clr)});
const io=new IntersectionObserver(a=>a.forEach(e=>{if(!e.isIntersecting)return;io.unobserve(e.target);const el=e.target,n=+el.dataset.c,sf=el.dataset.s||'',t0=performance.now();(function f(t){const k=Math.min(1,(t-t0)/1600),v=Math.round(n*(1-Math.pow(1-k,3)));el.textContent=v.toLocaleString('en-IN')+sf;if(k<1)requestAnimationFrame(f)})(t0)}),{threshold:.6});
ab.querySelectorAll('[data-c]').forEach(e=>io.observe(e))})();

;
(()=>{const b=document.querySelector('#cpy');if(!b)return;b.onclick=async()=>{const t=document.querySelector('#gst').textContent;try{await navigator.clipboard.writeText(t)}catch(e){const r=document.createRange();r.selectNode(document.querySelector('#gst'));getSelection().removeAllRanges();getSelection().addRange(r);try{document.execCommand('copy')}catch(_){}}b.textContent='Copied ✓';b.classList.add('ok');setTimeout(()=>{b.textContent='Copy';b.classList.remove('ok')},1800)}})();

;
(()=>{const hv=document.querySelector('#hv');if(!hv)return;hv.querySelectorAll('.hc').forEach(b=>{const p=IH[+b.dataset.n-1];b.querySelector('img').onerror=()=>b.classList.add('nf');b.querySelector('img').src=p.u;b.querySelector('img').alt=p.n;b.title=p.n;b.onclick=()=>openP(p)});
addEventListener('pointermove',e=>{hv.style.setProperty('--px',(e.clientX/innerWidth-.5).toFixed(2));hv.style.setProperty('--py',(e.clientY/innerHeight-.5).toFixed(2))})})();
