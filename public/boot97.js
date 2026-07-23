(function(){
  'use strict';
  window.__MYHABBIT_97_BOOTED__ = true;

  function byId(id){ return document.getElementById(id); }
  function hideSplash(){ var s=byId('appSplash'); if(s){ s.classList.add('hidden'); s.style.display='none'; } }
  function setDiag(text, kind){ var d=byId('diag97'); if(d){ d.className='diag97 '+(kind||'ok'); d.textContent=text; } }

  try {
    var app=byId('app');
    if(!app){ throw new Error('Не знайдено контейнер #app'); }

    app.innerHTML = ''+
    '<div class="app-layout">'+
      '<main class="main">'+
        '<header class="topbar">'+
          '<button class="menu-trigger" id="menu97" aria-label="Відкрити меню">☰</button>'+
          '<div class="top-title"><h1>Головна</h1><p>UI isolation — без Telegram, API та локальних даних</p></div>'+
          '<div class="top-actions"><span class="coin-pill">🪙 2 640</span></div>'+
        '</header>'+
        '<div class="ui97-note"><strong>Stage 9.7:</strong> зараз працює тільки статичне малювання дизайну. Жодна бізнес-логіка не запускається.</div>'+
        '<section class="grid metrics">'+
          '<div class="card"><div class="metric-label">Моя сходинка</div><div class="metric-value">18</div><div class="progress"><i style="width:68%"></i></div><div class="metric-foot">4 380 / 6 400 XP</div></div>'+
          '<div class="card"><div class="metric-label">Наша спільна сходинка</div><div class="metric-value">12</div><div class="progress"><i style="width:74%"></i></div><div class="metric-foot">7 420 XP</div></div>'+
          '<div class="card"><div class="metric-label">Серія звичок</div><div class="metric-value">12 🔥</div><div class="metric-foot">днів поспіль</div></div>'+
        '</section>'+
        '<div class="section-head"><div><h2>Активні квести</h2><small class="meta">Статичні тестові картки</small></div><span class="tag coop">3 активні</span></div>'+
        '<section class="quest-grid">'+
          '<article class="quest-card"><div class="quest-head"><span class="quest-icon">🧹</span><span class="tag coop">Спільний</span></div><h3>Генеральне прибирання</h3><p>Разом привести квартиру до ладу</p><div class="reward-row"><span>+180 🪙</span><span>+140 XP</span></div><button class="btn primary" data-ui97>Відкрити</button></article>'+
          '<article class="quest-card"><div class="quest-head"><span class="quest-icon">🏋️</span><span class="tag">Особистий</span></div><h3>Тренування після роботи</h3><p>45 хвилин руху або спортзал</p><div class="reward-row"><span>+70 🪙</span><span>+60 XP</span></div><button class="btn primary" data-ui97>Відкрити</button></article>'+
          '<article class="quest-card"><div class="quest-head"><span class="quest-icon">🎁</span><span class="tag limited">Лімітований</span></div><h3>Сюрприз для рідних</h3><p>Зробити щось приємне без нагадування</p><div class="reward-row"><span>+120 🪙</span><span>+90 XP</span></div><button class="btn primary" data-ui97>Відкрити</button></article>'+
        '</section>'+
        '<div class="section-head"><div><h2>Останнє досягнення</h2><small class="meta">Перевірка стилів карток</small></div></div>'+
        '<section class="achievement-grid"><article class="achievement-card unlocked"><div class="achievement-icon">🏆</div><div><span class="rarity">Рідкісна</span><h3>Стабільність</h3><p>7 днів поспіль</p></div></article></section>'+
        '<div class="ui97-actions"><button class="btn primary" id="toast97">Перевірити кнопку</button><button class="btn soft" id="hideDiag97">Сховати статус</button></div>'+
      '</main>'+
      '<div class="menu-backdrop" id="backdrop97"></div>'+
      '<aside class="dropdown-menu" id="drawer97">'+
        '<div class="menu-profile"><div class="member-initial">А</div><div><strong>@myhabbit_admin</strong><small>18 рівень · 2 640 🪙</small></div><button class="close" id="close97">×</button></div>'+
        '<nav class="nav">'+
          '<button class="active"><span class="nav-icon">⌂</span>Головна</button><button><span class="nav-icon">✓</span>Квести</button><button><span class="nav-icon">◈</span>Магазин</button><button><span class="nav-icon">▦</span>Колекції</button><button><span class="nav-icon">🏛️</span>Музей</button><button><span class="nav-icon">🏆</span>Ачивки</button><button><span class="nav-icon">👥</span>Сімʼя</button><button><span class="nav-icon">●</span>Профіль</button>'+
        '</nav>'+
      '</aside>'+
    '</div>';

    hideSplash();
    setDiag('9.7 УСПІХ: styles.css + статичний UI + boot97.js намалювалися.','ok');

    var menu=byId('menu97'), drawer=byId('drawer97'), back=byId('backdrop97'), close=byId('close97');
    function openMenu(){ document.body.classList.add('menu-open'); if(drawer){drawer.classList.add('open');} if(back){back.classList.add('show');} }
    function closeMenu(){ document.body.classList.remove('menu-open'); if(drawer){drawer.classList.remove('open');} if(back){back.classList.remove('show');} }
    if(menu){menu.onclick=openMenu;} if(close){close.onclick=closeMenu;} if(back){back.onclick=closeMenu;}
    var t=byId('toast97'); if(t){t.onclick=function(){var toast=byId('toast'); if(toast){toast.textContent='Кнопки та події працюють';toast.classList.add('show');setTimeout(function(){toast.classList.remove('show');},1800);}};}
    var h=byId('hideDiag97'); if(h){h.onclick=function(){var d=byId('diag97');if(d){d.style.display='none';}};}
  } catch(err) {
    hideSplash();
    setDiag('9.7 ПОМИЛКА: '+(err && err.message ? err.message : String(err)),'error');
    var app=byId('app');
    if(app){app.innerHTML='<div style="padding:24px;font-family:system-ui"><h1>UI 9.7 не намалювався</h1><pre style="white-space:pre-wrap">'+String(err && err.stack ? err.stack : err)+'</pre></div>';}
  }
})();
