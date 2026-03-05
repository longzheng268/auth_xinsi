// 前端首页渲染逻辑（仅UI相关JS）
export function renderHomePage() {
  return `
    <html>
      <head>
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@3.4.3/dist/tailwind.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap">
        <title>辛巳学习网认证中心</title>
        <style>
          .logo-gradient {
            background: conic-gradient(from 180deg at 50% 50%, #60a5fa 0deg, #a5b4fc 90deg, #38bdf8 180deg, #818cf8 270deg, #60a5fa 360deg);
          }
        </style>
      </head>
      <body class="bg-gradient-to-br from-blue-100 via-blue-200 to-blue-400 min-h-screen flex flex-col items-center justify-center font-[Inter,sans-serif]">
        <div class="bg-white/95 shadow-2xl rounded-3xl p-10 flex flex-col items-center max-w-lg w-full border border-blue-100">
          <div class="flex flex-col items-center gap-3 mb-7">
            <div class="logo-gradient w-24 h-24 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
              <img src="https://www.lz-0315.com/favicon.ico" class="w-16 h-16 rounded-full border-2 border-blue-200 bg-white" alt="logo">
            </div>
            <span class="text-4xl font-extrabold text-blue-700 tracking-tight drop-shadow-sm mt-2">辛巳认证中心</span>
            <span class="text-base text-blue-400 font-semibold tracking-wide">Cloudflare Workers · QQ OAuth2.0</span>
          </div>
          <div class="text-lg text-gray-700 mb-2 font-semibold">欢迎使用 <b>辛巳学习网认证中心</b></div>
          <a href="/login" class="px-10 py-3 bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-2xl shadow-xl hover:from-blue-600 hover:to-blue-500 transition font-bold text-lg tracking-wide mb-4 mt-2">QQ 登录</a>
          <div class="w-full mt-6">
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
          <div class="mt-10 text-xs text-gray-400">© 2026 <a href="https://www.lz-0315.com" class="underline hover:text-blue-500">辛巳学习网</a></div>
        </div>
      </body>
    </html>
  `;
}
