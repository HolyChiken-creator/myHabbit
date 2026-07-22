const APP_VERSION = '2.9.0-multi-account';
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
          { command: 'start', description: 'Відкрити меню myHabbit' },
          { command: 'code', description: 'Код для підключення нової PWA' },
          { command: 'devices', description: 'Показати підключені PWA' },
          { command: 'status', description: 'Статус нагадувань' },
          { command: 'water', description: 'Статус води' },
          { command: 'pause', description: 'Призупинити нагадування' },
          { command: 'resume', description: 'Увімкнути нагадування' },
          { command: 'version', description: 'Перевірити версію бота' },
          { command: 'help', description: 'Допомога' }
        ]
      });
    } catch (error) {
      warnings.push(`commands: ${error.message}`);
    }

    try {
      await telegramCall(env, 'setChatMenuButton', {
        menu_button: {
          type: 'web_app',
          text: 'myHabbit',
          web_app: { url: origin }
        }
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

export class TelegramState {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    const url = new URL(request.url);
    try {
      if (url.pathname === '/family-create' && request.method === 'POST') return this.familyCreate(await request.json());
      if (url.pathname === '/family-join' && request.method === 'POST') return this.familyJoin(await request.json());
      if (url.pathname === '/family-telegram-join' && request.method === 'POST') return this.familyTelegramJoin(await request.json());
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
      return json({ error: 'Not found' }, 404);
    } catch (error) {
      console.error(error);
      return json({ error: error.message || 'Internal error' }, error.status || 500);
    }
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
    return { user, family };
  }

  async familyCreate(payload) {
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
      family: { id: familyId, name: familyName, code, level: 1, xp: 0, coins: 0 }, currentUserId: userId,
      users: [{ id:userId,name:memberName,gender,avatar,level:1,xp:0,coins:0,streak:0,skills:{home:1,care:1,health:1,growth:1,finance:1},achievements:[],activity:[] }],
      quests: [], shop: [], achievements: [], history: [], calories:{calories:0,protein:0,fat:0,carbs:0}
    };
    const family = { id: familyId, name: familyName, code, pinHash: await sha256(pin), memberIds: [userId], state: initialState, revision: 1, updatedAt: now };
    await this.state.storage.put(`fq-family:${familyId}`, family);
    await this.state.storage.put(`fq-code:${code}`, familyId);
    await this.state.storage.put(`fq-user:${userId}`, user);
    return json({ token:`fq.${userId}.${secret}`, userId, familyCode:code, state:initialState });
  }

  async familyJoin(payload) {
    const code = text(payload?.code, 12).toUpperCase().replace(/[^A-Z0-9]/g, '');
    const memberName = text(payload?.name, 50);
    const gender = ['male', 'female', 'neutral'].includes(payload?.gender) ? payload.gender : 'neutral';
    const pin = text(payload?.pin, 8).replace(/\D/g, '');
    const familyId = await this.state.storage.get(`fq-code:${code}`);
    const family = familyId ? await this.state.storage.get(`fq-family:${familyId}`) : null;
    if (!family || family.pinHash !== await sha256(pin)) return json({ error: 'Невірний код сім’ї або PIN' }, 401);
    if ((family.memberIds || []).length >= 5) return json({ error: 'У сім’ї вже максимальні 5 учасників' }, 409);
    const userId = crypto.randomUUID();
    const secret = randomText(24);
    const avatar = gender === 'female' ? '👩🏻' : gender === 'male' ? '🧑🏻' : '🙂';
    const user = { id:userId,familyId,name:memberName,gender,avatar,role:'member',tokenHash:await sha256(secret),createdAt:new Date().toISOString() };
    family.memberIds = [...(family.memberIds || []), userId];
    family.state.users.push({id:userId,name:memberName,gender,avatar,level:1,xp:0,coins:0,streak:0,skills:{home:1,care:1,health:1,growth:1,finance:1},achievements:[],activity:[]});
    family.revision = Number(family.revision || 0) + 1;
    family.updatedAt = new Date().toISOString();
    await this.state.storage.put(`fq-user:${userId}`, user);
    await this.state.storage.put(`fq-family:${familyId}`, family);
    return json({ token:`fq.${userId}.${secret}`, userId, familyCode:code, state:{...family.state,currentUserId:userId} });
  }

  async familyTelegramJoin(payload) {
    const verified = await verifyTelegramInitData(payload?.initData, this.env.TELEGRAM_BOT_TOKEN);
    const telegramUserId = String(verified.user.id);
    const code = text(payload?.code, 12).toUpperCase().replace(/[^A-Z0-9]/g, '');
    const pin = text(payload?.pin, 8).replace(/\D/g, '');
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
      if ((family.memberIds || []).length >= 5) return json({ error: 'У сімʼї вже максимальні 5 учасників' }, 409);
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
        telegramUsername:text(verified.user.username,64),level:1,xp:0,coins:0,streak:0,
        skills:{home:1,care:1,health:1,growth:1,finance:1},achievements:[],activity:[]
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


  async familyCreateInvite(request, payload) {
    const auth = await this.familyAuthorize(request);
    if (!auth) return json({ error: 'Недійсна сімейна сесія' }, 401);
    if (!['owner', 'admin'].includes(auth.user.role)) return json({ error: 'Лише адміністратор може створювати запрошення' }, 403);
    if ((auth.family.memberIds || []).length >= 5) return json({ error: 'У сімʼї вже максимальні 5 учасників' }, 409);
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
    return json({ valid: true, familyName: family.name, expiresAt: invite.expiresAt, spotsLeft: Math.max(0, 5 - (family.memberIds || []).length) });
  }

  async familyInviteJoin(payload) {
    const token = text(payload?.token, 80);
    const invite = token ? await this.state.storage.get(`fq-invite:${token}`) : null;
    if (!invite || invite.revoked || Number(invite.expiresAt) <= Date.now() || Number(invite.uses || 0) >= Number(invite.maxUses || 1)) {
      return json({ error: 'Запрошення недійсне або вже використане' }, 410);
    }
    const family = await this.state.storage.get(`fq-family:${invite.familyId}`);
    if (!family) return json({ error: 'Сімʼю не знайдено' }, 404);
    if ((family.memberIds || []).length >= 5) return json({ error: 'У сімʼї вже максимальні 5 учасників' }, 409);
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
    family.state.users.push({id:userId,name:memberName,gender,avatar,role:'member',telegramLinked:Boolean(telegramUserId),telegramUsername:text(verified?.user?.username,64),level:1,xp:0,coins:0,streak:0,skills:{home:1,care:1,health:1,growth:1,finance:1},achievements:[],activity:['Приєднався за теплим запрошенням']});
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
    const next = payload?.state;
    if (!next || typeof next !== 'object') return json({ error: 'Некоректний стан' }, 400);
    const serialized = JSON.stringify(next);
    if (serialized.length > 700000) return json({ error: 'Стан сім’ї завеликий' }, 413);
    const allowedUser = (next.users || []).some((item) => item.id === auth.user.id);
    if (!allowedUser) return json({ error: 'Профіль користувача відсутній у стані' }, 400);
    auth.family.state = { ...next, currentUserId: auth.family.state.currentUserId || auth.user.id };
    auth.family.revision = Number(auth.family.revision || 0) + 1;
    auth.family.updatedAt = new Date().toISOString();
    await this.state.storage.put(`fq-family:${auth.family.id}`, auth.family);
    return json({ revision:auth.family.revision, updatedAt:auth.family.updatedAt });
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

  mainKeyboard(user) {
    const enabledLabel = user.enabled === false ? '▶️ Увімкнути нагадування' : '⏸ Призупинити нагадування';
    return {
      keyboard: [
        [{ text: '🔗 Підключити PWA' }, { text: '📱 Мої PWA' }],
        [{ text: '💧 Вода' }, { text: '🔔 Нагадування' }],
        [{ text: '🌿 Відкрити застосунок' }],
        [{ text: enabledLabel }, { text: '❓ Допомога' }]
      ],
      resize_keyboard: true,
      is_persistent: true,
      input_field_placeholder: 'Оберіть дію або напишіть повідомлення'
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

  async deviceListText(user) {
    const devices = publicDevices(user);
    const address = greeting(user);
    if (!devices.length) {
      return `📱 <b>${address[0].toUpperCase()}${address.slice(1)}, PWA ще не підключено.</b>\n\nНатисніть «🔗 Підключити PWA», а потім введіть отриманий код у встановленому застосунку.`;
    }
    const lines = devices.map((device, index) => {
      let seen = 'нещодавно';
      try {
        seen = new Intl.DateTimeFormat('uk-UA', { timeZone: user.timezone || 'Europe/Kyiv', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(device.lastSeenAt));
      } catch {}
      return `${index + 1}. <b>${escapeHtml(device.name)}</b> · активність ${escapeHtml(seen)}`;
    });
    return `📱 <b>Ваші підключені PWA: ${devices.length}</b>\n\n${lines.join('\n')}\n\nУсі вони працюють з однією сесією <code>${String(user.id).slice(0, 8).toUpperCase()}</code>. Для другого телефона отримайте окремий новий код.`;
  }

  async waterStatusText(user) {
    const record = await this.state.storage.get(`app:${user.id}`);
    let local;
    try { local = localClock(new Date(), user.timezone || 'Europe/Kyiv'); } catch { local = localClock(new Date(), 'Europe/Kyiv'); }
    const current = Math.round(number(record?.state?.days?.[local.date]?.waterMl));
    const goal = Math.round(user.waterGoalMl || record?.state?.goals?.water || 2000);
    const remaining = Math.max(0, goal - current);
    const address = greeting(user);
    return `💧 <b>${address[0].toUpperCase()}${address.slice(1)}, сьогодні записано ${current} мл із ${goal} мл.</b>\n\n${remaining ? `До орієнтовної цілі залишилося <b>${remaining} мл</b>. Пийте комфортними порціями протягом дня.` : 'Денну орієнтовну ціль уже досягнуто. Не потрібно пити через силу.'}`;
  }

  miniAppButton(user, ticket) {
    // Inline Web App buttons work without a separately configured Main Mini App.
    // The opaque ticket points to one exact PWA session and is also checked against
    // the verified Telegram user id on the server.
    return {
      text: '🌿 Открыть myHabbit',
      web_app: { url: `${user.appUrl}/?telegram=1${ticket ? `&sw_session=${encodeURIComponent(ticket)}` : ''}` }
    };
  }

  async webhook(update) {
    const message = update?.message;
    const chatId = message?.chat?.id;
    const command = text(message?.text, 300);
    if (!chatId || !command) return json({ ok: true });

    const appUrl = validAppUrl(update?._appUrl) || validAppUrl(this.env.APP_URL);
    let user = await this.ensureTelegramUser(chatId, message?.from || {}, appUrl);
    const normalized = command.toLocaleLowerCase('uk-UA').trim();
    const isMaleChoice = /^(👨\s*)?(я\s*)?(чоловік|мужчина|пане|пан)$/iu.test(normalized);
    const isFemaleChoice = /^(👩\s*)?(я\s*)?(жінка|женщина|пані)$/iu.test(normalized);

    if (/^\/version\b/i.test(command) || normalized === 'версія' || normalized === 'версия') {
      await telegramCall(this.env, 'sendMessage', {
        chat_id: chatId,
        parse_mode: 'HTML',
        text: `✅ <b>myHabbit Bot ${APP_VERSION}</b>\n\nЯкщо ви бачите це повідомлення, новий Worker і webhook уже активні.`
      });
      return json({ ok: true, version: APP_VERSION });
    }

    if (isMaleChoice || isFemaleChoice) {
      user = {
        ...user,
        gender: isFemaleChoice ? 'female' : 'male',
        salutation: isFemaleChoice ? 'pani' : 'pan',
        updatedAt: new Date().toISOString()
      };
      await this.state.storage.put(`user:${user.id}`, user);
      const code = await this.createPwaClaim(user);
      await this.sendBotMessage(chatId, user, `✅ <b>Дякую, ${greeting(user)}.</b>\n\nТепер я звертатимусь до вас правильно. Я працюю без AI: пояснюю дії, надсилаю ваш раціон, нагадую про воду та ментальну паузу.\n\nКод для підключення першої PWA: <code>${code}</code>\nВін діє 10 хвилин і використовується один раз.`);
      return json({ ok: true });
    }

    if (!user.gender) {
      await telegramCall(this.env, 'sendMessage', {
        chat_id: chatId,
        parse_mode: 'HTML',
        text: '🌿 <b>Вітаю у myHabbit.</b>\n\nЯ допоможу підключити PWA, поясню статус синхронізації та надсилатиму зрозумілі нагадування.\n\nСпочатку оберіть, як до вас звертатися:',
        reply_markup: this.genderKeyboard()
      });
      return json({ ok: true });
    }

    const wantsCode = /^\/(code|connect|login)\b/i.test(command)
      || normalized.includes('підключити pwa')
      || normalized.includes('подключить pwa')
      || normalized === 'код'
      || normalized.includes('новий код')
      || normalized.includes('новый код');

    if (/^\/start\b/i.test(command) || wantsCode) {
      const code = await this.createPwaClaim(user);
      const count = pwaDeviceCount(user);
      const next = count + 1;
      const ticket = await this.createLaunchTicket(user);
      await this.sendBotMessage(chatId, user, `🟢 <b>myHabbit Bot ${APP_VERSION}</b>\n\n🔗 <b>${greeting(user)[0].toUpperCase()}${greeting(user).slice(1)}, код для PWA №${next} готовий.</b>\n\n<code>${code}</code>\n\n1. Відкрийте myHabbit на потрібному телефоні.\n2. Перейдіть «Профіль → Telegram».\n3. Введіть цей код.\n\nКод діє <b>10 хвилин</b> і використовується один раз. Уже підключені PWA не відключаться.`, user.appUrl ? {
        reply_markup: {
          inline_keyboard: [[this.miniAppButton(user, ticket)]]
        }
      } : {});
      // Restore the persistent menu after the inline message.
      await this.sendBotMessage(chatId, user, `Зараз підключено PWA: <b>${count}</b>. Після успішного входу я одразу підтверджу новий пристрій повідомленням.`);
      return json({ ok: true });
    }

    if (/^\/(devices|pwa)\b/i.test(command) || normalized.includes('мої pwa') || normalized.includes('мои pwa') || normalized.includes('пристрої') || normalized.includes('устройства')) {
      await this.sendBotMessage(chatId, user, await this.deviceListText(user));
      return json({ ok: true });
    }

    if (/^\/pause\b/i.test(command) || normalized.includes('призупинити нагадування') || normalized.includes('приостановить напоминания')) {
      user.enabled = false;
      user.updatedAt = new Date().toISOString();
      await this.state.storage.put(`user:${user.id}`, user);
      await this.sendBotMessage(chatId, user, `⏸ <b>Готово, ${greeting(user)}.</b>\n\nАвтоматичні нагадування призупинено. Сесія, щоденник і синхронізація між PWA продовжують працювати.`);
      return json({ ok: true });
    }

    if (/^\/resume\b/i.test(command) || normalized.includes('увімкнути нагадування') || normalized.includes('включить напоминания') || normalized.includes('відновити нагадування')) {
      user.enabled = true;
      user.updatedAt = new Date().toISOString();
      await this.state.storage.put(`user:${user.id}`, user);
      await this.sendBotMessage(chatId, user, `▶️ <b>Нагадування знову активні, ${greeting(user)}.</b>\n\nЯ напишу у встановлений час про раціон, воду та ментальну паузу.`);
      return json({ ok: true });
    }

    if (/^\/status\b/i.test(command) || normalized.includes('нагадування') || normalized.includes('напоминания')) {
      const status = user.enabled === false ? 'призупинені' : 'активні';
      await this.sendBotMessage(chatId, user, `🔔 <b>${greeting(user)[0].toUpperCase()}${greeting(user).slice(1)}, нагадування ${status}.</b>\n\nСніданок — ${escapeHtml(user.times?.breakfast || '08:00')}\nВода — ${escapeHtml(user.times?.waterMorning || '10:30')} і ${escapeHtml(user.times?.waterAfternoon || '16:00')}\nОбід — ${escapeHtml(user.times?.lunch || '13:00')}\nВечеря — ${escapeHtml(user.times?.dinner || '19:00')}\nМентальна пауза — ${escapeHtml(user.times?.mental || '21:00')}\n\nПідключено PWA: <b>${pwaDeviceCount(user)}</b>.`);
      return json({ ok: true });
    }

    if (/^\/water\b/i.test(command) || normalized === '💧 вода' || normalized.includes('скільки води') || normalized.includes('сколько воды')) {
      await this.sendBotMessage(chatId, user, await this.waterStatusText(user));
      return json({ ok: true });
    }

    if (/^\/(open|app)\b/i.test(command) || normalized.includes('відкрити застосунок') || normalized.includes('открыть приложение')) {
      const ticket = await this.createLaunchTicket(user);
      if (!user.appUrl) {
        await this.sendBotMessage(chatId, user, 'Mini App ще не налаштовано на адресу застосунку. Спочатку виконайте деплой та відкрийте бот з оновленого проєкту.');
      } else {
        await telegramCall(this.env, 'sendMessage', {
          chat_id: chatId,
          parse_mode: 'HTML',
          text: `🌿 <b>Відкриваю вашу спільну сесію, ${greeting(user)}.</b>\n\nКнопка нижче завжди веде до того самого Telegram-акаунта та спільного щоденника.`,
          reply_markup: { inline_keyboard: [[this.miniAppButton(user, ticket)]] }
        });
        await this.sendBotMessage(chatId, user, 'Після закриття Mini App меню бота залишиться доступним нижче.');
      }
      return json({ ok: true });
    }

    if (/^\/(help|menu)\b/i.test(command) || normalized.includes('допомога') || normalized.includes('помощь')) {
      await this.sendBotMessage(chatId, user, `❓ <b>myHabbit Bot ${APP_VERSION}</b>\n\n<b>Що я вмію, ${greeting(user)}:</b>\n\n🔗 <b>Підключити PWA</b> — створюю окремий код для кожного телефона.\n📱 <b>Мої PWA</b> — показую всі підключені пристрої.\n💧 <b>Вода</b> — показую записаний обсяг і денну ціль.\n🔔 <b>Нагадування</b> — показую розклад та дозволяю призупинити його.\n🌿 <b>Відкрити застосунок</b> — запускаю Mini App у спільній сесії.\n\nЯ працюю без генеративного AI — відповіді та дії визначені заздалегідь, тому дані не вигадуються.`);
      return json({ ok: true });
    }

    await this.sendBotMessage(chatId, user, `Я вас почув, ${greeting(user)}. Я працюю без AI, тому виконую конкретні команди й кнопки. Оберіть потрібну дію в меню нижче або напишіть: «код», «вода», «пристрої», «нагадування».`);
    return json({ ok: true });
  }

  async dispatch() {
    const users = await this.state.storage.list({ prefix: 'user:' });
    const now = new Date();
    let sent = 0;
    for (const user of users.values()) {
      if (!user.enabled || !user.chatId) continue;
      let local;
      try { local = localClock(now, user.timezone || 'Europe/Kyiv'); } catch { local = localClock(now, 'Europe/Kyiv'); }
      const schedule = {
        breakfast: user.times?.breakfast,
        lunch: user.times?.lunch,
        dinner: user.times?.dinner,
        waterMorning: user.times?.waterMorning,
        waterAfternoon: user.times?.waterAfternoon,
        mental: user.times?.mental
      };
      for (const [type, time] of Object.entries(schedule)) {
        if (time !== local.time) continue;
        const sentKey = `sent:${user.id}:${local.date}:${type}`;
        if (await this.state.storage.get(sentKey)) continue;
        try {
          await telegramCall(this.env, 'sendMessage', {
            chat_id: user.chatId,
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            text: messageFor(user, type, local.date)
          });
          await this.state.storage.put(sentKey, now.toISOString());
          sent += 1;
        } catch (error) {
          console.error('Telegram send failed', user.id, type, error.message);
          if (error.status === 403) {
            user.enabled = false;
            user.lastError = 'Bot blocked or chat unavailable';
            user.updatedAt = new Date().toISOString();
            await this.state.storage.put(`user:${user.id}`, user);
          }
        }
      }
    }
    await this.cleanupSentKeys(now);
    return json({ ok: true, sent });
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

const stateStub = (env) => env.TELEGRAM_STATE.get(env.TELEGRAM_STATE.idFromName('global'));

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

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
      '/api/family/invite': ['/family-invite', 'POST'],
      '/api/family/invite-info': ['/family-invite-info', 'POST'],
      '/api/family/invite-join': ['/family-invite-join', 'POST'],
      '/api/family/state': ['/family-state', request.method],
      '/api/family/daily-submit': ['/daily-submit', 'POST'],
      '/api/family/daily-gift-status': ['/daily-gift-status', 'GET'],
      '/api/family/daily-gift-claim': ['/daily-gift-claim', 'POST'],
      '/api/admin/sync-status': ['/admin-sync-status', 'GET'],
      '/api/admin/process-now': ['/admin-process-now', 'POST'],
      '/api/admin/reset-user': ['/admin-reset-user', 'POST'],
      '/api/family/reset-session': ['/family-reset-session', 'POST']
    };
    const familyRoute = familyRoutes[url.pathname];
    if (familyRoute) {
      const [path, method] = familyRoute;
      if (!['GET','PUT','POST'].includes(request.method) || request.method !== method) return json({ error: 'Method not allowed' }, 405);
      const headers = new Headers();
      const authorization = request.headers.get('authorization');
      if (authorization) headers.set('authorization', authorization);
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
