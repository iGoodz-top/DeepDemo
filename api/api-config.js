(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ApiConfig = factory();
})(typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var ENDPOINT = {
    chat: '/chat/completions',
    responses: '/responses',
    anthropic: '/messages'
  };

  var TEMP_MAX = 2;

  var I18N = {
    zh: {
      selectModel: '请选择模型', newModel: '新建', addModel: '添加模型',
      settingTitle: '自定义模型', close: '关闭',
      apiFormat: 'API 格式', formatChat: 'OpenAI Chat Completions 格式',
      formatResponses: 'OpenAI Responses API 格式', formatAnthropic: 'Anthropic Messages 格式',
      apiBase: '请求地址', apiBasePh: '例如 https://api.deepseek.com/v1',
      apiBaseHint: '不要以斜杠结尾，接口路径会自动补全',
      willCall: '将请求：{url}',
      modelId: '模型 ID', modelIdPh: '例如 deepseek-chat',
      showName: '模型展示名称', showNamePh: '留空则显示模型 ID',
      apiKey: 'API 密钥', apiKeyPh: 'sk-...',
      advanced: '高级配置', temperature: 'Temperature（0 ~ 2）',
      systemPrompt: 'System 提示词', systemPromptPh: '可留空，留空则不发送 system',
      maxTokens: 'Max Tokens',
      delete: '删除', deleteConfirm: '确认删除？', reset: '重置',
      testConn: '连通测试', saveModel: '保存模型', testing: '测试中…',
      requiredFields: '带 * 的必填项不能为空',
      invalidUrl: '请求地址格式不正确，需要以 http:// 或 https:// 开头',
      selectModelFirst: '请先选择或新建一个模型',
      testSuccess: '连通测试成功（{ms}ms）',
      requestFailed: '请求失败：HTTP {status}{detail}',
      timeout: '请求超时（{sec}s）',
      networkError: '网络请求失败，大概率是跨域 CORS 问题，需要代理',
      emptyResponse: '（模型未返回内容）',
      requestError: '请求异常：{msg}',
      corsHint: '若为 CORS 报错，请通过反向代理调用接口。',
      switchedTo: '已切换至：{name}', modelSaved: '模型配置已保存',
      modelDeleted: '模型已删除', modelInUse: '当前选中模型已被删除',
      notStream: '服务未返回流式响应，请检查 API 格式是否选对',
      storageFail: '保存失败：浏览器存储不可用或已满（可能是隐私模式）。配置仅在本次页面内有效，刷新后会丢失。'
    },
    en: {
      selectModel: 'Select a model', newModel: 'New', addModel: 'Add model',
      settingTitle: 'Custom Model', close: 'Close',
      apiFormat: 'API Format', formatChat: 'OpenAI Chat Completions',
      formatResponses: 'OpenAI Responses API', formatAnthropic: 'Anthropic Messages',
      apiBase: 'Base URL', apiBasePh: 'e.g. https://api.deepseek.com/v1',
      apiBaseHint: 'No trailing slash; the endpoint path is appended automatically',
      willCall: 'Will call: {url}',
      modelId: 'Model ID', modelIdPh: 'e.g. deepseek-chat',
      showName: 'Display Name', showNamePh: 'Leave empty to show the model ID',
      apiKey: 'API Key', apiKeyPh: 'sk-...',
      advanced: 'Advanced', temperature: 'Temperature (0 ~ 2)',
      systemPrompt: 'System Prompt', systemPromptPh: 'Optional; empty sends no system message',
      maxTokens: 'Max Tokens',
      delete: 'Delete', deleteConfirm: 'Confirm delete?', reset: 'Reset',
      testConn: 'Test', saveModel: 'Save', testing: 'Testing…',
      requiredFields: 'Required fields marked with * cannot be empty',
      invalidUrl: 'Invalid base URL; it must start with http:// or https://',
      selectModelFirst: 'Please select or create a model first',
      testSuccess: 'Connection OK ({ms}ms)',
      requestFailed: 'Request failed: HTTP {status}{detail}',
      timeout: 'Request timed out ({sec}s)',
      networkError: 'Network request failed. Likely a CORS issue; a proxy is required.',
      emptyResponse: '(The model returned no content)',
      requestError: 'Request error: {msg}',
      corsHint: 'If this is a CORS error, call the API through a reverse proxy.',
      switchedTo: 'Switched to: {name}', modelSaved: 'Model saved',
      modelDeleted: 'Model deleted', modelInUse: 'The selected model was deleted',
      notStream: 'No streaming response returned; check the API format',
      storageFail: 'Save failed: browser storage is unavailable or full (private mode?). The configuration lives only for this page and will be lost on reload.'
    }
  };

  var SVG = {
    chevron: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>',
    gear: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.14.61.66 1.06 1.28 1.09H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    plus: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
    trash: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>',
    times: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>',
    spin: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" class="ac-spin"><path d="M21 12a9 9 0 1 1-6.2-8.56"/></svg>'
  };

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function readStore(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw == null ? fallback : JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function writeStore(key, value) {
    try {
      if (value === null || value === undefined) { localStorage.removeItem(key); return true; }
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  function sanitizeModels(raw) {
    if (!Array.isArray(raw)) return [];
    var out = [];
    for (var i = 0; i < raw.length; i++) {
      var m = raw[i];
      if (!m || typeof m !== 'object' || Array.isArray(m)) continue;
      var modelId = String(m.modelId || '').trim();
      if (!modelId) continue;
      var fmt = (m.format === 'anthropic' || m.format === 'responses') ? m.format : 'chat';
      var temp = Number(m.temp);
      var maxTokens = parseInt(m.maxTokens, 10);
      out.push({
        uid: typeof m.uid === 'string' && m.uid ? m.uid : uid(),
        format: fmt,
        base: normalizeBase(m.base),
        modelId: modelId,
        showName: String(m.showName || '').trim(),
        key: String(m.key || '').trim(),
        temp: isFinite(temp) ? Math.min(TEMP_MAX, Math.max(0, temp)) : 0.7,
        maxTokens: isFinite(maxTokens) && maxTokens > 0 ? maxTokens : null,
        system: m.system == null ? '' : String(m.system),
        updatedAt: Number(m.updatedAt) || Date.now()
      });
    }
    return out;
  }

  function normalizeBase(base) {
    return String(base || '').trim().replace(/\/+$/, '');
  }

  function buildUrl(base, format) {
    var suffix = ENDPOINT[format] || ENDPOINT.chat;
    var b = normalizeBase(base);
    if (!b) return '';
    if (b.slice(-suffix.length).toLowerCase() === suffix.toLowerCase()) return b;
    return b + suffix;
  }

  function validUrl(u) {
    try {
      var p = new URL(u);
      return p.protocol === 'http:' || p.protocol === 'https:';
    } catch (e) {
      return false;
    }
  }

  function ApiError(kind, message, status) {
    var e = new Error(message);
    e.name = 'ApiError';
    e.kind = kind;
    e.status = status;
    return e;
  }

  function splitDataUrl(dataUrl) {
    var m = /^data:([^;]+);base64,(.*)$/.exec(dataUrl || '');
    if (!m) return { mediaType: 'image/png', data: String(dataUrl || '').split(',')[1] || '' };
    return { mediaType: m[1], data: m[2] };
  }

  function toAnthropic(msgs) {
    return msgs.map(function (m) {
      if (typeof m.content === 'string') return { role: m.role, content: m.content };
      return {
        role: m.role,
        content: m.content.map(function (p) {
          if (p.type === 'text') return { type: 'text', text: p.text };
          if (p.type === 'image_url') {
            var s = splitDataUrl(p.image_url.url);
            return { type: 'image', source: { type: 'base64', media_type: s.mediaType, data: s.data } };
          }
          return null;
        }).filter(Boolean)
      };
    });
  }

  function toResponsesInput(msgs) {
    return msgs.map(function (m) {
      var type = m.role === 'assistant' ? 'output_text' : 'input_text';
      if (typeof m.content === 'string') return { role: m.role, content: [{ type: type, text: m.content }] };
      return {
        role: m.role,
        content: m.content.map(function (p) {
          if (p.type === 'text') return { type: type, text: p.text };
          return { type: 'input_image', image_url: p.image_url.url };
        })
      };
    });
  }

  function buildRequest(cfg, msgs, opts) {
    var maxTokens = opts.maxTokens || 4096;
    var system = String(cfg.system || '').trim();
    var temp = Number(cfg.temp);
    var useTemp = isFinite(temp);

    if (cfg.format === 'anthropic') {
      var body = {
        model: cfg.modelId,
        messages: toAnthropic(msgs),
        max_tokens: maxTokens,
        stream: true
      };
      if (system) body.system = system;
      if (useTemp) body.temperature = temp;
      return {
        url: buildUrl(cfg.base, 'anthropic'),
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': cfg.key,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: body
      };
    }

    if (cfg.format === 'responses') {
      var rb = { model: cfg.modelId, input: toResponsesInput(msgs), stream: true, max_output_tokens: maxTokens };
      if (system) rb.instructions = system;
      if (useTemp) rb.temperature = temp;
      return {
        url: buildUrl(cfg.base, 'responses'),
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + cfg.key },
        body: rb
      };
    }

    var list = msgs.slice();
    if (system) list.unshift({ role: 'system', content: system });
    var cb = { model: cfg.modelId, messages: list, stream: true, max_tokens: maxTokens };
    if (useTemp) cb.temperature = temp;
    return {
      url: buildUrl(cfg.base, 'chat'),
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + cfg.key },
      body: cb
    };
  }

  function buildProbe(cfg) {
    var base = {
      url: buildUrl(cfg.base, cfg.format),
      body: { model: cfg.modelId }
    };
    if (cfg.format === 'anthropic') {
      base.headers = {
        'Content-Type': 'application/json',
        'x-api-key': cfg.key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      };
      base.body.max_tokens = 16;
      base.body.messages = [{ role: 'user', content: 'hi' }];
    } else if (cfg.format === 'responses') {
      base.headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + cfg.key };
      base.body.input = 'hi';
      base.body.max_output_tokens = 16;
    } else {
      base.headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + cfg.key };
      base.body.messages = [{ role: 'user', content: 'hi' }];
      base.body.max_tokens = 16;
    }
    return base;
  }

  function extractDelta(format, json) {
    if (format === 'anthropic') {
      if (json.type !== 'content_block_delta' || !json.delta) return '';
      if (json.delta.type === 'thinking_delta') return '';
      return json.delta.text || '';
    }
    if (format === 'responses') {
      if (json.type === 'response.output_text.delta') return json.delta || '';
      return '';
    }
    var choice = json.choices && json.choices[0];
    if (!choice || !choice.delta) return '';
    var c = choice.delta.content;
    if (typeof c === 'string') return c;
    if (Array.isArray(c)) return c.map(function (p) { return (p && p.text) || ''; }).join('');
    return '';
  }

  function extractReasoning(format, json) {
    if (format === 'anthropic') {
      if (json.type === 'content_block_delta' && json.delta && json.delta.type === 'thinking_delta') {
        return json.delta.thinking || '';
      }
      return '';
    }
    if (format === 'responses') {
      if (json.type === 'response.reasoning_summary_text.delta') return json.delta || '';
      return '';
    }
    var d = json.choices && json.choices[0] && json.choices[0].delta;
    return (d && typeof d.reasoning_content === 'string') ? d.reasoning_content : '';
  }

  function isDone(format, json) {
    if (format === 'anthropic') return json.type === 'message_stop' || json.type === 'error';
    if (format === 'responses') return json.type === 'response.completed' || json.type === 'response.failed';
    return false;
  }

  function errorMessageFrom(status, text) {
    var detail = '';
    try {
      var j = JSON.parse(text);
      detail = (j.error && j.error.message) || j.message || j.detail || '';
    } catch (e) {}
    return detail;
  }

  function ApiConfig(options) {
    this.opts = Object.assign({
      storageKey: 'api_config_model_list',
      selectorEl: null,
      modalHost: null,
      modalEl: null,
      lang: 'zh',
      themeAttr: 'data-theme',
      defaultSystem: '',
      defaultTemp: 0.7,
      maxTokens: 4096,
      timeoutMs: 20000,
      persistCurrent: true,
      onSwitch: null
    }, options || {});

    this.lang = (this.opts.lang === 'en') ? 'en' : 'zh';
    this.currentUid = null;
    this.models = [];
    this._listeners = [];
    this._deleteArmed = false;

    var cur = readStore(this.opts.storageKey, []);
    this.models = sanitizeModels(cur);

    if (this.opts.persistCurrent) {
      var saved = readStore(this.opts.storageKey + ':current', null);
      if (saved && this.models.some(function (m) { return m.uid === saved; })) this.currentUid = saved;
    }
    if (!this.getCurrent() && this.models.length) this.currentUid = this.models[0].uid;

    this._mount();
    this._initTheme();
  }

  ApiConfig.prototype._detectTheme = function () {
    var forced = this.opts.theme && String(this.opts.theme).toLowerCase();
    if (forced === 'dark' || forced === 'light') return forced;
    var attr = this.opts.themeAttr;
    if (!attr) return 'light';
    var nodes = [document.documentElement, document.body];
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      if (n && n.getAttribute && n.getAttribute(attr) === 'dark') return 'dark';
    }
    return 'light';
  };

  ApiConfig.prototype._applyTheme = function () {
    var val = this._detectTheme();
    if (val === this._themeApplied) return;
    this._themeApplied = val;
    if (this._root) this._root.setAttribute('data-ac-theme', val);
    if (this._modal) this._modal.setAttribute('data-ac-theme', val);
  };

  ApiConfig.prototype._initTheme = function () {
    this._applyTheme();
    var self = this;
    if (!this.opts.themeAttr || typeof MutationObserver !== 'function') return;
    try {
      this._themeObserver = new MutationObserver(function () { self._applyTheme(); });
      [document.documentElement, document.body].forEach(function (n) {
        if (!n) return;
        self._themeObserver.observe(n, {
          attributes: true,
          attributeFilter: [self.opts.themeAttr]
        });
      });
    } catch (e) {}
  };

  ApiConfig.prototype.t = function (key, vars) {
    var s = (I18N[this.lang] && I18N[this.lang][key]);
    if (s == null) s = I18N.zh[key];
    if (s == null) s = key;
    if (vars) Object.keys(vars).forEach(function (k) {
      s = s.replace(new RegExp('\\{' + k + '\\}', 'g'), vars[k]);
    });
    return s;
  };

  ApiConfig.prototype.onChange = function (fn) {
    if (typeof fn === 'function') this._listeners.push(fn);
    return this;
  };

  ApiConfig.prototype._emit = function () {
    var self = this;
    var payload = { models: this.models.slice(), current: this.getCurrent() };
    this._listeners.forEach(function (fn) {
      try { fn(payload); } catch (e) {}
    });
    if (typeof this.opts.onChange === 'function') {
      try { this.opts.onChange(payload); } catch (e) {}
    }
    if (typeof this.opts.onSwitch === 'function') {
      try { this.opts.onSwitch(payload.current); } catch (e) {}
    }
  };

  ApiConfig.prototype.getModels = function () { return this.models.slice(); };
  ApiConfig.prototype.getCurrent = function () {
    var uid = this.currentUid;
    return this.models.filter(function (m) { return m.uid === uid; })[0] || null;
  };

  ApiConfig.prototype.setCurrent = function (uidOrModel) {
    var target = typeof uidOrModel === 'object' ? uidOrModel.uid : uidOrModel;
    var hit = this.models.filter(function (m) { return m.uid === target; })[0];
    this.currentUid = hit ? hit.uid : null;
    if (this.opts.persistCurrent) writeStore(this.opts.storageKey + ':current', this.currentUid);
    this._syncSelector();
    this._emit();
    return this;
  };

  ApiConfig.prototype._persist = function () {
    var okList = writeStore(this.opts.storageKey, this.models);
    if (this.opts.persistCurrent) writeStore(this.opts.storageKey + ':current', this.currentUid);
    this._syncSelector();
    this._emit();
    if (!okList) this._storageWarned = true;
    return okList;
  };

  ApiConfig.prototype.setLang = function (lang) {
    this.lang = (lang === 'en') ? 'en' : 'zh';
    if (this._root) this._root.setAttribute('data-lang', this.lang);
    this._syncSelector();
    this._renderModalTexts();
    this._emit();
    return this;
  };

  ApiConfig.prototype._mount = function () {
    var root = document.createElement('div');
    root.className = 'ac-root';
    root.setAttribute('data-lang', this.lang);
    this._root = root;

    this._selector = document.createElement('div');
    this._selector.className = 'ac-select';
    this._selector.innerHTML =
      '<button type="button" class="ac-select-trigger" aria-haspopup="listbox">' +
        '<span class="ac-select-value"></span>' + SVG.chevron +
      '</button>' +
      '<div class="ac-select-panel" role="listbox"></div>' +
      '<button type="button" class="ac-gear" aria-label="' + esc(this.t('settingTitle')) + '">' + SVG.gear + '</button>';
    root.appendChild(this._selector);
    (this.opts.selectorEl || document.body).appendChild(root);

    var host = this.opts.modalEl || this.opts.modalHost || document.body;
    this._modal = document.createElement('div');
    this._modal.className = 'ac-modal';
    this._modal.innerHTML = this._modalMarkup();
    host.appendChild(this._modal);

    this._bind();
    this._syncSelector();
    this._renderModalTexts();

    var self = this;
    this._docClickHandler = function () {
      self._selector.classList.remove('open');
    };
    document.addEventListener('click', this._docClickHandler);
  };

  ApiConfig.prototype._modalMarkup = function () {
    return '' +
      '<div class="ac-modal-mask"></div>' +
      '<div class="ac-modal-card" role="dialog" aria-modal="true">' +
        '<div class="ac-modal-head">' +
          '<h2 class="ac-title" data-i18n="settingTitle"></h2>' +
          '<button type="button" class="ac-icon-btn ac-close" aria-label="close">' + SVG.times + '</button>' +
        '</div>' +
        '<div class="ac-modal-body">' +
          '<div class="ac-field">' +
            '<label class="ac-label"><span class="ac-req">*</span> <span data-i18n="apiFormat"></span></label>' +
            '<div class="ac-select ac-inline" data-name="format">' +
              '<button type="button" class="ac-select-trigger"><span class="ac-select-value"></span>' + SVG.chevron + '</button>' +
              '<div class="ac-select-panel" role="listbox"></div>' +
            '</div>' +
            '<p class="ac-hint ac-url-preview" data-name="urlPreview"></p>' +
          '</div>' +
          '<div class="ac-field">' +
            '<label class="ac-label"><span class="ac-req">*</span> <span data-i18n="apiBase"></span></label>' +
            '<input class="ac-input" data-name="base" type="text" spellcheck="false" data-i18n-ph="apiBasePh" />' +
            '<p class="ac-hint" data-i18n="apiBaseHint"></p>' +
          '</div>' +
          '<div class="ac-field">' +
            '<label class="ac-label"><span class="ac-req">*</span> <span data-i18n="modelId"></span></label>' +
            '<input class="ac-input" data-name="modelId" type="text" spellcheck="false" data-i18n-ph="modelIdPh" />' +
          '</div>' +
          '<div class="ac-field">' +
            '<label class="ac-label"><span data-i18n="showName"></span></label>' +
            '<input class="ac-input" data-name="showName" type="text" data-i18n-ph="showNamePh" />' +
          '</div>' +
          '<div class="ac-field">' +
            '<label class="ac-label"><span class="ac-req">*</span> <span data-i18n="apiKey"></span></label>' +
            '<div class="ac-keyrow">' +
              '<input class="ac-input" data-name="key" type="password" spellcheck="false" autocomplete="off" data-i18n-ph="apiKeyPh" />' +
              '<button type="button" class="ac-icon-btn ac-eye" aria-label="toggle">' +
                '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>' +
              '</button>' +
            '</div>' +
          '</div>' +
          '<div class="ac-field">' +
            '<button type="button" class="ac-adv-toggle"><span class="ac-adv-chev">' + SVG.chevron + '</span><span data-i18n="advanced"></span></button>' +
            '<div class="ac-adv is-hidden">' +
              '<div class="ac-grid2">' +
                '<div class="ac-field">' +
                  '<label class="ac-label" data-i18n="temperature"></label>' +
                  '<input class="ac-input" data-name="temp" type="number" min="0" max="2" step="0.1" />' +
                '</div>' +
                '<div class="ac-field">' +
                  '<label class="ac-label" data-i18n="maxTokens"></label>' +
                  '<input class="ac-input" data-name="maxTokens" type="number" min="1" step="1" />' +
                '</div>' +
              '</div>' +
              '<div class="ac-field">' +
                '<label class="ac-label" data-i18n="systemPrompt"></label>' +
                '<textarea class="ac-textarea" data-name="system" rows="4" data-i18n-ph="systemPromptPh"></textarea>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<p class="ac-error" data-name="formError"></p>' +
        '</div>' +
        '<div class="ac-modal-foot">' +
          '<button type="button" class="ac-btn ac-btn-new" data-name="new">' + SVG.plus + '<span data-i18n="newModel"></span></button>' +
          '<button type="button" class="ac-btn ac-btn-danger is-hidden" data-name="del">' + SVG.trash + '<span data-i18n="delete"></span></button>' +
          '<div class="ac-foot-right">' +
            '<button type="button" class="ac-btn" data-i18n="reset" data-name="reset"></button>' +
            '<button type="button" class="ac-btn" data-i18n="testConn" data-name="test"></button>' +
            '<button type="button" class="ac-btn ac-btn-primary" data-i18n="saveModel" data-name="save"></button>' +
          '</div>' +
        '</div>' +
      '</div>';
  };

  ApiConfig.prototype._q = function (name, scope) {
    return (scope || this._modal).querySelector('[data-name="' + name + '"]');
  };

  ApiConfig.prototype._bind = function () {
    var self = this;

    this._trigger = this._selector.querySelector('.ac-select-trigger');
    this._trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      self._selector.classList.toggle('open');
    });
    this._gearBtn = this._selector.querySelector('.ac-gear');
    this._gearBtn.addEventListener('click', function () { self.open(); });

    this._modal.querySelector('.ac-close').addEventListener('click', function () { self.close(); });
    this._modal.querySelector('.ac-modal-mask').addEventListener('mousedown', function (e) {
      if (e.target.classList.contains('ac-modal-mask')) self.close();
    });

    this._formatSelect = this._q('format');
    this._formatSelect.querySelector('.ac-select-trigger').addEventListener('click', function (e) {
      e.stopPropagation();
      self._formatSelect.classList.toggle('open');
    });
    this._formatValue = null;
    this._renderFormatOptions();

    this._q('base').addEventListener('input', function () { self._updateUrlPreview(); });
    this._q('key').parentNode.querySelector('.ac-eye').addEventListener('click', function () {
      var i = self._q('key');
      i.type = i.type === 'password' ? 'text' : 'password';
    });

    this._q('new').addEventListener('click', function () { self._fill(null); });
    this._q('reset').addEventListener('click', function () { self._fill(null); });
    this._q('save').addEventListener('click', function () { self._save(); });
    this._q('test').addEventListener('click', function () { self._test(); });
    this._q('del').addEventListener('click', function () { self._delete(); });

    var advToggle = this._modal.querySelector('.ac-adv-toggle');
    advToggle.addEventListener('click', function () {
      var panel = self._modal.querySelector('.ac-adv');
      panel.classList.toggle('is-hidden');
      advToggle.classList.toggle('open');
    });

    this._keyHandler = function (e) {
      if (e.key === 'Escape' && self._modal.classList.contains('open')) self.close();
    };
    document.addEventListener('keydown', this._keyHandler);
  };

  ApiConfig.prototype._renderFormatOptions = function () {
    var self = this;
    var panel = this._formatSelect.querySelector('.ac-select-panel');
    var value = this._formatSelect.querySelector('.ac-select-value');
    var items = [
      { v: 'chat', label: this.t('formatChat') },
      { v: 'responses', label: this.t('formatResponses') },
      { v: 'anthropic', label: this.t('formatAnthropic') }
    ];
    panel.innerHTML = '';
    items.forEach(function (it) {
      var d = document.createElement('div');
      d.className = 'ac-option';
      d.setAttribute('role', 'option');
      d.textContent = it.label;
      d.addEventListener('click', function (e) {
        e.stopPropagation();
        self._formatValue = it.v;
        value.textContent = it.label;
        panel.querySelectorAll('.ac-option').forEach(function (o) { o.classList.remove('selected'); });
        d.classList.add('selected');
        self._formatSelect.classList.remove('open');
        self._updateUrlPreview();
      });
      if (it.v === this._formatValue) { d.classList.add('selected'); value.textContent = it.label; }
      panel.appendChild(d);
    }.bind(this));
    if (!this._formatValue) {
      this._formatValue = 'chat';
      value.textContent = items[0].label;
      panel.firstChild.classList.add('selected');
    }
  };

  ApiConfig.prototype._syncSelector = function () {
    var self = this;
    var panel = this._selector.querySelector('.ac-select-panel');
    var value = this._selector.querySelector('.ac-select-value');
    var cur = this.getCurrent();
    value.textContent = cur ? (cur.showName || cur.modelId) : this.t('selectModel');
    panel.innerHTML = '';

    this.models.forEach(function (m) {
      var d = document.createElement('div');
      d.className = 'ac-option' + (m.uid === self.currentUid ? ' selected' : '');
      d.setAttribute('role', 'option');
      d.textContent = m.showName || m.modelId;
      d.addEventListener('click', function (e) {
        e.stopPropagation();
        self._selector.classList.remove('open');
        if (m.uid === self.currentUid) { self.open(); return; }
        self.setCurrent(m.uid);
        self._toast(self.t('switchedTo', { name: m.showName || m.modelId }));
        if (self._modal.classList.contains('open')) self._fill(self.getCurrent());
      });
      panel.appendChild(d);
    });

    var add = document.createElement('div');
    add.className = 'ac-option ac-option-add';
    add.innerHTML = SVG.plus + '<span>' + esc(this.t('addModel')) + '</span>';
    add.addEventListener('click', function (e) {
      e.stopPropagation();
      self._selector.classList.remove('open');
      self.open('new');
    });
    panel.appendChild(add);
  };

  ApiConfig.prototype._renderModalTexts = function () {
    var self = this;
    this._modal.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = self.t(el.getAttribute('data-i18n'));
    });
    this._modal.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      el.placeholder = self.t(el.getAttribute('data-i18n-ph'));
    });
    this._gearBtn.setAttribute('aria-label', this.t('settingTitle'));
    this._renderFormatOptions();
    this._syncSelector();
    this._updateUrlPreview();
  };

  ApiConfig.prototype._updateUrlPreview = function () {
    var el = this._q('urlPreview');
    var base = this._q('base').value;
    var u = buildUrl(base, this._formatValue);
    if (!u) { el.textContent = this.t('apiBaseHint'); return; }
    el.textContent = this.t('willCall', { url: u });
  };

  ApiConfig.prototype._fill = function (cfg) {
    this._editingUid = cfg ? cfg.uid : null;
    this._disarmDelete();
    this._formatValue = cfg ? (cfg.format || 'chat') : 'chat';
    this._renderFormatOptions();
    this._q('base').value = cfg ? (cfg.base || '') : '';
    this._q('modelId').value = cfg ? (cfg.modelId || '') : '';
    this._q('showName').value = cfg ? (cfg.showName || '') : '';
    this._q('key').value = cfg ? (cfg.key || '') : '';
    this._q('key').type = 'password';
    this._q('temp').value = cfg ? (isFinite(Number(cfg.temp)) ? Number(cfg.temp) : this.opts.defaultTemp) : this.opts.defaultTemp;
    this._q('maxTokens').value = cfg && cfg.maxTokens ? cfg.maxTokens : '';
    this._q('system').value = cfg ? (cfg.system || '') : this.opts.defaultSystem;
    this._q('del').classList.toggle('is-hidden', !cfg);
    this._setError('');
    this._updateUrlPreview();
  };

  ApiConfig.prototype._readForm = function () {
    var temp = parseFloat(this._q('temp').value);
    var maxTokens = parseInt(this._q('maxTokens').value, 10);
    return {
      uid: this._editingUid || uid(),
      format: this._formatValue,
      base: normalizeBase(this._q('base').value),
      modelId: this._q('modelId').value.trim(),
      showName: this._q('showName').value.trim(),
      key: this._q('key').value.trim(),
      temp: isFinite(temp) ? Math.min(TEMP_MAX, Math.max(0, temp)) : this.opts.defaultTemp,
      maxTokens: isFinite(maxTokens) && maxTokens > 0 ? maxTokens : null,
      system: this._q('system').value.trim(),
      updatedAt: Date.now()
    };
  };

  ApiConfig.prototype._validate = function (cfg) {
    if (!cfg.base || !cfg.modelId || !cfg.key) return this.t('requiredFields');
    if (!validUrl(cfg.base)) return this.t('invalidUrl');
    return '';
  };

  ApiConfig.prototype._setError = function (msg) {
    var el = this._q('formError');
    el.textContent = msg || '';
    el.classList.toggle('is-hidden', !msg);
  };

  ApiConfig.prototype._save = function () {
    var cfg = this._readForm();
    var err = this._validate(cfg);
    if (err) { this._setError(err); return; }
    var idx = this.models.findIndex(function (m) { return m.uid === cfg.uid; });
    if (idx >= 0) this.models[idx] = cfg; else this.models.push(cfg);
    this.currentUid = cfg.uid;
    var persisted = this._persist();
    this._fill(cfg);
    this.close();
    this._toast(persisted ? this.t('modelSaved') : this.t('storageFail'));
  };

  ApiConfig.prototype._disarmDelete = function () {
    this._deleteArmed = false;
    var btn = this._q('del');
    if (btn) btn.querySelector('span').textContent = this.t('delete');
  };

  ApiConfig.prototype._delete = function () {
    if (!this._editingUid) return;
    var btn = this._q('del');
    if (!this._deleteArmed) {
      this._deleteArmed = true;
      btn.querySelector('span').textContent = this.t('deleteConfirm');
      return;
    }
    this._disarmDelete();
    var wasCurrent = this.currentUid === this._editingUid;
    this.models = this.models.filter(function (m) { return m.uid !== this._editingUid; }.bind(this));
    if (wasCurrent) this.currentUid = this.models.length ? this.models[0].uid : null;
    this._editingUid = null;
    this._persist();
    this._fill(null);
    this.close();
    this._toast(this.t('modelDeleted'));
    if (wasCurrent && this.currentUid) this._toast(this.t('modelInUse'));
  };

  ApiConfig.prototype._test = function () {
    var self = this;
    var cfg = this._readForm();
    var err = this._validate(cfg);
    if (err) { this._setError(err); return; }

    var btn = this._q('test');
    var old = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = SVG.spin + esc(this.t('testing'));
    this._setError('');

    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, this.opts.timeoutMs);
    var started = Date.now();

    var probe = buildProbe(cfg);
    fetch(probe.url, {
      method: 'POST',
      headers: probe.headers,
      body: JSON.stringify(probe.body),
      signal: ctrl.signal
    }).then(function (res) {
      return res.text().then(function (text) { return { res: res, text: text }; });
    }).then(function (r) {
      if (r.res.ok) {
        self._toast(self.t('testSuccess', { ms: Date.now() - started }));
      } else {
        var detail = errorMessageFrom(r.res.status, r.text);
        self._setError(self.t('requestFailed', {
          status: r.res.status,
          detail: detail ? ' · ' + detail : ''
        }) + ' · ' + probe.url);
      }
    }).catch(function (e) {
      self._setError(e.name === 'AbortError'
        ? self.t('timeout', { sec: Math.round(self.opts.timeoutMs / 1000) })
        : self.t('networkError'));
    }).finally(function () {
      clearTimeout(timer);
      btn.disabled = false;
      btn.innerHTML = old;
    });
  };

  ApiConfig.prototype._toast = function (msg) {
    if (typeof this.opts.onToast === 'function') { this.opts.onToast(msg); return; }
    var host = this.opts.toastHost || document.body;
    var el = document.createElement('div');
    el.className = 'ac-toast';
    el.setAttribute('data-ac-theme', this._themeApplied || 'light');
    el.textContent = msg;
    host.appendChild(el);
    requestAnimationFrame(function () { el.classList.add('show'); });
    setTimeout(function () {
      el.classList.remove('show');
      setTimeout(function () { el.remove(); }, 250);
    }, 2200);
  };

  ApiConfig.prototype.open = function (mode) {
    if (mode === 'new') this._fill(null);
    else if (!this._modal.classList.contains('open')) this._fill(this.getCurrent());
    this._modal.classList.add('open');
    return this;
  };

  ApiConfig.prototype.close = function () {
    this._modal.classList.remove('open');
    this._disarmDelete();
    return this;
  };

  ApiConfig.prototype.streamChat = function (params) {
    var p = params || {};
    var cfg = p.model || this.getCurrent();
    if (!cfg) return Promise.reject(ApiError('config', this.t('selectModelFirst')));

    var self = this;
    var opts = { maxTokens: p.maxTokens || cfg.maxTokens || this.opts.maxTokens };
    var req = buildRequest(cfg, p.messages || [], opts);
    var signal = p.signal || null;

    return fetch(req.url, {
      method: 'POST',
      headers: req.headers,
      body: JSON.stringify(req.body),
      signal: signal
    }).then(function (resp) {
      if (!resp.ok) {
        return resp.text().then(function (text) {
          var detail = errorMessageFrom(resp.status, text);
          var e = ApiError(
            resp.status === 401 || resp.status === 403 ? 'auth' : resp.status === 404 ? 'not_found' : 'http',
            self.t('requestFailed', {
              status: resp.status,
              detail: detail ? ' · ' + detail : ''
            }) + ' · ' + req.url,
            resp.status
          );
          e.url = req.url;
          throw e;
        });
      }
      var type = (resp.headers && resp.headers.get && resp.headers.get('Content-Type')) || '';
      var isSse = type.indexOf('text/event-stream') >= 0;
      var full = '';
      var reasoningFull = '';
      var buffer = '';

      if (!isSse) {
        return resp.text().then(function (text) {
          var j = null;
          try { j = JSON.parse(text); } catch (e) {}
          if (!j) throw ApiError('protocol', self.t('notStream'), 200);
          if (j.error) throw ApiError('stream', j.error.message || 'stream error');
          if (j.choices && j.choices[0]) {
            full = (j.choices[0].message && j.choices[0].message.content) || '';
          } else if (typeof j.output_text === 'string') {
            full = j.output_text;
          } else if (j.content) {
            full = Array.isArray(j.content)
              ? j.content.map(function (b) { return b.text || ''; }).join('')
              : String(j.content);
          }
          if (full && p.onDelta) p.onDelta(full, full);
          return full;
        });
      }

      if (!resp.body) throw ApiError('protocol', self.t('notStream'), 200);
      var reader = resp.body.getReader();
      var decoder = new TextDecoder();

      function handleLine(line) {
        var s = line.trim();
        if (!s || s.charAt(0) === ':' || s.indexOf('event:') === 0) return;
        if (s.indexOf('data:') !== 0) return;
        var payload = s.slice(5).trim();
        if (!payload || payload === '[DONE]') return;
        var json;
        try { json = JSON.parse(payload); } catch (e) { return; }
        if (json.error) throw ApiError('stream', json.error.message || 'stream error');
        if (json.type === 'response.failed' || json.type === 'error') {
          var em = (json.response && json.response.error && json.response.error.message) || json.error || 'stream error';
          throw ApiError('stream', typeof em === 'string' ? em : 'stream error');
        }
        var piece = extractDelta(cfg.format, json);
        if (piece) {
          full += piece;
          if (p.onDelta) p.onDelta(piece, full);
        }
        var rc = extractReasoning(cfg.format, json);
        if (rc) { reasoningFull += rc; if (p.onReasoning) p.onReasoning(rc, reasoningFull); }
      }

      function pump() {
        return reader.read().then(function (r) {
          if (r.done) {
            if (buffer) handleLine(buffer);
            return full;
          }
          buffer += decoder.decode(r.value, { stream: true });
          if (isSse || buffer.indexOf('\n') >= 0) {
            var lines = buffer.split('\n');
            buffer = lines.pop();
            lines.forEach(handleLine);
          }
          return pump();
        });
      }

      return pump();
    });
  };

  ApiConfig.prototype.destroy = function () {
    if (this._themeObserver) {
      try { this._themeObserver.disconnect(); } catch (e) {}
      this._themeObserver = null;
    }
    if (this._docClickHandler) {
      document.removeEventListener('click', this._docClickHandler);
      this._docClickHandler = null;
    }
    if (this._keyHandler) {
      document.removeEventListener('keydown', this._keyHandler);
      this._keyHandler = null;
    }
    if (this._root && this._root.parentNode) this._root.parentNode.removeChild(this._root);
    else if (this._selector && this._selector.parentNode) this._selector.parentNode.removeChild(this._selector);
    if (this._modal && this._modal.parentNode) this._modal.parentNode.removeChild(this._modal);
    this._listeners = [];
  };

  return ApiConfig;
});
