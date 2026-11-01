// Session UTM for template_opened and prompt_copied. Landing query wins per field;
// anything already stored for this tab fills the fields the URL does not set.
export const UTM_STORAGE_KEY = 'gbp_utm';
export const UTM_FIELDS = ['utm_source', 'utm_campaign'];
export const UTM_EVENTS = ['template_opened', 'prompt_copied'];

export function utmFromSearch(search) {
  const text = String(search || '');
  const params = new URLSearchParams(text.charAt(0) === '?' ? text.slice(1) : text);
  const out = {};
  for (var i = 0; i < UTM_FIELDS.length; i++) {
    const key = UTM_FIELDS[i];
    const value = (params.get(key) || '').trim().slice(0, 200);
    if (value) out[key] = value;
  }
  return out;
}

function readStored(storage) {
  if (!storage || typeof storage.getItem !== 'function') return {};
  try {
    const raw = storage.getItem(UTM_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    const out = {};
    for (var i = 0; i < UTM_FIELDS.length; i++) {
      const key = UTM_FIELDS[i];
      if (typeof parsed[key] === 'string' && parsed[key].trim()) out[key] = parsed[key].trim();
    }
    return out;
  } catch (e) {
    return {};
  }
}

export function captureUtm(search, storage) {
  const incoming = utmFromSearch(search);
  const stored = readStored(storage);
  const next = {};
  for (var i = 0; i < UTM_FIELDS.length; i++) {
    const key = UTM_FIELDS[i];
    const value = incoming[key] || stored[key] || '';
    if (value) next[key] = value;
  }
  if (storage && typeof storage.setItem === 'function' && Object.keys(incoming).length) {
    try { storage.setItem(UTM_STORAGE_KEY, JSON.stringify(next)); } catch (e) {}
  }
  return next;
}

// Adds utm_source and utm_campaign onto the two page events when the session has them.
export function withUtm(name, props, utm) {
  const body = props || {};
  if (!UTM_EVENTS.includes(name) || !utm) return body;
  const next = {};
  for (const key in body) {
    if (Object.prototype.hasOwnProperty.call(body, key)) next[key] = body[key];
  }
  let changed = false;
  if (utm.utm_source) { next.utm_source = utm.utm_source; changed = true; }
  if (utm.utm_campaign) { next.utm_campaign = utm.utm_campaign; changed = true; }
  return changed ? next : body;
}
