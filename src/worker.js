const APP_VERSION = '10.0.1-compact-admin-panels';
const DEFAULT_OWNER_PANEL_SECRET = 'TedyK-Owner-9472!';
const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store'
};

const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), {
  status,
  headers: { ...JSON_HEADERS, ...headers }
});

const number = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const text = (value, max = 500) => String(value ?? '').trim().slice(0, max);
const validTime = (value, fallback) => /^([01]\d|2[0-3]):[0-5]\d$/.test(String(value)) ? String(value) : fallback;
const validTimezone = (value) => {
  const timezone = text(value, 64) || 'Europe/Kyiv';
  try {
    new Intl.DateTimeFormat('en', { timeZone: timezone }).format(new Date());
    return timezone;
  } catch {
    return 'Europe/Kyiv';
  }
};

const escapeHtml = (value) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const randomText = (length = 32) => {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('');
};

const randomCode = () => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return [...bytes].map((byte) => alphabet[byte % alphabet.length]).join('');
};

const sha256 = async (value) => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
};

const hmacSha256 = async (keyBytes, value) => {
  const key = await crypto.subtle.importKey(
    'raw',
    keyBytes instanceof Uint8Array ? keyBytes : new TextEncoder().encode(String(keyBytes)),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  return new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(String(value))));
};

const bytesToHex = (bytes) => [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('');

const timingSafeEqualHex = (left, right) => {
  if (!left || !right || left.length !== right.length) return false;
  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return mismatch === 0;
};

const verifyTelegramInitData = async (initData, botToken) => {
  if (!initData || !botToken) throw Object.assign(new Error('Telegram Mini App не настроен'), { status: 503 });
  const params = new URLSearchParams(String(initData));
  const receivedHash = params.get('hash') || '';
  params.delete('hash');
  const authDate = Number(params.get('auth_date') || 0);
  if (!authDate || Math.abs(Date.now() / 1000 - authDate) > 24 * 60 * 60) {
    throw Object.assign(new Error('Сессия Telegram устарела. Откройте Mini App заново.'), { status: 401 });
  }
  const dataCheckString = [...params.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  const secretKey = await hmacSha256(new TextEncoder().encode('WebAppData'), botToken);
  const expectedHash = bytesToHex(await hmacSha256(secretKey, dataCheckString));
  if (!timingSafeEqualHex(expectedHash, receivedHash)) {
    throw Object.assign(new Error('Не удалось подтвердить Telegram-сессию'), { status: 401 });
  }
  let user;
  try { user = JSON.parse(params.get('user') || 'null'); } catch { user = null; }
  if (!user?.id) throw Object.assign(new Error('Telegram не передал пользователя'), { status: 401 });
  return {
    user,
    startParam: params.get('start_param') || '',
    queryId: params.get('query_id') || ''
  };
};

const validAppUrl = (value) => {
  try {
    const url = new URL(text(value, 300));
    if (url.protocol !== 'https:') return '';
    return url.origin;
  } catch {
    return '';
  }
};


const normalizeDeviceInfo = (input = {}, fallbackKind = 'pwa') => {
  const rawId = text(input.id || input.deviceId, 96).replace(/[^A-Za-z0-9._:-]/g, '');
  const kind = ['pwa', 'telegram-mini-app'].includes(input.kind) ? input.kind : fallbackKind;
  return {
    id: rawId || crypto.randomUUID(),
    name: text(input.name || input.deviceName, 64) || (kind === 'telegram-mini-app' ? 'Telegram Mini App' : 'PWA'),
    kind
  };
};

const deviceInfoFromRequest = (request, fallbackKind = 'pwa') => normalizeDeviceInfo({
  id: request.headers.get('x-myhabbit-device-id') || '',
  name: decodeURIComponent(request.headers.get('x-myhabbit-device-name') || ''),
  kind: request.headers.get('x-myhabbit-device-kind') || fallbackKind
}, fallbackKind);

const normalizedDevices = (user = {}) => (Array.isArray(user.devices) ? user.devices : [])
  .filter((device) => device && device.id && device.tokenHash)
  .map((device) => ({
    id: text(device.id, 96),
    name: text(device.name, 64) || 'PWA',
    kind: device.kind === 'telegram-mini-app' ? 'telegram-mini-app' : 'pwa',
    tokenHash: text(device.tokenHash, 128),
    createdAt: device.createdAt || device.lastSeenAt || new Date().toISOString(),
    lastSeenAt: device.lastSeenAt || device.createdAt || new Date().toISOString()
  }));

const publicDevices = (user = {}) => normalizedDevices(user)
  .filter((device) => device.kind === 'pwa')
  .sort((left, right) => String(right.lastSeenAt).localeCompare(String(left.lastSeenAt)))
  .map((device, index) => ({
    id: device.id,
    name: device.name,
    kind: device.kind,
    number: index + 1,
    createdAt: device.createdAt,
    lastSeenAt: device.lastSeenAt
  }));

const pwaDeviceCount = (user = {}) => publicDevices(user).length;

const sanitizeAppState = (input) => {
  if (!input || typeof input !== 'object') throw Object.assign(new Error('Некорректное состояние приложения'), { status: 400 });
  const cloned = JSON.parse(JSON.stringify(input));
  cloned.telegram = {
    ...(cloned.telegram || {}),
    authToken: '',
    sessionId: '',
    linkCode: '',
    botUsername: '',
    connected: false
  };
  return cloned;
};

const localClock = (date, timezone) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(date).reduce((acc, part) => {
    if (part.type !== 'literal') acc[part.type] = part.value;
    return acc;
  }, {});
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}`
  };
};

const settingsFromPayload = (payload = {}) => {
  const times = payload.times || {};
  const meals = payload.meals || {};
  const gender = payload.gender === 'female' ? 'female' : payload.gender === 'male' ? 'male' : payload.salutation === 'pani' ? 'female' : payload.salutation === 'pan' ? 'male' : '';
  return {
    name: text(payload.name, 60),
    appUrl: validAppUrl(payload.appUrl),
    gender,
    salutation: gender === 'female' ? 'pani' : gender === 'male' ? 'pan' : '',
    timezone: validTimezone(payload.timezone),
    waterGoalMl: Math.min(8000, Math.max(800, Math.round(number(payload.waterGoalMl) || 2000))),
    enabled: payload.enabled !== false,
    times: {
      breakfast: validTime(times.breakfast, '08:00'),
      lunch: validTime(times.lunch, '13:00'),
      dinner: validTime(times.dinner, '19:00'),
      waterMorning: validTime(times.waterMorning, '10:30'),
      waterAfternoon: validTime(times.waterAfternoon, '16:00'),
      mental: validTime(times.mental, '21:00')
    },
    meals: {
      breakfast: text(meals.breakfast, 900),
      lunch: text(meals.lunch, 900),
      dinner: text(meals.dinner, 900)
    }
  };
};

const telegramCall = async (env, method, body) => {
  if (!env.TELEGRAM_BOT_TOKEN) throw new Error('TELEGRAM_BOT_TOKEN is not configured');
  const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || result.ok === false) {
    const error = new Error(result.description || `Telegram API error ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return result.result;
};

const telegramBootstrapCache = new Map();

const telegramWebhookSecret = async (env, origin) => {
  const configured = text(env.TELEGRAM_WEBHOOK_SECRET, 256);
  if (configured) return configured;
  if (!env.TELEGRAM_BOT_TOKEN) return '';
  return (await sha256(`myhabbit:${origin}:${env.TELEGRAM_BOT_TOKEN}`)).slice(0, 64);
};

const bootstrapTelegramBot = async (env, origin, { force = false } = {}) => {
  if (!env.TELEGRAM_BOT_TOKEN) {
    return { ready: false, configured: false, error: 'TELEGRAM_BOT_TOKEN не добавлен в Cloudflare Secrets' };
  }
  const cached = telegramBootstrapCache.get(origin);
  if (!force && cached && cached.expiresAt > Date.now()) return cached.result;

  try {
    const me = await telegramCall(env, 'getMe', {});
    const username = text(me?.username || env.TELEGRAM_BOT_USERNAME, 80).replace(/^@/, '');
    const secret = await telegramWebhookSecret(env, origin);
    const webhookUrl = `${origin}/api/telegram/webhook`;
    await telegramCall(env, 'setWebhook', {
      url: webhookUrl,
      secret_token: secret,
      allowed_updates: ['message'],
      drop_pending_updates: false
    });

    const warnings = [];
    try {
      await telegramCall(env, 'setMyCommands', {
        commands: [
          { command: 'start', description: 'Відкрити головне меню' },
          { command: 'recipes', description: 'Мої збережені рецепти' },
          { command: 'calories', description: 'Калькулятор калорій KusWise' },
          { command: 'routine', description: 'Особистий розпорядок дня' },
          { command: 'note', description: 'Створити разове нагадування' },
          { command: 'health', description: 'Налаштувати рутини здоров’я' },
          { command: 'reminders', description: 'Переглянути всі нагадування' },
          { command: 'version', description: 'Перевірити версію бота' }
        ]
      });
    } catch (error) {
      warnings.push(`commands: ${error.message}`);
    }

    try {
      await telegramCall(env, 'setChatMenuButton', {
        menu_button: { type: 'default' }
      });
    } catch (error) {
      warnings.push(`menu: ${error.message}`);
    }

    const result = {
      ready: true,
      configured: true,
      username,
      webhookUrl,
      version: APP_VERSION,
      warnings
    };
    telegramBootstrapCache.set(origin, { result, expiresAt: Date.now() + 15 * 60 * 1000 });
    return result;
  } catch (error) {
    const result = {
      ready: false,
      configured: true,
      error: error.message || 'Не удалось настроить Telegram webhook',
      version: APP_VERSION
    };
    telegramBootstrapCache.set(origin, { result, expiresAt: Date.now() + 60 * 1000 });
    return result;
  }
};

const greeting = (user) => (user.gender === 'female' || user.salutation === 'pani') ? 'пані' : 'пане';
const daySeed = (date, type) => [...`${date}:${type}`].reduce((sum, char) => sum + char.charCodeAt(0), 0);
const variant = (items, date, type) => items[daySeed(date, type) % items.length];

const messageFor = (user, type, localDate) => {
  const title = greeting(user);
  const meal = user.meals || {};
  const water = Math.round(user.waterGoalMl || 2000);
  const opening = `<b>${variant([
    `Доброго дня, ${title}.`,
    `${title[0].toUpperCase()}${title.slice(1)}, час подбати про себе.`,
    `Нагадування для вас, ${title}.`
  ], localDate, type)}</b>`;

  if (type === 'breakfast') {
    return `🌅 ${opening}\n\n<b>Ранковий раціон:</b>\n${escapeHtml(meal.breakfast || 'Відкрийте myHabbit і перевірте запланований сніданок.')}\n\n💧 Денна ціль води: <b>${water} мл</b>. Почніть день зі склянки води.`;
  }
  if (type === 'lunch') {
    return `☀️ ${opening}\n\n<b>Раціон на обід:</b>\n${escapeHtml(meal.lunch || 'Відкрийте myHabbit і перевірте запланований обід.')}\n\n💧 Зробіть кілька ковтків води перед їжею.`;
  }
  if (type === 'dinner') {
    return `🌙 ${opening}\n\n<b>Вечірній раціон:</b>\n${escapeHtml(meal.dinner || 'Відкрийте myHabbit і перевірте заплановану вечерю.')}\n\n🌿 Їжте без поспіху й без самокритики.`;
  }
  if (type === 'waterMorning') {
    return `💧 ${opening}\n\nНагадуємо про воду. Ваша орієнтовна денна ціль — <b>${water} мл</b>. Випийте комфортну порцію, не змушуючи себе пити надмірно.`;
  }
  if (type === 'waterAfternoon') {
    return `💧 ${opening}\n\nПеревірте, скільки води вже випито сьогодні. Додайте склянку в myHabbit, якщо щойно попили.`;
  }
  return `🫶 ${opening}\n\nЗробіть паузу на дві хвилини: опустіть плечі, повільно вдихніть і видихніть тричі, запитайте себе «що мені зараз потрібно?».\n\nЦе турботливе нагадування, а не медична оцінка.`;
};

export class TelegramStateV2 {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    const url = new URL(request.url);
    try {
      if (url.pathname === '/family-create' && request.method === 'POST') return this.familyCreate(request, await request.json());
      if (url.pathname === '/family-join' && request.method === 'POST') return this.familyJoin(request, await request.json());
      if (url.pathname === '/family-telegram-join' && request.method === 'POST') return this.familyTelegramJoin(request, await request.json());
      if (url.pathname === '/family-telegram-resume' && request.method === 'POST') return this.familyTelegramResume(await request.json());
      if (url.pathname === '/family-invite' && request.method === 'POST') return this.familyCreateInvite(request, await request.json().catch(() => ({})));
      if (url.pathname === '/family-invite-info' && request.method === 'POST') return this.familyInviteInfo(await request.json().catch(() => ({})));
      if (url.pathname === '/family-invite-join' && request.method === 'POST') return this.familyInviteJoin(await request.json());
      if (url.pathname === '/family-state' && request.method === 'GET') return this.familyGetState(request);
      if (url.pathname === '/family-state' && request.method === 'PUT') return this.familyPutState(request, await request.json());
      if (url.pathname === '/daily-submit' && request.method === 'POST') return this.dailySubmit(request, await request.json());
      if (url.pathname === '/daily-gift-status' && request.method === 'GET') return this.dailyGiftStatus(request);
      if (url.pathname === '/daily-gift-claim' && request.method === 'POST') return this.dailyGiftClaim(request);
      if (url.pathname === '/admin-sync-status' && request.method === 'GET') return this.adminSyncStatus(request);
      if (url.pathname === '/admin-process-now' && request.method === 'POST') return this.adminProcessNow(request);
      if (url.pathname === '/admin-reset-user' && request.method === 'POST') return this.adminResetUser(request, await request.json());
      if (url.pathname === '/admin-kick-user' && request.method === 'POST') return this.adminKickUser(request, await request.json());
      if (url.pathname === '/admin-grant-coins' && request.method === 'POST') return this.adminGrantCoins(request, await request.json());
      if (url.pathname === '/family-transfer-coins' && request.method === 'POST') return this.familyTransferCoins(request, await request.json());
      if (url.pathname === '/family-leave' && request.method === 'POST') return this.familyLeave(request);
      if (url.pathname === '/family-reset-session' && request.method === 'POST') return this.familyResetSession(request, await request.json());
      if (url.pathname === '/register' && request.method === 'POST') return this.register(await request.json());
      if (url.pathname === '/settings' && request.method === 'PUT') return this.updateSettings(request, await request.json());
      if (url.pathname === '/status' && request.method === 'GET') return this.status(request);
      if (url.pathname === '/link-code' && request.method === 'POST') return this.refreshLinkCode(request, await request.json().catch(() => ({})));
      if (url.pathname === '/launch-ticket' && request.method === 'POST') return this.launchTicket(request);
      if (url.pathname === '/session' && request.method === 'POST') return this.telegramSession(await request.json());
      if (url.pathname === '/claim' && request.method === 'POST') return this.claimPwa(await request.json());
      if (url.pathname === '/pwa-code' && request.method === 'POST') return this.createPwaCode(request);
      if (url.pathname === '/sync-state' && request.method === 'GET') return this.getSyncState(request);
      if (url.pathname === '/sync-state' && request.method === 'PUT') return this.putSyncState(request, await request.json());
      if (url.pathname === '/webhook' && request.method === 'POST') return this.webhook(await request.json());
      if (url.pathname === '/dispatch' && request.method === 'POST') return this.dispatch();
      if (url.pathname === '/process-due-families' && request.method === 'POST') return json(await this.processDueFamilies());
      if (url.pathname === '/owner-presence' && request.method === 'POST') return this.ownerPresence(request);
      if (url.pathname === '/owner-stats' && request.method === 'GET') return this.ownerStats();
      if (url.pathname === '/owner-restart' && request.method === 'POST') return this.ownerRestart();
      if (url.pathname === '/owner-force-sync' && request.method === 'POST') return this.ownerForceSync();
      if ((url.pathname === '/owner-wipe' || url.pathname === '/owner-wipe-v2') && request.method === 'POST') return this.ownerWipe(await request.json().catch(() => ({})));
      if (url.pathname === '/owner-meta' && request.method === 'GET') return this.ownerMeta();
      if (url.pathname === '/owner-meta' && request.method === 'PUT') return this.ownerMetaUpdate(await request.json().catch(() => ({})));
      if (url.pathname === '/owner-action-log' && request.method === 'GET') return this.ownerActionLog();
      if (url.pathname === '/owner-generation' && request.method === 'PUT') return this.ownerGenerationUpdate(await request.json().catch(() => ({})));
      return json({ error: 'Not found' }, 404);
    } catch (error) {
      console.error(error);
      return json({ error: error.message || 'Internal error' }, error.status || 500);
    }
  }

  clientFingerprint(request) {
    const raw = text(request.headers.get('x-client-ip') || request.headers.get('cf-connecting-ip') || 'unknown', 96);
    return raw.replace(/[^a-zA-Z0-9:._-]/g, '_') || 'unknown';
  }

  async enforceRateLimit(scope, limit, windowMs) {
    const now = Date.now();
    const key = `security-rate:${scope}`;
    let record = await this.state.storage.get(key);
    if (!record || now >= Number(record.resetAt || 0)) record = { count: 0, resetAt: now + windowMs };
    record.count = Number(record.count || 0) + 1;
    await this.state.storage.put(key, record);
    if (record.count > limit) {
      const error = new Error('Забагато спроб. Спробуйте пізніше.');
      error.status = 429;
      throw error;
    }
  }

  async securityEvent(type, details = {}) {
    const now = new Date().toISOString();
    const key = `security-event:${Date.now()}:${crypto.randomUUID()}`;
    await this.state.storage.put(key, { type, at: now, ...details });
  }

  async familyAuthorize(request) {
    const authorization = request.headers.get('authorization') || '';
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
    const parts = token.split('.');
    if (parts.length !== 3 || parts[0] !== 'fq') return null;
    const userId = parts[1];
    const user = await this.state.storage.get(`fq-user:${userId}`);
    if (!user || user.tokenHash !== await sha256(parts[2])) return null;
    const family = await this.state.storage.get(`fq-family:${user.familyId}`);
    if (!family) return null;
    // Any authenticated request is also a reliable presence signal. This makes
    // online status work even when an older cached client misses the heartbeat.
    const deviceId = text(request.headers.get('x-myhabbit-presence-id') || request.headers.get('x-myhabbit-device-id') || 'default', 96).replace(/[^A-Za-z0-9._:-]/g, '_') || 'default';
    const deviceName = text(decodeURIComponent(request.headers.get('x-myhabbit-device-name') || ''), 64) || 'Пристрій';
    const now = Date.now();
    await this.state.storage.put(`owner-presence:${user.id}:${deviceId}`, {
      userId: user.id,
      familyId: family.id,
      name: user.name || 'Користувач',
      familyName: family.name || 'Сімʼя',
      deviceId,
      deviceName,
      at: now
    }, { expirationTtl: 600 });
    return { user, family };
  }

  async familyCreate(request, payload) {
    const client = this.clientFingerprint(request);
    await this.enforceRateLimit(`family-create:${client}`, 5, 60 * 60 * 1000);
    const familyName = text(payload?.familyName, 80);
    const memberName = text(payload?.name, 50);
    const gender = ['male', 'female', 'neutral'].includes(payload?.gender) ? payload.gender : 'neutral';
    const pin = text(payload?.pin, 8).replace(/\D/g, '');
    if (!familyName || !memberName || pin.length < 4) return json({ error: 'Вкажіть назву, ім’я та PIN від 4 цифр' }, 400);
    let code;
    do { code = randomCode().slice(0, 8); } while (await this.state.storage.get(`fq-code:${code}`));
    const familyId = crypto.randomUUID();
    const userId = crypto.randomUUID();
    const secret = randomText(24);
    const avatar = gender === 'female' ? '👩🏻' : gender === 'male' ? '🧑🏻' : '🙂';
    const now = new Date().toISOString();
    const user = { id: userId, familyId, name: memberName, gender, avatar, role: 'owner', tokenHash: await sha256(secret), createdAt: now };
    const initialState = {
      family: { id: familyId, name: familyName, code, level: 1, xp: 0, coins: 0, maxMembers: 5 }, currentUserId: userId,
      users: [{ id:userId,name:memberName,gender,avatar,role:'owner',level:1,xp:0,coins:0,streak:0,skills:{home:1,care:1,health:1,growth:1,finance:1},achievements:[],activity:[] }],
      quests: [], shop: [], achievements: [], history: [], calories:{calories:0,protein:0,fat:0,carbs:0}
    };
    const family = { id: familyId, name: familyName, code, maxMembers: 5, pinHash: await sha256(pin), memberIds: [userId], state: initialState, revision: 1, updatedAt: now };
    await this.state.storage.put(`fq-family:${familyId}`, family);
    await this.state.storage.put(`fq-code:${code}`, familyId);
    await this.state.storage.put(`fq-user:${userId}`, user);
    return json({ token:`fq.${userId}.${secret}`, userId, familyCode:code, state:initialState });
  }

  async familyJoin(request, payload) {
    const client = this.clientFingerprint(request);
    const code = text(payload?.code, 12).toUpperCase().replace(/[^A-Z0-9]/g, '');
    const memberName = text(payload?.name, 50);
    const gender = ['male', 'female', 'neutral'].includes(payload?.gender) ? payload.gender : 'neutral';
    const pin = text(payload?.pin, 8).replace(/\D/g, '');
    await this.enforceRateLimit(`family-join:${client}:${code || 'empty'}`, 8, 10 * 60 * 1000);
    const familyId = await this.state.storage.get(`fq-code:${code}`);
    const family = familyId ? await this.state.storage.get(`fq-family:${familyId}`) : null;
    if (!family || family.pinHash !== await sha256(pin)) return json({ error: 'Невірний код сім’ї або PIN' }, 401);
    if ((family.memberIds || []).length >= Math.max(2, Math.min(25, Number(family.state?.family?.maxMembers || family.maxMembers || 5)))) return json({ error: 'У сім’ї досягнуто встановлений ліміт учасників' }, 409);
    const userId = crypto.randomUUID();
    const secret = randomText(24);
    const avatar = gender === 'female' ? '👩🏻' : gender === 'male' ? '🧑🏻' : '🙂';
    const user = { id:userId,familyId,name:memberName,gender,avatar,role:'member',tokenHash:await sha256(secret),createdAt:new Date().toISOString() };
    family.memberIds = [...(family.memberIds || []), userId];
    family.state.users.push({id:userId,name:memberName,gender,avatar,createdAt:user.createdAt,level:1,xp:0,coins:0,streak:0,skills:{home:1,care:1,health:1,growth:1,finance:1},achievements:[],activity:[],importantDates:[]});
    family.revision = Number(family.revision || 0) + 1;
    family.updatedAt = new Date().toISOString();
    await this.state.storage.put(`fq-user:${userId}`, user);
    await this.state.storage.put(`fq-family:${familyId}`, family);
    return json({ token:`fq.${userId}.${secret}`, userId, familyCode:code, state:{...family.state,currentUserId:userId} });
  }

  async familyTelegramJoin(request, payload) {
    const client = this.clientFingerprint(request);
    const verified = await verifyTelegramInitData(payload?.initData, this.env.TELEGRAM_BOT_TOKEN);
    const telegramUserId = String(verified.user.id);
    const code = text(payload?.code, 12).toUpperCase().replace(/[^A-Z0-9]/g, '');
    const pin = text(payload?.pin, 8).replace(/\D/g, '');
    await this.enforceRateLimit(`telegram-family-join:${client}:${code || 'empty'}`, 8, 10 * 60 * 1000);
    const familyId = await this.state.storage.get(`fq-code:${code}`);
    const family = familyId ? await this.state.storage.get(`fq-family:${familyId}`) : null;
    if (!family || family.pinHash !== await sha256(pin)) return json({ error: 'Невірний код сімʼї або PIN' }, 401);

    const existingUserId = await this.state.storage.get(`fq-telegram:${telegramUserId}`);
    let user = existingUserId ? await this.state.storage.get(`fq-user:${existingUserId}`) : null;
    const memberName = text(payload?.name || [verified.user.first_name, verified.user.last_name].filter(Boolean).join(' '), 50) || 'Telegram user';
    const gender = ['male', 'female', 'neutral'].includes(payload?.gender) ? payload.gender : 'neutral';
    const avatar = gender === 'female' ? '👩🏻' : gender === 'male' ? '🧑🏻' : '🙂';
    const secret = randomText(24);

    if (user && user.familyId !== familyId) {
      return json({ error: 'Цей Telegram уже підключений до іншої сімʼї. Спочатку відʼєднайте його в профілі.' }, 409);
    }

    if (!user) {
      if ((family.memberIds || []).length >= Math.max(2, Math.min(25, Number(family.state?.family?.maxMembers || family.maxMembers || 5)))) return json({ error: 'У сімʼї досягнуто встановлений ліміт учасників' }, 409);
      const userId = crypto.randomUUID();
      user = {
        id: userId, familyId, name: memberName, gender, avatar, role: 'member',
        tokenHash: await sha256(secret), telegramUserId,
        telegramUsername: text(verified.user.username, 64), telegramLinked: true,
        createdAt: new Date().toISOString()
      };
      family.memberIds = [...(family.memberIds || []), userId];
      family.state.users.push({
        id:userId,name:memberName,gender,avatar,role:'member',telegramLinked:true,
        telegramUsername:text(verified.user.username,64),createdAt:user.createdAt,level:1,xp:0,coins:0,streak:0,
        skills:{home:1,care:1,health:1,growth:1,finance:1},achievements:['tg_first_login','tg_verified_profile'],activity:['Перший вхід через Telegram']
      });
    } else {
      user = {...user, name:memberName, tokenHash:await sha256(secret), telegramLinked:true,
        telegramUsername:text(verified.user.username,64), telegramUserId};
      const member = (family.state.users || []).find(item => item.id === user.id);
      if (member) Object.assign(member, {name:memberName, telegramLinked:true, telegramUsername:text(verified.user.username,64)});
    }

    family.revision = Number(family.revision || 0) + 1;
    family.updatedAt = new Date().toISOString();
    await this.state.storage.put(`fq-user:${user.id}`, user);
    await this.state.storage.put(`fq-telegram:${telegramUserId}`, user.id);
    await this.state.storage.put(`fq-family:${familyId}`, family);
    return json({ token:`fq.${user.id}.${secret}`, userId:user.id, familyCode:code, state:{...family.state,currentUserId:user.id}, telegramLinked:true });
  }


  async familyTelegramResume(payload) {
    const verified = await verifyTelegramInitData(payload?.initData, this.env.TELEGRAM_BOT_TOKEN);
    const telegramUserId = String(verified.user.id);
    const userId = await this.state.storage.get(`fq-telegram:${telegramUserId}`);
    if (!userId) return json({ error: 'Попередній Telegram-профіль не знайдено' }, 404);
    let user = await this.state.storage.get(`fq-user:${userId}`);
    if (!user) return json({ error: 'Профіль більше не існує' }, 404);
    const family = await this.state.storage.get(`fq-family:${user.familyId}`);
    if (!family || !(family.memberIds || []).includes(userId)) return json({ error: 'Профіль більше не належить до сімʼї' }, 404);
    const secret = randomText(24);
    const username = text(verified.user.username, 64);
    user = {...user, tokenHash:await sha256(secret), telegramLinked:true, telegramUsername:username, telegramUserId};
    const member = (family.state.users || []).find(item => item.id === userId);
    if (member) {
      member.telegramLinked = true;
      member.telegramUsername = username;
      member.createdAt = member.createdAt || user.createdAt || new Date().toISOString();
      member.achievements = Array.isArray(member.achievements) ? member.achievements : [];
      for (const id of ['tg_first_login','tg_verified_profile']) if (!member.achievements.includes(id)) member.achievements.push(id);
      member.activity = Array.isArray(member.activity) ? member.activity : [];
      member.activity.unshift('Вхід через Telegram підтверджено');
    }
    family.revision = Number(family.revision || 0) + 1;
    family.updatedAt = new Date().toISOString();
    await this.state.storage.put(`fq-user:${userId}`, user);
    await this.state.storage.put(`fq-family:${user.familyId}`, family);
    return json({ token:`fq.${userId}.${secret}`, userId, familyCode:family.code, state:{...family.state,currentUserId:userId}, telegramLinked:true, resumed:true });
  }


  async familyCreateInvite(request, payload) {
    const auth = await this.familyAuthorize(request);
    if (!auth) return json({ error: 'Недійсна сімейна сесія' }, 401);
    if ((auth.family.memberIds || []).length >= Math.max(2, Math.min(25, Number(auth.family.state?.family?.maxMembers || auth.family.maxMembers || 5)))) return json({ error: 'У сімʼї досягнуто встановлений ліміт учасників' }, 409);
    const ttlHours = Math.min(168, Math.max(1, Math.floor(number(payload?.ttlHours) || 24)));
    const maxUses = Math.min(4, Math.max(1, Math.floor(number(payload?.maxUses) || 1)));
    const token = randomText(24);
    const now = Date.now();
    await this.state.storage.put(`fq-invite:${token}`, {
      token, familyId: auth.family.id, createdBy: auth.user.id, createdAt: now,
      expiresAt: now + ttlHours * 60 * 60 * 1000, maxUses, uses: 0, revoked: false
    });
    return json({ token, familyName: auth.family.name, expiresAt: now + ttlHours * 60 * 60 * 1000, maxUses });
  }

  async familyInviteInfo(payload) {
    const token = text(payload?.token, 80);
    const invite = token ? await this.state.storage.get(`fq-invite:${token}`) : null;
    if (!invite || invite.revoked || Number(invite.expiresAt) <= Date.now() || Number(invite.uses || 0) >= Number(invite.maxUses || 1)) {
      return json({ error: 'Запрошення недійсне або вже використане' }, 410);
    }
    const family = await this.state.storage.get(`fq-family:${invite.familyId}`);
    if (!family) return json({ error: 'Сімʼю не знайдено' }, 404);
    return json({ valid: true, familyName: family.name, expiresAt: invite.expiresAt, spotsLeft: Math.max(0, Math.max(2, Math.min(25, Number(family.state?.family?.maxMembers || family.maxMembers || 5))) - (family.memberIds || []).length) });
  }

  async familyInviteJoin(payload) {
    const token = text(payload?.token, 80);
    const invite = token ? await this.state.storage.get(`fq-invite:${token}`) : null;
    if (!invite || invite.revoked || Number(invite.expiresAt) <= Date.now() || Number(invite.uses || 0) >= Number(invite.maxUses || 1)) {
      return json({ error: 'Запрошення недійсне або вже використане' }, 410);
    }
    const family = await this.state.storage.get(`fq-family:${invite.familyId}`);
    if (!family) return json({ error: 'Сімʼю не знайдено' }, 404);
    if ((family.memberIds || []).length >= Math.max(2, Math.min(25, Number(family.state?.family?.maxMembers || family.maxMembers || 5)))) return json({ error: 'У сімʼї досягнуто встановлений ліміт учасників' }, 409);
    let verified = null;
    if (payload?.initData) verified = await verifyTelegramInitData(payload.initData, this.env.TELEGRAM_BOT_TOKEN);
    const memberName = text(payload?.name || [verified?.user?.first_name, verified?.user?.last_name].filter(Boolean).join(' '), 50);
    if (!memberName) return json({ error: 'Вкажіть імʼя' }, 400);
    const gender = ['male', 'female', 'neutral'].includes(payload?.gender) ? payload.gender : 'neutral';
    const userId = crypto.randomUUID();
    const secret = randomText(24);
    const avatar = '✦';
    const telegramUserId = verified?.user?.id ? String(verified.user.id) : '';
    if (telegramUserId) {
      const existing = await this.state.storage.get(`fq-telegram:${telegramUserId}`);
      if (existing) return json({ error: 'Цей Telegram уже підключений до профілю' }, 409);
    }
    const now = new Date().toISOString();
    const user = { id:userId, familyId:family.id, name:memberName, gender, avatar, role:'member', tokenHash:await sha256(secret), createdAt:now, telegramUserId, telegramUsername:text(verified?.user?.username,64), telegramLinked:Boolean(telegramUserId) };
    family.memberIds = [...(family.memberIds || []), userId];
    family.state.users.push({id:userId,name:memberName,gender,avatar,role:'member',createdAt:user.createdAt,invitedBy:invite.createdBy,telegramLinked:Boolean(telegramUserId),telegramUsername:text(verified?.user?.username,64),level:1,xp:0,coins:0,streak:0,skills:{home:1,care:1,health:1,growth:1,finance:1},achievements:telegramUserId?['tg_first_login','tg_verified_profile']:[],activity:['Приєднався за персональним запрошенням'],importantDates:[],referrals:[],stats:{questsCompleted:0,giftsOpened:0,jackpots:0,stickersGiven:0,boxesOpened:0,invitedUsers:0,referralXp:0,referralGifts:0}});
    const inviter = family.state.users.find((item) => item.id === invite.createdBy);
    if (inviter) {
      inviter.stats = { invitedUsers:0, referralXp:0, referralGifts:0, ...(inviter.stats || {}) };
      inviter.referrals = Array.isArray(inviter.referrals) ? inviter.referrals : [];
      if (!inviter.referrals.some((item) => item.userId === userId)) inviter.referrals.push({ userId, name:memberName, joinedAt:now, inviteToken:token });
      inviter.stats.invitedUsers = Number(inviter.stats.invitedUsers || 0) + 1;
      inviter.achievements = Array.isArray(inviter.achievements) ? inviter.achievements : [];
      const milestones = [[1,'ref_first_friend'],[3,'ref_better_together'],[5,'ref_family_grows'],[10,'ref_big_family'],[20,'ref_home_for_all'],[50,'ref_people_connector'],[100,'ref_community_leader'],[250,'ref_community_legend']];
      for (const [need,id] of milestones) if (inviter.stats.invitedUsers >= need && !inviter.achievements.includes(id)) inviter.achievements.push(id);
      inviter.activity = Array.isArray(inviter.activity) ? inviter.activity : [];
      inviter.activity.unshift(`${memberName} приєднався(лася) за вашим запрошенням`);
      family.state.history = Array.isArray(family.state.history) ? family.state.history : [];
      family.state.history.unshift({icon:'💌',text:`${memberName} приєднався(лася) за запрошенням ${inviter.name}`,time:'Щойно'});
    }
    family.revision = Number(family.revision || 0) + 1;
    family.updatedAt = now;
    invite.uses = Number(invite.uses || 0) + 1;
    if (invite.uses >= Number(invite.maxUses || 1)) invite.revoked = true;
    await this.state.storage.put(`fq-user:${userId}`, user);
    if (telegramUserId) await this.state.storage.put(`fq-telegram:${telegramUserId}`, userId);
    await this.state.storage.put(`fq-family:${family.id}`, family);
    await this.state.storage.put(`fq-invite:${token}`, invite);
    return json({ token:`fq.${userId}.${secret}`, userId, familyCode:family.code, state:{...family.state,currentUserId:userId}, telegramLinked:Boolean(telegramUserId) });
  }

  async familyGetState(request) {
    const auth = await this.familyAuthorize(request);
    if (!auth) return json({ error: 'Недійсна сімейна сесія' }, 401);
    return json({ state:{...auth.family.state,currentUserId:auth.user.id}, revision:auth.family.revision, updatedAt:auth.family.updatedAt });
  }

  async familyPutState(request, payload) {
    const auth = await this.familyAuthorize(request);
    if (!auth) return json({ error: 'Недійсна сімейна сесія' }, 401);
    await this.enforceRateLimit(`state-write:${auth.user.id}`, 120, 60 * 1000);
    const next = payload?.state;
    if (!next || typeof next !== 'object') return json({ error: 'Некоректний стан' }, 400);
    const serialized = JSON.stringify(next);
    if (serialized.length > 700000) return json({ error: 'Стан сім’ї завеликий' }, 413);

    const previous = auth.family.state || {};
    const previousUsers = Array.isArray(previous.users) ? previous.users : [];
    const incomingUsers = Array.isArray(next.users) ? next.users : [];
    const previousIds = previousUsers.map((item) => item.id).filter(Boolean).sort();
    const incomingIds = incomingUsers.map((item) => item.id).filter(Boolean).sort();
    if (JSON.stringify(previousIds) !== JSON.stringify(incomingIds)) {
      await this.securityEvent('blocked-member-list-change', { userId: auth.user.id, familyId: auth.family.id });
      return json({ error: 'Склад сімʼї змінюється лише через захищені серверні дії' }, 403);
    }

    const privileged = ['owner', 'admin'].includes(auth.user.role);
    const oldById = new Map(previousUsers.map((item) => [item.id, item]));
    const safeUsers = incomingUsers.map((incoming) => {
      const old = oldById.get(incoming.id);
      if (!old) return null;
      if (!privileged && incoming.id !== auth.user.id) return old;
      return {
        ...old,
        ...incoming,
        id: old.id,
        role: old.role,
        createdAt: old.createdAt,
        telegramLinked: old.telegramLinked,
        telegramUsername: old.telegramUsername
      };
    }).filter(Boolean);

    const oldFamily = previous.family || {};
    const incomingFamily = next.family && typeof next.family === 'object' ? next.family : {};
    const safeFamily = {
      ...oldFamily,
      ...incomingFamily,
      id: oldFamily.id || auth.family.id,
      code: oldFamily.code || auth.family.code,
      maxMembers: oldFamily.maxMembers || auth.family.maxMembers || 5
    };
    if (!privileged) safeFamily.name = oldFamily.name;

    const safeNext = {
      ...previous,
      ...next,
      family: safeFamily,
      users: safeUsers,
      currentUserId: auth.user.id
    };
    auth.family.state = safeNext;
    auth.family.revision = Number(auth.family.revision || 0) + 1;
    auth.family.updatedAt = new Date().toISOString();
    await this.state.storage.put(`fq-family:${auth.family.id}`, auth.family);
    return json({ revision:auth.family.revision, updatedAt:auth.family.updatedAt, securityMode:'protected-state-v1' });
  }


  kyivDay() {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Kyiv', year:'numeric', month:'2-digit', day:'2-digit' }).format(new Date());
  }

  async dailyGiftStatus(request) {
    const auth = await this.familyAuthorize(request);
    if (!auth) return json({ error: 'Недійсна сімейна сесія' }, 401);
    const day = this.kyivDay();
    const claimed = await this.state.storage.get(`fq-daily-gift:${auth.user.id}:${day}`);
    return json({ available: !claimed, day, reward: claimed?.reward || null, claimedAt: claimed?.claimedAt || null });
  }

  async dailyGiftClaim(request) {
    const auth = await this.familyAuthorize(request);
    if (!auth) return json({ error: 'Недійсна сімейна сесія' }, 401);
    const day = this.kyivDay();
    const key = `fq-daily-gift:${auth.user.id}:${day}`;
    const existing = await this.state.storage.get(key);
    if (existing) return json({ claimed: false, duplicate: true, day, reward: existing.reward, state:{...auth.family.state,currentUserId:auth.user.id} });
    const roll = crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296;
    let reward = 5;
    let tier = 'warm';
    if (roll >= 0.995) { reward = 500; tier = 'grand-jackpot'; }
    else if (roll >= 0.97) { reward = 100; tier = 'jackpot'; }
    else if (roll >= 0.87) { reward = 50; tier = 'lucky'; }
    else if (roll >= 0.62) { reward = 10; tier = 'bright'; }
    const member = (auth.family.state.users || []).find((item) => item.id === auth.user.id);
    if (!member) return json({ error: 'Профіль не знайдено' }, 404);
    member.coins = Number(member.coins || 0) + reward;
    member.activity = Array.isArray(member.activity) ? member.activity : [];
    member.activity.unshift(`Ранкова рулетка подарувала ${reward} монет`);
    auth.family.state.history = Array.isArray(auth.family.state.history) ? auth.family.state.history : [];
    auth.family.state.history.unshift({ icon:'🎡', text:`${member.name} отримав(ла) ${reward} монет у ранковій рулетці`, time:'Щойно' });
    auth.family.revision = Number(auth.family.revision || 0) + 1;
    auth.family.updatedAt = new Date().toISOString();
    const result = { reward, tier, day, claimedAt: auth.family.updatedAt };
    await this.state.storage.put(key, result);
    await this.state.storage.put(`fq-family:${auth.family.id}`, auth.family);
    return json({ claimed: true, duplicate: false, ...result, state:{...auth.family.state,currentUserId:auth.user.id} });
  }

  async dailySubmit(request, payload) {
    const auth = await this.familyAuthorize(request);
    if (!auth) return json({ error: 'Недійсна сімейна сесія' }, 401);
    const day = text(payload?.day, 10);
    const seq = Math.max(1, Math.floor(number(payload?.seq)));
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return json({ error: 'Некоректна дата пакета' }, 400);
    const compact = payload?.data && typeof payload.data === 'object' ? payload.data : null;
    if (!compact) return json({ error: 'Порожній пакет синхронізації' }, 400);
    const serialized = JSON.stringify(compact);
    if (serialized.length > 80000) return json({ error: 'Денний пакет завеликий' }, 413);
    const key = `fq-pending:${auth.family.id}:${auth.user.id}:${day}:${seq}`;
    if (await this.state.storage.get(key)) return json({ accepted: true, duplicate: true });
    await this.state.storage.put(key, {
      familyId: auth.family.id,
      userId: auth.user.id,
      day,
      seq,
      receivedAt: new Date().toISOString(),
      data: compact
    });
    return json({ accepted: true, duplicate: false });
  }

  async adminSyncStatus(request) {
    const auth = await this.familyAuthorize(request);
    if (!auth) return json({ error: 'Недійсна сімейна сесія' }, 401);
    if (!['owner', 'admin'].includes(auth.user.role)) return json({ error: 'Лише адміністратор може оновлювати сімейні дані' }, 403);
    const records = await this.state.storage.list({ prefix: `fq-pending:${auth.family.id}:` });
    const users = new Set();
    for (const value of records.values()) users.add(value.userId);
    return json({
      pendingPackets: records.size,
      affectedUsers: users.size,
      latestSnapshotVersion: Number(auth.family.revision || 0),
      lastProcessedAt: auth.family.lastProcessedAt || auth.family.updatedAt || '',
      nextAutomaticAt: '09:00',
      timezone: auth.family.timezone || 'Europe/Kyiv'
    });
  }

  async processFamilyPending(family) {
    const records = await this.state.storage.list({ prefix: `fq-pending:${family.id}:` });
    if (!records.size) return { processed: false, packets: 0, users: 0, revision: Number(family.revision || 0) };
    const ordered = [...records.entries()].sort((a, b) => String(a[1].receivedAt).localeCompare(String(b[1].receivedAt)));
    const affected = new Set();
    for (const [, packet] of ordered) {
      affected.add(packet.userId);
      const data = packet.data || {};
      if (data.user && typeof data.user === 'object') {
        const index = (family.state.users || []).findIndex((item) => item.id === packet.userId);
        if (index >= 0) family.state.users[index] = { ...family.state.users[index], ...data.user, id: packet.userId };
      }
      if (data.family && typeof data.family === 'object') family.state.family = { ...family.state.family, ...data.family, id: family.id };
      if (Array.isArray(data.quests)) {
        const map = new Map((family.state.quests || []).map((item) => [item.id, item]));
        for (const item of data.quests) if (item?.id) map.set(item.id, { ...(map.get(item.id) || {}), ...item });
        family.state.quests = [...map.values()];
      }
      if (Array.isArray(data.shop)) {
        const map = new Map((family.state.shop || []).map((item) => [item.id, item]));
        for (const item of data.shop) if (item?.id) map.set(item.id, { ...(map.get(item.id) || {}), ...item });
        family.state.shop = [...map.values()];
      }
      if (Array.isArray(data.history) && data.history.length) {
        const merged = [...data.history, ...(family.state.history || [])];
        const seen = new Set();
        family.state.history = merged.filter((item) => {
          const key = `${item.text || ''}|${item.time || ''}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        }).slice(0, 120);
      }
    }
    family.revision = Number(family.revision || 0) + 1;
    family.updatedAt = new Date().toISOString();
    family.lastProcessedAt = family.updatedAt;
    await this.state.storage.put(`fq-family:${family.id}`, family);
    await this.state.storage.delete([...records.keys()]);
    return { processed: true, packets: records.size, users: affected.size, revision: family.revision, updatedAt: family.updatedAt };
  }


  async verifyFamilyPin(family, pinValue) {
    const pin = text(pinValue, 8).replace(/\D/g, '');
    if (pin.length < 4 || family.pinHash !== await sha256(pin)) {
      const error = new Error('Невірний сімейний PIN');
      error.status = 401;
      throw error;
    }
  }

  async unlinkTelegramUser(user) {
    if (!user) return;
    if (user.telegramUserId) await this.state.storage.delete(`fq-telegram:${user.telegramUserId}`);
    user.telegramUserId = '';
    user.telegramUsername = '';
    user.telegramLinked = false;
  }

  async removeFamilyMember(family, target) {
    await this.unlinkTelegramUser(target);
    const pending = await this.state.storage.list({ prefix: `fq-pending:${family.id}:${target.id}:` });
    if (pending.size) await this.state.storage.delete([...pending.keys()]);
    family.memberIds = (family.memberIds || []).filter((id) => id !== target.id);
    family.state.users = (family.state.users || []).filter((item) => item.id !== target.id);
    family.state.profileStickers = (family.state.profileStickers || []).filter((item) => item.from !== target.id && item.to !== target.id);
    await this.state.storage.delete(`fq-user:${target.id}`);
  }

  async familyLeave(request) {
    const auth = await this.familyAuthorize(request);
    if (!auth) return json({ error: 'Недійсна сімейна сесія' }, 401);
    const { family, user } = auth;
    const remainingIds = (family.memberIds || []).filter((id) => id !== user.id);
    await this.removeFamilyMember(family, user);
    if (!remainingIds.length) {
      await this.state.storage.delete(`fq-code:${family.code}`);
      await this.state.storage.delete(`fq-family:${family.id}`);
      const invites = await this.state.storage.list({ prefix: 'fq-invite:' });
      const inviteKeys = [...invites.entries()].filter(([, value]) => value?.familyId === family.id).map(([key]) => key);
      if (inviteKeys.length) await this.state.storage.delete(inviteKeys);
      return json({ left: true, familyDeleted: true });
    }
    if (user.role === 'owner') {
      const nextOwnerId = remainingIds[0];
      const nextOwner = await this.state.storage.get(`fq-user:${nextOwnerId}`);
      if (nextOwner) {
        nextOwner.role = 'owner';
        nextOwner.updatedAt = new Date().toISOString();
        await this.state.storage.put(`fq-user:${nextOwner.id}`, nextOwner);
      }
      const nextStateMember = (family.state.users || []).find((item) => item.id === nextOwnerId);
      if (nextStateMember) nextStateMember.role = 'owner';
    }
    family.state.history = family.state.history || [];
    family.state.history.unshift({ icon:'↗', text:`${user.name} вийшов(ла) із сімʼї`, time:'Щойно' });
    family.revision = Number(family.revision || 0) + 1;
    family.updatedAt = new Date().toISOString();
    await this.state.storage.put(`fq-family:${family.id}`, family);
    return json({ left: true });
  }

  async adminKickUser(request, payload) {
    const auth = await this.familyAuthorize(request);
    if (!auth) return json({ error: 'Недійсна сімейна сесія' }, 401);
    if (!['owner', 'admin'].includes(auth.user.role)) return json({ error: 'Лише адміністратор може виключати учасників' }, 403);
    const targetId = text(payload?.userId, 80);
    if (!targetId || targetId === auth.user.id) return json({ error: 'Для власного виходу використайте кнопку «Вийти із сімʼї»' }, 400);
    const target = await this.state.storage.get(`fq-user:${targetId}`);
    if (!target || target.familyId !== auth.family.id) return json({ error: 'Учасника не знайдено' }, 404);
    if (target.role === 'owner') return json({ error: 'Власника сімʼї не можна виключити' }, 403);
    await this.removeFamilyMember(auth.family, target);
    auth.family.state.history = auth.family.state.history || [];
    auth.family.state.history.unshift({ icon:'−', text:`${target.name} виключено адміністратором`, time:'Щойно' });
    auth.family.revision = Number(auth.family.revision || 0) + 1;
    auth.family.updatedAt = new Date().toISOString();
    await this.state.storage.put(`fq-family:${auth.family.id}`, auth.family);
    return json({ kicked: true, userId: targetId, state:{ ...auth.family.state, currentUserId:auth.user.id } });
  }

  async familyTransferCoins(request, payload) {
    const auth = await this.familyAuthorize(request);
    if (!auth) return json({ error: 'Недійсна сімейна сесія' }, 401);
    const targetId = text(payload?.userId, 80);
    const amount = Math.trunc(Number(payload?.amount));
    if (!targetId || targetId === auth.user.id) return json({ error: 'Оберіть іншого учасника сімʼї' }, 400);
    if (!Number.isFinite(amount) || amount < 1 || amount > 1000000) return json({ error: 'Сума має бути від 1 до 1 000 000' }, 400);
    const target = await this.state.storage.get(`fq-user:${targetId}`);
    if (!target || target.familyId !== auth.family.id) return json({ error: 'Учасника не знайдено у вашій сімʼї' }, 404);
    const fromMember = (auth.family.state.users || []).find((item) => item.id === auth.user.id);
    const toMember = (auth.family.state.users || []).find((item) => item.id === targetId);
    if (!fromMember || !toMember) return json({ error: 'Профіль учасника не знайдено' }, 404);
    if (Number(fromMember.coins || 0) < amount) return json({ error: 'Недостатньо монеток' }, 409);
    fromMember.coins = Number(fromMember.coins || 0) - amount;
    toMember.coins = Number(toMember.coins || 0) + amount;
    fromMember.activity = Array.isArray(fromMember.activity) ? fromMember.activity : [];
    toMember.activity = Array.isArray(toMember.activity) ? toMember.activity : [];
    fromMember.activity.unshift(`Передано ${amount} монеток для ${toMember.name}`);
    toMember.activity.unshift(`Отримано ${amount} монеток від ${fromMember.name}`);
    auth.family.state.history = Array.isArray(auth.family.state.history) ? auth.family.state.history : [];
    auth.family.state.history.unshift({ icon:'🪙', text:`${fromMember.name} передав(ла) ${toMember.name} ${amount} монеток`, time:'Щойно', userId:auth.user.id });
    auth.family.revision = Number(auth.family.revision || 0) + 1;
    auth.family.updatedAt = new Date().toISOString();
    await this.state.storage.put(`fq-family:${auth.family.id}`, auth.family);
    return json({ transferred:true, amount, fromBalance:fromMember.coins, toBalance:toMember.coins, state:{ ...auth.family.state, currentUserId:auth.user.id } });
  }

  async adminGrantCoins(request, payload) {
    const auth = await this.familyAuthorize(request);
    if (!auth) return json({ error: 'Недійсна сімейна сесія' }, 401);
    if (!['owner', 'admin'].includes(auth.user.role)) return json({ error: 'Лише адміністратор може видавати монетки' }, 403);
    const targetId = text(payload?.userId, 80);
    const amount = Math.trunc(Number(payload?.amount));
    if (!targetId || !Number.isFinite(amount) || amount < 1 || amount > 1000000) return json({ error: 'Сума має бути від 1 до 1 000 000' }, 400);
    const target = await this.state.storage.get(`fq-user:${targetId}`);
    if (!target || target.familyId !== auth.family.id) return json({ error: 'Учасника не знайдено' }, 404);
    const member = (auth.family.state.users || []).find((item) => item.id === targetId);
    if (!member) return json({ error: 'Профіль учасника не знайдено у сімʼї' }, 404);
    member.coins = Number(member.coins || 0) + amount;
    member.activity = member.activity || [];
    member.activity.unshift(`Адміністратор подарував ${amount} монеток`);
    auth.family.state.history = auth.family.state.history || [];
    auth.family.state.history.unshift({ icon:'✦', text:`${auth.user.name} подарував(ла) ${amount} монеток для ${member.name}`, time:'Щойно' });
    auth.family.revision = Number(auth.family.revision || 0) + 1;
    auth.family.updatedAt = new Date().toISOString();
    await this.state.storage.put(`fq-family:${auth.family.id}`, auth.family);
    return json({ granted:true, userId:targetId, amount, balance:member.coins, state:{ ...auth.family.state, currentUserId:auth.user.id } });
  }

  async familyResetSession(request, payload) {
    const auth = await this.familyAuthorize(request);
    if (!auth) return json({ error: 'Недійсна сімейна сесія' }, 401);
    await this.verifyFamilyPin(auth.family, payload?.pin);
    await this.unlinkTelegramUser(auth.user);
    auth.user.tokenHash = await sha256(randomText(32));
    auth.user.updatedAt = new Date().toISOString();
    const member = (auth.family.state.users || []).find((item) => item.id === auth.user.id);
    if (member) Object.assign(member, { telegramLinked:false, telegramUsername:'' });
    auth.family.revision = Number(auth.family.revision || 0) + 1;
    auth.family.updatedAt = new Date().toISOString();
    await this.state.storage.put(`fq-user:${auth.user.id}`, auth.user);
    await this.state.storage.put(`fq-family:${auth.family.id}`, auth.family);
    return json({ reset:true });
  }

  async adminResetUser(request, payload) {
    const auth = await this.familyAuthorize(request);
    if (!auth) return json({ error: 'Недійсна сімейна сесія' }, 401);
    if (!['owner', 'admin'].includes(auth.user.role)) return json({ error: 'Лише адміністратор може скидати користувачів' }, 403);
    await this.verifyFamilyPin(auth.family, payload?.pin);
    const targetId = text(payload?.userId, 80);
    const target = await this.state.storage.get(`fq-user:${targetId}`);
    if (!target || target.familyId !== auth.family.id) return json({ error: 'Користувача не знайдено' }, 404);
    await this.unlinkTelegramUser(target);
    target.tokenHash = await sha256(randomText(32));
    target.updatedAt = new Date().toISOString();
    await this.state.storage.put(`fq-user:${target.id}`, target);
    const index = (auth.family.state.users || []).findIndex((item) => item.id === target.id);
    if (index >= 0) {
      const old = auth.family.state.users[index];
      auth.family.state.users[index] = {
        id: old.id, name: old.name, gender: old.gender || 'neutral', avatar: old.avatar || '🙂',
        role: old.role, telegramLinked:false, telegramUsername:'', level:1, xp:0, coins:0, streak:0,
        skills:{home:1,care:1,health:1,growth:1,finance:1}, achievements:[], featuredAchievementIds:[],
        stats:{}, activity:['Профіль скинуто адміністратором']
      };
    }
    const pending = await this.state.storage.list({ prefix: `fq-pending:${auth.family.id}:${target.id}:` });
    if (pending.size) await this.state.storage.delete([...pending.keys()]);
    auth.family.revision = Number(auth.family.revision || 0) + 1;
    auth.family.updatedAt = new Date().toISOString();
    await this.state.storage.put(`fq-family:${auth.family.id}`, auth.family);
    return json({ reset:true, userId:target.id, resetSelf:target.id === auth.user.id, state:{...auth.family.state,currentUserId:auth.user.id} });
  }

  async adminProcessNow(request) {
    const auth = await this.familyAuthorize(request);
    if (!auth) return json({ error: 'Недійсна сімейна сесія' }, 401);
    if (!['owner', 'admin'].includes(auth.user.role)) return json({ error: 'Лише адміністратор може запускати оновлення' }, 403);
    const lockKey = `fq-process-lock:${auth.family.id}`;
    const lock = await this.state.storage.get(lockKey);
    if (lock && Date.now() - Number(lock) < 30000) return json({ error: 'Оновлення вже виконується' }, 409);
    await this.state.storage.put(lockKey, Date.now());
    try {
      return json(await this.processFamilyPending(auth.family));
    } finally {
      await this.state.storage.delete(lockKey);
    }
  }

  async processDueFamilies() {
    const records = await this.state.storage.list({ prefix: 'fq-family:' });
    const now = new Date();
    let processedFamilies = 0;
    for (const family of records.values()) {
      const timezone = validTimezone(family.timezone || 'Europe/Kyiv');
      const clock = localClock(now, timezone);
      if (clock.time < '09:00' || family.lastAutomaticProcessDate === clock.date) continue;
      await this.processFamilyPending(family);
      family.lastAutomaticProcessDate = clock.date;
      family.updatedAt = new Date().toISOString();
      await this.state.storage.put(`fq-family:${family.id}`, family);
      processedFamilies += 1;
    }
    return { ok: true, processedFamilies };
  }

  async register(payload) {
    const settings = settingsFromPayload(payload);
    if (!settings.gender) return json({ error: 'Выберите пол: мужчина или женщина' }, 400);
    const clientId = crypto.randomUUID();
    const secret = randomText(24);
    const tokenHash = await sha256(secret);
    const linkCode = await this.uniqueLinkCode();
    const now = Date.now();
    const user = {
      id: clientId,
      tokenHash,
      tokenHashes: [tokenHash],
      legacyTokenHashes: [],
      devices: [],
      chatId: null,
      linkCode,
      linkExpiresAt: now + 24 * 60 * 60 * 1000,
      connectedAt: null,
      createdAt: new Date(now).toISOString(),
      updatedAt: new Date(now).toISOString(),
      ...settings
    };
    await this.state.storage.put(`user:${clientId}`, user);
    await this.state.storage.put(`link:${linkCode}`, clientId);
    return json({
      authToken: `${clientId}.${secret}`,
      sessionId: clientId,
      linkCode,
      connected: false,
      enabled: user.enabled,
      botUsername: this.env.TELEGRAM_BOT_USERNAME || ''
    });
  }

  async authorize(request) {
    const authorization = request.headers.get('authorization') || '';
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
    const separator = token.indexOf('.');
    if (separator < 1) return null;
    const clientId = token.slice(0, separator);
    const secret = token.slice(separator + 1);
    const user = await this.state.storage.get(`user:${clientId}`);
    if (!user) return null;

    const candidateHash = await sha256(secret);
    const devices = normalizedDevices(user);
    let matchedIndex = devices.findIndex((device) => device.tokenHash === candidateHash);
    const legacyHashes = [...new Set([
      ...(Array.isArray(user.legacyTokenHashes) ? user.legacyTokenHashes : []),
      ...(Array.isArray(user.tokenHashes) ? user.tokenHashes : []),
      ...(user.tokenHash ? [user.tokenHash] : [])
    ].filter(Boolean))];

    if (matchedIndex < 0 && legacyHashes.includes(candidateHash)) {
      const requestDevice = deviceInfoFromRequest(request, 'pwa');
      const now = new Date().toISOString();
      devices.push({ ...requestDevice, tokenHash: candidateHash, createdAt: now, lastSeenAt: now });
      matchedIndex = devices.length - 1;
      user.legacyTokenHashes = legacyHashes.filter((hash) => hash !== candidateHash).slice(-8);
      user.tokenHashes = [];
      user.tokenHash = '';
    }

    if (matchedIndex < 0) return null;

    const now = new Date().toISOString();
    const requestDevice = deviceInfoFromRequest(request, devices[matchedIndex].kind);
    devices[matchedIndex] = {
      ...devices[matchedIndex],
      name: requestDevice.name || devices[matchedIndex].name,
      kind: requestDevice.kind || devices[matchedIndex].kind,
      lastSeenAt: now
    };
    user.devices = devices.slice(-12);
    user.updatedAt = now;
    await this.state.storage.put(`user:${user.id}`, user);
    return user;
  }

  async issueAuthToken(user, deviceInput = {}, fallbackKind = 'pwa') {
    const secret = randomText(24);
    const tokenHash = await sha256(secret);
    const now = new Date().toISOString();
    const device = normalizeDeviceInfo(deviceInput, fallbackKind);
    const devices = normalizedDevices(user).filter((item) => item.id !== device.id);
    const legacyHashes = [...new Set([
      ...(Array.isArray(user.legacyTokenHashes) ? user.legacyTokenHashes : []),
      ...(Array.isArray(user.tokenHashes) ? user.tokenHashes : []),
      ...(user.tokenHash ? [user.tokenHash] : [])
    ].filter(Boolean))].slice(-8);

    devices.push({ ...device, tokenHash, createdAt: now, lastSeenAt: now });
    user.devices = devices.slice(-12);
    user.legacyTokenHashes = legacyHashes;
    user.tokenHashes = [];
    user.tokenHash = '';
    user.updatedAt = now;
    await this.state.storage.put(`user:${user.id}`, user);
    return { authToken: `${user.id}.${secret}`, device };
  }

  async ensureTelegramUser(chatId, telegramProfile = {}, appUrl = '') {
    const normalizedChatId = String(chatId);
    let user = await this.userByChat(normalizedChatId);
    const now = new Date().toISOString();
    const safeAppUrl = validAppUrl(appUrl);
    if (user) {
      const updated = {
        ...user,
        chatId: normalizedChatId,
        name: user.name || text(telegramProfile.first_name || telegramProfile.username, 60),
        appUrl: safeAppUrl || user.appUrl || '',
        updatedAt: now
      };
      await this.state.storage.put(`user:${updated.id}`, updated);
      await this.state.storage.put(`chat:${normalizedChatId}`, updated.id);
      return updated;
    }

    const clientId = crypto.randomUUID();
    user = {
      id: clientId,
      tokenHash: '',
      tokenHashes: [],
      legacyTokenHashes: [],
      devices: [],
      chatId: normalizedChatId,
      linkCode: '',
      linkExpiresAt: 0,
      connectedAt: now,
      createdAt: now,
      updatedAt: now,
      ...settingsFromPayload({
        name: telegramProfile.first_name || telegramProfile.username || '',
        appUrl: safeAppUrl,
        timezone: 'Europe/Kyiv',
        waterGoalMl: 2000,
        enabled: false
      }),
      enabled: false
    };
    await this.state.storage.put(`user:${clientId}`, user);
    await this.state.storage.put(`chat:${normalizedChatId}`, clientId);
    return user;
  }

  async createPwaClaim(user, ttlMs = 10 * 60 * 1000) {
    for (let attempt = 0; attempt < 12; attempt += 1) {
      const code = randomCode();
      if (await this.state.storage.get(`claim:${code}`)) continue;
      await this.state.storage.put(`claim:${code}`, {
        userId: user.id,
        chatId: String(user.chatId),
        expiresAt: Date.now() + ttlMs
      });
      return code;
    }
    throw new Error('Не удалось создать код входа для PWA');
  }

  async createPwaCode(request) {
    const user = await this.authorize(request);
    if (!user) return json({ error: 'Недействительный ключ общей сессии' }, 401);
    if (!user.chatId) return json({ error: 'Сначала подключите Telegram к этой общей сессии' }, 409);
    const code = await this.createPwaClaim(user);
    const expiresAt = Date.now() + 10 * 60 * 1000;
    try {
      await this.sendBotMessage(user.chatId, user, `🔗 <b>${greeting(user)[0].toUpperCase()}${greeting(user).slice(1)}, создан код для нового устройства.</b>

<code>${code}</code>

Введите его во второй PWA: «Профиль → Telegram → Ввести код». Код действует 10 минут и не отключает уже подключённые устройства.`);
    } catch (error) {
      console.warn('Telegram PWA code confirmation failed', error.message);
    }
    return json({
      code,
      expiresAt,
      sessionId: user.id,
      deviceCount: pwaDeviceCount(user),
      devices: publicDevices(user)
    });
  }

  async claimPwa(payload) {
    const code = text(payload?.code, 20).replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    if (!/^[A-Z0-9]{8}$/.test(code)) return json({ error: 'Введите восьмизначный код из Telegram' }, 400);
    const claim = await this.state.storage.get(`claim:${code}`);
    if (!claim || Number(claim.expiresAt) <= Date.now()) {
      if (claim) await this.state.storage.delete(`claim:${code}`);
      return json({ error: 'Код не найден или уже истёк. Получите новый код у бота.' }, 404);
    }
    const user = await this.state.storage.get(`user:${claim.userId}`);
    const activeUserId = await this.state.storage.get(`chat:${claim.chatId}`);
    if (!user || String(activeUserId || '') !== String(user.id)) {
      await this.state.storage.delete(`claim:${code}`);
      return json({ error: 'Telegram-сессия изменилась. Получите новый код у бота.' }, 409);
    }
    await this.state.storage.delete(`claim:${code}`);
    const issued = await this.issueAuthToken(user, payload?.device || {}, 'pwa');
    const synced = await this.state.storage.get(`app:${user.id}`);
    const refreshedUser = await this.state.storage.get(`user:${user.id}`) || user;
    const devices = publicDevices(refreshedUser);

    if (refreshedUser.chatId) {
      const address = greeting(refreshedUser);
      const count = devices.length;
      try {
        await telegramCall(this.env, 'sendMessage', {
          chat_id: refreshedUser.chatId,
          parse_mode: 'HTML',
          text: `✅ <b>Готово, ${address}!</b>

Підключено <b>${escapeHtml(issued.device.name)}</b>. Тепер ця PWA використовує той самий щоденник, що й Telegram Mini App${count > 1 ? ' та інша PWA' : ''}.

Підключених PWA: <b>${count}</b>.
Щоб додати ще один телефон, натисніть «🔗 Підключити PWA» і отримайте новий код.`,
          reply_markup: this.mainKeyboard(refreshedUser)
        });
      } catch (error) {
        console.warn('Telegram device confirmation failed', error.message);
      }
    }

    return json({
      authToken: issued.authToken,
      sessionId: user.id,
      connected: true,
      enabled: user.enabled !== false,
      botUsername: this.env.TELEGRAM_BOT_USERNAME || '',
      revision: Number(synced?.revision || 0),
      updatedAt: synced?.updatedAt || '',
      state: synced?.state || null,
      device: { id: issued.device.id, name: issued.device.name, kind: issued.device.kind },
      deviceCount: devices.length,
      devices
    });
  }

  async telegramSession(payload) {
    const verified = await verifyTelegramInitData(payload?.initData, this.env.TELEGRAM_BOT_TOKEN);
    const telegramUserId = String(verified.user.id);
    const user = await this.ensureTelegramUser(telegramUserId, verified.user, payload?.appUrl);
    const issued = await this.issueAuthToken(user, payload?.device || {}, 'telegram-mini-app');
    const synced = await this.state.storage.get(`app:${user.id}`);
    const refreshedUser = await this.state.storage.get(`user:${user.id}`) || user;
    const devices = publicDevices(refreshedUser);
    return json({
      authToken: issued.authToken,
      sessionId: user.id,
      connected: true,
      enabled: user.enabled !== false,
      botUsername: this.env.TELEGRAM_BOT_USERNAME || '',
      revision: Number(synced?.revision || 0),
      updatedAt: synced?.updatedAt || '',
      state: synced?.state || null,
      telegramFirst: true,
      device: { id: issued.device.id, name: issued.device.name, kind: issued.device.kind },
      deviceCount: devices.length,
      devices
    });
  }

  async getSyncState(request) {
    const user = await this.authorize(request);
    if (!user) return json({ error: 'Недействительный ключ общей сессии' }, 401);
    const record = await this.state.storage.get(`app:${user.id}`);
    return json({
      state: record?.state || null,
      sessionId: user.id,
      revision: Number(record?.revision || 0),
      updatedAt: record?.updatedAt || '',
      source: record?.source || '',
      connected: Boolean(user.chatId),
      enabled: user.enabled !== false,
      botUsername: this.env.TELEGRAM_BOT_USERNAME || '',
      deviceCount: pwaDeviceCount(user),
      devices: publicDevices(user)
    });
  }

  async putSyncState(request, payload) {
    const user = await this.authorize(request);
    if (!user) return json({ error: 'Недействительный ключ общей сессии' }, 401);
    const appState = sanitizeAppState(payload?.state);
    const serialized = JSON.stringify(appState);
    if (serialized.length > 900_000) return json({ error: 'Дневник слишком большой для синхронизации' }, 413);
    const current = await this.state.storage.get(`app:${user.id}`);
    const revision = Number(current?.revision || 0) + 1;
    const updatedAt = new Date().toISOString();
    const record = {
      state: appState,
      revision,
      updatedAt,
      source: text(payload?.source, 40) || 'unknown'
    };
    await this.state.storage.put(`app:${user.id}`, record);
    return json({ revision, updatedAt });
  }

  async updateSettings(request, payload) {
    const user = await this.authorize(request);
    if (!user) return json({ error: 'Недействительный ключ подключения' }, 401);
    const settings = settingsFromPayload(payload);
    if (!settings.gender) return json({ error: 'Выберите пол: мужчина или женщина' }, 400);
    const updated = { ...user, ...settings, updatedAt: new Date().toISOString() };
    await this.state.storage.put(`user:${user.id}`, updated);
    return json({
      sessionId: updated.id,
      connected: Boolean(updated.chatId),
      enabled: updated.enabled,
      linkCode: updated.linkCode || '',
      botUsername: this.env.TELEGRAM_BOT_USERNAME || ''
    });
  }

  async status(request) {
    const user = await this.authorize(request);
    if (!user) return json({ error: 'Недействительный ключ подключения' }, 401);
    const codeValid = user.linkCode && Number(user.linkExpiresAt) > Date.now();
    return json({
      sessionId: user.id,
      connected: Boolean(user.chatId),
      enabled: Boolean(user.enabled),
      linkCode: codeValid ? user.linkCode : '',
      botUsername: this.env.TELEGRAM_BOT_USERNAME || '',
      timezone: user.timezone,
      updatedAt: user.updatedAt,
      deviceCount: pwaDeviceCount(user),
      devices: publicDevices(user)
    });
  }

  async refreshLinkCode(request, payload) {
    const user = await this.authorize(request);
    if (!user) return json({ error: 'Недействительный ключ подключения' }, 401);
    if (user.linkCode) await this.state.storage.delete(`link:${user.linkCode}`);
    const settings = settingsFromPayload(payload);
    const linkCode = await this.uniqueLinkCode();
    const updated = {
      ...user,
      ...settings,
      linkCode,
      linkExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
      updatedAt: new Date().toISOString()
    };
    await this.state.storage.put(`user:${user.id}`, updated);
    await this.state.storage.put(`link:${linkCode}`, user.id);
    return json({
      linkCode,
      sessionId: updated.id,
      connected: Boolean(updated.chatId),
      enabled: updated.enabled,
      botUsername: this.env.TELEGRAM_BOT_USERNAME || ''
    });
  }

  async launchTicket(request) {
    const user = await this.authorize(request);
    if (!user) return json({ error: 'Недействительный ключ общей сессии' }, 401);
    if (!user.chatId) return json({ error: 'Сначала подключите Telegram кодом из PWA' }, 409);
    const ticket = await this.createLaunchTicket(user);
    const username = text(this.env.TELEGRAM_BOT_USERNAME, 80).replace(/^@/, '');
    return json({
      ticket,
      sessionId: user.id,
      url: username ? `https://t.me/${username}?startapp=sw_${ticket}` : `${user.appUrl}/?telegram=1&sw_session=${encodeURIComponent(ticket)}`
    });
  }

  async uniqueLinkCode() {
    for (let attempt = 0; attempt < 10; attempt += 1) {
      const code = randomCode();
      if (!await this.state.storage.get(`link:${code}`)) return code;
    }
    throw new Error('Не удалось создать код подключения');
  }

  async userByChat(chatId) {
    const normalizedChatId = String(chatId);
    const mappedUserId = await this.state.storage.get(`chat:${normalizedChatId}`);
    if (mappedUserId) {
      const mappedUser = await this.state.storage.get(`user:${mappedUserId}`);
      if (mappedUser && String(mappedUser.chatId || '') === normalizedChatId) return mappedUser;
      await this.state.storage.delete(`chat:${normalizedChatId}`);
    }

    // Migration path for users linked by versions that did not create chat:<id> mappings.
    const users = await this.state.storage.list({ prefix: 'user:' });
    const matches = [...users.values()].filter((user) => String(user.chatId || '') === normalizedChatId);
    if (!matches.length) return null;
    matches.sort((left, right) => {
      const leftTime = Date.parse(left.connectedAt || left.updatedAt || left.createdAt || 0) || 0;
      const rightTime = Date.parse(right.connectedAt || right.updatedAt || right.createdAt || 0) || 0;
      return rightTime - leftTime;
    });
    const selected = matches[0];
    await this.state.storage.put(`chat:${normalizedChatId}`, selected.id);
    return selected;
  }

  async linkUserToChat(user, chatId, { preserveEnabled = false } = {}) {
    const normalizedChatId = String(chatId);
    const now = new Date().toISOString();
    const mappedUserId = await this.state.storage.get(`chat:${normalizedChatId}`);

    // Detach any older PWA session from the same Telegram user. This was the main reason
    // Telegram could open a different diary after repeated testing/linking.
    if (mappedUserId && mappedUserId !== user.id) {
      const previous = await this.state.storage.get(`user:${mappedUserId}`);
      if (previous) {
        previous.chatId = null;
        previous.enabled = false;
        previous.updatedAt = now;
        await this.state.storage.put(`user:${previous.id}`, previous);
      }
    }

    // Also clean legacy duplicates that existed before the chat mapping was introduced.
    const users = await this.state.storage.list({ prefix: 'user:' });
    for (const candidate of users.values()) {
      if (candidate.id !== user.id && String(candidate.chatId || '') === normalizedChatId) {
        candidate.chatId = null;
        candidate.enabled = false;
        candidate.updatedAt = now;
        await this.state.storage.put(`user:${candidate.id}`, candidate);
      }
    }

    const updated = {
      ...user,
      chatId: normalizedChatId,
      enabled: preserveEnabled ? user.enabled !== false : true,
      connectedAt: user.connectedAt || now,
      linkCode: '',
      linkExpiresAt: 0,
      updatedAt: now
    };
    await this.state.storage.put(`user:${updated.id}`, updated);
    await this.state.storage.put(`chat:${normalizedChatId}`, updated.id);
    return updated;
  }

  async unlinkUserFromChat(user) {
    const chatId = String(user.chatId || '');
    if (chatId) {
      const mappedUserId = await this.state.storage.get(`chat:${chatId}`);
      if (mappedUserId === user.id) await this.state.storage.delete(`chat:${chatId}`);
    }
    const updated = { ...user, chatId: null, enabled: false, updatedAt: new Date().toISOString() };
    await this.state.storage.put(`user:${updated.id}`, updated);
    return updated;
  }

  async createLaunchTicket(user, ttlMs = 60 * 60 * 1000) {
    const ticket = randomText(16).toUpperCase();
    await this.state.storage.put(`launch:${ticket}`, {
      userId: user.id,
      chatId: String(user.chatId),
      expiresAt: Date.now() + ttlMs
    });
    return ticket;
  }

  async recipeRecords(user) {
    const records = await this.state.storage.get(`bot:recipes:${user.id}`);
    return Array.isArray(records) ? records : [];
  }

  async saveRecipeRecords(user, records) {
    await this.state.storage.put(`bot:recipes:${user.id}`, records.slice(-100));
  }

  async routineRecords(user) {
    const records = await this.state.storage.get(`bot:routine:${user.id}`);
    return Array.isArray(records) ? records : [];
  }

  async saveRoutineRecords(user, records) {
    await this.state.storage.put(`bot:routine:${user.id}`, records.slice(0, 50));
  }

  recipesKeyboard() {
    return {
      keyboard: [
        [{ text: '➕ Записати рецепт' }, { text: '📚 Мої рецепти' }],
        [{ text: '🗑 Видалити рецепт' }, { text: '🍎 Калькулятор калорій' }],
        [{ text: '⬅️ Головне меню' }]
      ],
      resize_keyboard: true,
      is_persistent: true,
      input_field_placeholder: 'Збережіть рецепт, посилання або нотатку'
    };
  }

  routineKeyboard() {
    return {
      keyboard: [
        [{ text: '➕ Щоденна рутина' }, { text: '📅 Розклад за днями' }],
        [{ text: '📝 Разове нагадування' }, { text: '📋 Мій план' }],
        [{ text: '🗑 Видалити нагадування' }, { text: '⚙️ Рутини здоров’я' }],
        [{ text: '⬅️ Головне меню' }]
      ],
      resize_keyboard: true,
      is_persistent: true,
      input_field_placeholder: 'Оберіть тип події або нагадування'
    };
  }

  healthKeyboard() {
    return {
      keyboard: [
        [{ text: '💧 Налаштувати воду' }, { text: '🧘 Налаштувати відпочинок' }],
        [{ text: '🏋️ Налаштувати тренування' }, { text: '❤️ Мої рутини здоров’я' }],
        [{ text: '🗑 Очистити рутини здоров’я' }],
        [{ text: '⬅️ До розпорядку' }]
      ],
      resize_keyboard: true,
      is_persistent: true,
      input_field_placeholder: 'Налаштуйте воду, паузи та тренування'
    };
  }

  async setBotMode(user, mode = '') {
    const updated = { ...user, botMode: mode, updatedAt: new Date().toISOString() };
    await this.state.storage.put(`user:${user.id}`, updated);
    return updated;
  }

  formatRecipes(records) {
    if (!records.length) return '📚 <b>Збережених рецептів поки немає.</b>\n\nНатисніть «➕ Записати рецепт» і надішліть назву, текст або посилання.';
    const visible = records.slice(-15).reverse();
    const lines = visible.map((item, index) => {
      const number = records.length - index;
      return `<b>${number}.</b> ${escapeHtml(text(item.text, 700))}`;
    });
    return `📚 <b>Ваші рецепти: ${records.length}</b>\n\n${lines.join('\n\n')}${records.length > 15 ? '\n\n<i>Показано останні 15.</i>' : ''}`;
  }

  weekdayLabel(days = []) {
    const labels = { 1: 'Пн', 2: 'Вт', 3: 'Ср', 4: 'Чт', 5: 'Пт', 6: 'Сб', 0: 'Нд' };
    return days.map((day) => labels[day]).filter(Boolean).join(', ');
  }

  reminderRecordsText(records, filterKind = '') {
    const filtered = filterKind ? records.filter((item) => item.kind === filterKind) : records;
    if (!filtered.length) return filterKind === 'health'
      ? '❤️ <b>Рутин здоров’я ще немає.</b>\n\nНалаштуйте воду, відпочинок або тренування.'
      : '📋 <b>Ваш план поки порожній.</b>\n\nДодайте щоденну рутину, розклад за днями або разове нагадування.';
    const sorted = [...filtered].sort((a, b) => `${a.date || '9999'} ${a.time || ''}`.localeCompare(`${b.date || '9999'} ${b.time || ''}`));
    const lines = sorted.map((item) => {
      let schedule = item.time || '';
      if (item.recurrence === 'once') schedule = `${item.date} ${item.time}`;
      if (item.recurrence === 'daily') schedule = `щодня ${item.time}`;
      if (item.recurrence === 'weekly') schedule = `${this.weekdayLabel(item.days)} ${item.time}`;
      const icon = item.kind === 'health' ? (item.healthType === 'water' ? '💧' : item.healthType === 'rest' ? '🧘' : '🏋️') : item.kind === 'note' ? '📝' : '🗓';
      return `<b>${item.id}.</b> ${icon} ${escapeHtml(schedule)} — ${escapeHtml(item.title)}`;
    });
    return `${filterKind === 'health' ? '❤️ <b>Рутини здоров’я</b>' : '📋 <b>Ваші нагадування</b>'}\n\n${lines.join('\n')}`;
  }

  calorieLinksKeyboard() {
    return {
      inline_keyboard: [
        [{ text: '🍎 Відкрити @Kuswise_bot', url: 'https://t.me/Kuswise_bot?start=myhabbit' }],
        [{ text: '🧮 Калькулятор макросів', url: 'https://kuswise.com/uk/calculator' }]
      ]
    };
  }

  mainKeyboard() {
    return {
      keyboard: [
        [{ text: '📖 Рецепти' }, { text: '🍎 Калькулятор калорій' }],
        [{ text: '🗓 Мій розпорядок' }, { text: '📝 Нагадати мені' }],
        [{ text: '⚙️ Рутини здоров’я' }, { text: '📋 Усі нагадування' }]
      ],
      resize_keyboard: true,
      is_persistent: true,
      input_field_placeholder: 'Рецепти, розпорядок і нагадування'
    };
  }

  genderKeyboard() {
    return {
      keyboard: [[{ text: '👨 Я чоловік' }, { text: '👩 Я жінка' }]],
      resize_keyboard: true,
      one_time_keyboard: true,
      input_field_placeholder: 'Як до вас звертатися?'
    };
  }

  async sendBotMessage(chatId, user, message, extra = {}) {
    return telegramCall(this.env, 'sendMessage', {
      chat_id: chatId,
      parse_mode: 'HTML',
      text: message,
      reply_markup: extra.reply_markup || this.mainKeyboard(user),
      ...extra
    });
  }

  parseTimes(value) {
    return [...new Set(String(value).match(/(?:[01]\d|2[0-3]):[0-5]\d/g) || [])].sort();
  }

  parseWeekdays(value) {
    const map = { 'пн': 1, 'понеділок': 1, 'вт': 2, 'вівторок': 2, 'ср': 3, 'середа': 3, 'чт': 4, 'четвер': 4, 'пт': 5, 'п’ятниця': 5, "п'ятниця": 5, 'сб': 6, 'субота': 6, 'нд': 0, 'неділя': 0 };
    const lower = String(value).toLocaleLowerCase('uk-UA');
    const result = [];
    for (const [label, day] of Object.entries(map)) if (new RegExp(`(^|[^а-яіїєґ])${label.replace("'", "['’]")}([^а-яіїєґ]|$)`, 'iu').test(lower)) result.push(day);
    return [...new Set(result)];
  }

  parseOneTime(value, timezone = 'Europe/Kyiv') {
    const input = String(value).trim();
    const match = input.match(/^(?:(\d{4})-(\d{2})-(\d{2})|(\d{1,2})[.\/-](\d{1,2})(?:[.\/-](\d{4}))?)\s+((?:[01]\d|2[0-3]):[0-5]\d)\s+(.+)$/u);
    if (!match) return null;
    const now = new Date();
    let year = Number(match[1] || match[6] || now.getUTCFullYear());
    const month = Number(match[2] || match[5]);
    const day = Number(match[3] || match[4]);
    const date = `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || month < 1 || month > 12 || day < 1 || day > 31) return null;
    return { date, time: match[7], title: text(match[8], 220) };
  }

  async webhook(update) {
    const message = update?.message;
    const chatId = message?.chat?.id;
    const command = text(message?.text, 1200);
    if (!chatId || !command) return json({ ok: true });

    const appUrl = validAppUrl(update?._appUrl) || validAppUrl(this.env.APP_URL);
    let user = await this.ensureTelegramUser(chatId, message?.from || {}, appUrl);
    const normalized = command.toLocaleLowerCase('uk-UA').trim();
    const isMaleChoice = /^(👨\s*)?(я\s*)?(чоловік|мужчина|пане|пан)$/iu.test(normalized);
    const isFemaleChoice = /^(👩\s*)?(я\s*)?(жінка|женщина|пані)$/iu.test(normalized);

    if (/^\/version\b/i.test(command)) {
      await this.sendBotMessage(chatId, user, `✅ <b>myHabbit Bot ${APP_VERSION}</b>\n\nНовий Worker і webhook активні.`);
      return json({ ok: true, version: APP_VERSION });
    }

    if (isMaleChoice || isFemaleChoice) {
      user = { ...user, gender: isFemaleChoice ? 'female' : 'male', salutation: isFemaleChoice ? 'pani' : 'pan', enabled: true, updatedAt: new Date().toISOString() };
      await this.state.storage.put(`user:${user.id}`, user);
      await this.sendBotMessage(chatId, user, `✅ <b>Готово, ${greeting(user)}.</b>\n\nТут можна зберігати рецепти, вести особистий розпорядок і створювати нагадування.`);
      return json({ ok: true });
    }

    if (!user.gender) {
      await telegramCall(this.env, 'sendMessage', {
        chat_id: chatId,
        parse_mode: 'HTML',
        text: '🌿 <b>Вітаю у myHabbit.</b>\n\nОберіть, як до вас звертатися:',
        reply_markup: this.genderKeyboard()
      });
      return json({ ok: true });
    }

    if (normalized === '⬅️ головне меню' || normalized === '⬅️ до розпорядку' || /^\/(start|menu)\b/i.test(command)) {
      user = await this.setBotMode(user, '');
      await this.sendBotMessage(chatId, user, '🌿 <b>Головне меню myHabbit</b>\n\nОберіть потрібний розділ.');
      return json({ ok: true });
    }

    // Conversational input modes.
    if (user.botMode === 'recipe_add') {
      const records = await this.recipeRecords(user);
      records.push({ id: randomText(5), text: text(command, 1200), createdAt: new Date().toISOString() });
      await this.saveRecipeRecords(user, records);
      user = await this.setBotMode(user, '');
      await this.sendBotMessage(chatId, user, '✅ <b>Рецепт збережено.</b>', { reply_markup: this.recipesKeyboard() });
      return json({ ok: true });
    }
    if (user.botMode === 'recipe_delete') {
      const records = await this.recipeRecords(user);
      const index = Number(command) - 1;
      if (!Number.isInteger(index) || index < 0 || index >= records.length) {
        await this.sendBotMessage(chatId, user, 'Вкажіть номер рецепта зі списку.', { reply_markup: this.recipesKeyboard() });
        return json({ ok: true });
      }
      records.splice(index, 1);
      await this.saveRecipeRecords(user, records);
      user = await this.setBotMode(user, '');
      await this.sendBotMessage(chatId, user, '🗑 <b>Рецепт видалено.</b>', { reply_markup: this.recipesKeyboard() });
      return json({ ok: true });
    }

    const reminders = await this.routineRecords(user);
    const nextId = () => reminders.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;

    if (user.botMode === 'routine_daily') {
      const match = command.match(/^((?:[01]\d|2[0-3]):[0-5]\d)\s+(.+)$/u);
      if (!match) {
        await this.sendBotMessage(chatId, user, 'Надішліть у форматі: <code>08:30 Сніданок</code>', { reply_markup: this.routineKeyboard() });
        return json({ ok: true });
      }
      reminders.push({ id: nextId(), kind: 'routine', recurrence: 'daily', time: match[1], title: text(match[2], 220), enabled: true, createdAt: new Date().toISOString() });
      await this.saveRoutineRecords(user, reminders);
      user = await this.setBotMode(user, '');
      await this.sendBotMessage(chatId, user, '✅ <b>Щоденну рутину додано.</b>', { reply_markup: this.routineKeyboard() });
      return json({ ok: true });
    }
    if (user.botMode === 'routine_weekly') {
      const time = this.parseTimes(command)[0];
      const days = this.parseWeekdays(command);
      const title = text(command.replace(/(?:[01]\d|2[0-3]):[0-5]\d/, '').replace(/^(?:пн|вт|ср|чт|пт|сб|нд|понеділок|вівторок|середа|четвер|п['’]ятниця|субота|неділя)(?:\s*[,;]\s*(?:пн|вт|ср|чт|пт|сб|нд|понеділок|вівторок|середа|четвер|п['’]ятниця|субота|неділя))*\s*/iu, ''), 220);
      if (!time || !days.length || !title) {
        await this.sendBotMessage(chatId, user, 'Надішліть у форматі: <code>пн, ср, пт 18:30 Тренування</code>', { reply_markup: this.routineKeyboard() });
        return json({ ok: true });
      }
      reminders.push({ id: nextId(), kind: 'routine', recurrence: 'weekly', days, time, title, enabled: true, createdAt: new Date().toISOString() });
      await this.saveRoutineRecords(user, reminders);
      user = await this.setBotMode(user, '');
      await this.sendBotMessage(chatId, user, '✅ <b>Розклад за днями додано.</b>', { reply_markup: this.routineKeyboard() });
      return json({ ok: true });
    }
    if (user.botMode === 'note_once') {
      const parsed = this.parseOneTime(command, user.timezone);
      if (!parsed) {
        await this.sendBotMessage(chatId, user, 'Надішліть дату, час і текст: <code>25.07.2026 18:30 Купити продукти</code>', { reply_markup: this.routineKeyboard() });
        return json({ ok: true });
      }
      reminders.push({ id: nextId(), kind: 'note', recurrence: 'once', ...parsed, enabled: true, createdAt: new Date().toISOString() });
      await this.saveRoutineRecords(user, reminders);
      user = await this.setBotMode(user, '');
      await this.sendBotMessage(chatId, user, `✅ <b>Нагадування створено:</b> ${escapeHtml(parsed.date)} о ${escapeHtml(parsed.time)}.`, { reply_markup: this.routineKeyboard() });
      return json({ ok: true });
    }
    if (user.botMode === 'reminder_delete') {
      const id = Number(command);
      const kept = reminders.filter((item) => Number(item.id) !== id);
      if (!Number.isInteger(id) || kept.length === reminders.length) {
        await this.sendBotMessage(chatId, user, 'Вкажіть номер нагадування зі списку.', { reply_markup: this.routineKeyboard() });
        return json({ ok: true });
      }
      await this.saveRoutineRecords(user, kept);
      user = await this.setBotMode(user, '');
      await this.sendBotMessage(chatId, user, '🗑 <b>Нагадування видалено.</b>', { reply_markup: this.routineKeyboard() });
      return json({ ok: true });
    }
    if (user.botMode === 'health_water') {
      const times = this.parseTimes(command);
      if (!times.length) {
        await this.sendBotMessage(chatId, user, 'Вкажіть один або кілька часів: <code>09:00, 12:00, 15:00, 18:00</code>', { reply_markup: this.healthKeyboard() });
        return json({ ok: true });
      }
      const clean = reminders.filter((item) => !(item.kind === 'health' && item.healthType === 'water'));
      for (const time of times) clean.push({ id: clean.reduce((m, i) => Math.max(m, Number(i.id) || 0), 0) + 1, kind: 'health', healthType: 'water', recurrence: 'daily', time, title: 'Час випити води', enabled: true });
      await this.saveRoutineRecords(user, clean);
      user = await this.setBotMode(user, '');
      await this.sendBotMessage(chatId, user, `💧 <b>Нагадування про воду налаштовано:</b> ${times.join(', ')}.`, { reply_markup: this.healthKeyboard() });
      return json({ ok: true });
    }
    if (user.botMode === 'health_rest') {
      const times = this.parseTimes(command);
      if (!times.length) {
        await this.sendBotMessage(chatId, user, 'Вкажіть час пауз: <code>11:30, 16:30</code>', { reply_markup: this.healthKeyboard() });
        return json({ ok: true });
      }
      const clean = reminders.filter((item) => !(item.kind === 'health' && item.healthType === 'rest'));
      for (const time of times) clean.push({ id: clean.reduce((m, i) => Math.max(m, Number(i.id) || 0), 0) + 1, kind: 'health', healthType: 'rest', recurrence: 'daily', time, title: 'Час трохи відпочити', enabled: true });
      await this.saveRoutineRecords(user, clean);
      user = await this.setBotMode(user, '');
      await this.sendBotMessage(chatId, user, `🧘 <b>Паузи для відпочинку налаштовано:</b> ${times.join(', ')}.`, { reply_markup: this.healthKeyboard() });
      return json({ ok: true });
    }
    if (user.botMode === 'health_training') {
      const time = this.parseTimes(command)[0];
      const days = this.parseWeekdays(command);
      if (!time || !days.length) {
        await this.sendBotMessage(chatId, user, 'Надішліть дні й час: <code>пн, ср, пт 18:30</code>', { reply_markup: this.healthKeyboard() });
        return json({ ok: true });
      }
      const clean = reminders.filter((item) => !(item.kind === 'health' && item.healthType === 'training'));
      clean.push({ id: clean.reduce((m, i) => Math.max(m, Number(i.id) || 0), 0) + 1, kind: 'health', healthType: 'training', recurrence: 'weekly', days, time, title: 'Сьогодні тренування', enabled: true });
      await this.saveRoutineRecords(user, clean);
      user = await this.setBotMode(user, '');
      await this.sendBotMessage(chatId, user, `🏋️ <b>Тренування налаштовано:</b> ${this.weekdayLabel(days)} о ${time}.`, { reply_markup: this.healthKeyboard() });
      return json({ ok: true });
    }

    if (/^\/recipes\b/i.test(command) || normalized === '📖 рецепти') {
      user = await this.setBotMode(user, '');
      await this.sendBotMessage(chatId, user, '📖 <b>Рецепти</b>\n\nТут можна зберігати назву, інгредієнти, спосіб приготування або посилання.', { reply_markup: this.recipesKeyboard() });
      return json({ ok: true });
    }
    if (normalized === '➕ записати рецепт') {
      user = await this.setBotMode(user, 'recipe_add');
      await this.sendBotMessage(chatId, user, 'Надішліть рецепт одним повідомленням. Можна додати посилання.', { reply_markup: this.recipesKeyboard() });
      return json({ ok: true });
    }
    if (normalized === '📚 мої рецепти') {
      await this.sendBotMessage(chatId, user, this.formatRecipes(await this.recipeRecords(user)), { reply_markup: this.recipesKeyboard() });
      return json({ ok: true });
    }
    if (normalized === '🗑 видалити рецепт') {
      user = await this.setBotMode(user, 'recipe_delete');
      await this.sendBotMessage(chatId, user, `${this.formatRecipes(await this.recipeRecords(user))}\n\nНадішліть номер рецепта для видалення.`, { reply_markup: this.recipesKeyboard() });
      return json({ ok: true });
    }
    if (/^\/calories\b/i.test(command) || normalized === '🍎 калькулятор калорій') {
      await telegramCall(this.env, 'sendMessage', { chat_id: chatId, parse_mode: 'HTML', text: '🍎 <b>Калькулятор калорій</b>\n\nВідкрийте KusWise для розпізнавання їжі або розрахунку калорій і макросів.', reply_markup: this.calorieLinksKeyboard() });
      await this.sendBotMessage(chatId, user, 'Головне меню залишається доступним нижче.');
      return json({ ok: true });
    }
    if (/^\/routine\b/i.test(command) || normalized === '🗓 мій розпорядок' || normalized === '🗓 розпорядок дня') {
      user = await this.setBotMode(user, '');
      await this.sendBotMessage(chatId, user, '🗓 <b>Особистий розпорядок</b>\n\nДодавайте щоденні справи, події за днями тижня та разові замітки з майбутнім нагадуванням.', { reply_markup: this.routineKeyboard() });
      return json({ ok: true });
    }
    if (normalized === '➕ щоденна рутина') {
      user = await this.setBotMode(user, 'routine_daily');
      await this.sendBotMessage(chatId, user, 'Надішліть час і назву: <code>08:30 Сніданок</code>', { reply_markup: this.routineKeyboard() });
      return json({ ok: true });
    }
    if (normalized === '📅 розклад за днями') {
      user = await this.setBotMode(user, 'routine_weekly');
      await this.sendBotMessage(chatId, user, 'Надішліть дні, час і назву: <code>пн, ср, пт 18:30 Тренування</code>', { reply_markup: this.routineKeyboard() });
      return json({ ok: true });
    }
    if (/^\/note\b/i.test(command) || normalized === '📝 нагадати мені' || normalized === '📝 разове нагадування') {
      user = await this.setBotMode(user, 'note_once');
      await this.sendBotMessage(chatId, user, 'Надішліть дату, час і замітку: <code>25.07.2026 18:30 Подзвонити мамі</code>', { reply_markup: this.routineKeyboard() });
      return json({ ok: true });
    }
    if (/^\/reminders\b/i.test(command) || normalized === '📋 усі нагадування' || normalized === '📋 мій план') {
      await this.sendBotMessage(chatId, user, this.reminderRecordsText(reminders), { reply_markup: this.routineKeyboard() });
      return json({ ok: true });
    }
    if (normalized === '🗑 видалити нагадування') {
      user = await this.setBotMode(user, 'reminder_delete');
      await this.sendBotMessage(chatId, user, `${this.reminderRecordsText(reminders)}\n\nНадішліть номер для видалення.`, { reply_markup: this.routineKeyboard() });
      return json({ ok: true });
    }
    if (/^\/health\b/i.test(command) || normalized === '⚙️ рутини здоров’я' || normalized === "⚙️ рутини здоров'я") {
      user = await this.setBotMode(user, '');
      await this.sendBotMessage(chatId, user, '⚙️ <b>Рутини здоров’я</b>\n\nОкремо налаштуйте воду, короткі паузи та дні тренувань.', { reply_markup: this.healthKeyboard() });
      return json({ ok: true });
    }
    if (normalized === '💧 налаштувати воду') {
      user = await this.setBotMode(user, 'health_water');
      await this.sendBotMessage(chatId, user, 'Вкажіть часи через кому: <code>09:00, 12:00, 15:00, 18:00</code>', { reply_markup: this.healthKeyboard() });
      return json({ ok: true });
    }
    if (normalized === '🧘 налаштувати відпочинок') {
      user = await this.setBotMode(user, 'health_rest');
      await this.sendBotMessage(chatId, user, 'Вкажіть час коротких пауз: <code>11:30, 16:30</code>', { reply_markup: this.healthKeyboard() });
      return json({ ok: true });
    }
    if (normalized === '🏋️ налаштувати тренування') {
      user = await this.setBotMode(user, 'health_training');
      await this.sendBotMessage(chatId, user, 'Вкажіть дні та час: <code>пн, ср, пт 18:30</code>', { reply_markup: this.healthKeyboard() });
      return json({ ok: true });
    }
    if (normalized === '❤️ мої рутини здоров’я' || normalized === "❤️ мої рутини здоров'я") {
      await this.sendBotMessage(chatId, user, this.reminderRecordsText(reminders, 'health'), { reply_markup: this.healthKeyboard() });
      return json({ ok: true });
    }
    if (normalized === '🗑 очистити рутини здоров’я' || normalized === "🗑 очистити рутини здоров'я") {
      await this.saveRoutineRecords(user, reminders.filter((item) => item.kind !== 'health'));
      await this.sendBotMessage(chatId, user, '🗑 <b>Усі рутини здоров’я видалено.</b>', { reply_markup: this.healthKeyboard() });
      return json({ ok: true });
    }

    await this.sendBotMessage(chatId, user, 'Оберіть потрібний розділ у меню нижче.');
    return json({ ok: true });
  }

  async dispatch() {
    const users = await this.state.storage.list({ prefix: 'user:' });
    const now = new Date();
    let sent = 0;
    for (const user of users.values()) {
      if (!user.chatId) continue;
      let local;
      try { local = localClock(now, user.timezone || 'Europe/Kyiv'); } catch { local = localClock(now, 'Europe/Kyiv'); }
      const reminders = await this.routineRecords(user);
      const weekday = new Date(`${local.date}T12:00:00Z`).getUTCDay();
      let changed = false;
      const [currentHour, currentMinute] = local.time.split(':').map(Number);
      const currentTotalMinutes = currentHour * 60 + currentMinute;
      for (const item of reminders) {
        if (item.enabled === false || !/^([01]\d|2[0-3]):[0-5]\d$/.test(String(item.time))) continue;
        const [itemHour, itemMinute] = String(item.time).split(':').map(Number);
        const delayMinutes = currentTotalMinutes - (itemHour * 60 + itemMinute);
        if (delayMinutes < 0 || delayMinutes > 4) continue;
        const matches = item.recurrence === 'daily'
          || (item.recurrence === 'weekly' && Array.isArray(item.days) && item.days.includes(weekday))
          || (item.recurrence === 'once' && item.date === local.date);
        if (!matches) continue;
        const sentKey = `sent:${user.id}:${local.date}:custom:${item.id}`;
        if (await this.state.storage.get(sentKey)) continue;
        const icon = item.kind === 'health' ? (item.healthType === 'water' ? '💧' : item.healthType === 'rest' ? '🧘' : '🏋️') : item.kind === 'note' ? '📝' : '🗓';
        try {
          await telegramCall(this.env, 'sendMessage', {
            chat_id: user.chatId,
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            text: `${icon} <b>${escapeHtml(item.time)} — ${escapeHtml(item.title)}</b>\n\n${item.kind === 'health' ? 'Турботливе нагадування з ваших налаштувань здоров’я.' : item.kind === 'note' ? 'Ваша особиста замітка з майбутнім нагадуванням.' : 'Подія з вашого особистого розпорядку.'}`
          });
          await this.state.storage.put(sentKey, now.toISOString());
          sent += 1;
          if (item.recurrence === 'once') {
            item.enabled = false;
            item.completedAt = now.toISOString();
            changed = true;
          }
        } catch (error) {
          console.error('Custom reminder failed', user.id, item.id, error.message);
        }
      }
      if (changed) await this.saveRoutineRecords(user, reminders);
    }
    await this.cleanupSentKeys(now);
    return json({ ok: true, sent });
  }

  async ownerPresence(request) {
    const auth = await this.familyAuthorize(request);
    if (!auth) return json({ error: 'Unauthorized' }, 401);
    // familyAuthorize already records presence. Return the accepted signal so
    // the client can diagnose authorization failures instead of failing silently.
    return json({ ok: true, userId: auth.user.id, familyId: auth.family.id, at: new Date().toISOString() });
  }

  async ownerMeta() {
    const updateName = String(await this.state.storage.get('owner-update-name') || 'myHabbit beta');
    const maintenance = Boolean(await this.state.storage.get('owner-maintenance-enabled') || false);
    const maintenanceMessage = String(await this.state.storage.get('owner-maintenance-message') || 'Ми обережно оновлюємо myHabbit. Поверніться трохи пізніше.');
    const cacheRevision = Number(await this.state.storage.get('owner-cache-revision') || 1);
    return json({ ok: true, updateName, maintenance, maintenanceMessage, cacheRevision, updatedAt: new Date().toISOString() });
  }

  async ownerMetaUpdate(body) {
    const updateName = String(body?.updateName || '').trim().slice(0, 80);
    if (updateName) await this.state.storage.put('owner-update-name', updateName);
    if (typeof body?.maintenance === 'boolean') await this.state.storage.put('owner-maintenance-enabled', body.maintenance);
    if (typeof body?.maintenanceMessage === 'string') await this.state.storage.put('owner-maintenance-message', String(body.maintenanceMessage).trim().slice(0, 240));
    if (body?.forceCacheRefresh === true) {
      const previous = Number(await this.state.storage.get('owner-cache-revision') || 1);
      const cacheRevision = previous + 1;
      await this.state.storage.put('owner-cache-revision', cacheRevision);
      await this.recordOwnerAction('force-client-update', true, `Примусове оновлення клієнтів: ${previous} → ${cacheRevision}`, { previous, cacheRevision });
    }
    const currentName = String(await this.state.storage.get('owner-update-name') || 'myHabbit beta');
    const maintenance = Boolean(await this.state.storage.get('owner-maintenance-enabled') || false);
    const maintenanceMessage = String(await this.state.storage.get('owner-maintenance-message') || 'Ми обережно оновлюємо myHabbit. Поверніться трохи пізніше.');
    const cacheRevision = Number(await this.state.storage.get('owner-cache-revision') || 1);
    return json({ ok: true, updateName: currentName, maintenance, maintenanceMessage, cacheRevision, updatedAt: new Date().toISOString() });
  }

  async ownerStats() {
    const now = Date.now();
    const onlineCutoff = now - 3 * 60 * 1000;
    const [families, users, presence, snapshots, generation] = await Promise.all([
      this.state.storage.list({ prefix: 'fq-family:' }),
      this.state.storage.list({ prefix: 'fq-user:' }),
      this.state.storage.list({ prefix: 'owner-presence:' }),
      this.state.storage.list({ prefix: 'owner-snapshot:' }),
      this.state.storage.get('owner-runtime-generation')
    ]);
    const activeByUser = new Map();
    const stale = [];
    for (const [key, record] of presence) {
      const at = Number(record?.at || 0);
      if (at < onlineCutoff) { stale.push(key); continue; }
      const userId = String(record?.userId || key.split(':')[1] || 'unknown');
      const previous = activeByUser.get(userId);
      const device = { id: record?.deviceId || 'default', name: record?.deviceName || 'Пристрій', at };
      if (!previous) activeByUser.set(userId, {
        userId,
        familyId: record?.familyId || '',
        name: record?.name || users.get(`fq-user:${userId}`)?.name || 'Користувач',
        familyName: record?.familyName || families.get(`fq-family:${record?.familyId}`)?.name || 'Сімʼя',
        at,
        devices: [device]
      });
      else {
        previous.at = Math.max(previous.at, at);
        if (!previous.devices.some(item => item.id === device.id)) previous.devices.push(device);
      }
    }
    if (stale.length) await this.state.storage.delete(stale);
    const onlineUsers = [...activeByUser.values()].sort((a,b)=>b.at-a.at).map(item => ({
      ...item,
      lastSeenAt: new Date(item.at).toISOString(),
      devices: item.devices.map(device => ({ ...device, lastSeenAt: new Date(device.at).toISOString() }))
    }));
    const online = onlineUsers.length;
    const familyCount = families.size;
    const userCount = users.size;
    const date = new Date(now).toISOString().slice(0, 10);
    const snapshotKey = `owner-snapshot:${date}`;
    await this.state.storage.put(snapshotKey, { date, families: familyCount, users: userCount, online, at: now });
    const historyMap = new Map(snapshots);
    historyMap.set(snapshotKey, { date, families: familyCount, users: userCount, online, at: now });
    const history = [...historyMap.values()].sort((a,b)=>String(a.date).localeCompare(String(b.date))).slice(-30);
    return json({
      ok: true,
      online,
      onlineUsers,
      presenceWindowSeconds: 180,
      families: familyCount,
      users: userCount,
      history,
      generation: Number(generation || 1),
      updatedAt: new Date(now).toISOString()
    });
  }

  async ownerGenerationUpdate(body = {}) {
    const current = Number(await this.state.storage.get('owner-runtime-generation') || 1);
    const mode = text(body.mode, 24);
    let generation = current;
    if (mode === 'next') generation = current + 1;
    else if (mode === 'previous') generation = Math.max(1, current - 1);
    else if (mode === 'set') {
      const requested = Math.floor(Number(body.generation));
      if (!Number.isFinite(requested) || requested < 1 || requested > 999999) return json({ error: 'Покоління має бути числом від 1 до 999999' }, 400);
      generation = requested;
    } else return json({ error: 'Невідома дія покоління' }, 400);
    await this.state.storage.put('owner-runtime-generation', generation);
    await this.recordOwnerAction('generation-change', true, `Покоління сервера змінено: ${current} → ${generation}`, { previous: current, generation, mode });
    return json({ ok: true, previous: current, generation, mode, updatedAt: new Date().toISOString() });
  }

  async recordOwnerAction(type, ok, message, details = {}) {
    const at = new Date().toISOString();
    const id = `${Date.now()}:${crypto.randomUUID()}`;
    const entry = { id, at, type: text(type, 64), ok: Boolean(ok), message: text(message, 240), details };
    await this.state.storage.put(`owner-action:${id}`, entry);
    const records = await this.state.storage.list({ prefix: 'owner-action:' });
    const extra = [...records.keys()].sort().reverse().slice(120);
    if (extra.length) await this.state.storage.delete(extra);
    return entry;
  }

  async ownerActionLog() {
    const records = await this.state.storage.list({ prefix: 'owner-action:' });
    const actions = [...records.values()].sort((a,b)=>String(b.at).localeCompare(String(a.at))).slice(0,80);
    return json({ ok: true, actions });
  }

  async ownerRestart() {
    const now = Date.now();
    const generation = Number(await this.state.storage.get('owner-runtime-generation') || 1) + 1;
    const [presence, rates] = await Promise.all([
      this.state.storage.list({ prefix: 'owner-presence:' }),
      this.state.storage.list({ prefix: 'security-rate:' })
    ]);
    const keys = [...presence.keys(), ...rates.keys()];
    if (keys.length) await this.state.storage.delete(keys);
    await this.state.storage.put('owner-runtime-generation', generation);
    const processing = await this.processDueFamilies();
    const restartedAt = new Date(now).toISOString();
    await this.recordOwnerAction('restart', true, 'Мʼяке оновлення сервера виконано', { generation, processing });
    return json({ ok: true, generation, restartedAt, processing });
  }

  async ownerForceSync() {
    const records = await this.state.storage.list({ prefix: 'fq-family:' });
    let processedFamilies = 0;
    let packets = 0;
    let users = 0;
    const failures = [];
    for (const family of records.values()) {
      try {
        const result = await this.processFamilyPending(family);
        processedFamilies += 1;
        packets += Number(result?.packets || 0);
        users += Number(result?.users || 0);
      } catch (error) {
        failures.push({ familyId: family?.id || 'unknown', error: error.message || 'Помилка синхронізації' });
      }
    }
    const syncedAt = new Date().toISOString();
    await this.state.storage.put('owner-last-force-sync', { at: syncedAt, processedFamilies, packets, users, failures: failures.length });
    await this.recordOwnerAction('force-sync', failures.length === 0, failures.length ? 'Синхронізація завершилась з помилками' : 'Усі сімʼї синхронізовано', { processedFamilies, packets, users, failures });
    return json({ ok: failures.length === 0, processedFamilies, packets, users, failures, syncedAt });
  }

  async ownerWipe(payload = {}) {
    if (text(payload.confirm, 64) !== 'WIPE MYHABBIT') {
      return json({ error: 'Для вайпу введіть точну фразу WIPE MYHABBIT' }, 400);
    }
    const prefixes = [
      'fq-family:', 'fq-user:', 'fq-code:', 'fq-invite:', 'fq-pending:',
      'fq-process-lock:', 'fq-telegram:', 'fq-daily-gift:', 'owner-presence:',
      'owner-snapshot:', 'security-rate:', 'security-event:', 'state-write:'
    ];
    const keys = [];
    for (const prefix of prefixes) {
      const records = await this.state.storage.list({ prefix });
      keys.push(...records.keys());
    }
    if (keys.length) {
      for (let index = 0; index < keys.length; index += 128) {
        await this.state.storage.delete(keys.slice(index, index + 128));
      }
    }
    const generation = Number(await this.state.storage.get('owner-runtime-generation') || 1) + 1;
    await this.state.storage.put('owner-runtime-generation', generation);
    const wipedAt = new Date().toISOString();
    await this.state.storage.put('owner-last-wipe', { at: wipedAt, deletedKeys: keys.length });
    await this.recordOwnerAction('wipe', true, 'Повний вайп сервера виконано', { deletedKeys: keys.length, generation });
    return json({ ok: true, deletedKeys: keys.length, generation, wipedAt });
  }


  async cleanupSentKeys(now) {
    const records = await this.state.storage.list({ prefix: 'sent:' });
    const cutoff = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const removals = [];
    for (const key of records.keys()) {
      const match = key.match(/^sent:[^:]+:(\d{4}-\d{2}-\d{2}):/);
      if (match && match[1] < cutoff) removals.push(key);
    }
    if (removals.length) await this.state.storage.delete(removals);
  }
}

const ownerDayToken = async (secret, dayOffset = 0) => {
  const date = new Date(Date.now() + dayOffset * 86400000).toISOString().slice(0, 10);
  return sha256(`myhabbit-owner:${date}:${secret}`);
};

const ownerAuthorized = async (request, env) => {
  const ownerSecret = env.OWNER_PANEL_SECRET || DEFAULT_OWNER_PANEL_SECRET;
  if (!ownerSecret) return false;
  const cookie = request.headers.get('cookie') || '';
  const token = cookie.match(/(?:^|;\s*)myhabbit_owner=([^;]+)/)?.[1] || '';
  const today = await ownerDayToken(ownerSecret, 0);
  const yesterday = await ownerDayToken(ownerSecret, -1);
  return token === today || token === yesterday;
};

const ownerPage = () => new Response(`<!doctype html><html lang="uk"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="robots" content="noindex,nofollow"><title>myHabbit Owner</title><style>
:root{color-scheme:light;font-family:Inter,"Segoe UI",system-ui,sans-serif;--cream:#f7f0e3;--paper:#fffaf2;--paper-2:#f3eadb;--ink:#453b32;--muted:#8b7d70;--sage:#7f9d83;--sage-dark:#58745f;--honey:#d9a95e;--rose:#c98278;--line:#e5d7c6;--shadow:0 18px 45px rgba(96,72,48,.12)}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:radial-gradient(circle at 10% 0,#fff9ec 0,transparent 34%),linear-gradient(160deg,#f8f1e6,#efe4d5);color:var(--ink);min-height:100vh}.wrap{max-width:1220px;margin:auto;padding:28px;padding-top:max(28px,env(safe-area-inset-top));padding-bottom:max(34px,env(safe-area-inset-bottom))}.top{display:flex;justify-content:space-between;align-items:center;gap:16px}.brand{font-size:26px;font-weight:900;letter-spacing:-.03em}.muted{color:var(--muted);line-height:1.5}.hero{position:relative;overflow:hidden;background:linear-gradient(135deg,#fffaf2,#efe5d4);border:1px solid rgba(148,119,89,.18);border-radius:28px;padding:24px;box-shadow:var(--shadow);margin-bottom:16px}.hero:after{content:"🐻";position:absolute;right:24px;bottom:-18px;font-size:92px;opacity:.16;transform:rotate(-7deg)}.hero-title{display:flex;align-items:center;gap:12px}.hero-copy{max-width:700px}.status-line{display:flex;align-items:center;gap:8px;margin-top:7px}.owner-nav{position:sticky;top:max(8px,env(safe-area-inset-top));z-index:20;display:flex;gap:8px;overflow:auto;padding:10px;margin:0 0 18px;background:rgba(255,250,242,.9);backdrop-filter:blur(14px);border:1px solid rgba(143,116,86,.16);border-radius:18px;box-shadow:0 10px 30px rgba(88,64,40,.09)}.owner-nav a{white-space:nowrap;text-decoration:none;color:var(--ink);font-weight:800;padding:9px 13px;border-radius:12px}.owner-nav a:hover,.owner-nav a:focus{background:#e8efe6;color:var(--sage-dark)}.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin:0 0 18px}.card{background:rgba(255,250,242,.95);border:1px solid var(--line);border-radius:22px;padding:20px;box-shadow:0 12px 32px rgba(99,74,47,.08)}.metric{min-height:152px;display:flex;flex-direction:column;justify-content:space-between}.metric-icon{font-size:24px}.value{font-size:38px;font-weight:900;letter-spacing:-.04em;margin-top:8px;color:var(--sage-dark)}.bar{height:10px;background:#eadfce;border-radius:20px;overflow:hidden;margin-top:14px}.fill{height:100%;background:linear-gradient(90deg,var(--sage),#b5c9a6)}canvas{width:100%;height:320px}.actions,.control-grid{display:flex;gap:12px;flex-wrap:wrap}.control-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:14px}button,input{border:1px solid transparent;border-radius:13px;padding:12px 16px;font:inherit}button{cursor:pointer;background:var(--sage);color:white;font-weight:800;min-height:46px;transition:transform .18s ease,box-shadow .18s ease,filter .18s ease}button:hover{transform:translateY(-1px);box-shadow:0 8px 18px rgba(87,116,95,.2);filter:saturate(1.05)}button:active{transform:translateY(1px) scale(.99)}input{background:#fffdf8;color:var(--ink);border-color:var(--line);outline:none}input:focus{border-color:#9db39f;box-shadow:0 0 0 4px rgba(127,157,131,.14)}.danger{background:var(--rose)}.danger-strong{background:#a94e4e}.ghost{background:#eee5d8;color:var(--ink)}.success{background:var(--sage)}.login{max-width:430px;margin:11vh auto;padding:28px}.login-mark{font-size:52px;margin-bottom:10px}.hidden{display:none!important}.dot{display:inline-block;width:10px;height:10px;background:#73aa79;border-radius:50%;box-shadow:0 0 0 5px rgba(115,170,121,.12)}.result{min-height:22px;margin-top:12px;color:#74675c;font-weight:650}.section{scroll-margin-top:96px;margin-top:16px}.section-head{display:flex;justify-content:space-between;gap:16px;align-items:flex-start}.section h2,.control-card h2{margin:6px 0 8px;font-size:22px}.action-log{display:grid;gap:10px;max-height:520px;overflow:auto;padding-right:4px}.action-item{display:grid;grid-template-columns:12px minmax(0,1fr) auto;gap:12px;align-items:start;padding:13px;border-radius:15px;background:#fbf5eb;border:1px solid var(--line)}.action-item .lamp{width:10px;height:10px;border-radius:50%;margin-top:5px;background:#d97878}.action-item.ok .lamp{background:#79a87e}.action-item strong{display:block}.action-item small{color:var(--muted)}.action-details{font-family:ui-monospace,monospace;font-size:11px;color:#8a7a6a;word-break:break-word;margin-top:5px}.online-list{display:grid;gap:10px}.online-user{display:flex;justify-content:space-between;gap:16px;padding:13px;border-radius:15px;background:#fbf5eb;border:1px solid var(--line)}.online-user strong{display:block}.online-user small{color:var(--muted)}.generation-row{display:grid;grid-template-columns:1fr auto auto auto;gap:10px;align-items:center}.generation-row input{width:100%}.danger-zone{border-color:#deb7b1;background:#fff4f1}.danger-zone h2{color:#a34d4d}.danger-zone input{width:100%;margin:10px 0}.control-card p{line-height:1.55}.badge{display:inline-flex;padding:5px 10px;border-radius:999px;background:#e4ede1;color:var(--sage-dark);font-size:12px;font-weight:900}.quick-note{display:flex;align-items:center;gap:12px;padding:13px 15px;border-radius:16px;background:#f3eadc;margin-top:14px}.quick-note .bear{font-size:30px}.footer-note{text-align:center;color:var(--muted);padding:22px 0 4px;font-size:13px}@media(max-width:900px){.grid{grid-template-columns:1fr 1fr}.top,.section-head{align-items:flex-start;flex-direction:column}.actions{width:100%}.hero:after{font-size:72px}}@media(max-width:600px){.grid,.control-grid{grid-template-columns:1fr}.wrap{padding:14px;padding-top:max(14px,env(safe-area-inset-top))}.hero{border-radius:22px;padding:19px}.actions{display:grid}.actions button{width:100%}.value{font-size:34px}.owner-nav{top:max(4px,env(safe-area-inset-top));border-radius:15px}.generation-row{grid-template-columns:1fr 1fr}.generation-row input{grid-column:1/-1}.section-head button{width:100%}.brand{font-size:23px}.card{padding:17px;border-radius:19px}}

.owner-fold{margin:0 0 14px}.owner-fold-toggle{width:100%;display:flex;align-items:center;justify-content:space-between;gap:12px;background:var(--paper);color:var(--ink);border:1px solid var(--line);border-radius:18px;padding:15px 18px;box-shadow:0 10px 26px rgba(99,74,47,.07);text-align:left}.owner-fold-toggle:hover{background:#f3eadb;color:var(--sage-dark)}.owner-fold-toggle .chevron{transition:transform .2s ease;font-size:18px}.owner-fold.open>.owner-fold-toggle .chevron{transform:rotate(180deg)}.owner-fold-content{display:none;padding-top:12px}.owner-fold.open>.owner-fold-content{display:block}.owner-fold-content>.card,.owner-fold-content>.control-grid{margin-top:0}.owner-fold .section{margin:0}.owner-fold-title{display:grid;gap:2px}.owner-fold-title small{font-weight:600;color:var(--muted)}.cache-refresh-card{border:1px solid #d9c58f;background:linear-gradient(135deg,#fffaf2,#fff4cf)}
</style></head><body><div class="wrap"><section id="login" class="login card"><div class="login-mark">🐻</div><div class="brand">myHabbit Owner</div><p class="muted">Тиха й затишна кімната керування вашим сімейним простором.</p><input id="secret" type="password" placeholder="Пароль власника" style="width:100%;margin:12px 0"><button id="loginBtn" style="width:100%">Увійти</button><p id="loginError" class="muted"></p></section><main id="dashboard" class="hidden"><header class="hero"><div class="top"><div class="hero-copy"><div class="hero-title"><span style="font-size:34px">🐻</span><div><div class="brand">Кімната власника</div><div class="status-line muted"><span class="dot"></span>Все працює спокійно · <span id="updated">—</span></div></div></div><div class="quick-note"><span class="bear">☕</span><div><strong>Teddy поруч</strong><div class="muted">Тут зібрано лише те, що справді потрібно для догляду за myHabbit.</div></div></div></div><div class="actions"><button class="ghost" id="refresh">Оновити дані</button><button class="ghost" id="logout">Вийти</button></div></div></header><section id="overview" class="section"><div class="grid"><div class="card metric"><span class="metric-icon">🌿</span><div><div class="muted">Зараз онлайн</div><div class="value" id="online">0</div><div class="muted">активні за останні 2 хвилини</div></div></div><div class="card metric"><span class="metric-icon">🏡</span><div><div class="muted">Створено сімей</div><div class="value"><span id="families">0</span> / <span id="maxFamilies">50</span></div><div class="bar"><div id="familyFill" class="fill" style="width:0"></div></div></div></div><div class="card metric"><span class="metric-icon">👨‍👩‍👧‍👦</span><div><div class="muted">Усього користувачів</div><div class="value" id="users">0</div><div class="muted">у всіх сімейних просторах</div></div></div><div class="card metric"><span class="metric-icon">✨</span><div><div class="muted">Покоління сервера</div><div class="value" id="generation">1</div><div class="muted">службова версія стану</div></div></div></div><div class="card"><h2>Зростання сімей за 30 днів</h2><p class="muted">Мʼякий огляд розвитку спільноти без зайвих технічних деталей.</p><canvas id="chart" width="1100" height="320"></canvas></div></section><section id="online-section" class="card section"><div class="section-head"><div><span class="badge">Живий статус</span><h2>Хто зараз у myHabbit</h2><p class="muted">Унікальні профілі, які подавали сигнал або виконували серверну дію за останні 3 хвилини.</p></div><button class="ghost" id="refreshOnline">Оновити список</button></div><div id="onlineList" class="online-list"><div class="muted">Завантаження…</div></div></section><section id="service-section" class="section"><div class="control-grid"><section class="card control-card"><span class="badge">Синхронізація</span><h2>Оновити сімейні дані</h2><p class="muted">Обробляє накопичені зміни всіх сімей. Звичайним користувачам ця дія недоступна.</p><button class="success" id="forceSync">Синхронізувати всі сімʼї</button><div class="result" id="syncResult"></div></section><section class="card control-card"><span class="badge">Telegram</span><h2>Перевірити Telegram</h2><p class="muted">Перевіряє доступність і налаштування Telegram-бота myHabbit.</p><button class="ghost" id="checkTelegram">Перевірити Telegram</button><div class="result" id="telegramResult"></div></section><section class="card control-card cache-refresh-card"><span class="badge">Оновлення застосунку</span><h2>Примусово оновити всі сесії</h2><p class="muted">Після наступного відкриття або повернення в застосунок користувачі очистять старий PWA-кеш, отримають нові файли та автоматично перезавантажать інтерфейс.</p><button class="success" id="forceClientUpdate">Оновити кеш усіх користувачів</button><div class="result" id="clientUpdateResult"></div></section><section class="card control-card"><span class="badge">Сервіс</span><h2>Мʼяко освіжити сервер</h2><p class="muted">Очищає тимчасові онлайн-сесії та службові ліміти, не торкаючись сімей і профілів.</p><button class="danger" id="restart">Мʼяко перезапустити</button><div class="result" id="restartResult"></div></section></div><section class="card control-card section"><span class="badge">Покоління</span><h2>Керування поколінням сервера</h2><p class="muted">Службовий номер для позначення міграцій, перезапусків і етапів даних. Він не відкочує код Cloudflare.</p><div class="generation-row"><input id="generationInput" type="number" min="1" max="999999" value="1"><button class="ghost" id="generationPrev">−1</button><button class="success" id="generationSet">Встановити</button><button class="ghost" id="generationNext">+1</button></div><div class="result" id="generationResult"></div></section></section><section id="settings-section" class="section"><div class="control-grid"><section class="card control-card"><span class="badge">Версія</span><h2>Назва поточного оновлення</h2><p class="muted">Цей підпис непомітно показується внизу головного екрана користувачів.</p><input id="updateName" maxlength="80" placeholder="Наприклад: Cozy Owner 10.0" style="width:100%;margin-bottom:10px"><button class="success" id="saveUpdateName">Зберегти назву</button><div class="result" id="updateNameResult"></div></section><section class="card control-card"><span class="badge">Технічні роботи</span><h2>Режим обслуговування</h2><p class="muted">Показує користувачам мʼякий екран технічних робіт. Дані залишаються безпечними.</p><label style="display:flex;gap:9px;align-items:center;margin:10px 0"><input id="maintenanceEnabled" type="checkbox"> Увімкнути режим</label><input id="maintenanceMessage" maxlength="240" placeholder="Повідомлення для користувачів" style="width:100%;margin-bottom:10px"><button class="danger" id="saveMaintenance">Застосувати режим</button><div class="result" id="maintenanceResult"></div></section></div></section><section id="log-section" class="card control-card section"><div class="section-head"><div><span class="badge">Журнал</span><h2>Останні серверні дії</h2><p class="muted">Успішні й невдалі синхронізації, службові зміни та інші важливі події.</p></div><button class="ghost" id="refreshLog">Оновити журнал</button></div><div id="actionLog" class="action-log"><div class="muted">Завантаження…</div></div></section><section id="danger-section" class="card danger-zone section"><span class="badge" style="background:#f3d9d4;color:#934d4d">Обережно</span><h2>Повний вайп сервера</h2><p>Безповоротно видаляє всі сімʼї, профілі, запрошення, черги синхронізації та сімейні сесії. Локальні копії можуть залишитися, але втратять чинний серверний доступ.</p><label for="wipeConfirm">Для підтвердження введіть <strong>WIPE MYHABBIT</strong></label><input id="wipeConfirm" autocomplete="off" placeholder="WIPE MYHABBIT"><button class="danger-strong" id="wipe">Скинути весь сервер до нуля</button><div class="result" id="wipeResult"></div></section><div class="footer-note">myHabbit Cozy Owner Console · створено для спокійного догляду за сімейним простором</div></main></div><script>
const $=id=>document.getElementById(id);let maxFamilies=50;
async function api(path,options={}){const r=await fetch(path,{...options,headers:{'content-type':'application/json',...(options.headers||{})}});if(r.status===401)throw new Error('unauthorized');const data=await r.json();if(!r.ok)throw new Error(data.error||'Помилка');return data}
function busy(button,state,label){button.disabled=state;button.textContent=state?'Виконується…':label}
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function loadActionLog(){const box=$('actionLog');if(!box)return;try{const d=await api('/api/owner/action-log');const actions=d.actions||[];box.innerHTML=actions.length?actions.map(a=>'<div class="action-item '+(a.ok?'ok':'')+'"><span class="lamp"></span><div><strong>'+esc(a.message||a.type)+'</strong><small>'+new Date(a.at).toLocaleString('uk-UA')+' · '+esc(a.type)+'</small>'+(a.details&&Object.keys(a.details).length?'<div class="action-details">'+esc(JSON.stringify(a.details))+'</div>':'')+'</div><small>'+(a.ok?'Успішно':'Помилка')+'</small></div>').join(''):'<div class="muted">Серверних дій поки немає</div>'}catch(e){box.innerHTML='<div class="muted">Не вдалося завантажити журнал: '+esc(e.message)+'</div>'}}

function draw(history){const c=$('chart'),x=c.getContext('2d'),w=c.width,h=c.height;x.clearRect(0,0,w,h);x.strokeStyle='#2a3b50';x.fillStyle='#91a5bb';x.font='13px system-ui';for(let i=0;i<5;i++){const y=30+i*(h-60)/4;x.beginPath();x.moveTo(45,y);x.lineTo(w-20,y);x.stroke()}if(!history.length)return;const max=Math.max(maxFamilies,...history.map(v=>v.families),1);x.strokeStyle='#65dba6';x.lineWidth=4;x.beginPath();history.forEach((v,i)=>{const px=45+i*(w-75)/Math.max(1,history.length-1),py=h-30-v.families/max*(h-60);i?x.lineTo(px,py):x.moveTo(px,py);if(i===0||i===history.length-1)x.fillText(v.date.slice(5),px-18,h-8)});x.stroke()}

function initOwnerFolds(){
  const configs=[
    ['overview','Огляд','Основні показники та зростання'],
    ['online-section','Онлайн-користувачі','Показати активні профілі'],
    ['service-section','Сервіс і оновлення','Синхронізація, кеш та сервер'],
    ['settings-section','Налаштування','Версія та технічні роботи'],
    ['log-section','Журнал дій','Останні серверні події'],
    ['danger-section','Небезпечна зона','Критичні дії сервера']
  ];
  configs.forEach(([id,title,subtitle],index)=>{
    const section=$(id);if(!section||section.closest('.owner-fold'))return;
    const fold=document.createElement('div');fold.className='owner-fold';
    const toggle=document.createElement('button');toggle.type='button';toggle.className='owner-fold-toggle';toggle.setAttribute('aria-expanded','false');
    toggle.innerHTML='<span class="owner-fold-title"><strong>'+title+'</strong><small>'+subtitle+'</small></span><span class="chevron">⌄</span>';
    const content=document.createElement('div');content.className='owner-fold-content';
    section.parentNode.insertBefore(fold,section);fold.append(toggle,content);content.append(section);
    toggle.onclick=()=>{const opening=!fold.classList.contains('open');document.querySelectorAll('.owner-fold.open').forEach(x=>{x.classList.remove('open');x.querySelector('.owner-fold-toggle')?.setAttribute('aria-expanded','false')});if(opening){fold.classList.add('open');toggle.setAttribute('aria-expanded','true')}};
  });
}
initOwnerFolds();

async function load(){try{const d=await api('/api/owner/stats');maxFamilies=d.maxFamilies||50;$('online').textContent=d.online;$('families').textContent=d.families;$('users').textContent=d.users;$('maxFamilies').textContent=maxFamilies;$('generation').textContent=d.generation;$('generationInput').value=d.generation;$('updated').textContent=new Date(d.updatedAt).toLocaleTimeString();$('familyFill').style.width=Math.min(100,d.families/maxFamilies*100)+'%';const onlineUsers=d.onlineUsers||[];$('onlineList').innerHTML=onlineUsers.length?onlineUsers.map(u=>'<div class="online-user"><div><strong>'+esc(u.name)+'</strong><small>'+esc(u.familyName)+' · '+((u.devices&&u.devices.length)||1)+' пристр.</small></div><small>'+new Date(u.lastSeenAt).toLocaleTimeString('uk-UA')+'</small></div>').join(''):'<div class="muted">Зараз активних користувачів немає</div>';draw(d.history||[]);try{const m=await api('/api/owner/meta');$('updateName').value=m.updateName||'';$('maintenanceEnabled').checked=!!m.maintenance;$('maintenanceMessage').value=m.maintenanceMessage||'';}catch{}$('login').classList.add('hidden');$('dashboard').classList.remove('hidden');await loadActionLog()}catch(e){$('dashboard').classList.add('hidden');$('login').classList.remove('hidden')}}
$('loginBtn').onclick=async()=>{try{await api('/api/owner/login',{method:'POST',body:JSON.stringify({secret:$('secret').value})});$('secret').value='';load()}catch(e){$('loginError').textContent='Невірний пароль'}};
$('refresh').onclick=load;$('refreshOnline').onclick=load;$('refreshLog').onclick=loadActionLog;
$('checkTelegram').onclick=async()=>{const b=$('checkTelegram');busy(b,true,'Перевірити Telegram');$('telegramResult').textContent='';try{const r=await fetch('/api/telegram/config',{cache:'no-store'});const d=await r.json();if(!r.ok)throw new Error(d.error||'Telegram недоступний');$('telegramResult').textContent=d.ready?'Бот @'+d.botUsername+' працює':'Telegram ще не налаштований';}catch(e){$('telegramResult').textContent=e.message}finally{busy(b,false,'Перевірити Telegram')}};
async function changeGeneration(mode){const b=mode==='set'?$('generationSet'):mode==='next'?$('generationNext'):$('generationPrev');const label=b.textContent;busy(b,true,label);$('generationResult').textContent='';try{const payload={mode};if(mode==='set')payload.generation=Number($('generationInput').value);const d=await api('/api/owner/generation',{method:'PUT',body:JSON.stringify(payload)});$('generation').textContent=d.generation;$('generationInput').value=d.generation;$('generationResult').textContent='Покоління змінено: '+d.previous+' → '+d.generation;await loadActionLog()}catch(e){$('generationResult').textContent=e.message}finally{busy(b,false,label)}}
$('generationPrev').onclick=()=>changeGeneration('previous');$('generationSet').onclick=()=>changeGeneration('set');$('generationNext').onclick=()=>changeGeneration('next');
$('forceSync').onclick=async()=>{const b=$('forceSync');busy(b,true,'Синхронізувати всі сімʼї');$('syncResult').textContent='';try{const d=await api('/api/owner/force-sync',{method:'POST',body:'{}'});$('syncResult').textContent='Готово: '+d.processedFamilies+' сімей, '+d.packets+' пакетів, '+d.users+' учасників.';await load()}catch(e){$('syncResult').textContent=e.message}finally{busy(b,false,'Синхронізувати всі сімʼї');await loadActionLog()}};
$('restart').onclick=async()=>{if(!confirm('Виконати мʼяке оновлення? Дані сімей не видаляються.'))return;const b=$('restart');busy(b,true,'Мʼяко перезапустити');try{const d=await api('/api/owner/restart',{method:'POST',body:'{}'});$('restartResult').textContent='Готово. Покоління сервера: '+d.generation;await load()}catch(e){$('restartResult').textContent=e.message}finally{busy(b,false,'Мʼяко перезапустити');await loadActionLog()}};


$('forceClientUpdate').onclick=async()=>{if(!confirm('Примусово очистити старий кеш у всіх користувачів після їх наступного відкриття застосунку?'))return;const b=$('forceClientUpdate');busy(b,true,'Оновити кеш усіх користувачів');$('clientUpdateResult').textContent='';try{const d=await api('/api/owner/meta',{method:'PUT',body:JSON.stringify({forceCacheRefresh:true})});$('clientUpdateResult').textContent='Команду опубліковано. Нова ревізія кешу: '+d.cacheRevision;await loadActionLog()}catch(e){$('clientUpdateResult').textContent=e.message}finally{busy(b,false,'Оновити кеш усіх користувачів')}};

$('saveUpdateName').onclick=async()=>{const b=$('saveUpdateName');const updateName=$('updateName').value.trim();if(!updateName){$('updateNameResult').textContent='Вкажіть назву оновлення';return}busy(b,true,'Зберегти назву');try{const d=await api('/api/owner/meta',{method:'PUT',body:JSON.stringify({updateName})});$('updateNameResult').textContent='Збережено: '+d.updateName}catch(e){$('updateNameResult').textContent=e.message}finally{busy(b,false,'Зберегти назву')}};
$('saveMaintenance').onclick=async()=>{const b=$('saveMaintenance');busy(b,true,'Застосувати режим');try{const d=await api('/api/owner/meta',{method:'PUT',body:JSON.stringify({maintenance:$('maintenanceEnabled').checked,maintenanceMessage:$('maintenanceMessage').value.trim()})});$('maintenanceResult').textContent=d.maintenance?'Режим обслуговування увімкнено':'Режим обслуговування вимкнено'}catch(e){$('maintenanceResult').textContent=e.message}finally{busy(b,false,'Застосувати режим')}};
$('wipe').onclick=async()=>{const phrase=$('wipeConfirm').value.trim();if(phrase!=='WIPE MYHABBIT'){ $('wipeResult').textContent='Введіть точну фразу WIPE MYHABBIT';return}if(!confirm('ОСТАННЄ ПОПЕРЕДЖЕННЯ: видалити всі серверні сімʼї та профілі без можливості відновлення?'))return;const b=$('wipe');busy(b,true,'Скинути весь сервер до нуля');try{const d=await api('/api/owner/wipe-v2',{method:'POST',body:JSON.stringify({confirm:phrase})});$('wipeConfirm').value='';$('wipeResult').textContent='Сервер очищено. Видалено '+d.deletedKeys+' записів.';await load()}catch(e){$('wipeResult').textContent=e.message}finally{busy(b,false,'Скинути весь сервер до нуля');await loadActionLog()}};
$('logout').onclick=async()=>{await api('/api/owner/logout',{method:'POST'});location.reload()};load();setInterval(load,30000);
</script></body></html>`, { headers: { 'content-type':'text/html; charset=utf-8','cache-control':'no-store','x-robots-tag':'noindex, nofollow','content-security-policy':"default-src 'self'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; frame-ancestors 'none'" } });

const stateStub = (env) => env.TELEGRAM_STATE.get(env.TELEGRAM_STATE.idFromName('global'));

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/owner-console') return ownerPage();
    if (url.pathname === '/api/owner/login' && request.method === 'POST') {
      const payload = await request.json().catch(() => ({}));
      const supplied = text(payload.secret, 256);
      const ownerSecret = env.OWNER_PANEL_SECRET || DEFAULT_OWNER_PANEL_SECRET;
      if (supplied !== ownerSecret) return json({ error: 'Unauthorized' }, 401);
      const token = await ownerDayToken(ownerSecret);
      return json({ ok: true }, 200, { 'set-cookie': `myhabbit_owner=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400` });
    }
    if (url.pathname === '/api/owner/logout' && request.method === 'POST') {
      return json({ ok: true }, 200, { 'set-cookie': 'myhabbit_owner=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0' });
    }
    if (url.pathname === '/api/owner/stats' && request.method === 'GET') {
      if (!await ownerAuthorized(request, env)) return json({ error: 'Unauthorized' }, 401);
      const response = await stateStub(env).fetch('https://telegram-state/owner-stats');
      const data = await response.json();
      return json({ ...data, maxFamilies: Math.max(1, Number(env.OWNER_MAX_FAMILIES || 50)) });
    }
    if (url.pathname === '/api/owner/restart' && request.method === 'POST') {
      if (!await ownerAuthorized(request, env)) return json({ error: 'Unauthorized' }, 401);
      return stateStub(env).fetch('https://telegram-state/owner-restart', { method: 'POST' });
    }
    if (url.pathname === '/api/owner/force-sync' && request.method === 'POST') {
      if (!await ownerAuthorized(request, env)) return json({ error: 'Unauthorized' }, 401);
      return stateStub(env).fetch('https://telegram-state/owner-force-sync', { method: 'POST' });
    }
    if ((url.pathname === '/api/owner/wipe' || url.pathname === '/api/owner/wipe-v2') && request.method === 'POST') {
      if (!await ownerAuthorized(request, env)) return json({ error: 'Unauthorized' }, 401);
      return stateStub(env).fetch('https://telegram-state/owner-wipe-v2', {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: await request.text()
      });
    }

    if (url.pathname === '/api/owner/meta' && request.method === 'GET') {
      if (!await ownerAuthorized(request, env)) return json({ error: 'Unauthorized' }, 401);
      return stateStub(env).fetch('https://telegram-state/owner-meta');
    }
    if (url.pathname === '/api/owner/meta' && request.method === 'PUT') {
      if (!await ownerAuthorized(request, env)) return json({ error: 'Unauthorized' }, 401);
      return stateStub(env).fetch('https://telegram-state/owner-meta', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: await request.text() });
    }
    if (url.pathname === '/api/app-meta' && request.method === 'GET') {
      return stateStub(env).fetch('https://telegram-state/owner-meta');
    }
    if (url.pathname === '/api/owner/action-log' && request.method === 'GET') {
      if (!await ownerAuthorized(request, env)) return json({ error: 'Unauthorized' }, 401);
      return stateStub(env).fetch('https://telegram-state/owner-action-log');
    }
    if (url.pathname === '/api/owner/generation' && request.method === 'PUT') {
      if (!await ownerAuthorized(request, env)) return json({ error: 'Unauthorized' }, 401);
      return stateStub(env).fetch('https://telegram-state/owner-generation', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: await request.text() });
    }

    if (url.pathname === '/api/presence' && request.method === 'POST') {
      const headers = new Headers();
      const authorization = request.headers.get('authorization');
      if (authorization) headers.set('authorization', authorization);
      return stateStub(env).fetch('https://telegram-state/owner-presence', { method: 'POST', headers });
    }

    if (url.pathname === '/api/health') {
      return json({
        ok: true,
        app: 'myhabbit',
        version: APP_VERSION,
        telegramConfigured: Boolean(env.TELEGRAM_BOT_TOKEN),
        webhookSecretMode: env.TELEGRAM_WEBHOOK_SECRET ? 'cloudflare-secret' : 'automatic',
        time: new Date().toISOString()
      });
    }

    if (url.pathname === '/api/telegram/webhook') {
      if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
      if (!env.TELEGRAM_BOT_TOKEN) return json({ error: 'Telegram bot token is not configured' }, 503);
      const expectedSecret = await telegramWebhookSecret(env, url.origin);
      const secret = request.headers.get('x-telegram-bot-api-secret-token');
      if (!expectedSecret || secret !== expectedSecret) return json({ error: 'Unauthorized' }, 401);
      const update = await request.json().catch(() => ({}));
      update._appUrl = url.origin;
      return stateStub(env).fetch('https://telegram-state/webhook', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(update)
      });
    }

    if (url.pathname === '/api/telegram/bootstrap') {
      if (!['GET', 'POST'].includes(request.method)) return json({ error: 'Method not allowed' }, 405);
      if (request.method === 'POST') {
        const supplied = request.headers.get('x-myhabbit-bootstrap-secret') || '';
        if (!env.TELEGRAM_BOOTSTRAP_SECRET || supplied !== env.TELEGRAM_BOOTSTRAP_SECRET) return json({ error: 'Unauthorized' }, 401);
      }
      const result = await bootstrapTelegramBot(env, url.origin, { force: request.method === 'POST' });
      return json({
        ...result,
        botUsername: result.username || text(env.TELEGRAM_BOT_USERNAME, 80).replace(/^@/, ''),
        telegramFirst: true,
        version: APP_VERSION
      }, result.ready ? 200 : 503);
    }

    if (url.pathname === '/api/telegram/config') {
      const result = await bootstrapTelegramBot(env, url.origin);
      return json({
        ...result,
        botUsername: result.username || text(env.TELEGRAM_BOT_USERNAME, 80).replace(/^@/, ''),
        telegramFirst: true,
        version: APP_VERSION
      }, result.ready ? 200 : 503);
    }

    const familyRoutes = {
      '/api/family/create': ['/family-create', 'POST'],
      '/api/family/join': ['/family-join', 'POST'],
      '/api/family/telegram-join': ['/family-telegram-join', 'POST'],
      '/api/family/telegram-resume': ['/family-telegram-resume', 'POST'],
      '/api/family/invite': ['/family-invite', 'POST'],
      '/api/family/invite-info': ['/family-invite-info', 'POST'],
      '/api/family/invite-join': ['/family-invite-join', 'POST'],
      '/api/family/state': ['/family-state', request.method],
      '/api/family/daily-submit': ['/daily-submit', 'POST'],
      '/api/family/daily-gift-status': ['/daily-gift-status', 'GET'],
      '/api/family/daily-gift-claim': ['/daily-gift-claim', 'POST'],
      '/api/admin/reset-user': ['/admin-reset-user', 'POST'],
      '/api/admin/kick-user': ['/admin-kick-user', 'POST'],
      '/api/admin/grant-coins': ['/admin-grant-coins', 'POST'],
      '/api/family/transfer-coins': ['/family-transfer-coins', 'POST'],
      '/api/family/leave': ['/family-leave', 'POST'],
      '/api/family/reset-session': ['/family-reset-session', 'POST']
    };
    const familyRoute = familyRoutes[url.pathname];
    if (familyRoute) {
      const [path, method] = familyRoute;
      if (!['GET','PUT','POST'].includes(request.method) || request.method !== method) return json({ error: 'Method not allowed' }, 405);
      const headers = new Headers();
      const authorization = request.headers.get('authorization');
      if (authorization) headers.set('authorization', authorization);
      const clientIp = request.headers.get('cf-connecting-ip');
      if (clientIp) headers.set('x-client-ip', clientIp);
      if (request.headers.get('content-type')) headers.set('content-type', request.headers.get('content-type'));
      return stateStub(env).fetch(`https://telegram-state${path}`, { method, headers, body: ['POST','PUT'].includes(method) ? await request.text() : undefined });
    }

    const telegramRoutes = {
      '/api/telegram/register': ['/register', 'POST'],
      '/api/telegram/settings': ['/settings', 'PUT'],
      '/api/telegram/status': ['/status', 'GET'],
      '/api/telegram/link-code': ['/link-code', 'POST'],
      '/api/telegram/launch-ticket': ['/launch-ticket', 'POST'],
      '/api/telegram/session': ['/session', 'POST'],
      '/api/telegram/claim': ['/claim', 'POST'],
      '/api/telegram/pwa-code': ['/pwa-code', 'POST']
    };
    if (url.pathname === '/api/sync/state') {
      if (!['GET', 'PUT'].includes(request.method)) return json({ error: 'Method not allowed' }, 405);
      const headers = new Headers();
      const authorization = request.headers.get('authorization');
      if (authorization) headers.set('authorization', authorization);
      if (request.headers.get('content-type')) headers.set('content-type', request.headers.get('content-type'));
      return stateStub(env).fetch('https://telegram-state/sync-state', {
        method: request.method,
        headers,
        body: request.method === 'PUT' ? await request.text() : undefined
      });
    }

    const telegramRoute = telegramRoutes[url.pathname];
    if (telegramRoute) {
      const [path, method] = telegramRoute;
      if (request.method !== method) return json({ error: 'Method not allowed' }, 405);
      const headers = new Headers();
      const authorization = request.headers.get('authorization');
      if (authorization) headers.set('authorization', authorization);
      if (request.headers.get('content-type')) headers.set('content-type', request.headers.get('content-type'));
      return stateStub(env).fetch(`https://telegram-state${path}`, { method, headers, body: ['POST', 'PUT'].includes(method) ? await request.text() : undefined });
    }

    // myHabbit intentionally has no external food database or barcode API.

    return env.ASSETS.fetch(request);
  },

  async scheduled(_controller, env, ctx) {
    ctx.waitUntil(stateStub(env).fetch('https://telegram-state/dispatch', { method: 'POST' }));
    ctx.waitUntil(stateStub(env).fetch('https://telegram-state/process-due-families', { method: 'POST' }));
    const appUrl = validAppUrl(env.APP_URL);
    if (appUrl) ctx.waitUntil(bootstrapTelegramBot(env, appUrl));
  }
};
