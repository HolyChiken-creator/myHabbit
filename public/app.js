(() => {
  'use strict';

  const app = document.getElementById('app');
  const toast = document.getElementById('toast');
  const STORAGE = 'familyQuestStateV1';
  const AUTH = 'familyQuestAuthV1';
  const DAILY_QUEUE = 'myHabbitDailyQueueV1';
  const LAST_SERVER_PULL = 'myHabbitLastServerPullV1';
  const LAST_DAILY_SYNC = 'myHabbitLastDailySyncV1';
  const OFFLINE_DB = 'myHabbitOfflineV1';
  const OFFLINE_STORE = 'library';
  const CONTENT_CACHE = 'myHabbitContentLibraryV1';
  const CONTENT_VERSION = '1.0.0';
  const APP_VERSION = '11.1.5-bunny-love-expansion';
  const ACCOUNTS = 'myHabbitAccountsV1';
  const ACTIVE_ACCOUNT = 'myHabbitActiveAccountV1';
  const LOGOUT_TOMBSTONE = 'myHabbitLogoutTombstoneV1';
  const PWA_ONBOARDING_SEEN = 'myHabbitPwaInstallGuideV1';
  const LANGUAGE_KEY = 'myHabbitLanguageV1';
  const ADMIN_PANEL_SECTION_KEY = 'myHabbitAdminOpenSectionV1';
  let appLanguage = localStorage.getItem(LANGUAGE_KEY) || ((navigator.language||'').toLowerCase().startsWith('en') ? 'en' : 'uk');
  const EN_TEXT = {
    'Головна':'Home','Квести':'Quests','Три в ряд':'Match 3','Магазин':'Shop','Колекції':'Collections','Музей':'Museum','Ачивки':'Achievements','Сімʼя':'Family','Профіль':'Profile','Адмін':'Admin',
    'Вийти':'Log out','Мої профілі':'My profiles','Відкрити меню':'Open menu','Поточне оновлення':'Current update','Демо-режим':'Demo mode','Вийти з демо':'Exit demo',
    'Моя сходинка':'My level','Наша спільна сходинка':'Family level','Баланс':'Balance','Мій ритм':'My streak','Квести на сьогодні':'Today’s quests','Усі квести':'All quests','Остання ачивка':'Latest achievement','Останні події':'Latest activity','Сімейний фокус':'Family focus','Головна ціль тижня':'Main weekly goal','Командна активність':'Team activity',
    'Поки немає ачивок':'No achievements yet','Подія':'Activity','Щойно':'Just now','Сьогодні':'Today','Учора':'Yesterday','Рівень':'Level','Монети':'Coins','Учасники':'Members','Наші люди':'Our people','Сімейна активність':'Family activity','Запросити':'Invite','Вийти із сімʼї':'Leave family',
    'Налаштування нашого простору':'Our space settings','Центр керування':'Control center','Перевірити Telegram':'Check Telegram','Зберегти':'Save','Скасувати':'Cancel','Додати':'Add','Видалити':'Delete','Закрити':'Close','Відкрити':'Open','Отримано':'Unlocked','Недостатньо монет':'Not enough coins',
    'Ласкаво просимо додому':'Welcome home','Раді бачити вас знову':'Welcome back','Створити сімʼю':'Create family','Приєднатися':'Join','Відкрити файл профілю':'Open profile file','Керувати профілями':'Manage profiles','Подивитися демо':'View demo','Увійти в акаунт':'Sign in','Назад':'Back',
    'Щоденний сюрприз':'Daily surprise','Один оберт на день':'One spin per day','Крути колесо удачі':'Spin the wheel','Крутити рулетку':'Spin','Забрати подарунок':'Claim gift','Спробувати ще раз':'Try again',
    'Важливі дати':'Important dates','День':'Day','Місяць':'Month','Назва':'Title','Додати дату':'Add date','Список поки порожній.':'The list is empty.','Налаштування збережено':'Settings saved','Гаразд':'OK','Чудово':'Great','Далі':'Next',
    'Українська':'Ukrainian','Англійська':'English','Мова інтерфейсу':'Interface language',
    'Моя команда':'My team','загальний рівень':'overall level','у myHabbit з':'using myHabbit since','Запросити в сімʼю':'Invite to family','Налаштувати':'Customize','Подарунки рівня':'Level rewards','Залишити слід':'Leave a sticker',
    'Спільний прогрес без публічних рейтингів і сторонніх людей.':'Shared progress without public rankings or strangers.','У видимому списку поки немає учасників':'No visible members yet','Поки немає нових подій учасників':'No new member activity yet',
    'Особистий':'Personal','Особиста':'Personal','Для всієї сімʼї':'For the whole family','Спільний фонд':'Shared fund','Хлопець':'Male','Дівчина':'Female','Інший':'Other','Профіль':'Profile','Ваше імʼя':'Your name','Сімейний PIN':'Family PIN','Назва сімʼї':'Family name','Увійти до сімʼї':'Join family',
    'Легка':'Easy','Середня':'Medium','Складна':'Hard','Звичайна':'Common','Рідкісна':'Rare','Епічна':'Epic','Легендарна':'Legendary','Секретна':'Secret','Взяти':'Claim','Виконати':'Complete','Активні':'Active','Завершені':'Completed','Особливі дати ще не додані.':'No special dates yet.','Керувати датами':'Manage dates',
    'Адміністративна панель':'Admin panel','Розділи адміністратора':'Admin sections','Відкривайте лише потрібне вікно — інші автоматично згорнуться.':'Open only the section you need — the others will collapse automatically.','Активні квести':'Active quests','Асортимент':'Catalog','закінчуються':'low in stock','Сімейний фонд':'Family fund','Квести та логічні ланцюжки':'Quests and progress chains','Редагування, приховування й власні завдання':'Edit, hide, and create custom tasks','Поточні квести':'Current quests','Стандартна бібліотека':'Default library','Квестів немає':'No quests yet','Магазин і готові пропозиції':'Shop and ready-made offers','Асортимент, залишки та швидке додавання':'Catalog, stock, and quick additions','Ваш асортимент':'Your catalog','Власний товар':'Custom item','Магазин порожній':'The shop is empty','Готова сітка товарів':'Ready-made catalog','Перенесення асортименту':'Catalog transfer','Копія між сімейними акаунтами':'Copy between family accounts','Зберегти JSON':'Save JSON','Копіювати JSON':'Copy JSON','Імпортувати файл':'Import file','Вставити з буфера':'Paste from clipboard','Власник':'Owner','Адміністратор':'Administrator','Учасник':'Member','Показати в сімʼї':'Show in family','Сховати із сімʼї':'Hide from family','Виключити':'Remove','Це ви':'This is you','Захищено':'Protected','Редагувати':'Edit','Пауза':'Pause','Активувати':'Activate','Прибрати':'Remove','Повернути':'Restore','Використовується у щоденній вибірці':'Included in the daily selection','Вимкнено':'Disabled','Стандартний':'Default','Власний':'Custom','активний':'active','призупинений':'paused','Небезпечні дії':'Dangerous actions','Скидання профілів':'Profile resets','Скинути профіль':'Reset profile','Куточок господаря':'Admin corner','Керування сімейним простором.':'Manage your family space.','Усі модулі згортаються, тому до потрібного розділу не треба довго гортати.':'All modules collapse, so you can reach the section you need without endless scrolling.','Тедик':'Teddy','Тедик поруч':'Teddy is here','Видати монетки':'Grant coins','Додати в магазин':'Add to shop','Кількість':'Quantity','Залишок':'Stock','Згорнути':'Collapse','Розгорнути':'Expand','Зберегти':'Save','Скасувати':'Cancel','Створити':'Create','Оновити':'Update','Так':'Yes','Ні':'No','Підтвердити':'Confirm','Назад':'Back','Готово':'Done','Помилка':'Error','Сімʼя та учасники':'Family and members','Ліміт від 2 до 25 і керування профілями':'Limit from 2 to 25 and profile management','Максимальна кількість членів сімʼї':'Maximum family members','Не можна встановити менше, ніж уже приєднано.':'Cannot be lower than the number already joined.','Учасники':'Members','Видати монетки':'Grant coins','Магазин адміністратора':'Admin shop','Готовий каталог':'Ready catalog','Додати в магазин':'Add to shop','Згорнути все':'Collapse all',
    'Мій профіль':'My profile','Профіль учасника':'Member profile','Загальний рівень, запрошення та маленькі перемоги.':'Overall level, invitations, and small wins.','Профіль близької людини.':'A family member’s profile.',
    'Мої барви':'My skills','Мої знахідки':'My achievements','Квести':'Quests','Ранкові подарунки':'Morning gifts','Джекпоти':'Jackpots','Стікери друзям':'Stickers sent',
    'Наші разом':'Together','Близькість':'Connection','Наш куточок':'Home','Руханка':'Movement','Сили й баланс':'Health & balance','Цікавинки':'Mind','Книжкові мандри':'Reading','Кіновечори':'Movie nights','Натхнення':'Creativity','Скарбничка':'Finance','Мій ритм':'Discipline','Тепло':'Care','Нові відкриття':'Growth',
    'Новачок':'Beginner','Дослідник':'Explorer','Авантюрист':'Adventurer','Шукач':'Seeker','Учень':'Learner','Боєць':'Fighter','Майстер':'Master','Експерт':'Expert','Чемпіон':'Champion','Герой':'Hero','Ветеран':'Veteran','Легенда':'Legend','Безсмертний':'Immortal','Міф':'Myth','Абсолютний Майстер':'Ultimate Master',
    'Оформлення профілю':'Profile appearance','Попередній вигляд':'Preview','Значок біля імені':'Badge next to name','Звичайна рамка':'Static frame','Анімована рамка':'Animated frame','Світне імʼя':'Glowing name','Ефект профілю':'Profile effect','Тема застосунку':'App theme','Звуки':'Sounds','Вібрація':'Haptics','Увімкнена':'Enabled','Усі ефекти':'All effects','Мінімальні':'Essential only','Без прикраси':'None',
    'Запросити в сімʼю':'Invite to family','Налаштувати':'Customize','Подарунки рівня':'Level rewards','Залишити слід':'Leave a sticker','Оформлення збережено':'Appearance saved'
  };
  function currentLocale(){return appLanguage==='en'?'en-US':'uk-UA';}
  function translateTextValue(value){
    if(appLanguage!=='en'||!value)return value;
    const trimmed=value.trim();
    if(EN_TEXT[trimmed])return value.replace(trimmed,EN_TEXT[trimmed]);
    return value
      .replace(/(\d+) рівень/g,'Level $1')
      .replace(/(\d+) учасник(?:и|ів)?/g,'$1 members')
      .replace(/Код сімʼї:/g,'Family code:')
      .replace(/Днів у приємному ритмі/g,'Days in a steady rhythm')
      .replace(/Спільний прогрес команди/g,'Shared team progress')
      .replace(/На реальні можливості/g,'For real rewards')
      .replace(/Поки немає нових подій учасників/g,'No new member activity yet')
      .replace(/(\d+) активних квест(?:ів|и)?/g,'$1 active quests')
      .replace(/(\d+) спільних справ/g,'$1 shared tasks')
      .replace(/(\d+) монет/g,'$1 coins')
      .replace(/Отримав\(ла\)/g,'received')
      .replace(/отримав\(ла\)/g,'received')
      .replace(/у ранковій рулетці/g,'from the morning wheel')
      .replace(/Головна ціль тижня/g,'Main weekly goal')
      .replace(/Закрити (\d+) спільних справ і зробити внесок у сімейну ціль\./g,'Complete $1 shared tasks and contribute to the family goal.')
      .replace(/(\d+) загальний рівень/g,'Overall level $1')
      .replace(/у myHabbit з/g,'on myHabbit since')
      .replace(/залишилось (\d+)/g,'$1 left')
      .replace(/(\d+) днів поспіль/g,'$1-day streak')
      .replace(/Профіль\s*·?\s*/g,'Profile · ');
  }
  function applyLanguage(root=document){
    document.documentElement.lang=appLanguage;
    if(appLanguage!=='en')return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.parentElement&& !['SCRIPT','STYLE','TEXTAREA'].includes(n.parentElement.tagName)&&n.nodeValue.trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT});
    const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);nodes.forEach(n=>{n.nodeValue=translateTextValue(n.nodeValue);});
    root.querySelectorAll?.('[placeholder],[aria-label],[title]').forEach(el=>['placeholder','aria-label','title'].forEach(a=>{if(el.hasAttribute(a))el.setAttribute(a,translateTextValue(el.getAttribute(a)));}));
  }
  let ownerSeasonalStickerTesting = false;
  let deferredInstallPrompt = null;
  let pwaGuideStep = 0;
  const QUEST_CATEGORIES = ['family','relationship','home','sport','health','mind','reading','cinema','creativity','finance','discipline'];
  const ACHIEVEMENT_FILES = ['general','levels','coins','streak','family','relationship','home','sport','health','mind','reading','cinema','creativity','finance','discipline','shop','secret','legendary'];
  const baseNavItems = [
    ['dashboard','⌂','Головна'],['quests','✓','Квести'],['match3','◆','Три в ряд'],['shop','◈','Магазин'],
    ['collections','▦','Колекції'],['museum','🏛️','Музей'],['achievements','🏆','Ачивки'],['family','👥','Сімʼя'],['profile','●','Профіль']
  ];
  const isAdmin = () => currentUser()?.role === 'admin' || state.users[0]?.id === state.currentUserId;
  const navItems = () => isAdmin() ? [...baseNavItems, ['admin','⚙','Адмін']] : baseNavItems;

  const seed = {
    family:{id:'demo-family',name:'Наша команда',code:'FAMILY25',level:12,xp:7420,coins:1850,maxMembers:5},
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

  const DAILY_QUEST_TEMPLATES = [
    ['Застелити ліжко','🛏️','Почати день з маленького порядку','home','easy',25,20,true],
    ['Прибрати після себе','🧽','Залишити спільний простір чистим','home','easy',30,25,true],
    ['10 хвилин без телефона','🌿','Зробити коротку паузу для уваги','mind','easy',25,25,true],
    ['Склянка води зранку','💧','Почати день зі склянки води','health','easy',20,20,true],
    ['Сказати щось тепле','💬','Підтримати когось із близьких','care','easy',30,25,true],
    ['Розкласти речі по місцях','🧺','Повернути порядок у маленькій зоні','home','easy',35,30,true],
    ['Прогулянка 20 хвилин','🚶','Вийти на свіже повітря та пройтися','health','normal',55,50,true],
    ['Прочитати 10 сторінок','📖','Продовжити поточну книгу','growth','normal',55,55,true],
    ['Розминка 15 хвилин','🤸','Легка зарядка або мобільність','health','normal',60,55,true],
    ['Навести лад на кухні','🍽️','Посуд, поверхні та дрібний порядок','home','normal',65,60,true],
    ['Записати 3 вдячності','✨','Помітити хороше за сьогодні','mind','normal',50,55,true],
    ['Перевірити бюджет дня','💰','Коротко переглянути витрати','finance','normal',55,50,true],
    ['Спільна вечеря без екранів','🍲','Побути разом без телефонів','care','normal',75,70,true],
    ['Допомогти без нагадування','🤝','Самостійно підхопити одну справу','care','normal',70,65,true],
    ['30 хвилин навчання','🧠','Вивчити щось корисне для себе','growth','hard',95,90,false],
    ['Повне тренування','🏋️','Не менше 40 хвилин активності','health','hard',110,100,false],
    ['Розібрати одну складну зону','🧹','Шафа, комора, стіл або балкон','home','hard',105,95,false],
    ['План на завтра','🗓️','Скласти реалістичний список справ','mind','normal',65,60,true],
    ['Подзвонити рідним','📞','Приділити час важливій людині','care','normal',70,65,false],
    ['Година творчості','🎨','Малювання, музика, текст або хобі','growth','hard',100,95,false],
    ['День без зайвої покупки','🪙','Не купувати нічого імпульсивного','finance','hard',100,90,false],
    ['Сімейна міні-нарада','👨‍👩‍👧','Обговорити плани й потреби команди','care','hard',120,110,false],
    ['Новий корисний рецепт','🥗','Приготувати щось нове та збалансоване','health','hard',115,105,false],
    ['Цифрове прибирання','🗂️','Видалити зайві файли або листи','growth','normal',70,65,false],
    ['Маленький сюрприз','🎁','Зробити приємну несподіванку','care','hard',125,115,false],
    ['Вечірня тиша 15 хвилин','🌙','Спокійно завершити день без екранів','mind','normal',60,60,true],
    ['Підготувати одяг на завтра','👕','Зменшити ранковий поспіх','home','easy',30,25,true],
    ['Винести сміття','🗑️','Закрити просту побутову справу','home','easy',25,20,true],
    ['Оновити сімейний список покупок','📝','Додати потрібне та прибрати зайве','finance','normal',55,50,true],
    ['Одна добра справа','💛','Допомогти людині або тварині','care','normal',75,70,false]
  ];
  const READY_SHOP_CATALOG = [
    ['movie','🎬','Обрати фільм','Обрати фільм або серіал для спільного вечора',60,'family','Відпочинок'],
    ['dessert','🍰','Улюблений десерт','Отримати улюблений десерт або смаколик',90,'personal','Їжа'],
    ['drink','☕','Кава або улюблений напій','Кава, чай чи інший улюблений напій',100,'personal','Їжа'],
    ['dinner','🍕','Обрати вечерю','Обрати домашню вечерю або доставку',140,'family','Їжа'],
    ['freehour','🌿','Година особистого часу','Одна година без справ та прохань',100,'personal','Відпочинок'],
    ['sleep','😴','Довше поспати у вихідний','Інші члени сімʼї беруть ранкові справи на себе',150,'personal','Відпочинок'],
    ['chores','🛋️','Вечір без домашніх справ','Один вечір без побутових обовʼязків',180,'personal','Відпочинок'],
    ['massage','💆','Масаж','Домашній масаж за домовленістю',150,'personal','Турбота'],
    ['breakfast','🥐','Сніданок у ліжко','Сніданок, підготовлений іншими членами сімʼї',180,'personal','Турбота'],
    ['surprise','🎁','Маленький сюрприз','Невеликий приємний сюрприз',250,'personal','Турбота'],
    ['walk','🌳','Прогулянка у вибраному місці','Обрати маршрут або місце для сімейної прогулянки',160,'family','Розваги'],
    ['boardgame','🎲','Обрати настільну гру','Обрати гру для спільного вечора',80,'family','Розваги'],
    ['cinema','🍿','Похід у кіно','Сімейний або парний похід у кіно',400,'family','Розваги'],
    ['date','💕','Побачення','Організоване побачення у погоджений день',450,'personal','Стосунки'],
    ['toy','🧸','Маленька іграшка','Невелика погоджена іграшка',400,'personal','Дитячі'],
    ['game30','🎮','Додаткові 30 хвилин гри','Додатковий час на гру після виконання справ',80,'personal','Дитячі'],
    ['picnic','🧺','Сімейний пікнік','Спільний пікнік у зручний день',500,'family','Спільні цілі'],
    ['trip','🧳','Фонд на поїздку','Спільний накопичувальний фонд на поїздку',1000,'collective','Спільні цілі']
  ];
  const questTemplateKey=t=>String(t?.[0]||'').toLowerCase().replace(/[^a-zа-яіїєґ0-9]+/gi,'-').replace(/^-|-$/g,'');
  function familyMax(){return Math.max(2,Math.min(25,Number(state.family?.maxMembers||5)));}
  function questTemplateState(key){state.questTemplateSettings=state.questTemplateSettings||{};return state.questTemplateSettings[key]||{};}
  function daySeed(){return Number(localDay().replaceAll('-',''))||1;}
  function ensureDailyQuests(){
    state.meta=state.meta||{};
    const day=localDay();
    if(state.meta.dailyQuestDay===day && (state.quests||[]).filter(q=>q.dailyDay===day&&q.status==='active').length>=1)return;
    const custom=(state.quests||[]).filter(q=>q.source==='admin' || (!q.dailyDay && !String(q.id||'').startsWith('daily-')));
    const enabled=DAILY_QUEST_TEMPLATES.filter(t=>questTemplateState(questTemplateKey(t)).enabled!==false);
    const recurring=enabled.filter(x=>x[7]);
    const fresh=enabled.filter(x=>!x[7]);
    const rotate=(arr,offset)=>arr.length?arr.map((_,i)=>arr[(i+offset)%arr.length]):[];
    const mixed=[...rotate(recurring,daySeed()%Math.max(1,recurring.length)).slice(0,16),...rotate(fresh,daySeed()%Math.max(1,fresh.length)).slice(0,9)].slice(0,25);
    const generated=mixed.map((t,i)=>{const key=questTemplateKey(t),o=questTemplateState(key);return {id:`daily-${day}-${i}`,templateKey:key,title:o.title||t[0],icon:o.icon||t[1],description:o.description||t[2],type:o.type||(i%7===0?'coop':'personal'),participants:(o.type||(i%7===0?'coop':'personal'))==='personal'?1:2,claimedBy:[],rewardCoins:Number(o.rewardCoins??t[5]),rewardXp:Number(o.rewardXp??t[6]),skill:o.skill||t[3],skillXp:Math.max(8,Math.round(Number(o.rewardXp??t[6])/4)),difficulty:o.difficulty||t[4],status:'active',limited:false,dailyDay:day,recurring:Boolean(t[7]),source:'daily'};});
    state.quests=[...custom,...generated];state.meta.dailyQuestDay=day;
  }
  function normalizeState(){
    state = (state && typeof state === 'object') ? state : clone(seed);
    state.meta=state.meta||{};
    state.family=state.family||clone(seed.family);state.family.maxMembers=familyMax();state.questTemplateSettings=state.questTemplateSettings||{};
    state.users=Array.isArray(state.users)&&state.users.length?state.users:clone(seed.users);
    state.users.forEach(u=>{u.hiddenFromFamily=Boolean(u.hiddenFromFamily);});
    state.currentUserId=state.users.some(u=>u.id===state.currentUserId)?state.currentUserId:state.users[0].id;
    state.quests=Array.isArray(state.quests)?state.quests:clone(seed.quests);
    state.shop=Array.isArray(state.shop)?state.shop:clone(seed.shop);
    state.achievements=Array.isArray(state.achievements)?state.achievements:clone(seed.achievements);
    state.history=Array.isArray(state.history)?state.history:clone(seed.history);
    maintainDailyActionRetention();
    state.quests.forEach(q=>{q.claimedBy=Array.isArray(q.claimedBy)?q.claimedBy:[];q.difficulty=q.difficulty||'normal';q.source=q.source||(q.catalog?'catalog':'admin');});
    ensureDailyQuests();
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
      {id:'pack_bunny_notes',title:'Пак «Bunny Notes»',kind:'stickerPack',asset:'bunny-notes',price:350,rarity:'Рідкісна'},
      {id:'cos_badge_star',title:'Зірочка біля імені',kind:'badge',asset:'star',price:260,rarity:'Рідкісна'},
      {id:'cos_badge_heart',title:'Серце біля імені',kind:'badge',asset:'heart',price:320,rarity:'Епічна'},
      {id:'cos_badge_crown',title:'Корона біля імені',kind:'badge',asset:'crown',price:650,rarity:'Легендарна'},
      {id:'cos_frame_mint',title:'Рамка «Мʼятна хмаринка»',kind:'frame',asset:'mint',price:360,rarity:'Звичайна'},
      {id:'cos_frame_peach',title:'Рамка «Персиковий затишок»',kind:'frame',asset:'peach',price:480,rarity:'Рідкісна'},
      {id:'cos_frame_lavender',title:'Рамка «Лавандовий сон»',kind:'frame',asset:'lavender',price:620,rarity:'Епічна'},
      {id:'cos_frame_royal',title:'Рамка «Королівська»',kind:'frame',asset:'royal',price:1100,rarity:'Легендарна'},
      {id:'af_clouds',title:'Анімована рамка «Хмаринки»',kind:'animatedFrame',asset:'clouds',price:760,rarity:'Рідкісна'},
      {id:'af_sparkles',title:'Анімована рамка «Іскри»',kind:'animatedFrame',asset:'sparkles',price:880,rarity:'Епічна'},
      {id:'af_galaxy',title:'Анімована рамка «Галактика»',kind:'animatedFrame',asset:'galaxy',price:1450,rarity:'Легендарна'},
      {id:'af_aurora',title:'Анімована рамка «Аврора»',kind:'animatedFrame',asset:'aurora',price:1600,rarity:'Легендарна'},
      {id:'nick_rose',title:'Світне імʼя «Рожевий неон»',kind:'nicknameEffect',asset:'rose',price:720,rarity:'Рідкісна'},
      {id:'nick_mint',title:'Світне імʼя «Мʼятне сяйво»',kind:'nicknameEffect',asset:'mint',price:720,rarity:'Рідкісна'},
      {id:'nick_purple',title:'Світне імʼя «Фіолетова магія»',kind:'nicknameEffect',asset:'purple',price:840,rarity:'Епічна'},
      {id:'nick_starlight',title:'Світне імʼя «Зоряне»',kind:'nicknameEffect',asset:'starlight',price:1180,rarity:'Легендарна'},
      {id:'fx_glow',title:'Ефект профілю «Мʼяке сяйво»',kind:'profileEffect',asset:'glow',price:500,rarity:'Рідкісна'},
      {id:'fx_sparkle',title:'Ефект профілю «Блискітки»',kind:'profileEffect',asset:'sparkle',price:750,rarity:'Епічна'},
      {id:'fx_particles',title:'Ефект профілю «Частинки»',kind:'profileEffect',asset:'particles',price:900,rarity:'Епічна'},
      {id:'fx_pulse',title:'Ефект профілю «Пульсація»',kind:'profileEffect',asset:'pulse',price:820,rarity:'Епічна'},
      {id:'fx_hearts',title:'Ефект профілю «Сердечка»',kind:'profileEffect',asset:'hearts',price:1050,rarity:'Легендарна'},
      {id:'fx_stars',title:'Ефект профілю «Зоряний пил»',kind:'profileEffect',asset:'stars',price:1200,rarity:'Легендарна'},
      {id:'pack_daily_moods',title:'Пак «Daily Moods»',kind:'stickerPack',asset:'daily-moods',price:340,rarity:'Звичайна'},
      {id:'pack_couple_moments',title:'Пак «Couple Moments»',kind:'stickerPack',asset:'couple-moments',price:520,rarity:'Рідкісна'},
      {id:'pack_home_cozy',title:'Пак «Home Cozy»',kind:'stickerPack',asset:'home-cozy',price:460,rarity:'Рідкісна'},
      {id:'pack_magic_night',title:'Пак «Magic Night»',kind:'stickerPack',asset:'magic-night',price:700,rarity:'Епічна'},
      {id:'pack_pixel_fun',title:'Пак «Pixel Fun»',kind:'stickerPack',asset:'pixel-fun',price:580,rarity:'Рідкісна'},
      {id:'pack_kawaii_food',title:'Пак «Kawaii Food»',kind:'stickerPack',asset:'kawaii-food',price:620,rarity:'Епічна'},
      {id:'pack_motivation',title:'Пак «Motivation»',kind:'stickerPack',asset:'motivation',price:480,rarity:'Рідкісна'},
      {id:'cos_theme_peach',title:'Персикова тема',kind:'theme',asset:'peach',price:620,rarity:'Рідкісна'},
      {id:'cos_theme_mint',title:'Мʼятна тема',kind:'theme',asset:'mint',price:620,rarity:'Рідкісна'}
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
    const stickerDefaults=defaultStickerCollections();
    state.stickerCollections=Array.isArray(state.stickerCollections)?state.stickerCollections:[];
    for(const fresh of stickerDefaults){
      const old=state.stickerCollections.find(x=>x.id===fresh.id);
      if(!old)state.stickerCollections.push(fresh);
      else if(['cozy-cats','bunny-love'].includes(fresh.id)||!Array.isArray(old.stickers)||old.stickers.length<fresh.stickers.length){
        old.title=fresh.title;old.season=fresh.season;old.reward=fresh.reward;old.stickers=fresh.stickers;
      }
    }
    const boxDefaults=defaultStickerBoxes();
    state.stickerBoxes=Array.isArray(state.stickerBoxes)?state.stickerBoxes:[];
    for(const box of boxDefaults)if(!state.stickerBoxes.some(x=>x.id===box.id))state.stickerBoxes.push(box);
    ensureCollectionAchievements();
    cleanAchievementCatalog();
    state.profileStickers=state.profileStickers||[];
    state.giftHistory=Array.isArray(state.giftHistory)?state.giftHistory:[];
    for(const [index,u] of (state.users||[]).entries()){
      if(!u.role)u.role=index===0?'owner':'member';
      u.inventory=Array.isArray(u.inventory)?u.inventory:[];u.equipped={badge:null,frame:null,animatedFrame:null,nicknameEffect:null,profileEffect:null,favoriteSticker:null,theme:'light',...(u.equipped||{})};
      u.claimedLevelRewards=u.claimedLevelRewards||[];u.featuredAchievements=u.featuredAchievements||u.achievements?.slice(0,3)||[];
      u.achievements=Array.isArray(u.achievements)?u.achievements:[];u.activity=Array.isArray(u.activity)?u.activity:[];u.skills=u.skills||{};
      u.stats={questsCompleted:u.activity.filter(x=>x.startsWith('Виконано:')).length||0,giftsOpened:0,jackpots:0,stickersGiven:0,boxesOpened:0,invitedUsers:0,referralXp:0,referralGifts:0,...(u.stats||{})};u.referrals=Array.isArray(u.referrals)?u.referrals:[];u.invitedBy=u.invitedBy||null;
      u.createdAt=u.createdAt||state.meta.createdAt||new Date().toISOString();u.importantDates=Array.isArray(u.importantDates)?u.importantDates:[];u.stickerInventory=u.stickerInventory||{};u.stickerDust=Number(u.stickerDust||0);u.receivedGifts=Array.isArray(u.receivedGifts)?u.receivedGifts:[];u.activeFeatures=Array.isArray(u.activeFeatures)?u.activeFeatures.filter(f=>Number(f.expiresAt||0)>Date.now()):[];u.level=Math.max(1,Math.trunc(Number(u.level)||1));u.xp=Math.max(0,Number(u.xp)||0);
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
  function buildStickerSet(prefix,count,names,mediaFolder='',mediaExt='webm'){
    const rarities=['common','common','common','uncommon','uncommon','rare','rare','epic','legendary','mythic'];
    return Array.from({length:count},(_,i)=>({
      id:`${prefix}_${String(i+1).padStart(2,'0')}`,
      name:names[i]||`${names[i%names.length]} ${i+1}`,
      rarity:rarities[Math.min(rarities.length-1,Math.floor(i/count*rarities.length))],
      media:mediaFolder?`/assets/stickers/${mediaFolder}/${mediaFolder}-${String(i+1).padStart(2,'0')}.${mediaExt}`:''
    }));
  }
  function defaultStickerCollections(){
    const sets=[
      ['cozy-cats','Cozy Cats','always','Рамка «Котячий затишок»',40,['Котик із сердечком','Котик із кавою','Котик читає','Сонний котик','Котик у пледі','Котик із квіткою','Котик-мрійник','Котик готує','Зоряний котик','Королівський котик']],
      ['bunny-love','Bunny Love','always','Бейдж «Теплі вушка»',60,['Кролик вітається','Кролик із чаєм','Кролик із квіткою','Обійми кролика','Кролик у хмаринці','Закоханий кролик','Місячний кролик','Кролик-мрійник','Кролик із подарунком','Королівський кролик']],
      ['sakura','Sakura','always','Анімована рамка «Сакура»',30,['Пелюстка сакури','Чай під сакурою','Весняний вітер','Рожевий ліхтарик','Кіт під сакурою','Кролик у кімоно','Сакурове серце','Міст у квітах','Місячна сакура','Дух весни']],
      ['sweet-life','Sweet Life','always','Нікнейм «Солодке життя»',35,['Полуничний торт','Капкейк із серцем','Тепле какао','Рожевий пончик','Морозиво-мрія','Цукерка дружби','Медове печиво','Вишневий десерт','Солодка хмаринка','Королівський торт']],
      ['christmas','Christmas Cozy','christmas','Фон «Різдвяна ніч»',40,['Котик у шапці','Тепла ялинка','Святкове какао','Різдвяний носок','Снігова куля','Подарунок із бантом','Пряниковий будиночок','Олень-друг','Різдвяна зірка','Диво опівночі']],
      ['halloween','Halloween Cute','halloween','Ефект «Магічні іскри»',50,['Котик-чарівник','Милий гарбуз','Добрий привид','Цукерки або обійми','Капелюх відьми','Кажанчик','Чарівне зілля','Чорний кіт','Гелловінський місяць','Король ночі']],
      ['easter','Egg Party','easter','Рамка «Весняне диво»',50,['Писанка','Великодній кролик','Святковий кошик','Весняна квітка','Курчатко','Паска','Сонячний зайчик','Квітучий вінок','Весняне сонце','Великоднє диво']]
    ];
    return sets.map(([id,title,season,reward,count,names])=>{
      const mediaFolder=['cozy-cats','bunny-love','sakura','sweet-life'].includes(id)?id:'';
      const stickers=buildStickerSet(id.replace(/-/g,'_'),count,names,mediaFolder,['sakura','sweet-life'].includes(id)?'webp':'webm');
      if(id==='bunny-love'){
        stickers.forEach((st,index)=>{
          if(index>=40)st.media=`/assets/stickers/bunny-love/bunny-love-${String(index+1).padStart(2,'0')}.webp`;
        });
      }
      return {id,title,season,reward,stickers};
    });
  }
  function defaultStickerBoxes(){return [
    {id:'box_cats',title:'Cozy Cats Box',collectionId:'cozy-cats',price:300},
    {id:'box_bunny',title:'Bunny Love Box',collectionId:'bunny-love',price:300},
    {id:'box_sakura',title:'Sakura Box',collectionId:'sakura',price:360},
    {id:'box_sweet',title:'Sweet Life Box',collectionId:'sweet-life',price:360},
    {id:'box_christmas',title:'Christmas Box',collectionId:'christmas',price:450},
    {id:'box_halloween',title:'Halloween Box',collectionId:'halloween',price:450},
    {id:'box_easter',title:'Egg Party Box',collectionId:'easter',price:450}
  ];}
  function easterDate(year){const a=year%19,b=Math.floor(year/100),c=year%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),month=Math.floor((h+l-7*m+114)/31),day=((h+l-7*m+114)%31)+1;return new Date(year,month-1,day);}
  function formatDayMonth(value){const d=value instanceof Date?value:new Date(value);if(Number.isNaN(d.getTime()))return '—';return new Intl.DateTimeFormat(currentLocale(),{day:'numeric',month:'long'}).format(d);}
  function seasonInfo(season,date=new Date()){const y=date.getFullYear(),md=(date.getMonth()+1)*100+date.getDate();if(season==='always')return {active:true,label:'Доступна завжди'};if(ownerSeasonalStickerTesting)return {active:true,label:'Відкрито Owner для тестування'};if(season==='christmas')return {active:md>=1201||md<=107,label:'1 грудня — 7 січня'};if(season==='halloween')return {active:md>=1015&&md<=1102,label:'15 жовтня — 2 листопада'};if(season==='easter'){const e=easterDate(y),from=new Date(e),to=new Date(e);from.setDate(e.getDate()-14);to.setDate(e.getDate()+7);return {active:date>=from&&date<=to,label:`${formatDayMonth(from)} — ${formatDayMonth(to)}`};}return {active:false,label:'Сезон закритий'};}
  function roman(n){const map=[[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];let out='';for(const [v,s] of map)while(n>=v){out+=s;n-=v;}return out||'—';}
  function numericJoinDate(value){const d=new Date(value);if(Number.isNaN(d.getTime()))return '—';return new Intl.DateTimeFormat(currentLocale(),{day:'2-digit',month:'2-digit',year:'numeric'}).format(d);}
  function escapeHtml(value){return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
  function normalDate(day,month){return formatDayMonth(new Date(2000,Math.max(0,(Number(month)||1)-1),Number(day)||1));}
  function importantDateOrder(item){const now=new Date(),y=now.getFullYear();let d=new Date(y,Number(item.month)-1,Number(item.day));d.setHours(23,59,59,999);if(d<now)d=new Date(y+1,Number(item.month)-1,Number(item.day));return d.getTime();}
  function importantDatesBlock(u,own){const items=[...(u.importantDates||[])].filter(x=>x&&x.visible!==false).sort((a,b)=>importantDateOrder(a)-importantDateOrder(b));return `<details class="cozy-fold important-dates-fold"><summary><span class="important-date-icon">♡</span><strong>Важливі дати</strong><small>${items.length}</small></summary><div class="fold-body important-dates-body">${items.length?items.map(x=>`<article class="important-date-row"><time>${normalDate(x.day,x.month)}</time><span>${escapeHtml(x.title)}</span></article>`).join(''):'<div class="empty-soft">Особливі дати ще не додані.</div>'}${own?'<button class="btn soft important-dates-manage" data-action="manage-important-dates">Керувати датами</button>':''}</div></details>`;}
  function stickerCount(u,id){return Number(u.stickerInventory?.[id]||0);}

  function clone(v){return JSON.parse(JSON.stringify(v));}
  function safeJsonRead(key,fallback){
    const candidates=[localStorage.getItem(key),localStorage.getItem(`${key}:backup`)];
    for(const raw of candidates){
      if(!raw)continue;
      try{const value=JSON.parse(raw);if(value!==undefined&&value!==null)return value;}catch{}
    }
    return clone(fallback);
  }
  function safeJsonWrite(key,value){
    const raw=JSON.stringify(value);
    JSON.parse(raw);
    const tempKey=`${key}:temp`;
    const previous=localStorage.getItem(key);
    try{
      localStorage.setItem(tempKey,raw);
      if(localStorage.getItem(tempKey)!==raw)throw new Error('Storage verification failed');
      if(previous){localStorage.setItem(`${key}:backup`,previous);}
      localStorage.setItem(key,raw);
      if(localStorage.getItem(key)!==raw)throw new Error('Storage commit failed');
      localStorage.removeItem(tempKey);
      return true;
    }catch(error){
      localStorage.removeItem(tempKey);
      if(previous){try{localStorage.setItem(key,previous);}catch{}}
      console.warn('Safe storage write failed',key,error);
      return false;
    }
  }
  function loadState(){return safeJsonRead(STORAGE,seed);}
  function loadAuth(){return localStorage.getItem(LOGOUT_TOMBSTONE)?null:safeJsonRead(AUTH,null);}
  function loadAccounts(){const value=safeJsonRead(ACCOUNTS,[]);return Array.isArray(value)?value:[];}
  function accountId(a=auth,s=state){return a?.userId&&s?.family?.id?`${s.family.id}:${a.userId}`:'';}
  function restoreActiveAccount(){
    if(localStorage.getItem(LOGOUT_TOMBSTONE))return;
    const id=localStorage.getItem(ACTIVE_ACCOUNT); const item=loadAccounts().find(x=>x.id===id);
    if(item?.auth&&item?.state){auth=clone(item.auth);state=clone(item.state);normalizeState();safeJsonWrite(AUTH,auth);safeJsonWrite(STORAGE,state);}
  }
  function persistAccount(){
    if(!auth)return; const id=accountId(); if(!id)return; const list=loadAccounts(); const u=currentUser();
    const item={id,label:u?.name||'Мій профіль',familyName:state.family?.name||'',auth:clone(auth),state:clone(state),updatedAt:Date.now()};
    const i=list.findIndex(x=>x.id===id); if(i>=0)list[i]=item;else list.unshift(item);
    safeJsonWrite(ACCOUNTS,list.slice(0,25));localStorage.removeItem(LOGOUT_TOMBSTONE);localStorage.setItem(ACTIVE_ACCOUNT,id);
  }
  function save(){normalizeState();observeRewardChanges();if(!safeJsonWrite(STORAGE,state)){showToast('Не вдалося безпечно зберегти дані');return;}persistAccount();queueDailySnapshot();applyTheme();scheduleImmediateFamilySync();broadcastLocalState();}
  function applyTheme(){document.documentElement.dataset.theme=currentUser()?.equipped?.theme||'light';}
  function currentUser(){return state.users.find(u=>u.id===state.currentUserId)||state.users[0];}
  function cleanResourceUrl(value){
    const raw=String(value||'').trim();if(!raw)return '';
    try{const url=new URL(raw);return ['http:','https:'].includes(url.protocol)?url.href:'';}catch{return '';}
  }
  function visibleFamilyUsers(){return (state.users||[]).filter(u=>!u.hiddenFromFamily);}
  function showToast(text){
    const value=String(text||'');
    if(value.includes('Монетки вже чекають тебе')){
      const u=currentUser(),key=`myHabbitCoinReminder:${u?.id||'guest'}`,today=new Date().toISOString().slice(0,10);
      if(localStorage.getItem(key)===today)return;
      localStorage.setItem(key,today);
    }
    toast.textContent=value;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2200);
  }

  // v10.1 — Cozy Audio System. All effects are synthesized locally: no downloads, no tracking.
  let cozyAudioContext=null;
  function audioPrefs(){
    const u=currentUser();
    if(!u)return {mode:'minimal',haptics:true};
    u.audioPrefs=u.audioPrefs||{mode:'minimal',haptics:true};
    if(!['off','minimal','full'].includes(u.audioPrefs.mode))u.audioPrefs.mode='minimal';
    if(typeof u.audioPrefs.haptics!=='boolean')u.audioPrefs.haptics=true;
    return u.audioPrefs;
  }
  function audioAllowed(priority='full'){const mode=audioPrefs().mode;return mode!=='off'&&(mode==='full'||priority==='important');}
  function audioContext(){
    if(!cozyAudioContext){const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)return null;cozyAudioContext=new Ctx();}
    if(cozyAudioContext.state==='suspended')cozyAudioContext.resume().catch(()=>{});
    return cozyAudioContext;
  }
  function cozyTone(freq=520,duration=.08,volume=.025,type='sine',delay=0){
    const ctx=audioContext();if(!ctx)return;const now=ctx.currentTime+delay,osc=ctx.createOscillator(),gain=ctx.createGain();
    osc.type=type;osc.frequency.setValueAtTime(freq,now);gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(Math.max(.001,volume),now+.012);gain.gain.exponentialRampToValueAtTime(.0001,now+duration);osc.connect(gain).connect(ctx.destination);osc.start(now);osc.stop(now+duration+.02);
  }
  function playCozySound(name,priority='full',rarity='common'){
    if(!audioAllowed(priority))return;
    try{
      if(name==='tap')cozyTone(620,.045,.012,'sine');
      else if(name==='menu'){cozyTone(440,.07,.018,'sine');cozyTone(590,.08,.014,'sine',.045);}
      else if(name==='modal')cozyTone(520,.08,.016,'triangle');
      else if(name==='coin'){cozyTone(880,.07,.025,'sine');cozyTone(1175,.10,.018,'sine',.055);}
      else if(name==='purchase'){cozyTone(520,.08,.025,'triangle');cozyTone(780,.11,.022,'sine',.07);}
      else if(name==='equip'){cozyTone(700,.07,.018,'sine');cozyTone(920,.09,.016,'sine',.05);}
      else if(name==='quest'){cozyTone(392,.10,.026,'triangle');cozyTone(523,.11,.025,'triangle',.07);cozyTone(659,.14,.022,'sine',.14);}
      else if(name==='levelup'){[523,659,784,1047].forEach((f,i)=>cozyTone(f,.22,.032,'sine',i*.085));}
      else if(name==='achievement'){const notes=rarity==='legendary'||rarity==='mythic'?[523,659,784,1047]:rarity==='epic'?[523,659,784]:[659,784];notes.forEach((f,i)=>cozyTone(f,.23,.03,'sine',i*.085));}
      else if(name==='box-open'){cozyTone(180,.20,.026,'triangle');cozyTone(260,.18,.022,'triangle',.10);cozyTone(390,.16,.019,'sine',.20);}
      else if(name==='reveal'){const base=rarity==='legendary'||rarity==='mythic'?[523,784,1047,1319]:rarity==='epic'?[440,659,880]:rarity==='rare'?[392,587,784]:[440,554];base.forEach((f,i)=>cozyTone(f,.25,.032,'sine',i*.09));}
      else if(name==='roulette'){[330,392,440,494].forEach((f,i)=>cozyTone(f,.07,.015,'triangle',i*.055));}
      else if(name==='gift'){[523,659,784].forEach((f,i)=>cozyTone(f,.18,.025,'sine',i*.08));}
      else if(name==='error'){cozyTone(220,.09,.018,'triangle');cozyTone(185,.13,.014,'triangle',.07);}
    }catch{}
  }
  function cozyHaptic(pattern='light'){
    if(!audioPrefs().haptics)return;
    try{window.Telegram?.WebApp?.HapticFeedback?.impactOccurred(pattern==='strong'?'heavy':pattern==='medium'?'medium':'light');}catch{}
    try{navigator.vibrate?.(pattern==='strong'?[30,35,55]:pattern==='medium'?25:10);}catch{}
  }

  // Stage 10.6 — unified reward feedback engine.
  let rewardSnapshot=null;
  const announcedAchievements=new Set();
  const rewardFxQueue=[];
  let rewardFxBusy=false;
  function currentRewardSnapshot(){
    const u=currentUser();
    return u?{userId:u.id,coins:Number(u.coins||0),xp:Number(u.xp||0),level:Number(u.level||1),achievements:new Set(u.achievements||[])}:null;
  }
  function initializeRewardFeedback(){
    rewardSnapshot=currentRewardSnapshot();
    for(const id of rewardSnapshot?.achievements||[])announcedAchievements.add(id);
  }
  function haptic(kind='light'){cozyHaptic(kind==='heavy'?'strong':kind);}
  function ensureRewardLayer(){
    let layer=document.getElementById('rewardFeedbackLayer');
    if(!layer){layer=document.createElement('div');layer.id='rewardFeedbackLayer';layer.className='reward-feedback-layer';layer.setAttribute('aria-live','polite');document.body.appendChild(layer);}
    return layer;
  }
  function enqueueRewardFx(item){rewardFxQueue.push(item);processRewardFxQueue();}
  function processRewardFxQueue(){
    if(rewardFxBusy||!rewardFxQueue.length)return;
    rewardFxBusy=true;
    const item=rewardFxQueue.shift();
    if(item.type==='xp')showXpReward(item,finish);
    else if(item.type==='coins')showCoinReward(item,finish);
    else finish();
    function finish(){rewardFxBusy=false;setTimeout(processRewardFxQueue,100);}
  }
  function makeSparks(host,count=16){
    for(let i=0;i<count;i++){
      const spark=document.createElement('i');spark.className='reward-spark';
      spark.style.setProperty('--angle',`${Math.round(Math.random()*360)}deg`);
      spark.style.setProperty('--distance',`${32+Math.round(Math.random()*48)}px`);
      spark.style.setProperty('--delay',`${Math.round(Math.random()*180)}ms`);
      host.appendChild(spark);
    }
  }
  function animateNumber(node,from,to,duration=900,suffix=''){
    const start=performance.now(),delta=to-from;
    function tick(now){const t=Math.min(1,(now-start)/duration),e=1-Math.pow(1-t,3);node.textContent=`${format(Math.round(from+delta*e))}${suffix}`;if(t<1)requestAnimationFrame(tick);}
    requestAnimationFrame(tick);
  }
  function showXpReward(item,done){
    const layer=ensureRewardLayer(),card=document.createElement('div');card.className='xp-reward-pop';
    card.innerHTML=`<small>⭐ ДОСВІД</small><strong class="xp-reward-value">${format(item.from)} XP</strong><span>+${format(item.amount)} XP</span><div class="xp-mini-track"><i></i></div>`;
    layer.appendChild(card);makeSparks(card,20);haptic('medium');
    requestAnimationFrame(()=>card.classList.add('show'));
    const value=card.querySelector('.xp-reward-value');animateNumber(value,item.from,item.to,1150,' XP');
    const bar=card.querySelector('.xp-mini-track i');requestAnimationFrame(()=>bar.style.width=`${Math.max(4,item.percent||0)}%`);
    document.querySelector('.metrics .progress')?.classList.add('reward-progress-flash');
    setTimeout(()=>{card.classList.add('hide');document.querySelector('.metrics .progress')?.classList.remove('reward-progress-flash');setTimeout(()=>{card.remove();done();},420);},1850);
  }
  function showCoinReward(item,done){
    const layer=ensureRewardLayer(),card=document.createElement('div');card.className='coin-reward-pop';
    card.innerHTML=`<span class="coin-reward-icon">🪙</span><strong>+${format(item.amount)}</strong>`;
    layer.appendChild(card);for(let i=0;i<7;i++){const coin=document.createElement('i');coin.className='flying-coin';coin.textContent='🪙';coin.style.setProperty('--i',i);card.appendChild(coin);}haptic('light');
    requestAnimationFrame(()=>card.classList.add('show'));
    document.querySelector('.coin-pill')?.classList.add('coin-pill-bump');
    setTimeout(()=>{card.classList.add('hide');document.querySelector('.coin-pill')?.classList.remove('coin-pill-bump');setTimeout(()=>{card.remove();done();},360);},1450);
  }
  function queueXpReward(u,amount,fromXp){
    if(!u||u.id!==state.currentUserId||amount<=0)return;
    enqueueRewardFx({type:'xp',amount,from:fromXp,to:Number(u.xp||0),percent:xpPct(u)});
  }
  function observeRewardChanges(){
    const next=currentRewardSnapshot();if(!next){rewardSnapshot=null;return;}
    const prev=rewardSnapshot;
    if(prev&&prev.userId===next.userId){
      const coinDelta=next.coins-prev.coins;if(coinDelta>0)enqueueRewardFx({type:'coins',amount:coinDelta});
      for(const id of next.achievements){
        if(!prev.achievements.has(id)&&!announcedAchievements.has(id)){
          announcedAchievements.add(id);const a=state.achievements.find(x=>x.id===id);queueAchievementToast(a||{id,icon:'🏆',title:'Нове досягнення',rarity:'Звичайна'});
        }
      }
    }
    rewardSnapshot=next;
  }


  // Stage 8: illustrated achievement icon library extracted from the supplied artwork.
  const ACHIEVEMENT_ICON_LIBRARY={"start":["/assets/achievement-icons/start-welcome.png","/assets/achievement-icons/start-first-step.png","/assets/achievement-icons/start-new-life.png","/assets/achievement-icons/start-story-begins.png","/assets/achievement-icons/start-dont-give-up.png","/assets/achievement-icons/start-you-are-here.png","/assets/achievement-icons/start-hero-born.png"],"streak":["/assets/achievement-icons/streak-3-days.png","/assets/achievement-icons/streak-7-days.png","/assets/achievement-icons/streak-14-days.png","/assets/achievement-icons/streak-21-days.png","/assets/achievement-icons/streak-30-days.png","/assets/achievement-icons/streak-50-days.png","/assets/achievement-icons/streak-75-days.png","/assets/achievement-icons/streak-100-days.png","/assets/achievement-icons/streak-150-days.png","/assets/achievement-icons/streak-200-days.png","/assets/achievement-icons/streak-250-days.png","/assets/achievement-icons/streak-300-days.png","/assets/achievement-icons/streak-365-days.png","/assets/achievement-icons/streak-500-days.png","/assets/achievement-icons/streak-unbreakable.png"],"levels":["/assets/achievement-icons/levels-newbie.png","/assets/achievement-icons/levels-explorer.png","/assets/achievement-icons/levels-adventurer.png","/assets/achievement-icons/levels-seeker.png","/assets/achievement-icons/levels-student.png","/assets/achievement-icons/levels-fighter.png","/assets/achievement-icons/levels-master.png","/assets/achievement-icons/levels-expert.png","/assets/achievement-icons/levels-champion.png","/assets/achievement-icons/levels-hero.png","/assets/achievement-icons/levels-veteran.png","/assets/achievement-icons/levels-legend.png","/assets/achievement-icons/levels-immortal.png","/assets/achievement-icons/levels-myth.png","/assets/achievement-icons/levels-absolute-master.png"],"sport":["/assets/achievement-icons/sport-first-move.png","/assets/achievement-icons/sport-warmup.png","/assets/achievement-icons/sport-active-day.png","/assets/achievement-icons/sport-sport-lover.png","/assets/achievement-icons/sport-strong-spirit.png","/assets/achievement-icons/sport-athlete.png","/assets/achievement-icons/sport-iron-body.png"],"relationship":["/assets/achievement-icons/relationship-first-date.png","/assets/achievement-icons/relationship-care.png","/assets/achievement-icons/relationship-better-together.png","/assets/achievement-icons/relationship-romantic.png","/assets/achievement-icons/relationship-couple-heart.png","/assets/achievement-icons/relationship-reliable-partner.png","/assets/achievement-icons/relationship-happy-family.png","/assets/achievement-icons/relationship-love-without-limits.png"],"family":["/assets/achievement-icons/family-new-member.png","/assets/achievement-icons/family-stronger-together.png","/assets/achievement-icons/family-caring.png","/assets/achievement-icons/family-reliable-shoulder.png","/assets/achievement-icons/family-family-heart.png","/assets/achievement-icons/family-family-support.png","/assets/achievement-icons/family-fortress.png"],"reading":["/assets/achievement-icons/reading-first-book.png","/assets/achievement-icons/reading-reader.png","/assets/achievement-icons/reading-book-lover.png","/assets/achievement-icons/reading-bibliophile.png","/assets/achievement-icons/reading-avid-reader.png","/assets/achievement-icons/reading-sage.png","/assets/achievement-icons/reading-archivist.png","/assets/achievement-icons/reading-living-library.png"],"mind":["/assets/achievement-icons/mind-step-forward.png","/assets/achievement-icons/mind-new-horizons.png","/assets/achievement-icons/mind-aspiration.png","/assets/achievement-icons/mind-strategist.png","/assets/achievement-icons/mind-thinker.png","/assets/achievement-icons/mind-genius.png","/assets/achievement-icons/mind-life-architect.png"],"cinema":["/assets/achievement-icons/cinema-first-film.png","/assets/achievement-icons/cinema-movie-night.png","/assets/achievement-icons/cinema-cinemaniac.png","/assets/achievement-icons/cinema-series-lover.png","/assets/achievement-icons/cinema-genre-expert.png","/assets/achievement-icons/cinema-critic.png","/assets/achievement-icons/cinema-cinema-legend.png","/assets/achievement-icons/cinema-screen-master.png"],"home":["/assets/achievement-icons/home-clean-start.png","/assets/achievement-icons/home-tidy-corner.png","/assets/achievement-icons/home-order-master.png","/assets/achievement-icons/home-home-owner.png","/assets/achievement-icons/home-everything-shines.png","/assets/achievement-icons/home-cleanliness-king.png","/assets/achievement-icons/home-perfect-order.png"],"quests":["/assets/achievement-icons/quests-first-mission.png","/assets/achievement-icons/quests-performer.png","/assets/achievement-icons/quests-adventure-seeker.png","/assets/achievement-icons/quests-conqueror.png","/assets/achievement-icons/quests-quest-master.png","/assets/achievement-icons/quests-great-hero.png","/assets/achievement-icons/quests-invincible.png","/assets/achievement-icons/quests-goal-driven.png"],"gifts":["/assets/achievement-icons/gifts-first-gift.png","/assets/achievement-icons/gifts-good-friend.png","/assets/achievement-icons/gifts-generous-heart.png","/assets/achievement-icons/gifts-giver.png","/assets/achievement-icons/gifts-surprise-master.png","/assets/achievement-icons/gifts-benefactor.png","/assets/achievement-icons/gifts-company-soul.png"],"wheel":["/assets/achievement-icons/wheel-first-spin.png","/assets/achievement-icons/wheel-lucky.png","/assets/achievement-icons/wheel-fortunate.png","/assets/achievement-icons/wheel-fortune-favorite.png","/assets/achievement-icons/wheel-big-win.png","/assets/achievement-icons/wheel-jackpot.png","/assets/achievement-icons/wheel-born-lucky.png","/assets/achievement-icons/wheel-luck-master.png"],"shop":["/assets/achievement-icons/shop-first-purchase.png","/assets/achievement-icons/shop-style-collector.png","/assets/achievement-icons/shop-new-look.png","/assets/achievement-icons/shop-wardrobe-grows.png","/assets/achievement-icons/shop-beauty-lover.png","/assets/achievement-icons/shop-style-icon.png","/assets/achievement-icons/shop-all-mine.png"],"cosmetics":["/assets/achievement-icons/cosmetics-first-frame.png","/assets/achievement-icons/cosmetics-new-effect.png","/assets/achievement-icons/cosmetics-beauty.png","/assets/achievement-icons/cosmetics-stylish.png","/assets/achievement-icons/cosmetics-shining-profile.png","/assets/achievement-icons/cosmetics-unique-style.png","/assets/achievement-icons/cosmetics-living-legend.png","/assets/achievement-icons/cosmetics-style-master.png"],"collections1":["/assets/achievement-icons/collections1-first-sticker.png","/assets/achievement-icons/collections1-first-page.png","/assets/achievement-icons/collections1-collector.png","/assets/achievement-icons/collections1-half-album.png","/assets/achievement-icons/collections1-full-album.png","/assets/achievement-icons/collections1-legend-seeker.png","/assets/achievement-icons/collections1-all-legendary.png"],"collections2":["/assets/achievement-icons/collections2-first-seasonal.png","/assets/achievement-icons/collections2-easter-hero.png","/assets/achievement-icons/collections2-halloween-hunter.png","/assets/achievement-icons/collections2-christmas-miracle.png","/assets/achievement-icons/collections2-absolute-collector.png"],"referrals":["/assets/achievement-icons/referrals-first-friend.png","/assets/achievement-icons/referrals-better-together.png","/assets/achievement-icons/referrals-family-grows.png","/assets/achievement-icons/referrals-big-family.png","/assets/achievement-icons/referrals-home-for-all.png","/assets/achievement-icons/referrals-people-connector.png","/assets/achievement-icons/referrals-community-leader.png","/assets/achievement-icons/referrals-mentor.png"],"special":["/assets/achievement-icons/special-early-user.png","/assets/achievement-icons/special-founder.png","/assets/achievement-icons/special-holiday-guest.png","/assets/achievement-icons/special-season-winner.png","/assets/achievement-icons/special-myhabbit-veteran.png","/assets/achievement-icons/special-one-year.png","/assets/achievement-icons/special-two-years.png","/assets/achievement-icons/special-three-years.png"],"mythic":["/assets/achievement-icons/mythic-architect-of-fate.png","/assets/achievement-icons/mythic-infinity.png","/assets/achievement-icons/mythic-time-keeper.png","/assets/achievement-icons/mythic-heart-myhabbit.png","/assets/achievement-icons/mythic-absolute.png"],"secret":["/assets/achievement-icons/secret-secret-01.png","/assets/achievement-icons/secret-secret-02.png","/assets/achievement-icons/secret-secret-03.png","/assets/achievement-icons/secret-secret-04.png","/assets/achievement-icons/secret-secret-05.png","/assets/achievement-icons/secret-secret-06.png","/assets/achievement-icons/secret-secret-07.png","/assets/achievement-icons/secret-secret-08.png","/assets/achievement-icons/secret-secret-09.png","/assets/achievement-icons/secret-secret-10.png","/assets/achievement-icons/secret-secret-11.png"]};
  const ACHIEVEMENT_ICON_CATEGORY_ALIASES={"general":"start","levels":"levels","streak":"streak","discipline":"streak","sport":"sport","health":"sport","relationship":"relationship","family":"family","reading":"reading","mind":"mind","creativity":"mind","cinema":"cinema","home":"home","shop":"shop","coins":"wheel","finance":"shop","secret":"secret","legendary":"mythic","collections":"collections1"};
  const ACHIEVEMENT_ICON_BY_ID={
    a1:'/assets/achievement-icons/start-first-step.png',a2:'/assets/achievement-icons/streak-7-days.png',a3:'/assets/achievement-icons/relationship-care.png',a4:'/assets/achievement-icons/home-home-owner.png',a5:'/assets/achievement-icons/quests-quest-master.png',a6:'/assets/achievement-icons/sport-athlete.png',a7:'/assets/achievement-icons/family-family-heart.png',a8:'/assets/achievement-icons/reading-sage.png',a9:'/assets/achievement-icons/secret-secret-01.png',
    ref_first_friend:'/assets/achievement-icons/referrals-first-friend.png',ref_better_together:'/assets/achievement-icons/referrals-better-together.png',ref_family_grows:'/assets/achievement-icons/referrals-family-grows.png',ref_big_family:'/assets/achievement-icons/referrals-big-family.png',ref_home_for_all:'/assets/achievement-icons/referrals-home-for-all.png',ref_people_connector:'/assets/achievement-icons/referrals-people-connector.png',ref_community_leader:'/assets/achievement-icons/referrals-community-leader.png',ref_community_legend:'/assets/achievement-icons/referrals-mentor.png',
    myth_architect_of_fate:'/assets/achievement-icons/mythic-architect-of-fate.png',myth_infinity:'/assets/achievement-icons/mythic-infinity.png',myth_time_keeper:'/assets/achievement-icons/mythic-time-keeper.png',myth_heart_myhabbit:'/assets/achievement-icons/mythic-heart-myhabbit.png',myth_absolute:'/assets/achievement-icons/mythic-absolute.png',
    a_roulette_7:'/assets/achievement-icons/wheel-first-spin.png',a_roulette_all:'/assets/achievement-icons/wheel-fortune-favorite.png',a_jackpot:'/assets/achievement-icons/wheel-jackpot.png'
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
  const ACHIEVEMENT_ASSET_VERSION='1201';
  function achievementIconHtml(achievement,className='achievement-art'){
    const src=achievementIconAsset(achievement);
    const fallback=escapeHtml((typeof achievement?.icon==='string'&&!achievement.icon.startsWith('/'))?achievement.icon:'🏆');
    if(src){
      const versioned=`${src}${src.includes('?')?'&':'?'}v=${ACHIEVEMENT_ASSET_VERSION}`;
      return `<img class="${className}" src="${versioned}" alt="" loading="eager" decoding="async" data-achievement-fallback="${fallback}">`;
    }
    return `<span class="${className} achievement-emoji">${fallback}</span>`;
  }

  function activityIconHtml(icon){
    const value=String(icon||'✨').trim();
    if(/^\/(?:assets|icons)\/[a-z0-9_./?=&%-]+$/i.test(value)){
      const safe=escapeHtml(value);
      return `<img class="activity-icon-image" src="${safe}" alt="" loading="lazy" decoding="async" data-activity-fallback="🏆">`;
    }
    if(/^(?:https?:\/\/|\/|\.\/|\.\.\/)/i.test(value))return '<span class="activity-icon-fallback">🏆</span>';
    return `<span class="activity-icon-fallback">${escapeHtml(value.slice(0,4)||'✨')}</span>`;
  }

  // Missing images are replaced without inline handlers, so strict CSP and Safari stay stable.
  document.addEventListener('error',(event)=>{
    const image=event.target;
    if(!(image instanceof HTMLImageElement))return;
    if(image.matches('.achievement-art,.achievement-toast-art')){
      const fallback=document.createElement('span');
      fallback.className=`${image.className} achievement-emoji achievement-image-fallback`;
      fallback.textContent=image.dataset.achievementFallback||'🏆';
      image.replaceWith(fallback);
      return;
    }
    if(image.matches('.activity-icon-image')){
      const fallback=document.createElement('span');
      fallback.className='activity-icon-fallback';
      fallback.textContent=image.dataset.activityFallback||'🏆';
      image.replaceWith(fallback);
    }
  },true);

  // Runtime state must be initialized only after achievement icon maps exist.
  // normalizeState() assigns icon assets, so calling it earlier triggers the
  // temporal-dead-zone error for ACHIEVEMENT_ICON_BY_ID.
  const tg = window.Telegram?.WebApp || null;
  const telegramInitData = tg?.initData || '';
  const telegramUser = tg?.initDataUnsafe?.user || null;
  const isTelegramWebApp = Boolean(telegramInitData && telegramUser?.id);
  const startParam = tg?.initDataUnsafe?.start_param || '';
  const urlInviteToken = new URLSearchParams(location.search).get('invite') || '';
  const telegramInviteToken = startParam.startsWith('invite_') ? startParam.slice(7) : '';
  const inviteToken = urlInviteToken || telegramInviteToken;
  if (tg) { try { tg.ready(); tg.expand(); } catch {} }
  let state = loadState();
  let auth = loadAuth();
  try {
    restoreActiveAccount();
    normalizeState();
  } catch (bootStateError) {
    console.error('State migration recovery:', bootStateError);
    try {
      const broken = localStorage.getItem(STORAGE);
      if (broken) localStorage.setItem(`${STORAGE}:broken:${Date.now()}`, broken);
    } catch {}
    state = clone(seed);
    auth = loadAuth();
    try { normalizeState(); } catch (seedError) { console.error('Seed recovery:', seedError); }
    try { localStorage.setItem(STORAGE, JSON.stringify(state)); } catch {}
  }
  const requestedScreen = new URLSearchParams(location.search).get('screen') || '';
  // A saved account always wins over an old landing/auth URL left in browser history.
  // This prevents registered users from intermittently seeing the public demo/test page.
  let route = auth
    ? ((!requestedScreen || ['landing','auth'].includes(requestedScreen)) ? 'dashboard' : requestedScreen)
    : (requestedScreen || ((telegramInitData || inviteToken) ? 'auth' : 'landing'));
  if(auth && route==='dashboard' && requestedScreen!==route){
    try{history.replaceState({},'', '/?screen=dashboard');}catch{}
  }
  let authMode = (telegramInitData || inviteToken) ? 'join' : 'create';
  let inviteInfo = null;
  let publicUpdateName='myHabbit beta';

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
  function achievementChime(rarity='common'){playCozySound('achievement','important',rarity);cozyHaptic(rarity==='legendary'||rarity==='mythic'?'strong':'medium');}
  function queueAchievementToast(achievement){
    if(!achievement)return;
    const item={...achievement,title:achievement.title||'Нове досягнення',rarity:achievement.rarity||'Звичайна',rewardXp:Number(achievement.rewardXp||0)};
    CozyEvents.emit('achievement',item);
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
    const xpBefore=u.xp;
    u.xp+=gained;let levels=0;
    while(u.xp>=xpRequiredForLevel(u.level)){
      u.xp-=xpRequiredForLevel(u.level);u.level+=1;levels+=1;
      u.coins=Number(u.coins||0)+50;
      u.activity=Array.isArray(u.activity)?u.activity:[];
      u.activity.unshift(`Новий рівень ${u.level} · ${source}`); playCozySound('levelup','important');cozyHaptic('strong');CozyEvents.emit('levelup',{userId:u.id,level:u.level,source});
      state.history.unshift({icon:'⭐',text:`${u.name} досяг(ла) ${u.level} рівня`,time:'Щойно'});
    }
    queueXpReward(u,gained,xpBefore);
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
  function skillLabel(k){const uk={family:'Наші разом',relationship:'Близькість',home:'Наш куточок',sport:'Руханка',health:'Сили й баланс',mind:'Цікавинки',reading:'Книжкові мандри',cinema:'Кіновечори',creativity:'Натхнення',finance:'Скарбничка',discipline:'Мій ритм',care:'Тепло',growth:'Нові відкриття'};const en={family:'Together',relationship:'Connection',home:'Home',sport:'Movement',health:'Health & balance',mind:'Mind',reading:'Reading',cinema:'Movie nights',creativity:'Creativity',finance:'Finance',discipline:'Discipline',care:'Care',growth:'Growth'};return (appLanguage==='en'?en:uk)[k]||k;}
  function skillIcon(k){return {family:'👨‍👩‍👧‍👦',relationship:'💞',home:'🏠',sport:'💪',health:'❤️',mind:'🧠',reading:'📖',cinema:'🎬',creativity:'🎨',finance:'💰',discipline:'🔥',care:'💞',growth:'🧠'}[k]||'⭐';}
  function rarityLabel(r){return {common:'Звичайна',uncommon:'Незвичайна',rare:'Рідкісна',epic:'Епічна',legendary:'Легендарна',secret:'Секретна'}[r]||r;}
  function questFromCatalog(q){const skills=q.rewards?.skills||{};const primary=Object.keys(skills)[0]||q.category||'discipline';return {id:q.id,title:q.title,icon:skillIcon(q.category),description:q.description||'Завдання з бібліотеки myHabbit',type:q.type||'personal',participants:['pair','coop'].includes(q.type)?2:1,claimedBy:[],rewardCoins:Number(q.rewards?.coins||0),rewardXp:Number(q.rewards?.xp||0),skill:primary,skillXp:Number(skills[primary]||0),skillRewards:skills,status:q.active===false?'paused':'active',limited:q.type==='limited',stock:q.type==='limited'?1:null,difficulty:q.difficulty,rarity:q.rarity,repeatType:q.repeatType||'none',unlockLevel:Number(q.unlockLevel||1),catalog:true,source:'catalog',resourceUrl:cleanResourceUrl(q.resourceUrl||q.referenceUrl||'')};}
  function achievementFromCatalog(a){
    const target=Number(a.condition?.value||a.targetValue||1);
    const achievement={id:a.id,icon:'🏆',title:String(a.title||'Досягнення').replace(/^\p{Extended_Pictographic}+\s*/u,''),description:a.description||'Виконай умову досягнення.',rarity:rarityLabel(a.rarity),target,progress:0,category:a.category,hidden:Boolean(a.hidden),catalog:true,active:a.active!==false,condition:a.condition||null,reward:a.reward||null,resourceUrl:cleanResourceUrl(a.resourceUrl||a.referenceUrl||'')};
    achievement.icon=achievementIconAsset(achievement)||achievement.icon;
    return achievement;
  }

  function achievementMetric(u,type){
    const stats=u?.stats||{};
    if(type==='questsCompleted')return Number(stats.questsCompleted||0);
    if(type==='purchasesCompleted')return Number(stats.purchasesCompleted||0);
    if(type==='levelReached')return Number(u?.level||1);
    if(type==='streakDays')return Number(u?.streak||0);
    if(type==='coinsEarned')return Number(stats.coinsEarned||0);
    if(type==='pagesRead')return Number(stats.pagesRead||0);
    if(type==='filmsWatched')return Number(stats.filmsWatched||0);
    if(type==='legendaryQuestsCompleted')return Number(stats.legendaryQuestsCompleted||0);
    const m=String(type||'').match(/^(.+)QuestsCompleted$/);
    return m?Number(stats[`${m[1]}QuestsCompleted`]||0):null;
  }
  const QUEST_MILESTONE_ACHIEVEMENTS=[
    {id:'quest_first_done',icon:'🌱',title:'Перше виконане завдання',description:'Виконати перше завдання',rarity:'Звичайна',target:1,condition:{type:'questsCompleted',value:1},category:'general',rewardXp:25},
    {id:'quest_done_5',icon:'🖐️',title:'Перші п’ять',description:'Виконати 5 завдань',rarity:'Звичайна',target:5,condition:{type:'questsCompleted',value:5},category:'general',rewardXp:50},
    {id:'quest_done_10',icon:'✨',title:'Добрий початок',description:'Виконати 10 завдань',rarity:'Рідкісна',target:10,condition:{type:'questsCompleted',value:10},category:'general',rewardXp:75},
    {id:'quest_done_25',icon:'🧭',title:'Увійшов у ритм',description:'Виконати 25 завдань',rarity:'Рідкісна',target:25,condition:{type:'questsCompleted',value:25},category:'general',rewardXp:125},
    {id:'quest_done_50',icon:'🏅',title:'Пів сотні справ',description:'Виконати 50 завдань',rarity:'Епічна',target:50,condition:{type:'questsCompleted',value:50},category:'general',rewardXp:200},
    {id:'quest_done_100',icon:'🏆',title:'Сотня перемог',description:'Виконати 100 завдань',rarity:'Епічна',target:100,condition:{type:'questsCompleted',value:100},category:'general',rewardXp:350},
    {id:'quest_done_250',icon:'👑',title:'Майстер звичок',description:'Виконати 250 завдань',rarity:'Легендарна',target:250,condition:{type:'questsCompleted',value:250},category:'general',rewardXp:600},
    {id:'quest_done_500',icon:'🌟',title:'Незламний виконавець',description:'Виконати 500 завдань',rarity:'Легендарна',target:500,condition:{type:'questsCompleted',value:500},category:'general',rewardXp:1000}
  ];
  function cleanAchievementCatalog(){
    const protectedIds=new Set(QUEST_MILESTONE_ACHIEVEMENTS.map(a=>a.id));
    const seenConditions=new Set(),seenTitles=new Set(),clean=[];
    for(const a of state.achievements||[]){
      if(!a||!a.id)continue;
      const normalized=String(a.title||'').toLowerCase().replace(/[^a-zа-яіїєґ0-9]+/g,' ').trim();
      const type=a.condition?.type,value=Number(a.condition?.value||a.target||0);
      const generated=/^achievement_/.test(a.id)&&/— етап \d+/i.test(String(a.title||''));
      if(generated){
        if(!type)continue;
        const key=`${type}:${value}`;
        if(seenConditions.has(key))continue;
        seenConditions.add(key);
      }else if(normalized){
        if(seenTitles.has(normalized)&&!protectedIds.has(a.id))continue;
        seenTitles.add(normalized);
      }
      clean.push(a);
    }
    for(const fresh of QUEST_MILESTONE_ACHIEVEMENTS){
      const old=clean.find(a=>a.id===fresh.id);
      if(old)Object.assign(old,fresh);else clean.push({...fresh,progress:0,active:true});
    }
    state.achievements=clean;
    const valid=new Set(clean.map(a=>a.id));
    for(const u of state.users||[]){u.achievements=(u.achievements||[]).filter(id=>valid.has(id));u.featuredAchievements=(u.featuredAchievements||[]).filter(id=>valid.has(id));}
  }

  function evaluateAchievements(u=currentUser()){
    if(!u)return [];
    const unlocked=[];
    for(const a of state.achievements||[]){
      const type=a?.condition?.type;if(!type||type==='hiddenCondition'||a.active===false)continue;
      const value=achievementMetric(u,type);if(value==null)continue;
      a.progress=Math.max(Number(a.progress||0),value);
      if(value>=Math.max(1,Number(a.target||a.condition?.value||1))&&!u.achievements.includes(a.id)){
        if(unlockAchievement(u,a.id)){if(Number(a.rewardXp||0)>0)addXp(u,Number(a.rewardXp),`ачівка «${a.title}»`);unlocked.push(a.id);}
      }
    }
    return unlocked;
  }
  function shopFromCatalog(i){return {id:i.id,title:i.title,icon:{family:'👨‍👩‍👧‍👦',collective:'🤝',theme:'🎨',avatar:'🙂',frame:'🖼️',personal:'🎁'}[i.type]||'🎁',description:i.description||'Нагорода з каталогу myHabbit.',price:Number(i.price||0),stock:i.stock==null?999:Number(i.stock),type:i.type||'personal',catalog:true,source:'catalog',resourceUrl:cleanResourceUrl(i.resourceUrl||i.referenceUrl||'')};}
  function openOfflineDb(){
    return new Promise((resolve,reject)=>{
      if(!('indexedDB' in window))return resolve(null);
      const request=indexedDB.open(OFFLINE_DB,1);
      request.onupgradeneeded=()=>{const db=request.result;if(!db.objectStoreNames.contains(OFFLINE_STORE))db.createObjectStore(OFFLINE_STORE);};
      request.onsuccess=()=>resolve(request.result);
      request.onerror=()=>reject(request.error);
    });
  }
  async function idbGet(key){
    try{const db=await openOfflineDb();if(!db)return null;return await new Promise((resolve,reject)=>{const tx=db.transaction(OFFLINE_STORE,'readonly');const req=tx.objectStore(OFFLINE_STORE).get(key);req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>reject(req.error);});}catch{return null;}
  }
  async function idbSet(key,value){
    try{const db=await openOfflineDb();if(!db)return false;await new Promise((resolve,reject)=>{const tx=db.transaction(OFFLINE_STORE,'readwrite');tx.objectStore(OFFLINE_STORE).put(value,key);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);});return true;}catch{return false;}
  }
  async function fetchJson(path){const r=await fetch(path,{cache:'force-cache'});if(!r.ok)throw new Error(`Не вдалося завантажити ${path}`);return r.json();}
  async function loadContentLibrary(){
    try{
      const idbCached=await idbGet(CONTENT_CACHE);
      if(idbCached?.version===CONTENT_VERSION&&idbCached.quests?.length){mergeContent(idbCached);return;}
      const cached=JSON.parse(localStorage.getItem(CONTENT_CACHE)||'null');
      if(cached?.version===CONTENT_VERSION&&cached.quests?.length){await idbSet(CONTENT_CACHE,cached);mergeContent(cached);return;}
      const index=await fetchJson('/content/index.json');
      const questSets=await Promise.all(QUEST_CATEGORIES.map(c=>fetchJson(`/content/quests/${c}.json`)));
      const dailySets=await Promise.all(['relationship','health','sport','home','discipline','reading'].map(c=>fetchJson(`/content/daily/${c}.json`)));
      const weeklySets=await Promise.all(['creativity','finance','sport','home','family','cinema'].map(c=>fetchJson(`/content/weekly/${c}.json`)));
      const achievementSets=await Promise.all(ACHIEVEMENT_FILES.map(c=>fetchJson(`/content/achievements/${c}.json`)));
      const shop=await fetchJson('/content/shop/catalog.json');
      const level=currentUser()?.level||1;
      const pick=(arr,n)=>arr.filter(x=>x.active!==false&&Number(x.unlockLevel||1)<=level).slice(0,n);
      const content={version:index.libraryVersion||CONTENT_VERSION,index,quests:[...questSets.flatMap(x=>pick(x,18)),...dailySets.flatMap(x=>pick(x,8)),...weeklySets.flatMap(x=>pick(x,6))].map(questFromCatalog),achievements:achievementSets.flatMap(x=>x.filter(a=>a.active!==false).slice(0,30)).map(achievementFromCatalog),shop:shop.filter(i=>i.active!==false).slice(0,120).map(shopFromCatalog)};
      await idbSet(CONTENT_CACHE,content);
      try{localStorage.setItem(CONTENT_CACHE,JSON.stringify(content));}catch{}
      mergeContent(content);
    }catch(e){console.warn('Content library:',e);}
  }
  function mergeContent(content){
    const merge=(base,extra)=>{const map=new Map(base.map(x=>[x.id,x]));for(const x of extra)if(!map.has(x.id))map.set(x.id,x);return [...map.values()];};
    state.quests=merge(state.quests||[],content.quests||[]);state.achievements=merge(state.achievements||[],content.achievements||[]);state.shop=merge(state.shop||[],content.shop||[]);
    state.contentLibrary={version:content.version,counts:content.index?.counts||{},loadedAt:new Date().toISOString()};safeJsonWrite(STORAGE,state);render();
  }

  async function api(path, options={}){
    const headers={'content-type':'application/json',...(options.headers||{})};
    if(auth?.token) headers.authorization=`Bearer ${auth.token}`;
    const res=await fetch(path,{cache:'no-store',...options,headers});
    const data=await res.json().catch(()=>({}));
    if(!res.ok) throw new Error(data.error||'Помилка сервера');
    return data;
  }
  function localDay(){
    const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Kyiv',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()).reduce((a,p)=>(p.type!=='literal'&&(a[p.type]=p.value),a),{});
    return `${parts.year}-${parts.month}-${parts.day}`;
  }
  function kyivHour(){return Number(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Kyiv',hour:'2-digit',hour12:false}).format(new Date()));}
  function dailySyncIsDue(){
    const last=localStorage.getItem(LAST_DAILY_SYNC)||'';
    return kyivHour()>=9&&last!==localDay();
  }
  async function runDailyServerSync(){
    if(!auth?.token||auth?.demo||!dailySyncIsDue())return false;
    const pushed=await submitDailySnapshot();
    if(!pushed)return false;
    await pullRemote();
    localStorage.setItem(LAST_DAILY_SYNC,localDay());
    return true;
  }
  function mergeUniqueActivity(primary=[],secondary=[]){return [...new Set([...(primary||[]),...(secondary||[])])].slice(0,100);}
  function maintainDailyActionRetention(){
    state.meta=state.meta||{};const day=localDay();
    if(state.meta.actionRetentionDay&&state.meta.actionRetentionDay!==day){
      (state.users||[]).forEach(u=>{u.activity=(u.activity||[]).slice(0,30);});
      state.history=(state.history||[]).slice(0,60);
    }
    state.meta.actionRetentionDay=day;
  }
  function compactDailyData(){
    const u=currentUser();
    return {
      user:{id:u.id,name:u.name,avatar:u.avatar,role:u.role,telegramLinked:u.telegramLinked,telegramUsername:u.telegramUsername,createdAt:u.createdAt,importantDates:(u.importantDates||[]).slice(0,20),level:u.level,xp:u.xp,coins:u.coins,streak:u.streak,skills:u.skills,achievements:u.achievements,activity:(u.activity||[]).slice(0,20)},
      family:{name:state.family.name,code:state.family.code,level:state.family.level,xp:state.family.xp,coins:state.family.coins},
      quests:(state.quests||[]).map(q=>({id:q.id,title:q.title,icon:q.icon,description:q.description,type:q.type,participants:q.participants,claimedBy:q.claimedBy,rewardCoins:q.rewardCoins,rewardXp:q.rewardXp,skill:q.skill,skillXp:q.skillXp,status:q.status,limited:q.limited,stock:q.stock,difficulty:q.difficulty,source:q.source,dailyDay:q.dailyDay,recurring:q.recurring})),
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
  let serverRevision=0;
  let livePullTimer=0;
  let liveSessionStartedAt=0;
  let lastFamilyPullAt=0;
  let lastUserActivityAt=Date.now();
  const FAST_REFRESH_MS=20000;
  const QUIET_REFRESH_MS=300000;
  const ACTIVE_WINDOW_MS=300000;
  const FAST_WINDOW_MS=60000;
  let immediateSyncTimer=0;
  let familySyncBusy=false;
  let familySyncAgain=false;
  const familyChannel='BroadcastChannel' in window?new BroadcastChannel('myhabbit-family-live'):null;
  function stateSignature(value=state){
    try{return JSON.stringify({family:value.family,users:value.users,quests:value.quests,shop:value.shop,history:value.history,profileStickers:value.profileStickers});}catch{return String(Date.now());}
  }
  function broadcastLocalState(){
    try{familyChannel?.postMessage({type:'state',accountId:accountId(),state,at:Date.now()});}catch{}
  }
  async function pullRemote(){
    if(!auth?.token)return false;
    try{
      const data=await api('/api/family/state');
      if(!data.state)return false;
      const changed=stateSignature(data.state)!==stateSignature(state);
      const localDayBefore=localDay(),localHistory=(state.history||[]).slice(),localActivity=new Map((state.users||[]).map(u=>[u.id,(u.activity||[]).slice()]));
      state=data.state;serverRevision=Number(data.revision||serverRevision||0);normalizeState();
      if((state.meta?.actionRetentionDay||localDayBefore)===localDayBefore){state.history=mergeUniqueActivity(localHistory,state.history);(state.users||[]).forEach(u=>{u.activity=mergeUniqueActivity(localActivity.get(u.id)||[],u.activity||[]);});}
      observeRewardChanges();
      lastFamilyPullAt=Date.now();
      safeJsonWrite(STORAGE,state);persistAccount();localStorage.setItem(LAST_SERVER_PULL,new Date().toISOString());
      if(changed)broadcastLocalState();
      return changed;
    }catch{return false;}
  }
  async function pushLocalStateNow(){
    if(!auth?.token||auth?.demo)return false;
    if(familySyncBusy){familySyncAgain=true;return false;}
    familySyncBusy=true;
    try{
      const data=await api('/api/family/state',{method:'PUT',body:JSON.stringify({state,baseRevision:serverRevision})});
      serverRevision=Number(data.revision||serverRevision||0);
      localStorage.removeItem(DAILY_QUEUE);
      localStorage.setItem(LAST_SERVER_PULL,new Date().toISOString());
      return true;
    }catch{return false;}
    finally{
      familySyncBusy=false;
      if(familySyncAgain){familySyncAgain=false;scheduleImmediateFamilySync(250);}
    }
  }
  function scheduleImmediateFamilySync(delay=180){
    clearTimeout(immediateSyncTimer);
    if(!auth?.token||auth?.demo)return;
    immediateSyncTimer=setTimeout(()=>pushLocalStateNow().catch(()=>{}),delay);
  }
  async function pullRemoteAndRender({force=false}={}){
    if(!auth?.token||auth?.demo||document.visibilityState==='hidden')return false;
    const now=Date.now();
    if(!force&&now-lastFamilyPullAt<15000)return false;
    const changed=await pullRemote();
    if(changed)render();
    return changed;
  }
  function scheduleFamilyRefresh(){
    clearTimeout(livePullTimer);
    if(!auth?.token||auth?.demo||document.visibilityState==='hidden')return;
    const now=Date.now();
    if(now-lastUserActivityAt>ACTIVE_WINDOW_MS)return;
    const delay=now-liveSessionStartedAt<FAST_WINDOW_MS?FAST_REFRESH_MS:QUIET_REFRESH_MS;
    livePullTimer=setTimeout(async()=>{
      await pullRemoteAndRender().catch(()=>{});
      scheduleFamilyRefresh();
    },delay);
  }
  function noteFamilyActivity(){
    lastUserActivityAt=Date.now();
    if(!liveSessionStartedAt)liveSessionStartedAt=Date.now();
    scheduleFamilyRefresh();
  }
  function startLiveFamilyRefresh(){
    clearTimeout(livePullTimer);
    if(!auth?.token||auth?.demo)return;
    liveSessionStartedAt=Date.now();
    lastUserActivityAt=Date.now();
    // Refresh must paint local state first. A delayed, throttled pull avoids
    // duplicate Durable Object requests during reload/PWA activation.
    setTimeout(()=>pullRemoteAndRender().catch(()=>{}).finally(scheduleFamilyRefresh),2500);
  }
  familyChannel?.addEventListener('message',event=>{
    const msg=event.data||{};
    if(msg.type!=='state'||msg.accountId!==accountId()||!msg.state)return;
    if(stateSignature(msg.state)===stateSignature(state))return;
    state=msg.state;normalizeState();observeRewardChanges();safeJsonWrite(STORAGE,state);persistAccount();render();
  });
  ['pointerdown','keydown','touchstart'].forEach(type=>window.addEventListener(type,noteFamilyActivity,{passive:true}));
  window.addEventListener('focus',()=>{noteFamilyActivity();pullRemoteAndRender().catch(()=>{});});
  window.addEventListener('online',()=>{noteFamilyActivity();pushLocalStateNow().then(()=>pullRemoteAndRender()).catch(()=>{});});
  document.addEventListener('visibilitychange',()=>{
    if(document.visibilityState==='visible'){noteFamilyActivity();pullRemoteAndRender().catch(()=>{});}
    else clearTimeout(livePullTimer);
  });
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
      if(last)last.textContent=data.lastProcessedAt?new Date(data.lastProcessedAt).toLocaleString(currentLocale()):'Ще не виконувалось';
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



  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    document.querySelector('[data-action="install-pwa-now"]')?.classList.remove('hidden');
  });
  window.addEventListener('appinstalled', () => {
    localStorage.setItem(PWA_ONBOARDING_SEEN, 'installed');
    document.querySelector('.pwa-install-guide')?.remove();
    deferredInstallPrompt = null;
    showToast('myHabbit встановлено на пристрій ✨');
  });

  function isStandalonePwa(){
    return window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;
  }
  function isEmbeddedWebView(){
    const ua=navigator.userAgent||'';
    const ref=document.referrer||'';
    if(window.Telegram?.WebApp?.initData || window.ReactNativeWebView || window.webkit?.messageHandlers?.myHabbit)return true;
    if(/;\s?wv\)|\bwv\b|Version\/\d+(?:\.\d+)*\s+Chrome\/|FBAN|FBAV|Instagram|Messenger|Line\/|Twitter|TikTok|Snapchat|Pinterest|LinkedInApp|GSA\//i.test(ua))return true;
    if(/Telegram|facebook|instagram|messenger|tiktok/i.test(ref))return true;
    return false;
  }
  function shouldOfferPwaInstall(){
    return !isStandalonePwa() && !isEmbeddedWebView();
  }
  function pwaPlatform(){
    const ua=navigator.userAgent||'';
    if(/iPhone|iPad|iPod/i.test(ua))return 'ios';
    if(/Android/i.test(ua))return 'android';
    return 'desktop';
  }
  function pwaGuideSlides(){
    const platform=pwaPlatform();
    const deviceGuide=platform==='ios'
      ? '<div class="pwa-step-list"><span><b>1</b>Відкрийте сторінку саме у Safari</span><span><b>2</b>Натисніть кнопку «Поділитися» ⤴</span><span><b>3</b>Оберіть «На початковий екран»</span><span><b>4</b>Натисніть «Додати»</span></div>'
      : platform==='android'
        ? '<div class="pwa-step-list"><span><b>1</b>Натисніть «Встановити зараз» нижче</span><span><b>2</b>Якщо кнопки немає — відкрийте меню Chrome ⋮</span><span><b>3</b>Оберіть «Встановити застосунок» або «Додати на головний екран»</span></div>'
        : '<div class="pwa-step-list"><span><b>1</b>Натисніть значок встановлення в адресному рядку</span><span><b>2</b>Або відкрийте меню Chrome / Edge</span><span><b>3</b>Оберіть «Install myHabbit»</span><span><b>4</b>За бажанням закріпіть застосунок на панелі задач</span></div>';
    const title=platform==='ios'?'Встановлення на iPhone':platform==='android'?'Встановлення на Android':'Встановлення на Windows';
    const icon=platform==='ios'?'🍎':platform==='android'?'🤖':'🖥️';
    return [
      `<div class="pwa-guide-visual"><span class="pwa-app-icon">✦</span><span class="pwa-guide-arrow">→</span><span class="pwa-home-icon">⌂</span></div><h2>myHabbit завжди поруч</h2><p>Додайте застосунок на пристрій, щоб відкривати його окремою іконкою, швидше запускати та користуватися офлайн.</p>`,
      `<div class="pwa-guide-device ${platform}"><span>${icon}</span><i>${title}</i></div><div class="pwa-platform-help">${deviceGuide}</div>`,
      `<div class="pwa-ready-mark">✓</div><h2>Готово до сімейної пригоди</h2><p>Після встановлення запускайте myHabbit з іконки. Також можна продовжити зараз у браузері — ваші налаштування не загубляться.</p>`
    ];
  }
  function renderPwaGuide(){
    const guide=document.querySelector('.pwa-install-guide');
    if(!guide)return;
    const slides=pwaGuideSlides();
    pwaGuideStep=Math.max(0,Math.min(slides.length-1,pwaGuideStep));
    guide.querySelector('.pwa-guide-content').innerHTML=slides[pwaGuideStep];
    guide.querySelector('.pwa-guide-progress').innerHTML=slides.map((_,i)=>`<i class="${i===pwaGuideStep?'active':''}"></i>`).join('');
    const prev=guide.querySelector('[data-action="pwa-guide-prev"]');
    const next=guide.querySelector('[data-action="pwa-guide-next"]');
    const install=guide.querySelector('[data-action="install-pwa-now"]');
    if(prev)prev.hidden=pwaGuideStep===0;
    if(next)next.textContent=pwaGuideStep===slides.length-1?'Перейти до входу':'Далі';
    if(install){
      const platform=pwaPlatform();
      install.classList.toggle('hidden',pwaGuideStep!==1 || platform==='ios' || !deferredInstallPrompt);
    }
  }
  function showPwaInstallGuide(){
    if(auth || inviteToken || !shouldOfferPwaInstall()){
      if(isStandalonePwa())localStorage.setItem(PWA_ONBOARDING_SEEN,'installed');
      return;
    }
    if(localStorage.getItem(PWA_ONBOARDING_SEEN))return;
    if(document.querySelector('.pwa-install-guide'))return;
    pwaGuideStep=0;
    document.body.insertAdjacentHTML('beforeend',`<div class="pwa-install-guide" role="dialog" aria-modal="true" aria-label="Як встановити myHabbit"><div class="pwa-guide-card"><button class="pwa-guide-skip" data-action="pwa-guide-skip">Пропустити</button><div class="pwa-guide-progress"></div><div class="pwa-guide-content"></div><div class="pwa-guide-actions"><button class="btn" data-action="pwa-guide-prev" hidden>Назад</button><button class="btn primary hidden" data-action="install-pwa-now">Встановити застосунок</button><button class="btn primary" data-action="pwa-guide-next">Далі</button></div></div></div>`);
    document.querySelectorAll('.pwa-install-guide [data-action]').forEach(el=>el.addEventListener('click',()=>action(el.dataset.action,el)));
    renderPwaGuide();
  }
  async function installPwaNow(){
    if(!deferredInstallPrompt){showToast('Відкрийте меню браузера та оберіть «Встановити застосунок»');return;}
    deferredInstallPrompt.prompt();
    const choice=await deferredInstallPrompt.userChoice.catch(()=>null);
    if(choice?.outcome==='accepted')localStorage.setItem(PWA_ONBOARDING_SEEN,'installed');
    deferredInstallPrompt=null;
    renderPwaGuide();
  }

  function go(next){route=next;history.replaceState({},'',next==='landing'?'/' : `/?screen=${next}`);render();scrollTo(0,0);}
  function shell(content,title,subtitle){
    const u=currentUser();
    const nav=navItems().map(([id,icon,label])=>`<button data-route="${id}" class="${route===id?'active':''}"><span class="nav-icon">${icon}</span>${label}</button>`).join('');
    const sessionAction=auth?.demo?'<button class="btn danger" data-action="exit-demo">Вийти з демо</button>':'<button class="btn danger" data-action="logout">Вийти</button>';
    const demoBanner=auth?.demo?'<div class="demo-banner"><div><strong>Демо-режим</strong><span>Зміни зберігаються лише на цьому пристрої.</span></div><button class="btn small" data-action="exit-demo">Вийти з демо</button></div>':'';
    return `<div class="app-layout"><main class="main">${demoBanner}<header class="topbar"><div class="top-title"><h1>${title}</h1><p>${subtitle}</p></div><div class="top-actions"><label class="language-switch" title="Мова інтерфейсу"><span>🌐</span><select data-language-select><option value="uk" ${appLanguage==='uk'?'selected':''}>UA</option><option value="en" ${appLanguage==='en'?'selected':''}>EN</option></select></label><span class="coin-pill">🪙 ${format(u.coins)}</span></div></header>${content}<div class="release-label" title="Поточне оновлення">${escapeHtml(publicUpdateName)}</div></main><button class="menu-trigger global-menu-trigger" data-action="toggle-menu" aria-label="Відкрити меню" aria-expanded="false"><svg class="menu-trigger-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7.5h14M5 12h14M5 16.5h14"/></svg></button><div class="menu-backdrop" data-action="close-menu"></div><aside class="dropdown-menu"><div class="menu-profile"><div class="member-initial">${(u.name||'?').slice(0,1).toUpperCase()}</div><div><strong>${u.telegramUsername?'@'+u.telegramUsername:u.name}</strong><small>${u.level} рівень · ${format(u.coins)} 🪙</small></div><button class="close" data-action="close-menu">×</button></div><nav class="nav">${nav}</nav><div class="menu-footer"><button class="btn soft" data-action="accounts">Мої профілі</button>${sessionAction}</div></aside></div>`;
  }

  function accountHub(){
    const list=loadAccounts().sort((a,b)=>Number(b.updatedAt||0)-Number(a.updatedAt||0));
    const profiles=list.length?`<section class="welcome-profiles" aria-label="Збережені профілі"><div class="welcome-section-head"><div><span>Ваші профілі</span><small>Оберіть, щоб одразу продовжити</small></div><b>${list.length}</b></div><div class="welcome-profile-list">${list.map(a=>`<button class="welcome-profile" data-account-id="${a.id}"><span class="welcome-avatar">${(a.label||'?').slice(0,1).toUpperCase()}</span><span><strong>${a.label||'Профіль'}</strong><small>${a.familyName||'Мій простір'}</small></span><i>Увійти</i></button>`).join('')}</div></section>`:'';
    return `<main class="welcome-hub">
      <section class="welcome-shell">
        <div class="welcome-visual" aria-hidden="true">
          <picture><source media="(max-width:900px)" srcset="/assets/welcome-family-clean.webp"><img src="/assets/welcome-family-clean.webp" alt="Затишна пара з ведмедиком пʼє чай"></picture>
          <div class="welcome-glow welcome-glow-one"></div>
          <div class="welcome-glow welcome-glow-two"></div>
          <span class="welcome-steam steam-one"></span><span class="welcome-steam steam-two"></span>
        </div>
        <div class="welcome-content">
          <div class="welcome-brand"><span class="welcome-brand-mark">♥</span><strong>myHabbit</strong><label class="language-switch welcome-language" title="Мова інтерфейсу"><span>🌐</span><select data-language-select><option value="uk" ${appLanguage==='uk'?'selected':''}>UA</option><option value="en" ${appLanguage==='en'?'selected':''}>EN</option></select></label></div>
          <span class="welcome-kicker">Ваш затишний простір любові й турботи</span>
          <h1>${list.length?'Раді бачити вас знову':'Ласкаво просимо додому'}</h1>
          <p>${list.length?'Оберіть збережений профіль або додайте новий спосіб входу.':'Створюйте маленькі корисні звички, підтримуйте одне одного та проходьте цей шлях разом.'}</p>
          ${profiles}
          <input id="accountImportFile" type="file" accept="application/json,.json" hidden>
          <section class="welcome-actions" aria-label="Варіанти входу">
            <button class="welcome-action primary" data-action="create-family"><span>🏡</span><span><strong>Створити сімʼю</strong><small>Почати нову спільну історію</small></span><i>›</i></button>
            <button class="welcome-action warm" data-action="join-family-from-start"><span>🤲</span><span><strong>Приєднатися</strong><small>Увійти за кодом запрошення</small></span><i>›</i></button>
            <button class="welcome-action mint" data-action="import-account"><span>💜</span><span><strong>Відкрити файл профілю</strong><small>Швидкий вхід без пароля</small></span><i>›</i></button>
            ${list.length?'<button class="welcome-action peach" data-action="accounts"><span>👥</span><span><strong>Керувати профілями</strong><small>Перемикати або видаляти з пристрою</small></span><i>›</i></button>':''}
          </section>
          <button class="welcome-demo" data-action="demo">Подивитися демо <span>→</span></button>
          <div class="welcome-trust"><span>🔒 Дані під захистом</span><span>☁ Працює офлайн</span><span>♡ Для всієї сімʼї</span></div>
        </div>
      </section>
    </main>`;
  }

  function landing(){
    if(!auth)return accountHub();
    const installBanner=shouldOfferPwaInstall()?`<div class="browser-install-banner"><div><span class="browser-install-icon">📲</span><span><strong>Встановіть myHabbit як застосунок</strong><small>Швидший запуск, окрема іконка та робота без стабільного інтернету.</small></span></div><button class="btn small primary" data-action="open-pwa-guide">Як встановити</button></div>`:'';
    return `<div class="landing">${installBanner}<nav class="landing-nav"><div class="brand"><span class="brand-mark">✦</span>myHabbit</div><button class="btn" data-action="existing-login">Увійти в акаунт</button></nav><section class="landing-main"><div class="hero"><span class="eyebrow">Сімейна гра для реального життя</span><h1>Корисні справи стають спільною пригодою.</h1><p>Квести, особисті навички, колекції досягнень і магазин реальних можливостей. Для маленької сімейної команди — без зайвого шуму та складних систем.</p><div class="hero-actions"><button class="btn primary" data-action="demo">Відкрити демо</button><button class="btn" data-action="create-family">Створити сімʼю</button></div><div class="hero-note">PWA для телефона · повноцінна сторінка для ПК · один Cloudflare Worker</div></div><div class="preview"><div class="preview-screen"><div class="preview-header"><div><small>Доброго дня</small><h2 style="margin:3px 0">Команда вдома ✨</h2></div><span class="profile-mark" aria-hidden="true">✦</span></div><div class="preview-card"><div class="preview-row"><strong>Наша спільна сходинка 12</strong><span>7 420 XP</span></div><div class="progress" style="margin-top:12px"><i style="width:74%"></i></div></div><div class="preview-card"><div class="preview-row"><div><strong>🧹 Генеральне прибирання</strong><small>Спільний квест · 1/2 учасники</small></div><span class="reward">+180 🪙</span></div></div><div class="preview-card"><div class="preview-row"><div><strong>🎁 Сюрприз для рідних</strong><small>Лімітований · залишилось 1</small></div><span class="reward">+120 🪙</span></div></div><div class="preview-card"><div class="preview-row"><div><strong>🏆 Стабільність</strong><small>7 днів поспіль</small></div><span class="tag coop">Отримано</span></div></div></div></div></section><section class="landing-features"><article class="feature"><span class="feature-icon">🤝</span><h3>Спільні квести</h3><p>Особисті, парні, командні та лімітовані завдання з прозорою нагородою.</p></article><article class="feature"><span class="feature-icon">🏆</span><h3>Колекція досягнень</h3><p>Особисті ачивки, які можна показувати іншим у профілі.</p></article><article class="feature"><span class="feature-icon">◈</span><h3>Реальний магазин</h3><p>Клуб, техніка, подорожі та інші погоджені можливості з обмеженим запасом.</p></article></section><footer class="footer">myHabbit — приватна сімейна екосистема для 2–5 учасників.</footer></div>`;
  }

  function authScreen(){
    const inviteBox = inviteToken ? `<div class="telegram-login-note"><span>💌</span><div><strong>Тепле запрошення</strong><p>${inviteInfo?.familyName?`Вас запрошують до «${inviteInfo.familyName}».`:'Перевіряємо запрошення…'} Код і PIN вводити не потрібно.</p></div></div>` : '';
    const telegramBox = telegramInitData && !inviteToken ? `<div class="telegram-login-note"><span>✈</span><div><strong>Вхід через Telegram</strong><p>${telegramUser?.first_name || 'Ваш профіль'} буде привʼязаний до сімейної сесії. Введіть код сімʼї та PIN нижче.</p></div></div>` : '';
    const isExistingLogin = authMode==='login' && !inviteToken && !telegramInitData;
    const tabs = (inviteToken || isExistingLogin) ? '' : `<div class="auth-switch"><button class="${authMode==='create'?'active':''}" data-auth-tab="create">Створити сімʼю</button><button class="${authMode==='join'?'active':''}" data-auth-tab="join">Приєднатися до сімʼї</button></div>`;
    const recovery = (!inviteToken && !isTelegramWebApp) ? `<div class="auth-recovery">${isExistingLogin?'':'<div class="auth-divider"><span>Вже маєте профіль?</span></div>'}<div class="json-login-box"><strong>Увійти через JSON</strong><p>Оберіть швидкий JSON входу — профіль відкриється без пароля.</p><input id="accountImportFile" type="file" accept="application/json,.json" hidden><button class="btn primary" type="button" style="width:100%;margin-top:10px" data-action="import-account">Обрати JSON-файл</button></div>${isExistingLogin?'<div class="auth-divider"><span>Немає збереженого профілю?</span></div><button class="btn" style="width:100%" data-action="join-family">Приєднатися до сімʼї</button>':''}</div>` : '';
    const heading = inviteToken?'Ласкаво просимо':(telegramInitData?'Підключення до сімʼї':(isExistingLogin?'Вхід у наявний акаунт':'Початок сімейної гри'));
    const intro = inviteToken?'Ще один крок — оберіть імʼя для свого затишного куточка.':(telegramInitData?'Введіть код сімʼї та PIN.':(isExistingLogin?'Оберіть збережений профіль або швидкий JSON входу.':'Створіть приватну сімʼю або приєднайтесь до неї як новий учасник.'));
    return `<div class="auth-card"><div class="brand"><span class="brand-mark">✦</span>myHabbit</div><h1>${heading}</h1><p>${intro}</p>${inviteBox}${telegramBox}${tabs}${isExistingLogin?'':`<div id="authForm">${authForm(authMode)}</div>`}${recovery}${telegramInitData?'':'<button class="btn" style="width:100%;margin-top:10px" data-route="landing">Назад</button>'}</div>`;
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
    return shell(`<section class="grid metrics"><div class="card"><div class="metric-label">Моя сходинка</div><div class="metric-value">${u.level}</div><div class="progress"><i style="width:${xpPct(u)}%"></i></div><div class="metric-foot">${format(u.xp)} / ${format(xpRequiredForLevel(u.level))} XP</div></div><div class="card"><div class="metric-label">Наша спільна сходинка</div><div class="metric-value">${state.family.level}</div><div class="progress"><i style="width:${Math.min(100,state.family.xp%1000/10)}%"></i></div><div class="metric-foot">Спільний прогрес команди</div></div><div class="card"><div class="metric-label">Баланс</div><div class="metric-value">${format(u.coins)} 🪙</div><div class="metric-foot">На реальні можливості</div></div><div class="card"><div class="metric-label">Мій ритм</div><div class="metric-value">${u.streak} 🔥</div><div class="metric-foot">Днів у приємному ритмі</div></div></section><div class="grid two"><section><div class="section-head"><h2>Квести на сьогодні</h2><button class="btn small" data-route="quests">Усі квести</button></div><div class="quest-list">${active.map(questCard).join('')}</div></section><aside><div class="section-head"><h2>Остання ачивка</h2></div>${latest?achievementCard(latest,u):'<div class="card empty">Поки немає ачивок</div>'}<div class="section-head"><h2>Останні події</h2></div><div class="card">${state.history.slice(0,3).map(h=>`<div class="activity"><span class="activity-icon">${activityIconHtml(h.icon)}</span><div><p>${escapeHtml(h.text||'Подія')}</p><small>${escapeHtml(h.time||'')}</small></div></div>`).join('')}</div></aside></div><div class="section-head"><h2>Сімейний фокус</h2></div><div class="focus-grid"><article class="focus-card"><span>🎯</span><div><strong>Головна ціль тижня</strong><p>Закрити 8 спільних справ і зробити внесок у сімейну ціль.</p></div></article><article class="focus-card"><span>🤝</span><div><strong>Командна активність</strong><p>${state.users.length} учасники · ${state.quests.filter(q=>q.status==='active').length} активних квестів.</p></div></article></div>`,`Привіт, ${u.name} ✨`,`У вас ${active.length} активних квестів і нові можливості в магазині.`);
  }

  function questCard(q){
    const user=currentUser(); const joined=q.claimedBy.includes(user.id); const full=q.claimedBy.length>=q.participants;
    const type={personal:'Особистий',coop:'Спільний',pair:'Тільки вдвох',limited:'Лімітований'}[q.type]; const difficulty={easy:'Легка',normal:'Середня',hard:'Складна'}[q.difficulty||'normal'];
    return `<article class="quest"><span class="quest-icon">${q.icon}</span><div><h3>${q.title}</h3><div class="meta"><span>${q.description}</span><span class="tag ${q.type==='coop'||q.type==='pair'?'coop':''} ${q.limited?'limited':''}">${type}</span><span class="tag difficulty-${q.difficulty||'normal'}">${difficulty}</span><span class="tag">${q.claimedBy.length}/${q.participants}</span></div></div><div class="quest-reward">+${q.rewardCoins} 🪙<small>+${q.rewardXp} XP · ${skillIcon(q.skill)} +${q.skillXp}</small><button class="btn small ${joined?'soft':'primary'}" data-quest="${q.id}" ${full&&!joined?'disabled':''}>${joined?'Завершити':'Взяти'}</button></div></article>`;
  }

  function questsScreen(){
    ensureDailyQuests();
    const active=state.quests.filter(q=>q.status==='active');
    return shell(`<div class="section-head"><div><h2>25 завдань на сьогодні</h2><small class="meta">Побутові повторювані справи та щоденні новинки · доступно кожному учаснику</small></div>${isAdmin()?'<button class="btn primary" data-action="new-quest">+ Власне завдання</button>':''}</div><div class="quest-filter-block"><div class="tabs quest-type-tabs">${['all:Усі','personal:Особисті','coop:Спільні','pair:Для двох','limited:Лімітовані'].map((x,i)=>{const [k,l]=x.split(':');return `<button class="${i===0?'active':''}" data-filter="${k}">${l}</button>`}).join('')}</div><div class="tabs difficulty-tabs">${['all:Будь-яка складність','easy:Легкі','normal:Середні','hard:Складні'].map((x,i)=>{const [k,l]=x.split(':');return `<button class="${i===0?'active':''}" data-difficulty-filter="${k}">${l}</button>`}).join('')}</div></div><div class="daily-quest-summary"><span>🔁 ${active.filter(q=>q.recurring).length} повторюваних</span><span>✨ ${active.filter(q=>!q.recurring).length} нових</span><span>✓ ${active.length}/25 доступно</span></div><div class="quest-list" id="questList">${active.map(questCard).join('')}</div>`,`Квести`,`Щодня формується збалансований набір із 25 справ для кожного учасника.`);
  }


  function achievementCard(a,u=currentUser()){const unlocked=Boolean(u?.achievements?.includes(a.id))||Number(a.progress||0)>=Number(a.target||1);const progress=Math.min(100,Math.round((Number(a.progress||0)/Math.max(1,Number(a.target||1)))*100));return `<article class="achievement-card ${unlocked?'unlocked':'locked'}"><div class="achievement-icon">${achievementIconHtml(a)}</div><div><span class="rarity">${a.rarity||'Звичайна'}</span><h3>${a.title||'Досягнення'}</h3><p>${a.description||''}</p><div class="progress"><i style="width:${unlocked?100:progress}%"></i></div><small>${unlocked?'Відкрито':`${Number(a.progress||0)} / ${Number(a.target||1)}`}</small></div></article>`;}

  function unlockAchievement(u,id){if(!u||u.achievements.includes(id))return false;u.achievements.push(id);const a=state.achievements.find(x=>x.id===id);u.activity.unshift(`Отримано ачивку «${a?.title||id}»`);state.history.unshift({icon:a?.icon||'🏆',text:`${u.name} отримав(ла) «${a?.title||'нову ачивку'}»`,time:'Щойно'});if(u.id===state.currentUserId){announcedAchievements.add(id);queueAchievementToast(a||{id,icon:'🏆',title:id,rarity:'Звичайна'});}return true;}
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

  const MATCH3_ICONS=['🌿','💧','⭐','🍓','☕','💜'];
  let match3Runtime=null;
  function match3Today(){return new Date().toISOString().slice(0,10)}
  function ensureMatch3Profile(u){
    u.match3=u.match3||{};
    if(u.match3.day!==match3Today())u.match3={day:match3Today(),playedToday:0,level:Number(u.match3.level||1),completed:[],totalCompleted:Number(u.match3.totalCompleted||0)};
    u.match3.level=Math.max(1,Number(u.match3.level||1));
    u.match3.playedToday=Math.max(0,Number(u.match3.playedToday||0));
    u.match3.completed=Array.isArray(u.match3.completed)?u.match3.completed:[];
    return u.match3;
  }
  function match3Config(level){
    const boss=level%50===0?'grand':level%25===0?'boss':level%10===0?'mini':null;
    const tier=Math.floor((level-1)/10);
    const size=level>=50?8:7;
    const baseGoal=18+tier*3+(boss==='mini'?10:boss==='boss'?18:boss==='grand'?28:0);
    const moves=Math.max(12,26-Math.floor(tier/2)+(boss?4:0));
    return {level,boss,size,moves,goal:baseGoal,colors:Math.min(6,5+Math.floor(level/30))};
  }
  function m3Index(r,c,size){return r*size+c}
  function m3HasMatch(board,size,index){
    const r=Math.floor(index/size),c=index%size,v=board[index]; if(v==null)return false;
    let n=1;for(let x=c-1;x>=0&&board[m3Index(r,x,size)]===v;x--)n++;for(let x=c+1;x<size&&board[m3Index(r,x,size)]===v;x++)n++;if(n>=3)return true;
    n=1;for(let y=r-1;y>=0&&board[m3Index(y,c,size)]===v;y--)n++;for(let y=r+1;y<size&&board[m3Index(y,c,size)]===v;y++)n++;return n>=3;
  }
  function m3Matches(board,size){const set=new Set();for(let i=0;i<board.length;i++)if(m3HasMatch(board,size,i))set.add(i);return [...set]}
  function m3CanMove(board,size){
    for(let r=0;r<size;r++)for(let c=0;c<size;c++)for(const [dr,dc] of [[1,0],[0,1]]){const rr=r+dr,cc=c+dc;if(rr>=size||cc>=size)continue;const a=m3Index(r,c,size),b=m3Index(rr,cc,size);[board[a],board[b]]=[board[b],board[a]];const ok=m3HasMatch(board,size,a)||m3HasMatch(board,size,b);[board[a],board[b]]=[board[b],board[a]];if(ok)return true;}return false;
  }
  function m3Generate(cfg){
    for(let attempt=0;attempt<100;attempt++){
      const b=[];for(let r=0;r<cfg.size;r++)for(let c=0;c<cfg.size;c++){let choices=[...Array(cfg.colors).keys()];choices=choices.filter(v=>!(c>=2&&b[b.length-1]===v&&b[b.length-2]===v)&&!(r>=2&&b[b.length-cfg.size]===v&&b[b.length-cfg.size*2]===v));b.push(choices[Math.floor(Math.random()*choices.length)]??0)}
      if(m3CanMove(b,cfg.size))return b;
    }
    return [...Array(cfg.size*cfg.size)].map((_,i)=>i%cfg.colors);
  }
  function startMatch3(){const u=currentUser(),p=ensureMatch3Profile(u),cfg=match3Config(p.level);match3Runtime={cfg,board:m3Generate(cfg),moves:cfg.moves,score:0,selected:null,busy:false,won:false,burst:[],combo:0};save();render();}
  function match3Screen(){
    const u=currentUser(),p=ensureMatch3Profile(u),left=Math.max(0,25-p.playedToday);
    if(!match3Runtime||match3Runtime.cfg.level!==p.level)match3Runtime=null;
    const cfg=match3Runtime?.cfg||match3Config(p.level),rt=match3Runtime;
    const bossLabel=cfg.boss==='grand'?'Великий бос':cfg.boss==='boss'?'Бос-рівень':cfg.boss==='mini'?'Складний рівень':'';
    const board=rt?`<div class="match3-board ${rt.busy?'is-resolving':''} ${rt.combo>1?'has-combo':''}" style="--m3-size:${cfg.size}">${rt.board.map((v,i)=>`<button class="match3-tile ${rt.selected===i?'selected':''} ${(rt.burst||[]).includes(i)?'is-burst':''}" data-m3-tile="${i}" aria-label="Фішка ${i+1}">${MATCH3_ICONS[v]??'✨'}</button>`).join('')}${rt.combo>1?`<span class="match3-combo">COMBO ×${rt.combo}</span>`:''}</div>`:`<div class="match3-ready"><span>◆</span><h2>Рівень ${p.level}</h2><p>${bossLabel||'Випадкове завдання'} · зібрати ${cfg.goal} фішок за ${cfg.moves} ходів</p><button class="btn primary" data-action="start-match3" ${left<=0?'disabled':''}>${left>0?'Почати рівень':'Денний ліміт вичерпано'}</button></div>`;
    return shell(`<section class="match3-hud"><div><small>Рівень</small><strong>${p.level}${bossLabel?` · ${bossLabel}`:''}</strong></div><div><small>Сьогодні</small><strong>${p.playedToday}/25</strong></div><div><small>Ходи</small><strong>${rt?rt.moves:cfg.moves}</strong></div><div><small>Зібрано</small><strong>${rt?rt.score:0}/${cfg.goal}</strong></div></section><section class="match3-mode">${board}<p class="match3-note">Свайпніть фішку в потрібний бік або оберіть дві сусідні фішки. Нагорода видається один раз.</p></section>`,`Три в ряд`,`Особливий режим заробітку · залишилось ${left} рівнів сьогодні`);
  }
  async function resolveMatch3(){
    const rt=match3Runtime;if(!rt)return;const {size,colors,goal}=rt.cfg;rt.busy=true;
    rt.combo=0;while(true){const matches=m3Matches(rt.board,size);if(!matches.length)break;rt.combo++;rt.burst=matches;rt.score+=matches.length;render();playCozySound(matches.length>=5?'reward':'coin','full');await new Promise(r=>setTimeout(r,120));matches.forEach(i=>rt.board[i]=null);for(let c=0;c<size;c++){const vals=[];for(let r=size-1;r>=0;r--){const v=rt.board[m3Index(r,c,size)];if(v!=null)vals.push(v)}for(let r=size-1,k=0;r>=0;r--,k++)rt.board[m3Index(r,c,size)]=k<vals.length?vals[k]:Math.floor(Math.random()*colors)}rt.burst=[];render();await new Promise(r=>setTimeout(r,140));}
    if(!m3CanMove(rt.board,size))rt.board=m3Generate(rt.cfg);rt.busy=false;
    if(rt.score>=goal){rt.won=true;finishMatch3();return;}if(rt.moves<=0){showToast('Ходи закінчилися — спробуйте ще раз');match3Runtime=null;render();return;}render();
  }
  function tryMatch3Swap(a,b){
    const rt=match3Runtime;if(!rt||rt.busy||rt.won)return false;
    const ar=Math.floor(a/rt.cfg.size),ac=a%rt.cfg.size,br=Math.floor(b/rt.cfg.size),bc=b%rt.cfg.size;
    if(Math.abs(ar-br)+Math.abs(ac-bc)!==1)return false;
    rt.selected=null;[rt.board[a],rt.board[b]]=[rt.board[b],rt.board[a]];
    if(!m3HasMatch(rt.board,rt.cfg.size,a)&&!m3HasMatch(rt.board,rt.cfg.size,b)){
      [rt.board[a],rt.board[b]]=[rt.board[b],rt.board[a]];showToast('Цей хід не створює комбінацію');render();return false;
    }
    rt.moves--;resolveMatch3();return true;
  }
  function clickMatch3(index){const rt=match3Runtime;if(!rt||rt.busy||rt.won)return;if(rt.selected==null){rt.selected=index;render();return;}const a=rt.selected;if(!tryMatch3Swap(a,index)){rt.selected=index;render();}}
  function bindMatch3Controls(){
    const board=document.querySelector('.match3-board');if(!board||board.dataset.gestureBound)return;board.dataset.gestureBound='1';
    let gesture=null,suppressClickUntil=0;const threshold=18;
    board.addEventListener('pointerdown',e=>{const tile=e.target.closest('[data-m3-tile]');if(!tile||!match3Runtime||match3Runtime.busy)return;gesture={index:Number(tile.dataset.m3Tile),x:e.clientX,y:e.clientY,id:e.pointerId};tile.setPointerCapture?.(e.pointerId);});
    board.addEventListener('pointermove',e=>{if(!gesture||gesture.id!==e.pointerId)return;const dx=e.clientX-gesture.x,dy=e.clientY-gesture.y;if(Math.max(Math.abs(dx),Math.abs(dy))>=threshold)e.preventDefault();},{passive:false});
    board.addEventListener('pointerup',e=>{if(!gesture||gesture.id!==e.pointerId)return;const g=gesture;gesture=null;const dx=e.clientX-g.x,dy=e.clientY-g.y;if(Math.max(Math.abs(dx),Math.abs(dy))<threshold)return;const size=match3Runtime?.cfg?.size||0,row=Math.floor(g.index/size),col=g.index%size;let nr=row,nc=col;if(Math.abs(dx)>Math.abs(dy))nc+=dx>0?1:-1;else nr+=dy>0?1:-1;if(nr<0||nc<0||nr>=size||nc>=size)return;suppressClickUntil=Date.now()+400;tryMatch3Swap(g.index,m3Index(nr,nc,size));e.preventDefault();});
    board.addEventListener('pointercancel',()=>{gesture=null;});
    board.addEventListener('click',e=>{const tile=e.target.closest('[data-m3-tile]');if(!tile)return;if(Date.now()<suppressClickUntil){e.preventDefault();return;}clickMatch3(Number(tile.dataset.m3Tile));});
  }
  function finishMatch3(){
    const u=currentUser(),p=ensureMatch3Profile(u),cfg=match3Runtime.cfg;if(p.completed.includes(cfg.level)){match3Runtime=null;render();return;}
    const bossMult=cfg.boss==='grand'?3:cfg.boss==='boss'?2.2:cfg.boss==='mini'?1.6:1;
    const coin=Math.max(1,Math.round((1+Math.min(2,Math.floor(cfg.level/25)))*bossMult));
    const xp=Math.round((6+Math.min(10,Math.floor(cfg.level/10)))*bossMult);
    p.completed.push(cfg.level);p.playedToday++;p.totalCompleted++;p.level++;u.coins=Number(u.coins||0)+coin;addXp(u,xp,'проходження рівня «Три в ряд»');u.stats=u.stats||{};u.stats.match3Completed=p.totalCompleted;save();showToast(`Рівень пройдено · +${coin} 🪙 · +${xp} XP`);match3Runtime=null;setTimeout(render,350);
  }

  function shopCard(item){
    const sold=Number(item.stock||0)<=0;
    const low=!sold && Number(item.stock||0)<=2;
    const isNew=!!item.isNew || (item.createdAt && Date.now()-new Date(item.createdAt).getTime()<7*86400000);
    const badges=`${isNew?'<span class="shop-item-flag new">✨ NEW</span>':''}${low?'<span class="shop-item-flag low">🔥 Майже розібрали</span>':''}${sold?'<span class="shop-item-sold">SOLD OUT</span>':''}`;
    const link=item.resourceUrl?`<a class="btn small" href="${escapeHtml(item.resourceUrl)}" target="_blank" rel="noopener">Детальніше</a>`:'';
    return `<article class="shop-card ${sold?'sold-out':''}">${badges}<div class="shop-icon">${item.icon||'🎁'}</div><div class="shop-card-body"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description||'')}</p>${item.source==='admin'?'<span class="admin-product-badge">Від адміністратора</span>':''}<div class="shop-meta"><strong>${format(item.price)} 🪙</strong><span>${sold?'Немає в наявності':`Залишилось: ${item.stock}`}</span></div><div class="shop-card-actions">${link}<button class="btn primary" data-buy="${item.id}" ${sold?'disabled':''}>${sold?'Закінчилось':'Придбати'}</button></div></div></article>`;
  }

  function cosmeticShopCard(item){
    const u=currentUser()||{};
    const inventory=Array.isArray(u.inventory)?u.inventory:[];
    const owned=inventory.includes(item?.id);
    const kindIcon={badge:'🐾',frame:'🖼️',animatedFrame:'✨',nicknameEffect:'🌈',theme:'🎨',stickerPack:'🎴',profileEffect:'💫'}[item?.kind]||'✨';
    const descriptions={animatedFrame:'Жива рамка для профілю',frame:'Рамка для оформлення профілю',nicknameEffect:'Анімований стиль імені',theme:'Тема застосунку',stickerPack:'Колекційний стікерпак',profileEffect:'Анімований ефект у профілі',badge:'Особливий значок біля імені'};
    return `<article class="shop-card cosmetic-card"><div class="shop-top"><span class="shop-icon">${kindIcon}</span><span class="rarity">${escapeHtml(item?.rarity||'Особлива')}</span></div><h3>${escapeHtml(item?.title||'Косметичний предмет')}</h3><p>${descriptions[item?.kind]||'Прикраса профілю'}</p><div class="shop-bottom"><span class="price">${format(Number(item?.price||0))} 🪙</span><button class="btn ${owned?'soft':'primary'} small" data-cosmetic="${escapeHtml(item?.id||'')}" ${owned||!item?.id?'disabled':''}>${owned?'Вже у колекції':'Придбати'}</button></div></article>`;
  }

  function shopScreen(){
    // Backward-compatible shop data: old local profiles may not yet contain
    // cosmeticsCatalog, stickerBoxes or stickerCollections.
    const realItems=Array.isArray(state.shop)?state.shop.filter(x=>x&&typeof x==='object').map(x=>({...x,stock:Number(x.stock||0),price:Number(x.price||0)})):[];
    const cosmeticsCatalog=Array.isArray(state.cosmeticsCatalog)?state.cosmeticsCatalog:[];
    const stickerBoxes=Array.isArray(state.stickerBoxes)?state.stickerBoxes:[];
    const stickerCollections=Array.isArray(state.stickerCollections)?state.stickerCollections:[];
    realItems.sort((a,b)=>Number(b?.source==='admin')-Number(a?.source==='admin'));
    const shopIsOpen=realItems.some(item=>Number(item?.stock||0)>0);
    const shopStatus=`<div class="shop-neon-status ${shopIsOpen?'is-open':'is-closed'}" role="status" aria-label="Магазин ${shopIsOpen?'відкритий':'закритий'}"><span class="neon-wire" aria-hidden="true"></span><span class="neon-sign">${shopIsOpen?'OPEN':'CLOSED'}</span><small>${shopIsOpen?'Є доступні товари':'Усі товари закінчилися'}</small></div>`;
    const real=realItems.map(i=>{const resourceUrl=cleanResourceUrl(i.resourceUrl);return `<article class="shop-card admin-product-card ${i.stock<=0?'sold-out':''}"><div class="shop-top"><span class="shop-icon">${i.icon||'✨'}</span><span class="stock ${i.stock>0?'':'out'}">${i.stock>0?`Залишилось: ${i.stock}`:'Закінчилось'}</span></div>${i.source==='admin'?'<span class="admin-product-badge">Від адміністратора</span>':''}<h3>${escapeHtml(i.title)}</h3><p>${escapeHtml(i.description||'Реальна сімейна винагорода')}</p>${resourceUrl?`<a class="shop-reference-link" href="${resourceUrl.replace(/&/g,'&amp;').replace(/"/g,'&quot;')}" target="_blank" rel="noopener noreferrer">↗ Подивитися, що мається на увазі</a>`:''}${i.type==='collective'?`<div class="progress"><i style="width:${Math.min(100,(i.fund||0)/i.price*100)}%"></i></div><small>${format(i.fund||0)} / ${format(i.price)} 🪙</small>`:`<div class="price">${format(i.price)} 🪙</div>`}<button class="btn ${i.type==='collective'?'soft':'primary'}" data-shop="${i.id}" ${i.stock<=0?'disabled':''}>${i.type==='collective'?'Зробити внесок':'Придбати'}</button></article>`}).join('');
    const cosmeticKinds=[['all','Усе'],['stickerPack','Стікерпаки'],['frame','Рамки'],['animatedFrame','Анімовані рамки'],['nicknameEffect','Світні імена'],['profileEffect','Ефекти'],['badge','Значки'],['theme','Теми']];
    const cosmetics=cosmeticsCatalog.filter(Boolean).map(item=>{try{return `<div class="cosmetic-filter-item" data-kind="${escapeHtml(item.kind||'other')}">${cosmeticShopCard(item)}</div>`}catch(e){console.warn('Cosmetic card skipped',e);return ''}}).join('');
    const filters=cosmeticKinds.map(([id,label])=>`<button class="cosmetic-filter ${id==='all'?'active':''}" data-cosmetic-filter="${id}">${label}</button>`).join('');
    const boxes=stickerBoxes.filter(Boolean).map(b=>{const c=stickerCollections.find(x=>x&&x.id===b.collectionId);if(!c)return '';const season=seasonInfo(c.season);return `<article class="shop-card box-card ${season.active?'':'locked'}"><div class="box-visual">📦</div><span class="rarity">${season.active?'Активний бокс':'Сезон закритий'}</span><h3>${b.title}</h3><p>${c.title} · 1 випадковий стікер<br><small>${season.label}</small></p><div class="shop-bottom"><span class="price">${format(b.price)} 🪙</span><button class="btn primary small" data-open-box="${b.id}" ${season.active?'':'disabled'}>Відкрити</button></div></article>`}).join('');
    return shell(`${shopStatus}<section class="real-shop-hero"><div><span class="eyebrow">Головний розділ</span><h2>Товари для життя</h2><p>Реальні подарунки, дозволи, покупки та сімейні цілі. Товари адміністратора завжди показуються першими.</p></div>${isAdmin()?'<button class="btn primary" data-action="new-shop">+ Додати товар</button>':''}</section><div class="shop-grid real-shop-grid">${real||'<div class="shop-empty-state"><span>🥲</span><h3>Ми вже готуємо нові подарунки</h3><p>Зазирни трохи пізніше ❤️</p></div>'}</div><details class="shop-fold"><summary><span><strong>Косметика профілю</strong><small>Рамки, теми, ефекти та стікерпакети</small></span><b>Відкрити</b></summary><div class="cosmetic-filters">${filters}</div><div class="shop-grid cosmetics-shop-grid">${cosmetics}</div></details><details class="shop-fold"><summary><span><strong>Стікер-бокси</strong><small>Колекційні випадкові стікери</small></span><b>Відкрити</b></summary><div class="shop-grid">${boxes}</div></details>`,`Магазин`,`Спочатку реальні товари для життя, нижче — косметика та колекції.`);
  }
  function customShopScreen(){
    const real=(state.shop||[]).map(i=>{const resourceUrl=cleanResourceUrl(i.resourceUrl);return `<article class="shop-card admin-product-card"><div class="shop-top"><span class="shop-icon">${i.icon}</span><span class="stock ${i.stock?'':'out'}">${i.stock?`Залишок ${i.stock}`:'Немає'}</span></div><h3>${i.title}</h3><p>${i.description}</p>${resourceUrl?`<a class="shop-reference-link" href="${resourceUrl.replace(/&/g,'&amp;').replace(/"/g,'&quot;')}" target="_blank" rel="noopener noreferrer">↗ Подивитися приклад</a>`:''}${i.type==='collective'?`<div class="progress"><i style="width:${Math.min(100,(i.fund||0)/i.price*100)}%"></i></div><small>${format(i.fund||0)} / ${format(i.price)} 🪙</small>`:`<div class="price">${format(i.price)} 🪙</div>`}<button class="btn ${i.type==='collective'?'soft':'primary'}" data-shop="${i.id}" ${i.stock<=0?'disabled':''}>${i.type==='collective'?'Зробити внесок':'Придбати'}</button></article>`}).join('');
    return shell(`<div class="section-head"><div><h2>Товари від адміністратора</h2><small class="meta">Окрема сторінка для реальних винагород та сімейних цілей</small></div><button class="btn soft" data-route="shop">← До косметики</button></div><div class="shop-grid">${real||'<div class="shop-empty-state"><span>🥲</span><h3>Ми вже готуємо нові подарунки</h3><p>Зазирни трохи пізніше ❤️</p></div>'}</div>`,`Сімейна крамниця`,`Тут лише товари, які додав адміністратор.`);
  }

  function collectionTheme(id){return {
    'cozy-cats':{icon:'🐱',tone:'peach',subtitle:'Теплі вечори й пухнасті історії'},
    'bunny-love':{icon:'🐰',tone:'rose',subtitle:'Ніжність, обійми та маленькі дива'},
    'christmas':{icon:'🎄',tone:'winter',subtitle:'Святкове світло й зимова магія'},
    'halloween':{icon:'🎃',tone:'night',subtitle:'Добрі привиди й чарівна ніч'},
    'easter':{icon:'🥚',tone:'spring',subtitle:'Весняні знахідки та сонячні сюрпризи'}
  }[id]||{icon:'✦',tone:'lavender',subtitle:'Особлива колекція myHabbit'};}
  function stickerVisual(sticker,size='normal'){
    if(sticker?.media){const media=escapeHtml(sticker.media);if(/\.(webp|png|jpe?g|gif|avif)(?:\?|$)/i.test(media))return `<img class="sticker-media sticker-media-${size}" src="${media}" loading="lazy" decoding="async" alt="${escapeHtml(sticker.name||'Стікер')}">`;const bunnyPoster=/\/bunny-love\/bunny-love-(\d{2})\.webm$/i.exec(media);const poster=bunnyPoster?` poster="/assets/stickers/bunny-love/posters/bunny-love-${bunnyPoster[1]}.webp"`:'';return `<video class="sticker-media sticker-media-${size}" src="${media}"${poster} autoplay loop muted playsinline preload="metadata" aria-label="${escapeHtml(sticker.name||'Стікер')}"></video>`;}
    return `<span class="sticker-fallback">${stickerGlyph(sticker?.id||'')}</span>`;
  }
  function stickerGlyph(id){if(id.includes('cat'))return '🐱';if(id.includes('bunny'))return '🐰';if(id.includes('tree'))return '🎄';if(id.includes('cocoa')||id.includes('coffee')||id.includes('tea'))return '☕';if(id.includes('book'))return '📖';if(id.includes('sleep')||id.includes('moon'))return '🌙';if(id.includes('star')||id.includes('sun'))return '⭐';if(id.includes('crown'))return '👑';if(id.includes('flower'))return '🌸';if(id.includes('pumpkin'))return '🎃';if(id.includes('ghost'))return '👻';if(id.includes('egg'))return '🥚';if(id.includes('basket'))return '🧺';return '✨';}
  function collectionsScreen(){const u=currentUser();const html=state.stickerCollections.map(c=>{const season=seasonInfo(c.season),owned=c.stickers.filter(x=>stickerCount(u,x.id)>0).length,pct=Math.round(owned/c.stickers.length*100),theme=collectionTheme(c.id);return `<button class="collection-book-card tone-${theme.tone}" data-open-album="${c.id}"><span class="book-spine"></span><div class="book-emblem">${theme.icon}</div><span class="eyebrow">${season.active?'Доступна зараз':season.label}</span><h2>${c.title}</h2><p>${theme.subtitle}</p><div class="book-progress-row"><strong>${owned} / ${c.stickers.length}</strong><span>${pct}%</span></div><div class="progress"><i style="width:${pct}%"></i></div><small>Натисніть, щоб відкрити альбом</small></button>`}).join('');return shell(`<div class="collection-library">${html}</div>`,'Колекції','Невідомі стікери залишаються повністю прихованими до першого отримання.');}

  function albumMarkup(collectionId,highlightId=''){const u=currentUser(),c=state.stickerCollections.find(x=>x.id===collectionId);if(!c)return '';const theme=collectionTheme(c.id),owned=c.stickers.filter(x=>stickerCount(u,x.id)>0).length,pct=Math.round(owned/c.stickers.length*100);return `<div class="album-backdrop" data-album-root><div class="album-shell tone-${theme.tone}"><button class="album-close" data-close-album aria-label="Закрити">×</button><div class="album-cover-panel"><span class="album-cover-icon">${theme.icon}</span><span class="eyebrow">Колекційний альбом</span><h2>${c.title}</h2><p>${owned} / ${c.stickers.length} відкрито · ${pct}%</p><div class="progress"><i style="width:${pct}%"></i></div></div><div class="album-pages"><section class="album-page left-page"><div class="page-title"><strong>${c.title}</strong><small>Сторінка 1</small></div><div class="album-grid">${c.stickers.slice(0,Math.ceil(c.stickers.length/2)).map((x,i)=>albumCell(x,i,highlightId)).join('')}</div></section><section class="album-page right-page"><div class="page-title"><strong>Продовження</strong><small>Сторінка 2</small></div><div class="album-grid">${c.stickers.slice(Math.ceil(c.stickers.length/2)).map((x,i)=>albumCell(x,i+Math.ceil(c.stickers.length/2),highlightId)).join('')}</div></section></div></div></div>`;}
  function albumCell(sticker,index,highlightId){const count=stickerCount(currentUser(),sticker.id),owned=count>0,number=`#${String(index+1).padStart(3,'0')}`;return `<article class="album-slot ${owned?'owned':'locked'} ${highlightId===sticker.id?'new-highlight':''}"><span class="slot-number">${number}</span><div class="slot-art">${owned?stickerVisual(sticker,'album'):'<span class="slot-lock">?</span>'}</div>${owned?`<strong>${number}</strong><small>${rarityLabel(sticker.rarity)}${count>1?` · ×${count}`:''}</small>`:`<strong>${number}</strong><small>Відкриється після отримання</small>`}</article>`;}
  function openAlbum(collectionId,highlightId=''){document.querySelector('[data-album-root]')?.remove();document.body.insertAdjacentHTML('beforeend',albumMarkup(collectionId,highlightId));requestAnimationFrame(()=>document.querySelector('[data-album-root]')?.classList.add('open'));bindAlbum();}
  function bindAlbum(){document.querySelectorAll('[data-close-album]').forEach(x=>x.addEventListener('click',()=>x.closest('[data-album-root]')?.remove()));document.querySelector('[data-album-root]')?.addEventListener('click',e=>{if(e.target.matches('[data-album-root]'))e.currentTarget.remove();});}
  function revealMarkup(sticker,c,isNew,dust=0){const index=Math.max(0,(c?.stickers||[]).findIndex(x=>x.id===sticker.id)),number=`#${String(index+1).padStart(3,'0')}`;return `<div class="sticker-reveal-backdrop rarity-${sticker.rarity}" data-reveal-root><div class="reveal-stage"><div class="reveal-box">📦</div><div class="reveal-card"><div class="reveal-card-inner"><div class="reveal-card-back">✦</div><div class="reveal-card-front"><span class="reveal-rarity">${rarityLabel(sticker.rarity)}</span><div class="reveal-art">${stickerVisual(sticker,'reveal')}</div><h2>${number}</h2><p>${escapeHtml(c?.title||'Стікерпак')}</p>${isNew?'<strong class="new-ribbon">NEW!</strong>':`<strong class="duplicate-ribbon">Дублікат · +${dust} пилу</strong>`}</div></div></div><button class="btn primary reveal-continue" data-reveal-continue data-collection="${c.id}" data-sticker="${sticker.id}">${isNew?'Показати в альбомі':'Продовжити'}</button></div></div>`;}
  function showStickerReveal(sticker,c,isNew,dust=0){setTimeout(()=>{playCozySound('reveal','important',sticker?.rarity||'common');cozyHaptic(['legendary','mythic'].includes(sticker?.rarity)?'strong':'medium');},260);document.body.insertAdjacentHTML('beforeend',revealMarkup(sticker,c,isNew,dust));const root=document.querySelector('[data-reveal-root]');requestAnimationFrame(()=>root?.classList.add('play'));root?.querySelector('[data-reveal-continue]')?.addEventListener('click',e=>{root.remove();if(isNew)openAlbum(e.currentTarget.dataset.collection,e.currentTarget.dataset.sticker);});}

  function displayName(u){const effect=cosmetic(u.equipped?.nicknameEffect);return `<span class="animated-name nick-${effect?.asset||'none'}">${(u.name||'').replace(/[<>&]/g,'')}</span>`;}
  function memberCard(u){const af=cosmetic(u.equipped?.animatedFrame);return `<button type="button" class="member member-button cozy-member animated-frame-${af?.asset||'none'}" data-member="${u.id}"><div class="member-head"><div class="member-initial" aria-hidden="true">${(u.name||'?').trim().slice(0,1).toUpperCase()}</div><div><h3 style="margin:0">${displayName(u)} ${u.role==='admin'?'<span class="admin-badge">Берегиня простору</span>':''}</h3><small>${u.level} сходинка · ${u.streak} днів у ритмі</small></div><span class="telegram-dot ${u.telegramLinked?'linked':''}" title="${u.telegramLinked?'Telegram поруч':'Telegram ще не підключено'}">✈</span></div><span class="view-profile">Зазирнути в профіль →</span></button>`}
  function museumScreen(){
    const u=currentUser();
    if(!u)return shell('<div class="empty-soft">Не вдалося відкрити музей: профіль не знайдено.</div>','Музей','Особиста колекція');
    const collections=(state.stickerCollections||[]).filter(c=>c&&Array.isArray(c.stickers));
    const allStickers=collections.flatMap(c=>c.stickers.filter(Boolean).map(st=>({...st,collectionTitle:c.title||'Колекція',collectionId:c.id})));
    const ownedStickers=allStickers.filter(st=>stickerCount(u,st.id)>0);
    const ownedCosmetics=(Array.isArray(u.inventory)?u.inventory:[]).map(cosmetic).filter(Boolean);
    const completed=collections.filter(c=>c.stickers.length&&c.stickers.every(st=>stickerCount(u,st.id)>0)).length;
    const achievements=(Array.isArray(u.achievements)?u.achievements:[]).map(id=>state.achievements.find(a=>a.id===id)).filter(Boolean);
    const history=(Array.isArray(state.giftHistory)?state.giftHistory:[]).slice().reverse().map(g=>`<article class="museum-history-row"><span>${g.icon||'🎁'}</span><div><strong>${escapeHtml(g.title||'Подарунок')}</strong><small>${escapeHtml(g.fromName||'')} → ${escapeHtml(g.toName||'')} · ${g.createdAt?formatDayMonth(g.createdAt):'без дати'}</small>${g.note?`<p>${escapeHtml(g.note)}</p>`:''}</div></article>`).join('')||'<div class="empty-soft">Подарунків ще не було.</div>';
    const achievementCards=achievements.length?achievements.map(a=>achievementCard(a,u)).join(''):'<div class="empty-soft">Перша ачивка з’явиться після виконаного завдання.</div>';
    return shell(`<section class="museum-hero"><div><span class="eyebrow">Особиста скарбниця</span><h2>Музей ${escapeHtml(u.name||'учасника')}</h2><p>Колекції, косметика, ачивки та історія подарунків.</p></div><div class="museum-seal">🏛️</div></section>
    <div class="grid metrics museum-metrics"><div class="card"><div class="metric-label">Стікери</div><div class="metric-value">${ownedStickers.length}/${allStickers.length}</div></div><div class="card"><div class="metric-label">Повні колекції</div><div class="metric-value">${completed}</div></div><div class="card"><div class="metric-label">Косметика</div><div class="metric-value">${ownedCosmetics.length}</div></div><div class="card"><div class="metric-label">Ачивки</div><div class="metric-value">${achievements.length}</div></div></div>
    <div class="museum-grid"><section class="card museum-section"><div class="section-head"><h2>Відкриті стікери</h2><small>${ownedStickers.length}</small></div><div class="museum-sticker-grid">${ownedStickers.length?ownedStickers.map(st=>{const col=collections.find(c=>c.id===st.collectionId),num=Math.max(1,(col?.stickers||[]).findIndex(x=>x.id===st.id)+1);return `<article class="museum-sticker rarity-${st.rarity||'common'}"><div>${stickerVisual(st)}</div><strong>#${String(num).padStart(3,'0')}</strong><small>${escapeHtml(st.collectionTitle)}</small></article>`}).join(''):'<div class="empty-soft">Перші стікери ще чекають на відкриття.</div>'}</div></section>
    <section class="card museum-section"><div class="section-head"><h2>Косметика</h2><small>${ownedCosmetics.length}</small></div><div class="museum-cosmetics">${ownedCosmetics.length?ownedCosmetics.map(x=>`<article><span>${x.kind==='animatedFrame'?'🖼️':x.kind==='nicknameEffect'?'🌈':'✨'}</span><div><strong>${escapeHtml(x.title||'Косметика')}</strong><small>${escapeHtml(x.rarity||'')}</small></div></article>`).join(''):'<div class="empty-soft">Косметика з’явиться після отримання нагород.</div>'}</div></section></div>
    <section class="card museum-section"><div class="section-head"><h2>Отримані ачивки</h2><small>${achievements.length}</small></div><div class="achievement-grid compact-achievements">${achievementCards}</div></section>
    <section class="card museum-section"><div class="section-head"><h2>Історія подарунків</h2><small>зберігається назавжди</small></div><div class="museum-history">${history}</div></section>`,'Музей','Ваші відкриття, рідкісні предмети та теплі подарунки в одному місці.');
  }

  function profileGiftOptions(from){
    const options=[];
    for(const c of state.stickerCollections||[])for(const st of c.stickers||[])if(stickerCount(from,st.id)>0)options.push(`<option value="sticker:${escapeHtml(st.id)}">🎴 #${String((c.stickers||[]).indexOf(st)+1).padStart(3,'0')} (${stickerCount(from,st.id)} шт.)</option>`);
    for(const f of activeFeaturesOf(from))options.push(`<option value="feature:${escapeHtml(f.id)}">✨ ${escapeHtml(f.title)} · ${featureDaysLeft(f)} дн.</option>`);
    for(const id of Array.isArray(from.inventory)?from.inventory:[]){const item=cosmetic(id);if(item)options.push(`<option value="cosmetic:${escapeHtml(item.id)}">✨ ${escapeHtml(item.title||'Косметика')}</option>`);}
    return options;
  }
  function profileCoinTransferStation(target){
    const from=currentUser();
    if(!from||!target||from.id===target.id)return '';
    return `<section class="card profile-coin-transfer"><div class="section-head"><div><h2>Передати монетки</h2><small>Ваш баланс: ${format(Number(from.coins||0))} 🪙</small></div></div><div class="gift-form coin-transfer-form"><input type="hidden" id="coinTransferRecipient" value="${escapeHtml(target.id)}"><input id="coinTransferAmount" type="number" min="1" max="${Math.max(1,Number(from.coins||0))}" inputmode="numeric" placeholder="Кількість монет"><button class="btn primary" data-action="transfer-family-coins">Передати 🪙</button></div><p class="auth-help">Монетки одразу списуються з вашого профілю та зараховуються ${escapeHtml(target.name||'учаснику')}.</p></section>`;
  }
  async function transferFamilyCoins(){
    const from=currentUser(),toId=document.getElementById('coinTransferRecipient')?.value,amount=Math.trunc(Number(document.getElementById('coinTransferAmount')?.value||0)),to=state.users.find(x=>x.id===toId);
    if(!from||!to)return showToast('Учасника не знайдено');
    if(!Number.isFinite(amount)||amount<1)return showToast('Вкажіть кількість монет');
    if(amount>Number(from.coins||0))return showToast('Недостатньо монет');
    try{
      if(auth?.demo){from.coins-=amount;to.coins=Number(to.coins||0)+amount;state.history.unshift({eventId:crypto.randomUUID(),familyId:String(state.family?.id||state.family?.code||''),userId:from.id,icon:'🪙',text:`${from.name} передав(ла) ${to.name} ${amount} монеток`,time:'Щойно'});save();app.innerHTML=profileScreen(to.id);bind();showToast(`${amount} монеток передано`);return;}
      const result=await api('/api/family/transfer-coins',{method:'POST',body:JSON.stringify({userId:to.id,amount})});
      if(result?.state){state=result.state;normalizeState();save();}
      app.innerHTML=profileScreen(to.id);bind();showToast(`${amount} монеток передано для ${to.name}`);
    }catch(e){showToast(e.message||'Не вдалося передати монетки');}
  }

  function activeFeaturesOf(u){
    if(!u)return [];
    u.activeFeatures=Array.isArray(u.activeFeatures)?u.activeFeatures:[];
    const now=Date.now(),before=u.activeFeatures.length;
    u.activeFeatures=u.activeFeatures.filter(f=>Number(f.expiresAt||0)>now);
    if(before!==u.activeFeatures.length)save();
    return u.activeFeatures.sort((a,b)=>Number(a.expiresAt)-Number(b.expiresAt));
  }
  function featureDaysLeft(f){return Math.max(1,Math.ceil((Number(f.expiresAt||0)-Date.now())/86400000));}
  function activeFeaturesBlock(u,own){
    const list=activeFeaturesOf(u);
    return `<details class="cozy-fold active-features-fold" open><summary><span>✨</span><strong>Активні можливості</strong><small>${list.length}</small></summary><div class="fold-body active-feature-grid">${list.length?list.map(f=>`<article class="active-feature-card"><span class="active-feature-icon">${escapeHtml(f.icon||'✨')}</span><div><strong>${escapeHtml(f.title||'Можливість')}</strong><small>${escapeHtml(f.description||'')} · ще ${featureDaysLeft(f)} дн.</small>${f.giftedByName?`<em>Подарував(ла): ${escapeHtml(f.giftedByName)}</em>`:''}</div>${own?'<span class="feature-owner-mark">Активна</span>':''}</article>`).join(''):'<div class="empty-soft">Активних можливостей поки немає.</div>'}</div></details>`;
  }

  function profileGiftStation(target){
    const from=currentUser(),options=from?profileGiftOptions(from):[];
    if(!from||!target||from.id===target.id)return '';
    return `<section class="card profile-gift-station"><div class="section-head"><div><h2>Подарунок для ${escapeHtml(target.name||'учасника')}</h2><small>Оберіть предмет зі своєї колекції</small></div></div>${options.length?`<div class="gift-form"><input type="hidden" id="profileGiftRecipient" value="${escapeHtml(target.id)}"><select id="profileGiftItem">${options.join('')}</select><input id="profileGiftNote" maxlength="120" placeholder="Коротка листівка, до 120 символів"><button class="btn primary" data-action="send-profile-gift">Подарувати 🎁</button></div>`:'<div class="empty-soft">У вашій колекції поки немає предметів, які можна подарувати.</div>'}</section>`;
  }
  function sendProfileGift(){
    const from=currentUser(),toId=document.getElementById('profileGiftRecipient')?.value,itemValue=document.getElementById('profileGiftItem')?.value,note=(document.getElementById('profileGiftNote')?.value||'').trim().slice(0,120),to=state.users.find(x=>x.id===toId);
    if(!from||!to||!itemValue)return showToast('Оберіть подарунок');
    const [kind,id]=itemValue.split(':');let title='',icon='🎁';
    from.stickerInventory=from.stickerInventory||{};to.stickerInventory=to.stickerInventory||{};from.inventory=Array.isArray(from.inventory)?from.inventory:[];to.inventory=Array.isArray(to.inventory)?to.inventory:[];from.stats=from.stats||{};from.activity=Array.isArray(from.activity)?from.activity:[];to.activity=Array.isArray(to.activity)?to.activity:[];
    if(kind==='sticker'){
      if(stickerCount(from,id)<1)return showToast('Цього стікера вже немає');
      from.stickerInventory[id]-=1;if(from.stickerInventory[id]<=0)delete from.stickerInventory[id];to.stickerInventory[id]=stickerCount(to,id)+1;title=stickerName(id);icon='🎴';from.stats.stickersGiven=(from.stats.stickersGiven||0)+1;
    }else if(kind==='cosmetic'){
      const index=from.inventory.indexOf(id);if(index<0)return showToast('Цієї косметики вже немає');
      from.inventory.splice(index,1);if(!to.inventory.includes(id))to.inventory.push(id);const item=cosmetic(id);title=item?.title||id;icon='✨';
      for(const key of ['badge','frame','animatedFrame','nicknameEffect','profileEffect','theme'])if(from.equipped?.[key]===id)from.equipped[key]=key==='theme'?'light':null;
    }else if(kind==='feature'){
      from.activeFeatures=Array.isArray(from.activeFeatures)?from.activeFeatures:[];to.activeFeatures=Array.isArray(to.activeFeatures)?to.activeFeatures:[];
      const index=from.activeFeatures.findIndex(f=>f.id===id);if(index<0)return showToast('Ця можливість уже недоступна');
      const feature=from.activeFeatures.splice(index,1)[0];feature.ownerId=to.id;feature.giftedById=from.id;feature.giftedByName=from.name;to.activeFeatures.push(feature);title=feature.title||'Можливість';icon=feature.icon||'✨';
    }else return;
    const gift={id:`gift_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,fromId:from.id,toId:to.id,fromName:from.name,toName:to.name,kind,itemId:id,title,note,icon,createdAt:new Date().toISOString()};
    state.giftHistory=Array.isArray(state.giftHistory)?state.giftHistory:[];to.receivedGifts=Array.isArray(to.receivedGifts)?to.receivedGifts:[];state.history=Array.isArray(state.history)?state.history:[];
    state.giftHistory.push(gift);to.receivedGifts.push(gift);to.activity.unshift(`Отримано подарунок «${title}» від ${from.name}`);from.activity.unshift(`Подаровано «${title}» для ${to.name}`);state.history.unshift({eventId:crypto.randomUUID(),familyId:String(state.family?.id||state.family?.code||''),userId:from.id,icon,text:`${from.name} подарував(ла) ${to.name} «${title}»`,time:'Щойно'});addXp(from,10,'подарунок');addXp(to,5,'отриманий подарунок');save();app.innerHTML=profileScreen(to.id);bind();showToast(`Подарунок для ${to.name} надіслано`);
  }

  function profileScreen(userId=state.currentUserId){
    const u=state.users.find(x=>x.id===userId)||currentUser(),own=u.id===state.currentUserId;evaluateReferralAchievements(u);const skills=Object.entries(u.skills||{}),achievements=state.achievements.filter(a=>u.achievements.includes(a.id)),badge=cosmetic(u.equipped?.badge),frame=u.equipped?.frame||'',animatedFrame=cosmetic(u.equipped?.animatedFrame),nickEffect=cosmetic(u.equipped?.nicknameEffect),profileEffect=cosmetic(u.equipped?.profileEffect),stickers=state.profileStickers.filter(x=>x.to===u.id).slice(-10).reverse(),nextRewards=state.levelRewards.filter(r=>!u.claimedLevelRewards.includes(r.level)).slice(0,4);
    return shell(`<section class="card cozy-profile-head profile-frame-${frame} animated-frame-${animatedFrame?.asset||'none'} profile-effect-${profileEffect?.asset||'none'}"><div class="profile-minimal"><div class="member-initial large">${cuteIcon('cat')}</div><div><div class="profile-level"><span class="animated-name nick-${nickEffect?.asset||'none'}">${escapeHtml(u.name)}</span> ${badge?cuteIcon(badge.asset.includes('bunny')?'bunny':'cat'):''}</div><div class="meta">${u.level} загальний рівень · ${format(u.xp)} / ${format(xpRequiredForLevel(u.level))} XP · ${format(u.coins)} 🪙</div><div class="profile-joined">${u.telegramUsername?'@'+escapeHtml(u.telegramUsername)+' · ':''}у myHabbit з <span class="profile-join-date">${numericJoinDate(u.createdAt)}</span></div><div class="progress soft-progress"><i style="width:${xpPct(u)}%"></i></div></div>${own?'<div class="profile-actions"><button class="btn primary" data-action="invite">Запросити в сімʼю</button><button class="btn" data-action="edit-profile">Налаштувати</button><button class="btn soft" data-action="claim-level-rewards">Подарунки рівня</button></div>':'<button class="btn soft" data-action="leave-sticker" data-user-id="'+u.id+'">Залишити слід</button>'}</div></section>
    <section class="grid metrics minimal-stats"><div class="card"><div class="metric-label">Квести</div><div class="metric-value">${u.stats.questsCompleted||0}</div></div><div class="card"><div class="metric-label">Ранкові подарунки</div><div class="metric-value">${u.stats.giftsOpened||0}</div></div><div class="card"><div class="metric-label">Джекпоти</div><div class="metric-value">${u.stats.jackpots||0}</div></div><div class="card"><div class="metric-label">Стікери друзям</div><div class="metric-value">${u.stats.stickersGiven||0}</div></div></section>
    <div class="cozy-folds">${activeFeaturesBlock(u,own)}${own?referralStatsBlock(u):''}${importantDatesBlock(u,own)}<details class="cozy-fold"><summary>${cuteIcon('leaf')}<strong>Мої барви</strong><small>${skills.length}</small></summary><div class="fold-body skill-list">${skills.map(([k,v])=>`<div class="skill-row cozy-skill"><span class="skill-icon">${cuteIcon('sparkle')}</span><div><div class="skill-name"><strong>${skillLabel(k)}</strong><span>${v}</span></div><div class="progress"><i style="width:${Math.min(100,(v%10)*10)}%"></i></div></div></div>`).join('')}</div></details><details class="cozy-fold"><summary>${cuteIcon('trophy')}<strong>Мої знахідки</strong><small>${achievements.length}</small></summary><div class="fold-body achievement-grid compact-achievements">${achievements.map(a=>achievementCard(a,u)).join('')}</div></details></div>${own?'':profileCoinTransferStation(u)+profileGiftStation(u)}`,own?'Мій профіль':'Профіль учасника',own?`${escapeHtml(u.name)} · загальний рівень ${u.level}`:`${escapeHtml(u.name)} · профіль близької людини`);
  }

  function familyActivityItems(){
    const familyId=String(state.family?.id||state.family?.code||'');
    const memberIds=new Set((state.users||[]).map(u=>String(u.id)));
    const seen=new Set();
    return (state.history||[]).filter(item=>{
      const text=String(item?.text||'').trim();
      if(!text||!familyId)return false;
      // Legacy/demo entries without familyId are never allowed into a real family feed.
      if(String(item?.familyId||'')!==familyId)return false;
      if(item?.userId&&!memberIds.has(String(item.userId)))return false;
      const key=String(item.eventId||`${item.familyId}|${item.userId||''}|${text}|${item.time||''}`);
      if(seen.has(key))return false;
      seen.add(key);
      return true;
    }).slice(0,100);
  }


  function familyScreen(){const visibleUsers=visibleFamilyUsers(),familyActivity=familyActivityItems();return shell(`<section class="card"><div class="profile-hero"><span class="avatar">✨</span><div><div class="profile-level">${state.family.name}</div><div class="meta">Код сімʼї: <strong>${state.family.code}</strong> · ${visibleUsers.length}/${familyMax()} учасників</div><div class="progress" style="margin-top:10px"><i style="width:${state.family.xp%1000/10}%"></i></div></div><div class="profile-actions"><button class="btn primary" data-action="invite">Запросити</button><button class="btn danger" data-action="leave-family">Вийти із сімʼї</button></div></div></section><div class="section-head"><h2>Наші люди</h2></div><div class="member-grid">${visibleUsers.map(memberCard).join('')||'<div class="card empty">У видимому списку поки немає учасників</div>'}</div><div class="section-head"><h2>Сімейна активність</h2></div><div class="card family-activity-window">${familyActivity.length?familyActivity.map(h=>`<div class="activity"><span class="activity-icon">${activityIconHtml(h.icon)}</span><div><p>${escapeHtml(h.text||'Подія')}</p><small>${escapeHtml(h.time||'')}</small></div></div>`).join(''):'<div class="empty">Поки немає нових подій учасників</div>'}</div>`,`Сімʼя`,`Спільний прогрес без публічних рейтингів і сторонніх людей.`)}

  function adminMemberRow(u){
    const roleLabel=u.role==='owner'?'Власник':u.role==='admin'?'Адміністратор':'Учасник';
    const privacy=u.role==='admin'||u.role==='owner'?`<button class="btn small ${u.hiddenFromFamily?'visibility-active':'soft'}" data-toggle-admin-hidden="${u.id}">${u.hiddenFromFamily?'✓ Приховано із сімʼї':'Сховати із сімʼї'}</button>`:'';
    const action=u.id!==state.currentUserId&&u.role!=='owner'
      ? `<button class="btn danger small" data-kick-user="${u.id}">Виключити</button>`
      : `<span class="tag">${u.id===state.currentUserId?'Це ви':'Захищено'}</span>`;
    return `<article class="admin-row"><span class="avatar">${u.avatar}</span><div><strong>${u.name}</strong><small>${format(u.coins)} 🪙 · ${roleLabel}${u.hiddenFromFamily?' · приховано':''}</small></div><div class="admin-actions">${privacy}${action}</div></article>`;
  }

  function adminSectionOpen(name){return localStorage.getItem(ADMIN_PANEL_SECTION_KEY)===name?' open':'';}

  function adminScreen(){
    if(!isAdmin()) return shell('<div class="card empty">Цей розділ доступний лише адміністратору сімʼї.</div>','Куточок господаря','Керування сімейним простором.');
    const active=state.quests.filter(q=>q.status==='active').length,lowStock=state.shop.filter(x=>x.stock<=1).length;
    const questRows=state.quests.map(q=>`<article class="admin-row"><span class="quest-icon">${q.icon||'✓'}</span><div><strong>${escapeHtml(q.title)}</strong><small>${q.source==='daily'?'Стандартний':'Власний'} · ${q.status==='active'?'активний':'призупинений'} · ${q.rewardCoins} 🪙 · ${q.rewardXp} XP</small></div><div class="admin-actions"><button class="btn small" data-edit-quest="${q.id}">Редагувати</button><button class="btn small soft" data-admin-toggle-quest="${q.id}">${q.status==='active'?'Пауза':'Активувати'}</button><button class="icon-btn danger-text" data-admin-delete-quest="${q.id}" aria-label="Прибрати">×</button></div></article>`).join('');
    const templateRows=DAILY_QUEST_TEMPLATES.map(t=>{const key=questTemplateKey(t),o=questTemplateState(key),enabled=o.enabled!==false;return `<article class="admin-row"><span class="quest-icon">${o.icon||t[1]}</span><div><strong>${escapeHtml(o.title||t[0])}</strong><small>${enabled?'Використовується у щоденній вибірці':'Вимкнено'} · ${o.rewardCoins??t[5]} 🪙 · ${o.rewardXp??t[6]} XP</small></div><div class="admin-actions"><button class="btn small" data-edit-template="${key}">Редагувати</button><button class="btn small ${enabled?'soft':'primary'}" data-toggle-template="${key}">${enabled?'Прибрати':'Повернути'}</button></div></article>`}).join('');
    const shopRows=state.shop.map(i=>`<article class="admin-row"><span class="shop-icon">${i.icon||'✨'}</span><div><strong>${escapeHtml(i.title)}</strong><small>${format(i.price)} 🪙 · залишок ${i.stock}</small></div><div class="admin-actions"><button class="btn small" data-edit-shop="${i.id}">Редагувати</button><div class="stock-stepper"><button data-stock="${i.id}" data-delta="-1">−</button><strong>${i.stock}</strong><button data-stock="${i.id}" data-delta="1">+</button></div><button class="icon-btn danger-text" data-admin-delete-shop="${i.id}">×</button></div></article>`).join('');
    const catalog=READY_SHOP_CATALOG.map(x=>`<article class="ready-product"><span>${x[1]}</span><div><strong>${escapeHtml(x[2])}</strong><small>${escapeHtml(x[6])} · ${x[4]} 🪙</small></div><input type="number" min="1" max="99" value="1" aria-label="Кількість"><button class="btn primary small" data-add-ready-shop="${x[0]}">Додати</button></article>`).join('');
    return shell(`<section class="admin-hero"><div><span class="eyebrow">Центр керування</span><h2>Налаштування нашого простору</h2><p>Усі модулі згортаються, тому до потрібного розділу не треба довго гортати.</p></div></section>
    <section class="grid metrics"><div class="card"><div class="metric-label">Активні квести</div><div class="metric-value">${active}</div></div><div class="card"><div class="metric-label">Асортимент</div><div class="metric-value">${state.shop.length}</div><div class="metric-foot">${lowStock} закінчуються</div></div><div class="card"><div class="metric-label">Наші люди</div><div class="metric-value">${visibleFamilyUsers().length}/${familyMax()}</div></div><div class="card"><div class="metric-label">Сімейний фонд</div><div class="metric-value">${format(state.family.coins)} 🪙</div></div></section>
    <div class="admin-panel-toolbar"><div><strong>Розділи адміністратора</strong><small>Відкривайте лише потрібне вікно — інші автоматично згорнуться.</small></div><button class="btn soft small" data-action="collapse-admin-modules">Згорнути все</button></div>
    <div class="admin-accordion">
      <details class="admin-module" data-admin-module="quests"${adminSectionOpen('quests')}><summary><span>✓</span><div><strong>Квести та логічні ланцюжки</strong><small>Редагування, приховування й власні завдання</small></div></summary><div class="admin-module-body"><div class="section-head"><h2>Поточні квести</h2><button class="btn primary small" data-action="new-quest">+ Додати</button></div><div class="admin-list">${questRows||'<div class="empty-soft">Квестів немає</div>'}</div><div class="section-head"><h2>Стандартна бібліотека</h2><small>Вимкнені шаблони не потрапляють у нову щоденну вибірку</small></div><div class="admin-list">${templateRows}</div></div></details>
      <details class="admin-module" data-admin-module="shop"${adminSectionOpen('shop')}><summary><span>🎁</span><div><strong>Магазин і готові пропозиції</strong><small>Асортимент, залишки та швидке додавання</small></div></summary><div class="admin-module-body"><div class="section-head"><h2>Ваш асортимент</h2><button class="btn primary small" data-action="new-shop">+ Власний товар</button></div><div class="admin-list">${shopRows||'<div class="empty-soft">Магазин порожній</div>'}</div><div class="section-head"><h2>Готова сітка товарів</h2></div><div class="ready-product-grid">${catalog}</div></div></details>
      <details class="admin-module" data-admin-module="transfer"${adminSectionOpen('transfer')}><summary><span>↔</span><div><strong>Перенесення асортименту</strong><small>Копія між сімейними акаунтами</small></div></summary><div class="admin-module-body"><p>Експорт містить лише товари, ціни, іконки, кількість і посилання — без користувачів, балансів та історії.</p><input id="shopImportFile" type="file" accept="application/json,.json" hidden><div class="admin-transfer-actions"><button class="btn primary" data-action="export-shop">Зберегти JSON</button><button class="btn" data-action="copy-shop-json">Копіювати JSON</button><button class="btn" data-action="import-shop">Імпортувати файл</button><button class="btn soft" data-action="paste-shop-json">Вставити з буфера</button></div></div></details>
      <details class="admin-module" data-admin-module="family"${adminSectionOpen('family')}><summary><span>👥</span><div><strong>Сімʼя та учасники</strong><small>Ліміт від 2 до 25 і керування профілями</small></div></summary><div class="admin-module-body"><div class="family-limit-setting"><div><strong>Максимальна кількість членів сімʼї</strong><small>Не можна встановити менше, ніж уже приєднано.</small></div><select id="familyMaxMembers">${[2,3,5,10,15,20,25].map(n=>`<option value="${n}" ${familyMax()===n?'selected':''}>${n}</option>`).join('')}</select><button class="btn primary small" data-action="save-family-limit">Зберегти</button></div><div class="section-head"><h2>Учасники</h2><button class="btn primary small" data-action="grant-coins">Видати монетки</button></div><div class="admin-list">${state.users.map(adminMemberRow).join('')}</div></div></details>
      <details class="admin-module danger-module" data-admin-module="danger"${adminSectionOpen('danger')}><summary><span>⚠</span><div><strong>Небезпечні дії</strong><small>Скидання профілів</small></div></summary><div class="admin-module-body danger-zone"><div class="admin-list">${state.users.map(u=>`<article class="admin-row"><span class="avatar">${u.avatar}</span><div><strong>${u.name}</strong><small>${u.level} рівень</small></div><button class="btn danger small" data-reset-user="${u.id}">Скинути</button></article>`).join('')}</div></div></details>
    </div>`,`Куточок господаря`,`Контролюйте квести, магазин і розмір сімʼї.`);
  }

  function questEditorFields(q={}){return `<div class="form-grid"><div class="field"><label>Іконка</label><input id="qIcon" maxlength="8" value="${escapeHtml(q.icon||'✓')}"></div><div class="field"><label>Назва</label><input id="qTitle" value="${escapeHtml(q.title||'')}"></div><div class="field full"><label>Опис</label><textarea id="qDesc">${escapeHtml(q.description||'')}</textarea></div><div class="field"><label>Тип</label><select id="qType">${[['personal','Особистий'],['coop','Спільний'],['pair','Тільки вдвох'],['limited','Лімітований']].map(x=>`<option value="${x[0]}" ${q.type===x[0]?'selected':''}>${x[1]}</option>`).join('')}</select></div><div class="field"><label>Складність</label><select id="qDifficulty">${[['easy','Легка'],['normal','Середня'],['hard','Складна']].map(x=>`<option value="${x[0]}" ${(q.difficulty||'normal')===x[0]?'selected':''}>${x[1]}</option>`).join('')}</select></div><div class="field"><label>Навичка</label><select id="qSkill">${[['home','Дім'],['care','Турбота'],['health','Здоровʼя'],['growth','Розвиток'],['finance','Фінанси']].map(x=>`<option value="${x[0]}" ${q.skill===x[0]?'selected':''}>${x[1]}</option>`).join('')}</select></div><div class="field"><label>Монети</label><input id="qCoins" type="number" min="0" value="${Number(q.rewardCoins||0)}"></div><div class="field"><label>XP</label><input id="qXp" type="number" min="0" value="${Number(q.rewardXp||0)}"></div><div class="field"><label>Етап</label><select id="qStage">${['Вступний','Базовий','Регулярний','Просунутий','Складний'].map(x=>`<option ${q.stage===x?'selected':''}>${x}</option>`).join('')}</select></div><div class="field full"><label>Відкривається після квесту</label><select id="qPrerequisite"><option value="">Без залежності</option>${state.quests.filter(x=>x.id!==q.id).map(x=>`<option value="${x.id}" ${q.prerequisiteId===x.id?'selected':''}>${escapeHtml(x.title)}</option>`).join('')}</select></div></div>`;}
  function shopEditorFields(i={}){return `<div class="form-grid"><div class="field"><label>Іконка</label><input id="sIcon" maxlength="8" value="${escapeHtml(i.icon||'✨')}"></div><div class="field"><label>Назва</label><input id="sTitle" value="${escapeHtml(i.title||'')}"></div><div class="field full"><label>Опис</label><textarea id="sDesc">${escapeHtml(i.description||'')}</textarea></div><div class="field"><label>Тип</label><select id="sType">${[['personal','Особиста'],['family','Для сімʼї'],['collective','Спільний фонд']].map(x=>`<option value="${x[0]}" ${i.type===x[0]?'selected':''}>${x[1]}</option>`).join('')}</select></div><div class="field"><label>Ціна</label><input id="sPrice" type="number" min="0" value="${Number(i.price||0)}"></div><div class="field"><label>Кількість</label><input id="sStock" type="number" min="0" value="${Number(i.stock||0)}"></div><div class="field"><label>Тривалість, днів</label><input id="sDurationDays" type="number" min="1" max="30" value="${Math.max(1,Math.min(30,Number(i.durationDays||7)))}"></div><div class="field full"><label>Приховане посилання</label><input id="sResourceUrl" value="${escapeHtml(i.resourceUrl||'')}"></div></div>`;}

  function modal(type){
    if(type==='invite') return `<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h2>Тепле запрошення</h2><button class="close" data-close>×</button></div><p>Створіть своє персональне реферальне посилання. Коли людина приєднається, запрошення буде зараховано вам і може відкрити ачивку.</p><div class="form-grid"><div class="field"><label>Скільки діє</label><select id="inviteTtl"><option value="24">24 години</option><option value="72">3 дні</option><option value="168">7 днів</option></select></div><div class="field"><label>Кількість входів</label><select id="inviteUses"><option value="1">Одна людина</option><option value="2">Дві людини</option><option value="4">До чотирьох</option></select></div><div class="field full"><label>Посилання</label><input id="inviteLink" readonly placeholder="Натисніть «Створити»"></div></div><div class="modal-actions"><button class="btn" data-action="copy-invite">Копіювати</button><button class="btn soft" data-action="share-invite">Поділитися</button><button class="btn primary" data-action="create-invite">Створити посилання</button></div></div></div>`;
    if(type==='switch-user') return `<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h2>Оберіть профіль</h2><button class="close" data-close>×</button></div><div class="member-grid" style="grid-template-columns:1fr;margin-top:18px">${state.users.map(u=>`<button class="member" data-select-user="${u.id}" style="text-align:left"><div class="member-head"><span class="avatar">${u.avatar}</span><div><strong>${u.name}</strong><small>${u.level} рівень · ${format(u.coins)} 🪙</small></div></div></button>`).join('')}</div></div></div>`;
    if(type?.startsWith('edit-quest:')){const id=type.split(':')[1],q=state.quests.find(x=>x.id===id);if(!q)return '';return `<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h2>Редагувати квест</h2><button class="close" data-close>×</button></div>${questEditorFields(q)}<div class="modal-actions"><button class="btn" data-close>Скасувати</button><button class="btn primary" data-action="save-edited-quest" data-quest-id="${q.id}">Зберегти</button></div></div></div>`;}
    if(type?.startsWith('edit-template:')){const key=type.split(':')[1],t=DAILY_QUEST_TEMPLATES.find(x=>questTemplateKey(x)===key),o=questTemplateState(key);if(!t)return '';const q={title:o.title||t[0],icon:o.icon||t[1],description:o.description||t[2],skill:o.skill||t[3],difficulty:o.difficulty||t[4],rewardCoins:o.rewardCoins??t[5],rewardXp:o.rewardXp??t[6],type:o.type||'personal'};return `<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h2>Стандартний шаблон</h2><button class="close" data-close>×</button></div>${questEditorFields(q)}<div class="modal-actions"><button class="btn soft" data-action="reset-template" data-template-key="${key}">Скинути зміни</button><button class="btn primary" data-action="save-template" data-template-key="${key}">Зберегти</button></div></div></div>`;}
    if(type?.startsWith('edit-shop:')){const id=type.split(':')[1],i=state.shop.find(x=>x.id===id);if(!i)return '';return `<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h2>Редагувати товар</h2><button class="close" data-close>×</button></div>${shopEditorFields(i)}<div class="modal-actions"><button class="btn" data-close>Скасувати</button><button class="btn primary" data-action="save-edited-shop" data-shop-id="${i.id}">Зберегти</button></div></div></div>`;}
    if(type==='new-quest') return `<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h2>Новий квест</h2><button class="close" data-close>×</button></div><div class="form-grid"><div class="field full"><label>Назва</label><input id="qTitle" placeholder="Наприклад, Прибрати кухню"></div><div class="field"><label>Тип</label><select id="qType"><option value="personal">Особистий</option><option value="coop">Спільний</option><option value="pair">Тільки вдвох</option><option value="limited">Лімітований</option></select></div><div class="field"><label>Складність</label><select id="qDifficulty"><option value="easy">Легка</option><option value="normal" selected>Середня</option><option value="hard">Складна</option></select></div><div class="field"><label>Навичка</label><select id="qSkill"><option value="home">Дім</option><option value="care">Турбота</option><option value="health">Здоровʼя</option><option value="growth">Розвиток</option><option value="finance">Фінанси</option></select></div><div class="field"><label>Монети</label><input id="qCoins" type="number" value="100"></div><div class="field"><label>XP</label><input id="qXp" type="number" value="80"></div><div class="field full"><label>Опис</label><textarea id="qDesc"></textarea></div></div><div class="modal-actions"><button class="btn" data-close>Скасувати</button><button class="btn primary" data-action="save-quest">Створити</button></div></div></div>`;
    if(type==='new-shop') return `<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h2>Нова можливість</h2><button class="close" data-close>×</button></div><div class="form-grid"><div class="field full"><label>Назва</label><input id="sTitle" placeholder="Наприклад, Новий велосипед"></div><div class="field"><label>Іконка</label><input id="sIcon" maxlength="8" value="✨" placeholder="🎁"></div><div class="field"><label>Тип</label><select id="sType"><option value="personal">Особиста</option><option value="family">Для всієї сімʼї</option><option value="collective">Спільний фонд</option></select></div><div class="field"><label>Ціна</label><input id="sPrice" type="number" value="2000"></div><div class="field"><label>Кількість</label><input id="sStock" type="number" value="1"></div><div class="field"><label>Тривалість, днів</label><input id="sDurationDays" type="number" min="1" max="30" value="7"></div><div class="field full"><label>Опис</label><textarea id="sDesc"></textarea></div><div class="field full"><label>Приховане посилання на приклад <small>(необов’язково)</small></label><input id="sResourceUrl" type="url" inputmode="url" placeholder="https://…"><small>У магазині URL не показується — людина бачить лише кнопку «Подивитися, що мається на увазі».</small></div></div><div class="modal-actions"><button class="btn" data-close>Скасувати</button><button class="btn primary" data-action="save-shop">Додати</button></div></div></div>`;

    if(type==='accounts') { const list=loadAccounts(); return `<div class="modal-backdrop accounts-window"><div class="modal accounts-modal"><div class="modal-head"><h2>Мої профілі</h2><button class="close" data-close>×</button></div><p>Перемикайте профілі або додавайте вхід з іншого пристрою.</p><div class="account-vault">${list.length?list.map(a=>`<button class="account-vault-item ${a.id===accountId()?'active':''}" data-account-id="${a.id}"><span class="member-initial">${(a.label||'?').slice(0,1).toUpperCase()}</span><span><strong>${a.label}</strong><small>${a.familyName||'Мій простір'} · ${formatDayMonth(a.updatedAt)}</small></span><b>${a.id===accountId()?'Відкрито':'Перейти'}</b></button>`).join(''):'<div class="card empty">Збережених профілів поки немає</div>'}</div><div class="quick-login-note"><strong>Швидкий JSON входу</strong><p>Відкриває профіль без пароля. Зберігайте файл як ключ доступу.</p></div><input id="accountImportFile" type="file" accept="application/json,.json" hidden><div class="modal-actions wrap"><button class="btn" data-action="add-account">+ Додати профіль</button><button class="btn" data-action="import-account">Відкрити JSON</button><button class="btn primary" data-action="export-login-account">Зберегти JSON входу</button></div></div></div>`; }
    if(type==='edit-profile') { const u=currentUser(); const owned=(state.cosmeticsCatalog||[]).filter(i=>u.inventory.includes(i.id)); const opts=(kind,current)=>`<option value="">Без прикраси</option>${owned.filter(i=>i.kind===kind).map(i=>`<option value="${i.id}" ${current===i.id?'selected':''}>${i.title}</option>`).join('')}`; return `<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h2>Оформлення профілю</h2><button class="close" data-close>×</button></div><div class="cosmetic-preview animated-frame-${cosmetic(u.equipped.animatedFrame)?.asset||'none'}"><span class="animated-name nick-${cosmetic(u.equipped.nicknameEffect)?.asset||'none'}">${u.name}</span><small>Попередній вигляд</small></div><div class="form-grid"><div class="field"><label>Значок біля імені</label><select id="profileBadge">${opts('badge',u.equipped.badge)}</select></div><div class="field"><label>Звичайна рамка</label><select id="profileFrame">${opts('frame',u.equipped.frame)}</select></div><div class="field"><label>Анімована рамка</label><select id="profileAnimatedFrame">${opts('animatedFrame',u.equipped.animatedFrame)}</select></div><div class="field"><label>Світне імʼя</label><select id="profileNicknameEffect">${opts('nicknameEffect',u.equipped.nicknameEffect)}</select></div><div class="field"><label>Ефект профілю</label><select id="profileEffect">${opts('profileEffect',u.equipped.profileEffect)}</select></div><div class="field full"><label>Тема застосунку</label><select id="profileTheme"><option value="light" ${u.equipped.theme==='light'?'selected':''}>Світла</option>${owned.filter(i=>i.kind==='theme').map(i=>`<option value="${i.asset}" ${u.equipped.theme===i.asset?'selected':''}>${i.title}</option>`).join('')}</select></div><div class="field"><label>Звуки</label><select id="profileSoundMode"><option value="off" ${audioPrefs().mode==='off'?'selected':''}>Вимкнено</option><option value="minimal" ${audioPrefs().mode==='minimal'?'selected':''}>Мінімальні</option><option value="full" ${audioPrefs().mode==='full'?'selected':''}>Усі ефекти</option></select></div><div class="field"><label>Вібрація</label><select id="profileHaptics"><option value="on" ${audioPrefs().haptics?'selected':''}>Увімкнена</option><option value="off" ${!audioPrefs().haptics?'selected':''}>Вимкнена</option></select></div></div><p class="auth-help">Тедик не має власних звуків. Одночасно активна одна анімована рамка та один ефект нікнейму. Системне зменшення руху підтримується автоматично.</p><div class="modal-actions"><button class="btn" data-close>Скасувати</button><button class="btn primary" data-action="save-profile-settings">Зберегти</button></div></div></div>`; }

    if(type==='daily-roulette') return `<div class="modal-backdrop daily-gift-backdrop"><div class="modal daily-gift-modal"><div class="daily-gift-head"><span>Щоденний сюрприз</span><small>Один оберт на день</small></div><div class="roulette-wrap"><div class="roulette-pointer">▼</div><div id="dailyRouletteWheel" class="roulette-wheel"><div class="roulette-label r1">+5</div><div class="roulette-label r2">+10</div><div class="roulette-label r3">+50</div><div class="roulette-label r4">+100</div><div class="roulette-label r5">+500</div></div><div class="roulette-hub">✦</div></div><h2 id="rouletteTitle">Крути колесо удачі</h2><p id="rouletteText">На тебе вже чекає маленький подарунок 🌿</p><div class="modal-actions"><button id="rouletteSpinButton" class="btn primary roulette-spin" data-action="spin-daily-roulette">Крутити рулетку</button></div><div class="roulette-odds"><span>+5 · 62%</span><span>+10 · 25%</span><span>+50 · 10%</span><span>+100 · 2,5%</span><span>+500 · 0,5%</span></div></div></div>`;

    if(type==='leave-family') return `<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h2>Вийти із сімʼї?</h2><button class="close" data-close>×</button></div><p>Ваш профіль буде від’єднано від цієї сімʼї. Пароль або PIN не потрібні. Локальну копію цього профілю буде прибрано з поточного PWA.</p><div class="modal-actions"><button class="btn" data-close>Залишитися</button><button class="btn danger" data-action="confirm-leave-family">Вийти</button></div></div></div>`;
    if(type?.startsWith('kick-user:')) { const userId=type.split(':')[1]; const u=state.users.find(x=>x.id===userId); return `<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h2>Виключити ${u?.name||'учасника'}?</h2><button class="close" data-close>×</button></div><p>Учасник втратить доступ до цієї сімʼї на всіх пристроях. Його поточні сімейні сесії буде анульовано.</p><div class="modal-actions"><button class="btn" data-close>Скасувати</button><button class="btn danger" data-action="confirm-kick-user" data-user-id="${userId}">Виключити</button></div></div></div>`; }
    if(type==='grant-coins') return `<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h2>Видати монетки</h2><button class="close" data-close>×</button></div><p>Оберіть учасника та введіть довільну додатну суму.</p><div class="form-grid"><div class="field full"><label>Кому</label><select id="grantCoinsUser">${state.users.map(u=>`<option value="${u.id}">${u.name} · ${format(u.coins)} 🪙</option>`).join('')}</select></div><div class="field full"><label>Сума</label><input id="grantCoinsAmount" type="number" inputmode="numeric" min="1" max="1000000" step="1" placeholder="Наприклад, 250"></div></div><div class="modal-actions"><button class="btn" data-close>Скасувати</button><button class="btn primary" data-action="confirm-grant-coins">Видати</button></div></div></div>`;

    if(type==='important-dates'){const u=currentUser(),items=[...(u?.importantDates||[])].sort((a,b)=>importantDateOrder(a)-importantDateOrder(b));return `<div class="modal-backdrop"><div class="modal important-dates-modal"><div class="modal-head"><h2>Важливі дати</h2><button class="close" data-close>×</button></div><p>Додайте дати, які побачать люди у вашому профілі. Рік не показується.</p><div class="important-date-form"><div class="field"><label>День</label><input id="importantDateDay" type="number" inputmode="numeric" min="1" max="31" placeholder="14"></div><div class="field"><label>Місяць</label><input id="importantDateMonth" type="number" inputmode="numeric" min="1" max="12" placeholder="02"></div><div class="field full"><label>Назва</label><input id="importantDateTitle" maxlength="48" placeholder="Наш особливий день"></div></div><button class="btn primary" style="width:100%" data-action="add-important-date">Додати дату</button><div class="important-date-editor">${items.length?items.map(x=>`<article class="important-date-edit-row"><time>${normalDate(x.day,x.month)}</time><span>${escapeHtml(x.title)}</span><button class="close small" data-delete-important-date="${x.id}" aria-label="Видалити">×</button></article>`).join(''):'<div class="empty-soft">Список поки порожній.</div>'}</div></div></div>`;}

    if(type==='reset-session') return `<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h2>Скинути поточну сесію</h2><button class="close" data-close>×</button></div><p>Це від’єднає Telegram, анулює стару сесію та очистить локальні дані цього пристрою. Після цього потрібно буде підключитися заново.</p><div class="field"><label>Сімейний PIN</label><input id="resetSessionPin" type="password" inputmode="numeric" maxlength="8" placeholder="Введіть PIN"></div><div class="modal-actions"><button class="btn" data-close>Скасувати</button><button class="btn danger" data-action="confirm-reset-session">Почати вхід заново</button></div></div></div>`;
    if(type?.startsWith('reset-user:')) { const userId=type.split(':')[1]; const u=state.users.find(x=>x.id===userId); return `<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h2>Скинути ${u?.name||'користувача'}?</h2><button class="close" data-close>×</button></div><p>Прогрес буде обнулено, Telegram від’єднано, а всі старі сесії цього користувача стануть недійсними.</p><div class="field"><label>Сімейний PIN</label><input id="resetUserPin" type="password" inputmode="numeric" maxlength="8" placeholder="Введіть PIN"></div><div class="field"><label>Підтвердження</label><input id="resetConfirmText" autocomplete="off" placeholder="Напишіть СКИНУТИ"></div><div class="modal-actions"><button class="btn" data-close>Скасувати</button><button class="btn danger" data-action="confirm-reset-user" data-user-id="${userId}">Скинути назавжди</button></div></div></div>`; }
    return '';
  }


  // myHabbit 9.3 — Cozy Companion Framework
  const CozyEvents = (()=>{
    const listeners=new Map();
    return {
      on(type,handler){const list=listeners.get(type)||[];list.push(handler);listeners.set(type,list);return()=>listeners.set(type,(listeners.get(type)||[]).filter(x=>x!==handler));},
      emit(type,detail={}){(listeners.get(type)||[]).forEach(handler=>{try{handler(detail);}catch(error){console.warn('Cozy event:',error);}});}
    };
  })();

  const CozyCompanion = (()=>{
    const KEY='myHabbitCozyCompanionV1';
    const stateOf=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
    const write=value=>localStorage.setItem(KEY,JSON.stringify({...stateOf(),...value}));
    let tour=null,stepIndex=0,tipTimer=0,achievementTimer=0;
    const companionAchievementQueue=[];
    let companionAchievementBusy=false;
    const memberSteps=[
      {route:'dashboard',selector:'[data-route="dashboard"]',title:'Твій затишний простір',text:'Тут зібрано прогрес, серію та найважливіше на сьогодні.'},
      {route:'quests',selector:'[data-route="quests"]',title:'Щоденні квести',text:'Виконуй звички й отримуй XP та монетки. Починай з маленьких кроків.'},
      {route:'profile',selector:'[data-route="profile"]',title:'Твій профіль',text:'Тут росте рівень, відкриваються досягнення та зберігається твоя історія.'},
      {route:'shop',selector:'[data-route="shop"]',title:'Магазин',text:'Витрачай зароблені монетки на приємні речі й косметику.'},
      {route:'family',selector:'[data-route="family"]',title:'Разом тепліше',text:'Тут видно прогрес сімʼї та можна підтримувати одне одного.'}
    ];
    const adminSteps=[
      ...memberSteps,
      {route:'admin',selector:'[data-route="admin"]',title:'Керування сімʼєю',text:'Створюй квести, наповнюй магазин і запрошуй учасників.'}
    ];
    const dailyTips=[
      'Маленький крок сьогодні важливіший за ідеальний план на завтра.',
      'Не потрібно виконувати все одразу. Обери одну добру дію.',
      'Серія — це не тиск. Це лише теплий слід твоєї послідовності.',
      'Похвали себе за те, що вже зроблено, а не лише за те, що залишилось.',
      'Спільні звички стають легшими, коли ви підтримуєте одне одного.'
    ];
    function ensureRoot(){
      if(document.getElementById('cozyCompanionRoot'))return;
      document.body.insertAdjacentHTML('beforeend',`<div id="cozyCompanionRoot" class="cozy-companion-root" aria-live="polite">
        <button class="cozy-bear-button" type="button" aria-label="Відкрити Тедика"><span>🐻</span><i></i></button>
        <div class="cozy-bubble" hidden><button class="cozy-bubble-close" aria-label="Закрити">×</button><small>Тедик</small><strong></strong><p></p><div class="cozy-bubble-actions"></div></div>
      </div>`);
      const root=document.getElementById('cozyCompanionRoot');
      root.querySelector('.cozy-bear-button').addEventListener('click',openMenu);
      root.querySelector('.cozy-bubble-close').addEventListener('click',closeBubble);
    }
    function showBubble(title,text,actions=''){
      ensureRoot();
      const root=document.getElementById('cozyCompanionRoot');
      const bubble=root?.querySelector('.cozy-bubble');
      if(!bubble)return;
      bubble.querySelector('strong').textContent=title;
      bubble.querySelector('p').textContent=text;
      bubble.querySelector('.cozy-bubble-actions').innerHTML=actions;
      bubble.hidden=false;
      bubble.classList.add('is-open');
      root.classList.add('is-open');
      bubble.querySelectorAll('[data-cozy-action]').forEach(btn=>btn.addEventListener('click',()=>handle(btn.dataset.cozyAction),{once:true}));
    }
    function closeBubble(){
      const root=document.getElementById('cozyCompanionRoot');
      const bubble=root?.querySelector('.cozy-bubble');
      if(bubble){bubble.classList.remove('is-open');bubble.hidden=true;}
      root?.classList.remove('is-open');
      clearHighlight();
    }
    function openMenu(){
      const muted=stateOf().muted===true;
      showBubble('Привіт! Я поруч 💚','Можу провести екскурсію або залишити коротку підказку.',`<button data-cozy-action="tour">🎓 Почати тур</button><button data-cozy-action="tip">🌱 Порада дня</button><button data-cozy-action="mute">${muted?'🔔 Увімкнути':'🔕 Не турбувати'}</button>`);
    }
    function handle(name){
      if(name==='tour')startTour(true);
      if(name==='tip')showDailyTip(true);
      if(name==='mute'){const muted=!stateOf().muted;write({muted});showBubble('Налаштування збережено',muted?'Я не показуватиму автоматичні підказки.':'Теплі підказки знову увімкнені.','<button data-cozy-action="close">Гаразд</button>');}
      if(name==='next')nextStep();
      if(name==='prev'){stepIndex=Math.max(0,stepIndex-2);nextStep();}
      if(name==='skip'){finishTour(false);}
      if(name==='close')closeBubble();
      if(name==='achievement-next')finishAchievementAnnouncement();
    }
    function clearHighlight(){document.querySelectorAll('.cozy-tour-target').forEach(x=>x.classList.remove('cozy-tour-target'));document.querySelector('.cozy-tour-overlay')?.remove();}
    function highlight(selector){
      clearHighlight();const target=document.querySelector(selector);if(!target)return;
      document.body.insertAdjacentHTML('beforeend','<div class="cozy-tour-overlay" aria-hidden="true"></div>');
      target.classList.add('cozy-tour-target');target.scrollIntoView({behavior:'smooth',block:'center'});
    }
    function startTour(manual=false){
      tour=isAdmin()?adminSteps:memberSteps;stepIndex=0;write({tourStarted:true});
      if(manual)closeBubble();nextStep();
    }
    function nextStep(){
      if(!tour||stepIndex>=tour.length){finishTour(true);return;}
      const item=tour[stepIndex++];
      if(route!==item.route){go(item.route);setTimeout(()=>present(item),100);}else present(item);
    }
    function present(item){
      highlight(item.selector);
      const pos=`${stepIndex} / ${tour.length}`;
      showBubble(`${item.title} · ${pos}`,item.text,`${stepIndex>1?'<button data-cozy-action="prev">Назад</button>':''}<button data-cozy-action="skip">Пропустити</button><button class="primary" data-cozy-action="next">${stepIndex===tour.length?'Готово':'Далі'}</button>`);
    }
    function finishTour(completed){
      clearHighlight();write({tourCompleted:completed,completedAt:Date.now()});tour=null;
      showBubble(completed?'Усе готово ✨':'Екскурсію зупинено',completed?'Тепер можна спокійно досліджувати myHabbit. Я залишуся поруч, але не заважатиму.':'Тур завжди можна запустити знову через ведмедика.','<button data-cozy-action="close">Почати</button>');
    }
    function showDailyTip(manual=false){
      const data=stateOf(),day=new Date().toISOString().slice(0,10);
      if(!manual&&(data.lastTipDay===day||data.muted))return;
      const tip=dailyTips[Math.abs([...day].reduce((a,c)=>a+c.charCodeAt(0),0))%dailyTips.length];
      write({lastTipDay:day});showBubble('Порада дня 🌱',tip,'<button data-cozy-action="close">Дякую</button>');
      if(!manual){clearTimeout(tipTimer);tipTimer=setTimeout(closeBubble,9000);}
    }
    function finishAchievementAnnouncement(){
      clearTimeout(achievementTimer);closeBubble();companionAchievementBusy=false;
      setTimeout(processAchievementAnnouncements,220);
    }
    function processAchievementAnnouncements(){
      if(companionAchievementBusy||!companionAchievementQueue.length||stateOf().muted)return;
      companionAchievementBusy=true;
      const a=companionAchievementQueue.shift();
      const reward=Number(a?.rewardXp||0)>0?` · +${format(a.rewardXp)} XP`:'';
      const description=a?.description?` ${a.description}`:'';
      showBubble(`Нове досягнення! ${a?.icon&&!String(a.icon).startsWith('/')?a.icon:'🏆'}`,`${a?.title||'Ти зробив важливий крок.'}${reward}.${description}`,'<button class="primary" data-cozy-action="achievement-next">Чудово</button>');
      clearTimeout(achievementTimer);achievementTimer=setTimeout(finishAchievementAnnouncement,8500);
    }
    function announceAchievement(a){
      companionAchievementQueue.push(a||{});processAchievementAnnouncements();
    }
    function contextualMessage(){
      const data=stateOf();
      if(data.muted)return;
      const u=currentUser();if(!u)return;
      const profileKey=accountId()||`${state.family?.id||state.family?.code||'family'}:${u.id||'user'}`;
      const coinReminderState={...(data.coinReminderState||{})};
      const hasShopCoins=Number(u.coins||0)>=1000;
      if(!hasShopCoins&&coinReminderState[profileKey]){
        delete coinReminderState[profileKey];
        write({coinReminderState});
      }
      if(Number(u.streak||0)>=7&&Number(u.streak||0)%7===0)return showBubble('Твоя серія росте 🔥',`Уже ${u.streak} днів. Це чудова послідовність!`,'<button data-cozy-action="close">Продовжуємо</button>');
      if(hasShopCoins&&!coinReminderState[profileKey]){
        coinReminderState[profileKey]={shownAt:Date.now(),threshold:1000};
        write({coinReminderState});
        return showBubble('Монетки чекають 🪙','У тебе вже достатньо монеток, щоб зазирнути до магазину.','<button data-cozy-action="close">Добре</button>');
      }
      showDailyTip(false);
    }
    function afterRender(){
      if(!auth||['landing','auth'].includes(route)){document.getElementById('cozyCompanionRoot')?.remove();return;}
      ensureRoot();clearHighlight();
      const data=stateOf();
      if(!data.tourCompleted&&!data.tourStarted&&!data.muted)setTimeout(()=>startTour(false),650);
      else if(!data.muted)setTimeout(contextualMessage,1100);
    }
    CozyEvents.on('achievement',a=>{if(!stateOf().muted)announceAchievement(a);});
    CozyEvents.on('levelup',d=>{if(!stateOf().muted)showBubble('Новий рівень! ⭐',`Тепер у тебе ${d.level} рівень. Я пишаюся тобою!`,'<button data-cozy-action="close">Далі</button>');});
    return {afterRender,startTour,showDailyTip,emit:CozyEvents.emit};
  })();

  function render(){
    if(auth && ['landing','auth'].includes(route) && !inviteToken){
      route='dashboard';
      try{history.replaceState({},'', '/?screen=dashboard');}catch{}
    }
    if(!auth && !['landing','auth'].includes(route)) route='landing';
    normalizeState();
    const screens={landing,auth:authScreen,dashboard,quests:questsScreen,match3:match3Screen,shop:shopScreen,'custom-shop':customShopScreen,collections:collectionsScreen,museum:museumScreen,achievements:achievementsScreen,family:familyScreen,profile:()=>profileScreen(),admin:adminScreen};
    try{
      app.innerHTML=(screens[route]||landing)(); applyTheme(); bind(); applyLanguage(app); CozyCompanion.afterRender();
    }catch(error){
      console.error('Render error:',error);
      app.innerHTML=`<main class="fatal-card"><h1>Не вдалося відкрити розділ</h1><p>${String(error?.message||error)}</p><button class="btn primary" data-route="dashboard">На головну</button></main>`;
      bind(); applyLanguage(app);
    }
  }

  function bind(){
    document.querySelectorAll('button,[data-route],[role=button]').forEach(el=>{if(el.dataset.cozySoundBound)return;el.dataset.cozySoundBound='1';el.addEventListener('pointerdown',()=>playCozySound(el.matches('[data-route],.menu-button,.hamburger')?'menu':'tap','full'),{passive:true});});
    document.querySelectorAll('[data-route]').forEach(el=>el.addEventListener('click',()=>{document.body.classList.remove('menu-open');go(el.dataset.route);}));
    document.querySelectorAll('[data-language-select]').forEach(el=>el.addEventListener('change',()=>{appLanguage=el.value==='en'?'en':'uk';localStorage.setItem(LANGUAGE_KEY,appLanguage);render();}));
    document.querySelectorAll('[data-action]').forEach(el=>el.addEventListener('click',()=>action(el.dataset.action,el)));
    document.querySelectorAll('details[data-admin-module]').forEach(panel=>panel.addEventListener('toggle',()=>{if(!panel.open)return;document.querySelectorAll('details[data-admin-module]').forEach(other=>{if(other!==panel)other.open=false;});localStorage.setItem(ADMIN_PANEL_SECTION_KEY,panel.dataset.adminModule||'');}));
    document.querySelectorAll('[data-quest]').forEach(el=>el.addEventListener('click',()=>handleQuest(el.dataset.quest)));
    document.querySelectorAll('[data-shop]').forEach(el=>el.addEventListener('click',()=>handleShop(el.dataset.shop)));
    document.querySelectorAll('[data-account-id]').forEach(x=>x.addEventListener('click',()=>switchAccount(x.dataset.accountId)));
    const accountImport=document.getElementById('accountImportFile'); if(accountImport)accountImport.addEventListener('change',e=>importAccountFile(e.target.files?.[0]));
    document.querySelectorAll('[data-buy]').forEach(el=>el.addEventListener('click',()=>handleShop(el.dataset.buy)));
    document.querySelectorAll('[data-open-box]').forEach(el=>el.addEventListener('click',()=>openStickerBox(el.dataset.openBox)));
    document.querySelectorAll('[data-open-album]').forEach(el=>el.addEventListener('click',()=>openAlbum(el.dataset.openAlbum)));
    bindMatch3Controls();
    document.querySelectorAll('[data-cosmetic]').forEach(el=>el.addEventListener('click',()=>handleCosmetic(el.dataset.cosmetic)));
    document.querySelectorAll('[data-cosmetic-filter]').forEach(el=>el.addEventListener('click',()=>{const kind=el.dataset.cosmeticFilter;document.querySelectorAll('[data-cosmetic-filter]').forEach(x=>x.classList.toggle('active',x===el));document.querySelectorAll('.cosmetic-filter-item').forEach(x=>x.hidden=kind!=='all'&&x.dataset.kind!==kind);}));
    document.querySelectorAll('[data-remove-sticker]').forEach(el=>el.addEventListener('click',()=>removeSticker(el.dataset.removeSticker)));
    document.querySelectorAll('[data-member]').forEach(el=>el.addEventListener('click',()=>{app.innerHTML=profileScreen(el.dataset.member);bind();scrollTo(0,0)}));
    document.querySelectorAll('[data-admin-toggle-quest]').forEach(el=>el.addEventListener('click',()=>{const q=state.quests.find(x=>x.id===el.dataset.adminToggleQuest);if(q){q.status=q.status==='active'?'paused':'active';save();render();}}));
    document.querySelectorAll('[data-admin-delete-quest]').forEach(el=>el.addEventListener('click',()=>{state.quests=state.quests.filter(x=>x.id!==el.dataset.adminDeleteQuest);save();render();showToast('Завдання видалено');}));
    document.querySelectorAll('[data-admin-delete-shop]').forEach(el=>el.addEventListener('click',()=>{state.shop=state.shop.filter(x=>x.id!==el.dataset.adminDeleteShop);save();render();showToast('Позицію видалено');}));
    document.querySelectorAll('[data-edit-quest]').forEach(el=>el.addEventListener('click',()=>openNamedModal(`edit-quest:${el.dataset.editQuest}`)));
    document.querySelectorAll('[data-edit-template]').forEach(el=>el.addEventListener('click',()=>openNamedModal(`edit-template:${el.dataset.editTemplate}`)));
    document.querySelectorAll('[data-toggle-template]').forEach(el=>el.addEventListener('click',()=>{const key=el.dataset.toggleTemplate,o=questTemplateState(key);o.enabled=o.enabled===false;state.questTemplateSettings[key]=o;state.meta.dailyQuestDay='';save();render();showToast(o.enabled===false?'Шаблон прибрано':'Шаблон повернуто');}));
    document.querySelectorAll('[data-edit-shop]').forEach(el=>el.addEventListener('click',()=>openNamedModal(`edit-shop:${el.dataset.editShop}`)));
    document.querySelectorAll('[data-add-ready-shop]').forEach(el=>el.addEventListener('click',()=>{const row=el.closest('.ready-product'),qty=Math.max(1,Number(row?.querySelector('input')?.value||1)),x=READY_SHOP_CATALOG.find(y=>y[0]===el.dataset.addReadyShop);if(!x)return;const existing=state.shop.find(i=>i.catalogId===x[0]);if(existing)existing.stock=Number(existing.stock||0)+qty;else state.shop.unshift({id:crypto.randomUUID(),catalogId:x[0],icon:x[1],title:x[2],description:x[3],price:x[4],stock:qty,type:x[5],fund:0,source:'catalog'});save();render();showToast(`Додано: ${x[2]} ×${qty}`);}));

    document.querySelectorAll('[data-reset-user]').forEach(el=>el.addEventListener('click',()=>openResetUserDialog(el.dataset.resetUser)));
    document.querySelectorAll('[data-kick-user]').forEach(el=>el.addEventListener('click',()=>{document.body.insertAdjacentHTML('beforeend',modal(`kick-user:${el.dataset.kickUser}`));bindModal();}));
    document.querySelectorAll('[data-toggle-admin-hidden]').forEach(el=>el.addEventListener('click',()=>toggleAdminFamilyVisibility(el.dataset.toggleAdminHidden)));
    document.querySelectorAll('[data-stock]').forEach(el=>el.addEventListener('click',()=>{const i=state.shop.find(x=>x.id===el.dataset.stock);if(i){i.stock=Math.max(0,i.stock+Number(el.dataset.delta));save();render();}}));
    document.getElementById('shopImportFile')?.addEventListener('change',importShopFile);
    document.querySelectorAll('[data-filter],[data-difficulty-filter]').forEach(el=>el.addEventListener('click',()=>{const group=el.hasAttribute('data-filter')?'[data-filter]':'[data-difficulty-filter]';document.querySelectorAll(group).forEach(x=>x.classList.remove('active'));el.classList.add('active');const type=document.querySelector('[data-filter].active')?.dataset.filter||'all',difficulty=document.querySelector('[data-difficulty-filter].active')?.dataset.difficultyFilter||'all';document.getElementById('questList').innerHTML=state.quests.filter(q=>q.status==='active'&&(type==='all'||q.type===type)&&(difficulty==='all'||(q.difficulty||'normal')===difficulty)).map(questCard).join('');bind();}));
    document.querySelectorAll('[data-auth-tab]').forEach(el=>el.addEventListener('click',()=>{authMode=el.dataset.authTab;document.querySelectorAll('[data-auth-tab]').forEach(x=>x.classList.remove('active'));el.classList.add('active');document.getElementById('authForm').innerHTML=authForm(authMode);bind();}));
    const authImportFile=document.getElementById('accountImportFile'); if(authImportFile&&!authImportFile.dataset.bound){authImportFile.dataset.bound='1';authImportFile.addEventListener('change',e=>importAccountFile(e.target.files?.[0]));}
  }

  function action(name, el){
    if(name==='collapse-admin-modules'){document.querySelectorAll('details[data-admin-module]').forEach(panel=>panel.open=false);localStorage.removeItem(ADMIN_PANEL_SECTION_KEY);return;}
    if(name==='pwa-guide-prev'){pwaGuideStep=Math.max(0,pwaGuideStep-1);renderPwaGuide();}
    if(name==='pwa-guide-next'){const last=pwaGuideSlides().length-1;if(pwaGuideStep>=last){localStorage.setItem(PWA_ONBOARDING_SEEN,'completed');document.querySelector('.pwa-install-guide')?.remove();}else{pwaGuideStep++;renderPwaGuide();}}
    if(name==='pwa-guide-skip'){localStorage.setItem(PWA_ONBOARDING_SEEN,'skipped');document.querySelector('.pwa-install-guide')?.remove();}
    if(name==='install-pwa-now')installPwaNow();
    if(name==='open-pwa-guide'){localStorage.removeItem(PWA_ONBOARDING_SEEN);showPwaInstallGuide();}
    if(name==='existing-login'){authMode='login';go('auth');}
    if(name==='create-family'){authMode='create';go('auth');}
    if(name==='join-family'){authMode='join';render();}
    if(name==='join-family-from-start'){authMode='join';go('auth');}
    if(name==='demo'){auth={demo:true};state=clone(seed);safeJsonWrite(AUTH,auth);safeJsonWrite(STORAGE,state);persistAccount();go('dashboard');}
    if(name==='exit-demo'){localStorage.removeItem(AUTH);localStorage.removeItem(STORAGE);auth=null;state=clone(seed);go('landing');showToast('Демо завершено');}
    if(name==='logout'){logoutCurrentAccount();}
    if(['switch-user','new-quest','new-shop','accounts'].includes(name)){if(name==='accounts')document.body.classList.remove('menu-open');document.body.insertAdjacentHTML('beforeend',modal(name));bindModal();}
    if(name==='toggle-menu'){const opened=document.body.classList.toggle('menu-open');const trigger=document.querySelector('.global-menu-trigger');if(trigger)trigger.setAttribute('aria-expanded',opened?'true':'false');}
    if(name==='close-menu'){document.body.classList.remove('menu-open');const trigger=document.querySelector('.global-menu-trigger');if(trigger)trigger.setAttribute('aria-expanded','false');}
    if(name==='telegram-connect') connectTelegram();
    if(name==='telegram-login') openTelegramLogin();
    if(name==='telegram-refresh') checkTelegram();
    if(name==='admin-process-now') adminProcessNow();
    if(name==='save-family-limit') saveFamilyLimit();
    if(name==='export-shop') exportShop();
    if(name==='copy-shop-json') copyShopJson();
    if(name==='import-shop'){document.getElementById('shopImportFile')?.click();}
    if(name==='paste-shop-json') pasteShopJson();
    if(name==='spin-daily-roulette') spinDailyRoulette();
    if(name==='claim-level-rewards') claimLevelRewards();
    if(name==='start-match3') startMatch3();
    if(name==='send-profile-gift') sendProfileGift();
    if(name==='transfer-family-coins') transferFamilyCoins();
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
    if(name==='save-edited-quest') saveEditedQuest(el.dataset.questId);
    if(name==='save-template') saveQuestTemplate(el.dataset.templateKey);
    if(name==='reset-template') resetQuestTemplate(el.dataset.templateKey);
    if(name==='save-edited-shop') saveEditedShop(el.dataset.shopId);
    if(name==='save-profile-settings') saveProfileSettings();
    if(name==='add-account'){document.querySelector('.modal-backdrop')?.remove();localStorage.removeItem(AUTH);localStorage.removeItem(STORAGE);localStorage.removeItem(ACTIVE_ACCOUNT);auth=null;state=clone(seed);authMode='create';go('auth');}
    if(name==='export-login-account') exportLoginAccount();
    if(name==='export-account') exportAccount();
    if(name==='share-account') shareAccount();
    if(name==='confirm-share-account') performPendingAccountShare();
    if(name==='download-pending-account') downloadPendingAccountFile();
    if(name==='import-account') document.getElementById('accountImportFile')?.click();
  }
  function openNamedModal(name){const html=modal(name);if(!html)return;document.body.insertAdjacentHTML('beforeend',html);bindModal();}
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
  async function createEncryptedAccountFile(){
    const password=document.getElementById('transferPassword')?.value||'';
    if(password.length<6){showToast('Створіть пароль від 6 символів');return null;}
    persistAccount();
    const payload={format:'myHabbit-profile',version:1,exportedAt:new Date().toISOString(),account:loadAccounts().find(x=>x.id===accountId())};
    const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12));
    const key=await deriveTransferKey(password,salt);
    const encrypted=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,new TextEncoder().encode(JSON.stringify(payload)));
    const box={format:'myHabbit-encrypted-profile',version:1,kdf:'PBKDF2-SHA256',iterations:180000,salt:b64(salt),iv:b64(iv),data:b64(encrypted)};
    const filename=`myHabbit-${currentUser()?.name||'profile'}-${new Date().toISOString().slice(0,10)}.json`;
    return {blob:new Blob([JSON.stringify(box,null,2)],{type:'application/json'}),filename};
  }
  let pendingAccountShare=null;
  function downloadBlobFile(blob,filename){
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url;a.download=filename;a.style.display='none';
    document.body.appendChild(a);a.click();
    setTimeout(()=>{a.remove();URL.revokeObjectURL(url);},2500);
  }
  function createPasswordlessAccountFile(){
    persistAccount();
    const account=loadAccounts().find(x=>x.id===accountId());
    if(!account?.auth||!account?.state){showToast('Не вдалося підготувати профіль');return null;}
    const payload={format:'myHabbit-login-profile',version:1,exportedAt:new Date().toISOString(),warning:'This file grants access to the profile without a password.',account};
    const filename=`myHabbit-login-${currentUser()?.name||'profile'}-${new Date().toISOString().slice(0,10)}.json`;
    return {blob:new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),filename};
  }
  function exportLoginAccount(){
    const result=createPasswordlessAccountFile();if(!result)return;
    const approved=confirm('Швидкий JSON входу відкриває профіль без пароля. Людина, яка отримає цей файл, зможе увійти у ваш профіль. Зберегти файл?');
    if(!approved)return;
    downloadBlobFile(result.blob,result.filename);showToast('Швидкий JSON входу збережено');
  }
  async function exportAccount(){
    const result=await createEncryptedAccountFile();if(!result)return;
    downloadBlobFile(result.blob,result.filename);showToast('Захищену копію створено');
  }
  async function shareAccount(){
    const result=await createEncryptedAccountFile();if(!result)return;
    const file=new File([result.blob],result.filename,{type:'application/json'});
    pendingAccountShare={...result,file,text:await result.blob.text()};
    document.querySelector('.modal-backdrop')?.remove();
    document.body.insertAdjacentHTML('beforeend',`<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h2>Файл готовий</h2><button class="close" data-close>×</button></div><p>Натисніть кнопку нижче, щоб Android відкрив системне меню поширення. Друге натискання потрібне, щоб браузер не втрачав дозвіл користувача під час шифрування файлу.</p><div class="modal-actions wrap"><button class="btn primary" data-action="confirm-share-account">📤 Відкрити меню поширення</button><button class="btn" data-action="download-pending-account">⬇ Зберегти файл</button></div></div></div>`);
    bindModal();
  }
  async function performPendingAccountShare(){
    const item=pendingAccountShare;if(!item)return showToast('Спочатку підготуйте JSON');
    try{
      if(typeof navigator.share!=='function')return downloadPendingAccountFile('Меню поширення недоступне — файл збережено');
      const canFiles=typeof navigator.canShare==='function'&&navigator.canShare({files:[item.file]});
      if(canFiles){
        await navigator.share({title:'Мій профіль myHabbit',text:'Захищена копія профілю myHabbit. Пароль передайте окремо.',files:[item.file]});
      }else{
        await navigator.share({title:'Мій профіль myHabbit',text:item.text});
      }
      document.querySelector('.modal-backdrop')?.remove();
      showToast('JSON профілю передано');
    }catch(e){
      if(e?.name==='AbortError')return;
      downloadPendingAccountFile('Не вдалося відкрити меню — файл збережено');
    }
  }
  function downloadPendingAccountFile(message='Захищену копію збережено'){
    const item=pendingAccountShare;if(!item)return showToast('Спочатку підготуйте JSON');
    downloadBlobFile(item.blob,item.filename);
    showToast(message);
  }
  function storeImportedAccount(item){if(!item?.id||!item?.auth||!item?.state)throw new Error('Профіль пошкоджено');const list=loadAccounts();const i=list.findIndex(x=>x.id===item.id);if(i>=0)list[i]=item;else list.unshift(item);safeJsonWrite(ACCOUNTS,list.slice(0,25));switchAccount(item.id);}
  async function importAccountFile(file){if(!file)return;try{const box=JSON.parse(await file.text());if(box.format!=='myHabbit-login-profile')throw new Error('Оберіть швидкий JSON входу myHabbit');storeImportedAccount(box.account);showToast('Вхід через JSON виконано');}catch(e){showToast(e.message||'Не вдалося відкрити JSON');}}
  function switchAccount(id,options={}){if(options.persistCurrent!==false&&auth)persistAccount();localStorage.removeItem(LOGOUT_TOMBSTONE);const item=loadAccounts().find(x=>x.id===id);if(!item)return false;auth=clone(item.auth);state=clone(item.state);normalizeState();safeJsonWrite(AUTH,auth);safeJsonWrite(STORAGE,state);localStorage.setItem(ACTIVE_ACCOUNT,id);document.querySelector('.modal-backdrop')?.remove();route='dashboard';history.replaceState({},'', '/?screen=dashboard');render();pullRemote().then(()=>render()).catch(()=>{});return true;}

  function clearSessionStorageKeys(){
    [AUTH,`${AUTH}:backup`,`${AUTH}:temp`,STORAGE,`${STORAGE}:backup`,`${STORAGE}:temp`,ACTIVE_ACCOUNT].forEach(key=>localStorage.removeItem(key));
  }
  function removeActiveAccountLocally(){
    const id=accountId();
    const remaining=loadAccounts().filter(a=>a.id!==id);
    safeJsonWrite(ACCOUNTS,remaining);
    localStorage.setItem(LOGOUT_TOMBSTONE,String(Date.now()));
    clearSessionStorageKeys();
    auth=null; state=clone(seed);
    return remaining.sort((a,b)=>Number(b.updatedAt||0)-Number(a.updatedAt||0));
  }
  function logoutCurrentAccount(){
    const remaining=removeActiveAccountLocally();
    if(remaining.length&&switchAccount(remaining[0].id,{persistCurrent:false})){showToast('Перемкнули на інший профіль');return;}
    route='landing';history.replaceState({},'', '/');render();scrollTo(0,0);showToast('Ви вийшли з профілю');
  }
  async function leaveFamily(){
    try{
      await api('/api/family/leave',{method:'POST',body:'{}'});
      const remaining=removeActiveAccountLocally();
      document.querySelector('.modal-backdrop')?.remove();
      if(remaining.length&&switchAccount(remaining[0].id,{persistCurrent:false})){showToast('Ви вийшли із сімʼї. Відкрито інший профіль');return;}
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
    try{ const data=await api('/api/admin/reset-user',{method:'POST',body:JSON.stringify({userId,pin})}); if(data.resetSelf){await clearLocalAppData();location.replace(`/?reset=${Date.now()}`);return;} if(data.state){state=data.state;normalizeState();safeJsonWrite(STORAGE,state);} document.querySelector('.modal-backdrop')?.remove();render();showToast('Користувача скинуто. Старі сесії вимкнено.'); }catch(e){showToast(e.message);}
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
    try{const data=await api('/api/family/invite-join',{method:'POST',body:JSON.stringify({token:inviteToken,name,gender,initData:telegramInitData})});auth={token:data.token,userId:data.userId};safeJsonWrite(AUTH,auth);state=data.state;normalizeState();safeJsonWrite(STORAGE,state);persistAccount();history.replaceState({},'', '/?screen=dashboard');route='dashboard';render();showToast('Ви вже разом ✨');}catch(e){showToast(e.message);}
  }

  async function openTelegramLogin(){
    if(!isTelegramWebApp){ return; }
    try{
      const cfg=await api('/api/telegram/config');
      if(!cfg.botUsername)throw new Error('Telegram-бот ще не налаштований');
      const url=`https://t.me/${cfg.botUsername}?startapp=resume`;
      location.href=url;
    }catch(e){showToast(e.message);}
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

  async function resumeTelegramSession(){try{const data=await api('/api/family/telegram-resume',{method:'POST',body:JSON.stringify({initData:telegramInitData})});if(!data?.token)return;auth={token:data.token,userId:data.userId};safeJsonWrite(AUTH,auth);state=data.state;normalizeState();safeJsonWrite(STORAGE,state);persistAccount();go('dashboard');showToast('Повернули ваш Telegram-профіль');}catch(e){console.info('Telegram resume:',e.message);}}

  async function submitAuth(mode){
    const familyValue=document.getElementById('familyValue').value.trim();const name=document.getElementById('memberName').value.trim();const pin=document.getElementById('familyPin').value.trim();const gender=document.getElementById('memberGender').value;
    if(!familyValue||!name||pin.length<4)return showToast('Заповніть поля та PIN');
    try{
      const endpoint = mode==='create' ? '/api/family/create' : (isTelegramWebApp ? '/api/family/telegram-join' : '/api/family/join');
      const data=await api(endpoint,{method:'POST',body:JSON.stringify({familyName:mode==='create'?familyValue:undefined,code:mode==='join'?familyValue:undefined,pin,name,gender,initData:telegramInitData})});
      auth={token:data.token,userId:data.userId};safeJsonWrite(AUTH,auth);if(data.state)state=data.state;normalizeState();safeJsonWrite(STORAGE,state);persistAccount();go('dashboard');
    }catch(e){showToast(e.message||'Не вдалося увійти. Перевірте код, PIN або спосіб входу.');}
  }

  function saveFamilyLimit(){const value=Math.max(2,Math.min(25,Number(document.getElementById('familyMaxMembers')?.value||5)));if(value<state.users.length)return showToast(`У сімʼї вже ${state.users.length} учасників`);state.family.maxMembers=value;save();render();showToast(`Ліміт сімʼї: ${value}`);}
  function shopExportData(){return {format:'myHabbit-shop-v1',exportedAt:new Date().toISOString(),items:(state.shop||[]).map(({id,...i})=>i)};}
  function downloadJson(data,name){const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),500);}
  function exportShop(){downloadJson(shopExportData(),`myHabbit-shop-${localDay()}.json`);showToast('Асортимент збережено');}
  async function copyShopJson(){try{await navigator.clipboard.writeText(JSON.stringify(shopExportData()));showToast('JSON скопійовано');}catch(e){showToast('Не вдалося скопіювати');}}
  function mergeShopImport(data){const items=Array.isArray(data)?data:data?.items;if(!Array.isArray(items))throw new Error('Невірний формат');for(const raw of items){if(!raw||!raw.title)continue;const item={id:crypto.randomUUID(),title:String(raw.title).slice(0,100),icon:String(raw.icon||'✨').slice(0,8),description:String(raw.description||'').slice(0,500),price:Math.max(0,Number(raw.price||0)),stock:Math.max(0,Number(raw.stock||0)),type:['personal','family','collective'].includes(raw.type)?raw.type:'personal',fund:Math.max(0,Number(raw.fund||0)),resourceUrl:cleanResourceUrl(raw.resourceUrl)||'',source:'import'};const same=state.shop.find(x=>x.title.trim().toLowerCase()===item.title.trim().toLowerCase());if(same)Object.assign(same,item,{id:same.id});else state.shop.push(item);}save();render();showToast('Асортимент імпортовано');}
  async function importShopFile(e){const file=e.target.files?.[0];if(!file)return;try{mergeShopImport(JSON.parse(await file.text()));}catch(err){showToast(err.message||'Помилка файлу');}e.target.value='';}
  async function pasteShopJson(){try{mergeShopImport(JSON.parse(await navigator.clipboard.readText()));}catch(e){showToast('У буфері немає правильного JSON');}}
  function readQuestEditor(){return {title:(document.getElementById('qTitle')?.value||'').trim(),icon:(document.getElementById('qIcon')?.value||'✓').trim()||'✓',description:(document.getElementById('qDesc')?.value||'').trim(),type:document.getElementById('qType')?.value||'personal',difficulty:document.getElementById('qDifficulty')?.value||'normal',skill:document.getElementById('qSkill')?.value||'home',rewardCoins:Math.max(0,Number(document.getElementById('qCoins')?.value||0)),rewardXp:Math.max(0,Number(document.getElementById('qXp')?.value||0)),stage:document.getElementById('qStage')?.value||'Базовий',prerequisiteId:document.getElementById('qPrerequisite')?.value||''};}
  function saveEditedQuest(id){const q=state.quests.find(x=>x.id===id),v=readQuestEditor();if(!q||!v.title)return showToast('Вкажіть назву');Object.assign(q,v,{participants:v.type==='personal'||v.type==='limited'?1:2});save();document.querySelector('.modal-backdrop')?.remove();render();showToast('Квест оновлено');}
  function saveQuestTemplate(key){const v=readQuestEditor();if(!v.title)return showToast('Вкажіть назву');state.questTemplateSettings[key]={...questTemplateState(key),...v};state.meta.dailyQuestDay='';save();document.querySelector('.modal-backdrop')?.remove();render();showToast('Шаблон оновлено');}
  function resetQuestTemplate(key){delete state.questTemplateSettings[key];state.meta.dailyQuestDay='';save();document.querySelector('.modal-backdrop')?.remove();render();showToast('Стандартні значення відновлено');}
  function readShopEditor(){return {title:(document.getElementById('sTitle')?.value||'').trim(),icon:(document.getElementById('sIcon')?.value||'✨').trim()||'✨',description:(document.getElementById('sDesc')?.value||'').trim(),type:document.getElementById('sType')?.value||'personal',price:Math.max(0,Number(document.getElementById('sPrice')?.value||0)),stock:Math.max(0,Number(document.getElementById('sStock')?.value||0)),durationDays:Math.max(1,Math.min(30,Number(document.getElementById('sDurationDays')?.value||7))),resourceUrl:cleanResourceUrl(document.getElementById('sResourceUrl')?.value||'')||''};}
  function saveEditedShop(id){const i=state.shop.find(x=>x.id===id),v=readShopEditor();if(!i||!v.title)return showToast('Вкажіть назву');Object.assign(i,v);save();document.querySelector('.modal-backdrop')?.remove();render();showToast('Товар оновлено');}
  function handleQuest(id){
    const q=state.quests.find(x=>x.id===id),u=currentUser(); if(!q)return;
    if(!q.claimedBy.includes(u.id)){if(q.claimedBy.length>=q.participants)return; q.claimedBy.push(u.id);showToast('Квест додано до ваших справ');}
    else{
      q.claimedBy=q.claimedBy.filter(x=>x!==u.id);u.coins+=q.rewardCoins;const levelResult=addXp(u,q.rewardXp,`квест «${q.title}»`);u.skills[q.skill]+=1;u.activity.unshift(`Виконано: ${q.title}`);u.stats=u.stats||{};u.stats.questsCompleted=(u.stats.questsCompleted||0)+1;const achievementCategory=String(q.category||q.skill||'discipline');u.stats[`${achievementCategory}QuestsCompleted`]=(u.stats[`${achievementCategory}QuestsCompleted`]||0)+1;if(String(q.rarity||'').toLowerCase().includes('legend'))u.stats.legendaryQuestsCompleted=(u.stats.legendaryQuestsCompleted||0)+1;u.stats.coinsEarned=(u.stats.coinsEarned||0)+Number(q.rewardCoins||0);evaluateAchievements(u);state.family.xp+=q.rewardXp;state.family.coins+=Math.round(q.rewardCoins*.2);state.history.unshift({eventId:crypto.randomUUID(),familyId:String(state.family?.id||state.family?.code||''),userId:u.id,icon:q.icon,text:`${u.name} виконав(ла) «${q.title}»`,time:'Щойно'});if(q.type==='personal'||q.type==='limited')q.status='done';showToast(`+${q.rewardCoins} монет · +${q.rewardXp} XP${levelResult.levels?` · LEVEL UP ×${levelResult.levels}`:''}`);playCozySound('quest','important');cozyHaptic('medium');
    }save();render();
  }

  function handleShop(id){
    const item=state.shop.find(x=>x.id===id),u=currentUser();if(!item||item.stock<=0)return;
    if(item.type==='collective'){
      const contribution=Math.min(u.coins,Math.max(100,Math.ceil((item.price-item.fund)/4)));if(!contribution)return showToast('Недостатньо монет');u.coins-=contribution;item.fund+=contribution;if(item.fund>=item.price){item.stock-=1;item.fund=item.price;state.history.unshift({icon:item.icon,text:`Сімʼя зібрала на «${item.title}»`,time:'Щойно'});showToast('Спільну ціль досягнуто!');}else showToast(`Внесено ${contribution} монет`);
    }else{if(u.coins<item.price)return showToast('Недостатньо монет');u.coins-=item.price;item.stock-=1;const days=Math.max(1,Math.min(30,Number(item.durationDays||7))),now=Date.now();u.activeFeatures=Array.isArray(u.activeFeatures)?u.activeFeatures:[];u.activeFeatures.push({id:`feature_${now}_${Math.random().toString(36).slice(2,7)}`,sourceItemId:item.id,title:item.title,description:item.description||'',icon:item.icon||'✨',ownerId:u.id,startedAt:now,expiresAt:now+days*86400000,durationDays:days});state.history.unshift({eventId:crypto.randomUUID(),familyId:String(state.family?.id||state.family?.code||''),userId:u.id,icon:item.icon,text:`${u.name} придбав(ла) «${item.title}»`,time:'Щойно'});showToast(`Можливість активна ${days} дн.`);playCozySound('purchase','important');cozyHaptic('medium');}
    u.stats=u.stats||{};u.stats.purchasesCompleted=(u.stats.purchasesCompleted||0)+1;evaluateAchievements(u);save();render();
  }

  function toggleAdminFamilyVisibility(userId){
    if(!isAdmin())return showToast('Недостатньо прав');
    const u=state.users.find(x=>x.id===userId);if(!u||!['admin','owner'].includes(u.role))return;
    u.hiddenFromFamily=!u.hiddenFromFamily;save();render();showToast(u.hiddenFromFamily?'Адміна сховано зі сторінки сімʼї':'Адміна знову видно в сімʼї');
  }

  function saveQuest(){
    const title=document.getElementById('qTitle').value.trim();if(!title)return showToast('Вкажіть назву');const type=document.getElementById('qType').value;state.quests.unshift({id:crypto.randomUUID(),title,icon:{home:'🧹',care:'🎁',health:'🏋️',growth:'📚',finance:'💰'}[document.getElementById('qSkill').value],description:document.getElementById('qDesc').value.trim()||'Сімейне завдання',type,participants:type==='pair'||type==='coop'?2:1,claimedBy:[],rewardCoins:Number(document.getElementById('qCoins').value)||50,rewardXp:Number(document.getElementById('qXp').value)||50,skill:document.getElementById('qSkill').value,skillXp:15,difficulty:document.getElementById('qDifficulty')?.value||'normal',source:'admin',status:'active',limited:type==='limited',stock:type==='limited'?1:null});save();document.querySelector('.modal-backdrop').remove();render();showToast('Квест створено');
  }
  function saveShop(){
    const title=document.getElementById('sTitle').value.trim();if(!title)return showToast('Вкажіть назву');const rawUrl=document.getElementById('sResourceUrl')?.value||'',resourceUrl=cleanResourceUrl(rawUrl);if(rawUrl.trim()&&!resourceUrl)return showToast('Посилання має починатися з http:// або https://');state.shop.unshift({id:crypto.randomUUID(),title,icon:(document.getElementById('sIcon')?.value||'✨').trim()||'✨',description:document.getElementById('sDesc').value.trim()||'Нова реальна можливість',price:Number(document.getElementById('sPrice').value)||1000,stock:Number(document.getElementById('sStock').value)||1,durationDays:Math.max(1,Math.min(30,Number(document.getElementById('sDurationDays')?.value||7))),type:document.getElementById('sType').value,fund:0,resourceUrl,source:'admin'});save();document.querySelector('.modal-backdrop').remove();render();showToast('Можливість додано');
  }


  function addImportantDate(){const u=currentUser(),day=Number(document.getElementById('importantDateDay')?.value),month=Number(document.getElementById('importantDateMonth')?.value),title=(document.getElementById('importantDateTitle')?.value||'').trim().slice(0,48);if(!u||!title||day<1||day>31||month<1||month>12)return showToast('Вкажіть правильну дату та назву');const check=new Date(2024,month-1,day);if(check.getMonth()!==month-1||check.getDate()!==day)return showToast('Такої дати не існує');u.importantDates=u.importantDates||[];if(u.importantDates.length>=20)return showToast('Можна додати до 20 важливих дат');u.importantDates.push({id:crypto.randomUUID(),day,month,title,visible:true});save();document.querySelector('.modal-backdrop')?.remove();document.body.insertAdjacentHTML('beforeend',modal('important-dates'));bindModal();showToast('Дату додано');}
  function deleteImportantDate(id){const u=currentUser();if(!u)return;u.importantDates=(u.importantDates||[]).filter(x=>x.id!==id);save();document.querySelector('.modal-backdrop')?.remove();document.body.insertAdjacentHTML('beforeend',modal('important-dates'));bindModal();showToast('Дату видалено');}

  function saveProfileSettings(){const u=currentUser();if(!u)return;u.equipped.badge=document.getElementById('profileBadge')?.value||null;u.equipped.frame=document.getElementById('profileFrame')?.value||null;u.equipped.animatedFrame=document.getElementById('profileAnimatedFrame')?.value||null;u.equipped.nicknameEffect=document.getElementById('profileNicknameEffect')?.value||null;u.equipped.profileEffect=document.getElementById('profileEffect')?.value||null;u.equipped.theme=document.getElementById('profileTheme')?.value||'light';u.audioPrefs={mode:document.getElementById('profileSoundMode')?.value||'minimal',haptics:(document.getElementById('profileHaptics')?.value||'on')==='on'};playCozySound('equip','important');save();document.querySelector('.modal-backdrop')?.remove();render();showToast('Оформлення збережено');}

  function handleCosmetic(id){const u=currentUser(),i=cosmetic(id);if(!i)return;let purchased=false;if(!u.inventory.includes(id)){if(u.coins<i.price)return showToast('Потрібно ще монеток');u.coins-=i.price;u.inventory.push(id);purchased=true;u.stats=u.stats||{};u.stats.purchasesCompleted=(u.stats.purchasesCompleted||0)+1;showToast('Додано до колекції');}if(i.kind==='badge')u.equipped.badge=id;if(i.kind==='frame')u.equipped.frame=id;if(i.kind==='animatedFrame')u.equipped.animatedFrame=id;if(i.kind==='nicknameEffect')u.equipped.nicknameEffect=id;if(i.kind==='profileEffect')u.equipped.profileEffect=id;if(i.kind==='theme')u.equipped.theme=i.asset;if(i.kind==='stickerPack'){const map={'cozy-cats':'cozy-cats','bunny-notes':'bunny-love'};const c=state.stickerCollections.find(x=>x.id===map[i.asset]);if(c)c.stickers.slice(0,5).forEach(st=>u.stickerInventory[st.id]=(u.stickerInventory[st.id]||0)+1);showToast('Стікерпак відкрито та додано в інвентар');}if(purchased){playCozySound('purchase','important');cozyHaptic('medium');}else playCozySound('equip','full');evaluateAchievements(u);save();render();}
  function claimLevelRewards(){const u=currentUser();const ready=state.levelRewards.filter(r=>u.level>=r.level&&!u.claimedLevelRewards.includes(r.level));if(!ready.length)return showToast('Нових подарунків поки немає');let coins=0;for(const r of ready){coins+=r.coins;u.claimedLevelRewards.push(r.level);if(r.item&&!u.inventory.includes(r.item))u.inventory.push(r.item);}u.coins+=coins;save();render();showToast(`Подарунки відкрито · +${coins} монеток`);}
  function openStickerModal(userId){document.body.insertAdjacentHTML('beforeend',modal(`sticker:${userId}`));bindModal();}
  function sendSticker(to,icon){const u=currentUser();if(u.coins<50)return showToast('Для теплого сліду потрібно 50 монет');if(stickerCount(u,icon)<1)return showToast('Цього стікера немає у вашій колекції');state.profileStickers=state.profileStickers.filter(x=>x.to!==to||Date.now()-x.createdAt<7*86400000);if(state.profileStickers.filter(x=>x.to===to).length>=10)return showToast('На профілі вже 10 стікерів');u.coins-=50;const note=(document.getElementById('stickerNote')?.value||'').trim().slice(0,120);state.profileStickers.push({id:crypto.randomUUID(),from:u.id,to,icon,note,createdAt:Date.now()});u.stats.stickersGiven=(u.stats.stickersGiven||0)+1;save();document.querySelector('.modal-backdrop')?.remove();render();showToast('Теплий слід залишено · −50 монет');}
  function weightedSticker(stickers){const pool=[];for(const s of stickers){const w=s.rarity==='epic'?8:s.rarity==='rare'?25:67;for(let i=0;i<w;i++)pool.push(s);}return pool[Math.floor(Math.random()*pool.length)];}
  function openStickerBox(id){playCozySound('box-open','important');cozyHaptic('medium');const u=currentUser(),box=state.stickerBoxes.find(x=>x.id===id);if(!box)return;const c=state.stickerCollections.find(x=>x.id===box.collectionId),season=seasonInfo(c.season);if(!season.active)return showToast(`Цей бокс доступний лише: ${season.label}`);if(u.coins<box.price)return showToast('Недостатньо монет');u.coins-=box.price;const sticker=weightedSticker(c.stickers),before=stickerCount(u,sticker.id),isNew=before===0;u.stickerInventory[sticker.id]=before+1;u.stats.boxesOpened=(u.stats.boxesOpened||0)+1;let dust=0;if(!isNew){dust=10;u.stickerDust+=dust;}else{const stickerXp={common:3,uncommon:5,rare:10,epic:20,legendary:50,mythic:100}[sticker.rarity]||3;addXp(u,stickerXp,`новий стікер «${sticker.name}»`);checkCollectionMilestones(u,c);}save();render();showStickerReveal(sticker,c,isNew,dust);}
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
    button.disabled=true;button.textContent='Колесо крутиться…';playCozySound('roulette','important');cozyHaptic('light');
    try{
      const result=await api('/api/family/daily-gift-claim',{method:'POST',body:'{}'});
      const reward=Number(result.reward||5);
      const ru=currentUser();ru.stats=ru.stats||{};ru.stats.giftsOpened=(ru.stats.giftsOpened||0)+1;if(reward===500)ru.stats.jackpots=(ru.stats.jackpots||0)+1;
      const target=360*6+(360-rewardAngle(reward));
      wheel.style.transform=`rotate(${target}deg)`;
      await new Promise(resolve=>setTimeout(resolve,4300));
      if(result.state){state=result.state;normalizeState();observeRewardChanges();safeJsonWrite(STORAGE,state);persistAccount();}
      const title=document.getElementById('rouletteTitle');
      const text=document.getElementById('rouletteText');
      if(title)title.textContent=reward>=100?'Джекпот! ✨':reward===50?'Сьогодні особливо щастить!':'Твій ранковий подарунок';
      if(text)text.innerHTML=`<strong>+${reward} монеток 🪙</strong><br>Нехай день почнеться приємно.`;
      playCozySound('gift','important');cozyHaptic(reward>=100?'strong':'medium');button.textContent='Забрати подарунок';button.disabled=false;
      button.onclick=()=>{document.querySelector('.daily-gift-backdrop')?.remove();render();};
    }catch(e){button.disabled=false;button.textContent='Спробувати ще раз';showToast(e.message);}
  }

  function updateSplash(percent,text){
    const value=Math.max(0,Math.min(100,Number(percent)||0));
    const bar=document.getElementById('splashProgressBar');
    const label=document.getElementById('splashProgressText');
    const status=document.getElementById('splashStatus');
    if(bar)bar.style.width=`${value}%`;
    if(label)label.textContent=`${value}%`;
    if(status&&text)status.textContent=text;
  }
  function hideSplash(){document.getElementById('appSplash')?.classList.add('hidden');}

  // Offline preparation is intentionally background-only. It may update the
  // splash progress while the splash is visible, but it can never block UI.
  async function prepareOfflineApp(){
    if(navigator.storage?.persist)navigator.storage.persist().catch(()=>{});
    if(!('serviceWorker' in navigator))return false;
    try{
      const registration=await navigator.serviceWorker.register('/sw.js?v=9.1.1-responsive-hotfix',{updateViaCache:'none'});
      registration.update().catch(()=>{});
      await Promise.race([
        navigator.serviceWorker.ready,
        new Promise(resolve=>setTimeout(resolve,3500))
      ]);
      const worker=registration.active||registration.waiting||registration.installing;
      if(!worker)return false;
      let settled=false;
      const onMessage=event=>{
        const data=event.data||{};
        if(data.type==='OFFLINE_STATUS'){
          if(!data.ready)worker.postMessage({type:'PRELOAD_ALL'});
        }
        if(data.type==='OFFLINE_PRELOAD_PROGRESS'){
          updateSplash(Math.max(45,data.percent),`Зберігаємо для офлайн · ${data.completed}/${data.total}`);
        }
        if(data.type==='OFFLINE_PRELOAD_COMPLETE'){
          settled=true;
          navigator.serviceWorker.removeEventListener('message',onMessage);
        }
      };
      navigator.serviceWorker.addEventListener('message',onMessage);
      worker.postMessage({type:'GET_OFFLINE_STATUS'});
      setTimeout(()=>{if(!settled)navigator.serviceWorker.removeEventListener('message',onMessage);},120000);
      return true;
    }catch(e){
      console.warn('Offline preparation:',e);
      return false;
    }
  }

  function showBootError(error){
    console.error(error);
    const target=document.getElementById('app');
    if(target&&!target.innerHTML.trim()){
      target.innerHTML=`<main style="padding:24px;font-family:system-ui"><h2>Не вдалося запустити myHabbit</h2><pre style="white-space:pre-wrap">${escapeHtml(error?.stack||error?.message||String(error))}</pre></main>`;
    }
    hideSplash();
  }

  window.addEventListener('error',event=>showBootError(event.error||event.message));
  window.addEventListener('unhandledrejection',event=>showBootError(event.reason));
  window.addEventListener('popstate',()=>{route=new URLSearchParams(location.search).get('screen')||(auth?'dashboard':'landing');render();});
  window.addEventListener('pagehide',()=>queueDailySnapshot());

  function initializeViewportAndOrientation(){
    const rootStyle=document.documentElement.style;
    const viewport=window.visualViewport;
    let keyboardOpen=false;

    const updateViewport=()=>{
      const height=Math.max(320,Math.round(viewport?.height||window.innerHeight));
      const width=Math.max(280,Math.round(viewport?.width||window.innerWidth));
      rootStyle.setProperty('--app-viewport-height',`${height}px`);
      rootStyle.setProperty('--app-viewport-width',`${width}px`);
      const reducedBy=Math.max(0,window.innerHeight-height);
      keyboardOpen=reducedBy>120;
      document.documentElement.classList.toggle('keyboard-open',keyboardOpen);
    };

    const keepFocusedFieldVisible=event=>{
      const target=event.target;
      if(!target?.matches?.('input, textarea, select, [contenteditable="true"]'))return;
      window.setTimeout(()=>target.scrollIntoView({block:'center',inline:'nearest',behavior:'smooth'}),180);
    };

    updateViewport();
    viewport?.addEventListener('resize',updateViewport,{passive:true});
    viewport?.addEventListener('scroll',updateViewport,{passive:true});
    window.addEventListener('resize',updateViewport,{passive:true});
    document.addEventListener('focusin',keepFocusedFieldVisible);

    const standalone=window.matchMedia?.('(display-mode: standalone)')?.matches||window.navigator.standalone===true;
    const lockPortrait=()=>{
      if(!standalone||!screen.orientation?.lock)return;
      screen.orientation.lock('portrait-primary').catch(()=>{});
    };
    lockPortrait();
    document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')lockPortrait();});
  }

  function startOwnerPresenceHeartbeat(){
    if(!auth?.token)return;
    let presenceId=localStorage.getItem('myhabbit_presence_device');
    if(!presenceId){presenceId=(crypto.randomUUID?crypto.randomUUID():String(Date.now())+'-'+Math.random().toString(16).slice(2));localStorage.setItem('myhabbit_presence_device',presenceId);}
    const deviceName=[navigator.platform||'',/Mobile|Android|iPhone|iPad/i.test(navigator.userAgent)?'Mobile':'Desktop'].filter(Boolean).join(' · ').slice(0,64);
    const ping=()=>{if(document.visibilityState==='visible')fetch('/api/presence',{method:'POST',headers:{authorization:`Bearer ${auth.token}`,'x-myhabbit-presence-id':presenceId,'x-myhabbit-device-name':encodeURIComponent(deviceName)},keepalive:true,cache:'no-store'}).then(r=>{if(!r.ok)console.warn('Presence rejected',r.status)}).catch(e=>console.warn('Presence failed',e));};
    ping();
    setInterval(ping,60000);
    document.addEventListener('visibilitychange',ping);
    window.addEventListener('focus',ping);
  }

  (async()=>{
    try{
      updateSplash(10,'Запускаємо myHabbit…');
      initializeViewportAndOrientation();

      // First paint uses local state only and happens before network, Telegram,
      // IndexedDB, content downloads, or Service Worker preparation.
      render();
      window.__MYHABBIT_APP_READY__ = true;
      window.dispatchEvent(new CustomEvent('myhabbit:ready'));
      initializeRewardFeedback();
      updateSplash(42,'Готуємо ваш простір…');

      // Decorative loading sequence: it keeps the pleasant splash visible,
      // but never waits for network, Telegram, IndexedDB or full offline cache.
      setTimeout(()=>updateSplash(68,'Завантажуємо локальні дані…'),260);
      setTimeout(()=>updateSplash(86,'Майже готово…'),620);
      setTimeout(()=>updateSplash(100,'Готово ✨'),980);
      setTimeout(hideSplash,1250);
      setTimeout(showPwaInstallGuide,1450);

      // Everything else is progressive enhancement in the background.
      prepareOfflineApp().catch(()=>{});

      if(isTelegramWebApp&&!auth&&!inviteToken){
        try{await resumeTelegramSession();render();}catch(e){console.warn('Telegram session:',e);}
      }
      if(inviteToken&&!auth){
        try{await loadInviteInfo();render();}catch(e){console.warn('Invite:',e);}
      }
      try{await loadContentLibrary();render();}catch(e){console.warn('Content library:',e);}
      try{const m=await fetch('/api/app-meta',{cache:'no-store'}).then(r=>r.ok?r.json():Promise.reject());if(m?.updateName){publicUpdateName=m.updateName;document.querySelectorAll('.release-label').forEach(x=>x.textContent=publicUpdateName);}ownerSeasonalStickerTesting=Boolean(m?.seasonalStickerTesting);const revision=Number(m?.cacheRevision||1),seen=Number(localStorage.getItem('myHabbitCacheRevisionV1')||0);if(!seen){localStorage.setItem('myHabbitCacheRevisionV1',String(revision));}else if(revision>seen){localStorage.setItem('myHabbitCacheRevisionV1',String(revision));try{const regs=await navigator.serviceWorker?.getRegistrations?.();await Promise.all((regs||[]).map(async r=>{try{await r.update()}catch{};r.waiting?.postMessage({type:'SKIP_WAITING'});}));}catch{}try{const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith('myhabbit-')).map(k=>caches.delete(k)));}catch{}location.reload();return;}}catch(e){console.warn('App meta:',e);}
      if(auth?.token){
        startLiveFamilyRefresh();
        startOwnerPresenceHeartbeat();
        try{await runDailyServerSync();render();}catch(e){console.warn('Daily sync:',e);}
        setTimeout(checkDailyRoulette,350);
      }
    }catch(error){
      showBootError(error);
    }
  })();
})();
