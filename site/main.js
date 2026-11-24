(function(){
  var WA='573244365116';
  /* Age gate (unchanged behaviour from v3) */
  var KEY='iceluck_age_ok_18';
  var gate=document.getElementById('age-gate');
  var yes=document.getElementById('gate-yes'),no=document.getElementById('gate-no'),denied=document.getElementById('gate-denied');
  var main=document.querySelectorAll('body > :not(#age-gate):not(script)');
  function ok(){try{return localStorage.getItem(KEY)==='yes'}catch(e){return false}}
  function setInert(v){main.forEach(function(el){if(v){el.setAttribute('inert','');el.setAttribute('aria-hidden','true')}else{el.removeAttribute('inert');el.removeAttribute('aria-hidden')}})}
  function open(){gate.hidden=false;document.body.classList.add('gated');setInert(true);yes.focus()}
  function close(){gate.hidden=true;document.body.classList.remove('gated');setInert(false);var h=document.getElementById('hero-title');h.setAttribute('tabindex','-1');h.focus({preventScroll:true})}
  if(!ok())open();
  yes.addEventListener('click',function(){try{localStorage.setItem(KEY,'yes')}catch(e){}close()});
  no.addEventListener('click',function(){denied.hidden=false;no.focus()});
  gate.addEventListener('keydown',function(e){if(e.key!=='Tab')return;var f=[yes,no];var i=f.indexOf(document.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();f[1].focus()}else if(!e.shiftKey&&i===1){e.preventDefault();f[0].focus()}});
  document.getElementById('year').textContent=new Date().getFullYear();

  /* Cart: flavours + quantities, prices (al detal / al por mayor 12+), checkout via WhatsApp. No payments. Nationwide shipping in Colombia. */
  var CKEY='iceluck_cart_v1',MAX=99,WHOLESALE_MIN=12;
  var products=[].slice.call(document.querySelectorAll('.product'));
  var info={};products.forEach(function(p){var d=p.dataset;info[d.id]={name:d.name,unit:+d.unit,whole:+d.wholesale,tagline:d.tagline,notes:d.notes,img:d.img}});
  var cart={};
  try{var s=JSON.parse(localStorage.getItem(CKEY)||'{}');Object.keys(s).forEach(function(k){var n=parseInt(s[k],10);if(info[k]&&n>0)cart[k]=Math.min(n,MAX)})}catch(e){}
  var bar=document.getElementById('cartbar'),count=document.getElementById('cart-count'),unit=document.getElementById('cart-unit');
  var dlg=document.getElementById('cart'),list=document.getElementById('cart-items'),empty=document.getElementById('cart-empty');
  var checkout=document.getElementById('cart-checkout'),openBtn=document.getElementById('cart-open'),closeBtn=document.getElementById('cart-close');
  var sum=document.getElementById('cart-sum'),tierEl=document.getElementById('cart-tier'),nudge=document.getElementById('cart-nudge'),subEl=document.getElementById('cart-subtotal'),saving=document.getElementById('cart-saving');
  function cop(n){return '$'+String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,'.')}
  function total(){return Object.keys(cart).reduce(function(a,k){return a+cart[k]},0)}
  function isWhole(){return total()>=WHOLESALE_MIN}
  function price(k){return isWhole()?info[k].whole:info[k].unit}
  function subtotal(){return Object.keys(cart).reduce(function(a,k){return a+cart[k]*price(k)},0)}
  function retail(){return Object.keys(cart).reduce(function(a,k){return a+cart[k]*info[k].unit},0)}
  function tierText(){return isWhole()?'al por mayor (12+ unidades)':'al detal (menos de 12 unidades)'}
  function message(){
    var lines=['Hola IceLuck, quiero hacer este pedido:'];
    products.forEach(function(p){var k=p.dataset.id;if(cart[k])lines.push('- '+cart[k]+' × '+info[k].name+' (150 ml) @ '+cop(price(k))+' = '+cop(cart[k]*price(k)))});
    var t=total();lines.push('Unidades: '+t+(t===1?' bolsita':' bolsitas'));
    lines.push('Precio: '+tierText());
    lines.push('Total estimado: '+cop(subtotal()));
    lines.push('');lines.push('Datos de entrega:');deliveryLines().forEach(function(x){lines.push(x)});
    lines.push('');lines.push('Confirmo que soy mayor de 18 años.');
    lines.push('Autorizo el uso de mis datos para procesar y entregar este pedido (Ley 1581 de 2012).');
    return lines.join('\n');
  }
  function waLink(text){return 'https://wa.me/'+WA+'?text='+encodeURIComponent(text)}
  function setQty(k,n){n=Math.max(0,Math.min(MAX,n));if(n)cart[k]=n;else delete cart[k];try{localStorage.setItem(CKEY,JSON.stringify(cart))}catch(e){}render()}
  function syncQty(el,k){var n=cart[k]||0;el.querySelector('.q-val').textContent=n;el.querySelector('.q-minus').disabled=!n;el.querySelector('.q-plus').disabled=n>=MAX}
  function render(){
    var t=total();
    products.forEach(function(p){syncQty(p,p.dataset.id);p.classList.toggle('in-cart',(cart[p.dataset.id]||0)>0)});
    bar.hidden=t===0;count.textContent=t;unit.textContent=t===1?'bolsita':'bolsitas';
    list.innerHTML='';
    products.forEach(function(p){var k=p.dataset.id,n=cart[k];if(!n)return;
      var li=document.createElement('li');li.dataset.id=k;
      li.innerHTML='<span class="ci-text"><span class="ci-name"></span><span class="ci-spec"></span><strong class="ci-line"></strong></span><span class="qty" role="group"><button type="button" class="q-minus">−</button><output class="q-val">'+n+'</output><button type="button" class="q-plus">+</button></span>';
      li.querySelector('.ci-name').textContent=info[k].name;
      li.querySelector('.ci-spec').textContent='150 ml · '+cop(price(k))+' c/u';
      li.querySelector('.ci-line').textContent=cop(n*price(k));
      li.querySelector('.qty').setAttribute('aria-label','Cantidad de '+info[k].name);
      li.querySelector('.q-minus').setAttribute('aria-label','Quitar '+info[k].name);
      li.querySelector('.q-plus').setAttribute('aria-label','Agregar '+info[k].name);
      li.querySelector('.q-plus').disabled=n>=MAX;
      list.appendChild(li)});
    empty.hidden=t>0;sum.hidden=t===0;
    var w=isWhole();
    tierEl.innerHTML='';var b=document.createElement('strong');b.textContent=w?'Precio al por mayor':'Precio al detal';tierEl.appendChild(b);tierEl.appendChild(document.createTextNode(w?' · 12+ unidades':' · menos de 12 unidades'));
    tierEl.classList.toggle('is-whole',w);
    var left=WHOLESALE_MIN-t;nudge.textContent=t>0&&left>0?('Te falta'+(left===1?' 1':'n '+left)+' para precio al por mayor (12+ unidades, cualquier combinación).'):'';nudge.hidden=!(t>0&&left>0);
    subEl.textContent=cop(subtotal());
    var sv=retail()-subtotal();saving.hidden=!(w&&sv>0);saving.textContent=sv>0?'Ahorras '+cop(sv)+' frente al precio al detal.':'';
    updateCheckout();
    if(cur)syncModal();
  }

  /* Delivery details (Colombia). Kept in memory only: never written to localStorage/cookies, only put in the wa.me text. */
  var form=document.getElementById('delivery-form'),hint=document.getElementById('checkout-hint');
  var F={name:$f('delivery-name'),phone:$f('delivery-phone'),dept:$f('delivery-dept'),city:$f('delivery-city'),address:$f('delivery-address'),hood:$f('delivery-neighborhood'),unit:$f('delivery-unit'),notes:$f('delivery-notes'),consent:$f('delivery-consent')};
  function $f(i){return document.getElementById(i)}
  var SMALL={de:1,del:1,la:1,las:1,el:1,los:1,y:1,e:1};
  function nice(s){return s.toLowerCase().split(' ').map(function(w,i){if(/\./.test(w))return w.toUpperCase();if(i>0&&SMALL[w])return w;return w.replace(/(^|-)(\p{L})/gu,function(m,a,c){return a+c.toUpperCase()})}).join(' ')}
  var LOC=(window.ICELUCK_LOCATIONS||[]).map(function(d){return {code:d.code,name:nice(d.name),cities:d.cities.map(nice).sort(function(a,b){return a.localeCompare(b,'es')})}}).sort(function(a,b){return a.name.localeCompare(b.name,'es')});
  LOC.forEach(function(d){var o=document.createElement('option');o.value=d.code;o.textContent=d.name;F.dept.appendChild(o)});
  function fillCities(){var d=LOC.filter(function(x){return x.code===F.dept.value})[0];F.city.innerHTML='';
    var o=document.createElement('option');o.value='';o.textContent=d?'Selecciona la ciudad o municipio':'Primero selecciona el departamento';F.city.appendChild(o);
    if(d){d.cities.forEach(function(c){var o=document.createElement('option');o.value=c;o.textContent=c;F.city.appendChild(o)});if(d.cities.length===1)F.city.value=d.cities[0]}
    F.city.disabled=!d}
  function clean(s){return String(s||'').replace(/\s+/g,' ').trim()}
  /* v7: any reasonable phone format (mobile or landline, optional +57); sanity check only: allowed characters and 7–15 digits */
  function phoneOk(v){var s=String(v||'').trim();if(!/^\+?[\d\s.\-()\/]+$/.test(s))return false;var n=s.replace(/\D/g,'').length;return n>=7&&n<=15}
  var RULES={
    name:function(v){v=clean(v);if(!v)return 'Escribe tu nombre completo.';if(v.length<3||!/\p{L}/u.test(v))return 'Escribe un nombre válido.';if(v.split(' ').length<2)return 'Escribe tu nombre y apellido.';return ''},
    phone:function(v){if(!clean(v))return 'Escribe tu número de celular o teléfono.';return phoneOk(v)?'':'Escribe un número de teléfono válido, con al menos 7 dígitos (ej.: 300 123 4567).'},
    dept:function(v){return v?'':'Selecciona el departamento.'},
    city:function(v){return v?'':(F.dept.value?'Selecciona la ciudad o municipio.':'Primero selecciona el departamento y luego la ciudad o municipio.')},
    address:function(v){v=clean(v);if(!v)return 'Escribe la dirección de entrega.';return v.length<5?'Escribe la dirección completa (ej.: Calle 10 # 43-12).':''},
    consent:function(v,el){return el.checked?'':'Debes autorizar el uso de tus datos para enviar el pedido.'}
  };
  var touched={},showAll=false;
  function err(k){return RULES[k]?RULES[k](F[k].value,F[k]):''}
  function paint(k){var e=err(k),show=(showAll||touched[k])&&e,box=document.getElementById(F[k].id+'-error');
    box.textContent=show?e:'';box.hidden=!show;if(show)F[k].setAttribute('aria-invalid','true');else F[k].removeAttribute('aria-invalid')}
  function invalid(){return Object.keys(RULES).filter(function(k){return !!err(k)})}
  function deliveryLines(){var dname=(LOC.filter(function(x){return x.code===F.dept.value})[0]||{}).name||'';
    var L=[['Nombre',clean(F.name.value)],['Celular',String(F.phone.value).trim()],['Dirección',clean(F.address.value)],['Apto / Torre / Casa',clean(F.unit.value)],['Barrio',clean(F.hood.value)],['Ciudad / Municipio',F.city.value],['Departamento',dname],['Indicaciones',clean(F.notes.value)]];
    return L.filter(function(x){return x[1]}).map(function(x){return x[0]+': '+x[1]})}
  function updateCheckout(){
    var t=total(),bad=invalid(),can=t>0&&!bad.length;
    checkout.setAttribute('aria-disabled',String(!can));
    checkout.href=can?waLink(message()):'#';
    hint.textContent=t===0?'Agrega al menos un sabor para hacer tu pedido.':(bad.length?'Completa los datos obligatorios'+(err('consent')?' y autoriza el uso de tus datos':'')+' para enviar tu pedido.':'Todo listo. Revisa el mensaje en WhatsApp antes de enviarlo.');
    hint.classList.toggle('ok',can);
    form.classList.toggle('is-empty-cart',t===0);
  }
  Object.keys(F).forEach(function(k){var el=F[k];
    el.addEventListener('input',function(){if(touched[k]||showAll)paint(k);updateCheckout()});
    el.addEventListener('change',function(){if(k==='dept'){fillCities();touched.city&&paint('city')}touched[k]=true;paint(k);updateCheckout()});
    el.addEventListener('blur',function(){touched[k]=true;paint(k)})});
  checkout.addEventListener('click',function(e){if(checkout.getAttribute('aria-disabled')!=='true')return;e.preventDefault();
    if(total()===0)return;
    showAll=true;Object.keys(RULES).forEach(paint);var first=invalid()[0];if(first)F[first].focus()});
  form.addEventListener('submit',function(e){e.preventDefault()});
  /* Privacy notice: same copy in the cart and on the page */
  document.getElementById('cart-privacy-copy').innerHTML=document.getElementById('privacy-copy-src').innerHTML;
  document.querySelectorAll('a[href="#privacidad"]').forEach(function(a){a.addEventListener('click',function(){document.getElementById('privacy-details').open=true})});
  if(location.hash==='#privacidad')document.getElementById('privacy-details').open=true;
  products.forEach(function(p){var k=p.dataset.id;
    p.querySelector('.q-plus').addEventListener('click',function(){setQty(k,(cart[k]||0)+1)});
    p.querySelector('.q-minus').addEventListener('click',function(){setQty(k,(cart[k]||0)-1)});
    p.querySelectorAll('.js-details').forEach(function(b){b.addEventListener('click',function(){openModal(k,b)})})});
  list.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var li=b.closest('li'),k=li.dataset.id;var plus=b.classList.contains('q-plus');setQty(k,(cart[k]||0)+(plus?1:-1));
    var again=list.querySelector('li[data-id="'+k+'"] .'+(plus?'q-plus':'q-minus'));(again||closeBtn).focus()});
  function trap(e,root){var f=[].slice.call(root.querySelectorAll('button:not([disabled]):not([hidden]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),summary,a[href]')).filter(function(x){return x.offsetParent!==null||x===document.activeElement});if(!f.length)return;var i=f.indexOf(document.activeElement);
    if(e.shiftKey&&i<=0){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&(i===f.length-1||i<0)){e.preventDefault();f[0].focus()}}
  var lastFocus=null;
  function openCart(){lastFocus=document.activeElement;dlg.hidden=false;document.body.classList.add('cart-open');closeBtn.focus()}
  function closeCart(){dlg.hidden=true;document.body.classList.remove('cart-open');if(lastFocus&&document.contains(lastFocus)&&lastFocus.offsetParent!==null)lastFocus.focus();else if(!bar.hidden)openBtn.focus()}
  openBtn.addEventListener('click',openCart);closeBtn.addEventListener('click',closeCart);
  dlg.addEventListener('click',function(e){if(e.target===dlg)closeCart()});
  document.addEventListener('keydown',function(e){if(dlg.hidden)return;
    if(e.key==='Escape'){closeCart();return}
    if(e.key==='Tab')trap(e,dlg)});

  /* Product details modal */
  var pm=document.getElementById('pmodal'),pmClose=document.getElementById('pm-close'),pmQty=document.getElementById('pm-qty'),pmCart=document.getElementById('pm-cart');
  var cur=null,pmTrigger=null;
  function $id(i){return document.getElementById(i)}
  function syncModal(){syncQty(pmQty,cur);pmCart.hidden=total()===0}
  function openModal(k,trigger){var d=info[k];cur=k;pmTrigger=trigger;
    $id('pm-src').srcset=d.img+'.webp';var img=$id('pm-img');img.src=d.img+'.jpg';
    img.alt=products.filter(function(p){return p.dataset.id===k})[0].querySelector('.photo img').alt;
    $id('pm-title').textContent=d.name;$id('pm-tagline').textContent=d.tagline;$id('pm-notes').textContent=d.notes;
    $id('pm-unit').textContent=cop(d.unit);$id('pm-whole').textContent=cop(d.whole);
    var dt=document.querySelector('.ingredients dt[data-id="'+k+'"]');$id('pm-ingr').textContent=dt?dt.nextElementSibling.textContent:'';
    pmQty.setAttribute('aria-label','Cantidad de '+d.name);
    pmQty.querySelector('.q-minus').setAttribute('aria-label','Quitar '+d.name);pmQty.querySelector('.q-plus').setAttribute('aria-label','Agregar '+d.name);
    syncModal();pm.hidden=false;document.body.classList.add('modal-open');pm.querySelector('.pm-panel').scrollTop=0;pmClose.focus()}
  function closeModal(ret){pm.hidden=true;document.body.classList.remove('modal-open');var t=pmTrigger;cur=null;pmTrigger=null;if(ret!==false&&t)t.focus()}
  pmQty.querySelector('.q-plus').addEventListener('click',function(){setQty(cur,(cart[cur]||0)+1)});
  pmQty.querySelector('.q-minus').addEventListener('click',function(){setQty(cur,(cart[cur]||0)-1);if(!cart[cur])pmQty.querySelector('.q-plus').focus()});
  pmClose.addEventListener('click',function(){closeModal()});
  pmCart.addEventListener('click',function(){var t=pmTrigger;closeModal(false);lastFocus=t;dlg.hidden=false;document.body.classList.add('cart-open');closeBtn.focus()});
  pm.addEventListener('click',function(e){if(e.target===pm)closeModal()});
  document.addEventListener('keydown',function(e){if(pm.hidden)return;
    if(e.key==='Escape'){e.stopPropagation();closeModal();return}
    if(e.key==='Tab')trap(e,pm)});

  /* v7: floating WhatsApp button (mobile). CSS hides it on desktop and while the gate, cart or pop-up is open.
     On short phones it would sit on the last flavour card's +/− buttons, so it stays tucked away until those cards scroll clear of it. */
  var waf=document.getElementById('wa-float'),prodList=document.querySelector('.products');
  function placeFloat(){if(!waf||!prodList)return;waf.classList.remove('is-tucked');var b=waf.getBoundingClientRect();if(!b.width)return;
    var p=prodList.getBoundingClientRect(),hit=p.left<b.right&&p.right>b.left&&p.top<b.bottom&&p.bottom>b.top;waf.classList.toggle('is-tucked',hit)}
  window.addEventListener('scroll',placeFloat,{passive:true});window.addEventListener('resize',placeFloat);window.addEventListener('load',placeFloat);placeFloat();
  render();
})();
