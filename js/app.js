(function(){
 const $=s=>document.querySelector(s),app=$("#app"),toast=$("#toast"),dialog=$("#dialog");
 let sound=true,currentGame=null,audioCtx=null;
 const topics=window.CUNI_DATA.topics,games=window.CUNI_DATA.games;
 const topicById=id=>topics.find(t=>t.id===id);
 const gameById=id=>games.find(g=>g.id===id);
 function feedback(ok){if(sound){try{audioCtx=audioCtx||new AudioContext();let t=audioCtx.currentTime;[ok?660:260,ok?880:260].forEach((f,i)=>{let o=audioCtx.createOscillator(),g=audioCtx.createGain();o.frequency.value=f;g.gain.setValueAtTime(.06,t+i*.12);g.gain.exponentialRampToValueAtTime(.001,t+i*.12+.18);o.connect(g);g.connect(audioCtx.destination);o.start(t+i*.12);o.stop(t+i*.12+.2)})}catch(e){}}
   toast.textContent=ok?"Giỏi lắm! 👏":"Thử lại nhé! 💪";toast.className="toast show "+(ok?"good":"bad");clearTimeout(feedback.timer);feedback.timer=setTimeout(()=>toast.className="toast",900);
 }
 function home(){document.body.classList.remove("in-game");app.innerHTML=`<section class="hero"><div class="hero-owl">🦉</div><h1>CÚ NHÍ</h1><p class="tagline">Cùng chơi vui – Cùng khám phá – Cùng lớn khôn</p><p>Kho trò chơi giáo dục số dành cho giáo viên mầm non</p><div class="steps"><span>1. Chọn chủ đề</span><span>2. Chọn trò chơi</span><span>3. Cùng trẻ tham gia</span></div></section><div class="grid">${topics.map(t=>{let n=games.filter(g=>g.topic===t.id).length;return `<a class="topic-card" style="--accent:${t.color}" href="#/topic/${t.id}"><div class="topic-icon">${t.icon}</div><h2>${t.title}</h2><p>${t.desc}</p><span class="count">${n} trò chơi</span></a>`}).join("")}</div><footer><b>Cú Nhí</b> – Kho trò chơi giáo dục số dành cho giáo viên mầm non</footer>`;}
 function topicPage(id){document.body.classList.remove("in-game");const t=topicById(id);if(!t)return home();const list=games.filter(g=>g.topic===id);
   app.innerHTML=`<div class="page-head"><a class="btn btn-soft" href="#/">🏠 Trang chủ</a><h1>${t.icon} ${t.title}</h1></div><p class="page-intro">${t.desc}</p>${list.length?`<div class="grid">${list.map(g=>`<article class="game-card"><div class="game-icon">${g.icon||"🎮"}</div><h3>${g.title}</h3><p>${g.desc||""}</p><div class="skills"><span>${g.age||"3–6 tuổi"}</span>${(g.skills||[]).map(s=>`<span>${s}</span>`).join("")}</div><a class="btn" href="#/game/${g.id}">▶ Chơi ngay</a></article>`).join("")}</div>`:`<div class="empty">Chủ đề đang được bổ sung trò chơi.</div>`}`;
 }
 function enterFullscreen(){const el=document.documentElement;if(document.fullscreenElement){document.exitFullscreen?.();return;}const req=el.requestFullscreen||el.webkitRequestFullscreen;if(req){const p=req.call(el);if(p?.catch)p.catch(()=>showToast("Trình duyệt chưa cho phép toàn màn hình. Hãy nhấn nút lại nhé!"));}else showToast("Trình duyệt này chưa hỗ trợ toàn màn hình.");}
 function showToast(msg){toast.textContent=msg;toast.className="toast show";setTimeout(()=>toast.className="toast",1800);}
 function gamePage(id){const g=gameById(id);if(!g){home();return;}currentGame=g;document.body.classList.add("in-game");
   app.innerHTML=`<div class="game-toolbar"><a class="btn btn-soft" href="#/topic/${g.topic}">⬅ Chủ đề</a><a class="btn btn-soft" href="#/">🏠 Trang chủ</a><h1>${g.icon||"🎮"} ${g.title}</h1><button class="btn" id="restart">↻ Chơi lại</button><button class="btn btn-soft" id="gameFullscreen">⛶ Toàn màn hình</button></div><section class="stage" id="stage" aria-live="polite"></section>`;
   $("#restart").onclick=restartGame;$("#gameFullscreen").onclick=enterFullscreen;restartGame();
 }
 function restartGame(){if(!currentGame)return;const stage=$("#stage");if(!stage)return;const fn=window.CUNI_GAMES.registry[currentGame.type];if(!fn){stage.innerHTML=`<div class="empty">Chưa đăng ký bộ máy cho loại trò chơi: ${currentGame.type}</div>`;return;}fn(stage,currentGame);}
 function route(){dialog.classList.remove("open");const parts=(location.hash.slice(1)||"/").split("/").filter(Boolean);if(parts[0]==="topic")topicPage(parts[1]);else if(parts[0]==="game")gamePage(parts[1]);else home();window.scrollTo(0,0);}
 $("#fullscreenBtn").onclick=enterFullscreen;
 $("#soundToggle").onclick=()=>{sound=!sound;$("#soundToggle").textContent=sound?"🔊 Âm thanh":"🔇 Âm thanh";};
 document.addEventListener("keydown",e=>{if(e.key.toLowerCase()==="f"&&!e.ctrlKey&&!e.altKey){e.preventDefault();enterFullscreen();}if(e.key==="Escape"&&document.fullscreenElement){/* trình duyệt tự thoát fullscreen */}});
 document.addEventListener("fullscreenchange",()=>{const b=$("#fullscreenBtn");if(b)b.textContent=document.fullscreenElement?"⤢ Thoát toàn màn hình":"⛶ Toàn màn hình";const g=$("#gameFullscreen");if(g)g.textContent=document.fullscreenElement?"⤢ Thoát toàn màn hình":"⛶ Toàn màn hình";});
 window.addEventListener("hashchange",route);
 window.CUNI_APP={restartGame,feedback};
 route();
})();