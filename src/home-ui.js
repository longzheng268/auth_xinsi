// 前端 UI 渲染逻辑 - 2026 辛巳认证中心 V2.0
// 统一毛玻璃 (Glassmorphism) 风格

const LOGO_URL = "https://github.com/longzheng268/homepage_xinsi/blob/main/assets/img/%E5%A4%B4%E5%83%8F.png?raw=true";

// 公共 <head> 样式，所有页面共用
function sharedHead(title = '辛巳学习网认证中心') {
  return `
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${title}</title>
    <script src="https://cdn.tailwindcss.com"><\/script>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" />
    <link rel="icon" href="${LOGO_URL}" />
    <style>
      body {
        font-family: 'Inter', 'Microsoft YaHei', system-ui, -apple-system, sans-serif;
        background: #f0f4f8;
      }
      .glass {
        background: rgba(255, 255, 255, 0.82);
        backdrop-filter: blur(16px) saturate(1.8);
        -webkit-backdrop-filter: blur(16px) saturate(1.8);
        border: 1px solid rgba(255, 255, 255, 0.35);
      }
      .hero-gradient {
        background: radial-gradient(circle at top right, #dbeafe 0%, #f0f9ff 50%, #eff6ff 100%);
      }
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(24px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .animate-slide-up {
        animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @keyframes pulse-ring {
        0%   { transform: scale(1);   opacity: 0.25; }
        50%  { transform: scale(1.1); opacity: 0.12; }
        100% { transform: scale(1);   opacity: 0.25; }
      }
      .pulse-ring { animation: pulse-ring 3s ease-in-out infinite; }
      .btn-primary {
        background: #12b7f5;
        transition: all 0.3s ease;
      }
      .btn-primary:hover {
        background: #0ea5e9;
        transform: translateY(-2px);
        box-shadow: 0 12px 20px -4px rgba(18, 183, 245, 0.35);
      }
      .btn-primary:active { transform: scale(0.97); }
    </style>
  `;
}

// ===================== 首页 =====================
export function renderHomePage() {
  return `
    <!DOCTYPE html>
    <html lang="zh-CN">
      <head>
        ${sharedHead()}
      </head>
      <body class="hero-gradient min-h-screen flex items-center justify-center p-4">

        <div class="animate-slide-up glass max-w-md w-full rounded-[2.5rem] shadow-2xl p-8 md:p-12 text-center">

          <!-- Logo -->
          <div class="relative mx-auto w-28 h-28 mb-6">
            <div class="absolute inset-0 bg-blue-400 rounded-full blur-xl pulse-ring"></div>
            <img src="${LOGO_URL}"
                 class="relative w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover"
                 alt="辛巳学习网" />
          </div>

          <!-- 标题 -->
          <h1 class="text-3xl font-extrabold text-slate-800 mb-1 tracking-tight">辛巳认证中心</h1>
          <p class="text-slate-500 font-medium mb-8">Cloudflare Workers · 安全认证服务</p>

          <!-- QQ 登录按钮 -->
          <a href="/login"
             class="btn-primary w-full flex items-center justify-center gap-3 py-4 text-white rounded-2xl font-bold text-lg mb-8 group">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="rgba(255,255,255,0.25)"/>
              <path d="M8 12l2.5 2.5L16 9" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            使用 QQ 登录
          </a>

          <!-- 调用说明 -->
          <div class="bg-slate-50/80 rounded-2xl p-6 text-left border border-slate-100">
            <h2 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">API 调用说明</h2>
            <ul class="space-y-3 text-sm text-slate-600">
              <li class="flex items-start gap-2.5">
                <span class="mt-0.5 w-2 h-2 rounded-full bg-blue-400 shrink-0"></span>
                <span>外部站点通过 <code class="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-xs font-mono">/login?from=回调URL</code> 发起登录</span>
              </li>
              <li class="flex items-start gap-2.5">
                <span class="mt-0.5 w-2 h-2 rounded-full bg-blue-400 shrink-0"></span>
                <span>认证成功后 <b class="text-slate-700">立即回调</b> 到来源站点，携带 openid、nickname 等用户信息</span>
              </li>
              <li class="flex items-start gap-2.5">
                <span class="mt-0.5 w-2 h-2 rounded-full bg-blue-400 shrink-0"></span>
                <span>仅接受 <code class="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-xs font-mono">ALLOWED_ORIGINS</code> 白名单中的域名回调</span>
              </li>
              <li class="flex items-start gap-2.5">
                <span class="mt-0.5 w-2 h-2 rounded-full bg-blue-400 shrink-0"></span>
                <span>仅允许通过 <code class="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-xs font-mono">REDIRECT_URI</code> 域名访问，其他域名被拦截</span>
              </li>
              <li class="flex items-start gap-2.5">
                <span class="mt-0.5 w-2 h-2 rounded-full bg-blue-400 shrink-0"></span>
                <span>由 Cloudflare Edge 网络提供全球加速与隐私保护</span>
              </li>
            </ul>
          </div>

          <!-- 页脚 -->
          <footer class="mt-8 text-xs text-slate-400 flex items-center justify-center gap-1.5 flex-wrap">
            <span>© 2026</span>
            <a href="https://www.lz-0315.com" class="hover:text-blue-500 underline underline-offset-2">辛巳学习网</a>
            <span class="mx-0.5">|</span>
            <a href="https://github.com/longzheng268/auth_xinsi" class="hover:text-blue-500 underline underline-offset-2" target="_blank" rel="noopener">辛巳统一登录接口开源仓库</a>
          </footer>
        </div>

      </body>
    </html>
  `;
}

// ===================== 认证成功页 =====================
export function renderResultPage(user) {
  const gender = user.gender === '男' ? '男 ♂' : user.gender === '女' ? '女 ♀' : user.gender;
  return `
    <!DOCTYPE html>
    <html lang="zh-CN">
      <head>
        ${sharedHead('认证成功 - 辛巳认证中心')}
        <style>
          @keyframes checkPop {
            0%   { transform: scale(0) rotate(-45deg); opacity: 0; }
            60%  { transform: scale(1.15) rotate(0); opacity: 1; }
            100% { transform: scale(1) rotate(0); opacity: 1; }
          }
          .check-pop { animation: checkPop 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards; opacity: 0; }
        </style>
      </head>
      <body class="hero-gradient min-h-screen flex items-center justify-center p-4">
        <div class="animate-slide-up glass max-w-md w-full rounded-[2.5rem] shadow-2xl p-8 md:p-10 flex flex-col items-center text-center">

          <!-- 成功打勾动画 -->
          <div class="relative w-20 h-20 mb-2">
            <div class="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-20 pulse-ring"></div>
            <div class="check-pop relative w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
              <svg class="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
          </div>

          <!-- 用户头像 -->
          <img src="${user.figureurl_qq_2 || user.figureurl_qq_1}"
               class="w-20 h-20 rounded-full border-4 border-white shadow-md mt-3 mb-3 object-cover" alt="avatar" />
          <h1 class="text-2xl font-extrabold text-slate-800 mb-1">你好，${user.nickname}</h1>
          <div class="text-slate-500 text-sm mb-4 space-x-3">
            <span>${gender}</span>
            <span>·</span>
            <span>${user.province || ''} ${user.city || ''}</span>
          </div>
          <div class="text-slate-400 text-xs mb-5 font-mono bg-slate-50 px-3 py-1.5 rounded-lg">OpenID: ${user.openid}</div>

          <div class="text-green-600 font-semibold text-sm mb-4">✅ 认证成功</div>
          <p class="text-slate-400 text-xs mb-4">此页面为直接访问结果。如需回调，请从外部站点通过 <code class="bg-blue-50 text-blue-600 px-1 rounded text-xs">/login?from=回调URL</code> 发起登录。</p>
          <a href="/" class="text-blue-500 hover:text-blue-600 text-sm underline underline-offset-2">返回首页</a>
      </body>
    </html>
  `;
}

// ===================== 错误页 =====================
export function renderErrorPage(msg) {
  return `
    <!DOCTYPE html>
    <html lang="zh-CN">
      <head>
        ${sharedHead('认证失败 - 辛巳认证中心')}
      </head>
      <body class="hero-gradient min-h-screen flex items-center justify-center p-4">
        <div class="animate-slide-up glass max-w-md w-full rounded-[2.5rem] shadow-2xl p-8 md:p-10 text-center">
          <div class="mx-auto w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg mb-5">
            <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </div>
          <h2 class="text-2xl font-extrabold text-slate-800 mb-2">认证失败</h2>
          <p class="text-slate-500 mb-6 text-sm leading-relaxed">${msg}</p>
          <a href="/login"
             class="btn-primary inline-flex items-center gap-2 px-8 py-3 text-white rounded-2xl font-bold text-base">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            重新登录
          </a>
        </div>
      </body>
    </html>
  `;
}

// ===================== 管理/初始化页 =====================
export function renderAdminPage(env) {
  const vars = [
    { key: 'QQ_APP_ID',       value: env.QQ_APP_ID },
    { key: 'QQ_APP_KEY',      value: env.QQ_APP_KEY },
    { key: 'REDIRECT_URI',    value: env.REDIRECT_URI },
    { key: 'ALLOWED_ORIGINS', value: env.ALLOWED_ORIGINS }
  ];
  return `
    <!DOCTYPE html>
    <html lang="zh-CN">
      <head>
        ${sharedHead('初始化 - 辛巳认证中心')}
      </head>
      <body class="hero-gradient min-h-screen flex items-center justify-center p-4">
        <div class="animate-slide-up glass max-w-md w-full rounded-[2.5rem] shadow-2xl p-8 md:p-10">

          <div class="flex items-center gap-3 mb-5">
            <div class="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center shadow-md">
              <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-extrabold text-slate-800">认证中心初始化</h2>
              <p class="text-slate-400 text-sm">请配置以下环境变量</p>
            </div>
          </div>

          <div class="bg-slate-50/80 rounded-2xl p-5 border border-slate-100 mb-6 space-y-3">
            ${vars.map(s => `
              <div class="flex items-center justify-between">
                <code class="text-sm font-mono text-slate-600">${s.key}</code>
                <span class="text-sm font-semibold ${s.value ? 'text-green-500' : 'text-red-400'}">${s.value ? '✅ 已设置' : '❌ 未设置'}</span>
              </div>
            `).join('')}
          </div>

          <p class="text-slate-400 text-xs mb-3">REDIRECT_URI 填写纯域名，如 <code class="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded text-xs font-mono">auth.lz-0315.com</code></p>
          <p class="text-slate-400 text-xs mb-5">ALLOWED_ORIGINS 填写允许回调的域名（逗号分隔），如 <code class="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded text-xs font-mono">lz-0315.com,www.lz-0315.com</code></p>

          <a href="/login"
             class="btn-primary w-full flex items-center justify-center gap-2 py-3 text-white rounded-2xl font-bold text-base">
            去登录测试
          </a>
        </div>
      </body>
    </html>
  `;
}
