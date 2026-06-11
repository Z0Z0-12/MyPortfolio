(function(){
  var anime = window.anime;
  var scenes = {};
  ['hero','about','projects','skills','journey','contact'].forEach(function(id){ scenes[id]=document.getElementById(id); });
  var current = 'hero';
  var busy = false;
  var fxMode = 'expand';
  var fx = document.getElementById('fx');
  var presenter = document.getElementById('presenter');
  var MOD={about:'ABOUT',projects:'WORKS',skills:'SKILLS',journey:'JOURNEY',contact:'CONNECT'};
  var sysStatus=document.getElementById('sysStatus');
  function setStatus(html){ if(sysStatus) sysStatus.innerHTML=html; }

  /* ---- project data (from the resume) ---- */
  var projects = [
    {cat:'AI · 3D · RAG', year:'2025', title:'EarthTwin',
     blurb:'An AI-powered 3D Earth simulator that auto-generates CO₂ and sustainability impact reports for proposed infrastructure — bridges, dams, airports. An agentic RAG pipeline turns natural-language prompts into geo-located 3D components inside an interactive simulation. Hackathon Honorable Mention.',
     tags:['Three.js','FastAPI','PostgreSQL','Supabase','RAG']},
    {cat:'AI · Agents', year:'2025', title:'AI Multi-Agent System',
     blurb:'A multi-agent web-scaffold generator — planner, architect and coder agents orchestrated with LangGraph and a Groq LLM. It produced a working calculator and a coffee-shop site layout in a 5–6 minute end-to-end run.',
     tags:['LangGraph','Groq','LLMs','Python']},
    {cat:'AI Research', year:'2024', title:'LLM Video Classification',
     blurb:'Research with the Head of the CS Department on how large language and vision-language models interpret video. I built multimodal pipelines to evaluate model understanding across visual and language inputs, testing models like Qwen and Gemini.',
     tags:['Qwen','Gemini','Multimodal','PyTorch']}
  ];

  var discWrap=document.getElementById('discWrap');
  var discDetail=document.getElementById('discDetail');
  var discItems=[];
  var discActive=0;
  var DISC_STEP=27;            // degrees between projects
  var DISC_LEFT=-90;          // active sits pointing left
  function discR(){ return window.innerHeight*0.46; }

  var discCountEl=document.getElementById('discCount');
  if(discCountEl) discCountEl.textContent = (projects.length<10?'0':'')+projects.length;

  if(discWrap){
    projects.forEach(function(p,i){
      var it=document.createElement('div'); it.className='disc-item';
      it.innerHTML='<div class="di-thumb"><span class="di-no">0'+(i+1)+'</span><span class="di-node"></span></div>'+
        '<div class="di-lbl">'+p.title+'</div>';
      it.addEventListener('click',function(){ setDisc(i); });
      discWrap.appendChild(it); discItems.push(it);
    });
  }
  function layoutDisc(){
    var R=discR();
    discItems.forEach(function(it,i){
      var a=DISC_LEFT+(i-discActive)*DISC_STEP;
      it.style.transform='translate(-50%,-50%) rotate('+a+'deg) translateY(-'+R+'px) rotate('+(-a)+'deg)';
      var d=Math.abs(i-discActive);
      it.style.opacity = d>3 ? 0 : (1 - d*0.22);
      it.style.pointerEvents = d>3 ? 'none' : 'auto';
      it.classList.toggle('active', i===discActive);
    });
  }
  function renderDetail(animate){
    if(!discDetail) return;
    var p=projects[discActive];
    discDetail.innerHTML='<div class="dd-media"><span class="ddm-scan"></span><span class="ddm-cn tl"></span><span class="ddm-cn br"></span><span class="ddm-lbl">PROJECT VISUAL · 0'+(discActive+1)+'</span></div>'+
      '<div class="dd-no">PROJECT 0'+(discActive+1)+' / 0'+projects.length+'</div>'+
      '<h3 class="dd-title">'+p.title+'</h3>'+
      '<div class="dd-meta">'+p.cat+' · '+p.year+'</div>'+
      '<p class="dd-blurb">'+p.blurb+'</p>'+
      '<div class="dd-tags">'+p.tags.map(function(t){return '<span>'+t+'</span>';}).join('')+'</div>'+
      '<a class="dd-open" href="https://github.com/Z0Z0-12" target="_blank" rel="noopener">View on GitHub →</a>';
    if(animate!==false && window.anime) anime({targets:discDetail.children,opacity:[0,1],translateX:[-16,0],delay:anime.stagger(50),duration:480,easing:'easeOutQuad'});
  }
  function setDisc(i){
    var n=projects.length; discActive=Math.max(0,Math.min(n-1,i));
    layoutDisc(); renderDetail();
  }
  // initial build
  if(discWrap){ layoutDisc(); renderDetail(false); window.addEventListener('resize',layoutDisc); }

  // ── SKILLS — neural network map (from the resume; no fabricated domains) ──
  var nnDomains=[
    {key:'ml',  name:'AI / ML',       y:17, lvl:85,
      skills:[['PyTorch',82],['LLMs / RAG',80],['LangGraph',76]]},
    {key:'web', name:'Full-Stack',    y:39, lvl:80,
      skills:[['React',84],['FastAPI',80],['Node.js',74]]},
    {key:'data',name:'Data / Backend',y:62, lvl:76,
      skills:[['PostgreSQL',78],['Supabase',74],['MongoDB',68]]},
    {key:'tool',name:'Tooling',       y:84, lvl:75,
      skills:[['Git / GitHub',82],['Docker',66],['n8n',70]]}
  ];
  var nnStage=document.getElementById('nnStage');
  var nnGraph=document.getElementById('nnGraph');
  var nnLines=document.getElementById('nnLines');
  var nnReadout=document.getElementById('nnReadout');
  var nnEdges=[];           // {el,ax,ay,bx,by,keys:[]}
  var nnNodeEls=[];         // dom nodes with dataset
  var nnSel=null;           // sticky selection

  function nnAddNode(cls,x,y,size,html,below,data){
    var n=document.createElement('div'); n.className='nn-node '+cls+(below?' below':'');
    n.style.left=x+'%'; n.style.top=y+'%';
    var ring = (data && data.lvl!=null) ? '<span class="ring" style="--p:'+data.lvl+'"></span>' : '';
    n.innerHTML='<div class="nn-dot" style="width:'+size+'px;height:'+size+'px">'+ring+(data&&data.ic?data.ic:'')+'</div><div class="nn-name">'+html+'</div>';
    if(data){ Object.keys(data).forEach(function(k){ if(k!=='ic') n.dataset[k]=data[k]; }); }
    nnGraph.appendChild(n); nnNodeEls.push(n); return n;
  }
  function nnAddEdge(ax,ay,bx,by,keys){
    var l=document.createElementNS('http://www.w3.org/2000/svg','line');
    l.setAttribute('class','nn-edge');
    nnLines.appendChild(l); nnEdges.push({el:l,ax:ax,ay:ay,bx:bx,by:by,keys:keys});
  }
  var CORE_X=8, DOM_X=42, CORE_Y=50;
  if(nnStage){
    // core
    nnAddNode('core',CORE_X,CORE_Y,72,'<b>HIMANSHU.AI</b>core',true,{type:'core'});
    nnDomains.forEach(function(d){
      nnAddEdge(CORE_X,CORE_Y,DOM_X,d.y,['core-'+d.key]);
    });
    nnDomains.forEach(function(d){
      nnAddNode('domain',DOM_X,d.y,Math.round(40+d.lvl/100*16),'<b>'+d.name+'</b>'+d.skills.length+' skills',true,
        {type:'domain',dkey:d.key,name:d.name,lvl:d.lvl});
      var n=d.skills.length, span=(n-1)*9, start=d.y-span/2;
      d.skills.forEach(function(s,i){
        var sx = 72 + (i%2)*8;          // gentle stagger
        var sy = start + i*9;
        nnAddEdge(DOM_X,d.y,sx,sy,[d.key+'-'+i]);
        nnAddNode('skill',sx,sy,Math.round(24+s[1]/100*18),s[0],false,
          {type:'skill',dkey:d.key,sidx:i,name:s[0],lvl:s[1]});
      });
    });
  }
  function nnLayout(){
    if(!nnGraph) return; var r=nnGraph.getBoundingClientRect();
    nnLines.setAttribute('width',r.width); nnLines.setAttribute('height',r.height);
    nnLines.setAttribute('viewBox','0 0 '+r.width+' '+r.height);
    nnEdges.forEach(function(e){
      e.el.setAttribute('x1',e.ax/100*r.width); e.el.setAttribute('y1',e.ay/100*r.height);
      e.el.setAttribute('x2',e.bx/100*r.width); e.el.setAttribute('y2',e.by/100*r.height);
    });
  }
  function nnApply(sel){
    // edges
    nnEdges.forEach(function(e){
      e.el.classList.remove('hot','dim'); if(!sel) return;
      var hot=false;
      if(sel.type==='core') hot=true;
      else if(sel.type==='domain') hot = e.keys.indexOf('core-'+sel.dkey)>=0 || e.keys[0].indexOf(sel.dkey+'-')===0;
      else if(sel.type==='skill') hot = e.keys.indexOf('core-'+sel.dkey)>=0 || e.keys.indexOf(sel.dkey+'-'+sel.sidx)>=0;
      e.el.classList.add(hot?'hot':'dim');
    });
    // nodes
    nnNodeEls.forEach(function(n){
      n.classList.remove('hot','dim'); if(!sel) return;
      var d=n.dataset, hot=false;
      if(d.type==='core') hot=true;
      else if(sel.type==='core') hot=true;
      else if(sel.type==='domain') hot = (d.dkey===sel.dkey);
      else if(sel.type==='skill') hot = (d.type==='domain'&&d.dkey===sel.dkey) || (d.type==='skill'&&d.dkey===sel.dkey&&(+d.sidx)===sel.sidx);
      n.classList.add(hot?'hot':'dim');
    });
    nnReadout && nnRender(sel);
  }
  function nnRender(sel){
    if(!nnReadout) return;
    if(!sel || sel.type==='core'){
      var total=0; nnDomains.forEach(function(d){total+=d.skills.length;});
      nnReadout.innerHTML='<div class="ro-k">Neural map</div><div class="ro-t">'+total+' skills · '+nnDomains.length+' domains</div>'+
        '<div class="ro-d">The core routes through four domains into the tools that power them.</div>'+
        '<div class="ro-hint">▸ hover a node to trace its path</div>';
      return;
    }
    if(sel.type==='domain'){
      var dd=nnDomains.filter(function(x){return x.key===sel.dkey;})[0];
      var names=dd.skills.map(function(s){return s[0];}).join(' · ');
      nnReadout.innerHTML='<div class="ro-k">Domain</div><div class="ro-t">'+dd.name+'</div>'+
        '<div class="ro-bar"><i style="width:'+dd.lvl+'%"></i></div>'+
        '<div class="ro-meta"><span>'+dd.skills.length+' skills</span><span>'+dd.lvl+'% domain</span></div>'+
        '<div class="ro-d" style="margin-top:10px;margin-bottom:0">'+names+'</div>';
      return;
    }
    // skill
    var dom=nnDomains.filter(function(x){return x.key===sel.dkey;})[0];
    nnReadout.innerHTML='<div class="ro-k">Skill · '+dom.name+'</div><div class="ro-t">'+sel.name+'</div>'+
      '<div class="ro-bar"><i style="width:'+sel.lvl+'%"></i></div>'+
      '<div class="ro-meta"><span>proficiency</span><span>'+sel.lvl+'%</span></div>';
  }
  // wire hover/click
  nnNodeEls.forEach(function(n){
    var d=n.dataset;
    var sel = d.type==='core' ? {type:'core'} :
              d.type==='domain' ? {type:'domain',dkey:d.dkey} :
              {type:'skill',dkey:d.dkey,sidx:+d.sidx,name:d.name,lvl:+d.lvl};
    n.addEventListener('mouseenter',function(){ nnApply(sel); });
    n.addEventListener('mouseleave',function(){ nnApply(nnSel); });
    n.addEventListener('click',function(){ nnSel = (nnSel && JSON.stringify(nnSel)===JSON.stringify(sel)) ? null : sel; nnApply(nnSel); });
  });
  if(nnStage){ nnLayout(); nnApply(null); window.addEventListener('resize',nnLayout); }

  // ── JOURNEY — real milestones ──
  // ── JOURNEY — vertical focus timeline (scroll to move through milestones) ──
  var journey=[
    ['Nepal','Where it began','Grew up in Nepal — equal parts curiosity, computers, and questions nobody around me could answer yet.'],
    ['2024','USA · Augustana College','Crossed an ocean for a Computer Science & Data Science degree. New country, same obsession — building things that think.'],
    ['2024','First internships','Early roles at IGC Business Holdings and Smart Solar — my first look at how real teams plan and ship.'],
    ['2024','AI research','Joined the CS Department researching how large language and vision models read and reason over video.'],
    ['2025','Building systems','Shipped EarthTwin and a multi-agent system — turning research instincts into things people can actually use.'],
    ['Next','What\'s ahead','Heading toward work as an ML / AI engineer — and whatever hard problem comes next.']
  ];
  var jrTrack=document.getElementById('jrTrack');
  var jrItems=[], jrActive=0, JR_GAP=170;
  if(jrTrack){
    var jrTot=(journey.length<10?'0':'')+journey.length;
    journey.forEach(function(j,i){
      var no=(i+1<10?'0':'')+(i+1);
      var it=document.createElement('div'); it.className='jr-item';
      it.innerHTML='<div class="jr-card">'+
        '<div class="jr-head"><span class="jr-year">'+j[0]+'</span><span class="jr-title">'+j[1]+'</span><span class="jr-idx">'+no+' / '+jrTot+'</span></div>'+
        '<div class="jr-detail">'+
          '<div class="jr-media"><span class="jr-scan"></span><span class="jr-cn tl"></span><span class="jr-cn br"></span><span class="jr-mlbl">MEMORY · '+String(j[0]).toUpperCase()+'</span></div>'+
          '<p class="jr-blurb">'+j[2]+'</p>'+
        '</div></div>';
      it.addEventListener('click',function(){ setJourney(i); });
      jrTrack.appendChild(it); jrItems.push(it);
    });
  }
  function layoutJourney(){
    jrItems.forEach(function(it,i){
      var d=i-jrActive, ad=Math.abs(d);
      it.style.top=(d*JR_GAP)+'px';
      it.style.opacity = ad>2 ? 0 : (i===jrActive ? 1 : (ad===1 ? 0.5 : 0.22));
      it.style.pointerEvents = ad>2 ? 'none' : 'auto';
      it.classList.toggle('active', i===jrActive);
    });
  }
  function setJourney(i){
    jrActive=Math.max(0,Math.min(journey.length-1,i));
    layoutJourney();
  }
  if(jrTrack){ layoutJourney(); }

  /* ---- nav state ---- */
  function setActiveNav(id){
    document.querySelectorAll('#menu button').forEach(function(b){ b.classList.toggle('on', b.dataset.go===id); });
    document.querySelectorAll('.holo-card').forEach(function(b){ b.classList.toggle('active', b.dataset.go===id); });
  }

  /* ---- staggered content reveal inside a section ---- */
  function revealSection(id){
    var els = scenes[id].querySelectorAll('.anim');
    anime.set(els,{opacity:0,translateY:26});
    anime({targets:els,opacity:[0,1],translateY:[26,0],delay:anime.stagger(55,{start:120}),
      duration:620,easing:'cubicBezier(.2,.8,.2,1)'});
    if(id!=='hero') setStatus('<span class="live">●</span> '+(MOD[id]||id)+' MODULE ACTIVE');
  }

  /* ---- the seamless transition ---- */
  function show(id){ scenes[id].classList.add('active'); }
  function hide(id){ var s=scenes[id]; s.classList.remove('active'); s.style.opacity=''; s.style.transform=''; }

  function transitionTo(id, origin){
    if(busy || id===current) return;
    busy = true;
    setActiveNav(id==='hero'?'hero':id);
    if(id==='journey'){ jrActive=0; layoutJourney(); }
    // watchdog: guarantee we never get stuck mid-transition (dropped RAF frame, etc.)
    clearTimeout(window.__txWatch);
    window.__txWatch = setTimeout(function(){
      if(!busy) return;
      Array.prototype.slice.call(fx.children).forEach(function(n){ fx.removeChild(n); });
      Object.keys(scenes).forEach(function(k){ if(k!==id) hide(k); });
      show(id); anime.set(scenes[id],{opacity:1}); revealSection(id);
      current=id; busy=false;
    }, 1900);
    if(id==='hero'){ if(presenter) presenter.classList.remove('show'); if(aiVoice) aiVoice.style.display=''; }
    else { if(presenter) presenter.classList.add('show'); if(aiVoice) aiVoice.style.display='none'; }
    if(id==='hero') setStatus('<span class="live">●</span> PROFILE ONLINE — select a module');
    else setStatus('<span class="live">▸</span> Loading '+(MOD[id]||id)+' module…');
    if(id==='hero') speak(moduleLines.hero); else sectionSpeak(id);
    var ox = origin ? origin.x : window.innerWidth/2;
    var oy = origin ? origin.y : window.innerHeight*0.4;
    var fromScene = scenes[current];
    var toScene = scenes[id];

    // prep incoming
    anime.set(toScene,{opacity:0});

    if(fxMode==='expand'){
      var rect = (origin && origin.rect) ? origin.rect
        : {left:window.innerWidth/2-130,top:window.innerHeight/2-46,width:260,height:92};
      var ex=document.createElement('div'); ex.className='expander';
      ex.style.left=rect.left+'px'; ex.style.top=rect.top+'px';
      ex.style.width=rect.width+'px'; ex.style.height=rect.height+'px';
      ex.innerHTML='<span class="ex-scan"></span><span class="ex-label">'+(MOD[id]||id)+' ▸ LOADING</span>'+
        '<span class="ex-cn ex-tl"></span><span class="ex-cn ex-tr"></span><span class="ex-cn ex-bl"></span><span class="ex-cn ex-br"></span>';
      fx.appendChild(ex);
      var scan=ex.querySelector('.ex-scan');
      var tlx=anime.timeline({easing:'cubicBezier(.65,0,.18,1)'});
      tlx.add({targets:ex,left:0,top:0,width:window.innerWidth,height:window.innerHeight,borderRadius:[14,0],duration:640})
         .add({targets:scan,translateY:[0,window.innerHeight],duration:640,easing:'linear'},0)
         .add({targets:ex,opacity:[1,0],duration:440,easing:'easeOutQuad',
            begin:function(){ hide(current); show(id); anime.set(toScene,{opacity:1}); revealSection(id); },
            complete:function(){ if(ex.parentNode) fx.removeChild(ex); current=id; busy=false; }});
      return;
    }

    if(fxMode==='wipe'){
      var w=document.createElement('div'); w.className='wipe'; fx.appendChild(w);
      anime.set(w,{scaleX:0, transformOrigin:(ox<window.innerWidth/2?'left':'right')});
      var tl=anime.timeline({easing:'cubicBezier(.7,0,.2,1)'});
      tl.add({targets:w,scaleX:[0,1],duration:420})
        .add({targets:fromScene,opacity:0,duration:1,complete:function(){hide(current);}},'-=200')
        .add({targets:toScene,opacity:1,duration:1,begin:function(){show(id);}},'-=10')
        .add({targets:w,scaleX:[1,0],transformOrigin:(ox<window.innerWidth/2?'right':'left'),duration:480,
          begin:function(){revealSection(id);},
          complete:function(){fx.removeChild(w);current=id;busy=false;}});
      return;
    }

    if(fxMode==='zoom'){
      var tlz=anime.timeline({easing:'cubicBezier(.6,0,.2,1)'});
      // hero zooms toward the clicked node, blurs out
      tlz.add({targets:fromScene,scale:[1,1.6],opacity:[1,0],duration:560,
        transformOrigin:(ox/window.innerWidth*100)+'% '+(oy/window.innerHeight*100)+'%',
        complete:function(){hide(current);anime.set(fromScene,{scale:1});}})
        .add({targets:toScene,opacity:[0,1],scale:[1.18,1],duration:560,
          begin:function(){show(id);revealSection(id);},
          complete:function(){anime.set(toScene,{scale:1});current=id;busy=false;}},'-=380');
      return;
    }

    // default: IRIS — a colored circle blooms from the clicked dot, becomes the section, then opens
    var maxR = Math.hypot(Math.max(ox,window.innerWidth-ox), Math.max(oy,window.innerHeight-oy));
    var d = maxR*2;
    var iris=document.createElement('div'); iris.className='iris';
    iris.style.width=d+'px'; iris.style.height=d+'px';
    iris.style.left=(ox-maxR)+'px'; iris.style.top=(oy-maxR)+'px';
    fx.appendChild(iris);
    var tl=anime.timeline();
    tl.add({targets:iris,scale:[0,1],duration:480,easing:'cubicBezier(.5,0,.2,1)',
        complete:function(){ hide(current); show(id); }})
      .add({targets:toScene,opacity:[0,1],duration:240,easing:'linear',
        begin:function(){revealSection(id);}},'-=40')
      .add({targets:iris,scale:[1,0],duration:520,easing:'cubicBezier(.5,0,.2,1)',
        complete:function(){fx.removeChild(iris);current=id;busy=false;}},'-=120');
  }

  /* ---- wire clicks ---- */
  function originFrom(e){
    var r = e.currentTarget.getBoundingClientRect();
    var rect = {left:r.left,top:r.top,width:r.width,height:r.height};
    var dot = e.currentTarget.querySelector('.dot,.ring,.hc-glyph');
    if(dot){ var dr=dot.getBoundingClientRect(); return {x:dr.left+dr.width/2,y:dr.top+dr.height/2,rect:rect}; }
    return {x:r.left+r.width/2,y:r.top+r.height/2,rect:rect};
  }
  document.querySelectorAll('[data-go]').forEach(function(b){
    b.addEventListener('click',function(e){ transitionTo(b.dataset.go, originFrom(e)); });
  });

  // the avatar projects its modules — hover lights a beam, glows, and speaks
  var _beamHideT;
  document.querySelectorAll('.holo-card[data-go]').forEach(function(b){
    var hv;
    b.addEventListener('mouseenter',function(){
      if(current!=='hero')return;
      clearTimeout(_beamHideT);
      if(figureEl) figureEl.classList.add('projecting');
      showBeam(b);
      hv=setTimeout(function(){ if(current==='hero') speak(hoverLines[b.dataset.go]||''); },120);
    });
    b.addEventListener('mouseleave',function(){
      if(hv) clearTimeout(hv);
      _beamHideT=setTimeout(function(){ if(figureEl) figureEl.classList.remove('projecting'); hideBeam(); },70);
    });
  });

  /* ---- wheel: spin disc on Works; else hero<->section ---- */
  var wlock=false, discCooldown=false, jrCooldown=false;
  window.addEventListener('wheel',function(e){
    if(current==='projects'){
      if(busy) return;
      if(discCooldown) return;
      discCooldown=true; setTimeout(function(){discCooldown=false;},240);
      setDisc(discActive + (e.deltaY>0?1:-1));
      return;
    }
    if(current==='journey'){
      if(busy) return;
      if(jrCooldown) return;
      jrCooldown=true; setTimeout(function(){jrCooldown=false;},240);
      setJourney(jrActive + (e.deltaY>0?1:-1));
      return;
    }
    if(busy||wlock) return;
    if(current==='hero' && e.deltaY>30){ wlock=true; transitionTo('about',{x:window.innerWidth/2,y:window.innerHeight*0.5}); setTimeout(function(){wlock=false;},1400); }
    else if(current!=='hero' && e.deltaY<-30){ wlock=true; transitionTo('hero',{x:window.innerWidth/2,y:60}); setTimeout(function(){wlock=false;},1400); }
  },{passive:true});

  /* keyboard back */
  window.addEventListener('keydown',function(e){ if(e.key==='Escape'&&current!=='hero') transitionTo('hero',{x:window.innerWidth/2,y:60}); });

  /* ---- hero figure parallax + scan loop ---- */
  var figure=document.getElementById('figure');
  document.addEventListener('mousemove',function(e){
    if(current!=='hero')return;
    var dx=(e.clientX/window.innerWidth-.5), dy=(e.clientY/window.innerHeight-.5);
    figure.style.transform='translateX(-50%) translate('+(dx*18)+'px,'+(dy*-10)+'px)';
    document.querySelector('.ghost').style.transform='translate(-50%,-50%) translate('+(dx*-30)+'px,'+(dy*-16)+'px)';
  });
  anime({targets:'#scan',top:['0%','100%'],duration:2600,easing:'easeInOutSine',loop:true,direction:'alternate'});

  // ── AI presence engine — predefined "speech", not a chatbot ──
  var aiSay=document.getElementById('aiSay'), aiVoice=document.getElementById('aiVoice'), figureEl=document.getElementById('figure');
  var prSay=document.getElementById('prSay'), prVoice=document.getElementById('prVoice'), prFig=document.getElementById('prAv');
  var beamLayer=document.getElementById('beamLayer');
  function showBeam(card){
    if(!beamLayer||!figureEl||!card) return;
    var imgEl=figureEl.querySelector('.me');
    var f=(imgEl||figureEl).getBoundingClientRect(), c=card.getBoundingClientRect();
    // account for object-fit:contain letterboxing — anchor onto the VISIBLE figure
    var ay, ax=f.left+f.width*0.60;
    if(imgEl && imgEl.naturalWidth){
      var renderedH=Math.min(f.height, f.width*(imgEl.naturalHeight/imgEl.naturalWidth));
      var visTop=f.bottom-renderedH;            // object-position bottom
      ay=visTop+renderedH*0.30;                  // upper chest / shoulder
    } else {
      ay=f.top+f.height*0.62;
    }
    var bx=c.left+4, by=c.top+c.height/2;
    var mx=(ax+bx)/2, my=Math.min(ay,by)-26;
    var g=card.querySelector('.hc-glyph');
    var col=g?getComputedStyle(g).color:'#e1352b';
    beamLayer.innerHTML='<path d="M'+ax+' '+ay+' Q'+mx+' '+my+' '+bx+' '+by+'"></path>'+
      '<circle cx="'+ax+'" cy="'+ay+'" r="3.2"></circle>'+
      '<circle cx="'+bx+'" cy="'+by+'" r="2.6"></circle>';
    var p=beamLayer.querySelector('path');
    p.style.color=col; p.style.stroke=col;
    beamLayer.querySelectorAll('circle').forEach(function(ci){ ci.style.fill=col; ci.style.color=col; });
    var len=p.getTotalLength(); p.style.strokeDasharray=len; p.style.strokeDashoffset=len;
    anime({targets:p,strokeDashoffset:[len,0],duration:500,easing:'easeOutQuad'});
  }
  function hideBeam(){ if(beamLayer) beamLayer.innerHTML=''; }

  var idleLines=[
    "Hi — I'm an AI representation of Himanshu.",
    "I build AI-powered software — RAG pipelines, agents, full-stack apps.",
    "Computer Science & Data Science · from Nepal, now in the US.",
    "Select a module on me and I'll walk you through it.",
    "Right now I'm exploring LLMs and multimodal AI."
  ];
  var moduleLines={
    about:"Opening my profile — here's who I am.",
    projects:"Pulling up the systems I've built.",
    skills:"Here's my technical stack and capabilities.",
    journey:"Let me trace my journey — Nepal to AI research.",
    contact:"Connecting you — here's how to reach me.",
    hero:"Back to start. What would you like to explore?"
  };
  // richer, first-person lines spoken when you point at a module
  var hoverLines={
    about:"That's me — where I'm from and what drives me. Open it for the full story.",
    projects:"This is where I keep everything I've built — pipelines, agents, full-stack apps.",
    skills:"My toolkit — the languages, frameworks and systems I work in.",
    journey:"My path so far: from Nepal to AI research in the States.",
    contact:"Want to reach the real me? I'll hand you the links."
  };
  var _type=null,_idle=null,_idleIdx=0,_shownAI=false;
  function _clearAI(){ if(_type){clearTimeout(_type);_type=null;} if(_idle){clearTimeout(_idle);_idle=null;} if(_secTimer){clearTimeout(_secTimer);_secTimer=null;} }
  function speak(text,thenIdle){
    if(!aiSay) return; _clearAI();
    if(aiVoice && !_shownAI){ _shownAI=true; anime({targets:aiVoice,opacity:[0,1],duration:500,easing:'easeOutQuad'}); }
    aiVoice && aiVoice.classList.add('speaking'); figureEl && figureEl.classList.add('speaking');
    prVoice && prVoice.classList.add('speaking'); prFig && prFig.classList.add('speaking');
    aiSay.textContent=''; if(prSay) prSay.textContent=''; var i=0;
    (function step(){
      if(i<=text.length){ var s=text.slice(0,i); aiSay.textContent=s; if(prSay) prSay.textContent=s; i++; _type=setTimeout(step,24+Math.random()*36); }
      else { aiVoice && aiVoice.classList.remove('speaking'); figureEl && figureEl.classList.remove('speaking');
        prVoice && prVoice.classList.remove('speaking'); prFig && prFig.classList.remove('speaking');
        if(thenIdle!==false){ _idle=setTimeout(idleSpeak,3900); } }
    })();
  }
  function idleSpeak(){ if(current!=='hero') return; speak(idleLines[_idleIdx%idleLines.length]); _idleIdx++; }

  // per-module narration — the presenter explains a few things while you're on a page
  var sectionLines={
    about:["Opening my profile — here's who I am.","I'm a Computer Science & Data Science student from Nepal, now in the US.","I build AI systems — and the software that wraps around them.","Off the screen: the mountains back home, and far too many open browser tabs."],
    projects:["These are the systems I've built.","Each one started as a question I couldn't stop thinking about.","Mostly AI and ML work — with full-stack pieces holding it together."],
    skills:["Here's my technical stack.","Strongest in Python, PyTorch and the modern web.","I pick depth over breadth — finished over flashy."],
    journey:["Let me trace my journey.","From Nepal to AI research in the States.","Still early — but the direction is set: ML engineer."],
    contact:["Here's how to reach the real me.","I read every message — say namaste anytime."]
  };
  var _secTimer=null,_secIdx=0;
  function sectionSpeak(id){
    var lines=sectionLines[id]; if(!lines){ speak(moduleLines[id]||'',false); return; }
    _secIdx=0;
    (function next(){
      if(current!==id) return;
      var line=lines[_secIdx%lines.length];
      speak(line,false); _secIdx++;
      _secTimer=setTimeout(next, Math.max(4200, line.length*55+2400));
    })();
  }

  // entrance of hero modules — gated behind the boot sequence
  function runHeroEntrance(){
    anime.set('.holo-card',{opacity:0});
    anime({targets:'.holo-head',opacity:[0,1],translateX:[14,0],duration:520,easing:'easeOutQuad'});
    anime({targets:'.holo-card',opacity:[0,1],translateX:[30,0],
      delay:anime.stagger(90,{start:160}),duration:620,easing:'cubicBezier(.2,.8,.2,1)',
      complete:function(){ document.querySelectorAll('.holo-card').forEach(function(c){ c.style.transform=''; c.style.opacity=''; }); }});
    anime({targets:'.hero-intro > *',opacity:[0,1],translateY:[14,0],
      delay:anime.stagger(70,{start:60}),duration:600,easing:'easeOutQuad'});
    setTimeout(function(){ if(current==='hero') idleSpeak(); }, 850);
  }

  (function boot(){
    var fill=document.getElementById('bootFill'), line=document.getElementById('bootLine'), ov=document.getElementById('boot');
    var msgs=['Initializing HIMANSHU.AI…','Loading personality matrix…','Indexing knowledge modules…','Profile online.'];
    var done=false, mt=null;
    function finish(){ if(done) return; done=true; if(mt) clearInterval(mt); if(ov){ ov.style.opacity=0; ov.style.display='none'; } runHeroEntrance(); }
    if(!fill||!ov){ finish(); return; }
    anime.set('.holo-card',{opacity:0}); anime.set('.holo-head',{opacity:0}); anime.set('.hero-intro > *',{opacity:0});
    var i=0; mt=setInterval(function(){ i++; if(line&&msgs[i]) line.textContent=msgs[i]; }, 430);
    anime({targets:fill,width:['0%','100%'],duration:1750,easing:'easeInOutQuad',complete:function(){
      if(mt) clearInterval(mt);
      anime({targets:ov,opacity:[1,0],duration:520,easing:'easeOutQuad',complete:finish});
    }});
    setTimeout(finish, 3600); // safety: never stay stuck on the boot screen
  })();
})();
