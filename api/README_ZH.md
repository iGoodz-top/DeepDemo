# api-config

零依赖自定义模型配置模块（UMD，暴露 `window.ApiConfig`）。支持多模型增删改切换、三种 API 格式、连通测试、流式对话。中英双语界面（`setLang` 切换）。

[English](README.md)

## 引入

```html
<link rel="stylesheet" href="./api-config.css" />
<script src="./api-config.js"></script>
```

## 实例化

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

| 选项 | 默认 | 说明 |
|---|---|---|
| `storageKey` | `api_config_model_list` | 模型列表的 localStorage 键；选中项存于 `<key>:current` |
| `selectorEl` | `document.body` | 下拉 + 齿轮按钮的挂载点 |
| `modalEl` / `modalHost` | `document.body` | 弹窗挂载点 |
| `lang` | `zh` | `zh` / `en` |
| `themeAttr` | `data-theme` | 从宿主 `html`/`body` 读取该属性同步深浅色；传 `false` 关闭 |
| `theme` | - | `dark` / `light` 强制指定，优先于 `themeAttr` |
| `defaultSystem` | `''` | 新建模型的 System 初值；留空则请求体不带 system 字段 |
| `defaultTemp` | `0.7` | Temperature 默认值（范围 0 ~ 2） |
| `maxTokens` | `4096` | 单次请求默认上限，模型级 `maxTokens` 可覆盖 |
| `timeoutMs` | `20000` | 连通测试超时 |
| `persistCurrent` | `true` | 是否记住当前选中模型 |
| `onToast` | 内置气泡 | 提示回调 `(msg) => void` |
| `toastHost` | `document.body` | 内置气泡挂载点 |

## 方法

```js
apiConfig.getModels()                  // 模型列表副本
apiConfig.getCurrent()                 // 当前模型或 null
apiConfig.setCurrent(uidOrModel)
apiConfig.setLang('en' | 'zh')
apiConfig.open()          // 编辑当前模型
apiConfig.open('new')     // 新建（空白表单）
apiConfig.close()
apiConfig.onChange(({ models, current }) => {})
apiConfig.destroy()       // 卸载 DOM 与全局监听
```

## 对话

```js
const text = await apiConfig.streamChat({
  messages: [{ role: 'user', content: 'hi' }],
  signal: controller.signal,
  maxTokens: 1024,
  onDelta: (piece, full) => render(full),
  onReasoning: (piece, full) => renderThinking(full)
});
```

非流式（`application/json`）响应会自动回落解析。错误对象带 `kind`（`auth` / `not_found` / `http` / `protocol` / `stream` / `network` / `config`）、`status`、`url`（实际请求地址，便于排查路径拼错）。

## 三种格式

| 格式 | 路径 | 鉴权 |
|---|---|---|
| OpenAI Chat Completions | `{base}/chat/completions` | `Authorization: Bearer` |
| OpenAI Responses API | `{base}/responses` | `Authorization: Bearer` |
| Anthropic Messages | `{base}/messages` | `x-api-key` + `anthropic-version` |

地址尾斜杠自动去除；已含接口路径时不重复拼接。
