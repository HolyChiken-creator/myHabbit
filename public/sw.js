const CACHE = 'myhabbit-stage9-offline-v4-immediate-render';
const META_CACHE = 'myhabbit-stage9-meta-v4-immediate-render';
const CORE = ['/', '/index.html', '/styles.css?v=60s93', '/app.js?v=60s93', '/manifest.webmanifest', '/assets/myhabbit-brand.webp'];
const OFFLINE_ASSETS = ["/app.js", "/assets/achievement-icons/cinema-cinema-legend.webp", "/assets/achievement-icons/cinema-cinemaniac.webp", "/assets/achievement-icons/cinema-critic.webp", "/assets/achievement-icons/cinema-first-film.webp", "/assets/achievement-icons/cinema-genre-expert.webp", "/assets/achievement-icons/cinema-movie-night.webp", "/assets/achievement-icons/cinema-screen-master.webp", "/assets/achievement-icons/cinema-series-lover.webp", "/assets/achievement-icons/collections1-all-legendary.webp", "/assets/achievement-icons/collections1-collector.webp", "/assets/achievement-icons/collections1-first-page.webp", "/assets/achievement-icons/collections1-first-sticker.webp", "/assets/achievement-icons/collections1-full-album.webp", "/assets/achievement-icons/collections1-half-album.webp", "/assets/achievement-icons/collections1-legend-seeker.webp", "/assets/achievement-icons/collections2-absolute-collector.webp", "/assets/achievement-icons/collections2-christmas-miracle.webp", "/assets/achievement-icons/collections2-easter-hero.webp", "/assets/achievement-icons/collections2-first-seasonal.webp", "/assets/achievement-icons/collections2-halloween-hunter.webp", "/assets/achievement-icons/cosmetics-beauty.webp", "/assets/achievement-icons/cosmetics-first-frame.webp", "/assets/achievement-icons/cosmetics-living-legend.webp", "/assets/achievement-icons/cosmetics-new-effect.webp", "/assets/achievement-icons/cosmetics-shining-profile.webp", "/assets/achievement-icons/cosmetics-style-master.webp", "/assets/achievement-icons/cosmetics-stylish.webp", "/assets/achievement-icons/cosmetics-unique-style.webp", "/assets/achievement-icons/family-caring.webp", "/assets/achievement-icons/family-family-heart.webp", "/assets/achievement-icons/family-family-support.webp", "/assets/achievement-icons/family-fortress.webp", "/assets/achievement-icons/family-new-member.webp", "/assets/achievement-icons/family-reliable-shoulder.webp", "/assets/achievement-icons/family-stronger-together.webp", "/assets/achievement-icons/gifts-benefactor.webp", "/assets/achievement-icons/gifts-company-soul.webp", "/assets/achievement-icons/gifts-first-gift.webp", "/assets/achievement-icons/gifts-generous-heart.webp", "/assets/achievement-icons/gifts-giver.webp", "/assets/achievement-icons/gifts-good-friend.webp", "/assets/achievement-icons/gifts-surprise-master.webp", "/assets/achievement-icons/home-clean-start.webp", "/assets/achievement-icons/home-cleanliness-king.webp", "/assets/achievement-icons/home-everything-shines.webp", "/assets/achievement-icons/home-home-owner.webp", "/assets/achievement-icons/home-order-master.webp", "/assets/achievement-icons/home-perfect-order.webp", "/assets/achievement-icons/home-tidy-corner.webp", "/assets/achievement-icons/levels-absolute-master.webp", "/assets/achievement-icons/levels-adventurer.webp", "/assets/achievement-icons/levels-champion.webp", "/assets/achievement-icons/levels-expert.webp", "/assets/achievement-icons/levels-explorer.webp", "/assets/achievement-icons/levels-fighter.webp", "/assets/achievement-icons/levels-hero.webp", "/assets/achievement-icons/levels-immortal.webp", "/assets/achievement-icons/levels-legend.webp", "/assets/achievement-icons/levels-master.webp", "/assets/achievement-icons/levels-myth.webp", "/assets/achievement-icons/levels-newbie.webp", "/assets/achievement-icons/levels-seeker.webp", "/assets/achievement-icons/levels-student.webp", "/assets/achievement-icons/levels-veteran.webp", "/assets/achievement-icons/manifest.json", "/assets/achievement-icons/mind-aspiration.webp", "/assets/achievement-icons/mind-genius.webp", "/assets/achievement-icons/mind-life-architect.webp", "/assets/achievement-icons/mind-new-horizons.webp", "/assets/achievement-icons/mind-step-forward.webp", "/assets/achievement-icons/mind-strategist.webp", "/assets/achievement-icons/mind-thinker.webp", "/assets/achievement-icons/mythic-absolute.webp", "/assets/achievement-icons/mythic-architect-of-fate.webp", "/assets/achievement-icons/mythic-heart-myhabbit.webp", "/assets/achievement-icons/mythic-infinity.webp", "/assets/achievement-icons/mythic-time-keeper.webp", "/assets/achievement-icons/quests-adventure-seeker.webp", "/assets/achievement-icons/quests-conqueror.webp", "/assets/achievement-icons/quests-first-mission.webp", "/assets/achievement-icons/quests-goal-driven.webp", "/assets/achievement-icons/quests-great-hero.webp", "/assets/achievement-icons/quests-invincible.webp", "/assets/achievement-icons/quests-performer.webp", "/assets/achievement-icons/quests-quest-master.webp", "/assets/achievement-icons/reading-archivist.webp", "/assets/achievement-icons/reading-avid-reader.webp", "/assets/achievement-icons/reading-bibliophile.webp", "/assets/achievement-icons/reading-book-lover.webp", "/assets/achievement-icons/reading-first-book.webp", "/assets/achievement-icons/reading-living-library.webp", "/assets/achievement-icons/reading-reader.webp", "/assets/achievement-icons/reading-sage.webp", "/assets/achievement-icons/referrals-better-together.webp", "/assets/achievement-icons/referrals-big-family.webp", "/assets/achievement-icons/referrals-community-leader.webp", "/assets/achievement-icons/referrals-family-grows.webp", "/assets/achievement-icons/referrals-first-friend.webp", "/assets/achievement-icons/referrals-home-for-all.webp", "/assets/achievement-icons/referrals-mentor.webp", "/assets/achievement-icons/referrals-people-connector.webp", "/assets/achievement-icons/relationship-better-together.webp", "/assets/achievement-icons/relationship-care.webp", "/assets/achievement-icons/relationship-couple-heart.webp", "/assets/achievement-icons/relationship-first-date.webp", "/assets/achievement-icons/relationship-happy-family.webp", "/assets/achievement-icons/relationship-love-without-limits.webp", "/assets/achievement-icons/relationship-reliable-partner.webp", "/assets/achievement-icons/relationship-romantic.webp", "/assets/achievement-icons/secret-secret-01.webp", "/assets/achievement-icons/secret-secret-02.webp", "/assets/achievement-icons/secret-secret-03.webp", "/assets/achievement-icons/secret-secret-04.webp", "/assets/achievement-icons/secret-secret-05.webp", "/assets/achievement-icons/secret-secret-06.webp", "/assets/achievement-icons/secret-secret-07.webp", "/assets/achievement-icons/secret-secret-08.webp", "/assets/achievement-icons/secret-secret-09.webp", "/assets/achievement-icons/secret-secret-10.webp", "/assets/achievement-icons/secret-secret-11.webp", "/assets/achievement-icons/shop-all-mine.webp", "/assets/achievement-icons/shop-beauty-lover.webp", "/assets/achievement-icons/shop-first-purchase.webp", "/assets/achievement-icons/shop-new-look.webp", "/assets/achievement-icons/shop-style-collector.webp", "/assets/achievement-icons/shop-style-icon.webp", "/assets/achievement-icons/shop-wardrobe-grows.webp", "/assets/achievement-icons/special-early-user.webp", "/assets/achievement-icons/special-founder.webp", "/assets/achievement-icons/special-holiday-guest.webp", "/assets/achievement-icons/special-myhabbit-veteran.webp", "/assets/achievement-icons/special-one-year.webp", "/assets/achievement-icons/special-season-winner.webp", "/assets/achievement-icons/special-three-years.webp", "/assets/achievement-icons/special-two-years.webp", "/assets/achievement-icons/sport-active-day.webp", "/assets/achievement-icons/sport-athlete.webp", "/assets/achievement-icons/sport-first-move.webp", "/assets/achievement-icons/sport-iron-body.webp", "/assets/achievement-icons/sport-sport-lover.webp", "/assets/achievement-icons/sport-strong-spirit.webp", "/assets/achievement-icons/sport-warmup.webp", "/assets/achievement-icons/start-dont-give-up.webp", "/assets/achievement-icons/start-first-step.webp", "/assets/achievement-icons/start-hero-born.webp", "/assets/achievement-icons/start-new-life.webp", "/assets/achievement-icons/start-story-begins.webp", "/assets/achievement-icons/start-welcome.webp", "/assets/achievement-icons/start-you-are-here.webp", "/assets/achievement-icons/streak-100-days.webp", "/assets/achievement-icons/streak-14-days.webp", "/assets/achievement-icons/streak-150-days.webp", "/assets/achievement-icons/streak-200-days.webp", "/assets/achievement-icons/streak-21-days.webp", "/assets/achievement-icons/streak-250-days.webp", "/assets/achievement-icons/streak-3-days.webp", "/assets/achievement-icons/streak-30-days.webp", "/assets/achievement-icons/streak-300-days.webp", "/assets/achievement-icons/streak-365-days.webp", "/assets/achievement-icons/streak-50-days.webp", "/assets/achievement-icons/streak-500-days.webp", "/assets/achievement-icons/streak-7-days.webp", "/assets/achievement-icons/streak-75-days.webp", "/assets/achievement-icons/streak-unbreakable.webp", "/assets/achievement-icons/wheel-big-win.webp", "/assets/achievement-icons/wheel-born-lucky.webp", "/assets/achievement-icons/wheel-first-spin.webp", "/assets/achievement-icons/wheel-fortunate.webp", "/assets/achievement-icons/wheel-fortune-favorite.webp", "/assets/achievement-icons/wheel-jackpot.webp", "/assets/achievement-icons/wheel-luck-master.webp", "/assets/achievement-icons/wheel-lucky.webp", "/assets/myhabbit-brand.webp", "/assets/splash-1170x2532.png", "/assets/splash-1242x2688.png", "/assets/splash-1290x2796.png", "/assets/splash-828x1792.png", "/assets/welcome-character.webp", "/content/README.md", "/content/achievements/cinema.json", "/content/achievements/coins.json", "/content/achievements/creativity.json", "/content/achievements/discipline.json", "/content/achievements/family.json", "/content/achievements/finance.json", "/content/achievements/general.json", "/content/achievements/health.json", "/content/achievements/home.json", "/content/achievements/legendary.json", "/content/achievements/levels.json", "/content/achievements/mind.json", "/content/achievements/reading.json", "/content/achievements/relationship.json", "/content/achievements/secret.json", "/content/achievements/shop.json", "/content/achievements/sport.json", "/content/achievements/streak.json", "/content/challenges/all.json", "/content/daily/discipline.json", "/content/daily/health.json", "/content/daily/home.json", "/content/daily/reading.json", "/content/daily/relationship.json", "/content/daily/sport.json", "/content/index.json", "/content/quest.schema.json", "/content/quests/cinema.json", "/content/quests/creativity.json", "/content/quests/discipline.json", "/content/quests/family.json", "/content/quests/finance.json", "/content/quests/health.json", "/content/quests/home.json", "/content/quests/mind.json", "/content/quests/reading.json", "/content/quests/relationship.json", "/content/quests/sport.json", "/content/shop/catalog.json", "/content/weekly/cinema.json", "/content/weekly/creativity.json", "/content/weekly/family.json", "/content/weekly/finance.json", "/content/weekly/home.json", "/content/weekly/sport.json", "/icons/cozy/bunny.svg", "/icons/cozy/cat.svg", "/icons/cozy/flower.svg", "/icons/cozy/leaf.svg", "/icons/cozy/moon.svg", "/icons/cozy/sparkle.svg", "/icons/cozy/sticker.svg", "/icons/cozy/trophy.svg", "/icons/favicon.ico", "/icons/icon-128.png", "/icons/icon-144.png", "/icons/icon-180.png", "/icons/icon-192.png", "/icons/icon-256.png", "/icons/icon-32.png", "/icons/icon-384.png", "/icons/icon-48.png", "/icons/icon-512.png", "/icons/icon-72.png", "/icons/icon-96.png", "/icons/maskable-512.png", "/index.html", "/manifest.webmanifest", "/robots.txt", "/styles.css"];

async function broadcast(message) {
  const clients = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' });
  clients.forEach(client => client.postMessage(message));
}

async function cacheOfflineAssets() {
  const cache = await caches.open(CACHE);
  let completed = 0;
  const total = OFFLINE_ASSETS.length;
  const batchSize = 12;
  for (let i = 0; i < total; i += batchSize) {
    const batch = OFFLINE_ASSETS.slice(i, i + batchSize);
    await Promise.all(batch.map(async url => {
      try {
        const existing = await cache.match(url, { ignoreSearch: true });
        if (!existing) {
          const response = await fetch(url, { cache: 'reload' });
          if (response.ok) await cache.put(url, response.clone());
        }
      } catch {}
      completed += 1;
    }));
    await broadcast({ type: 'OFFLINE_PRELOAD_PROGRESS', completed, total, percent: Math.round(completed / total * 100) });
  }
  const meta = await caches.open(META_CACHE);
  await meta.put('/offline-ready', new Response(JSON.stringify({ version: CACHE, completedAt: Date.now(), total }), { headers: { 'content-type': 'application/json' } }));
  await broadcast({ type: 'OFFLINE_PRELOAD_COMPLETE', completed: total, total, percent: 100 });
  return { completed: total, total };
}

self.addEventListener('install', event => {
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    await Promise.allSettled(CORE.map(async url=>{
      const response=await fetch(url,{cache:'reload'});
      if(response.ok)await cache.put(url,response.clone());
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('myhabbit-') && ![CACHE, META_CACHE].includes(key)).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  const data = event.data || {};
  if (data.type === 'PRELOAD_ALL') event.waitUntil(cacheOfflineAssets());
  if (data.type === 'GET_OFFLINE_STATUS') {
    event.waitUntil((async () => {
      const meta = await caches.open(META_CACHE);
      const response = await meta.match('/offline-ready');
      const status = response ? await response.json() : null;
      event.source?.postMessage({ type: 'OFFLINE_STATUS', ready: Boolean(status?.version === CACHE), status });
    })());
  }
  if (data.type === 'REFRESH_APP_CACHE') event.waitUntil(cacheOfflineAssets());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.pathname.startsWith('/api/')) return;
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok) (await caches.open(CACHE)).put('/index.html', response.clone());
        return response;
      } catch {
        const cached = await caches.match('/index.html');
        if (cached) return cached;
        return new Response('myHabbit тимчасово недоступний офлайн', { status: 503, headers: { 'content-type': 'text/plain; charset=utf-8' } });
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(request, { ignoreSearch: true });
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response.ok && response.type === 'basic') (await caches.open(CACHE)).put(request, response.clone());
      return response;
    } catch {
      return new Response('', { status: 504 });
    }
  })());
});
