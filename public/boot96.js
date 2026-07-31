(function () {
  'use strict';
  window.MYHABBIT_BOOT96_OK = true;

  function setText(id, text) {
    var node = document.getElementById(id);
    if (node) { node.textContent = text; }
  }

  setText('jsState', 'JavaScript працює. Браузер виконав новий файл boot96.js.');
  setText('details', 'index.html: OK\nboot96.js: OK\nService Worker: вимикаємо\nCache Storage: очищуємо');

  try {
    if ('serviceWorker' in navigator && navigator.serviceWorker.getRegistrations) {
      navigator.serviceWorker.getRegistrations().then(function (items) {
        var jobs = [];
        var i;
        for (i = 0; i < items.length; i += 1) { jobs.push(items[i].unregister()); }
        return Promise.all(jobs);
      }).then(function () {
        setText('details', 'index.html: OK\nboot96.js: OK\nService Worker: видалено\nCache Storage: очищуємо');
      }).catch(function () {});
    }
  } catch (e) {}

  try {
    if (window.caches && window.caches.keys) {
      window.caches.keys().then(function (keys) {
        var jobs = [];
        var i;
        for (i = 0; i < keys.length; i += 1) { jobs.push(window.caches.delete(keys[i])); }
        return Promise.all(jobs);
      }).then(function () {
        setText('details', 'index.html: OK\nboot96.js: OK\nService Worker: команда видалення виконана\nCache Storage: очищено\n\nЗакрийте Telegram/браузер повністю та відкрийте сайт ще раз.');
      }).catch(function () {});
    }
  } catch (e2) {}
}());
