// 前端首页渲染逻辑（仅UI相关JS）
export function renderHomePage() {
  return `
    <html lang="zh-CN">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>辛巳学习网认证中心</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@3.4.3/dist/tailwind.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" />
        <link rel="icon" href="https://www.lz-0315.com/favicon.ico" />
        <style>
          html, body { height: 100%; font-family: 'Inter', 'Microsoft YaHei', Arial, sans-serif; }
          body { min-height: 100vh; background: linear-gradient(135deg, #e0e7ff 0%, #bae6fd 100%); }
          .hero-bg {
            position: absolute;
            top: 0; left: 0; width: 100vw; height: 44vh;
            background: radial-gradient(ellipse at 60% 0%, #a5b4fc 0%, #60a5fa 60%, #38bdf8 100%);
            z-index: 0;
            filter: blur(1.5px) brightness(1.08);
            opacity: 0.95;
            animation: heroFadeIn 1.2s cubic-bezier(.4,2,.6,1) 0.1s both;
          }
          @keyframes heroFadeIn {
            from { opacity: 0; transform: translateY(-40px) scale(1.04); }
            to { opacity: 0.95; transform: none; }
          }
          .logo-gradient {
            background: conic-gradient(from 180deg at 50% 50%, #60a5fa 0deg, #a5b4fc 90deg, #38bdf8 180deg, #818cf8 270deg, #60a5fa 360deg);
          }
          .card-float {
            box-shadow: 0 8px 32px 0 rgba(56,189,248,0.18), 0 1.5px 8px 0 rgba(59,130,246,0.10);
            backdrop-filter: blur(2.5px);
            border-radius: 2rem;
            border: 1.5px solid #dbeafe;
            animation: cardPop 0.9s cubic-bezier(.4,2,.6,1) 0.2s both;
          }
          @keyframes cardPop {
            from { opacity: 0; transform: scale(0.98) translateY(40px); }
            to { opacity: 1; transform: none; }
          }
          .btn-qq {
            background: linear-gradient(90deg,#38bdf8 0%,#60a5fa 100%);
            box-shadow: 0 2px 12px 0 rgba(59,130,246,0.10);
            transition: all .18s cubic-bezier(.4,2,.6,1);
          }
          .btn-qq:hover {
            background: linear-gradient(90deg,#2563eb 0%,#38bdf8 100%);
            transform: scale(1.045) translateY(-2px);
            box-shadow: 0 4px 18px 0 rgba(59,130,246,0.18);
          }
          .btn-qq:active {
            transform: scale(0.98);
          }
          .divider {
            width: 100%; height: 1px; background: linear-gradient(90deg,#e0e7ff 0,#bae6fd 100%); margin: 2rem 0 1.5rem 0;
            opacity: 0.7;
          }
        </style>
      </head>
      <body class="relative min-h-screen flex flex-col items-center justify-center bg-transparent">
        <div class="hero-bg"></div>
        <main class="relative z-10 flex flex-col items-center justify-center w-full min-h-[80vh]">
          <div class="card-float bg-white/95 shadow-2xl rounded-3xl p-10 flex flex-col items-center max-w-lg w-full border border-blue-100 mt-10">
            <div class="flex flex-col items-center gap-3 mb-7">
              <div class="logo-gradient w-24 h-24 rounded-full flex items-center justify-center shadow-xl border-4 border-white animate-spin-slow">
                <img src="https://www.lz-0315.com/favicon.ico" class="w-16 h-16 rounded-full border-2 border-blue-200 bg-white" alt="logo" />
              </div>
              <span class="text-4xl font-extrabold text-blue-700 tracking-tight drop-shadow-sm mt-2 flex items-center gap-2">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#3b82f6"/><text x="12" y="17" text-anchor="middle" font-size="14" fill="#fff" font-family="Arial">辛巳</text></svg>
                认证中心
              </span>
              <span class="text-base text-blue-400 font-semibold tracking-wide">Cloudflare Workers · QQ OAuth2.0</span>
            </div>
            <div class="text-lg text-gray-700 mb-2 font-semibold flex items-center gap-2">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 3a7 7 0 110 14 7 7 0 010-14z" fill="#60a5fa"/></svg>
              欢迎使用 <b>辛巳学习网认证中心</b>
            </div>
            <a href="/login" class="btn-qq px-10 py-3 text-white rounded-2xl shadow-xl font-bold text-lg tracking-wide mb-4 mt-2 scale-100 hover:scale-105 active:scale-95 duration-150 flex items-center gap-2">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#38bdf8"/><path d="M8 12l2.5 2.5L16 9" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              QQ 登录
            </a>
            <div class="divider"></div>
            <div class="w-full">
              <div class="text-base font-semibold text-blue-700 mb-2">调用/使用说明</div>
              <div class="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-5 text-sm text-gray-700 shadow-sm">
                <ol class="list-decimal list-inside space-y-1">
                  <li>前端静态站点通过 <span class="font-mono text-blue-600">/login</span> 跳转发起 QQ 登录。</li>
                  <li>用户授权后，回调 <span class="font-mono text-blue-600">/qq</span>，自动获取用户信息。</li>
                  <li>登录成功后页面会自动跳转回主站，可根据需要自定义跳转逻辑。</li>
                  <li>支持多域名部署，<span class="font-mono text-blue-600">REDIRECT_URI</span> 推荐填写 <span class="font-mono text-blue-600">/qq</span>。</li>
                </ol>
              </div>
            </div>
            <div class="mt-10 text-xs text-gray-400 flex items-center gap-2 select-none">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 3a7 7 0 110 14 7 7 0 010-14z" fill="#60a5fa"/></svg>
              © 2026 <a href="https://www.lz-0315.com" class="underline hover:text-blue-500">辛巳学习网</a>
              <span class="mx-1">|</span>
              <a href="https://github.com/lz-0315/auth_xinsi" class="underline hover:text-blue-500" target="_blank" rel="noopener">开源仓库</a>
            </div>
          </div>
        </main>
        <script>
          // logo 旋转动画
          document.querySelectorAll('.logo-gradient').forEach(el => {
            el.animate([
              { transform: 'rotate(0deg)' },
              { transform: 'rotate(360deg)' }
            ], {
              duration: 9000,
              iterations: Infinity,
              easing: 'linear'
            });
          });
        </script>
      </body>
    </html>
  `;
        }
