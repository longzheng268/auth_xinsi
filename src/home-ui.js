// 前端首页渲染逻辑（仅UI相关JS）
export function renderHomePage() {
  return `
    <html>
      <head>
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@3.4.3/dist/tailwind.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap">
        <script type="module" src="/home-ui.js"></script>
        <title>辛巳学习网认证中心</title>
      </head>
      <body class="bg-gradient-to-br from-blue-100 to-blue-400 min-h-screen flex flex-col items-center justify-center font-[Inter,sans-serif]">
        <div class="bg-white/90 shadow-2xl rounded-3xl p-10 flex flex-col items-center max-w-lg w-full">
          <div class="flex flex-col items-center gap-2 mb-6">
            <div class="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center border-4 border-blue-200 mb-2">
              <img src="https://www.lz-0315.com/favicon.ico" class="w-14 h-14 rounded-full" alt="logo">
            </div>
            <span class="text-4xl font-extrabold text-blue-700 tracking-tight drop-shadow">辛巳认证中心</span>
          </div>
          <div class="text-base text-gray-700 mb-1 font-semibold">欢迎使用 <b>辛巳学习网认证中心</b></div>
          <div class="text-sm text-blue-500 mb-6 font-medium">Cloudflare Workers · QQ OAuth2.0</div>
          <a href="/login" class="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-2xl shadow-xl hover:from-blue-600 hover:to-blue-500 transition font-bold text-lg tracking-wide mb-2">QQ 登录</a>
          <div class="mt-8 w-full">
            <div class="text-base font-semibold text-blue-700 mb-2 mt-6">调用/使用说明</div>
            <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-gray-700">
              1. 前端静态站点通过 <span class="font-mono">/login</span> 跳转发起 QQ 登录。<br>
              2. 用户授权后，回调 <span class="font-mono">/qq</span>，自动获取用户信息。<br>
              3. 登录成功后页面会自动跳转回主站，可根据需要自定义跳转逻辑。<br>
              4. 支持多域名部署，<span class="font-mono">REDIRECT_URI</span> 推荐填写 <span class="font-mono">/qq</span>。
            </div>
          </div>
          <div class="mt-8 text-xs text-gray-400">© 2026 <a href="https://www.lz-0315.com" class="underline hover:text-blue-500">辛巳学习网</a></div>
        </div>
      </body>
    </html>
  `;
}
