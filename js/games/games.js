/* Bộ máy trò chơi. Mỗi loại game là một hàm độc lập; có thể bổ sung type mới tại đây. */
(function(){
 const registry = {};
 const shuffle = a => [...a].sort(()=>Math.random()-.5);
 const pick = (a,n)=>shuffle(a).slice(0,n);
 const picture = (v)=>`<span>${v}</span>`;
 function win(stage,message="BÉ GIỎI LẮM!"){stage.innerHTML=`<div class="win-screen"><div class="celebrate">🎉</div><h2>${message}</h2><button class="btn" id="playAgain">↻ Chơi lại</button></div>`;stage.querySelector("#playAgain").onclick=()=>window.CUNI_APP.restartGame();}
 function feedback(ok){window.CUNI_APP.feedback(ok);}
 function register(type,fn){registry[type]=fn;}
 register("quiz",(stage,game)=>{
   const qs=shuffle(game.data||[]);let index=0;
   const show=()=>{if(index>=qs.length)return win(stage);const q=qs[index];
     stage.innerHTML=`<div class="page-number">${index+1}/${qs.length}</div><div class="big-picture">${picture(q.pic||"❓")}</div><h2>${q.question}</h2><div class="options">${q.options.map((o,i)=>`<button class="option" data-i="${i}">${o}</button>`).join("")}</div>`;
     stage.querySelectorAll(".option").forEach(b=>b.onclick=()=>{const ok=+b.dataset.i===q.answer;b.classList.add(ok?"correct":"wrong");feedback(ok);if(ok){stage.querySelectorAll("button").forEach(x=>x.disabled=true);setTimeout(()=>{index++;show();},750)}else setTimeout(()=>b.classList.remove("wrong"),450)});
   };show();
 });
 register("pairs",(stage,game)=>{
   const pairs=game.data||[],left=shuffle(pairs.map(p=>p[0])),right=shuffle(pairs.map(p=>p[1]));let selected=null,done=0;
   stage.innerHTML=`<h2>Chạm một hình, rồi chạm hình có liên quan</h2><div class="columns"><div class="column">${left.map(e=>`<button class="option" data-side="0" data-v="${e}">${e}</button>`).join("")}</div><div class="column">${right.map(e=>`<button class="option" data-side="1" data-v="${e}">${e}</button>`).join("")}</div></div>`;
   stage.querySelectorAll(".option").forEach(b=>b.onclick=()=>{if(b.classList.contains("correct"))return;if(!selected||selected.dataset.side===b.dataset.side){selected?.classList.remove("wrong");selected=b;b.classList.add("wrong");return}
     const a=selected.dataset.side==="0"?selected:b,c=selected.dataset.side==="1"?selected:b;const ok=pairs.some(p=>p[0]===a.dataset.v&&p[1]===c.dataset.v);selected.classList.remove("wrong");selected=null;
     if(ok){a.classList.add("correct");c.classList.add("correct");feedback(true);if(++done===pairs.length)setTimeout(()=>win(stage),650)}else{b.classList.add("wrong");feedback(false);setTimeout(()=>b.classList.remove("wrong"),450)}
   });
 });
 register("memory",(stage,game)=>{
   const faces=shuffle([...(game.data||[]),...(game.data||[])]);let opened=[],matched=0,lock=false;
   stage.innerHTML=`<h2>Lật hai thẻ để tìm hình giống nhau</h2><div class="memory-grid">${faces.map((e,i)=>`<button class="memory-card" data-i="${i}"><span class="back">❔</span><span class="face">${e}</span></button>`).join("")}</div>`;
   stage.querySelectorAll(".memory-card").forEach(b=>b.onclick=()=>{if(lock||b.classList.contains("open")||b.classList.contains("matched"))return;b.classList.add("open");opened.push(b);if(opened.length===2){const [a,c]=opened;if(faces[+a.dataset.i]===faces[+c.dataset.i]){a.classList.add("matched");c.classList.add("matched");opened=[];matched++;feedback(true);if(matched===faces.length/2)setTimeout(()=>win(stage),650)}else{lock=true;feedback(false);setTimeout(()=>{a.classList.remove("open");c.classList.remove("open");opened=[];lock=false},850)}}});
 });
 register("count",(stage,game)=>{
   const cfg=game.data||{},items=cfg.items||["🍎"],max=cfg.max||5,total=cfg.rounds||5;let round=0;
   const show=()=>{if(round>=total)return win(stage,"BÉ ĐẾM RẤT GIỎI!");const n=1+Math.floor(Math.random()*max),item=cfg.items[Math.floor(Math.random()*cfg.items.length)],opts=shuffle([n,...pick(Array.from({length:max},(_,i)=>i+1).filter(x=>x!==n),2)]);
     stage.innerHTML=`<div class="page-number">${round+1}/${total}</div><h2>Có bao nhiêu ${item}?</h2><div class="big-picture">${Array(n).fill(item).join(" ")}</div><div class="options">${opts.map(x=>`<button class="option" data-v="${x}">${x}</button>`).join("")}</div>`;
     stage.querySelectorAll(".option").forEach(b=>b.onclick=()=>{const ok=+b.dataset.v===n;b.classList.add(ok?"correct":"wrong");feedback(ok);if(ok){stage.querySelectorAll("button").forEach(x=>x.disabled=true);setTimeout(()=>{round++;show()},700)}else setTimeout(()=>b.classList.remove("wrong"),450)});
   };show();
 });
 register("compare",(stage,game)=>{
   let round=0,total=game.data?.rounds||5;
   const show=()=>{if(round>=total)return win(stage,"BÉ SO SÁNH RẤT GIỎI!");let a=1+Math.floor(Math.random()*5),b=1+Math.floor(Math.random()*5);while(a===b)b=1+Math.floor(Math.random()*5);const left="🍎",right="⭐",correct=a>b?0:1;
     stage.innerHTML=`<div class="page-number">${round+1}/${total}</div><h2>Nhóm nào có nhiều hơn?</h2><div class="columns"><div class="column"><div class="big-picture">${left.repeat(a)}</div><button class="option" data-i="0">Nhóm bên trái</button></div><div class="column"><div class="big-picture">${right.repeat(b)}</div><button class="option" data-i="1">Nhóm bên phải</button></div></div>`;
     stage.querySelectorAll(".option").forEach(x=>x.onclick=()=>{let ok=+x.dataset.i===correct;x.classList.add(ok?"correct":"wrong");feedback(ok);if(ok){stage.querySelectorAll("button").forEach(y=>y.disabled=true);setTimeout(()=>{round++;show()},700)}else setTimeout(()=>x.classList.remove("wrong"),450)});
   };show();
 });
 register("sequence",(stage,game)=>{
   const source=game.data||[],seq=shuffle(source).slice(0,3),opts=shuffle([...seq]);let shown=true;
   stage.innerHTML=`<h2>Hãy quan sát và ghi nhớ thứ tự</h2><div class="options">${seq.map(x=>`<span class="option">${x}</span>`).join("")}</div><p>Quan sát thật kỹ nhé!</p><button class="btn" id="hideSeq">Bắt đầu thử tài</button>`;
   stage.querySelector("#hideSeq").onclick=()=>{stage.innerHTML=`<h2>Chọn các hình theo đúng thứ tự lúc nãy</h2><div class="options">${opts.map((x,i)=>`<button class="option" data-v="${x}">${x}</button>`).join("")}</div><p id="progress">Đã chọn: 0/${seq.length}</p>`;let i=0;
     stage.querySelectorAll(".option").forEach(b=>b.onclick=()=>{if(b.disabled)return;const ok=b.dataset.v===seq[i];feedback(ok);if(ok){b.classList.add("correct");b.disabled=true;i++;stage.querySelector("#progress").textContent=`Đã chọn: ${i}/${seq.length}`;if(i===seq.length)setTimeout(()=>win(stage,"BÉ NHỚ RẤT TỐT!"),650)}else{b.classList.add("wrong");setTimeout(()=>b.classList.remove("wrong"),450)}});
   };
 });
 register("paint",(stage)=>{
   const colors=["#ff4757","#ffa502","#ffd32a","#2ed573","#1e90ff","#a55eea","#8b5a2b","#ffffff"];let color=colors[0];
   stage.innerHTML=`<h2>Chọn màu rồi chạm vào các phần của bức tranh</h2><div class="options color-options">${colors.map((c,i)=>`<button class="color-dot" data-c="${c}" style="background:${c}" aria-label="Màu ${i+1}"></button>`).join("")}</div><svg class="drawing" viewBox="0 0 400 280" role="img" aria-label="Tranh ngôi nhà"><rect class="paintable" width="400" height="280" fill="#fff"/><circle class="paintable" cx="340" cy="50" r="30" fill="#fff"/><rect class="paintable" y="200" width="400" height="80" fill="#fff"/><rect class="paintable" x="40" y="150" width="20" height="60" fill="#fff"/><circle class="paintable" cx="50" cy="130" r="40" fill="#fff"/><rect class="paintable" x="110" y="110" width="150" height="100" fill="#fff"/><polygon class="paintable" points="95,115 185,45 275,115" fill="#fff"/><rect class="paintable" x="170" y="150" width="40" height="60" fill="#fff"/><rect class="paintable" x="222" y="130" width="30" height="30" fill="#fff"/></svg><button class="btn" id="paintDone">✔ Hoàn thành</button>`;
   stage.querySelectorAll(".color-dot").forEach(b=>b.onclick=()=>{color=b.dataset.c;stage.querySelectorAll(".color-dot").forEach(x=>x.classList.remove("selected"));b.classList.add("selected")});
   stage.querySelectorAll(".paintable").forEach(x=>{x.style.stroke="#3a2a14";x.style.strokeWidth="3";x.style.cursor="pointer";x.onclick=()=>x.setAttribute("fill",color)});
   stage.querySelector("#paintDone").onclick=()=>win(stage,"BỨC TRANH ĐẸP QUÁ!");
 });
 register("external",(stage,game)=>{
   stage.innerHTML=`<iframe class="external-game" title="${game.title}" src="${game.src}" allowfullscreen></iframe>`;
 });

 register("oddone",(stage,game)=>{
   let i=0;const qs=game.data||[];
   const show=()=>{if(i>=qs.length)return win(stage,"BÉ QUAN SÁT RẤT GIỎI!");const q=qs[i];
     stage.innerHTML=`<div class="page-number">${i+1}/${qs.length}</div><h2>${q.question}</h2><div class="options">${q.items.map((x,j)=>`<button class="option" data-i="${j}">${x}</button>`).join("")}</div>`;
     stage.querySelectorAll(".option").forEach(b=>b.onclick=()=>{let ok=+b.dataset.i===q.answer;b.classList.add(ok?"correct":"wrong");feedback(ok);if(ok){stage.querySelectorAll("button").forEach(x=>x.disabled=true);setTimeout(()=>{i++;show()},700)}else setTimeout(()=>b.classList.remove("wrong"),450)});
   };show();
 });
 register("sort",(stage,game)=>{
   const d=game.data;let chosen=[];
   stage.innerHTML=`<h2>${d.question}</h2><p>Chạm vào tất cả hình phù hợp nhé!</p><div class="options">${d.items.map((x,i)=>`<button class="option" data-i="${i}">${x}</button>`).join("")}</div><button class="btn" id="checkSort">Kiểm tra</button>`;
   stage.querySelectorAll(".option").forEach(b=>b.onclick=()=>{const i=+b.dataset.i;if(chosen.includes(i)){chosen=chosen.filter(x=>x!==i);b.classList.remove("correct")}else{chosen.push(i);b.classList.add("correct")}});
   stage.querySelector("#checkSort").onclick=()=>{const got=chosen.map(i=>d.items[i]).sort(),want=[...d.answers].sort(),ok=JSON.stringify(got)===JSON.stringify(want);feedback(ok);if(ok)win(stage,"BÉ PHÂN LOẠI RẤT GIỎI!");else{stage.querySelectorAll(".option").forEach(b=>b.classList.remove("correct"));chosen=[]}};
 });
 register("find",(stage,game)=>{
   let i=0,qs=game.data||[];const show=()=>{if(i>=qs.length)return win(stage,"BÉ TÌM RẤT NHANH!");let q=qs[i];
     stage.innerHTML=`<div class="page-number">${i+1}/${qs.length}</div><h2>${q.question}</h2><div class="options">${q.items.map(x=>`<button class="option" data-v="${x}">${x}</button>`).join("")}</div>`;
     stage.querySelectorAll(".option").forEach(b=>b.onclick=()=>{let ok=b.dataset.v===q.answer;b.classList.add(ok?"correct":"wrong");feedback(ok);if(ok){stage.querySelectorAll("button").forEach(x=>x.disabled=true);setTimeout(()=>{i++;show()},650)}else setTimeout(()=>b.classList.remove("wrong"),450)});
   };show();
 });
 register("letterorder",(stage,game)=>{
   let i=0;const rounds=game.data||[];const show=()=>{if(i>=rounds.length)return win(stage,"BÉ GHÉP CHỮ RẤT GIỎI!");const q=rounds[i];let answer=[];
     stage.innerHTML=`<div class="page-number">${i+1}/${rounds.length}</div><h2>Chọn chữ để tạo thành từ: ${q.word.replace(/./g,"_ ")}</h2><div class="options">${shuffle(q.letters).map((x,j)=>`<button class="option" data-v="${x}">${x}</button>`).join("")}</div><p id="letterProgress">Chữ đã chọn: </p>`;
     stage.querySelectorAll(".option").forEach(b=>b.onclick=()=>{if(b.disabled)return;answer.push(b.dataset.v);b.disabled=true;b.classList.add("correct");stage.querySelector("#letterProgress").textContent="Chữ đã chọn: "+answer.join("");if(answer.length===q.word.length){const ok=answer.join("")===q.word;feedback(ok);if(ok)setTimeout(()=>{i++;show()},700);else setTimeout(()=>show(),700)}});
   };show();
 });
 register("numberorder",(stage,game)=>{
   let r=0,total=game.data?.rounds||5;const show=()=>{if(r>=total)return win(stage,"BÉ XẾP SỐ RẤT GIỎI!");const nums=shuffle([1,2,3,4,5]);let selected=[];
     stage.innerHTML=`<div class="page-number">${r+1}/${total}</div><h2>Chạm các số theo thứ tự từ bé đến lớn</h2><div class="options">${nums.map(n=>`<button class="option" data-v="${n}">${n}</button>`).join("")}</div><p id="numberProgress">Đã chọn: 0/5</p>`;
     stage.querySelectorAll(".option").forEach(b=>b.onclick=()=>{if(b.disabled)return;const expected=selected.length+1,ok=+b.dataset.v===expected;feedback(ok);if(ok){selected.push(expected);b.disabled=true;b.classList.add("correct");stage.querySelector("#numberProgress").textContent=`Đã chọn: ${selected.length}/5`;if(selected.length===5)setTimeout(()=>{r++;show()},650)}else{b.classList.add("wrong");setTimeout(()=>b.classList.remove("wrong"),450)}});
   };show();
 });
 register("findcount",(stage,game)=>{
   let r=0,total=game.data?.rounds||6;const show=()=>{if(r>=total)return win(stage,"BÉ ĐẾM RẤT GIỎI!");const target=1+Math.floor(Math.random()*5),counts=shuffle([target,...pick([1,2,3,4,5].filter(x=>x!==target),2)]);
     stage.innerHTML=`<div class="page-number">${r+1}/${total}</div><h2>Hãy tìm nhóm có đúng ${target} quả dâu</h2><div class="options">${counts.map(n=>`<button class="option" data-n="${n}">${"🍓".repeat(n)}</button>`).join("")}</div>`;
     stage.querySelectorAll(".option").forEach(b=>b.onclick=()=>{let ok=+b.dataset.n===target;b.classList.add(ok?"correct":"wrong");feedback(ok);if(ok){stage.querySelectorAll("button").forEach(x=>x.disabled=true);setTimeout(()=>{r++;show()},650)}else setTimeout(()=>b.classList.remove("wrong"),450)});
   };show();
 });
 register("remember",(stage,game)=>{
   const items=shuffle(game.data||[]);let i=0;const show=()=>{if(i>=items.length)return win(stage,"BÉ NHỚ RẤT TỐT!");const target=items[i];stage.innerHTML=`<h2>Hãy ghi nhớ hình này nhé!</h2><div class="big-picture">${target}</div><button class="btn" id="ready">Con đã nhớ!</button>`;
     stage.querySelector("#ready").onclick=()=>{const opts=shuffle([target,...pick(items.filter(x=>x!==target),2)]);stage.innerHTML=`<h2>Con vừa nhìn thấy hình nào?</h2><div class="options">${opts.map(x=>`<button class="option" data-v="${x}">${x}</button>`).join("")}</div>`;
       stage.querySelectorAll(".option").forEach(b=>b.onclick=()=>{let ok=b.dataset.v===target;b.classList.add(ok?"correct":"wrong");feedback(ok);if(ok){stage.querySelectorAll("button").forEach(x=>x.disabled=true);setTimeout(()=>{i++;show()},650)}else setTimeout(()=>b.classList.remove("wrong"),450)});
     };
   };show();
 });
 register("missing",(stage,game)=>{
   let i=0;const items=shuffle(game.data||[]);const show=()=>{if(i>=items.length)return win(stage,"BÉ TINH MẮT QUÁ!");const gone=items[i],visible=shuffle(items.filter(x=>x!==gone).slice(0,4));
     stage.innerHTML=`<h2>Hình nào đã biến mất?</h2><div class="options">${visible.map(x=>`<span class="option">${x}</span>`).join("")}</div><p>Hãy suy nghĩ một chút nhé!</p><button class="btn" id="reveal">Hiện các lựa chọn</button>`;
     stage.querySelector("#reveal").onclick=()=>{const opts=shuffle([gone,...pick(items.filter(x=>x!==gone),2)]);stage.innerHTML=`<h2>Hình nào vừa biến mất?</h2><div class="options">${opts.map(x=>`<button class="option" data-v="${x}">${x}</button>`).join("")}</div>`;
       stage.querySelectorAll(".option").forEach(b=>b.onclick=()=>{let ok=b.dataset.v===gone;b.classList.add(ok?"correct":"wrong");feedback(ok);if(ok){stage.querySelectorAll("button").forEach(x=>x.disabled=true);setTimeout(()=>{i++;show()},650)}else setTimeout(()=>b.classList.remove("wrong"),450)});
     };
   };show();
 });
 register("pattern",(stage,game)=>{
   let i=0;const qs=game.data||[];const show=()=>{if(i>=qs.length)return win(stage,"BÉ TÌM QUY LUẬT RẤT GIỎI!");const q=qs[i];
     stage.innerHTML=`<div class="page-number">${i+1}/${qs.length}</div><h2>Hình nào sẽ xuất hiện tiếp theo?</h2><div class="options">${q.seq.map(x=>`<span class="option">${x}</span>`).join("")}<span class="option">❓</span></div><div class="options">${q.options.map((x,j)=>`<button class="option" data-i="${j}">${x}</button>`).join("")}</div>`;
     stage.querySelectorAll("button").forEach(b=>b.onclick=()=>{let ok=+b.dataset.i===q.answer;b.classList.add(ok?"correct":"wrong");feedback(ok);if(ok){stage.querySelectorAll("button").forEach(x=>x.disabled=true);setTimeout(()=>{i++;show()},650)}else setTimeout(()=>b.classList.remove("wrong"),450)});
   };show();
 });

 window.CUNI_GAMES={registry,register};
})();