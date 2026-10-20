/* Mitt Barnebarn: annonse-landingssidene (lp-*.html). Lastes etter papa.js, som tar seg av skjemaet (demo: ingenting sendes).
   1. utm-feltene i skjemaet fylles fra adressen, så annonsene kan spores når skjemaet kobles til noe.
   2. Forslagene under «Hva vil du ha hjelp til?» legger ordet inn i teksten, og tar det bort igjen.
   3. Den faste knappen nederst på mobil vises når toppknappen er rullet bort, og skjules ved skjemaet og bunnteksten. */
(function(){
  var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};

  /* 1. utm fra adressen */
  try{
    var q=new URLSearchParams(location.search);
    ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(function(k){
      var v=q.get(k);
      if(v)$$('input[name="'+k+'"]').forEach(function(i){i.value=v.slice(0,120)});
    });
  }catch(e){}

  /* 2. forslag som fyller ut teksten */
  $$('.lp-forslag').forEach(function(box){
    var form=box.closest('form'),ta=form&&$('textarea',form);
    if(!ta)return;
    var chips=$$('.lp-chip',box);
    var esc=function(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')};
    var low=function(s){return s.charAt(0).toLowerCase()+s.slice(1)};
    var har=function(ord){return new RegExp('(^|[,\\s])'+esc(low(ord))+'(?=$|[,\\s.])','i').test(ta.value)};
    var sync=function(){chips.forEach(function(b){b.setAttribute('aria-pressed',har(b.textContent.trim())?'true':'false')})};
    var stor=function(s){return s.charAt(0).toUpperCase()+s.slice(1)};
    chips.forEach(function(b){
      b.addEventListener('click',function(){
        var ord=b.textContent.trim(),t=ta.value;
        if(har(ord)){
          t=t.replace(new RegExp('(^|[,\\s])'+esc(low(ord))+'(?=$|[,\\s.])','i'),'$1')
             .replace(/\s*,\s*,/g,',').replace(/^[\s,]+|[\s,]+$/g,'').replace(/\s{2,}/g,' ');
          t=stor(t);
        }else{
          t=t.replace(/[\s,]+$/,'');
          t=t?t+', '+low(ord):ord;
        }
        ta.value=t;
        sync();
      });
    });
    ta.addEventListener('input',sync);
    sync();
  });

  /* 3. fast knapp nederst på mobil */
  var bar=$('.lp-sticky'),hero=$('.lp-hero .hero-actions');
  if(bar&&hero&&'IntersectionObserver' in window){
    var oppe=false,borte=false;
    var vis=function(){bar.classList.toggle('on',oppe&&!borte)};
    new IntersectionObserver(function(es){var e=es[es.length-1];oppe=!e.isIntersecting&&e.boundingClientRect.top<0;vis()}).observe(hero);
    var slutt=$$('.final,.footer'),sett={};
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){sett[e.target.classList.contains('final')?'final':'footer']=e.isIntersecting});
      borte=!!(sett.final||sett.footer);vis();
    });
    slutt.forEach(function(e){io.observe(e)});
  }
})();
