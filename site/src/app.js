// grokbotpages.com: category filter, copy buttons, and Agent Analytics clicks. No dependencies.
(function () {
  var data = {};
  var el = document.getElementById('site-data');
  if (el) { try { data = JSON.parse(el.textContent); } catch (e) {} }

  // Copy with the Clipboard API, falling back to a hidden textarea.
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(function () { return legacy(text); });
    }
    return legacy(text);
  }
  function legacy(text) {
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      var ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
      ok ? resolve() : reject(new Error('copy failed'));
    });
  }
  var live = document.getElementById('live');
  function announce(msg) { if (live) { live.textContent = ''; setTimeout(function () { live.textContent = msg; }, 30); } }

  // window.aa.track is the Agent Analytics snippet API (https://docs.agentanalytics.sh/reference/tracker-js/).
  // The tracker is async, so calls made before it arrives are queued and flushed in order.
  // A missing snippet, a tracker that never loads, and a throwing tracker are all ignored.
  var TRACK_KEYS = ['page_slug', 'position', 'category', 'source', 'target', 'target_url', 'target_type', 'target_slug'];
  var pending = [];
  var PENDING_CAP = 32;
  var watching = false;
  var gaveUp = false;
  var watchTimer = null;
  function aaReady() { return !!(window.aa && typeof window.aa.track === 'function'); }
  function flushPending() {
    if (!aaReady()) return false;
    var batch = pending;
    pending = [];
    for (var i = 0; i < batch.length; i++) {
      try { window.aa.track(batch[i].name, batch[i].props); } catch (e) {}
    }
    return true;
  }
  function abandon() {
    gaveUp = true;
    pending = [];
    if (watchTimer) { clearInterval(watchTimer); watchTimer = null; }
  }
  function watchAa() {
    if (watching || gaveUp) return;
    watching = true;
    var script = document.querySelector('script[src*="agentanalytics.sh/tracker.js"]');
    if (script) {
      script.addEventListener('load', flushPending);
      script.addEventListener('error', abandon);
    }
    var tries = 0;
    watchTimer = setInterval(function () {
      if (flushPending() || ++tries >= 100) {
        clearInterval(watchTimer);
        watchTimer = null;
        if (!aaReady()) abandon();
      }
    }, 50);
  }
  function readParams(node) {
    var props = {};
    for (var i = 0; i < TRACK_KEYS.length; i++) {
      var key = TRACK_KEYS[i];
      var val = node.getAttribute('data-' + key.replace(/_/g, '-'));
      if (val !== null && val !== '') props[key] = val;
    }
    return props;
  }
  function track(name, props) {
    var body = props || {};
    try {
      if (aaReady()) { window.aa.track(name, body); return; }
      // window.aa without track is unusable. After the wait, further calls no-op.
      if (window.aa || gaveUp || pending.length >= PENDING_CAP) return;
      pending.push({ name: name, props: body });
      watchAa();
    } catch (e) {}
  }
  function visibleCount() { return document.querySelectorAll('[data-cats]:not([hidden])').length; }

  document.addEventListener('click', function (ev) {
    var btn = ev.target.closest('[data-copy]');
    if (btn) {
      var key = btn.getAttribute('data-copy');
      var text = key === 'snippet' ? data.snippet : (data.prompts || {})[key];
      if (!text) return;
      var label = btn.getAttribute('data-label') || btn.textContent;
      btn.setAttribute('data-label', label);
      copyText(text).then(function () {
        btn.textContent = 'Copied'; btn.classList.add('done');
        announce((key === 'snippet' ? 'Snippet' : 'Prompt') + ' copied to clipboard');
        return true;
      }, function () {
        btn.textContent = 'Press Ctrl+C'; announce('Copy failed. Select the text and copy it manually.');
        return false;
      }).then(function (success) {
        if (btn.getAttribute('data-track')) {
          var copied = readParams(btn);
          copied.success = success === true;
          track(btn.getAttribute('data-track'), copied);
        }
        setTimeout(function () { btn.textContent = label; btn.classList.remove('done'); }, 1800);
      });
      return;
    }

    var node = ev.target.closest('[data-track]');
    if (!node) return;
    var name = node.getAttribute('data-track');
    if (!name || node.hasAttribute('data-copy')) return;
    // source=link is recorded from fromHash after the filter applies (and after a full
    // navigation to /#c=), so a tag click is not also counted here.
    if (name === 'category_filtered' && node.getAttribute('data-source') === 'link') return;
    var props = readParams(node);
    if (name === 'category_filtered') {
      props.category = props.category || node.getAttribute('data-filter') || '';
      props.source = props.source || 'click';
      props.results_count = visibleCount();
    }
    track(name, props);
  });

  // Category chips
  var chips = document.querySelectorAll('[data-filter]');
  if (!chips.length) return;
  var cards = document.querySelectorAll('[data-cats]');
  var empty = document.getElementById('empty');
  var status = document.getElementById('filter-status');
  var labels = document.querySelectorAll('[data-all-only]');
  function apply(cat, push) {
    var shown = 0;
    chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c.getAttribute('data-filter') === cat)); });
    cards.forEach(function (card) {
      var on = cat === 'all' || card.getAttribute('data-cats').split(' ').indexOf(cat) !== -1;
      card.hidden = !on; if (on) shown++;
    });
    labels.forEach(function (l) { l.hidden = cat !== 'all'; });
    var name = cat === 'all' ? '' : document.querySelector('[data-filter="' + cat + '"]').getAttribute('data-name');
    if (empty) {
      empty.hidden = shown !== 0;
      var n = empty.querySelector('[data-empty-name]'); if (n) n.textContent = name;
    }
    if (status) status.textContent = cat === 'all' ? 'Showing all ' + shown + ' Pages' : 'Showing ' + shown + (shown === 1 ? ' Page' : ' Pages') + ' in ' + name;
    if (push) history.replaceState(null, '', cat === 'all' ? location.pathname : '#c=' + cat);
  }
  chips.forEach(function (c) { c.addEventListener('click', function () { apply(c.getAttribute('data-filter'), true); }); });
  function fromHash() {
    var m = location.hash.match(/^#c=([a-z0-9-]+)$/);
    if (m && document.querySelector('[data-filter="' + m[1] + '"]')) {
      apply(m[1], false);
      track('category_filtered', { category: m[1], results_count: visibleCount(), source: 'link' });
    }
  }
  window.addEventListener('hashchange', fromHash);
  fromHash();
})();
