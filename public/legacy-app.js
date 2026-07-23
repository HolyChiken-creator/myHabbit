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
  const APP_VERSION = '6.0.0-stage9.9-achievement-init-fix';
  const ACCOUNTS = 'myHabbitAccountsV1';
  const ACTIVE_ACCOUNT = 'myHabbitActiveAccountV1';
  const QUEST_CATEGORIES = ['family','relationship','home','sport','health','mind','reading','cinema','creativity','finance','discipline'];
  const ACHIEVEMENT_FILES = ['general','levels','coins','streak','family','relationship','home','sport','health','mind','reading','cinema','creativity','finance','discipline','shop','secret','legendary'];
  const baseNavItems = [
    ['dashboard','⌂','Головна'],['quests','✓','Квести'],['shop','◈','Магазин'],
    ['collections','▦','Колекції'],['museum','🏛️','Музей'],['achievements','🏆','Ачивки'],['family','👥','Сімʼя'],['profile','●','Профіль']
  ];
  const isAdmin = () => currentUser()?.role === 'admin' || state.users[0]?.id === state.currentUserId;
  const navItems = () => isAdmin() ? [...baseNavItems, ['admin','⚙','Адмін']] : baseNavItems;

  const seed = {
    family:{id:'demo-family',name:'Наша команда',code:'FAMILY25',level:12,xp:7420,coins:1850},
    currentUserId:'u1',
    users:[
      {id:'u1',name:'Андрій',role:'admin',telegramLinked:true,telegramUsername:'myhabbit_admin',createdAt:'2026-01-12T10:00:00.000Z',importantDates:[{id:'date-demo-1',day:14,month:2,title:'Наш особливий день',visible:true},{id:'date-demo-2',day:22,month:7,title:'Річниця великої мрії',visible:true}],gender:'male',avatar:'✦',level:18,xp:4380,coins:2640,streak:12,skills:{home:14,care:11,health:16,growth:9,finance:7},achievements:['a1','a2','a4','a6'],activity:['Закрив квест «Генеральне прибирання»','Отримав ачивку «Стабільність»','Підняв навичку «Здоровʼя» до 16 рівня']},
      {id:'u2',name:'Марія',role:'member',telegramLinked:true,telegramUsername:'maria',createdAt:'2026-02-03T10:00:00.000Z',importantDates:[{id:'date-demo-3',day:3,month:2,title:'День знайомства',visible:true}],gender:'female',avatar:'✦',level:16,xp:3890,coins:3180,streak:18,skills:{home:17,care:18,health:12,growth:13,finance:10},achievements:['a1','a3','a5','a7'],activity:['Створила сюрприз для сімʼї','Купила «Вечір у кіно»','Закрила 30-й спільний квест']},
      {id:'u3',name:'Софія',role:'member',telegramLinked:false,createdAt:'2026-03-21T10:00:00.000Z',gender:'female',avatar:'✦',level:9,xp:1690,coins:940,streak:6,skills:{home:7,care:9,health:8,growth:12,finance:4},achievements:['a1','a8'],activity:['Виконала домашнє завдання','Допомогла приготувати вечерю']}
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

  function normalizeState(){
    state = (state && typeof state === 'object') ? state : clone(seed);
    state.meta=state.meta||{};
    state.family=state.family||clone(seed.family);
    state.users=Array.isArray(state.users)&&state.users.length?state.users:clone(seed.users);
    state.users.forEach(u=>{u.hiddenFromFamily=Boolean(u.hiddenFromFamily);});
    state.currentUserId=state.users.some(u=>u.id===state.currentUserId)?state.currentUserId:state.users[0].id;
    state.quests=Array.isArray(state.quests)?state.quests:clone(seed.quests);
    state.shop=Array.isArray(state.shop)?state.shop:clone(seed.shop);
    state.achievements=Array.isArray(state.achievements)?state.achievements:clone(seed.achievements);
    state.history=Array.isArray(state.history)?state.history:clone(seed.history);
    state.meta.version=APP_VERSION;
    const cosmeticDefaults=[
      {id:'cos_badge_cat',title:'Котик біля імені',kind:'badge',asset:'cat',price:180,rarity:'Звичайна'},
      {id:'cos_badge_bunny',title:'Кролик біля імені',kind:'badge',asset:'bunny',price:220,rarity:'Незвичайна'},
      {id:'cos_frame_blush',title:'Рамка «Румʼянець»',kind:'frame',asset:'blush',price:420,rarity:'Рідкісна'},
      {id:'cos_frame_night',title:'Рамка «Тиха ніч»',kind:'frame',asset:'night',price:650,rarity:'Епічна'},
      {id:'af_starlight',title:'Анімована рамка «Зоряне сяйво»',kind:'animatedFrame',asset:'starlight',price:900,rarity:'Епічна'},
      {id:'af_sakura',title:'Анімована рамка «Сакура»',kind:'animatedFrame',asset:'sakura',price:950,rarity:'Епічна'},
      {id:'af_hearts',title:'Анімована рамка «Сердечка»',kind:'animatedFrame',asset:'hearts',price:850,rarity:'Рідкісна'},
      {id:'af_neon',title:'Анімована рамка «Неоновий ритм»',kind:'animatedFrame',asset:'neon',price:1100,rarity:'Легендарна'},
      {id:'af_fire',title:'Анімована рамка «Живе полумʼя»',kind:'animatedFrame',asset:'fire',price:1250,rarity:'Легендарна'},
      {id:'af_frost',title:'Анімована рамка «Крижаний пил»',kind:'animatedFrame',asset:'frost',price:1000,rarity:'Епічна'},
      {id:'af_rainbow',title:'Анімована рамка «Веселка»',kind:'animatedFrame',asset:'rainbow',price:1350,rarity:'Легендарна'},
      {id:'af_bats',title:'Анімована рамка «Нічні кажани»',kind:'animatedFrame',asset:'bats',price:1050,rarity:'Епічна'},
      {id:'nick_shimmer',title:'Нікнейм «Золотий блиск»',kind:'nicknameEffect',asset:'shimmer',price:650,rarity:'Рідкісна'},
      {id:'nick_gradient',title:'Нікнейм «Живий градієнт»',kind:'nicknameEffect',asset:'gradient',price:700,rarity:'Рідкісна'},
      {id:'nick_neon',title:'Нікнейм «Неон»',kind:'nicknameEffect',asset:'neon',price:900,rarity:'Епічна'},
      {id:'nick_wave',title:'Нікнейм «Хвиля»',kind:'nicknameEffect',asset:'wave',price:850,rarity:'Епічна'},
      {id:'nick_fire',title:'Нікнейм «Полумʼя»',kind:'nicknameEffect',asset:'fire',price:1100,rarity:'Легендарна'},
      {id:'nick_frost',title:'Нікнейм «Крига»',kind:'nicknameEffect',asset:'frost',price:1000,rarity:'Епічна'},
      {id:'nick_holo',title:'Нікнейм «Голограма»',kind:'nicknameEffect',asset:'holo',price:1250,rarity:'Легендарна'},
      {id:'nick_bounce',title:'Нікнейм «Веселі літери»',kind:'nicknameEffect',asset:'bounce',price:750,rarity:'Рідкісна'},
      {id:'cos_theme_dark',title:'Темна тема',kind:'theme',asset:'dark',price:500,rarity:'Рідкісна'},
      {id:'cos_theme_lavender',title:'Лавандова тема',kind:'theme',asset:'lavender',price:700,rarity:'Епічна'},
      {id:'pack_cozy_cats',title:'Пак «Cozy Cats»',kind:'stickerPack',asset:'cozy-cats',price:350,rarity:'Рідкісна'},
      {id:'pack_bunny_notes',title:'Пак «Bunny Notes»',kind:'stickerPack',asset:'bunny-notes',price:350,rarity:'Рідкісна'}
    ];
    state.cosmeticsCatalog=Array.isArray(state.cosmeticsCatalog)?state.cosmeticsCatalog:[];
    for(const item of cosmeticDefaults)if(!state.cosmeticsCatalog.some(x=>x.id===item.id))state.cosmeticsCatalog.push(item);
    state.levelRewards=state.levelRewards||[
      {level:5,coins:100,item:'cos_badge_cat',title:'Перший милий знак'},
      {level:10,coins:250,item:'cos_frame_blush',title:'Тепла рамочка'},
      {level:15,coins:300,item:'pack_cozy_cats',title:'Cozy Cats'},
      {level:20,coins:400,item:'cos_theme_dark',title:'Темна тема'},
      {level:25,coins:500,item:'cos_frame_night',title:'Рамка «Тиха ніч»'},
      {level:30,coins:700,item:'cos_theme_lavender',title:'Лавандова тема'},
      {level:40,coins:1000,item:'pack_bunny_notes',title:'Bunny Notes'},
      {level:50,coins:1500,item:'cos_badge_bunny',title:'Легендарний кролик'}
    ];
    state.stickerCollections=state.stickerCollections||defaultStickerCollections();
    state.stickerBoxes=state.stickerBoxes||defaultStickerBoxes();
    ensureCollectionAchievements();
    state.profileStickers=state.profileStickers||[];
    state.giftHistory=Array.isArray(state.giftHistory)?state.giftHistory:[];
    for(const [index,u] of (state.users||[]).entries()){
      if(!u.role)u.role=index===0?'owner':'member';
      u.inventory=Array.isArray(u.inventory)?u.inventory:[];u.equipped={badge:null,frame:null,animatedFrame:null,nicknameEffect:null,theme:'light',...(u.equipped||{})};
      u.claimedLevelRewards=u.claimedLevelRewards||[];u.featuredAchievements=u.featuredAchievements||u.achievements?.slice(0,3)||[];
      u.achievements=Array.isArray(u.achievements)?u.achievements:[];u.activity=Array.isArray(u.activity)?u.activity:[];u.skills=u.skills||{};
      u.stats={questsCompleted:u.activity.filter(x=>x.startsWith('Виконано:')).length||0,giftsOpened:0,jackpots:0,stickersGiven:0,boxesOpened:0,invitedUsers:0,referralXp:0,referralGifts:0,...(u.stats||{})};u.referrals=Array.isArray(u.referrals)?u.referrals:[];u.invitedBy=u.invitedBy||null;
      u.createdAt=u.createdAt||state.meta.createdAt||new Date().toISOString();u.importantDates=Array.isArray(u.importantDates)?u.importantDates:[];u.stickerInventory=u.stickerInventory||{};u.stickerDust=Number(u.stickerDust||0);u.receivedGifts=Array.isArray(u.receivedGifts)?u.receivedGifts:[];u.level=Math.max(1,Math.trunc(Number(u.level)||1));u.xp=Math.max(0,Number(u.xp)||0);
      if(u.telegramLinked){for(const id of ['tg_first_login','tg_verified_profile'])if(!u.achievements.includes(id))u.achievements.push(id);}
    }
    const extra=[
      {id:'a_roulette_7',icon:'✦',title:'Сім ранкових сюрпризів',description:'Відкрити рулетку 7 разів',rarity:'Рідкісна',target:7,progress:0},
      {id:'a_roulette_all',icon:'◇',title:'Колекціонер удачі',description:'Отримати всі типи нагород рулетки',rarity:'Епічна',target:5,progress:0},
      {id:'a_jackpot',icon:'♕',title:'Диво трапляється',description:'Отримати джекпот +500',rarity:'Легендарна',target:1,progress:0},
      {id:'tg_first_login',icon:'✈',title:'Telegram поруч',description:'Увійти в myHabbit через Telegram',rarity:'Рідкісна',target:1,progress:0},
      {id:'tg_verified_profile',icon:'@',title:'Справжній профіль',description:'Привʼязати Telegram ID та @username',rarity:'Епічна',target:1,progress:0},
      {id:'ref_first_friend',icon:'👋',title:'Перший друг',description:'Запросити першу людину, яка приєднається до сімʼї',rarity:'Рідкісна',target:1,progress:0},
      {id:'ref_better_together',icon:'🤝',title:'Разом краще',description:'Запросити 3 людей',rarity:'Рідкісна',target:3,progress:0},
      {id:'ref_family_grows',icon:'🌱',title:'Родина росте',description:'Запросити 5 людей',rarity:'Епічна',target:5,progress:0},
      {id:'ref_big_family',icon:'🌳',title:'Велика сімʼя',description:'Запросити 10 людей',rarity:'Епічна',target:10,progress:0},
      {id:'ref_home_for_all',icon:'🏡',title:'Дім для всіх',description:'Запросити 20 людей',rarity:'Легендарна',target:20,progress:0},
      {id:'ref_people_connector',icon:'🌍',title:'Обʼєднувач людей',description:'Запросити 50 людей',rarity:'Легендарна',target:50,progress:0},
      {id:'ref_community_leader',icon:'👑',title:'Лідер спільноти',description:'Запросити 100 людей',rarity:'Міфічна',target:100,progress:0},
      {id:'ref_community_legend',icon:'🌟',title:'Легенда спільноти',description:'Запросити 250 людей',rarity:'Міфічна',target:250,progress:0},
      {id:'myth_architect_of_fate',icon:'👑',title:'Архітектор долі',description:'Запросити 100 людей, з яких щонайменше 50 залишаються активними понад 100 днів',rarity:'Міфічна',target:1,progress:0,hidden:true},
      {id:'myth_infinity',icon:'🌌',title:'Нескінченність',description:'Запрошені користувачі разом набрали 1 000 000 XP',rarity:'Міфічна',target:1000000,progress:0,hidden:true},
      {id:'myth_time_keeper',icon:'⏳',title:'Хранитель часу',description:'Один із запрошених утримує серію 365 днів',rarity:'Міфічна',target:365,progress:0,hidden:true},
      {id:'myth_heart_myhabbit',icon:'💖',title:'Серце myHabbit',description:'Запрошені користувачі подарували одне одному 500 подарунків',rarity:'Міфічна',target:500,progress:0,hidden:true},
      {id:'myth_absolute',icon:'✨',title:'Абсолют',description:'Отримати всі інші досягнення гри',rarity:'Міфічна',target:1,progress:0,hidden:true}
    ];
    for(const a of extra)if(!state.achievements.some(x=>x.id===a.id))state.achievements.push(a);
    for(const a of state.achievements){const asset=achievementIconAsset(a);if(asset)a.icon=asset;}
  }
  function cuteIcon(name){return `<img class="cute-icon" src="/icons/cozy/${name}.svg" alt="">`;}
  function cosmetic(id){return state.cosmeticsCatalog?.find(x=>x.id===id);}
  function stickerName(id){for(const c of (state.stickerCollections||[])){const x=c.stickers.find(s=>s.id===id);if(x)return x.name;}return id;}
  function defaultStickerCollections(){return [
    {id:'cozy-cats',title:'Cozy Cats',season:'always',reward:'Рамка «Котячий затишок»',stickers:[['cat_heart','Котик із сердечком','common'],['cat_coffee','Котик із кавою','common'],['cat_book','Котик читає','common'],['cat_sleep','Сонний котик','rare'],['cat_star','Зоряний котик','rare'],['cat_crown','Королівський котик','epic']]},
    {id:'bunny-love',title:'Bunny Love',season:'always',reward:'Бейдж «Теплі вушка»',stickers:[['bunny_hi','Кролик вітається','common'],['bunny_tea','Кролик із чаєм','common'],['bunny_flower','Кролик із квіткою','common'],['bunny_hug','Обійми кролика','rare'],['bunny_moon','Місячний кролик','rare'],['bunny_crown','Королівський кролик','epic']]},
    {id:'christmas',title:'Christmas Cozy',season:'christmas',reward:'Фон «Різдвяна ніч»',stickers:[['xmas_cat','Котик у шапці','common'],['xmas_tree','Тепла ялинка','common'],['xmas_cocoa','Святкове какао','rare'],['xmas_star','Різдвяна зірка','epic']]},
    {id:'halloween',title:'Halloween Cute',season:'halloween',reward:'Ефект «Магічні іскри»',stickers:[['hallo_cat','Котик-чарівник','common'],['hallo_pumpkin','Милий гарбуз','common'],['hallo_ghost','Добрий привид','rare'],['hallo_moon','Гелловінський місяць','epic']]},
    {id:'easter',title:'Easter Bunny',season:'easter',reward:'Рамка «Весняне диво»',stickers:[['easter_egg','Писанка','common'],['easter_bunny','Великодній кролик','common'],['easter_basket','Святковий кошик','rare'],['easter_sun','Весняне сонце','epic']]}
  ].map(c=>({...c,stickers:c.stickers.map(x=>({id:x[0],name:x[1],rarity:x[2]}))}));}
  function defaultStickerBoxes(){return [
    {id:'box_cats',title:'Cozy Cats Box',collectionId:'cozy-cats',price:300},
    {id:'box_bunny',title:'Bunny Love Box',collectionId:'bunny-love',price:300},
    {id:'box_christmas',title:'Christmas Box',collectionId:'christmas',price:450},
    {id:'box_halloween',title:'Halloween Box',collectionId:'halloween',price:450},
    {id:'box_easter',title:'Easter Box',collectionId:'easter',price:450}
  ];}
  function easterDate(year){const a=year%19,b=Math.floor(year/100),c=year%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),month=Math.floor((h+l-7*m+114)/31),day=((h+l-7*m+114)%31)+1;return new Date(year,month-1,day);}
  function seasonInfo(season,date=new Date()){const y=date.getFullYear(),md=(date.getMonth()+1)*100+date.getDate();if(season==='always')return {active:true,label:'Доступна завжди'};if(season==='christmas')return {active:md>=1201||md<=107,label:'1 грудня — 7 січня'};if(season==='halloween')return {active:md>=1015&&md<=1102,label:'15 жовтня — 2 листопада'};if(season==='easter'){const e=easterDate(y),from=new Date(e),to=new Date(e);from.setDate(e.getDate()-14);to.setDate(e.getDate()+7);return {active:date>=from&&date<=to,label:`${from.toLocaleDateString('uk-UA')} — ${to.toLocaleDateString('uk-UA')}`};}return {active:false,label:'Сезон закритий'};}
  function roman(n){const map=[[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];let out='';for(const [v,s] of map)while(n>=v){out+=s;n-=v;}return out||'—';}
  function romanDate(value){const d=new Date(value);if(Number.isNaN(d.getTime()))return '—';return `${roman(d.getDate())}.${roman(d.getMonth()+1)}.${roman(d.getFullYear())}`;}
  function escapeHtml(value){return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
  function normalDate(day,month){return `${String(Number(day)||1).padStart(2,'0')}.${String(Number(month)||1).padStart(2,'0')}`;}
  function importantDateOrder(item){const now=new Date(),y=now.getFullYear();let d=new Date(y,Number(item.month)-1,Number(item.day));d.setHours(23,59,59,999);if(d<now)d=new Date(y+1,Number(item.month)-1,Number(item.day));return d.getTime();}
  function importantDatesBlock(u,own){const items=[...(u.importantDates||[])].filter(x=>x&&x.visible!==false).sort((a,b)=>importantDateOrder(a)-importantDateOrder(b));return `<details class="cozy-fold important-dates-fold"><summary><span class="important-date-icon">♡</span><strong>Важливі дати</strong><small>${items.length}</small></summary><div class="fold-body important-dates-body">${items.length?items.map(x=>`<article class="important-date-row"><time>${normalDate(x.day,x.month)}</time><span>${escapeHtml(x.title)}</span></article>`).join(''):'<div class="empty-soft">Особливі дати ще не додані.</div>'}${own?'<button class="btn soft important-dates-manage" data-action="manage-important-dates">Керувати датами</button>':''}</div></details>`;}
  function stickerCount(u,id){return Number(u.stickerInventory?.[id]||0);}

  function clone(v){return JSON.parse(JSON.stringify(v));}
  function loadState(){try{return JSON.parse(localStorage.getItem(STORAGE))||clone(seed);}catch{return clone(seed);}}
  function loadAuth(){try{return JSON.parse(localStorage.getItem(AUTH))||null;}catch{return null;}}
  function loadAccounts(){try{return JSON.parse(localStorage.getItem(ACCOUNTS))||[];}catch{return [];}}
  function accountId(a=auth,s=state){return a?.userId&&s?.family?.id?`${s.family.id}:${a.userId}`:'';}
  function restoreActiveAccount(){
    const id=localStorage.getItem(ACTIVE_ACCOUNT); const item=loadAccounts().find(x=>x.id===id);
    if(item?.auth&&item?.state){auth=clone(item.auth);state=clone(item.state);normalizeState();localStorage.setItem(AUTH,JSON.stringify(auth));localStorage.setItem(STORAGE,JSON.stringify(state));}
  }
  function persistAccount(){
    if(!auth)return; const id=accountId(); if(!id)return; const list=loadAccounts(); const u=currentUser();
    const item={id,label:u?.name||'Мій профіль',familyName:state.family?.name||'',auth:clone(auth),state:clone(state),updatedAt:Date.now()};
    const i=list.findIndex(x=>x.id===id); if(i>=0)list[i]=item;else list.unshift(item);
    localStorage.setItem(ACCOUNTS,JSON.stringify(list.slice(0,10)));localStorage.setItem(ACTIVE_ACCOUNT,id);
  }
  function save(){normalizeState();localStorage.setItem(STORAGE,JSON.stringify(state));persistAccount();queueDailySnapshot();applyTheme();}
  function applyTheme(){document.documentElement.dataset.theme=currentUser()?.equipped?.theme||'light';}
  function currentUser(){return state.users.find(u=>u.id===state.currentUserId)||state.users[0];}
  function cleanResourceUrl(value){
    const raw=String(value||'').trim();if(!raw)return '';
    try{const url=new URL(raw);return ['http:','https:'].includes(url.protocol)?url.href:'';}catch{return '';}
  }
  function visibleFamilyUsers(){return (state.users||[]).filter(u=>!u.hiddenFromFamily);}
  function showToast(text){toast.textContent=text;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2200);}


  // Stage 8: illustrated achievement icon library extracted from the supplied artwork.
  const ACHIEVEMENT_ICON_LIBRARY={"start":["/assets/achievement-icons/start-welcome.webp","/assets/achievement-icons/start-first-step.webp","/assets/achievement-icons/start-new-life.webp","/assets/achievement-icons/start-story-begins.webp","/assets/achievement-icons/start-dont-give-up.webp","/assets/achievement-icons/start-you-are-here.webp","/assets/achievement-icons/start-hero-born.webp"],"streak":["/assets/achievement-icons/streak-3-days.webp","/assets/achievement-icons/streak-7-days.webp","/assets/achievement-icons/streak-14-days.webp","/assets/achievement-icons/streak-21-days.webp","/assets/achievement-icons/streak-30-days.webp","/assets/achievement-icons/streak-50-days.webp","/assets/achievement-icons/streak-75-days.webp","/assets/achievement-icons/streak-100-days.webp","/assets/achievement-icons/streak-150-days.webp","/assets/achievement-icons/streak-200-days.webp","/assets/achievement-icons/streak-250-days.webp","/assets/achievement-icons/streak-300-days.webp","/assets/achievement-icons/streak-365-days.webp","/assets/achievement-icons/streak-500-days.webp","/assets/achievement-icons/streak-unbreakable.webp"],"levels":["/assets/achievement-icons/levels-newbie.webp","/assets/achievement-icons/levels-explorer.webp","/assets/achievement-icons/levels-adventurer.webp","/assets/achievement-icons/levels-seeker.webp","/assets/achievement-icons/levels-student.webp","/assets/achievement-icons/levels-fighter.webp","/assets/achievement-icons/levels-master.webp","/assets/achievement-icons/levels-expert.webp","/assets/achievement-icons/levels-champion.webp","/assets/achievement-icons/levels-hero.webp","/assets/achievement-icons/levels-veteran.webp","/assets/achievement-icons/levels-legend.webp","/assets/achievement-icons/levels-immortal.webp","/assets/achievement-icons/levels-myth.webp","/assets/achievement-icons/levels-absolute-master.webp"],"sport":["/assets/achievement-icons/sport-first-move.webp","/assets/achievement-icons/sport-warmup.webp","/assets/achievement-icons/sport-active-day.webp","/assets/achievement-icons/sport-sport-lover.webp","/assets/achievement-icons/sport-strong-spirit.webp","/assets/achievement-icons/sport-athlete.webp","/assets/achievement-icons/sport-iron-body.webp"],"relationship":["/assets/achievement-icons/relationship-first-date.webp","/assets/achievement-icons/relationship-care.webp","/assets/achievement-icons/relationship-better-together.webp","/assets/achievement-icons/relationship-romantic.webp","/assets/achievement-icons/relationship-couple-heart.webp","/assets/achievement-icons/relationship-reliable-partner.webp","/assets/achievement-icons/relationship-happy-family.webp","/assets/achievement-icons/relationship-love-without-limits.webp"],"family":["/assets/achievement-icons/family-new-member.webp","/assets/achievement-icons/family-stronger-together.webp","/assets/achievement-icons/family-caring.webp","/assets/achievement-icons/family-reliable-shoulder.webp","/assets/achievement-icons/family-family-heart.webp","/assets/achievement-icons/family-family-support.webp","/assets/achievement-icons/family-fortress.webp"],"reading":["/assets/achievement-icons/reading-first-book.webp","/assets/achievement-icons/reading-reader.webp","/assets/achievement-icons/reading-book-lover.webp","/assets/achievement-icons/reading-bibliophile.webp","/assets/achievement-icons/reading-avid-reader.webp","/assets/achievement-icons/reading-sage.webp","/assets/achievement-icons/reading-archivist.webp","/assets/achievement-icons/reading-living-library.webp"],"mind":["/assets/achievement-icons/mind-step-forward.webp","/assets/achievement-icons/mind-new-horizons.webp","/assets/achievement-icons/mind-aspiration.webp","/assets/achievement-icons/mind-strategist.webp","/assets/achievement-icons/mind-thinker.webp","/assets/achievement-icons/mind-genius.webp","/assets/achievement-icons/mind-life-architect.webp"],"cinema":["/assets/achievement-icons/cinema-first-film.webp","/assets/achievement-icons/cinema-movie-night.webp","/assets/achievement-icons/cinema-cinemaniac.webp","/assets/achievement-icons/cinema-series-lover.webp","/assets/achievement-icons/cinema-genre-expert.webp","/assets/achievement-icons/cinema-critic.webp","/assets/achievement-icons/cinema-cinema-legend.webp","/assets/achievement-icons/cinema-screen-master.webp"],"home":["/assets/achievement-icons/home-clean-start.webp","/assets/achievement-icons/home-tidy-corner.webp","/assets/achievement-icons/home-order-master.webp","/assets/achievement-icons/home-home-owner.webp","/assets/achievement-icons/home-everything-shines.webp","/assets/achievement-icons/home-cleanliness-king.webp","/assets/achievement-icons/home-perfect-order.webp"],"quests":["/assets/achievement-icons/quests-first-mission.webp","/assets/achievement-icons/quests-performer.webp","/assets/achievement-icons/quests-adventure-seeker.webp","/assets/achievement-icons/quests-conqueror.webp","/assets/achievement-icons/quests-quest-master.webp","/assets/achievement-icons/quests-great-hero.webp","/assets/achievement-icons/quests-invincible.webp","/assets/achievement-icons/quests-goal-driven.webp"],"gifts":["/assets/achievement-icons/gifts-first-gift.webp","/assets/achievement-icons/gifts-good-friend.webp","/assets/achievement-icons/gifts-generous-heart.webp","/assets/achievement-icons/gifts-giver.webp","/assets/achievement-icons/gifts-surprise-master.webp","/assets/achievement-icons/gifts-benefactor.webp","/assets/achievement-icons/gifts-company-soul.webp"],"wheel":["/assets/achievement-icons/wheel-first-spin.webp","/assets/achievement-icons/wheel-lucky.webp","/assets/achievement-icons/wheel-fortunate.webp","/assets/achievement-icons/wheel-fortune-favorite.webp","/assets/achievement-icons/wheel-big-win.webp","/assets/achievement-icons/wheel-jackpot.webp","/assets/achievement-icons/wheel-born-lucky.webp","/assets/achievement-icons/wheel-luck-master.webp"],"shop":["/assets/achievement-icons/shop-first-purchase.webp","/assets/achievement-icons/shop-style-collector.webp","/assets/achievement-icons/shop-new-look.webp","/assets/achievement-icons/shop-wardrobe-grows.webp","/assets/achievement-icons/shop-beauty-lover.webp","/assets/achievement-icons/shop-style-icon.webp","/assets/achievement-icons/shop-all-mine.webp"],"cosmetics":["/assets/achievement-icons/cosmetics-first-frame.webp","/assets/achievement-icons/cosmetics-new-effect.webp","/assets/achievement-icons/cosmetics-beauty.webp","/assets/achievement-icons/cosmetics-stylish.webp","/assets/achievement-icons/cosmetics-shining-profile.webp","/assets/achievement-icons/cosmetics-unique-style.webp","/assets/achievement-icons/cosmetics-living-legend.webp","/assets/achievement-icons/cosmetics-style-master.webp"],"collections1":["/assets/achievement-icons/collections1-first-sticker.webp","/assets/achievement-icons/collections1-first-page.webp","/assets/achievement-icons/collections1-collector.webp","/assets/achievement-icons/collections1-half-album.webp","/assets/achievement-icons/collections1-full-album.webp","/assets/achievement-icons/collections1-legend-seeker.webp","/assets/achievement-icons/collections1-all-legendary.webp"],"collections2":["/assets/achievement-icons/collections2-first-seasonal.webp","/assets/achievement-icons/collections2-easter-hero.webp","/assets/achievement-icons/collections2-halloween-hunter.webp","/assets/achievement-icons/collections2-christmas-miracle.webp","/assets/achievement-icons/collections2-absolute-collector.webp"],"referrals":["/assets/achievement-icons/referrals-first-friend.webp","/assets/achievement-icons/referrals-better-together.webp","/assets/achievement-icons/referrals-family-grows.webp","/assets/achievement-icons/referrals-big-family.webp","/assets/achievement-icons/referrals-home-for-all.webp","/assets/achievement-icons/referrals-people-connector.webp","/assets/achievement-icons/referrals-community-leader.webp","/assets/achievement-icons/referrals-mentor.webp"],"special":["/assets/achievement-icons/special-early-user.webp","/assets/achievement-icons/special-founder.webp","/assets/achievement-icons/special-holiday-guest.webp","/assets/achievement-icons/special-season-winner.webp","/assets/achievement-icons/special-myhabbit-veteran.webp","/assets/achievement-icons/special-one-year.webp","/assets/achievement-icons/special-two-years.webp","/assets/achievement-icons/special-three-years.webp"],"mythic":["/assets/achievement-icons/mythic-architect-of-fate.webp","/assets/achievement-icons/mythic-infinity.webp","/assets/achievement-icons/mythic-time-keeper.webp","/assets/achievement-icons/mythic-heart-myhabbit.webp","/assets/achievement-icons/mythic-absolute.webp"],"secret":["/assets/achievement-icons/secret-secret-01.webp","/assets/achievement-icons/secret-secret-02.webp","/assets/achievement-icons/secret-secret-03.webp","/assets/achievement-icons/secret-secret-04.webp","/assets/achievement-icons/secret-secret-05.webp","/assets/achievement-icons/secret-secret-06.webp","/assets/achievement-icons/secret-secret-07.webp","/assets/achievement-icons/secret-secret-08.webp","/assets/achievement-icons/secret-secret-09.webp","/assets/achievement-icons/secret-secret-10.webp","/assets/achievement-icons/secret-secret-11.webp"]};
  const ACHIEVEMENT_ICON_CATEGORY_ALIASES={"general":"start","levels":"levels","streak":"streak","discipline":"streak","sport":"sport","health":"sport","relationship":"relationship","family":"family","reading":"reading","mind":"mind","creativity":"mind","cinema":"cinema","home":"home","shop":"shop","coins":"wheel","finance":"shop","secret":"secret","legendary":"mythic","collections":"collections1"};
  const ACHIEVEMENT_ICON_BY_ID={
    a1:'/assets/achievement-icons/start-first-step.webp',a2:'/assets/achievement-icons/streak-7-days.webp',a3:'/assets/achievement-icons/relationship-care.webp',a4:'/assets/achievement-icons/home-home-owner.webp',a5:'/assets/achievement-icons/quests-quest-master.webp',a6:'/assets/achievement-icons/sport-athlete.webp',a7:'/assets/achievement-icons/family-family-heart.webp',a8:'/assets/achievement-icons/reading-sage.webp',a9:'/assets/achievement-icons/secret-secret-01.webp',
    ref_first_friend:'/assets/achievement-icons/referrals-first-friend.webp',ref_better_together:'/assets/achievement-icons/referrals-better-together.webp',ref_family_grows:'/assets/achievement-icons/referrals-family-grows.webp',ref_big_family:'/assets/achievement-icons/referrals-big-family.webp',ref_home_for_all:'/assets/achievement-icons/referrals-home-for-all.webp',ref_people_connector:'/assets/achievement-icons/referrals-people-connector.webp',ref_community_leader:'/assets/achievement-icons/referrals-community-leader.webp',ref_community_legend:'/assets/achievement-icons/referrals-mentor.webp',
    myth_architect_of_fate:'/assets/achievement-icons/mythic-architect-of-fate.webp',myth_infinity:'/assets/achievement-icons/mythic-infinity.webp',myth_time_keeper:'/assets/achievement-icons/mythic-time-keeper.webp',myth_heart_myhabbit:'/assets/achievement-icons/mythic-heart-myhabbit.webp',myth_absolute:'/assets/achievement-icons/mythic-absolute.webp',
    a_roulette_7:'/assets/achievement-icons/wheel-first-spin.webp',a_roulette_all:'/assets/achievement-icons/wheel-fortune-favorite.webp',a_jackpot:'/assets/achievement-icons/wheel-jackpot.webp'
  };
  function achievementIconAsset(achievement){
    if(!achievement)return '';
    if(ACHIEVEMENT_ICON_BY_ID[achievement.id])return ACHIEVEMENT_ICON_BY_ID[achievement.id];
    if(typeof achievement.icon==='string'&&achievement.icon.startsWith('/'))return achievement.icon;
    const category=ACHIEVEMENT_ICON_CATEGORY_ALIASES[achievement.category]||achievement.category||'general';
    const set=ACHIEVEMENT_ICON_LIBRARY[category]||ACHIEVEMENT_ICON_LIBRARY.start||[];
    if(!set.length)return '';
    const stage=Number(String(achievement.title||'').match(/етап\s*(\d+)/i)?.[1]||0);
    let hash=0;for(const ch of String(achievement.id||achievement.title||''))hash=(hash*31+ch.charCodeAt(0))>>>0;
    return set[((stage>0?stage-1:hash)%set.length+set.length)%set.length];
  }
  function achievementIconHtml(achievement,className='achievement-art'){
    const src=achievementIconAsset(achievement);
    if(src)return `<img class="${className}" src="${src}" alt="" loading="lazy">`;
    return `<span class="${className} achievement-emoji">${escapeHtml(achievement?.icon||'🏆')}</span>`;
  }

  // Stage 9.9 fix: initialize application state only after achievement icon
  // libraries are initialized. normalizeState() calls achievementIconAsset(), so
  // running it earlier caused a temporal-dead-zone ReferenceError.
  const tg = window.Telegram?.WebApp || null;
  const telegramInitData = tg?.initData || '';
  const telegramUser = tg?.initDataUnsafe?.user || null;
  const startParam = tg?.initDataUnsafe?.start_param || '';
  const urlInviteToken = new URLSearchParams(location.search).get('invite') || '';
  const telegramInviteToken = startParam.startsWith('invite_') ? startParam.slice(7) : '';
  const inviteToken = urlInviteToken || telegramInviteToken;
  if (tg) { try { tg.ready(); tg.expand(); } catch {} }
  let state = loadState();
  let auth = loadAuth();
  restoreActiveAccount();
  normalizeState();
  let route = new URLSearchParams(location.search).get('screen') || (auth ? 'dashboard' : ((telegramInitData || inviteToken) ? 'auth' : 'landing'));
  let authMode = (telegramInitData || inviteToken) ? 'join' : 'create';
  let inviteInfo = null;

  // Stage 7: game-style achievement notifications. Items are shown one at a time,
  // remain visible for five seconds, then leave to the right.
  const achievementToastQueue=[];
  let achievementToastBusy=false;
  function achievementRarityClass(value){
    const v=String(value||'').toLowerCase();
    if(v.includes('міф')||v.includes('myth'))return 'mythic';
    if(v.includes('леген')||v.includes('legend'))return 'legendary';
    if(v.includes('епіч')||v.includes('epic'))return 'epic';
    if(v.includes('рідк')||v.includes('rare'))return 'rare';
    if(v.includes('незвич')||v.includes('uncommon'))return 'uncommon';
    return 'common';
  }
  function achievementChime(rarity='common'){
    if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;
    try{
      const AudioCtx=window.AudioContext||window.webkitAudioContext;if(!AudioCtx)return;
      const ctx=new AudioCtx(),now=ctx.currentTime;
      const notes=rarity==='mythic'?[523.25,659.25,783.99,1046.5]:rarity==='legendary'?[523.25,659.25,783.99]:[659.25,783.99];
      notes.forEach((freq,i)=>{const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type='sine';osc.frequency.value=freq;gain.gain.setValueAtTime(0.0001,now+i*.09);gain.gain.exponentialRampToValueAtTime(.075,now+i*.09+.02);gain.gain.exponentialRampToValueAtTime(.0001,now+i*.09+.28);osc.connect(gain).connect(ctx.destination);osc.start(now+i*.09);osc.stop(now+i*.09+.3);});
      setTimeout(()=>ctx.close().catch(()=>{}),900);
    }catch{}
  }
  function queueAchievementToast(achievement){
    if(!achievement)return;
    achievementToastQueue.push({...achievement,title:achievement.title||'Нове досягнення',rarity:achievement.rarity||'Звичайна',rewardXp:Number(achievement.rewardXp||0)});
    processAchievementToastQueue();
  }
  function dismissAchievementToast(card,done){
    if(!card||card.dataset.closing==='1')return;card.dataset.closing='1';card.classList.add('achievement-toast-out');
    setTimeout(()=>{card.remove();done?.();},520);
  }
  function processAchievementToastQueue(){
    if(achievementToastBusy||!achievementToastQueue.length)return;achievementToastBusy=true;
    const item=achievementToastQueue.shift(),rarity=achievementRarityClass(item.rarity);
    let layer=document.getElementById('achievementToastLayer');
    if(!layer){layer=document.createElement('div');layer.id='achievementToastLayer';layer.className='achievement-toast-layer';layer.setAttribute('aria-live','polite');document.body.appendChild(layer);}
    const card=document.createElement('button');card.type='button';card.className=`achievement-toast achievement-toast-${rarity}`;card.dataset.achievementId=item.id||'';
    card.innerHTML=`<span class="achievement-toast-icon">${achievementIconHtml(item,'achievement-toast-art')}</span><span class="achievement-toast-copy"><small>Досягнення отримано</small><strong>${escapeHtml(item.title)}</strong>${item.rewardXp?`<em>+${format(item.rewardXp)} XP</em>`:''}</span><span class="achievement-toast-sparkles" aria-hidden="true">✦</span>`;
    layer.appendChild(card);requestAnimationFrame(()=>card.classList.add('achievement-toast-in'));achievementChime(rarity);
    let timer=setTimeout(()=>dismissAchievementToast(card,finish),5000),startX=0,deltaX=0;
    function finish(){clearTimeout(timer);achievementToastBusy=false;setTimeout(processAchievementToastQueue,90);}
    card.addEventListener('click',()=>{dismissAchievementToast(card,finish);route='achievements';history.pushState({},'',location.pathname+'?screen=achievements');render();});
    card.addEventListener('pointerdown',e=>{startX=e.clientX;deltaX=0;card.setPointerCapture?.(e.pointerId);});
    card.addEventListener('pointermove',e=>{if(!startX)return;deltaX=e.clientX-startX;if(deltaX>0)card.style.transform=`translateX(${Math.min(deltaX,180)}px)`;});
    card.addEventListener('pointerup',()=>{if(deltaX>85){clearTimeout(timer);dismissAchievementToast(card,finish);}else card.style.transform='';startX=0;deltaX=0;});
  }
  function format(n){return new Intl.NumberFormat('uk-UA').format(n||0);}
  function xpRequiredForLevel(level){
    const fixed=[0,1500,1800,2150,2550,3000,3500,4050,4650,5300];
    const lvl=Math.max(1,Math.trunc(Number(level)||1));
    if(lvl<fixed.length)return fixed[lvl];
    let required=fixed[fixed.length-1];
    for(let current=fixed.length;current<=lvl;current++)required=Math.round((required*1.105+140)/50)*50;
    return required;
  }
  function xpPct(u){const need=xpRequiredForLevel(u?.level||1);return Math.min(100,Math.round((Math.max(0,Number(u?.xp)||0)/need)*100));}
  function addXp(u,amount,source='Активність'){
    let gained=Math.max(0,Math.trunc(Number(amount)||0));
    if(!u||!gained)return {gained:0,levels:0};
    u.level=Math.max(1,Math.trunc(Number(u.level)||1));u.xp=Math.max(0,Number(u.xp)||0);
    u.xp+=gained;let levels=0;
    while(u.xp>=xpRequiredForLevel(u.level)){
      u.xp-=xpRequiredForLevel(u.level);u.level+=1;levels+=1;
      u.coins=Number(u.coins||0)+50;
      u.activity=Array.isArray(u.activity)?u.activity:[];
      u.activity.unshift(`Новий рівень ${u.level} · ${source}`);
      state.history.unshift({icon:'⭐',text:`${u.name} досяг(ла) ${u.level} рівня`,time:'Щойно'});
    }
    return {gained,levels};
  }
  function ensureCollectionAchievements(){
    for(const c of state.stickerCollections||[]){
      const milestones=[
        {pct:50,xp:150,icon:'🥈',title:`${c.title}: половина паку`,rarity:'Рідкісна'},
        {pct:100,xp:500,icon:'🏆',title:`${c.title}: повний пак`,rarity:'Епічна'}
      ];
      for(const m of milestones){const id=`collection_${c.id}_${m.pct}`;if(!state.achievements.some(a=>a.id===id))state.achievements.push({id,icon:m.icon,title:m.title,description:`Зібрати ${m.pct}% колекції «${c.title}»`,rarity:m.rarity,target:m.pct,progress:0,category:'collections',rewardXp:m.xp});}
    }
  }
  function checkCollectionMilestones(u,c){
    if(!u||!c)return [];
    const owned=c.stickers.filter(s=>stickerCount(u,s.id)>0).length;
    const pct=Math.floor(owned/Math.max(1,c.stickers.length)*100),unlocked=[];
    for(const m of [{pct:50,xp:150},{pct:100,xp:500}]){
      const id=`collection_${c.id}_${m.pct}`;
      const a=state.achievements.find(x=>x.id===id);if(a)a.progress=Math.min(m.pct,pct);
      if(pct>=m.pct&&!u.achievements.includes(id)){unlockAchievement(u,id);addXp(u,m.xp,`ачівка «${c.title}»`);unlocked.push({id,xp:m.xp,title:a?.title||c.title});}
    }
    return unlocked;
  }
  function skillLabel(k){return {family:'Наші разом',relationship:'Близькість',home:'Наш куточок',sport:'Руханка',health:'Сили й баланс',mind:'Цікавинки',reading:'Книжкові мандри',cinema:'Кіновечори',creativity:'Натхнення',finance:'Скарбничка',discipline:'Мій ритм',care:'Тепло',growth:'Нові відкриття'}[k]||k;}
  function skillIcon(k){return {family:'👨‍👩‍👧‍👦',relationship:'💞',home:'🏠',sport:'💪',health:'❤️',mind:'🧠',reading:'📖',cinema:'🎬',creativity:'🎨',finance:'💰',discipline:'🔥',care:'💞',growth:'🧠'}[k]||'⭐';}
  function rarityLabel(r){return {common:'Звичайна',uncommon:'Незвичайна',rare:'Рідкісна',epic:'Епічна',legendary:'Легендарна',secret:'Секретна'}[r]||r;}
  function questFromCatalog(q){const skills=q.rewards?.skills||{};const primary=Object.keys(skills)[0]||q.category||'discipline';return {id:q.id,title:q.title,icon:skillIcon(q.category),description:q.description||'Завдання з бібліотеки myHabbit',type:q.type||'personal',participants:['pair','coop'].includes(q.type)?2:1,claimedBy:[],rewardCoins:Number(q.rewards?.coins||0),rewardXp:Number(q.rewards?.xp||0),skill:primary,skillXp:Number(skills[primary]||0),skillRewards:skills,status:q.active===false?'paused':'active',limited:q.type==='limited',stock:q.type==='limited'?1:null,difficulty:q.difficulty,rarity:q.rarity,repeatType:q.repeatType||'none',unlockLevel:Number(q.unlockLevel||1),catalog:true,resourceUrl:cleanResourceUrl(q.resourceUrl||q.referenceUrl||'')};}
  function achievementFromCatalog(a){
    const target=Number(a.condition?.value||a.targetValue||1);
    const achievement={id:a.id,icon:'🏆',title:String(a.title||'Досягнення').replace(/^\p{Extended_Pictographic}+\s*/u,''),description:a.description||'Виконай умову досягнення.',rarity:rarityLabel(a.rarity),target,progress:0,category:a.category,hidden:Boolean(a.hidden),catalog:true,resourceUrl:cleanResourceUrl(a.resourceUrl||a.referenceUrl||'')};
    achievement.icon=achievementIconAsset(achievement)||achievement.icon;
    return achievement;
  }
  function shopFromCatalog(i){return {id:i.id,title:i.title,icon:{family:'👨‍👩‍👧‍👦',collective:'🤝',theme:'🎨',avatar:'🙂',frame:'🖼️',personal:'🎁'}[i.type]||'🎁',description:i.description||'Нагорода з каталогу myHabbit.',price:Number(i.price||0),stock:i.stock==null?999:Number(i.stock),type:i.type||'personal',catalog:true,resourceUrl:cleanResourceUrl(i.resourceUrl||i.referenceUrl||'')};}
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
      user:{id:u.id,name:u.name,avatar:u.avatar,role:u.role,telegramLinked:u.telegramLinked,telegramUsername:u.telegramUsername,createdAt:u.createdAt,importantDates:(u.importantDates||[]).slice(0,20),level:u.level,xp:u.xp,coins:u.coins,streak:u.streak,skills:u.skills,achievements:u.achievements,activity:(u.activity||[]).slice(0,20)},
      family:{name:state.family.name,code:state.family.code,level:state.family.level,xp:state.family.xp,coins:state.family.coins},
      quests:(state.quests||[]).map(q=>({id:q.id,title:q.title,icon:q.icon,description:q.description,type:q.type,participants:q.participants,claimedBy:q.claimedBy,rewardCoins:q.rewardCoins,rewardXp:q.rewardXp,skill:q.skill,skillXp:q.skillXp,status:q.status,limited:q.limited,stock:q.stock})),
      shop:(state.shop||[]).map(i=>({id:i.id,title:i.title,icon:i.icon,description:i.description,price:i.price,stock:i.stock,type:i.type,fund:i.fund||0,resourceUrl:cleanResourceUrl(i.resourceUrl)})),
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
    try{const data=await api('/api/family/state');if(data.state){state=data.state;normalizeState();localStorage.setItem(STORAGE,JSON.stringify(state));localStorage.setItem(LAST_SERVER_PULL,new Date().toISOString());}}catch{}
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
    const sessionAction=auth?.demo?'<button class="btn danger" data-action="exit-demo">Вийти з демо</button>':'<button class="btn danger" data-action="logout">Вийти</button>';
    const demoBanner=auth?.demo?'<div class="demo-banner"><div><strong>Демо-режим</strong><span>Зміни зберігаються лише на цьому пристрої.</span></div><button class="btn small" data-action="exit-demo">Вийти з демо</button></div>':'';
    return `<div class="app-layout"><main class="main">${demoBanner}<header class="topbar"><button class="menu-trigger" data-action="toggle-menu" aria-label="Відкрити меню">☰</button><div class="top-title"><h1>${title}</h1><p>${subtitle}</p></div><div class="top-actions"><span class="coin-pill">🪙 ${format(u.coins)}</span></div></header>${content}</main><div class="menu-backdrop" data-action="close-menu"></div><aside class="dropdown-menu"><div class="menu-profile"><div class="member-initial">${(u.name||'?').slice(0,1).toUpperCase()}</div><div><strong>${u.telegramUsername?'@'+u.telegramUsername:u.name}</strong><small>${u.level} рівень · ${format(u.coins)} 🪙</small></div><button class="close" data-action="close-menu">×</button></div><nav class="nav">${nav}</nav><div class="menu-footer"><button class="btn soft" data-action="accounts">Мої профілі</button>${sessionAction}</div></aside></div>`;
  }

  function landing(){
    return `<div class="landing"><nav class="landing-nav"><div class="brand"><span class="brand-mark">✦</span>myHabbit</div><button class="btn" data-route="auth">Увійти в сімʼю</button></nav><section class="landing-main"><div class="hero"><span class="eyebrow">Сімейна гра для реального життя</span><h1>Корисні справи стають спільною пригодою.</h1><p>Квести, особисті навички, колекції досягнень і магазин реальних можливостей. Для маленької сімейної команди — без зайвого шуму та складних систем.</p><div class="hero-actions"><button class="btn primary" data-action="demo">Відкрити демо</button><button class="btn" data-route="auth">Створити сімʼю</button></div><div class="hero-note">PWA для телефона · повноцінна сторінка для ПК · один Cloudflare Worker</div></div><div class="preview"><div class="preview-screen"><div class="preview-header"><div><small>Доброго дня</small><h2 style="margin:3px 0">Команда вдома ✨</h2></div><span class="profile-mark" aria-hidden="true">✦</span></div><div class="preview-card"><div class="preview-row"><strong>Наша спільна сходинка 12</strong><span>7 420 XP</span></div><div class="progress" style="margin-top:12px"><i style="width:74%"></i></div></div><div class="preview-card"><div class="preview-row"><div><strong>🧹 Генеральне прибирання</strong><small>Спільний квест · 1/2 учасники</small></div><span class="reward">+180 🪙</span></div></div><div class="preview-card"><div class="preview-row"><div><strong>🎁 Сюрприз для рідних</strong><small>Лімітований · залишилось 1</small></div><span class="reward">+120 🪙</span></div></div><div class="preview-card"><div class="preview-row"><div><strong>🏆 Стабільність</strong><small>7 днів поспіль</small></div><span class="tag coop">Отримано</span></div></div></div></div></section><section class="landing-features"><article class="feature"><span class="feature-icon">🤝</span><h3>Спільні квести</h3><p>Особисті, парні, командні та лімітовані завдання з прозорою нагородою.</p></article><article class="feature"><span class="feature-icon">🏆</span><h3>Колекція досягнень</h3><p>Особисті ачивки, які можна показувати іншим у профілі.</p></article><article class="feature"><span class="feature-icon">◈</span><h3>Реальний магазин</h3><p>Клуб, техніка, подорожі та інші погоджені можливості з обмеженим запасом.</p></article></section><footer class="footer">myHabbit — приватна сімейна екосистема для 2–5 учасників.</footer></div>`;
  }

  function authScreen(){
    const inviteBox = inviteToken ? `<div class="telegram-login-note"><span>💌</span><div><strong>Тепле запрошення</strong><p>${inviteInfo?.familyName?`Вас запрошують до «${inviteInfo.familyName}».`:'Перевіряємо запрошення…'} Код і PIN вводити не потрібно.</p></div></div>` : '';
    const telegramBox = telegramInitData && !inviteToken ? `<div class="telegram-login-note"><span>✈</span><div><strong>Вхід через Telegram</strong><p>${telegramUser?.first_name || 'Ваш профіль'} буде привʼязаний до сімейної сесії. Введіть код сімʼї та PIN нижче.</p></div></div>` : '';
    const tabs = inviteToken ? '' : `<div class="auth-switch"><button class="${authMode==='create'?'active':''}" data-auth-tab="create">Створити</button><button class="${authMode==='join'?'active':''}" data-auth-tab="join">Приєднатися</button></div>`;
    return `<div class="auth-card"><div class="brand"><span class="brand-mark">✦</span>myHabbit</div><h1>${inviteToken?'Ласкаво просимо':(telegramInitData?'Підключення до сімʼї':'Початок сімейної гри')}</h1><p>${inviteToken?'Ще один крок — оберіть імʼя для свого затишного куточка.':(telegramInitData?'Введіть код сімʼї та PIN.':'Створіть приватну сімʼю або приєднайтесь за кодом.')}</p>${inviteBox}${telegramBox}${tabs}<div id="authForm">${authForm(authMode)}</div>${telegramInitData?'':'<button class="btn" style="width:100%;margin-top:10px" data-route="landing">Назад</button>'}</div>`;
  }
  function authForm(mode){
    const tgName = telegramUser ? [telegramUser.first_name, telegramUser.last_name].filter(Boolean).join(' ') : '';
    if(inviteToken) return `<div class="form-grid"><div class="field"><label>${telegramInitData?'Telegram-профіль':'Ваше імʼя'}</label><input id="memberName" value="${telegramUser?.username?'@'+telegramUser.username:tgName}" ${telegramInitData?'readonly':''}></div><div class="field"><label>Ваш образ</label><select id="memberGender"><option value="male">Хлопець</option><option value="female">Дівчина</option><option value="neutral">Інший</option></select></div></div><button class="btn primary" style="width:100%;margin-top:16px" data-action="submit-invite">Приєднатися до своїх</button><p class="auth-help">Посилання діє обмежений час і може бути одноразовим.</p>`;
    return `<div class="form-grid"><div class="field full"><label>${mode==='create'?'Назва сімʼї':'Код сімʼї'}</label><input id="familyValue" autocomplete="off" value="${mode==='create'?'Наша команда':''}" placeholder="${mode==='create'?'Наприклад, Команда вдома':'Наприклад, FAMILY25'}"></div><div class="field"><label>${telegramInitData?'Telegram-профіль':'Ваше імʼя'}</label><input id="memberName" value="${telegramUser?.username?'@'+telegramUser.username:tgName}" ${telegramInitData?'readonly':''}></div><div class="field"><label>Профіль</label><select id="memberGender"><option value="male">Хлопець</option><option value="female">Дівчина</option><option value="neutral">Інший</option></select></div><div class="field full"><label>Сімейний PIN</label><input id="familyPin" type="password" inputmode="numeric" maxlength="8" placeholder="4–8 цифр"></div></div><button class="btn primary" style="width:100%;margin-top:16px" data-action="submit-auth" data-mode="${mode}">${mode==='create'?'Створити сімʼю':'Увійти до сімʼї'}</button><p class="auth-help">Код сімʼї та PIN можна отримати в адміністратора сімʼї.</p>`;
  }

  function dashboard(){
    const u=currentUser();
    const active=state.quests.filter(q=>q.status==='active').slice(0,4);
    const latest=state.achievements.filter(a=>u.achievements.includes(a.id)).slice(-1)[0];
    return shell(`<section class="grid metrics"><div class="card"><div class="metric-label">Моя сходинка</div><div class="metric-value">${u.level}</div><div class="progress"><i style="width:${xpPct(u)}%"></i></div><div class="metric-foot">${format(u.xp)} / ${format(xpRequiredForLevel(u.level))} XP</div></div><div class="card"><div class="metric-label">Наша спільна сходинка</div><div class="metric-value">${state.family.level}</div><div class="progress"><i style="width:${Math.min(100,state.family.xp%1000/10)}%"></i></div><div class="metric-foot">Спільний прогрес команди</div></div><div class="card"><div class="metric-label">Баланс</div><div class="metric-value">${format(u.coins)} 🪙</div><div class="metric-foot">На реальні можливості</div></div><div class="card"><div class="metric-label">Мій ритм</div><div class="metric-value">${u.streak} 🔥</div><div class="metric-foot">Днів у приємному ритмі</div></div></section><div class="grid two"><section><div class="section-head"><h2>Квести на сьогодні</h2><button class="btn small" data-route="quests">Усі квести</button></div><div class="quest-list">${active.map(questCard).join('')}</div></section><aside><div class="section-head"><h2>Остання ачивка</h2></div>${latest?achievementCard(latest,u):'<div class="card empty">Поки немає ачивок</div>'}<div class="section-head"><h2>Останні події</h2></div><div class="card">${state.history.slice(0,3).map(h=>`<div class="activity"><span class="activity-icon">${h.icon}</span><div><p>${h.text}</p><small>${h.time}</small></div></div>`).join('')}</div></aside></div><div class="section-head"><h2>Сімейний фокус</h2></div><div class="focus-grid"><article class="focus-card"><span>🎯</span><div><strong>Головна ціль тижня</strong><p>Закрити 8 спільних справ і зробити внесок у сімейну ціль.</p></div></article><article class="focus-card"><span>🤝</span><div><strong>Командна активність</strong><p>${state.users.length} учасники · ${state.quests.filter(q=>q.status==='active').length} активних квестів.</p></div></article></div>`,`Привіт, ${u.name} ✨`,`У вас ${active.length} активних квестів і нові можливості в магазині.`);
  }

  function questCard(q){
    const user=currentUser(); const joined=q.claimedBy.includes(user.id); const full=q.claimedBy.length>=q.participants;
    const type={personal:'Особистий',coop:'Спільний',pair:'Тільки вдвох',limited:'Лімітований'}[q.type];
    return `<article class="quest"><span class="quest-icon">${q.icon}</span><div><h3>${q.title}</h3><div class="meta"><span>${q.description}</span><span class="tag ${q.type==='coop'||q.type==='pair'?'coop':''} ${q.limited?'limited':''}">${type}</span><span class="tag">${q.claimedBy.length}/${q.participants}</span></div></div><div class="quest-reward">+${q.rewardCoins} 🪙<small>+${q.rewardXp} XP · ${skillIcon(q.skill)} +${q.skillXp}</small><button class="btn small ${joined?'soft':'primary'}" data-quest="${q.id}" ${full&&!joined?'disabled':''}>${joined?'Завершити':'Взяти'}</button></div></article>`;
  }

  function questsScreen(){
    return shell(`<div class="section-head"><div><h2>Доступні завдання</h2><small class="meta">Бібліотека: ${format(state.contentLibrary?.counts?.uniqueQuests||state.quests.length)} унікальних · ${format(state.contentLibrary?.counts?.dailyTasks||0)} щоденних</small></div>${isAdmin()?'<button class=\"btn primary\" data-action=\"new-quest\">+ Новий квест</button>':''}</div><div class="tabs">${['all:Усі','personal:Особисті','coop:Спільні','pair:Для двох','limited:Лімітовані'].map((x,i)=>{const [k,l]=x.split(':');return `<button class="${i===0?'active':''}" data-filter="${k}">${l}</button>`}).join('')}</div><div class="quest-list" id="questList">${state.quests.filter(q=>q.status==='active').map(questCard).join('')}</div>`,`Квести`,`Беріть справи самостійно або проходьте їх разом.`);
  }

  function achievementCard(a,u=currentUser()){const unlocked=Boolean(u?.achievements?.includes(a.id))||Number(a.progress||0)>=Number(a.target||1);const progress=Math.min(100,Math.round((Number(a.progress||0)/Math.max(1,Number(a.target||1)))*100));return `<article class="achievement-card ${unlocked?'unlocked':'locked'}"><div class="achievement-icon">${achievementIconHtml(a)}</div><div><span class="rarity">${a.rarity||'Звичайна'}</span><h3>${a.title||'Досягнення'}</h3><p>${a.description||''}</p><div class="progress"><i style="width:${unlocked?100:progress}%"></i></div><small>${unlocked?'Відкрито':`${Number(a.progress||0)} / ${Number(a.target||1)}`}</small></div></article>`;}

  function unlockAchievement(u,id){if(!u||u.achievements.includes(id))return false;u.achievements.push(id);const a=state.achievements.find(x=>x.id===id);u.activity.unshift(`Отримано ачивку «${a?.title||id}»`);state.history.unshift({icon:a?.icon||'🏆',text:`${u.name} отримав(ла) «${a?.title||'нову ачивку'}»`,time:'Щойно'});if(u.id===state.currentUserId)queueAchievementToast(a||{id,icon:'🏆',title:id,rarity:'Звичайна'});return true;}
  function evaluateReferralAchievements(u){
    if(!u)return;const count=Number(u.stats?.invitedUsers||u.referrals?.length||0);const levels=[[1,'ref_first_friend'],[3,'ref_better_together'],[5,'ref_family_grows'],[10,'ref_big_family'],[20,'ref_home_for_all'],[50,'ref_people_connector'],[100,'ref_community_leader'],[250,'ref_community_legend']];
    for(const [need,id] of levels){const a=state.achievements.find(x=>x.id===id);if(a)a.progress=Math.max(Number(a.progress||0),count);if(count>=need)unlockAchievement(u,id);}
    const referred=state.users.filter(x=>x.invitedBy===u.id);const referralXp=referred.reduce((n,x)=>n+Number(x.xp||0),0);const bestStreak=referred.reduce((n,x)=>Math.max(n,Number(x.streak||0)),0);const referralGifts=(state.giftHistory||[]).filter(g=>referred.some(x=>x.id===g.fromId)&&referred.some(x=>x.id===g.toId)).length;
    u.stats.referralXp=referralXp;u.stats.referralGifts=referralGifts;
    if(referralXp>=1000000)unlockAchievement(u,'myth_infinity');if(bestStreak>=365)unlockAchievement(u,'myth_time_keeper');if(referralGifts>=500)unlockAchievement(u,'myth_heart_myhabbit');
    const nonAbsolute=state.achievements.filter(a=>a.id!=='myth_absolute'&&!a.catalog);if(nonAbsolute.length&&nonAbsolute.every(a=>u.achievements.includes(a.id)))unlockAchievement(u,'myth_absolute');
  }
  function achievementsScreen(){const u=currentUser();evaluateReferralAchievements(u);const list=state.achievements.filter(a=>!a.hidden||u.achievements.includes(a.id));return shell(`<div class="section-head"><div><h2>Колекція досягнень</h2><small class="meta">Відкрито ${u.achievements.length} · оберіть до трьох головних у профілі</small></div></div><div class="achievement-grid">${list.map(a=>achievementCard(a,u)).join('')}</div>`,`Ачивки`,`Особисті перемоги, реферальні відзнаки та міфічні вершини.`);}
  function referralStatsBlock(u){const refs=state.users.filter(x=>x.invitedBy===u.id),count=Number(u.stats?.invitedUsers||u.referrals?.length||0),active=refs.length,totalXp=refs.reduce((n,x)=>n+Number(x.xp||0),0),best=refs.reduce((n,x)=>Math.max(n,Number(x.streak||0)),0),gifts=(state.giftHistory||[]).filter(g=>refs.some(x=>x.id===g.fromId)&&refs.some(x=>x.id===g.toId)).length;return `<details class="cozy-fold referral-secret"><summary><span>🔐</span><strong>Моя прихована статистика запрошень</strong><small>лише для вас</small></summary><div class="fold-body referral-stats-grid"><div><small>Запрошено</small><strong>${count}</strong></div><div><small>Зараз у сімʼї</small><strong>${active}</strong></div><div><small>XP запрошених</small><strong>${format(totalXp)}</strong></div><div><small>Найкраща серія</small><strong>${best} 🔥</strong></div><div><small>Подарунки між ними</small><strong>${gifts}</strong></div></div></details>`;}

  function shopCard(item){
    const u=currentUser();const out=item.stock<=0;const fund=item.fund||0;const can=u.coins>=item.price;
    return `<article class="shop-card"><div class="shop-top"><span class="shop-icon">${item.icon}</span><span class="stock ${out?'out':''}">${out?'Закінчилось':`Залишилось: ${item.stock}`}</span></div><h3>${item.title}</h3><p>${item.description}</p>${item.type==='collective'?`<div class="progress"><i style="width:${Math.min(100,fund/item.price*100)}%"></i></div><small>${format(fund)} / ${format(item.price)} 🪙</small>`:`<div class="price">${format(item.price)} 🪙</div>`}<button class="btn ${item.type==='collective'?'soft':'primary'}" data-shop="${item.id}" ${out||(!can&&item.type!=='collective')?'disabled':''}>${item.type==='collective'?'Зробити внесок':'Придбати'}</button></article>`;
  }
  function shopScreen(){
    const u=currentUser();
    const boxes=state.stickerBoxes.map(b=>{const c=state.stickerCollections.find(x=>x.id===b.collectionId),season=seasonInfo(c.season);return `<article class="shop-card box-card ${season.active?'':'locked'}"><div class="box-visual">📦</div><span class="rarity">${season.active?'Активний бокс':'Сезон закритий'}</span><h3>${b.title}</h3><p>${c.title} · 1 випадковий стікер<br><small>${season.label}</small></p><div class="shop-bottom"><span class="price">${format(b.price)} 🪙</span><button class="btn primary small" data-open-box="${b.id}" ${season.active?'':'disabled'}>Відкрити</button></div></article>`}).join('');
    const real=state.shop.map(i=>{const resourceUrl=cleanResourceUrl(i.resourceUrl);return `<article class="shop-card"><div class="shop-top"><span class="shop-icon">${i.icon}</span><span class="stock ${i.stock?'':'out'}">${i.stock?`Залишок ${i.stock}`:'Немає'}</span></div><h3>${i.title}</h3><p>${i.description}</p>${resourceUrl?`<a class="shop-reference-link" href="${resourceUrl.replace(/&/g,'&amp;').replace(/"/g,'&quot;')}" target="_blank" rel="noopener noreferrer" aria-label="Відкрити приклад для ${String(i.title||'позиції').replace(/[<>&"]/g,'')}">↗ Подивитися, що мається на увазі</a>`:''}<div class="shop-bottom"><span class="price">${format(i.price)} 🪙</span><button class="btn primary small" data-buy="${i.id}" ${i.stock?'':'disabled'}>Обрати</button></div></article>`}).join('');
    return shell(`<div class="section-head"><h2>Стікер-бокси</h2><span class="tag">1 бокс = 1 стікер</span></div><div class="shop-grid">${boxes}</div><div class="section-head"><h2>Сімейні можливості</h2></div><div class="shop-grid">${real}</div>`,`Магазин`,`Відкривайте бокси, збирайте колекції та обирайте сімейні нагороди.`);
  }
  function collectionTheme(id){return {
    'cozy-cats':{icon:'🐱',tone:'peach',subtitle:'Теплі вечори й пухнасті історії'},
    'bunny-love':{icon:'🐰',tone:'rose',subtitle:'Ніжність, обійми та маленькі дива'},
    'christmas':{icon:'🎄',tone:'winter',subtitle:'Святкове світло й зимова магія'},
    'halloween':{icon:'🎃',tone:'night',subtitle:'Добрі привиди й чарівна ніч'},
    'easter':{icon:'🥚',tone:'spring',subtitle:'Весняні знахідки та сонячні сюрпризи'}
  }[id]||{icon:'✦',tone:'lavender',subtitle:'Особлива колекція myHabbit'};}
  function stickerGlyph(id){if(id.includes('cat'))return '🐱';if(id.includes('bunny'))return '🐰';if(id.includes('tree'))return '🎄';if(id.includes('cocoa')||id.includes('coffee')||id.includes('tea'))return '☕';if(id.includes('book'))return '📖';if(id.includes('sleep')||id.includes('moon'))return '🌙';if(id.includes('star')||id.includes('sun'))return '⭐';if(id.includes('crown'))return '👑';if(id.includes('flower'))return '🌸';if(id.includes('pumpkin'))return '🎃';if(id.includes('ghost'))return '👻';if(id.includes('egg'))return '🥚';if(id.includes('basket'))return '🧺';return '✨';}
  function collectionsScreen(){const u=currentUser();const html=state.stickerCollections.map(c=>{const season=seasonInfo(c.season),owned=c.stickers.filter(x=>stickerCount(u,x.id)>0).length,pct=Math.round(owned/c.stickers.length*100),theme=collectionTheme(c.id);return `<button class="collection-book-card tone-${theme.tone}" data-open-album="${c.id}"><span class="book-spine"></span><div class="book-emblem">${theme.icon}</div><span class="eyebrow">${season.active?'Доступна зараз':season.label}</span><h2>${c.title}</h2><p>${theme.subtitle}</p><div class="book-progress-row"><strong>${owned} / ${c.stickers.length}</strong><span>${pct}%</span></div><div class="progress"><i style="width:${pct}%"></i></div><small>Натисніть, щоб відкрити альбом</small></button>`}).join('');return shell(`<div class="collection-library">${html}</div>`,'Колекції','Невідомі стікери залишаються повністю прихованими до першого отримання.');}

  function albumMarkup(collectionId,highlightId=''){const u=currentUser(),c=state.stickerCollections.find(x=>x.id===collectionId);if(!c)return '';const theme=collectionTheme(c.id),owned=c.stickers.filter(x=>stickerCount(u,x.id)>0).length,pct=Math.round(owned/c.stickers.length*100);return `<div class="album-backdrop" data-album-root><div class="album-shell tone-${theme.tone}"><button class="album-close" data-close-album aria-label="Закрити">×</button><div class="album-cover-panel"><span class="album-cover-icon">${theme.icon}</span><span class="eyebrow">Колекційний альбом</span><h2>${c.title}</h2><p>${owned} / ${c.stickers.length} відкрито · ${pct}%</p><div class="progress"><i style="width:${pct}%"></i></div></div><div class="album-pages"><section class="album-page left-page"><div class="page-title"><strong>${c.title}</strong><small>Сторінка 1</small></div><div class="album-grid">${c.stickers.slice(0,Math.ceil(c.stickers.length/2)).map((x,i)=>albumCell(x,i,highlightId)).join('')}</div></section><section class="album-page right-page"><div class="page-title"><strong>Продовження</strong><small>Сторінка 2</small></div><div class="album-grid">${c.stickers.slice(Math.ceil(c.stickers.length/2)).map((x,i)=>albumCell(x,i+Math.ceil(c.stickers.length/2),highlightId)).join('')}</div></section></div></div></div>`;}
  function albumCell(sticker,index,highlightId){const count=stickerCount(currentUser(),sticker.id),owned=count>0;return `<article class="album-slot ${owned?'owned':'locked'} ${highlightId===sticker.id?'new-highlight':''}"><span class="slot-number">${String(index+1).padStart(2,'0')}</span><div class="slot-art">${owned?stickerGlyph(sticker.id):'<span class="slot-lock">?</span>'}</div>${owned?`<strong>${sticker.name}</strong><small>${rarityLabel(sticker.rarity)}${count>1?` · ×${count}`:''}</small>`:'<strong>Невідомо</strong><small>Відкриється після отримання</small>'}</article>`;}
  function openAlbum(collectionId,highlightId=''){document.querySelector('[data-album-root]')?.remove();document.body.insertAdjacentHTML('beforeend',albumMarkup(collectionId,highlightId));requestAnimationFrame(()=>document.querySelector('[data-album-root]')?.classList.add('open'));bindAlbum();}
  function bindAlbum(){document.querySelectorAll('[data-close-album]').forEach(x=>x.addEventListener('click',()=>x.closest('[data-album-root]')?.remove()));document.querySelector('[data-album-root]')?.addEventListener('click',e=>{if(e.target.matches('[data-album-root]'))e.currentTarget.remove();});}
  function revealMarkup(sticker,c,isNew,dust=0){return `<div class="sticker-reveal-backdrop rarity-${sticker.rarity}" data-reveal-root><div class="reveal-stage"><div class="reveal-box">📦</div><div class="reveal-card"><div class="reveal-card-inner"><div class="reveal-card-back">✦</div><div class="reveal-card-front"><span class="reveal-rarity">${rarityLabel(sticker.rarity)}</span><div class="reveal-art">${stickerGlyph(sticker.id)}</div><h2>${sticker.name}</h2><p>${c.title}</p>${isNew?'<strong class="new-ribbon">NEW!</strong>':`<strong class="duplicate-ribbon">Дублікат · +${dust} пилу</strong>`}</div></div></div><button class="btn primary reveal-continue" data-reveal-continue data-collection="${c.id}" data-sticker="${sticker.id}">${isNew?'Показати в альбомі':'Продовжити'}</button></div></div>`;}
  function showStickerReveal(sticker,c,isNew,dust=0){document.body.insertAdjacentHTML('beforeend',revealMarkup(sticker,c,isNew,dust));const root=document.querySelector('[data-reveal-root]');requestAnimationFrame(()=>root?.classList.add('play'));root?.querySelector('[data-reveal-continue]')?.addEventListener('click',e=>{root.remove();if(isNew)openAlbum(e.currentTarget.dataset.collection,e.currentTarget.dataset.sticker);});}

  function displayName(u){const effect=cosmetic(u.equipped?.nicknameEffect);return `<span class="animated-name nick-${effect?.asset||'none'}">${(u.name||'').replace(/[<>&]/g,'')}</span>`;}
  function memberCard(u){const af=cosmetic(u.equipped?.animatedFrame);return `<button type="button" class="member member-button cozy-member animated-frame-${af?.asset||'none'}" data-member="${u.id}"><div class="member-head"><div class="member-initial" aria-hidden="true">${(u.name||'?').trim().slice(0,1).toUpperCase()}</div><div><h3 style="margin:0">${displayName(u)} ${u.role==='admin'?'<span class="admin-badge">Берегиня простору</span>':''}</h3><small>${u.level} сходинка · ${u.streak} днів у ритмі</small></div><span class="telegram-dot ${u.telegramLinked?'linked':''}" title="${u.telegramLinked?'Telegram поруч':'Telegram ще не підключено'}">✈</span></div><span class="view-profile">Зазирнути в профіль →</span></button>`}
  function museumScreen(){
    const u=currentUser();
    const allStickers=(state.stickerCollections||[]).flatMap(c=>c.stickers.map(st=>({...st,collectionTitle:c.title,collectionId:c.id})));
    const ownedStickers=allStickers.filter(st=>stickerCount(u,st.id)>0);
    const ownedCosmetics=(u.inventory||[]).map(cosmetic).filter(Boolean);
    const completed=(state.stickerCollections||[]).filter(c=>c.stickers.every(st=>stickerCount(u,st.id)>0)).length;
    const achievements=(u.achievements||[]).map(id=>state.achievements.find(a=>a.id===id)).filter(Boolean);
    const giftOptions=[];
    for(const st of ownedStickers){giftOptions.push(`<option value="sticker:${st.id}">🎴 ${escapeHtml(st.name)} (${stickerCount(u,st.id)} шт.)</option>`)}
    for(const item of ownedCosmetics){giftOptions.push(`<option value="cosmetic:${item.id}">✨ ${escapeHtml(item.title)}</option>`)}
    const recipients=state.users.filter(x=>x.id!==u.id).map(x=>`<option value="${x.id}">${escapeHtml(x.name)}</option>`).join('');
    const history=(state.giftHistory||[]).slice().reverse().map(g=>`<article class="museum-history-row"><span>${g.icon||'🎁'}</span><div><strong>${escapeHtml(g.title)}</strong><small>${escapeHtml(g.fromName)} → ${escapeHtml(g.toName)} · ${new Date(g.createdAt).toLocaleDateString('uk-UA')}</small>${g.note?`<p>${escapeHtml(g.note)}</p>`:''}</div></article>`).join('')||'<div class="empty-soft">Подарунків ще не було.</div>';
    return shell(`<section class="museum-hero"><div><span class="eyebrow">Особиста скарбниця</span><h2>Музей ${escapeHtml(u.name)}</h2><p>Тут назавжди зберігаються колекції, косметика, ачивки та історія подарунків.</p></div><div class="museum-seal">🏛️</div></section>
    <div class="grid metrics museum-metrics"><div class="card"><div class="metric-label">Стікери</div><div class="metric-value">${ownedStickers.length}/${allStickers.length}</div></div><div class="card"><div class="metric-label">Повні колекції</div><div class="metric-value">${completed}</div></div><div class="card"><div class="metric-label">Косметика</div><div class="metric-value">${ownedCosmetics.length}</div></div><div class="card"><div class="metric-label">Ачивки</div><div class="metric-value">${achievements.length}</div></div></div>
    <div class="museum-grid"><section class="card museum-section"><div class="section-head"><h2>Відкриті стікери</h2><small>${ownedStickers.length}</small></div><div class="museum-sticker-grid">${ownedStickers.length?ownedStickers.map(st=>`<article class="museum-sticker rarity-${st.rarity}"><div>${stickerVisual(st)}</div><strong>${escapeHtml(st.name)}</strong><small>${escapeHtml(st.collectionTitle)}</small></article>`).join(''):'<div class="empty-soft">Перші стікери ще чекають на відкриття.</div>'}</div></section>
    <section class="card museum-section"><div class="section-head"><h2>Косметика</h2><small>${ownedCosmetics.length}</small></div><div class="museum-cosmetics">${ownedCosmetics.length?ownedCosmetics.map(x=>`<article><span>${x.kind==='animatedFrame'?'🖼️':x.kind==='nicknameEffect'?'🌈':'✨'}</span><div><strong>${escapeHtml(x.title)}</strong><small>${escapeHtml(x.rarity||'')}</small></div></article>`).join(''):'<div class="empty-soft">Косметика зʼявиться після отримання нагород.</div>'}</div></section></div>
    <section class="card gift-station"><div class="section-head"><div><h2>Подарувати назавжди</h2><small>Стікери та косметика переходять іншому учаснику</small></div></div>${recipients&&giftOptions.length?`<div class="gift-form"><select id="museumGiftRecipient">${recipients}</select><select id="museumGiftItem">${giftOptions.join('')}</select><input id="museumGiftNote" maxlength="120" placeholder="Коротка листівка, до 120 символів"><button class="btn primary" data-action="send-museum-gift">Подарувати 🎁</button></div>`:'<div class="empty-soft">Потрібен інший учасник і хоча б один доступний предмет.</div>'}</section>
    <section class="card museum-section"><div class="section-head"><h2>Історія подарунків</h2><small>зберігається назавжди</small></div><div class="museum-history">${history}</div></section>`,`Музей`,`Ваші відкриття, рідкісні предмети та теплі подарунки в одному місці.`);
  }

  function sendMuseumGift(){
    const from=currentUser(),toId=document.getElementById('museumGiftRecipient')?.value,itemValue=document.getElementById('museumGiftItem')?.value,note=(document.getElementById('museumGiftNote')?.value||'').trim().slice(0,120),to=state.users.find(x=>x.id===toId);
    if(!from||!to||!itemValue)return showToast('Оберіть отримувача і подарунок');
    const [kind,id]=itemValue.split(':');let title='',icon='🎁';
    if(kind==='sticker'){
      if(stickerCount(from,id)<1)return showToast('Цього стікера вже немає');
      from.stickerInventory[id]-=1;if(from.stickerInventory[id]<=0)delete from.stickerInventory[id];to.stickerInventory[id]=stickerCount(to,id)+1;title=stickerName(id);icon='🎴';from.stats.stickersGiven=(from.stats.stickersGiven||0)+1;
    }else if(kind==='cosmetic'){
      const index=(from.inventory||[]).indexOf(id);if(index<0)return showToast('Цієї косметики вже немає');
      from.inventory.splice(index,1);if(!to.inventory.includes(id))to.inventory.push(id);const item=cosmetic(id);title=item?.title||id;icon='✨';
      for(const key of ['badge','frame','animatedFrame','nicknameEffect','theme'])if(from.equipped?.[key]===id)from.equipped[key]=key==='theme'?'light':null;
    }else return;
    const gift={id:`gift_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,fromId:from.id,toId:to.id,fromName:from.name,toName:to.name,kind,itemId:id,title,note,icon,createdAt:new Date().toISOString()};
    state.giftHistory.push(gift);to.receivedGifts.push(gift);to.activity.unshift(`Отримано подарунок «${title}» від ${from.name}`);from.activity.unshift(`Подаровано «${title}» для ${to.name}`);state.history.unshift({icon,text:`${from.name} подарував(ла) ${to.name} «${title}»`,time:'Щойно'});addXp(from,10,'подарунок');addXp(to,5,'отриманий подарунок');save();render();showToast(`Подарунок для ${to.name} надіслано`);
  }

  function profileScreen(userId=state.currentUserId){
    const u=state.users.find(x=>x.id===userId)||currentUser(),own=u.id===state.currentUserId;evaluateReferralAchievements(u);const skills=Object.entries(u.skills||{}),achievements=state.achievements.filter(a=>u.achievements.includes(a.id)),badge=cosmetic(u.equipped?.badge),frame=u.equipped?.frame||'',animatedFrame=cosmetic(u.equipped?.animatedFrame),nickEffect=cosmetic(u.equipped?.nicknameEffect),stickers=state.profileStickers.filter(x=>x.to===u.id).slice(-10).reverse(),nextRewards=state.levelRewards.filter(r=>!u.claimedLevelRewards.includes(r.level)).slice(0,4);
    return shell(`<section class="card cozy-profile-head profile-frame-${frame} animated-frame-${animatedFrame?.asset||'none'}"><div class="profile-minimal"><div class="member-initial large">${cuteIcon('cat')}</div><div><div class="profile-level"><span class="animated-name nick-${nickEffect?.asset||'none'}">${escapeHtml(u.name)}</span> ${badge?cuteIcon(badge.asset.includes('bunny')?'bunny':'cat'):''}</div><div class="meta">${u.level} загальний рівень · ${format(u.xp)} / ${format(xpRequiredForLevel(u.level))} XP · ${format(u.coins)} 🪙</div><div class="profile-joined">${u.telegramUsername?'@'+escapeHtml(u.telegramUsername)+' · ':''}у myHabbit з ${romanDate(u.createdAt)}</div><div class="progress soft-progress"><i style="width:${xpPct(u)}%"></i></div></div>${own?'<div class="profile-actions"><button class="btn primary" data-action="invite">Запросити в сімʼю</button><button class="btn" data-action="edit-profile">Налаштувати</button><button class="btn soft" data-action="claim-level-rewards">Подарунки рівня</button></div>':'<button class="btn soft" data-action="leave-sticker" data-user-id="'+u.id+'">Залишити слід</button>'}</div></section>
    <section class="grid metrics minimal-stats"><div class="card"><div class="metric-label">Квести</div><div class="metric-value">${u.stats.questsCompleted||0}</div></div><div class="card"><div class="metric-label">Ранкові подарунки</div><div class="metric-value">${u.stats.giftsOpened||0}</div></div><div class="card"><div class="metric-label">Джекпоти</div><div class="metric-value">${u.stats.jackpots||0}</div></div><div class="card"><div class="metric-label">Стікери друзям</div><div class="metric-value">${u.stats.stickersGiven||0}</div></div></section>
    <div class="cozy-folds">${own?referralStatsBlock(u):''}${importantDatesBlock(u,own)}<details class="cozy-fold"><summary>${cuteIcon('leaf')}<strong>Мої барви</strong><small>${skills.length}</small></summary><div class="fold-body skill-list">${skills.map(([k,v])=>`<div class="skill-row cozy-skill"><span class="skill-icon">${cuteIcon('sparkle')}</span><div><div class="skill-name"><strong>${skillLabel(k)}</strong><span>${v}</span></div><div class="progress"><i style="width:${Math.min(100,(v%10)*10)}%"></i></div></div></div>`).join('')}</div></details><details class="cozy-fold"><summary>${cuteIcon('trophy')}<strong>Мої знахідки</strong><small>${achievements.length}</small></summary><div class="fold-body achievement-grid compact-achievements">${achievements.map(a=>achievementCard(a,u)).join('')}</div></details></div>`,own?'Мій затишний куточок':`${escapeHtml(u.name)} · профіль`,own?'Загальний рівень, запрошення та маленькі перемоги.':'Профіль близької людини.');
  }

  function familyScreen(){const visibleUsers=visibleFamilyUsers();return shell(`<section class="card"><div class="profile-hero"><span class="avatar">✨</span><div><div class="profile-level">${state.family.name}</div><div class="meta">Код сімʼї: <strong>${state.family.code}</strong> · ${visibleUsers.length}/5 учасників</div><div class="progress" style="margin-top:10px"><i style="width:${state.family.xp%1000/10}%"></i></div></div><div class="profile-actions"><button class="btn primary" data-action="invite">Запросити</button><button class="btn danger" data-action="leave-family">Вийти із сімʼї</button></div></div></section><div class="section-head"><h2>Наші люди</h2></div><div class="member-grid">${visibleUsers.map(memberCard).join('')||'<div class="card empty">У видимому списку поки немає учасників</div>'}</div><div class="section-head"><h2>Telegram-зв’язок</h2></div><div class="card telegram-panel"><div><strong>Бот myHabbit</strong><p>Відкривайте Mini App із Telegram, отримуйте нагадування та швидко переходьте до сімейних справ.</p></div><button class="btn primary" data-action="telegram-connect">Підключити Telegram</button></div><div class="section-head"><h2>Сімейна активність</h2></div><div class="card">${state.history.map(h=>`<div class="activity"><span class="activity-icon">${h.icon}</span><div><p>${h.text}</p><small>${h.time}</small></div></div>`).join('')}</div>`,`Сімʼя`,`Спільний прогрес без публічних рейтингів і сторонніх людей.`)}

  function adminMemberRow(u){
    const roleLabel=u.role==='owner'?'Власник':u.role==='admin'?'Адміністратор':'Учасник';
    const privacy=u.role==='admin'||u.role==='owner'?`<button class="btn small soft" data-toggle-admin-hidden="${u.id}">${u.hiddenFromFamily?'Показати в сімʼї':'Сховати із сімʼї'}</button>`:'';
    const action=u.id!==state.currentUserId&&u.role!=='owner'
      ? `<button class="btn danger small" data-kick-user="${u.id}">Виключити</button>`
      : `<span class="tag">${u.id===state.currentUserId?'Це ви':'Захищено'}</span>`;
    return `<article class="admin-row"><span class="avatar">${u.avatar}</span><div><strong>${u.name}</strong><small>${format(u.coins)} 🪙 · ${roleLabel}${u.hiddenFromFamily?' · приховано':''}</small></div><div class="admin-actions">${privacy}${action}</div></article>`;
  }

  function adminScreen(){
    if(!isAdmin()) return shell('<div class="card empty">Цей розділ доступний лише адміністратору сімʼї.</div>','Куточок господаря','Керування сімейним простором.');
    const active=state.quests.filter(q=>q.status==='active').length;
    const lowStock=state.shop.filter(x=>x.stock<=1).length;
    return shell(`<section class="admin-hero"><div><span class="eyebrow">Центр керування</span><h2>Налаштування нашого простору</h2><p>Завдання, магазин, учасники й Telegram — в одному спокійному інтерфейсі.</p></div><button class="btn primary" data-action="telegram-refresh">Перевірити Telegram</button></section><section class="card sync-panel"><div><span class="eyebrow">Local-first синхронізація</span><h2>Оновлення сімейної статистики</h2><p>Дані зберігаються на пристроях. Автоматичне серверне оновлення виконується після 09:00, а адміністратор може запустити його вручну.</p><div class="sync-meta"><span>Очікують: <strong id="pendingSyncCount">…</strong> пакетів</span><span>Учасників: <strong id="pendingSyncUsers">…</strong></span><span>Останнє: <strong id="lastSyncAt">…</strong></span></div></div><button class="btn primary" data-action="admin-process-now">Оновити дані зараз</button></section><section class="grid metrics"><div class="card"><div class="metric-label">Активні квести</div><div class="metric-value">${active}</div><div class="metric-foot">${state.quests.length-active} завершено</div></div><div class="card"><div class="metric-label">Асортимент</div><div class="metric-value">${state.shop.length}</div><div class="metric-foot">${lowStock} позиції закінчуються</div></div><div class="card"><div class="metric-label">Наші люди</div><div class="metric-value">${visibleFamilyUsers().length}/5</div><div class="metric-foot">${state.users.filter(u=>u.telegramLinked).length} з Telegram · ${state.users.filter(u=>u.hiddenFromFamily).length} приховано</div></div><div class="card"><div class="metric-label">Сімейний фонд</div><div class="metric-value">${format(state.family.coins)} 🪙</div><div class="metric-foot">Спільний баланс</div></div></section><div class="admin-grid"><section><div class="section-head"><h2>Наші пригоди</h2><button class="btn primary small" data-action="new-quest">+ Додати</button></div><div class="admin-list">${state.quests.map(q=>`<article class="admin-row"><span class="quest-icon">${q.icon}</span><div><strong>${q.title}</strong><small>${q.status==='active'?'Активне':'Завершене'} · ${q.rewardCoins} 🪙 · ${q.rewardXp} XP</small></div><div class="admin-actions"><button class="btn small soft" data-admin-toggle-quest="${q.id}">${q.status==='active'?'Пауза':'Активувати'}</button><button class="icon-btn danger-text" data-admin-delete-quest="${q.id}" aria-label="Видалити">×</button></div></article>`).join('')}</div></section><section><div class="section-head"><h2>Асортимент магазину</h2><button class="btn primary small" data-action="new-shop">+ Додати</button></div><div class="admin-list">${state.shop.map(i=>`<article class="admin-row"><span class="shop-icon">${i.icon}</span><div><strong>${i.title}</strong><small>${format(i.price)} 🪙 · залишок ${i.stock}${cleanResourceUrl(i.resourceUrl)?' · є приховане посилання':''}</small></div><div class="stock-stepper"><button data-stock="${i.id}" data-delta="-1">−</button><strong>${i.stock}</strong><button data-stock="${i.id}" data-delta="1">+</button></div><button class="icon-btn danger-text" data-admin-delete-shop="${i.id}" aria-label="Видалити">×</button></article>`).join('')}</div></section></div><div class="section-head"><h2>Керування учасниками</h2><button class="btn primary small" data-action="grant-coins">Видати монетки</button></div><section class="card"><div class="admin-list">${state.users.map(adminMemberRow).join('')}</div></section><div class="section-head"><h2>Новий початок профілю</h2></div><section class="card danger-zone"><div><strong>Подарувати профілю новий початок</strong><p>Скидає XP, монети, серію, навички, досягнення, локальні пакети та Telegram-прив’язку. Потрібен сімейний PIN.</p></div><div class="admin-list">${state.users.map(u=>`<article class="admin-row"><span class="avatar">${u.avatar}</span><div><strong>${u.name}</strong><small>${u.level} рівень · ${u.telegramLinked?'Telegram підключено':'без Telegram'}</small></div><button class="btn danger small" data-reset-user="${u.id}">Скинути</button></article>`).join('')}</div></section>`,`Куточок господаря`,`Контролюйте контент, асортимент і стан сімейного простору.`);
  }

  function modal(type){
    if(type==='invite') return `<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h2>Тепле запрошення</h2><button class="close" data-close>×</button></div><p>Створіть своє персональне реферальне посилання. Коли людина приєднається, запрошення буде зараховано вам і може відкрити ачивку.</p><div class="form-grid"><div class="field"><label>Скільки діє</label><select id="inviteTtl"><option value="24">24 години</option><option value="72">3 дні</option><option value="168">7 днів</option></select></div><div class="field"><label>Кількість входів</label><select id="inviteUses"><option value="1">Одна людина</option><option value="2">Дві людини</option><option value="4">До чотирьох</option></select></div><div class="field full"><label>Посилання</label><input id="inviteLink" readonly placeholder="Натисніть «Створити»"></div></div><div class="modal-actions"><button class="btn" data-action="copy-invite">Копіювати</button><button class="btn soft" data-action="share-invite">Поділитися</button><button class="btn primary" data-action="create-invite">Створити посилання</button></div></div></div>`;
    if(type==='switch-user') return `<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h2>Оберіть профіль</h2><button class="close" data-close>×</button></div><div class="member-grid" style="grid-template-columns:1fr;margin-top:18px">${state.users.map(u=>`<button class="member" data-select-user="${u.id}" style="text-align:left"><div class="member-head"><span class="avatar">${u.avatar}</span><div><strong>${u.name}</strong><small>${u.level} рівень · ${format(u.coins)} 🪙</small></div></div></button>`).join('')}</div></div></div>`;
    if(type==='new-quest') return `<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h2>Новий квест</h2><button class="close" data-close>×</button></div><div class="form-grid"><div class="field full"><label>Назва</label><input id="qTitle" placeholder="Наприклад, Прибрати кухню"></div><div class="field"><label>Тип</label><select id="qType"><option value="personal">Особистий</option><option value="coop">Спільний</option><option value="pair">Тільки вдвох</option><option value="limited">Лімітований</option></select></div><div class="field"><label>Навичка</label><select id="qSkill"><option value="home">Дім</option><option value="care">Турбота</option><option value="health">Здоровʼя</option><option value="growth">Розвиток</option><option value="finance">Фінанси</option></select></div><div class="field"><label>Монети</label><input id="qCoins" type="number" value="100"></div><div class="field"><label>XP</label><input id="qXp" type="number" value="80"></div><div class="field full"><label>Опис</label><textarea id="qDesc"></textarea></div></div><div class="modal-actions"><button class="btn" data-close>Скасувати</button><button class="btn primary" data-action="save-quest">Створити</button></div></div></div>`;
    if(type==='new-shop') return `<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h2>Нова можливість</h2><button class="close" data-close>×</button></div><div class="form-grid"><div class="field full"><label>Назва</label><input id="sTitle" placeholder="Наприклад, Новий велосипед"></div><div class="field"><label>Тип</label><select id="sType"><option value="personal">Особиста</option><option value="family">Для всієї сімʼї</option><option value="collective">Спільний фонд</option></select></div><div class="field"><label>Ціна</label><input id="sPrice" type="number" value="2000"></div><div class="field"><label>Кількість</label><input id="sStock" type="number" value="1"></div><div class="field full"><label>Опис</label><textarea id="sDesc"></textarea></div><div class="field full"><label>Приховане посилання на приклад <small>(необов’язково)</small></label><input id="sResourceUrl" type="url" inputmode="url" placeholder="https://…"><small>У магазині URL не показується — людина бачить лише кнопку «Подивитися, що мається на увазі».</small></div></div><div class="modal-actions"><button class="btn" data-close>Скасувати</button><button class="btn primary" data-action="save-shop">Додати</button></div></div></div>`;

    if(type==='accounts') { const list=loadAccounts(); return `<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h2>Мої профілі</h2><button class="close" data-close>×</button></div><p>Тримайте кілька профілів у цьому PWA або перенесіть захищену копію на інший пристрій.</p><div class="account-vault">${list.length?list.map(a=>`<button class="account-vault-item ${a.id===accountId()?'active':''}" data-account-id="${a.id}"><span class="member-initial">${(a.label||'?').slice(0,1).toUpperCase()}</span><span><strong>${a.label}</strong><small>${a.familyName||'Мій простір'} · ${new Date(a.updatedAt).toLocaleDateString('uk-UA')}</small></span><b>${a.id===accountId()?'Відкрито':'Перейти'}</b></button>`).join(''):'<div class="card empty">Збережених профілів поки немає</div>'}</div><div class="field"><label>Пароль для перенесення</label><input id="transferPassword" type="password" minlength="6" placeholder="Не менше 6 символів"></div><input id="accountImportFile" type="file" accept="application/json,.json" hidden><div class="modal-actions wrap"><button class="btn" data-action="add-account">+ Додати профіль</button><button class="btn" data-action="import-account">Відкрити JSON</button><button class="btn primary" data-action="export-account">Зберегти JSON</button></div><p class="auth-help">JSON містить сесію лише у зашифрованому вигляді. Не передавайте файл і пароль разом.</p></div></div>`; }

    if(type?.startsWith('sticker:')){const to=type.split(':')[1],u=currentUser(),owned=state.stickerCollections.flatMap(c=>c.stickers).filter(x=>stickerCount(u,x.id)>0);return `<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h2>Залишити теплий слід</h2><button class="close" data-close>×</button></div><p>Вартість одного теплого сліду — <strong>50 монет</strong>. Можна використати лише стікер із власної колекції.</p><div class="field"><label>Коротка записка</label><input id="stickerNote" maxlength="120" placeholder="Теплі слова…"></div><div class="sticker-picker">${owned.length?owned.map(x=>`<button data-send-sticker="${x.id}" data-to="${to}"><span>✦</span><span>${x.name}</span><small>50 🪙</small></button>`).join(''):'<div class="empty-soft">Спочатку відкрийте стікер у боксі.</div>'}</div></div></div>`;}

    if(type==='edit-profile') { const u=currentUser(); const owned=(state.cosmeticsCatalog||[]).filter(i=>u.inventory.includes(i.id)); const opts=(kind,current)=>`<option value="">Без прикраси</option>${owned.filter(i=>i.kind===kind).map(i=>`<option value="${i.id}" ${current===i.id?'selected':''}>${i.title}</option>`).join('')}`; return `<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h2>Оформлення профілю</h2><button class="close" data-close>×</button></div><div class="cosmetic-preview animated-frame-${cosmetic(u.equipped.animatedFrame)?.asset||'none'}"><span class="animated-name nick-${cosmetic(u.equipped.nicknameEffect)?.asset||'none'}">${u.name}</span><small>Попередній вигляд</small></div><div class="form-grid"><div class="field"><label>Значок біля імені</label><select id="profileBadge">${opts('badge',u.equipped.badge)}</select></div><div class="field"><label>Звичайна рамка</label><select id="profileFrame">${opts('frame',u.equipped.frame)}</select></div><div class="field"><label>Анімована рамка</label><select id="profileAnimatedFrame">${opts('animatedFrame',u.equipped.animatedFrame)}</select></div><div class="field"><label>Анімація нікнейму</label><select id="profileNicknameEffect">${opts('nicknameEffect',u.equipped.nicknameEffect)}</select></div><div class="field full"><label>Тема застосунку</label><select id="profileTheme"><option value="light" ${u.equipped.theme==='light'?'selected':''}>Світла</option>${owned.filter(i=>i.kind==='theme').map(i=>`<option value="${i.asset}" ${u.equipped.theme===i.asset?'selected':''}>${i.title}</option>`).join('')}</select></div></div><p class="auth-help">Одночасно активна одна анімована рамка та один ефект нікнейму. Системне зменшення руху підтримується автоматично.</p><div class="modal-actions"><button class="btn" data-close>Скасувати</button><button class="btn primary" data-action="save-profile-settings">Зберегти</button></div></div></div>`; }

    if(type==='daily-roulette') return `<div class="modal-backdrop daily-gift-backdrop"><div class="modal daily-gift-modal"><div class="daily-gift-head"><span>Щоденний сюрприз</span><small>Один оберт на день</small></div><div class="roulette-wrap"><div class="roulette-pointer">▼</div><div id="dailyRouletteWheel" class="roulette-wheel"><div class="roulette-label r1">+5</div><div class="roulette-label r2">+10</div><div class="roulette-label r3">+50</div><div class="roulette-label r4">+100</div><div class="roulette-label r5">+500</div></div><div class="roulette-hub">✦</div></div><h2 id="rouletteTitle">Крути колесо удачі</h2><p id="rouletteText">На тебе вже чекає маленький подарунок 🌿</p><div class="modal-actions"><button id="rouletteSpinButton" class="btn primary roulette-spin" data-action="spin-daily-roulette">Крутити рулетку</button></div><div class="roulette-odds"><span>+5 · 62%</span><span>+10 · 25%</span><span>+50 · 10%</span><span>+100 · 2,5%</span><span>+500 · 0,5%</span></div></div></div>`;

    if(type==='leave-family') return `<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h2>Вийти із сімʼї?</h2><button class="close" data-close>×</button></div><p>Ваш профіль буде від’єднано від цієї сімʼї. Пароль або PIN не потрібні. Локальну копію цього профілю буде прибрано з поточного PWA.</p><div class="modal-actions"><button class="btn" data-close>Залишитися</button><button class="btn danger" data-action="confirm-leave-family">Вийти</button></div></div></div>`;
    if(type?.startsWith('kick-user:')) { const userId=type.split(':')[1]; const u=state.users.find(x=>x.id===userId); return `<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h2>Виключити ${u?.name||'учасника'}?</h2><button class="close" data-close>×</button></div><p>Учасник втратить доступ до цієї сімʼї на всіх пристроях. Його поточні сімейні сесії буде анульовано.</p><div class="modal-actions"><button class="btn" data-close>Скасувати</button><button class="btn danger" data-action="confirm-kick-user" data-user-id="${userId}">Виключити</button></div></div></div>`; }
    if(type==='grant-coins') return `<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h2>Видати монетки</h2><button class="close" data-close>×</button></div><p>Оберіть учасника та введіть довільну додатну суму.</p><div class="form-grid"><div class="field full"><label>Кому</label><select id="grantCoinsUser">${state.users.map(u=>`<option value="${u.id}">${u.name} · ${format(u.coins)} 🪙</option>`).join('')}</select></div><div class="field full"><label>Сума</label><input id="grantCoinsAmount" type="number" inputmode="numeric" min="1" max="1000000" step="1" placeholder="Наприклад, 250"></div></div><div class="modal-actions"><button class="btn" data-close>Скасувати</button><button class="btn primary" data-action="confirm-grant-coins">Видати</button></div></div></div>`;

    if(type==='important-dates'){const u=currentUser(),items=[...(u?.importantDates||[])].sort((a,b)=>importantDateOrder(a)-importantDateOrder(b));return `<div class="modal-backdrop"><div class="modal important-dates-modal"><div class="modal-head"><h2>Важливі дати</h2><button class="close" data-close>×</button></div><p>Додайте дати, які побачать люди у вашому профілі. Рік не показується.</p><div class="important-date-form"><div class="field"><label>День</label><input id="importantDateDay" type="number" inputmode="numeric" min="1" max="31" placeholder="14"></div><div class="field"><label>Місяць</label><input id="importantDateMonth" type="number" inputmode="numeric" min="1" max="12" placeholder="02"></div><div class="field full"><label>Назва</label><input id="importantDateTitle" maxlength="48" placeholder="Наш особливий день"></div></div><button class="btn primary" style="width:100%" data-action="add-important-date">Додати дату</button><div class="important-date-editor">${items.length?items.map(x=>`<article class="important-date-edit-row"><time>${normalDate(x.day,x.month)}</time><span>${escapeHtml(x.title)}</span><button class="close small" data-delete-important-date="${x.id}" aria-label="Видалити">×</button></article>`).join(''):'<div class="empty-soft">Список поки порожній.</div>'}</div></div></div>`;}

    if(type==='reset-session') return `<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h2>Скинути поточну сесію</h2><button class="close" data-close>×</button></div><p>Це від’єднає Telegram, анулює стару сесію та очистить локальні дані цього пристрою. Після цього потрібно буде підключитися заново.</p><div class="field"><label>Сімейний PIN</label><input id="resetSessionPin" type="password" inputmode="numeric" maxlength="8" placeholder="Введіть PIN"></div><div class="modal-actions"><button class="btn" data-close>Скасувати</button><button class="btn danger" data-action="confirm-reset-session">Почати вхід заново</button></div></div></div>`;
    if(type?.startsWith('reset-user:')) { const userId=type.split(':')[1]; const u=state.users.find(x=>x.id===userId); return `<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h2>Скинути ${u?.name||'користувача'}?</h2><button class="close" data-close>×</button></div><p>Прогрес буде обнулено, Telegram від’єднано, а всі старі сесії цього користувача стануть недійсними.</p><div class="field"><label>Сімейний PIN</label><input id="resetUserPin" type="password" inputmode="numeric" maxlength="8" placeholder="Введіть PIN"></div><div class="field"><label>Підтвердження</label><input id="resetConfirmText" autocomplete="off" placeholder="Напишіть СКИНУТИ"></div><div class="modal-actions"><button class="btn" data-close>Скасувати</button><button class="btn danger" data-action="confirm-reset-user" data-user-id="${userId}">Скинути назавжди</button></div></div></div>`; }
    return '';
  }

  function render(){
    normalizeState();
    const screens={landing,auth:authScreen,dashboard,quests:questsScreen,shop:shopScreen,collections:collectionsScreen,museum:museumScreen,achievements:achievementsScreen,family:familyScreen,profile:()=>profileScreen(),admin:adminScreen};
    try{
      app.innerHTML=(screens[route]||landing)(); applyTheme(); bind(); if(route==='admin')setTimeout(refreshAdminSyncStatus,0);
    }catch(error){
      console.error('Render error:',error);
      app.innerHTML=`<main class="fatal-card"><h1>Не вдалося відкрити розділ</h1><p>${String(error?.message||error)}</p><button class="btn primary" data-route="dashboard">На головну</button></main>`;
      bind();
    }
  }

  function bind(){
    document.querySelectorAll('[data-route]').forEach(el=>el.addEventListener('click',()=>{document.body.classList.remove('menu-open');go(el.dataset.route);}));
    document.querySelectorAll('[data-action]').forEach(el=>el.addEventListener('click',()=>action(el.dataset.action,el)));
    document.querySelectorAll('[data-quest]').forEach(el=>el.addEventListener('click',()=>handleQuest(el.dataset.quest)));
    document.querySelectorAll('[data-shop]').forEach(el=>el.addEventListener('click',()=>handleShop(el.dataset.shop)));
    document.querySelectorAll('[data-buy]').forEach(el=>el.addEventListener('click',()=>handleShop(el.dataset.buy)));
    document.querySelectorAll('[data-open-box]').forEach(el=>el.addEventListener('click',()=>openStickerBox(el.dataset.openBox)));
    document.querySelectorAll('[data-open-album]').forEach(el=>el.addEventListener('click',()=>openAlbum(el.dataset.openAlbum)));
    document.querySelectorAll('[data-cosmetic]').forEach(el=>el.addEventListener('click',()=>handleCosmetic(el.dataset.cosmetic)));
    document.querySelectorAll('[data-remove-sticker]').forEach(el=>el.addEventListener('click',()=>removeSticker(el.dataset.removeSticker)));
    document.querySelectorAll('[data-member]').forEach(el=>el.addEventListener('click',()=>{app.innerHTML=profileScreen(el.dataset.member);bind();scrollTo(0,0)}));
    document.querySelectorAll('[data-admin-toggle-quest]').forEach(el=>el.addEventListener('click',()=>{const q=state.quests.find(x=>x.id===el.dataset.adminToggleQuest);if(q){q.status=q.status==='active'?'paused':'active';save();render();}}));
    document.querySelectorAll('[data-admin-delete-quest]').forEach(el=>el.addEventListener('click',()=>{state.quests=state.quests.filter(x=>x.id!==el.dataset.adminDeleteQuest);save();render();showToast('Завдання видалено');}));
    document.querySelectorAll('[data-admin-delete-shop]').forEach(el=>el.addEventListener('click',()=>{state.shop=state.shop.filter(x=>x.id!==el.dataset.adminDeleteShop);save();render();showToast('Позицію видалено');}));
    document.querySelectorAll('[data-reset-user]').forEach(el=>el.addEventListener('click',()=>openResetUserDialog(el.dataset.resetUser)));
    document.querySelectorAll('[data-kick-user]').forEach(el=>el.addEventListener('click',()=>{document.body.insertAdjacentHTML('beforeend',modal(`kick-user:${el.dataset.kickUser}`));bindModal();}));
    document.querySelectorAll('[data-toggle-admin-hidden]').forEach(el=>el.addEventListener('click',()=>toggleAdminFamilyVisibility(el.dataset.toggleAdminHidden)));
    document.querySelectorAll('[data-stock]').forEach(el=>el.addEventListener('click',()=>{const i=state.shop.find(x=>x.id===el.dataset.stock);if(i){i.stock=Math.max(0,i.stock+Number(el.dataset.delta));save();render();}}));
    document.querySelectorAll('[data-filter]').forEach(el=>el.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(x=>x.classList.remove('active'));el.classList.add('active');const f=el.dataset.filter;document.getElementById('questList').innerHTML=state.quests.filter(q=>q.status==='active'&&(f==='all'||q.type===f)).map(questCard).join('');bind();}));
    document.querySelectorAll('[data-auth-tab]').forEach(el=>el.addEventListener('click',()=>{authMode=el.dataset.authTab;document.querySelectorAll('[data-auth-tab]').forEach(x=>x.classList.remove('active'));el.classList.add('active');document.getElementById('authForm').innerHTML=authForm(authMode);bind();}));
  }

  function action(name, el){
    if(name==='demo'){auth={demo:true};state=clone(seed);localStorage.setItem(AUTH,JSON.stringify(auth));localStorage.setItem(STORAGE,JSON.stringify(state));persistAccount();go('dashboard');}
    if(name==='exit-demo'){localStorage.removeItem(AUTH);localStorage.removeItem(STORAGE);auth=null;state=clone(seed);go('landing');showToast('Демо завершено');}
    if(name==='logout'){localStorage.removeItem(AUTH);localStorage.removeItem(STORAGE);localStorage.removeItem(ACTIVE_ACCOUNT);auth=null;state=clone(seed);go('landing');}
    if(['switch-user','new-quest','new-shop','accounts'].includes(name)){document.body.insertAdjacentHTML('beforeend',modal(name));bindModal();}
    if(name==='toggle-menu'){document.body.classList.toggle('menu-open');}
    if(name==='close-menu'){document.body.classList.remove('menu-open');}
    if(name==='telegram-connect') connectTelegram();
    if(name==='telegram-refresh') checkTelegram();
    if(name==='admin-process-now') adminProcessNow();
    if(name==='spin-daily-roulette') spinDailyRoulette();
    if(name==='claim-level-rewards') claimLevelRewards();
    if(name==='send-museum-gift') sendMuseumGift();
    if(name==='edit-profile'){document.body.insertAdjacentHTML('beforeend',modal('edit-profile'));bindModal();}
    if(name==='manage-important-dates'){document.body.insertAdjacentHTML('beforeend',modal('important-dates'));bindModal();}
    if(name==='add-important-date') addImportantDate();
    if(name==='leave-sticker') openStickerModal(el?.dataset.userId);
    if(name==='leave-family'){document.body.insertAdjacentHTML('beforeend',modal('leave-family'));bindModal();}
    if(name==='confirm-leave-family') leaveFamily();
    if(name==='grant-coins'){document.body.insertAdjacentHTML('beforeend',modal('grant-coins'));bindModal();}
    if(name==='confirm-grant-coins') grantCoins();
    if(name==='confirm-kick-user') kickUser(el?.dataset.userId);
    if(name==='reset-current-session') openResetSessionDialog();
    if(name==='confirm-reset-session') confirmResetSession();
    if(name==='confirm-reset-user') confirmResetUser(el?.dataset.userId);
    if(name==='invite'){document.body.insertAdjacentHTML('beforeend',modal('invite'));bindModal();}
    if(name==='create-invite') createInviteLink();
    if(name==='copy-invite') copyInviteLink();
    if(name==='share-invite') shareInviteLink();
    if(name==='submit-invite') submitInvite();
    if(name==='submit-auth') submitAuth(el?.dataset.mode || 'create');
    if(name==='save-quest') saveQuest();
    if(name==='save-shop') saveShop();
    if(name==='save-profile-settings') saveProfileSettings();
    if(name==='add-account'){document.querySelector('.modal-backdrop')?.remove();localStorage.removeItem(AUTH);localStorage.removeItem(STORAGE);localStorage.removeItem(ACTIVE_ACCOUNT);auth=null;state=clone(seed);go('auth');}
    if(name==='export-account') exportAccount();
    if(name==='import-account') document.getElementById('accountImportFile')?.click();
  }
  function bindModal(){
    document.querySelectorAll('[data-close]').forEach(x=>x.addEventListener('click',()=>x.closest('.modal-backdrop').remove()));
    document.querySelectorAll('[data-select-user]').forEach(x=>x.addEventListener('click',()=>{state.currentUserId=x.dataset.selectUser;save();document.querySelector('.modal-backdrop').remove();render();}));
    document.querySelectorAll('[data-account-id]').forEach(x=>x.addEventListener('click',()=>switchAccount(x.dataset.accountId)));
    const importFile=document.getElementById('accountImportFile'); if(importFile)importFile.addEventListener('change',e=>importAccountFile(e.target.files?.[0]));
    document.querySelectorAll('[data-send-sticker]').forEach(x=>x.addEventListener('click',()=>sendSticker(x.dataset.to,x.dataset.sendSticker)));
    document.querySelectorAll('[data-delete-important-date]').forEach(x=>x.addEventListener('click',()=>deleteImportantDate(x.dataset.deleteImportantDate)));
    document.querySelectorAll('.modal [data-action]').forEach(el=>el.addEventListener('click',()=>action(el.dataset.action,el)));
  }


  async function deriveTransferKey(password,salt){const base=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:180000,hash:'SHA-256'},base,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);}
  const b64=b=>btoa(String.fromCharCode(...new Uint8Array(b))); const unb64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
  async function exportAccount(){const password=document.getElementById('transferPassword')?.value||'';if(password.length<6)return showToast('Створіть пароль від 6 символів');persistAccount();const payload={format:'myHabbit-profile',version:1,exportedAt:new Date().toISOString(),account:loadAccounts().find(x=>x.id===accountId())};const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12));const key=await deriveTransferKey(password,salt);const encrypted=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,new TextEncoder().encode(JSON.stringify(payload)));const file={format:'myHabbit-encrypted-profile',version:1,kdf:'PBKDF2-SHA256',iterations:180000,salt:b64(salt),iv:b64(iv),data:b64(encrypted)};const blob=new Blob([JSON.stringify(file,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`myHabbit-${currentUser()?.name||'profile'}-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);showToast('Захищену копію створено');}
  async function importAccountFile(file){if(!file)return;const password=document.getElementById('transferPassword')?.value||'';if(password.length<6)return showToast('Спочатку введіть пароль файлу');try{const box=JSON.parse(await file.text());if(box.format!=='myHabbit-encrypted-profile')throw new Error('Це не файл профілю myHabbit');const key=await deriveTransferKey(password,unb64(box.salt));const clear=await crypto.subtle.decrypt({name:'AES-GCM',iv:unb64(box.iv)},key,unb64(box.data));const payload=JSON.parse(new TextDecoder().decode(clear));const item=payload.account;if(!item?.auth||!item?.state)throw new Error('Профіль пошкоджено');const list=loadAccounts();const i=list.findIndex(x=>x.id===item.id);if(i>=0)list[i]=item;else list.unshift(item);localStorage.setItem(ACCOUNTS,JSON.stringify(list.slice(0,10)));switchAccount(item.id);showToast('Профіль перенесено');}catch(e){showToast(e.name==='OperationError'?'Невірний пароль або пошкоджений файл':e.message);}}
  function switchAccount(id){persistAccount();const item=loadAccounts().find(x=>x.id===id);if(!item)return;auth=clone(item.auth);state=clone(item.state);normalizeState();localStorage.setItem(AUTH,JSON.stringify(auth));localStorage.setItem(STORAGE,JSON.stringify(state));localStorage.setItem(ACTIVE_ACCOUNT,id);document.querySelector('.modal-backdrop')?.remove();route='dashboard';history.replaceState({},'', '/?screen=dashboard');render();pullRemote().then(()=>render()).catch(()=>{});}

  function removeActiveAccountLocally(){
    const id=accountId();
    const remaining=loadAccounts().filter(a=>a.id!==id);
    localStorage.setItem(ACCOUNTS,JSON.stringify(remaining));
    localStorage.removeItem(AUTH); localStorage.removeItem(STORAGE); localStorage.removeItem(ACTIVE_ACCOUNT);
    auth=null; state=clone(seed);
  }
  async function leaveFamily(){
    try{
      await api('/api/family/leave',{method:'POST',body:'{}'});
      removeActiveAccountLocally();
      document.querySelector('.modal-backdrop')?.remove();
      route='landing'; history.replaceState({},'', '/'); render(); showToast('Ви вийшли із сімʼї');
    }catch(e){showToast(e.message);}
  }
  async function kickUser(userId){
    if(!userId)return;
    try{
      const data=await api('/api/admin/kick-user',{method:'POST',body:JSON.stringify({userId})});
      if(data.state){state=data.state;normalizeState();save();}
      document.querySelector('.modal-backdrop')?.remove(); render(); showToast('Учасника виключено');
    }catch(e){showToast(e.message);}
  }
  async function grantCoins(){
    const userId=document.getElementById('grantCoinsUser')?.value||'';
    const amount=Math.trunc(Number(document.getElementById('grantCoinsAmount')?.value||0));
    if(!userId||!Number.isFinite(amount)||amount<1||amount>1000000)return showToast('Введіть суму від 1 до 1 000 000');
    try{
      const data=await api('/api/admin/grant-coins',{method:'POST',body:JSON.stringify({userId,amount})});
      if(data.state){state=data.state;normalizeState();save();}
      document.querySelector('.modal-backdrop')?.remove(); render(); showToast(`Видано ${format(amount)} монеток`);
    }catch(e){showToast(e.message);}
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
    try{ const data=await api('/api/admin/reset-user',{method:'POST',body:JSON.stringify({userId,pin})}); if(data.resetSelf){await clearLocalAppData();location.replace(`/?reset=${Date.now()}`);return;} if(data.state){state=data.state;normalizeState();localStorage.setItem(STORAGE,JSON.stringify(state));} document.querySelector('.modal-backdrop')?.remove();render();showToast('Користувача скинуто. Старі сесії вимкнено.'); }catch(e){showToast(e.message);}
  }

  async function loadInviteInfo(){
    if(!inviteToken)return;
    try{inviteInfo=await api('/api/family/invite-info',{method:'POST',body:JSON.stringify({token:inviteToken})});render();}
    catch(e){inviteInfo={error:e.message};showToast(e.message);}
  }
  async function createInviteLink(){
    try{
      const ttlHours=Number(document.getElementById('inviteTtl')?.value||24);
      const maxUses=Number(document.getElementById('inviteUses')?.value||1);
      const data=await api('/api/family/invite',{method:'POST',body:JSON.stringify({ttlHours,maxUses})});
      const webLink=`${location.origin}/?invite=${encodeURIComponent(data.token)}&screen=auth`;
      const input=document.getElementById('inviteLink');if(input)input.value=webLink;
      showToast('Персональне запрошення готове 💌');
    }catch(e){showToast(e.message);}
  }
  async function copyInviteLink(){
    const value=document.getElementById('inviteLink')?.value;if(!value)return showToast('Спочатку створіть посилання');
    try{await navigator.clipboard.writeText(value);showToast('Посилання скопійовано');}catch{const input=document.getElementById('inviteLink');input?.select();document.execCommand('copy');showToast('Посилання скопійовано');}
  }
  async function shareInviteLink(){const value=document.getElementById('inviteLink')?.value;if(!value)return showToast('Спочатку створіть посилання');try{if(navigator.share)await navigator.share({title:'Запрошення в myHabbit',text:`Приєднуйся до сімʼї «${state.family.name}» у myHabbit`,url:value});else await copyInviteLink();}catch(e){if(e?.name!=='AbortError')showToast('Не вдалося поділитися');}}
  async function submitInvite(){
    const name=document.getElementById('memberName')?.value.trim();const gender=document.getElementById('memberGender')?.value||'neutral';
    if(!name)return showToast('Вкажіть імʼя');
    try{const data=await api('/api/family/invite-join',{method:'POST',body:JSON.stringify({token:inviteToken,name,gender,initData:telegramInitData})});auth={token:data.token,userId:data.userId};localStorage.setItem(AUTH,JSON.stringify(auth));state=data.state;normalizeState();localStorage.setItem(STORAGE,JSON.stringify(state));persistAccount();history.replaceState({},'', '/?screen=dashboard');route='dashboard';render();showToast('Ви вже разом ✨');}catch(e){showToast(e.message);}
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

  async function resumeTelegramSession(){try{const data=await api('/api/family/telegram-resume',{method:'POST',body:JSON.stringify({initData:telegramInitData})});if(!data?.token)return;auth={token:data.token,userId:data.userId};localStorage.setItem(AUTH,JSON.stringify(auth));state=data.state;normalizeState();localStorage.setItem(STORAGE,JSON.stringify(state));persistAccount();go('dashboard');showToast('Повернули ваш Telegram-профіль');}catch(e){console.info('Telegram resume:',e.message);}}

  async function submitAuth(mode){
    const familyValue=document.getElementById('familyValue').value.trim();const name=document.getElementById('memberName').value.trim();const pin=document.getElementById('familyPin').value.trim();const gender=document.getElementById('memberGender').value;
    if(!familyValue||!name||pin.length<4)return showToast('Заповніть поля та PIN');
    try{
      const endpoint = mode==='create' ? '/api/family/create' : (telegramInitData ? '/api/family/telegram-join' : '/api/family/join');
      const data=await api(endpoint,{method:'POST',body:JSON.stringify({familyName:mode==='create'?familyValue:undefined,code:mode==='join'?familyValue:undefined,pin,name,gender,initData:telegramInitData})});
      auth={token:data.token,userId:data.userId};localStorage.setItem(AUTH,JSON.stringify(auth));if(data.state)state=data.state;normalizeState();localStorage.setItem(STORAGE,JSON.stringify(state));persistAccount();go('dashboard');
    }catch(e){showToast(e.message+' — відкрито локальне демо');auth={demo:true};localStorage.setItem(AUTH,JSON.stringify(auth));go('dashboard');}
  }

  function handleQuest(id){
    const q=state.quests.find(x=>x.id===id),u=currentUser(); if(!q)return;
    if(!q.claimedBy.includes(u.id)){if(q.claimedBy.length>=q.participants)return; q.claimedBy.push(u.id);showToast('Квест додано до ваших справ');}
    else{
      q.claimedBy=q.claimedBy.filter(x=>x!==u.id);u.coins+=q.rewardCoins;const levelResult=addXp(u,q.rewardXp,`квест «${q.title}»`);u.skills[q.skill]+=1;u.activity.unshift(`Виконано: ${q.title}`);u.stats=u.stats||{};u.stats.questsCompleted=(u.stats.questsCompleted||0)+1;state.family.xp+=q.rewardXp;state.family.coins+=Math.round(q.rewardCoins*.2);state.history.unshift({icon:q.icon,text:`${u.name} виконав(ла) «${q.title}»`,time:'Щойно'});if(q.type==='personal'||q.type==='limited')q.status='done';showToast(`+${q.rewardCoins} монет · +${q.rewardXp} XP${levelResult.levels?` · LEVEL UP ×${levelResult.levels}`:''}`);
    }save();render();
  }

  function handleShop(id){
    const item=state.shop.find(x=>x.id===id),u=currentUser();if(!item||item.stock<=0)return;
    if(item.type==='collective'){
      const contribution=Math.min(u.coins,Math.max(100,Math.ceil((item.price-item.fund)/4)));if(!contribution)return showToast('Недостатньо монет');u.coins-=contribution;item.fund+=contribution;if(item.fund>=item.price){item.stock-=1;item.fund=item.price;state.history.unshift({icon:item.icon,text:`Сімʼя зібрала на «${item.title}»`,time:'Щойно'});showToast('Спільну ціль досягнуто!');}else showToast(`Внесено ${contribution} монет`);
    }else{if(u.coins<item.price)return showToast('Недостатньо монет');u.coins-=item.price;item.stock-=1;state.history.unshift({icon:item.icon,text:`${u.name} придбав(ла) «${item.title}»`,time:'Щойно'});showToast('Можливість придбано');}
    save();render();
  }

  function toggleAdminFamilyVisibility(userId){
    if(!isAdmin())return showToast('Недостатньо прав');
    const u=state.users.find(x=>x.id===userId);if(!u||u.role!=='admin')return;
    u.hiddenFromFamily=!u.hiddenFromFamily;save();render();showToast(u.hiddenFromFamily?'Адміна сховано зі сторінки сімʼї':'Адміна знову видно в сімʼї');
  }

  function saveQuest(){
    const title=document.getElementById('qTitle').value.trim();if(!title)return showToast('Вкажіть назву');const type=document.getElementById('qType').value;state.quests.unshift({id:crypto.randomUUID(),title,icon:{home:'🧹',care:'🎁',health:'🏋️',growth:'📚',finance:'💰'}[document.getElementById('qSkill').value],description:document.getElementById('qDesc').value.trim()||'Сімейне завдання',type,participants:type==='pair'||type==='coop'?2:1,claimedBy:[],rewardCoins:Number(document.getElementById('qCoins').value)||50,rewardXp:Number(document.getElementById('qXp').value)||50,skill:document.getElementById('qSkill').value,skillXp:15,status:'active',limited:type==='limited',stock:type==='limited'?1:null});save();document.querySelector('.modal-backdrop').remove();render();showToast('Квест створено');
  }
  function saveShop(){
    const title=document.getElementById('sTitle').value.trim();if(!title)return showToast('Вкажіть назву');const rawUrl=document.getElementById('sResourceUrl')?.value||'',resourceUrl=cleanResourceUrl(rawUrl);if(rawUrl.trim()&&!resourceUrl)return showToast('Посилання має починатися з http:// або https://');state.shop.unshift({id:crypto.randomUUID(),title,icon:'✨',description:document.getElementById('sDesc').value.trim()||'Нова реальна можливість',price:Number(document.getElementById('sPrice').value)||1000,stock:Number(document.getElementById('sStock').value)||1,type:document.getElementById('sType').value,fund:0,resourceUrl});save();document.querySelector('.modal-backdrop').remove();render();showToast('Можливість додано');
  }


  function addImportantDate(){const u=currentUser(),day=Number(document.getElementById('importantDateDay')?.value),month=Number(document.getElementById('importantDateMonth')?.value),title=(document.getElementById('importantDateTitle')?.value||'').trim().slice(0,48);if(!u||!title||day<1||day>31||month<1||month>12)return showToast('Вкажіть правильну дату та назву');const check=new Date(2024,month-1,day);if(check.getMonth()!==month-1||check.getDate()!==day)return showToast('Такої дати не існує');u.importantDates=u.importantDates||[];if(u.importantDates.length>=20)return showToast('Можна додати до 20 важливих дат');u.importantDates.push({id:crypto.randomUUID(),day,month,title,visible:true});save();document.querySelector('.modal-backdrop')?.remove();document.body.insertAdjacentHTML('beforeend',modal('important-dates'));bindModal();showToast('Дату додано');}
  function deleteImportantDate(id){const u=currentUser();if(!u)return;u.importantDates=(u.importantDates||[]).filter(x=>x.id!==id);save();document.querySelector('.modal-backdrop')?.remove();document.body.insertAdjacentHTML('beforeend',modal('important-dates'));bindModal();showToast('Дату видалено');}

  function saveProfileSettings(){const u=currentUser();if(!u)return;u.equipped.badge=document.getElementById('profileBadge')?.value||null;u.equipped.frame=document.getElementById('profileFrame')?.value||null;u.equipped.animatedFrame=document.getElementById('profileAnimatedFrame')?.value||null;u.equipped.nicknameEffect=document.getElementById('profileNicknameEffect')?.value||null;u.equipped.theme=document.getElementById('profileTheme')?.value||'light';save();document.querySelector('.modal-backdrop')?.remove();render();showToast('Оформлення збережено');}

  function handleCosmetic(id){const u=currentUser(),i=cosmetic(id);if(!i)return;if(!u.inventory.includes(id)){if(u.coins<i.price)return showToast('Потрібно ще монеток');u.coins-=i.price;u.inventory.push(id);showToast('Додано до колекції');}if(i.kind==='badge')u.equipped.badge=id;if(i.kind==='frame')u.equipped.frame=id;if(i.kind==='animatedFrame')u.equipped.animatedFrame=id;if(i.kind==='nicknameEffect')u.equipped.nicknameEffect=id;if(i.kind==='theme')u.equipped.theme=i.asset;if(i.kind==='stickerPack')showToast('Стікерпак відкрито');save();render();}
  function claimLevelRewards(){const u=currentUser();const ready=state.levelRewards.filter(r=>u.level>=r.level&&!u.claimedLevelRewards.includes(r.level));if(!ready.length)return showToast('Нових подарунків поки немає');let coins=0;for(const r of ready){coins+=r.coins;u.claimedLevelRewards.push(r.level);if(r.item&&!u.inventory.includes(r.item))u.inventory.push(r.item);}u.coins+=coins;save();render();showToast(`Подарунки відкрито · +${coins} монеток`);}
  function openStickerModal(userId){document.body.insertAdjacentHTML('beforeend',modal(`sticker:${userId}`));bindModal();}
  function sendSticker(to,icon){const u=currentUser();if(u.coins<50)return showToast('Для теплого сліду потрібно 50 монет');if(stickerCount(u,icon)<1)return showToast('Цього стікера немає у вашій колекції');state.profileStickers=state.profileStickers.filter(x=>x.to!==to||Date.now()-x.createdAt<7*86400000);if(state.profileStickers.filter(x=>x.to===to).length>=10)return showToast('На профілі вже 10 стікерів');u.coins-=50;const note=(document.getElementById('stickerNote')?.value||'').trim().slice(0,120);state.profileStickers.push({id:crypto.randomUUID(),from:u.id,to,icon,note,createdAt:Date.now()});u.stats.stickersGiven=(u.stats.stickersGiven||0)+1;save();document.querySelector('.modal-backdrop')?.remove();render();showToast('Теплий слід залишено · −50 монет');}
  function weightedSticker(stickers){const pool=[];for(const s of stickers){const w=s.rarity==='epic'?8:s.rarity==='rare'?25:67;for(let i=0;i<w;i++)pool.push(s);}return pool[Math.floor(Math.random()*pool.length)];}
  function openStickerBox(id){const u=currentUser(),box=state.stickerBoxes.find(x=>x.id===id);if(!box)return;const c=state.stickerCollections.find(x=>x.id===box.collectionId),season=seasonInfo(c.season);if(!season.active)return showToast(`Цей бокс доступний лише: ${season.label}`);if(u.coins<box.price)return showToast('Недостатньо монет');u.coins-=box.price;const sticker=weightedSticker(c.stickers),before=stickerCount(u,sticker.id),isNew=before===0;u.stickerInventory[sticker.id]=before+1;u.stats.boxesOpened=(u.stats.boxesOpened||0)+1;let dust=0;if(!isNew){dust=10;u.stickerDust+=dust;}else{const stickerXp={common:3,uncommon:5,rare:10,epic:20,legendary:50,mythic:100}[sticker.rarity]||3;addXp(u,stickerXp,`новий стікер «${sticker.name}»`);checkCollectionMilestones(u,c);}save();render();showStickerReveal(sticker,c,isNew,dust);}
  function removeSticker(id){if(!isAdmin())return;state.profileStickers=state.profileStickers.filter(x=>x.id!==id);save();render();showToast('Стікер прибрано');}

  async function checkDailyRoulette(){
    if(!auth?.token || auth.demo || document.querySelector('.daily-gift-backdrop'))return;
    try{
      const info=await api('/api/family/daily-gift-status');
      if(info.available){document.body.insertAdjacentHTML('beforeend',modal('daily-roulette'));bindModal();}
    }catch(e){console.warn('Daily roulette:',e.message);}
  }

  function rewardAngle(reward){
    const centers={5:18,10:92,50:164,100:236,500:308};
    return centers[reward] ?? 18;
  }

  async function spinDailyRoulette(){
    const button=document.getElementById('rouletteSpinButton');
    const wheel=document.getElementById('dailyRouletteWheel');
    if(!button||!wheel||button.disabled)return;
    button.disabled=true;button.textContent='Колесо крутиться…';
    try{
      const result=await api('/api/family/daily-gift-claim',{method:'POST',body:'{}'});
      const reward=Number(result.reward||5);
      const ru=currentUser();ru.stats=ru.stats||{};ru.stats.giftsOpened=(ru.stats.giftsOpened||0)+1;if(reward===500)ru.stats.jackpots=(ru.stats.jackpots||0)+1;
      const target=360*6+(360-rewardAngle(reward));
      wheel.style.transform=`rotate(${target}deg)`;
      await new Promise(resolve=>setTimeout(resolve,4300));
      if(result.state){state=result.state;normalizeState();localStorage.setItem(STORAGE,JSON.stringify(state));persistAccount();}
      const title=document.getElementById('rouletteTitle');
      const text=document.getElementById('rouletteText');
      if(title)title.textContent=reward>=100?'Джекпот! ✨':reward===50?'Сьогодні особливо щастить!':'Твій ранковий подарунок';
      if(text)text.innerHTML=`<strong>+${reward} монеток 🪙</strong><br>Нехай день почнеться приємно.`;
      button.textContent='Забрати подарунок';button.disabled=false;
      button.onclick=()=>{document.querySelector('.daily-gift-backdrop')?.remove();render();};
    }catch(e){button.disabled=false;button.textContent='Спробувати ще раз';showToast(e.message);}
  }

  window.addEventListener('popstate',()=>{route=new URLSearchParams(location.search).get('screen')||(auth?'dashboard':'landing');render();});
  // Stage 9.5 safe boot: first paint must never wait for Telegram, network, IndexedDB or Service Worker.
  const bootError=(error)=>{
    console.error('[myHabbit boot]',error);
    const box=document.getElementById('appBootError')||document.createElement('pre');
    box.id='appBootError';
    box.style.cssText='position:fixed;inset:12px;z-index:999999;overflow:auto;padding:16px;border-radius:18px;background:#fff1f1;color:#7c2020;font:13px/1.45 monospace;white-space:pre-wrap;box-shadow:0 10px 40px #0002';
    box.textContent='Помилка запуску myHabbit\n\n'+String(error?.stack||error?.message||error);
    if(!box.isConnected)document.body.appendChild(box);
  };
  window.addEventListener('error',e=>bootError(e.error||e.message));
  window.addEventListener('unhandledrejection',e=>bootError(e.reason));
  try{render();applyTheme();}catch(error){bootError(error);}
  requestAnimationFrame(()=>document.getElementById('appSplash')?.classList.add('hidden'));

  // Remove all older workers/caches once. They are not allowed to control this recovery build.
  if('serviceWorker' in navigator){navigator.serviceWorker.getRegistrations().then(items=>Promise.all(items.map(x=>x.unregister()))).catch(()=>{});}
  if('caches' in window){caches.keys().then(keys=>Promise.all(keys.map(k=>caches.delete(k)))).catch(()=>{});}

  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')submitDailySnapshot({keepalive:true}).catch?.(()=>{});});
  window.addEventListener('pagehide',()=>{try{submitDailySnapshot({keepalive:true});}catch{}});
  const withTimeout=(promise,ms=6000)=>Promise.race([promise,new Promise((_,reject)=>setTimeout(()=>reject(new Error('Перевищено час очікування сервера')),ms))]);
  setTimeout(async()=>{
    try{
      if(telegramInitData&&!auth&&!inviteToken)await withTimeout(resumeTelegramSession());
      if(auth?.token){await withTimeout(submitDailySnapshot()).catch(()=>{});await withTimeout(pullRemote()).catch(()=>{});}
      if(inviteToken&&!auth)await withTimeout(loadInviteInfo()).catch(()=>{});
      render();
      if(auth?.token)setTimeout(checkDailyRoulette,350);
    }catch(error){console.warn('[myHabbit background boot]',error);}
  },50);
})();
