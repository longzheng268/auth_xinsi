# 🛡️ Auth-Xinsi (辛巳认证中心)

基于 Cloudflare Workers 的轻量级 QQ OAuth2.0 认证中转站。

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/longzheng268/auth_xinsi)

## 🚀 一键部署指南

1. 点击上方的 **Deploy to Cloudflare** 按钮。
2. 按照提示授权登录 Cloudflare 账号。
3. 部署完成后，进入 Worker 控制台 -> **Settings** -> **Variables**。
4. 添加以下环境变量：
   - `QQ_APP_ID`: 你的 QQ 互联 App ID
   - `QQ_APP_KEY`: 你的 QQ 互联 App Key
   - `REDIRECT_URI`: `/qq`（推荐，代码会自动拼接当前域名）
5. 在 **Triggers** 中绑定你的自定义域名。

## 🛠️ 技术栈
- **Runtime:** Cloudflare Workers (Edge Computing)
- **Auth Protocol:** OAuth 2.0 / OpenID Connect
- **API:** QQ Connect `get_user_info`

## 📝 说明

本项目由 [辛巳学习网](https://www.lz-0315.com) 维护，为静态站点提供轻量级、无服务器的 QQ 登录认证中转能力。

## ✨ 主要特性

- **极致毛玻璃 UI**：所有页面均采用统一 Glassmorphism 风格，现代美观，适配移动端和桌面端。
- **统一头像图标**：所有页面 logo 均引用 [GitHub 头像](https://github.com/longzheng268/homepage_xinsi/blob/main/assets/img/%E5%A4%B4%E5%83%8F.png?raw=true)，无需额外流量成本。
- **认证成功页动画**：登录成功后有绿色圆圈打勾动画，用户体验更丝滑。
- **静态 import 结构**：所有 UI 渲染函数（首页、结果页、错误页、管理页）均集中在 `src/home-ui.js`，主逻辑 `src/index.js` 只负责路由和 OAuth。
- **安全响应头**：默认添加 `X-Content-Type-Options`、`X-Frame-Options`、`Referrer-Policy` 等安全头，防止常见攻击。
- **开源仓库**：<https://github.com/lz-0315/auth_xinsi>

## 🖼️ UI 预览

![](https://github.com/longzheng268/homepage_xinsi/blob/main/assets/img/%E5%A4%B4%E5%83%8F.png?raw=true)

首页、认证成功页、错误页、管理页均为毛玻璃风格，主色调蓝白，极简现代。

## 🔄 调用/跳转逻辑说明


1. **前端任意站点** 通过 `<a href="https://你的认证中心域名/login">QQ 登录</a>` 跳转发起认证。
2. `/login` 路由生成随机 state，写入 Cookie，并重定向到 QQ 授权页。
3. 用户 QQ 授权后，QQ 平台回调到 `/qq` 路由（回调地址建议配置为 `/qq`，支持多域名自动适配）。
4. `/qq` 路由校验 state（防止CSRF），用 code 换取 access_token 和 openid，再获取用户信息。
5. 认证成功后，自动渲染毛玻璃风格结果页，并在 3 秒后自动跳转回主站（默认 https://lz-0315.com，可按需自定义）。
6. 如需支持“回跳到不同来源网站”，可在 `/login` 时带上 `?redirect=xxx` 参数，后续 `/qq` 回调后跳转到该地址（需自行实现安全校验，防止开放跳转漏洞）。

**调用流程示意：**

```
前端站点 → /login → QQ授权 → /qq（回调）→ 认证中心 → 主站/自定义跳转
```

**安全说明：**
- state 校验防止CSRF攻击
- 支持多域名部署，REDIRECT_URI 推荐填写 `/qq`
- 如需自定义跳转目标，务必校验 redirect 参数来源，防止钓鱼/跳转攻击
- 建议开启 Cloudflare Workers 的 "Hotlink Protection"，防止 GitHub 头像被盗链失效
