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
          <div class="flex items-center gap-3 mb-4">
            <img src="https://www.lz-0315.com/favicon.ico" class="w-10 h-10 rounded-full shadow" alt="logo">
            <span class="text-3xl font-extrabold text-blue-700 tracking-tight">认证中心</span>
          </div>
          <div class="text-lg text-gray-700 mb-2">欢迎使用 <b>辛巳学习网认证中心</b></div>
          <div class="text-gray-500 mb-6">Cloudflare Workers · QQ OAuth2.0</div>
          <a href="/login" class="px-7 py-2 bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-xl shadow-lg hover:from-blue-600 hover:to-blue-500 transition font-semibold text-lg">QQ 登录</a>
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
