// grokpages.com: category filter and copy buttons. No dependencies.
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

  document.addEventListener('click', function (ev) {
    var btn = ev.target.closest('[data-copy]');
    if (!btn) return;
    var key = btn.getAttribute('data-copy');
    var text = key === 'snippet' ? data.snippet : (data.prompts || {})[key];
    if (!text) return;
    var label = btn.getAttribute('data-label') || btn.textContent;
    btn.setAttribute('data-label', label);
    copyText(text).then(function () {
      btn.textContent = 'Copied'; btn.classList.add('done');
      announce((key === 'snippet' ? 'Snippet' : 'Prompt') + ' copied to clipboard');
    }, function () {
      btn.textContent = 'Press Ctrl+C'; announce('Copy failed. Select the text and copy it manually.');
    }).then(function () {
      setTimeout(function () { btn.textContent = label; btn.classList.remove('done'); }, 1800);
    });
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
    if (m && document.querySelector('[data-filter="' + m[1] + '"]')) apply(m[1], false);
  }
  window.addEventListener('hashchange', fromHash);
  fromHash();
})();
