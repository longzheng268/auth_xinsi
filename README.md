# 🛡️ Auth-Xinsi (辛巳认证中心)

基于 Cloudflare Workers 的轻量级 QQ OAuth2.0 跨域认证接口，支持外部站点调用并回调用户信息。

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/longzheng268/auth_xinsi)

---

## 🚀 部署指南

1. 点击上方 **Deploy to Cloudflare** 按钮，按提示授权并部署。
2. 部署完成后，进入 **Cloudflare Dashboard → Workers → Settings → Variables**，配置以下环境变量：

| 环境变量 | 说明 | 示例 |
|---|---|---|
| `QQ_APP_ID` | QQ 互联应用 App ID | `10xxxxxx` |
| `QQ_APP_KEY` | QQ 互联应用 App Key | `a1b2c3d4...` |
| `REDIRECT_URI` | 认证中心部署的**纯域名**（不含协议和路径） | `auth.lz-0315.com` |
| `ALLOWED_ORIGINS` | 允许回调的来源域名白名单（逗号分隔，支持子域名匹配） | `lz-0315.com,www.lz-0315.com` |

3. 在 **Triggers** 中绑定你的自定义域名（即 `REDIRECT_URI` 所填的域名）。

> ⚠️ 本仓库为公开仓库，`wrangler.toml` 中所有环境变量值均为空占位。**请务必在 Cloudflare Dashboard 中设置真实值，切勿提交到代码中。**

---

## 🛠️ 技术栈

- **Runtime:** Cloudflare Workers (ES Modules, Edge Computing)
- **Auth Protocol:** OAuth 2.0 — QQ Connect
- **API:** `graph.qq.com` — `get_user_info`
- **UI:** Tailwind CSS (CDN) + Glassmorphism 毛玻璃设计

---

## ✨ 主要特性

| 特性 | 说明 |
|---|---|
| 🌐 **跨域回调认证** | 外部站点通过 `/login?from=回调URL` 调用，认证后立即 302 回跳并携带用户信息 |
| 🔒 **域名守卫** | 仅允许通过 `REDIRECT_URI` 配置的域名访问，自动拦截 `*.workers.dev` 等未授权域名 |
| �� **白名单机制** | `ALLOWED_ORIGINS` 环境变量控制哪些域名可以发起登录回调，防止开放重定向攻击 |
| 🍪 **Cookie 状态管理** | CSRF state + 回调来源 (`from`) 存于 HttpOnly Cookie，Max-Age=600（10 分钟超时） |
| 🎨 **Glassmorphism UI** | 所有页面采用统一毛玻璃风格，适配桌面和移动端 |
| 🔐 **安全响应头** | 默认添加 `X-Content-Type-Options`、`X-Frame-Options`、`Referrer-Policy` |
| 📦 **模块化架构** | UI 渲染与路由逻辑分离：`index.js` 处理路由/OAuth，`home-ui.js` 负责页面渲染 |

---

## 🔄 调用流程

### 外部站点调用（推荐用法）

```
┌─────────────┐        ┌──────────────────────────┐        ┌───────────────┐
│  外部站点     │        │  辛巳认证中心              │        │  QQ OAuth     │
│  (调用方)     │        │  auth.lz-0315.com        │        │  graph.qq.com │
└──────┬──────┘        └────────────┬─────────────┘        └───────┬───────┘
       │                            │                              │
       │ 1. 重定向用户到             │                              │
       │ /login?from=回调URL ──────→│                              │
       │                            │ 2. 校验 from 白名单           │
       │                            │    写入 state + from Cookie   │
       │                            │                              │
       │                            │ 3. 302 重定向 ──────────────→│
       │                            │    到 QQ 授权页               │
       │                            │                              │
       │                            │ 4. 用户授权后                 │
       │                            │←────────── QQ 回调到 /qq ────│
       │                            │    (携带 code + state)        │
       │                            │                              │
       │                            │ 5. 校验 state                │
       │                            │    code → token → openid     │
       │                            │    → get_user_info            │
       │                            │                              │
       │ 6. 立即 302 回调            │                              │
       │←────── /qq 跳转回 from ────│                              │
       │  ?openid=xx&nickname=xx    │                              │
       │  &avatar=xx&gender=xx      │                              │
       │  &province=xx&city=xx      │                              │
       │                            │                              │
       │ 7. 外部站点接收参数          │                              │
       │    完成自身登录逻辑          │                              │
       ▼                            ▼                              ▼
```

### 调用示例

**外部站点 HTML（发起登录）：**

```html
<a href="https://auth.lz-0315.com/login?from=https://www.lz-0315.com/auth/callback">
  QQ 登录
</a>
```

**外部站点回调页面接收参数（示例 JS）：**

```javascript
const params = new URLSearchParams(window.location.search);
const userInfo = {
  openid:   params.get('openid'),
  nickname: params.get('nickname'),
  avatar:   params.get('avatar'),
  gender:   params.get('gender'),
  province: params.get('province'),
  city:     params.get('city'),
};
console.log('登录用户:', userInfo);
```

### 回调参数说明

| 参数 | 说明 | 示例 |
|---|---|---|
| `openid` | 用户唯一标识（QQ OpenID） | `A1B2C3D4E5F6...` |
| `nickname` | QQ 昵称 | `辛巳` |
| `avatar` | QQ 头像 URL（100×100） | `https://thirdqq.qlogo.cn/...` |
| `gender` | 性别 | `男` / `女` |
| `province` | 省份 | `广东` |
| `city` | 城市 | `深圳` |

### 直接访问

如果用户直接在浏览器访问 `https://auth.lz-0315.com/login`（不带 `from` 参数），认证成功后将显示静态结果页，不会自动跳转。

---

## 🔐 安全机制

| 机制 | 说明 |
|---|---|
| **域名守卫** | `REDIRECT_URI` 域名之外的请求一律返回 403，杜绝通过 `*.workers.dev` 访问 |
| **白名单校验** | `from` 参数必须匹配 `ALLOWED_ORIGINS` 中的域名（支持子域名），否则拒绝回调 |
| **CSRF 防护** | 登录时生成随机 `state` 写入 Cookie，QQ 回调时严格校验，防止跨站请求伪造 |
| **Cookie 超时** | 认证 Cookie `Max-Age=600`（10 分钟），超时自动失效 |
| **HttpOnly Cookie** | `state` 和 `from` 均为 HttpOnly，JavaScript 无法读取 |
| **安全响应头** | 所有响应附带 `X-Content-Type-Options`、`X-Frame-Options: DENY`、`Referrer-Policy` |

---

## 📂 项目结构

```
auth_xinsi/
├── src/
│   ├── index.js       # 主路由 + OAuth 逻辑 + 域名守卫
│   └── home-ui.js     # 页面渲染（首页/结果页/错误页/管理页）
├── wrangler.toml      # Cloudflare Workers 配置（环境变量占位）
└── README.md
```

---

## 📝 说明

本项目由 [辛巳学习网](https://www.lz-0315.com) 维护，为静态站点提供轻量级、无服务器的 QQ 跨域认证能力。

**开源仓库：** <https://github.com/longzheng268/auth_xinsi>
