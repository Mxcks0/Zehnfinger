/* Ratgeber-Seiten: Tastatur mit Fingerfarben und kleine Übung zum Ausprobieren */
(function(){
  // Welcher Finger drückt welche Taste (wie im Spiel)
  const FINGER={};
  const assign=(f,keys)=>keys.forEach(k=>FINGER[k]=f);
  assign(5,['^','1','q','a','<','y','⇥','⇪','⇧l']);
  assign(4,['2','w','s','x','9','o','l','.']);
  assign(3,['3','e','d','c','8','i','k',',']);
  assign(2,['4','5','6','r','t','f','g','v','b','7','z','u','h','j','n','m']);
  assign(5,['0','ß','´','p','ü','+','ö','ä','#','-','⇧r','↵','⌫']);
  assign(1,['␣']);
  const HOME=['a','s','d','f','j','k','l','ö'];
  const ROWS=[
    ['^','1','2','3','4','5','6','7','8','9','0','ß','´',['⌫','w2']],
    [['⇥','w15'],'q','w','e','r','t','z','u','i','o','p','ü','+',['↵','w15']],
    [['⇪','w175'],'a','s','d','f','g','h','j','k','l','ö','ä','#',['','w125 gap']],
    [['⇧l','w125','⇧'],'<','y','x','c','v','b','n','m',',','.','-',['⇧r','w275','⇧']],
    [['','w4 gap'],['␣','sp',''],['','w4 gap']]
  ];
  function keyboard(el){
    el.innerHTML='<div class="legend">'+[[5,'Kleiner Finger'],[4,'Ringfinger'],[3,'Mittelfinger'],[2,'Zeigefinger'],[1,'Daumen']]
      .map(([f,n])=>`<span style="--c:var(--k${f})">${n}</span>`).join('')+'</div>'+
      ROWS.map(r=>'<div class="kr">'+r.map(k=>{
        const [id,cls,label]=Array.isArray(k)?k:[k,'',k];
        const f=FINGER[id],c=[cls||''];
        if(HOME.includes(id))c.push('home');if(id==='f'||id==='j')c.push('bump');
        return `<div class="k ${c.join(' ')}"${f?` style="--fc:var(--k${f})"`:''}>${label===undefined?id:label}</div>`}).join('')+'</div>').join('');
  }
  document.querySelectorAll('[data-keyboard]').forEach(keyboard);

  // Mini-Übung: Buchstabe für Buchstabe abtippen, am Ende Tempo und Fehler
  function drill(el){
    const sets=JSON.parse(el.dataset.drill);let cur=0,t0=0,errs=0;
    el.innerHTML=`<div class="row" style="margin-top:0"><div class="seg">${sets.map((s,i)=>`<button type="button" data-i="${i}" aria-pressed="${i===0}">${s[0]}</button>`).join('')}</div><span class="st"></span></div>
      <div class="line" aria-hidden="true"></div>
      <input type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" aria-label="Hier tippen" placeholder="Hier tippen …">
      <div class="row"><span class="msg">Finger auf die Grundreihe, Blick auf den Bildschirm – los!</span><button type="button" class="btn ghost again">Neu starten</button></div>`;
    const line=el.querySelector('.line'),inp=el.querySelector('input'),msg=el.querySelector('.msg'),st=el.querySelector('.st');
    const target=()=>sets[cur][1];
    function paint(){
      const v=inp.value,t=target();
      line.innerHTML=[...t].map((ch,i)=>{const cls=i<v.length?(v[i]===ch?'ok':'bad'):i===v.length?'cur':'';return `<span class="${cls}">${ch===' '?'&nbsp;':ch}</span>`}).join('');
    }
    function reset(){inp.value='';inp.disabled=false;t0=0;errs=0;st.textContent='';msg.textContent='Finger auf die Grundreihe, Blick auf den Bildschirm – los!';paint()}
    inp.addEventListener('input',e=>{
      const v=inp.value,t=target();
      if(!t0&&v)t0=performance.now();
      if(e.inputType&&e.inputType.startsWith('insert')&&v.length&&v[v.length-1]!==t[v.length-1])errs++;
      paint();st.textContent=errs?`${errs} Fehler`:'';
      if(v.length>=t.length){
        const min=(performance.now()-t0)/60000,apm=Math.round(t.length/Math.max(min,1/600));
        inp.disabled=true;
        msg.textContent=errs?`Geschafft! ${apm} Anschläge pro Minute, ${errs} Fehler. Noch einmal – diesmal ohne Fehler?`:`Perfekt – fehlerfrei mit ${apm} Anschlägen pro Minute! 🎉`;
      }
    });
    el.querySelectorAll('.seg button').forEach(b=>b.onclick=()=>{cur=+b.dataset.i;el.querySelectorAll('.seg button').forEach(x=>x.setAttribute('aria-pressed',x===b));reset();inp.focus()});
    el.querySelector('.again').onclick=()=>{reset();inp.focus()};
    reset();
  }
  document.querySelectorAll('[data-drill]').forEach(drill);
})();
