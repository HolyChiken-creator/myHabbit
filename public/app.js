(() => {
  'use strict';

  const app = document.getElementById('app');
  const toast = document.getElementById('toast');
  const STORAGE = 'familyQuestStateV1';
  const AUTH = 'familyQuestAuthV1';
  const DAILY_QUEUE = 'myHabbitDailyQueueV1';
  const LAST_SERVER_PULL = 'myHabbitLastServerPullV1';
  const CONTENT_CACHE = 'myHabbitContentLibraryV1';
  const CONTENT_VERSION = '1.0.0';
  const QUEST_CATEGORIES = ['family','relationship','home','sport','health','mind','reading','cinema','creativity','finance','discipline'];
  const ACHIEVEMENT_FILES = ['general','levels','coins','streak','family','relationship','home','sport','health','mind','reading','cinema','creativity','finance','discipline','shop','secret','legendary'];
  const baseNavItems = [
    ['dashboard','⌂','Головна'],['quests','✓','Квести'],['shop','◈','Магазин'],
    ['achievements','🏆','Ачивки'],['family','👥','Сімʼя'],['profile','●','Профіль']
  ];
  const isAdmin = () => currentUser()?.role === 'admin' || state.users[0]?.id === state.currentUserId;
  const navItems = () => isAdmin() ? [...baseNavItems, ['admin','⚙','Адмін']] : baseNavItems;

  const seed = {
    family:{id:'demo-family',name:'Наша команда',code:'FAMILY25',level:12,xp:7420,coins:1850},
    currentUserId:'u1',
    users:[
      {id:'u1',name:'Андрій',role:'admin',telegramLinked:true,telegramUsername:'myhabbit_admin',gender:'male',avatar:'✦',level:18,xp:4380,coins:2640,streak:12,skills:{home:14,care:11,health:16,growth:9,finance:7},achievements:['a1','a2','a4','a6'],activity:['Закрив квест «Генеральне прибирання»','Отримав ачивку «Стабільність»','Підняв навичку «Здоровʼя» до 16 рівня']},
      {id:'u2',name:'Марія',role:'member',telegramLinked:true,telegramUsername:'maria',gender:'female',avatar:'✦',level:16,xp:3890,coins:3180,streak:18,skills:{home:17,care:18,health:12,growth:13,finance:10},achievements:['a1','a3','a5','a7'],activity:['Створила сюрприз для сімʼї','Купила «Вечір у кіно»','Закрила 30-й спільний квест']},
      {id:'u3',name:'Софія',role:'member',telegramLinked:false,gender:'female',avatar:'✦',level:9,xp:1690,coins:940,streak:6,skills:{home:7,care:9,health:8,growth:12,finance:4},achievements:['a1','a8'],activity:['Виконала домашнє завдання','Допомогла приготувати вечерю']}
    ],
    quests:[
      {id:'q1',title:'Генеральне прибирання',icon:'🧹',description:'Разом привести квартиру до ладу',type:'coop',participants:2,claimedBy:['u1'],rewardCoins:180,rewardXp:140,skill:'home',skillXp:25,status:'active',limited:false},
      {id:'q2',title:'Тренування після роботи',icon:'🏋️',description:'45 хвилин руху або спортзал',type:'personal',participants:1,claimedBy:[],rewardCoins:70,rewardXp:60,skill:'health',skillXp:18,status:'active',limited:false},
      {id:'q3',title:'Сюрприз для рідних',icon:'🎁',description:'Зробити щось приємне без нагадування',type:'limited',participants:1,claimedBy:[],rewardCoins:120,rewardXp:90,skill:'care',skillXp:22,status:'active',limited:true,stock:1},
      {id:'q4',title:'Вечеря вдвох',icon:'🍝',description:'Обрати рецепт і приготувати разом',type:'pair',participants:2,claimedBy:['u2'],rewardCoins:150,rewardXp:120,skill:'care',skillXp:20,status:'active',limited:false},
      {id:'q5',title:'Сімейний бюджет тижня',icon:'📊',description:'Разом переглянути витрати і цілі',type:'coop',participants:2,claimedBy:[],rewardCoins:200,rewardXp:160,skill:'finance',skillXp:30,status:'active',limited:false}
    ],
    shop:[
      {id:'s1',title:'Похід у клуб',icon:'🎧',description:'Можливість провести вечір у клубі.',price:2200,stock:1,type:'personal'},
      {id:'s2',title:'Вечір у кіно',icon:'🎬',description:'Обрати фільм і формат вечора для всієї сімʼї.',price:900,stock:2,type:'family'},
      {id:'s3',title:'Побутова техніка',icon:'⚙️',description:'Внесок у погоджену сімейну покупку.',price:12000,stock:1,type:'collective',fund:4650},
      {id:'s4',title:'Нова гра',icon:'🎮',description:'Одна погоджена гра для Steam або консолі.',price:3500,stock:1,type:'personal'},
      {id:'s5',title:'День без домашніх справ',icon:'🛋️',description:'Інші учасники підхоплюють твої побутові задачі.',price:1800,stock:2,type:'personal'},
      {id:'s6',title:'Сімейна подорож',icon:'✈️',description:'Спільний фонд на наступну подорож.',price:50000,stock:1,type:'collective',fund:18750}
    ],
    achievements:[
      {id:'a1',icon:'🌱',title:'Перший крок',description:'Виконати перше завдання',rarity:'Звичайна',target:1,progress:1},
      {id:'a2',icon:'🔥',title:'Стабільність',description:'Виконувати завдання 7 днів поспіль',rarity:'Рідкісна',target:7,progress:7},
      {id:'a3',icon:'💞',title:'Турботливе серце',description:'Зробити 10 сюрпризів для рідних',rarity:'Епічна',target:10,progress:10},
      {id:'a4',icon:'🏠',title:'Опора дому',description:'Досягти 10 рівня навички «Дім»',rarity:'Рідкісна',target:10,progress:14},
      {id:'a5',icon:'🤝',title:'Командний гравець',description:'Закрити 30 спільних квестів',rarity:'Епічна',target:30,progress:30},
      {id:'a6',icon:'💪',title:'У формі',description:'Виконати 50 активностей здоровʼя',rarity:'Епічна',target:50,progress:50},
      {id:'a7',icon:'👑',title:'Серце сімʼї',description:'Досягти 18 рівня турботи',rarity:'Легендарна',target:18,progress:18},
      {id:'a8',icon:'📚',title:'Допитливий розум',description:'Досягти 10 рівня розвитку',rarity:'Рідкісна',target:10,progress:12},
      {id:'a9',icon:'🌙',title:'Таємна ачивка',description:'Умова відкриється після отримання',rarity:'Секретна',target:1,progress:0}
    ],
    history:[
      {icon:'🏆',text:'Марія отримала «Турботливе серце»',time:'Сьогодні, 12:40'},
      {icon:'🧹',text:'Андрій завершив частину спільного прибирання',time:'Сьогодні, 10:15'},
      {icon:'🎬',text:'Сімʼя придбала «Вечір у кіно»',time:'Учора, 20:30'}
    ]
  };

  const tg = window.Telegram?.WebApp || null;
  const telegramInitData = tg?.initData || '';
  const telegramUser = tg?.initDataUnsafe?.user || null;
  if (tg) { try { tg.ready(); tg.expand(); } catch {} }
  let state = loadState();
  let auth = loadAuth();
  let route = new URLSearchParams(location.search).get('screen') || (auth ? 'dashboard' : (telegramInitData ? 'auth' : 'landing'));
  let authMode = telegramInitData ? 'join' : 'create';

  function clone(v){return JSON.parse(JSON.stringify(v));}
  function loadState(){try{return JSON.parse(localStorage.getItem(STORAGE))||clone(seed);}catch{return clone(seed);}}
  function loadAuth(){try{return JSON.parse(localStorage.getItem(AUTH))||null;}catch{return null;}}
  function save(){localStorage.setItem(STORAGE,JSON.stringify(state)); queueDailySnapshot();}
  function currentUser(){return state.users.find(u=>u.id===state.currentUserId)||state.users[0];}
  function showToast(text){toast.textContent=text;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2200);}
  function format(n){return new Intl.NumberFormat('uk-UA').format(n||0);}
  function xpPct(u){return Math.min(100,Math.round(((u.xp%1000)/1000)*100));}
  function skillLabel(k){return {family:'Наші разом',relationship:'Близькість',home:'Наш куточок',sport:'Руханка',health:'Сили й баланс',mind:'Цікавинки',reading:'Книжкові мандри',cinema:'Кіновечори',creativity:'Натхнення',finance:'Скарбничка',discipline:'Мій ритм',care:'Тепло',growth:'Нові відкриття'}[k]||k;}
  function skillIcon(k){return {family:'👨‍👩‍👧‍👦',relationship:'💞',home:'🏠',sport:'💪',health:'❤️',mind:'🧠',reading:'📖',cinema:'🎬',creativity:'🎨',finance:'💰',discipline:'🔥',care:'💞',growth:'🧠'}[k]||'⭐';}
  function rarityLabel(r){return {common:'Звичайна',uncommon:'Незвичайна',rare:'Рідкісна',epic:'Епічна',legendary:'Легендарна',secret:'Секретна'}[r]||r;}
  function questFromCatalog(q){const skills=q.rewards?.skills||{};const primary=Object.keys(skills)[0]||q.category||'discipline';return {id:q.id,title:q.title,icon:skillIcon(q.category),description:q.description||'Завдання з бібліотеки myHabbit',type:q.type||'personal',participants:['pair','coop'].includes(q.type)?2:1,claimedBy:[],rewardCoins:Number(q.rewards?.coins||0),rewardXp:Number(q.rewards?.xp||0),skill:primary,skillXp:Number(skills[primary]||0),skillRewards:skills,status:q.active===false?'paused':'active',limited:q.type==='limited',stock:q.type==='limited'?1:null,difficulty:q.difficulty,rarity:q.rarity,repeatType:q.repeatType||'none',unlockLevel:Number(q.unlockLevel||1),catalog:true};}
  function achievementFromCatalog(a){const target=Number(a.condition?.value||a.targetValue||1);return {id:a.id,icon:(a.title||'🏆').match(/^\p{Extended_Pictographic}/u)?.[0]||'🏆',title:String(a.title||'Досягнення').replace(/^\p{Extended_Pictographic}+\s*/u,''),description:a.description||'Виконай умову досягнення.',rarity:rarityLabel(a.rarity),target,progress:0,category:a.category,hidden:Boolean(a.hidden),catalog:true};}
  function shopFromCatalog(i){return {id:i.id,title:i.title,icon:{family:'👨‍👩‍👧‍👦',collective:'🤝',theme:'🎨',avatar:'🙂',frame:'🖼️',personal:'🎁'}[i.type]||'🎁',description:i.description||'Нагорода з каталогу myHabbit.',price:Number(i.price||0),stock:i.stock==null?999:Number(i.stock),type:i.type||'personal',catalog:true};}
  async function fetchJson(path){const r=await fetch(path,{cache:'force-cache'});if(!r.ok)throw new Error(`Не вдалося завантажити ${path}`);return r.json();}
  async function loadContentLibrary(){
    try{
      const cached=JSON.parse(localStorage.getItem(CONTENT_CACHE)||'null');
      if(cached?.version===CONTENT_VERSION&&cached.quests?.length){mergeContent(cached);return;}
      const index=await fetchJson('/content/index.json');
      const questSets=await Promise.all(QUEST_CATEGORIES.map(c=>fetchJson(`/content/quests/${c}.json`)));
      const dailySets=await Promise.all(['relationship','health','sport','home','discipline','reading'].map(c=>fetchJson(`/content/daily/${c}.json`)));
      const weeklySets=await Promise.all(['creativity','finance','sport','home','family','cinema'].map(c=>fetchJson(`/content/weekly/${c}.json`)));
      const achievementSets=await Promise.all(ACHIEVEMENT_FILES.map(c=>fetchJson(`/content/achievements/${c}.json`)));
      const shop=await fetchJson('/content/shop/catalog.json');
      const level=currentUser()?.level||1;
      const pick=(arr,n)=>arr.filter(x=>x.active!==false&&Number(x.unlockLevel||1)<=level).slice(0,n);
      const content={version:index.libraryVersion||CONTENT_VERSION,index,quests:[...questSets.flatMap(x=>pick(x,18)),...dailySets.flatMap(x=>pick(x,8)),...weeklySets.flatMap(x=>pick(x,6))].map(questFromCatalog),achievements:achievementSets.flatMap(x=>x.filter(a=>a.active!==false).slice(0,30)).map(achievementFromCatalog),shop:shop.filter(i=>i.active!==false).slice(0,120).map(shopFromCatalog)};
      localStorage.setItem(CONTENT_CACHE,JSON.stringify(content));mergeContent(content);
    }catch(e){console.warn('Content library:',e);}
  }
  function mergeContent(content){
    const merge=(base,extra)=>{const map=new Map(base.map(x=>[x.id,x]));for(const x of extra)if(!map.has(x.id))map.set(x.id,x);return [...map.values()];};
    state.quests=merge(state.quests||[],content.quests||[]);state.achievements=merge(state.achievements||[],content.achievements||[]);state.shop=merge(state.shop||[],content.shop||[]);
    state.contentLibrary={version:content.version,counts:content.index?.counts||{},loadedAt:new Date().toISOString()};localStorage.setItem(STORAGE,JSON.stringify(state));render();
  }

  async function api(path, options={}){
    const headers={'content-type':'application/json',...(options.headers||{})};
    if(auth?.token) headers.authorization=`Bearer ${auth.token}`;
    const res=await fetch(path,{...options,headers});
    const data=await res.json().catch(()=>({}));
    if(!res.ok) throw new Error(data.error||'Помилка сервера');
    return data;
  }
  function localDay(){
    const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Kyiv',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()).reduce((a,p)=>(p.type!=='literal'&&(a[p.type]=p.value),a),{});
    return `${parts.year}-${parts.month}-${parts.day}`;
  }
  function compactDailyData(){
    const u=currentUser();
    return {
      user:{id:u.id,name:u.name,avatar:u.avatar,role:u.role,telegramLinked:u.telegramLinked,telegramUsername:u.telegramUsername,level:u.level,xp:u.xp,coins:u.coins,streak:u.streak,skills:u.skills,achievements:u.achievements,activity:(u.activity||[]).slice(0,20)},
      family:{name:state.family.name,code:state.family.code,level:state.family.level,xp:state.family.xp,coins:state.family.coins},
      quests:(state.quests||[]).map(q=>({id:q.id,title:q.title,icon:q.icon,description:q.description,type:q.type,participants:q.participants,claimedBy:q.claimedBy,rewardCoins:q.rewardCoins,rewardXp:q.rewardXp,skill:q.skill,skillXp:q.skillXp,status:q.status,limited:q.limited,stock:q.stock})),
      shop:(state.shop||[]).map(i=>({id:i.id,title:i.title,icon:i.icon,description:i.description,price:i.price,stock:i.stock,type:i.type,fund:i.fund||0})),
      history:(state.history||[]).slice(0,20)
    };
  }
  function queueDailySnapshot(){
    if(!auth?.token||auth?.demo)return;
    const previous=JSON.parse(localStorage.getItem(DAILY_QUEUE)||'null');
    const day=localDay();
    const seq=previous?.day===day?Number(previous.seq||0)+1:1;
    localStorage.setItem(DAILY_QUEUE,JSON.stringify({day,seq,data:compactDailyData(),queuedAt:Date.now()}));
  }
  async function submitDailySnapshot({keepalive=false}={}){
    if(!auth?.token||auth?.demo)return false;
    const packet=JSON.parse(localStorage.getItem(DAILY_QUEUE)||'null');
    if(!packet)return true;
    try{
      await api('/api/family/daily-submit',{method:'POST',body:JSON.stringify(packet),keepalive});
      localStorage.removeItem(DAILY_QUEUE);
      return true;
    }catch{return false;}
  }
  async function pullRemote(){
    if(!auth?.token)return;
    try{const data=await api('/api/family/state');if(data.state){state=data.state;localStorage.setItem(STORAGE,JSON.stringify(state));localStorage.setItem(LAST_SERVER_PULL,new Date().toISOString());}}catch{}
  }
  async function refreshAdminSyncStatus(){
    if(!auth?.token||!isAdmin())return;
    try{
      const data=await api('/api/admin/sync-status');
      const count=document.getElementById('pendingSyncCount');
      const users=document.getElementById('pendingSyncUsers');
      const last=document.getElementById('lastSyncAt');
      const button=document.querySelector('[data-action="admin-process-now"]');
      if(count)count.textContent=String(data.pendingPackets||0);
      if(users)users.textContent=String(data.affectedUsers||0);
      if(last)last.textContent=data.lastProcessedAt?new Date(data.lastProcessedAt).toLocaleString('uk-UA'):'Ще не виконувалось';
      if(button)button.disabled=!(data.pendingPackets>0||localStorage.getItem(DAILY_QUEUE));
    }catch{}
  }
  async function adminProcessNow(){
    try{
      showToast('Надсилаємо локальні зміни…');
      await submitDailySnapshot();
      const result=await api('/api/admin/process-now',{method:'POST',body:'{}'});
      await pullRemote();
      render();
      showToast(result.processed?`Оновлено ${result.packets} пакетів від ${result.users} учасників`:'Нових даних немає');
    }catch(e){showToast(e.message);}
  }

  function go(next){route=next;history.replaceState({},'',next==='landing'?'/' : `/?screen=${next}`);render();scrollTo(0,0);}
  function shell(content,title,subtitle){
    const u=currentUser();
    const nav=navItems().map(([id,icon,label])=>`<button data-route="${id}" class="${route===id?'active':''}"><span class="nav-icon">${icon}</span>${label}</button>`).join('');
    const sessionAction=auth?.demo
      ? '<button class="btn danger" data-action="exit-demo">Вийти з демо</button>'
      : '<button class="btn danger" data-action="logout">Вийти</button>';
    const demoBanner=auth?.demo?'<div class="demo-banner"><div><strong>Демо-режим</strong><span>Зміни зберігаються лише на цьому пристрої.</span></div><button class="btn small" data-action="exit-demo">Вийти з демо</button></div>':'';
    return `<div class="app-layout"><aside class="sidebar"><div class="brand"><span class="brand-mark">✦</span>myHabbit</div><nav class="nav">${nav}</nav><div class="side-user"><div class="side-user-top"><div class="account-dot" aria-hidden="true"></div><div><strong>${u.name}</strong><small>${u.level} рівень · ${format(u.coins)} 🪙</small></div></div>${sessionAction}</div></aside><main class="main">${demoBanner}<header class="topbar"><div><h1>${title}</h1><p>${subtitle}</p></div><div class="top-actions"><span class="coin-pill">🪙 ${format(u.coins)}</span><button class="btn soft" data-action="switch-user">Профіль</button>${sessionAction}</div></header>${content}</main><nav class="mobile-nav">${navItems().map(([id,icon,label])=>`<button data-route="${id}" class="${route===id?'active':''}"><span>${icon}</span>${label}</button>`).join('')}</nav></div>`;
  }

  function landing(){
    return `<div class="landing"><nav class="landing-nav"><div class="brand"><span class="brand-mark">✦</span>myHabbit</div><button class="btn" data-route="auth">Увійти в сімʼю</button></nav><section class="landing-main"><div class="hero"><span class="eyebrow">Сімейна гра для реального життя</span><h1>Корисні справи стають спільною пригодою.</h1><p>Квести, особисті навички, колекції досягнень і магазин реальних можливостей. Для маленької сімейної команди — без зайвого шуму та складних систем.</p><div class="hero-actions"><button class="btn primary" data-action="demo">Відкрити демо</button><button class="btn" data-route="auth">Створити сімʼю</button></div><div class="hero-note">PWA для телефона · повноцінна сторінка для ПК · один Cloudflare Worker</div></div><div class="preview"><div class="preview-screen"><div class="preview-header"><div><small>Доброго дня</small><h2 style="margin:3px 0">Команда вдома ✨</h2></div><span class="profile-mark" aria-hidden="true">✦</span></div><div class="preview-card"><div class="preview-row"><strong>Наша спільна сходинка 12</strong><span>7 420 XP</span></div><div class="progress" style="margin-top:12px"><i style="width:74%"></i></div></div><div class="preview-card"><div class="preview-row"><div><strong>🧹 Генеральне прибирання</strong><small>Спільний квест · 1/2 учасники</small></div><span class="reward">+180 🪙</span></div></div><div class="preview-card"><div class="preview-row"><div><strong>🎁 Сюрприз для рідних</strong><small>Лімітований · залишилось 1</small></div><span class="reward">+120 🪙</span></div></div><div class="preview-card"><div class="preview-row"><div><strong>🏆 Стабільність</strong><small>7 днів поспіль</small></div><span class="tag coop">Отримано</span></div></div></div></div></section><section class="landing-features"><article class="feature"><span class="feature-icon">🤝</span><h3>Спільні квести</h3><p>Особисті, парні, командні та лімітовані завдання з прозорою нагородою.</p></article><article class="feature"><span class="feature-icon">🏆</span><h3>Колекція досягнень</h3><p>Особисті ачивки, які можна показувати іншим у профілі.</p></article><article class="feature"><span class="feature-icon">◈</span><h3>Реальний магазин</h3><p>Клуб, техніка, подорожі та інші погоджені можливості з обмеженим запасом.</p></article></section><footer class="footer">myHabbit — приватна сімейна екосистема для 2–5 учасників.</footer></div>`;
  }

  function authScreen(){
    const telegramBox = telegramInitData ? `<div class="telegram-login-note"><span>✈</span><div><strong>Вхід через Telegram</strong><p>${telegramUser?.first_name || 'Ваш профіль'} буде привʼязаний до сімейної сесії. Введіть код сімʼї та PIN нижче.</p></div></div>` : '';
    return `<div class="auth-card"><div class="brand"><span class="brand-mark">✦</span>myHabbit</div><h1>${telegramInitData?'Підключення до сімʼї':'Початок сімейної гри'}</h1><p>${telegramInitData?'Код сімʼї показаний адміністратору в розділі «Сімʼя». PIN встановлюється при створенні сімʼї.':'Створіть приватну сімʼю або приєднайтесь за кодом.'}</p>${telegramBox}<div class="auth-switch"><button class="${authMode==='create'?'active':''}" data-auth-tab="create">Створити</button><button class="${authMode==='join'?'active':''}" data-auth-tab="join">Приєднатися</button></div><div id="authForm">${authForm(authMode)}</div>${telegramInitData?'':'<button class="btn" style="width:100%;margin-top:10px" data-route="landing">Назад</button>'}</div>`;
  }
  function authForm(mode){
    const tgName = telegramUser ? [telegramUser.first_name, telegramUser.last_name].filter(Boolean).join(' ') : '';
    return `<div class="form-grid"><div class="field full"><label>${mode==='create'?'Назва сімʼї':'Код сімʼї'}</label><input id="familyValue" autocomplete="off" value="${mode==='create'?'Наша команда':''}" placeholder="${mode==='create'?'Наприклад, Команда вдома':'Наприклад, FAMILY25'}"></div><div class="field"><label>Ваше імʼя</label><input id="memberName" value="${tgName}" ${telegramInitData?'readonly':''}></div><div class="field"><label>Профіль</label><select id="memberGender"><option value="male">Хлопець</option><option value="female">Дівчина</option><option value="neutral">Інший</option></select></div><div class="field full"><label>Сімейний PIN</label><input id="familyPin" type="password" inputmode="numeric" maxlength="8" placeholder="4–8 цифр"></div></div><button class="btn primary" style="width:100%;margin-top:16px" data-action="submit-auth" data-mode="${mode}">${mode==='create'?'Створити сімʼю':'Підключити Telegram і увійти'}</button><p class="auth-help">Код сімʼї та PIN можна отримати в адміністратора сімʼї.</p>`;
  }

  function dashboard(){
    const u=currentUser();
    const active=state.quests.filter(q=>q.status==='active').slice(0,4);
    const latest=state.achievements.filter(a=>u.achievements.includes(a.id)).slice(-1)[0];
    return shell(`<section class="grid metrics"><div class="card"><div class="metric-label">Моя сходинка</div><div class="metric-value">${u.level}</div><div class="progress"><i style="width:${xpPct(u)}%"></i></div><div class="metric-foot">${u.xp%1000} / 1000 XP</div></div><div class="card"><div class="metric-label">Наша спільна сходинка</div><div class="metric-value">${state.family.level}</div><div class="progress"><i style="width:${Math.min(100,state.family.xp%1000/10)}%"></i></div><div class="metric-foot">Спільний прогрес команди</div></div><div class="card"><div class="metric-label">Баланс</div><div class="metric-value">${format(u.coins)} 🪙</div><div class="metric-foot">На реальні можливості</div></div><div class="card"><div class="metric-label">Мій ритм</div><div class="metric-value">${u.streak} 🔥</div><div class="metric-foot">Днів у приємному ритмі</div></div></section><div class="grid two"><section><div class="section-head"><h2>Квести на сьогодні</h2><button class="btn small" data-route="quests">Усі квести</button></div><div class="quest-list">${active.map(questCard).join('')}</div></section><aside><div class="section-head"><h2>Остання ачивка</h2></div>${latest?achievementCard(latest,u):'<div class="card empty">Поки немає ачивок</div>'}<div class="section-head"><h2>Останні події</h2></div><div class="card">${state.history.slice(0,3).map(h=>`<div class="activity"><span class="activity-icon">${h.icon}</span><div><p>${h.text}</p><small>${h.time}</small></div></div>`).join('')}</div></aside></div><div class="section-head"><h2>Сімейний фокус</h2></div><div class="focus-grid"><article class="focus-card"><span>🎯</span><div><strong>Головна ціль тижня</strong><p>Закрити 8 спільних справ і зробити внесок у сімейну ціль.</p></div></article><article class="focus-card"><span>🤝</span><div><strong>Командна активність</strong><p>${state.users.length} учасники · ${state.quests.filter(q=>q.status==='active').length} активних квестів.</p></div></article></div>`,`Привіт, ${u.name} ✨`,`У вас ${active.length} активних квестів і нові можливості в магазині.`);
  }

  function questCard(q){
    const user=currentUser(); const joined=q.claimedBy.includes(user.id); const full=q.claimedBy.length>=q.participants;
    const type={personal:'Особистий',coop:'Спільний',pair:'Тільки вдвох',limited:'Лімітований'}[q.type];
    return `<article class="quest"><span class="quest-icon">${q.icon}</span><div><h3>${q.title}</h3><div class="meta"><span>${q.description}</span><span class="tag ${q.type==='coop'||q.type==='pair'?'coop':''} ${q.limited?'limited':''}">${type}</span><span class="tag">${q.claimedBy.length}/${q.participants}</span></div></div><div class="quest-reward">+${q.rewardCoins} 🪙<small>+${q.rewardXp} XP · ${skillIcon(q.skill)} +${q.skillXp}</small><button class="btn small ${joined?'soft':'primary'}" data-quest="${q.id}" ${full&&!joined?'disabled':''}>${joined?'Завершити':'Взяти'}</button></div></article>`;
  }

  function questsScreen(){
    return shell(`<div class="section-head"><div><h2>Доступні завдання</h2><small class="meta">Бібліотека: ${format(state.contentLibrary?.counts?.uniqueQuests||state.quests.length)} унікальних · ${format(state.contentLibrary?.counts?.dailyTasks||0)} щоденних</small></div>${isAdmin()?'<button class=\"btn primary\" data-action=\"new-quest\">+ Новий квест</button>':''}</div><div class="tabs">${['all:Усі','personal:Особисті','coop:Спільні','pair:Для двох','limited:Лімітовані'].map((x,i)=>{const [k,l]=x.split(':');return `<button class="${i===0?'active':''}" data-filter="${k}">${l}</button>`}).join('')}</div><div class="quest-list" id="questList">${state.quests.filter(q=>q.status==='active').map(questCard).join('')}</div>`,`Квести`,`Беріть справи самостійно або проходьте їх разом.`);
  }

  function shopCard(item){
    const u=currentUser();const out=item.stock<=0;const fund=item.fund||0;const can=u.coins>=item.price;
    return `<article class="shop-card"><div class="shop-top"><span class="shop-icon">${item.icon}</span><span class="stock ${out?'out':''}">${out?'Закінчилось':`Залишилось: ${item.stock}`}</span></div><h3>${item.title}</h3><p>${item.description}</p>${item.type==='collective'?`<div class="progress"><i style="width:${Math.min(100,fund/item.price*100)}%"></i></div><small>${format(fund)} / ${format(item.price)} 🪙</small>`:`<div class="price">${format(item.price)} 🪙</div>`}<button class="btn ${item.type==='collective'?'soft':'primary'}" data-shop="${item.id}" ${out||(!can&&item.type!=='collective')?'disabled':''}>${item.type==='collective'?'Зробити внесок':'Придбати'}</button></article>`;
  }
  function shopScreen(){return shell(`<div class="section-head"><h2>Спільний магазин</h2>${isAdmin()?'<button class=\"btn primary\" data-action=\"new-shop\">+ Додати можливість</button>':''}</div><div class="tabs"><button class="active">Усе</button><button>Особисте</button><button>Для сімʼї</button><button>Спільні фонди</button></div><div class="shop-grid">${state.shop.map(shopCard).join('')}</div>`,`Магазин можливостей`,`Запас обмежений, а кожна покупка має реальний зміст.`)}

  function achievementCard(a,u=currentUser()){
    const unlocked=u.achievements.includes(a.id); const pct=Math.min(100,a.progress/a.target*100);
    return `<article class="achievement ${unlocked?'':'locked'}"><div class="achievement-head"><span class="achievement-icon">${unlocked?a.icon:'🔒'}</span><div><h3>${unlocked?a.title:(a.rarity==='Секретна'?'???':a.title)}</h3><span class="rarity">${a.rarity}</span></div></div><p class="meta">${unlocked?a.description:(a.rarity==='Секретна'?'Прихована умова':a.description)}</p><div class="progress"><i style="width:${pct}%"></i></div><small>${unlocked?'Отримано':`${a.progress} / ${a.target}`}</small></article>`;
  }
  function achievementsScreen(){const u=currentUser();return shell(`<section class="grid metrics"><div class="card"><div class="metric-label">Відкрито</div><div class="metric-value">${u.achievements.length}/${state.achievements.length}</div><div class="metric-foot">Особиста колекція</div></div><div class="card"><div class="metric-label">Рідкісні</div><div class="metric-value">${state.achievements.filter(a=>u.achievements.includes(a.id)&&a.rarity==='Рідкісна').length}</div></div><div class="card"><div class="metric-label">Епічні</div><div class="metric-value">${state.achievements.filter(a=>u.achievements.includes(a.id)&&a.rarity==='Епічна').length}</div></div><div class="card"><div class="metric-label">Легендарні</div><div class="metric-value">${state.achievements.filter(a=>u.achievements.includes(a.id)&&a.rarity==='Легендарна').length}</div></div></section><div class="section-head"><h2>Колекція</h2></div><div class="achievement-grid">${state.achievements.map(a=>achievementCard(a,u)).join('')}</div>`,`Досягнення`,`Збирайте ачивки й показуйте їх у своєму профілі.`)}

  function memberCard(u){return `<button type="button" class="member member-button cozy-member" data-member="${u.id}"><div class="member-head"><div class="member-initial" aria-hidden="true">${(u.name||'?').trim().slice(0,1).toUpperCase()}</div><div><h3 style="margin:0">${u.name} ${u.role==='admin'?'<span class="admin-badge">Берегиня простору</span>':''}</h3><small>${u.level} сходинка · ${u.streak} днів у ритмі</small></div><span class="telegram-dot ${u.telegramLinked?'linked':''}" title="${u.telegramLinked?'Telegram поруч':'Telegram ще не підключено'}">✈</span></div><span class="view-profile">Зазирнути в профіль →</span></button>`}
  function familyScreen(){return shell(`<section class="card"><div class="profile-hero"><span class="avatar">✨</span><div><div class="profile-level">${state.family.name}</div><div class="meta">Код сімʼї: <strong>${state.family.code}</strong> · ${state.users.length}/5 учасників</div><div class="progress" style="margin-top:10px"><i style="width:${state.family.xp%1000/10}%"></i></div></div><button class="btn primary" data-action="invite">Запросити</button></div></section><div class="section-head"><h2>Наші люди</h2></div><div class="member-grid">${state.users.map(memberCard).join('')}</div><div class="section-head"><h2>Telegram-зв’язок</h2></div><div class="card telegram-panel"><div><strong>Бот myHabbit</strong><p>Відкривайте Mini App із Telegram, отримуйте нагадування та швидко переходьте до сімейних справ.</p></div><button class="btn primary" data-action="telegram-connect">Підключити Telegram</button></div><div class="section-head"><h2>Сімейна активність</h2></div><div class="card">${state.history.map(h=>`<div class="activity"><span class="activity-icon">${h.icon}</span><div><p>${h.text}</p><small>${h.time}</small></div></div>`).join('')}</div>`,`Сімʼя`,`Спільний прогрес без публічних рейтингів і сторонніх людей.`)}

  function profileScreen(userId=state.currentUserId){
    const u=state.users.find(x=>x.id===userId)||currentUser();
    const own=u.id===state.currentUserId;
    const skills=Object.entries(u.skills);
    const achievements=state.achievements.filter(a=>u.achievements.includes(a.id));
    return shell(`<section class="card cozy-profile-head"><div class="profile-minimal"><div class="member-initial large" aria-hidden="true">${(u.name||'?').trim().slice(0,1).toUpperCase()}</div><div><div class="profile-level">${u.name}</div><div class="meta">${u.level} сходинка · ${format(u.xp)} XP · ${format(u.coins)} 🪙</div><div class="progress soft-progress"><i style="width:${xpPct(u)}%"></i></div></div>${own?'<div class="profile-actions"><button class="btn" data-action="edit-profile">Налаштувати</button><button class="btn danger" data-action="reset-current-session">Почати вхід заново</button></div>':'<button class="btn soft" data-route="family">Назад до своїх</button>'}</div></section>
    <div class="cozy-folds">
      <details class="cozy-fold" open><summary><span>✨</span><strong>Мої барви</strong><small>${skills.length} напрямів</small></summary><div class="fold-body skill-list">${skills.map(([k,v])=>`<div class="skill-row cozy-skill"><span class="skill-icon">${skillIcon(k)}</span><div><div class="skill-name"><strong>${skillLabel(k)}</strong><span>${v} сходинка</span></div><div class="progress"><i style="width:${Math.min(100,(v%10)*10)}%"></i></div></div></div>`).join('')}</div></details>
      <details class="cozy-fold"><summary><span>🌿</span><strong>Теплі моменти</strong><small>${u.activity.length}</small></summary><div class="fold-body">${u.activity.map((x,i)=>`<div class="activity"><span class="activity-icon">${['♡','✦','↗'][i%3]}</span><div><p>${x}</p><small>Збережено в історії</small></div></div>`).join('')}</div></details>
      <details class="cozy-fold"><summary><span>🏆</span><strong>Мої знахідки</strong><small>${achievements.length}</small></summary><div class="fold-body achievement-grid compact-achievements">${achievements.length?achievements.map(a=>achievementCard(a,u)).join(''):'<div class="empty-soft">Перші приємні відкриття ще попереду ✨</div>'}</div></details>
      <details class="cozy-fold"><summary><span>✈</span><strong>Зв’язок із Telegram</strong><small>${u.telegramLinked?'поруч':'не підключено'}</small></summary><div class="fold-body"><div class="profile-telegram ${u.telegramLinked?'linked':''}">${u.telegramLinked?`Telegram підключено${u.telegramUsername?` · @${u.telegramUsername}`:''}`:'Telegram поки відпочиває окремо'}</div></div></details>
    </div>`,own?'Мій затишний куточок':`${u.name} · затишний куточок`,own?'Тут зібрані ваші маленькі перемоги й приємний рух уперед.':'Лише те, чим хочеться поділитися з близькими.');
  }


  function adminScreen(){
    if(!isAdmin()) return shell('<div class="card empty">Цей розділ доступний лише адміністратору сімʼї.</div>','Куточок господаря','Керування сімейним простором.');
    const active=state.quests.filter(q=>q.status==='active').length;
    const lowStock=state.shop.filter(x=>x.stock<=1).length;
    return shell(`<section class="admin-hero"><div><span class="eyebrow">Центр керування</span><h2>Налаштування нашого простору</h2><p>Завдання, магазин, учасники й Telegram — в одному спокійному інтерфейсі.</p></div><button class="btn primary" data-action="telegram-refresh">Перевірити Telegram</button></section><section class="card sync-panel"><div><span class="eyebrow">Local-first синхронізація</span><h2>Оновлення сімейної статистики</h2><p>Дані зберігаються на пристроях. Автоматичне серверне оновлення виконується після 09:00, а адміністратор може запустити його вручну.</p><div class="sync-meta"><span>Очікують: <strong id="pendingSyncCount">…</strong> пакетів</span><span>Учасників: <strong id="pendingSyncUsers">…</strong></span><span>Останнє: <strong id="lastSyncAt">…</strong></span></div></div><button class="btn primary" data-action="admin-process-now">Оновити дані зараз</button></section><section class="grid metrics"><div class="card"><div class="metric-label">Активні квести</div><div class="metric-value">${active}</div><div class="metric-foot">${state.quests.length-active} завершено</div></div><div class="card"><div class="metric-label">Асортимент</div><div class="metric-value">${state.shop.length}</div><div class="metric-foot">${lowStock} позиції закінчуються</div></div><div class="card"><div class="metric-label">Наші люди</div><div class="metric-value">${state.users.length}/5</div><div class="metric-foot">${state.users.filter(u=>u.telegramLinked).length} з Telegram</div></div><div class="card"><div class="metric-label">Сімейний фонд</div><div class="metric-value">${format(state.family.coins)} 🪙</div><div class="metric-foot">Спільний баланс</div></div></section><div class="admin-grid"><section><div class="section-head"><h2>Наші пригоди</h2><button class="btn primary small" data-action="new-quest">+ Додати</button></div><div class="admin-list">${state.quests.map(q=>`<article class="admin-row"><span class="quest-icon">${q.icon}</span><div><strong>${q.title}</strong><small>${q.status==='active'?'Активне':'Завершене'} · ${q.rewardCoins} 🪙 · ${q.rewardXp} XP</small></div><div class="admin-actions"><button class="btn small soft" data-admin-toggle-quest="${q.id}">${q.status==='active'?'Пауза':'Активувати'}</button><button class="icon-btn danger-text" data-admin-delete-quest="${q.id}" aria-label="Видалити">×</button></div></article>`).join('')}</div></section><section><div class="section-head"><h2>Асортимент магазину</h2><button class="btn primary small" data-action="new-shop">+ Додати</button></div><div class="admin-list">${state.shop.map(i=>`<article class="admin-row"><span class="shop-icon">${i.icon}</span><div><strong>${i.title}</strong><small>${format(i.price)} 🪙 · залишок ${i.stock}</small></div><div class="stock-stepper"><button data-stock="${i.id}" data-delta="-1">−</button><strong>${i.stock}</strong><button data-stock="${i.id}" data-delta="1">+</button></div><button class="icon-btn danger-text" data-admin-delete-shop="${i.id}" aria-label="Видалити">×</button></article>`).join('')}</div></section></div><div class="section-head"><h2>Новий початок профілю</h2></div><section class="card danger-zone"><div><strong>Подарувати профілю новий початок</strong><p>Скидає XP, монети, серію, навички, досягнення, локальні пакети та Telegram-прив’язку. Потрібен сімейний PIN.</p></div><div class="admin-list">${state.users.map(u=>`<article class="admin-row"><span class="avatar">${u.avatar}</span><div><strong>${u.name}</strong><small>${u.level} рівень · ${u.telegramLinked?'Telegram підключено':'без Telegram'}</small></div><button class="btn danger small" data-reset-user="${u.id}">Скинути</button></article>`).join('')}</div></section>`,`Куточок господаря`,`Контролюйте контент, асортимент і стан сімейного простору.`);
  }

  function modal(type){
    if(type==='switch-user') return `<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h2>Оберіть профіль</h2><button class="close" data-close>×</button></div><div class="member-grid" style="grid-template-columns:1fr;margin-top:18px">${state.users.map(u=>`<button class="member" data-select-user="${u.id}" style="text-align:left"><div class="member-head"><span class="avatar">${u.avatar}</span><div><strong>${u.name}</strong><small>${u.level} рівень · ${format(u.coins)} 🪙</small></div></div></button>`).join('')}</div></div></div>`;
    if(type==='new-quest') return `<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h2>Новий квест</h2><button class="close" data-close>×</button></div><div class="form-grid"><div class="field full"><label>Назва</label><input id="qTitle" placeholder="Наприклад, Прибрати кухню"></div><div class="field"><label>Тип</label><select id="qType"><option value="personal">Особистий</option><option value="coop">Спільний</option><option value="pair">Тільки вдвох</option><option value="limited">Лімітований</option></select></div><div class="field"><label>Навичка</label><select id="qSkill"><option value="home">Дім</option><option value="care">Турбота</option><option value="health">Здоровʼя</option><option value="growth">Розвиток</option><option value="finance">Фінанси</option></select></div><div class="field"><label>Монети</label><input id="qCoins" type="number" value="100"></div><div class="field"><label>XP</label><input id="qXp" type="number" value="80"></div><div class="field full"><label>Опис</label><textarea id="qDesc"></textarea></div></div><div class="modal-actions"><button class="btn" data-close>Скасувати</button><button class="btn primary" data-action="save-quest">Створити</button></div></div></div>`;
    if(type==='new-shop') return `<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h2>Нова можливість</h2><button class="close" data-close>×</button></div><div class="form-grid"><div class="field full"><label>Назва</label><input id="sTitle" placeholder="Наприклад, Новий велосипед"></div><div class="field"><label>Тип</label><select id="sType"><option value="personal">Особиста</option><option value="family">Для всієї сімʼї</option><option value="collective">Спільний фонд</option></select></div><div class="field"><label>Ціна</label><input id="sPrice" type="number" value="2000"></div><div class="field"><label>Кількість</label><input id="sStock" type="number" value="1"></div><div class="field full"><label>Опис</label><textarea id="sDesc"></textarea></div></div><div class="modal-actions"><button class="btn" data-close>Скасувати</button><button class="btn primary" data-action="save-shop">Додати</button></div></div></div>`;

    if(type==='reset-session') return `<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h2>Скинути поточну сесію</h2><button class="close" data-close>×</button></div><p>Це від’єднає Telegram, анулює стару сесію та очистить локальні дані цього пристрою. Після цього потрібно буде підключитися заново.</p><div class="field"><label>Сімейний PIN</label><input id="resetSessionPin" type="password" inputmode="numeric" maxlength="8" placeholder="Введіть PIN"></div><div class="modal-actions"><button class="btn" data-close>Скасувати</button><button class="btn danger" data-action="confirm-reset-session">Почати вхід заново</button></div></div></div>`;
    if(type?.startsWith('reset-user:')) { const userId=type.split(':')[1]; const u=state.users.find(x=>x.id===userId); return `<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h2>Скинути ${u?.name||'користувача'}?</h2><button class="close" data-close>×</button></div><p>Прогрес буде обнулено, Telegram від’єднано, а всі старі сесії цього користувача стануть недійсними.</p><div class="field"><label>Сімейний PIN</label><input id="resetUserPin" type="password" inputmode="numeric" maxlength="8" placeholder="Введіть PIN"></div><div class="field"><label>Підтвердження</label><input id="resetConfirmText" autocomplete="off" placeholder="Напишіть СКИНУТИ"></div><div class="modal-actions"><button class="btn" data-close>Скасувати</button><button class="btn danger" data-action="confirm-reset-user" data-user-id="${userId}">Скинути назавжди</button></div></div></div>`; }
    return '';
  }

  function render(){
    const screens={landing,auth:authScreen,dashboard,quests:questsScreen,shop:shopScreen,achievements:achievementsScreen,family:familyScreen,profile:()=>profileScreen(),admin:adminScreen};
    app.innerHTML=(screens[route]||landing)(); bind(); if(route==='admin')setTimeout(refreshAdminSyncStatus,0);
  }

  function bind(){
    document.querySelectorAll('[data-route]').forEach(el=>el.addEventListener('click',()=>go(el.dataset.route)));
    document.querySelectorAll('[data-action]').forEach(el=>el.addEventListener('click',()=>action(el.dataset.action,el)));
    document.querySelectorAll('[data-quest]').forEach(el=>el.addEventListener('click',()=>handleQuest(el.dataset.quest)));
    document.querySelectorAll('[data-shop]').forEach(el=>el.addEventListener('click',()=>handleShop(el.dataset.shop)));
    document.querySelectorAll('[data-member]').forEach(el=>el.addEventListener('click',()=>{app.innerHTML=profileScreen(el.dataset.member);bind();scrollTo(0,0)}));
    document.querySelectorAll('[data-admin-toggle-quest]').forEach(el=>el.addEventListener('click',()=>{const q=state.quests.find(x=>x.id===el.dataset.adminToggleQuest);if(q){q.status=q.status==='active'?'paused':'active';save();render();}}));
    document.querySelectorAll('[data-admin-delete-quest]').forEach(el=>el.addEventListener('click',()=>{state.quests=state.quests.filter(x=>x.id!==el.dataset.adminDeleteQuest);save();render();showToast('Завдання видалено');}));
    document.querySelectorAll('[data-admin-delete-shop]').forEach(el=>el.addEventListener('click',()=>{state.shop=state.shop.filter(x=>x.id!==el.dataset.adminDeleteShop);save();render();showToast('Позицію видалено');}));
    document.querySelectorAll('[data-reset-user]').forEach(el=>el.addEventListener('click',()=>openResetUserDialog(el.dataset.resetUser)));
    document.querySelectorAll('[data-stock]').forEach(el=>el.addEventListener('click',()=>{const i=state.shop.find(x=>x.id===el.dataset.stock);if(i){i.stock=Math.max(0,i.stock+Number(el.dataset.delta));save();render();}}));
    document.querySelectorAll('[data-filter]').forEach(el=>el.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(x=>x.classList.remove('active'));el.classList.add('active');const f=el.dataset.filter;document.getElementById('questList').innerHTML=state.quests.filter(q=>q.status==='active'&&(f==='all'||q.type===f)).map(questCard).join('');bind();}));
    document.querySelectorAll('[data-auth-tab]').forEach(el=>el.addEventListener('click',()=>{authMode=el.dataset.authTab;document.querySelectorAll('[data-auth-tab]').forEach(x=>x.classList.remove('active'));el.classList.add('active');document.getElementById('authForm').innerHTML=authForm(authMode);bind();}));
  }

  function action(name, el){
    if(name==='demo'){auth={demo:true};state=clone(seed);localStorage.setItem(AUTH,JSON.stringify(auth));localStorage.setItem(STORAGE,JSON.stringify(state));go('dashboard');}
    if(name==='exit-demo'){localStorage.removeItem(AUTH);localStorage.removeItem(STORAGE);auth=null;state=clone(seed);go('landing');showToast('Демо завершено');}
    if(name==='logout'){localStorage.removeItem(AUTH);auth=null;go('landing');}
    if(['switch-user','new-quest','new-shop'].includes(name)){document.body.insertAdjacentHTML('beforeend',modal(name));bindModal();}
    if(name==='telegram-connect') connectTelegram();
    if(name==='telegram-refresh') checkTelegram();
    if(name==='admin-process-now') adminProcessNow();
    if(name==='reset-current-session') openResetSessionDialog();
    if(name==='confirm-reset-session') confirmResetSession();
    if(name==='confirm-reset-user') confirmResetUser(el?.dataset.userId);
    if(name==='invite') showToast(`Код запрошення: ${state.family.code}`);
    if(name==='submit-auth') submitAuth(el?.dataset.mode || 'create');
    if(name==='save-quest') saveQuest();
    if(name==='save-shop') saveShop();
  }
  function bindModal(){
    document.querySelectorAll('[data-close]').forEach(x=>x.addEventListener('click',()=>x.closest('.modal-backdrop').remove()));
    document.querySelectorAll('[data-select-user]').forEach(x=>x.addEventListener('click',()=>{state.currentUserId=x.dataset.selectUser;save();document.querySelector('.modal-backdrop').remove();render();}));
    document.querySelectorAll('.modal [data-action]').forEach(el=>el.addEventListener('click',()=>action(el.dataset.action,el)));
  }


  function openResetSessionDialog(){ document.body.insertAdjacentHTML('beforeend',modal('reset-session')); bindModal(); }
  function openResetUserDialog(userId){ document.body.insertAdjacentHTML('beforeend',modal(`reset-user:${userId}`)); bindModal(); }
  async function clearLocalAppData(){
    try{ localStorage.clear(); sessionStorage.clear(); }catch{}
    try{ if(indexedDB.databases){ const dbs=await indexedDB.databases(); await Promise.all((dbs||[]).map(db=>db.name&&new Promise(resolve=>{const r=indexedDB.deleteDatabase(db.name);r.onsuccess=r.onerror=r.onblocked=()=>resolve();}))); } }catch{}
    try{ const regs=await navigator.serviceWorker?.getRegistrations?.(); await Promise.all((regs||[]).map(r=>r.unregister())); }catch{}
    try{ const keys=await caches.keys(); await Promise.all(keys.map(k=>caches.delete(k))); }catch{}
  }
  async function confirmResetSession(){
    const pin=document.getElementById('resetSessionPin')?.value.trim(); if(!pin||pin.length<4)return showToast('Введіть сімейний PIN');
    try{ await api('/api/family/reset-session',{method:'POST',body:JSON.stringify({pin})}); await clearLocalAppData(); location.replace(`/?reset=${Date.now()}`); }catch(e){showToast(e.message);}
  }
  async function confirmResetUser(userId){
    const pin=document.getElementById('resetUserPin')?.value.trim(); const confirmText=document.getElementById('resetConfirmText')?.value.trim().toUpperCase();
    if(!pin||pin.length<4)return showToast('Введіть сімейний PIN'); if(confirmText!=='СКИНУТИ')return showToast('Напишіть СКИНУТИ для підтвердження');
    try{ const data=await api('/api/admin/reset-user',{method:'POST',body:JSON.stringify({userId,pin})}); if(data.resetSelf){await clearLocalAppData();location.replace(`/?reset=${Date.now()}`);return;} if(data.state){state=data.state;localStorage.setItem(STORAGE,JSON.stringify(state));} document.querySelector('.modal-backdrop')?.remove();render();showToast('Користувача скинуто. Старі сесії вимкнено.'); }catch(e){showToast(e.message);}
  }

  async function connectTelegram(){
    try{
      const cfg=await api('/api/telegram/config');
      if(!cfg.botUsername) throw new Error('Бот ще не налаштований');
      const url=`https://t.me/${cfg.botUsername}?startapp=family_${encodeURIComponent(state.family.code)}`;
      window.open(url,'_blank','noopener');
      showToast('Telegram відкрито. Натисніть Start у боті.');
    }catch(e){showToast(e.message);}
  }
  async function checkTelegram(){
    try{const cfg=await api('/api/telegram/config');showToast(cfg.ready?`Бот @${cfg.botUsername} працює`:'Telegram ще не готовий');}
    catch(e){showToast(e.message);}
  }

  async function submitAuth(mode){
    const familyValue=document.getElementById('familyValue').value.trim();const name=document.getElementById('memberName').value.trim();const pin=document.getElementById('familyPin').value.trim();const gender=document.getElementById('memberGender').value;
    if(!familyValue||!name||pin.length<4)return showToast('Заповніть поля та PIN');
    try{
      const endpoint = mode==='create' ? '/api/family/create' : (telegramInitData ? '/api/family/telegram-join' : '/api/family/join');
      const data=await api(endpoint,{method:'POST',body:JSON.stringify({familyName:mode==='create'?familyValue:undefined,code:mode==='join'?familyValue:undefined,pin,name,gender,initData:telegramInitData})});
      auth={token:data.token,userId:data.userId};localStorage.setItem(AUTH,JSON.stringify(auth));if(data.state)state=data.state;localStorage.setItem(STORAGE,JSON.stringify(state));go('dashboard');
    }catch(e){showToast(e.message+' — відкрито локальне демо');auth={demo:true};localStorage.setItem(AUTH,JSON.stringify(auth));go('dashboard');}
  }

  function handleQuest(id){
    const q=state.quests.find(x=>x.id===id),u=currentUser(); if(!q)return;
    if(!q.claimedBy.includes(u.id)){if(q.claimedBy.length>=q.participants)return; q.claimedBy.push(u.id);showToast('Квест додано до ваших справ');}
    else{
      q.claimedBy=q.claimedBy.filter(x=>x!==u.id);u.coins+=q.rewardCoins;u.xp+=q.rewardXp;u.skills[q.skill]+=1;u.activity.unshift(`Виконано: ${q.title}`);state.family.xp+=q.rewardXp;state.family.coins+=Math.round(q.rewardCoins*.2);state.history.unshift({icon:q.icon,text:`${u.name} виконав(ла) «${q.title}»`,time:'Щойно'});if(q.type==='personal'||q.type==='limited')q.status='done';showToast(`+${q.rewardCoins} монет · +${q.rewardXp} XP`);
    }save();render();
  }

  function handleShop(id){
    const item=state.shop.find(x=>x.id===id),u=currentUser();if(!item||item.stock<=0)return;
    if(item.type==='collective'){
      const contribution=Math.min(u.coins,Math.max(100,Math.ceil((item.price-item.fund)/4)));if(!contribution)return showToast('Недостатньо монет');u.coins-=contribution;item.fund+=contribution;if(item.fund>=item.price){item.stock-=1;item.fund=item.price;state.history.unshift({icon:item.icon,text:`Сімʼя зібрала на «${item.title}»`,time:'Щойно'});showToast('Спільну ціль досягнуто!');}else showToast(`Внесено ${contribution} монет`);
    }else{if(u.coins<item.price)return showToast('Недостатньо монет');u.coins-=item.price;item.stock-=1;state.history.unshift({icon:item.icon,text:`${u.name} придбав(ла) «${item.title}»`,time:'Щойно'});showToast('Можливість придбано');}
    save();render();
  }

  function saveQuest(){
    const title=document.getElementById('qTitle').value.trim();if(!title)return showToast('Вкажіть назву');const type=document.getElementById('qType').value;state.quests.unshift({id:crypto.randomUUID(),title,icon:{home:'🧹',care:'🎁',health:'🏋️',growth:'📚',finance:'💰'}[document.getElementById('qSkill').value],description:document.getElementById('qDesc').value.trim()||'Сімейне завдання',type,participants:type==='pair'||type==='coop'?2:1,claimedBy:[],rewardCoins:Number(document.getElementById('qCoins').value)||50,rewardXp:Number(document.getElementById('qXp').value)||50,skill:document.getElementById('qSkill').value,skillXp:15,status:'active',limited:type==='limited',stock:type==='limited'?1:null});save();document.querySelector('.modal-backdrop').remove();render();showToast('Квест створено');
  }
  function saveShop(){
    const title=document.getElementById('sTitle').value.trim();if(!title)return showToast('Вкажіть назву');state.shop.unshift({id:crypto.randomUUID(),title,icon:'✨',description:document.getElementById('sDesc').value.trim()||'Нова реальна можливість',price:Number(document.getElementById('sPrice').value)||1000,stock:Number(document.getElementById('sStock').value)||1,type:document.getElementById('sType').value,fund:0});save();document.querySelector('.modal-backdrop').remove();render();showToast('Можливість додано');
  }

  window.addEventListener('popstate',()=>{route=new URLSearchParams(location.search).get('screen')||(auth?'dashboard':'landing');render();});
  if('serviceWorker' in navigator)navigator.serviceWorker.register('/sw.js').catch(()=>{});
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')submitDailySnapshot({keepalive:true});});
  window.addEventListener('pagehide',()=>submitDailySnapshot({keepalive:true}));
  (async()=>{if(auth?.token){await submitDailySnapshot();await pullRemote();}render();})();
})();

requestAnimationFrame(()=>document.getElementById('appSplash')?.classList.add('hidden'));
