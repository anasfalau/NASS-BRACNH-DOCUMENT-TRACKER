// ================================================================
//  NASS Branch Tracker — AI Chat Panel
//  Loaded dynamically by supabase-init.js after auth succeeds.
//  Requires: window._sb (Supabase client), nassRows in localStorage.
// ================================================================
(function () {
  'use strict';

  const EDGE_URL  = 'https://sblqmpmawkogbbzzkwxt.supabase.co/functions/v1/chat';
  const MAX_HIST  = 12;
  const HIST_KEY  = 'nassAiHistory';
  const STARTERS  = [
    'Which documents are currently overdue?',
    'Summarise workload per officer',
    'List all Active files',
    'Which files are held at CNS?',
    'How many documents are past their SLA?',
    'Show recently received documents',
  ];

  let chatHistory = [];
  let isStreaming  = false;
  let sugHidden    = false;
  let lastUserMsg  = '';

  // ── Build DOM ────────────────────────────────────────────────────
  function buildUI() {
    var fab = document.getElementById('ncp-fab');
    if (!fab) {
      fab = el('button', { id: 'ncp-fab', title: 'NASS AI Assistant' });
      fab.innerHTML = '<span class="ncp-fab-icon">&#129302;</span>';
      document.body.appendChild(fab);
    }
    fab.onclick = togglePanel;

    const panel = el('div', { id: 'ncp-panel' });
    panel.innerHTML = `
      <div class="ncp-header">
        <div class="ncp-header-info">
          <span class="ncp-header-icon">&#129302;</span>
          <div>
            <div class="ncp-title">NASS AI Assistant</div>
            <div class="ncp-subtitle">Ask about files, workload &amp; status</div>
          </div>
        </div>
        <div class="ncp-header-actions">
          <button class="ncp-icon-btn" id="ncp-clear-btn" title="Clear conversation" onclick="window._nassAiClear()">&#128465;</button>
          <button class="ncp-icon-btn" id="ncp-close-btn" title="Close" onclick="window._nassAiClose()">&#10005;</button>
        </div>
      </div>
      <div class="ncp-msgs" id="ncp-msgs"></div>
      <div class="ncp-starters" id="ncp-starters"></div>
      <div class="ncp-input-bar">
        <textarea id="ncp-input" rows="1"
          placeholder="Ask about documents, officers, status…"
          onkeydown="window._nassAiKey(event)"
          oninput="window._nassAiResize(this)"></textarea>
        <button class="ncp-send-btn" id="ncp-send-btn" onclick="window._nassAiSend()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    `;
    document.body.appendChild(panel);

    const startEl = document.getElementById('ncp-starters');
    STARTERS.forEach(function (s) {
      const btn = document.createElement('button');
      btn.className = 'ncp-starter';
      btn.textContent = s;
      btn.onclick = function () { window._nassAiQuick(s); };
      startEl.appendChild(btn);
    });

    // Restore persisted conversation context (API history only, not visual)
    try {
      var saved = localStorage.getItem(HIST_KEY);
      if (saved) chatHistory = JSON.parse(saved);
    } catch(e) { chatHistory = []; }

    addBubble('assistant',
      'Hello! I\'m the NASS AI Assistant.\n\n' +
      'I have live access to the document tracker data. You can ask me things like:\n' +
      '• **"Which files are overdue?"**\n' +
      '• **"What is AD SAF\'s current workload?"**\n' +
      '• **"Show me all Completed files this month"**\n\n' +
      'How can I help you today?'
    );
  }

  // ── Panel toggle ─────────────────────────────────────────────────
  function togglePanel() {
    const panel = document.getElementById('ncp-panel');
    const fab   = document.getElementById('ncp-fab');
    const open  = panel.classList.toggle('ncp-open');
    fab.classList.toggle('ncp-fab-active', open);
    if (open) {
      setTimeout(function () {
        var inp = document.getElementById('ncp-input');
        if (inp) inp.focus();
      }, 200);
    }
  }

  window._nassAiClose = function () {
    document.getElementById('ncp-panel').classList.remove('ncp-open');
    document.getElementById('ncp-fab').classList.remove('ncp-fab-active');
  };

  window._nassAiClear = function () {
    chatHistory = [];
    sugHidden   = false;
    lastUserMsg = '';
    localStorage.removeItem(HIST_KEY);
    var msgs = document.getElementById('ncp-msgs');
    if (msgs) msgs.innerHTML = '';
    var starters = document.getElementById('ncp-starters');
    if (starters) starters.style.display = '';
    addBubble('assistant', 'Conversation cleared. What would you like to know?');
  };

  // ── Input helpers ────────────────────────────────────────────────
  window._nassAiKey = function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      window._nassAiSend();
    }
  };

  window._nassAiResize = function (el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  };

  window._nassAiQuick = function (text) {
    document.getElementById('ncp-input').value = text;
    window._nassAiSend();
  };

  // ── Retry last failed message ────────────────────────────────────
  window._nassAiRetry = function () {
    if (!lastUserMsg || isStreaming) return;
    var msgs = document.getElementById('ncp-msgs');
    if (msgs && msgs.lastElementChild && msgs.lastElementChild.classList.contains('ncp-bubble-assistant')) {
      msgs.lastElementChild.remove();
    }
    // Pop last user entry so it gets re-added cleanly by _nassAiSend
    if (chatHistory.length && chatHistory[chatHistory.length - 1].role === 'user') {
      chatHistory.pop();
    }
    document.getElementById('ncp-input').value = lastUserMsg;
    window._nassAiSend();
  };

  // ── Friendly error mapper ────────────────────────────────────────
  function friendlyErr(status, raw) {
    var s = (raw || '').toLowerCase();
    if (status === 529 || status === 402 ||
        s.indexOf('credit') !== -1 || s.indexOf('quota') !== -1 ||
        s.indexOf('billing') !== -1 || s.indexOf('insufficient') !== -1 ||
        s.indexOf('overloaded') !== -1 || s.indexOf('capacity') !== -1) {
      return 'Chat unavailable. Please try again later.';
    }
    if (status === 429 || s.indexOf('rate limit') !== -1 || s.indexOf('too many') !== -1) {
      return 'Too many requests — please wait a moment and try again.';
    }
    if (status === 401 || status === 403) {
      return 'Session expired. Please sign in again.';
    }
    if (status === 0 || s.indexOf('failed to fetch') !== -1 || s.indexOf('networkerror') !== -1) {
      return 'No connection. Check your internet and try again.';
    }
    if (status >= 500) {
      return 'Chat unavailable. Please try again later.';
    }
    return raw || 'Something went wrong. Please try again.';
  }

  // ── Send ─────────────────────────────────────────────────────────
  window._nassAiSend = async function () {
    if (isStreaming) return;
    var input = document.getElementById('ncp-input');
    var text  = (input.value || '').trim();
    if (!text) return;

    lastUserMsg = text;
    input.value = '';
    input.style.height = 'auto';

    if (!sugHidden) {
      sugHidden = true;
      var st = document.getElementById('ncp-starters');
      if (st) st.style.display = 'none';
    }

    addBubble('user', text);
    chatHistory.push({ role: 'user', content: text });
    if (chatHistory.length > MAX_HIST) chatHistory = chatHistory.slice(-MAX_HIST);

    var assistantDiv = addBubble('assistant', '');
    var innerDiv     = assistantDiv.querySelector('.ncp-bubble-content');
    innerDiv.innerHTML = '<span class="ncp-typing-dots"><span></span><span></span><span></span></span>';

    isStreaming = true;
    setSending(true);

    try {
      var session = (await window._sb.auth.getSession()).data.session;
      var token   = (session && session.access_token) ? session.access_token : '';

      // Trim payload: filter empty rows, cap at 500 most recent
      var allRows = JSON.parse(localStorage.getItem('nassRows') || '[]');
      var curRows = allRows.filter(function(r){ return Array.isArray(r) && r[1]; });
      if (curRows.length > 500) curRows = curRows.slice(-500);

      var resp = await fetch(EDGE_URL, {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({
          messages: chatHistory,
          rows:     curRows,
        }),
      });

      if (!resp.ok) {
        var errText = await resp.text();
        try { errText = JSON.parse(errText).error || errText; } catch (e2) { /* raw text ok */ }
        innerDiv.innerHTML =
          '<span class="ncp-err">&#9888; ' + escHtml(friendlyErr(resp.status, errText)) + '</span>' +
          '<button class="ncp-retry-btn" onclick="window._nassAiRetry()">&#8635; Retry</button>';
        return;
      }

      var reader   = resp.body.getReader();
      var decoder  = new TextDecoder();
      var fullText = '';
      innerDiv.innerHTML = '';

      while (true) {
        var chunk = await reader.read();
        if (chunk.done) break;
        var raw   = decoder.decode(chunk.value, { stream: true });
        var lines = raw.split('\n');
        for (var i = 0; i < lines.length; i++) {
          var line = lines[i];
          if (!line.startsWith('data: ')) continue;
          var data = line.slice(6).trim();
          if (data === '[DONE]') break;
          try {
            var parsed = JSON.parse(data);
            var delta  = (parsed.delta && parsed.delta.text) ? parsed.delta.text : '';
            if (delta) {
              fullText += delta;
              innerDiv.innerHTML = mdToHtml(fullText);
              scrollBottom();
            }
          } catch (e3) { /* ignore malformed chunks */ }
        }
      }

      if (fullText) {
        chatHistory.push({ role: 'assistant', content: fullText });
        try { localStorage.setItem(HIST_KEY, JSON.stringify(chatHistory)); } catch(e) {}
      } else if (!innerDiv.innerHTML) {
        innerDiv.innerHTML = '<em style="color:#9aa3b0">No response received.</em>';
      }

    } catch (err) {
      innerDiv.innerHTML =
        '<span class="ncp-err">&#9888; ' + escHtml(friendlyErr(0, err.message)) + '</span>' +
        '<button class="ncp-retry-btn" onclick="window._nassAiRetry()">&#8635; Retry</button>';
    } finally {
      isStreaming = false;
      setSending(false);
    }
  };

  // ── DOM helpers ──────────────────────────────────────────────────
  function addBubble(role, text) {
    var msgs = document.getElementById('ncp-msgs');
    var wrap = document.createElement('div');
    wrap.className = 'ncp-bubble ncp-bubble-' + role;
    var ts = '<span class="ncp-ts">' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + '</span>';

    if (role === 'user') {
      wrap.innerHTML =
        '<div class="ncp-bubble-label">You ' + ts + '</div>' +
        '<div class="ncp-bubble-content">' + escHtml(text) + '</div>';
    } else {
      wrap.innerHTML =
        '<div class="ncp-bubble-label">&#129302; NASS AI ' + ts + '</div>' +
        '<div class="ncp-bubble-content">' + mdToHtml(text) + '</div>';
    }

    msgs.appendChild(wrap);
    scrollBottom();
    return wrap;
  }

  function scrollBottom() {
    var msgs = document.getElementById('ncp-msgs');
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
  }

  function setSending(busy) {
    var btn = document.getElementById('ncp-send-btn');
    var inp = document.getElementById('ncp-input');
    if (btn) btn.disabled = busy;
    if (inp) inp.disabled = busy;
  }

  function el(tag, attrs) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'onclick') node.onclick = attrs[k];
      else node.setAttribute(k === 'className' ? 'class' : k, attrs[k]);
    });
    return node;
  }

  function escHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Markdown renderer: headings, bold, italic, code, numbered + bullet lists, newlines
  function mdToHtml(text) {
    if (!text) return '';
    var s = escHtml(text);
    // Headings
    s = s.replace(/(^|\n)### (.+)/g, '$1<strong class="ncp-h3">$2</strong>');
    s = s.replace(/(^|\n)## (.+)/g,  '$1<strong class="ncp-h2">$2</strong>');
    s = s.replace(/(^|\n)# (.+)/g,   '$1<strong class="ncp-h1">$2</strong>');
    // Bold
    s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // Italic
    s = s.replace(/\*(.+?)\*/g, '<em>$1</em>');
    // Inline code
    s = s.replace(/`([^`]+)`/g, '<code class="ncp-code">$1</code>');
    // Numbered lists
    s = s.replace(/(^|\n)(\d+)\. (.+)/g, '$1<span class="ncp-li">$2. $3</span>');
    // Bullet lines (• - *)
    s = s.replace(/(^|\n)([•\-\*]) (.+)/g, '$1<span class="ncp-li">$2 $3</span>');
    // Newlines → <br>
    s = s.replace(/\n/g, '<br>');
    return s;
  }

  // ── Init ─────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildUI);
  } else {
    buildUI();
  }

  window._nassAiOpen = function () {
    var panel = document.getElementById('ncp-panel');
    if (panel && !panel.classList.contains('ncp-open')) togglePanel();
  };
})();
