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

  /* Cart: flavours + quantities, checkout via WhatsApp. No prices. Medellín only. */
  var CKEY='iceluck_cart_v1',MAX=99;
  var products=[].slice.call(document.querySelectorAll('.product'));
  var names={};products.forEach(function(p){names[p.dataset.id]=p.dataset.name});
  var cart={};
  try{var s=JSON.parse(localStorage.getItem(CKEY)||'{}');Object.keys(s).forEach(function(k){var n=parseInt(s[k],10);if(names[k]&&n>0)cart[k]=Math.min(n,MAX)})}catch(e){}
  var bar=document.getElementById('cartbar'),count=document.getElementById('cart-count'),unit=document.getElementById('cart-unit');
  var dlg=document.getElementById('cart'),list=document.getElementById('cart-items'),empty=document.getElementById('cart-empty');
  var soon=document.getElementById('city-soon'),checkout=document.getElementById('cart-checkout'),openBtn=document.getElementById('cart-open'),closeBtn=document.getElementById('cart-close');
  function total(){return Object.keys(cart).reduce(function(a,k){return a+cart[k]},0)}
  function city(){var r=document.querySelector('input[name="city"]:checked');return r?r.value:'medellin'}
  function message(){
    var lines=['Hola IceLuck, quiero hacer este pedido para entrega en Medellín:'];
    products.forEach(function(p){var k=p.dataset.id;if(cart[k])lines.push('- '+cart[k]+' × '+names[k]+' (100 ml)')});
    var t=total();lines.push('Total: '+t+(t===1?' bolsita':' bolsitas')+'.');
    lines.push('Confirmo que soy mayor de 18 años.');
    return lines.join('\n');
  }
  function waLink(text){return 'https://wa.me/'+WA+'?text='+encodeURIComponent(text)}
  function setQty(k,n){n=Math.max(0,Math.min(MAX,n));if(n)cart[k]=n;else delete cart[k];try{localStorage.setItem(CKEY,JSON.stringify(cart))}catch(e){}render()}
  function render(){
    var t=total();
    products.forEach(function(p){var n=cart[p.dataset.id]||0;p.querySelector('.q-val').textContent=n;p.querySelector('.q-minus').disabled=!n;p.querySelector('.q-plus').disabled=n>=MAX;p.classList.toggle('in-cart',n>0)});
    bar.hidden=t===0;count.textContent=t;unit.textContent=t===1?'bolsita':'bolsitas';
    list.innerHTML='';
    products.forEach(function(p){var k=p.dataset.id,n=cart[k];if(!n)return;
      var li=document.createElement('li');li.dataset.id=k;
      li.innerHTML='<span><span class="ci-name"></span><span class="ci-spec">100 ml · 6% ALC.</span></span><span class="qty" role="group"><button type="button" class="q-minus">−</button><output class="q-val">'+n+'</output><button type="button" class="q-plus">+</button></span>';
      li.querySelector('.ci-name').textContent=names[k];
      li.querySelector('.qty').setAttribute('aria-label','Cantidad de '+names[k]);
      li.querySelector('.q-minus').setAttribute('aria-label','Quitar '+names[k]);
      li.querySelector('.q-plus').setAttribute('aria-label','Agregar '+names[k]);
      li.querySelector('.q-plus').disabled=n>=MAX;
      list.appendChild(li)});
    empty.hidden=t>0;
    var other=city()!=='medellin';soon.hidden=!other;
    var can=t>0&&!other;
    checkout.setAttribute('aria-disabled',String(!can));
    checkout.href=can?waLink(message()):'#';
    if(!can){checkout.setAttribute('tabindex','-1')}else{checkout.removeAttribute('tabindex')}
  }
  products.forEach(function(p){var k=p.dataset.id;
    p.querySelector('.q-plus').addEventListener('click',function(){setQty(k,(cart[k]||0)+1)});
    p.querySelector('.q-minus').addEventListener('click',function(){setQty(k,(cart[k]||0)-1)})});
  list.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var li=b.closest('li'),k=li.dataset.id;var plus=b.classList.contains('q-plus');setQty(k,(cart[k]||0)+(plus?1:-1));
    var again=list.querySelector('li[data-id="'+k+'"] .'+(plus?'q-plus':'q-minus'));(again||closeBtn).focus()});
  document.querySelectorAll('input[name="city"]').forEach(function(r){r.addEventListener('change',render)});
  var lastFocus=null;
  function openCart(){lastFocus=document.activeElement;dlg.hidden=false;document.body.classList.add('cart-open');closeBtn.focus()}
  function closeCart(){dlg.hidden=true;document.body.classList.remove('cart-open');if(!bar.hidden)openBtn.focus();else if(lastFocus)lastFocus.focus()}
  openBtn.addEventListener('click',openCart);closeBtn.addEventListener('click',closeCart);
  dlg.addEventListener('click',function(e){if(e.target===dlg)closeCart()});
  document.addEventListener('keydown',function(e){if(dlg.hidden)return;
    if(e.key==='Escape'){closeCart();return}
    if(e.key==='Tab'){var f=[].slice.call(dlg.querySelectorAll('button:not([disabled]),input:checked,a[href]:not([aria-disabled="true"])'));if(!f.length)return;var i=f.indexOf(document.activeElement);
      if(e.shiftKey&&i<=0){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus()}}});
  checkout.addEventListener('click',function(e){if(checkout.getAttribute('aria-disabled')==='true')e.preventDefault()});
  render();
})();
