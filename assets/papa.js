/* Mitt Barnebarn: felles script for landingssidene i Papa-stil (demo, skjemaet sender ingenting) */
(function(){
  var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
  var rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
  /* vis innhold jevnt mens man scroller */
  var items=$$('.reveal'),stat=location.search.indexOf('static')>-1;
  /* ?static (skjermbilder): last alle bilder med en gang, ellers blir lazy-bilder tomme i helsidesbildet */
  if(stat)$$('img[loading=lazy]').forEach(function(i){i.loading='eager'});
  if(stat||!('IntersectionObserver' in window)){items.forEach(function(e){e.classList.add('in')})}
  else{var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.08,rootMargin:'0px 0px -4% 0px'});items.forEach(function(e){io.observe(e)})}
  /* meny på små skjermer */
  var mb=$('.menu-btn'),nav=$('#meny');
  /* annonse-landingssidene (lp-*.html) har ingen meny, så alt som gjelder menyen hoppes over der */
  if(mb&&nav){
  /* knappen viser «Meny» eller «Lukk» (css), så navnet for skjermleser starter med det samme ordet */
  var setMenu=function(o){nav.classList.toggle('open',o);mb.setAttribute('aria-expanded',o);mb.setAttribute('aria-label',o?'Lukk menyen':'Meny')};
  mb.setAttribute('aria-label','Meny');
  mb.addEventListener('click',function(){setMenu(!nav.classList.contains('open'))});
  $$('#meny a').forEach(function(a){a.addEventListener('click',function(){setMenu(false)})});
  addEventListener('keydown',function(e){if(e.key==='Escape'&&nav.classList.contains('open')){setMenu(false);mb.focus()}});
  document.addEventListener('click',function(e){if(nav.classList.contains('open')&&!e.target.closest('.navwrap'))setMenu(false)});
  }
  /* toppen får en myk kremfarget bakgrunn (css .header.on) så fort siden er rullet, så tekst ikke vises mellom pillene */
  var hd=$('.header');
  if(hd){var top=function(){hd.classList.toggle('on',(window.pageYOffset||document.documentElement.scrollTop)>12)};addEventListener('scroll',top,{passive:true});top()}
  /* knapper som peker på skjemaet */
  var forms=$$('[data-form]');
  $$('[data-cta]').forEach(function(a){a.addEventListener('click',function(e){
    var f=forms[0];if(!f)return;
    e.preventDefault();
    var touch=matchMedia('(pointer:coarse)').matches;
    if(a.dataset.who){var r=$('input[type=radio][value="'+a.dataset.who+'"]',f);if(r)r.checked=true}
    /* et skjema som er høyere enn skjermen (annonsesidene) rulles til toppen, under den faste toppen. Ellers midt på skjermen. */
    f.scrollIntoView({behavior:rm?'auto':'smooth',block:f.getBoundingClientRect().height>innerHeight-160?'start':'center'});
    if(!touch)setTimeout(function(){var i=$('input[type=text]',f);if(i)i.focus({preventScroll:true})},550);
  })});
  /* skjema (demo: ingenting sendes) */
  var clean=function(s){return String(s).replace(/[<>&"]/g,'')};
  forms.forEach(function(f){f.addEventListener('submit',function(e){
    e.preventDefault();
    var name=$('input[name=name]',f),tel=$('input[name=tel]',f),err=$('.err',f);
    if(!err.id)err.id='err-'+(f.id||'skjema');
    var digits=tel.value.replace(/\D/g,'').replace(/^47(?=\d{8}$)/,'');
    /* meldingen står rett under skjemaoverskriften: rulles til midt på skjermen, så den og feltet som er feil begge er synlige (også på mobil) */
    var fail=function(el,msg){err.textContent=msg;err.hidden=false;[name,tel].forEach(function(x){x.removeAttribute('aria-invalid');x.removeAttribute('aria-describedby')});el.setAttribute('aria-invalid','true');el.setAttribute('aria-describedby',err.id);el.focus({preventScroll:true});err.scrollIntoView({behavior:rm?'auto':'smooth',block:'center'})};
    /* så snart feltet som var feil endres, forsvinner den røde kanten og meldingen */
    if(!f.dataset.rydd){f.dataset.rydd='1';[name,tel].forEach(function(x){x.addEventListener('input',function(){if(x.getAttribute('aria-invalid')==='true'){x.removeAttribute('aria-invalid');x.removeAttribute('aria-describedby');err.hidden=true}})})}
    if(!name.value.trim()){fail(name,'Skriv inn fornavnet ditt.');return}
    if(digits.length!==8){fail(tel,'Skriv inn et telefonnummer med 8 siffer.');return}
    var box=document.createElement('div');box.className='thanks';box.setAttribute('role','status');box.tabIndex=-1;
    box.innerHTML='<svg class="ico" aria-hidden="true" focusable="false"><use href="#i-check"/></svg><div><b>Takk, '+clean(name.value.trim())+'.</b><span>Vi har fått beskjeden din og ringer deg på '+clean(tel.value)+'. Vil du snakke med oss med en gang, ring 411 24 968 (hverdager 09–18).</span></div>';
    f.replaceChildren(box);box.focus();
  })});
  /* sitatkarusell: piler, prikker og dra. Ingen automatisk bytte. */
  var car=$('.slides');
  if(car){
    var slides=$$('.slide',car),dots=$$('.dot'),prev=$('.arrow.prev'),next=$('.arrow.next');
    var cur=0;
    var fit=function(i){car.style.height=slides[i].offsetHeight+'px'};
    var mark=function(i){cur=i;fit(i);dots.forEach(function(d,k){d.setAttribute('aria-current',k===i?'true':'false')});slides.forEach(function(s,k){s.setAttribute('aria-hidden',k===i?'false':'true')})};
    var go=function(i){i=(i+slides.length)%slides.length;car.scrollTo({left:i*car.clientWidth,behavior:rm?'auto':'smooth'});mark(i)};
    car.addEventListener('scroll',function(){var i=Math.round(car.scrollLeft/car.clientWidth);if(i!==cur&&i>=0&&i<slides.length)mark(i)},{passive:true});
    if(prev)prev.addEventListener('click',function(){go(cur-1)});
    if(next)next.addEventListener('click',function(){go(cur+1)});
    dots.forEach(function(d,k){d.addEventListener('click',function(){go(k)})});
    car.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();go(cur+1)}if(e.key==='ArrowLeft'){e.preventDefault();go(cur-1)}});
    addEventListener('resize',function(){fit(cur)});
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){fit(cur)});
    mark(0);
    /* mobil: pilene står på raden med prikkene under sitatet (på bred skjerm: over bildene) */
    var row=$('.dots'),pair=$('.pair'),small=matchMedia('(max-width:620px)');
    var place=function(){
      if(!row||!pair||!prev||!next)return;
      if(small.matches){row.insertBefore(prev,row.firstChild);row.appendChild(next);row.classList.add('nav')}
      else{pair.insertBefore(prev,pair.firstChild);pair.appendChild(next);row.classList.remove('nav')}
    };
    place();
    if(small.addEventListener)small.addEventListener('change',place);else if(small.addListener)small.addListener(place);
  }
  /* støttespiller-banner: pause */
  var pb=$('.band-pause'),mq=$('.marquee');
  /* teksten på knappen sier hva den gjør, så aria-pressed trengs ikke (begge deler gir dobbel beskjed i skjermleser) */
  if(pb&&mq){pb.removeAttribute('aria-pressed');pb.addEventListener('click',function(){var p=mq.classList.toggle('paused');pb.textContent=p?'Start bevegelsen':'Pause bevegelsen'})}
  /* strukturerte data bygget fra siden */
  var ld=$('#ld');
  if(ld){
    var faq=$$('details').map(function(d){return {"@type":"Question","name":$('summary',d).childNodes[0].textContent.trim(),"acceptedAnswer":{"@type":"Answer","text":$('p',d).textContent.trim()}}});
    var graph=[{"@type":"LocalBusiness","name":"Mitt Barnebarn AS","url":"https://mittbarnebarn.no","telephone":"+4741124968","email":"kontakt@mittbarnebarn.no","areaServed":"Trondheim","address":{"@type":"PostalAddress","streetAddress":"Dronningens gate 74","postalCode":"7012","addressLocality":"Trondheim","addressCountry":"NO"},"description":"Fast, ung hjelper hjem til eldre i Trondheim: renhold, handling, hage, mobil og selskap."}];
    if(faq.length)graph.push({"@type":"FAQPage","mainEntity":faq});
    ld.textContent=JSON.stringify({"@context":"https://schema.org","@graph":graph});
  }
})();
