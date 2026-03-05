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
   - `REDIRECT_URI`: 你的回调地址（如 `https://your-domain.com/qq`）
5. 在 **Triggers** 中绑定你的自定义域名。

## 🛠️ 技术栈
- **Runtime:** Cloudflare Workers (Edge Computing)
- **Auth Protocol:** OAuth 2.0 / OpenID Connect
- **API:** QQ Connect `get_user_info`

## 📝 说明
本项目由 [辛巳学习网](https://www.lz-0315.com) 维护，为静态站点提供轻量级、无服务器的 QQ 登录认证中转能力。