# api-config

Dependency-free custom-model configuration module (UMD, exposes `window.ApiConfig`). Multi-model management, three API formats, connection test, streaming chat. Bilingual UI (zh/en via `setLang`).

[中文文档](README_ZH.md)

## Include

```html
<link rel="stylesheet" href="./api-config.css" />
<script src="./api-config.js"></script>
```

## Instantiate

```js
const apiConfig = new ApiConfig({
  storageKey: 'api_config_model_list',
  selectorEl: document.getElementById('modelSelectorSlot'),
  modalEl: document.body,
  lang: 'zh',            // 'zh' | 'en'
  defaultSystem: '',
  persistCurrent: true
});
```

| Option | Default | Notes |
|---|---|---|
| `storageKey` | `api_config_model_list` | model list key; current model stored at `<key>:current` |
| `selectorEl` | `document.body` | dropdown + gear mount point |
| `modalEl` / `modalHost` | `document.body` | modal mount point |
| `lang` | `zh` | `zh` / `en` |
| `themeAttr` | `data-theme` | host attribute synced for light/dark; `false` disables |
| `theme` | - | forced `dark`/`light`, wins over `themeAttr` |
| `defaultSystem` | `''` | initial system prompt for new models; empty omits the field |
| `defaultTemp` | `0.7` | default temperature (0-2) |
| `maxTokens` | `4096` | per-request default, model-level value overrides |
| `timeoutMs` | `20000` | connection-test timeout |
| `persistCurrent` | `true` | remember the selected model |
| `onToast` | built-in bubble | toast callback `(msg) => void` |
| `toastHost` | `document.body` | built-in toast mount |

## Methods

```js
apiConfig.getModels()                  // copy of the model list
apiConfig.getCurrent()                 // current model or null
apiConfig.setCurrent(uidOrModel)
apiConfig.setLang('en' | 'zh')
apiConfig.open()          // edit current model
apiConfig.open('new')     // new model (blank form)
apiConfig.close()
apiConfig.onChange(({ models, current }) => {})
apiConfig.destroy()       // unmount DOM and global listeners
```

## Chat

```js
const text = await apiConfig.streamChat({
  messages: [{ role: 'user', content: 'hi' }],
  signal: controller.signal,
  maxTokens: 1024,
  onDelta: (piece, full) => render(full),
  onReasoning: (piece, full) => renderThinking(full)
});
```

Non-streaming (`application/json`) responses are parsed with an automatic fallback. Errors carry `kind` (`auth` / `not_found` / `http` / `protocol` / `stream` / `network` / `config`), `status`, and `url` (the actual request URL, for debugging path mistakes).

## Three formats

| Format | Path | Auth |
|---|---|---|
| OpenAI Chat Completions | `{base}/chat/completions` | `Authorization: Bearer` |
| OpenAI Responses API | `{base}/responses` | `Authorization: Bearer` |
| Anthropic Messages | `{base}/messages` | `x-api-key` + `anthropic-version` |

Trailing slashes are stripped; endpoint paths are never double-appended.
