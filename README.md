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

## 🔄 调用/跳转逻辑说明

1. **前端任意站点** 通过 `<a href="https://你的认证中心域名/login">QQ 登录</a>` 跳转发起认证。
2. `/login` 路由会生成随机 state，写入 Cookie，并重定向到 QQ 授权页。
3. 用户 QQ 授权后，QQ 平台回调到 `/qq` 路由（回调地址建议配置为 `/qq`，支持多域名自动适配）。
4. `/qq` 路由校验 state（防止CSRF），用 code 换取 access_token 和 openid，再获取用户信息。
5. 认证成功后，自动渲染结果页，并在 3 秒后自动跳转回主站（默认 https://lz-0315.com，可按需自定义）。
6. 如需支持“回跳到不同来源网站”，可在 `/login` 时带上 `?redirect=xxx` 参数，后续 `/qq` 回调后跳转到该地址（需自行实现安全校验，防止开放跳转漏洞）。

**调用流程示意：**

```
前端站点 → /login → QQ授权 → /qq（回调）→ 认证中心 → 主站/自定义跳转
```

**安全说明：**
- state 校验防止CSRF攻击
- 支持多域名部署，REDIRECT_URI 推荐填写 `/qq`
- 如需自定义跳转目标，务必校验 redirect 参数来源，防止钓鱼/跳转攻击
