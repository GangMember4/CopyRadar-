(function () {
  'use strict';

  const STORAGE_KEY = 'copyradar_results';

  const RADAR_ID = 'radar';
  const CTA_BLOCK = 'cta-block';
  const SEARCH_BLOCK = 'search-block';
  const RESULT_BLOCK = 'result-block';
  const RESULT_CONTENT = 'result-content';
  const WALLET_INPUT = 'wallet-input';
  const WALLET_HINT = 'wallet-hint';
  const BTN_SEARCH_CTA = 'btn-search-cta';
  const BTN_SEARCH = 'btn-search';
  const BTN_BACK = 'btn-back';
  const BTN_SHOW_TRADERS = 'btn-show-traders';
  const BTN_NEW_SEARCH = 'btn-new-search';
  const MODAL = 'modal';
  const MODAL_BACKDROP = 'modal-backdrop';
  const MODAL_CLOSE = 'modal-close';

  const SOLANA_BASE58 = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

  function getStoredResults() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (_) {
      return {};
    }
  }

  function setStoredResult(wallet, result) {
    const data = getStoredResults();
    data[wallet] = result;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (_) {}
  }

  function isValidSolanaAddress(value) {
    const s = (value || '').trim();
    return s.length >= 32 && s.length <= 44 && SOLANA_BASE58.test(s);
  }

  function getOrCreateResult(wallet) {
    const stored = getStoredResults();
    if (stored[wallet] !== undefined) {
      return stored[wallet];
    }
    const hasTraders = Math.random() >= 0.5;
    const count = hasTraders ? Math.floor(Math.random() * 12) + 1 : 0;
    const result = { hasTraders, count };
    setStoredResult(wallet, result);
    return result;
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function show(blockId) {
    byId(blockId).classList.remove('hidden');
  }

  function hide(blockId) {
    byId(blockId).classList.add('hidden');
  }

  function showCta() {
    hide(SEARCH_BLOCK);
    hide(RESULT_BLOCK);
    show(CTA_BLOCK);
  }

  function showSearch() {
    hide(CTA_BLOCK);
    hide(RESULT_BLOCK);
    show(SEARCH_BLOCK);
    byId(WALLET_INPUT).value = '';
    byId(WALLET_HINT).textContent = '';
    byId(WALLET_INPUT).classList.remove('error');
    byId(WALLET_INPUT).focus();
  }

  function showResult(result) {
    hide(CTA_BLOCK);
    hide(SEARCH_BLOCK);
    show(RESULT_BLOCK);

    const content = byId(RESULT_CONTENT);
    const btnShow = byId(BTN_SHOW_TRADERS);

    if (result.hasTraders && result.count > 0) {
      content.innerHTML = 'You have <span class="count">' + result.count + '</span> copy trader' + (result.count === 1 ? '' : 's') + '.';
      btnShow.classList.remove('hidden');
    } else {
      content.textContent = 'No copy traders found for this wallet.';
      btnShow.classList.add('hidden');
    }
  }

  function openModal() {
    byId(MODAL).classList.remove('hidden');
  }

  function closeModal() {
    byId(MODAL).classList.add('hidden');
  }

  byId(BTN_SEARCH_CTA).addEventListener('click', showSearch);

  byId(BTN_BACK).addEventListener('click', showCta);

  byId(WALLET_INPUT).addEventListener('input', function () {
    const hint = byId(WALLET_HINT);
    const input = byId(WALLET_INPUT);
    const v = (input.value || '').trim();
    input.classList.remove('error');
    if (!v) {
      hint.textContent = '';
      hint.className = 'input-hint';
      return;
    }
    if (isValidSolanaAddress(v)) {
      hint.textContent = 'Valid Solana address';
      hint.className = 'input-hint ok';
    } else {
      hint.textContent = 'Enter a valid Solana wallet address (32–44 characters, base58)';
      hint.className = 'input-hint error';
    }
  });

  byId(BTN_SEARCH).addEventListener('click', function () {
    const raw = (byId(WALLET_INPUT).value || '').trim();
    const hint = byId(WALLET_HINT);
    const input = byId(WALLET_INPUT);

    if (!isValidSolanaAddress(raw)) {
      input.classList.add('error');
      hint.textContent = 'Please enter a valid Solana wallet address.';
      hint.className = 'input-hint error';
      return;
    }

    const result = getOrCreateResult(raw);
    showResult(result);
  });

  byId(BTN_SHOW_TRADERS).addEventListener('click', openModal);

  byId(BTN_NEW_SEARCH).addEventListener('click', showSearch);

  byId(MODAL_CLOSE).addEventListener('click', closeModal);
  byId(MODAL_BACKDROP).addEventListener('click', closeModal);
})();
