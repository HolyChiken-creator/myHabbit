(function () {
  'use strict';

  var VERSION = '9.8-debug-loader-20260723';
  var statusBox = document.getElementById('debugStatus');
  var splash = document.getElementById('appSplash');
  var app = document.getElementById('app');
  var finished = false;

  function safeText(value) {
    try {
      if (value && value.stack) return String(value.stack);
      if (value && value.message) return String(value.message);
      return String(value);
    } catch (ignore) {
      return 'Невідома помилка';
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function setStatus(title, details, kind) {
    if (!statusBox) return;
    statusBox.style.display = 'block';
    statusBox.style.borderColor = kind === 'error' ? '#d66b6b' : '#d8b89d';
    statusBox.style.background = kind === 'error' ? '#fff0f0' : '#fff8f2';
    statusBox.innerHTML =
      '<strong style="display:block;margin-bottom:8px">' + escapeHtml(title) + '</strong>' +
      '<pre style="white-space:pre-wrap;word-break:break-word;margin:0;font:12px/1.45 ui-monospace,SFMono-Regular,Consolas,monospace">' +
      escapeHtml(details || '') + '</pre>';
  }

  function hideSplash() {
    if (splash) splash.className += ' hidden';
  }

  function showFatal(label, error) {
    if (finished) return;
    finished = true;
    hideSplash();
    var text = safeText(error);
    setStatus(label, text, 'error');
    if (app && (!app.innerHTML || !app.innerHTML.replace(/\s/g, ''))) {
      app.innerHTML = '<main style="padding:24px;font-family:system-ui"><h2>Помилка запуску</h2><p>Скопіюйте або сфотографуйте червоний блок нижче.</p></main>';
    }
  }

  window.onerror = function (message, source, lineno, colno, error) {
    showFatal(
      'WINDOW ERROR',
      safeText(error || message) + '\n\nФайл: ' + (source || 'невідомо') + '\nРядок: ' + (lineno || '?') + ':' + (colno || '?')
    );
    return false;
  };

  window.onunhandledrejection = function (event) {
    showFatal('UNHANDLED PROMISE REJECTION', event && event.reason ? event.reason : 'Promise відхилено без опису');
  };

  setStatus('STEP 1 — debug loader запущено', 'Версія: ' + VERSION + '\nЗавантажую /legacy-app.js окремим запитом…', 'ok');

  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/legacy-app.js?v=' + encodeURIComponent(VERSION), true);
  xhr.timeout = 15000;

  xhr.onreadystatechange = function () {
    if (xhr.readyState !== 4 || finished) return;

    if (xhr.status < 200 || xhr.status >= 300) {
      showFatal('LEGACY FILE НЕ ЗАВАНТАЖИВСЯ', 'HTTP ' + xhr.status + '\n' + (xhr.responseText || 'Порожня відповідь'));
      return;
    }

    setStatus(
      'STEP 2 — legacy-app.js завантажено',
      'HTTP ' + xhr.status + '\nРозмір: ' + xhr.responseText.length + ' символів\nПеревіряю синтаксис і виконую…',
      'ok'
    );

    try {
      var source = String(xhr.responseText || '') + '\n//# sourceURL=/legacy-app.js?v=' + VERSION;
      var runLegacy = new Function(source);
      setStatus('STEP 3 — синтаксис legacy-app.js прийнято', 'Починаю виконання основного застосунку…', 'ok');
      runLegacy.call(window);
      window.setTimeout(function () {
        if (finished) return;
        finished = true;
        hideSplash();
        setStatus('STEP 4 — legacy-app.js виконався без синхронної помилки', 'Якщо інтерфейс не намалювався, сфотографуйте цей екран. Це означає, що запуск завершився, але render() не створив UI.', 'ok');
      }, 1800);
    } catch (error) {
      showFatal('ПОМИЛКА ВСЕРЕДИНІ legacy-app.js', error);
    }
  };

  xhr.onerror = function () {
    showFatal('ПОМИЛКА МЕРЕЖІ', 'Не вдалося отримати /legacy-app.js');
  };

  xhr.ontimeout = function () {
    showFatal('ТАЙМАУТ', '/legacy-app.js не завантажився за 15 секунд');
  };

  xhr.send(null);
}());
