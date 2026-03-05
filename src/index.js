export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const isConfigured = env.QQ_APP_ID && env.QQ_APP_KEY;

    // 1. 配置引导页
    if (!isConfigured && url.pathname === "/") {
      return new Response(renderAdminPage(env), {
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    }

    // 2. QQ 登录入口，生成 state
    if (url.pathname === "/login") {
      // 生成随机 state
      const state = cryptoRandomString(16);
      // 设置 state 到 cookie
      // 支持 REDIRECT_URI 仅填写路径（如 /qq），自动拼接域名
      let redirectUri = env.REDIRECT_URI || '/qq';
      if (redirectUri.startsWith('/')) {
        redirectUri = url.origin + redirectUri;
      }
      const loginUrl = `https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=${env.QQ_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
      return new Response('', {
        status: 302,
        headers: {
          'Location': loginUrl,
          'Set-Cookie': `qq_oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax`,
        }
      });
    }

    // 3. QQ 回调
    if (url.pathname === "/qq") {
      const code = url.searchParams.get("code");
      const state = url.searchParams.get("state");
      const cookie = parseCookie(request.headers.get('Cookie') || '');
      const savedState = cookie.qq_oauth_state;
      if (!code) return renderErrorPage("缺少 code 参数");
      if (!state || !savedState || state !== savedState) {
        return renderErrorPage("state 校验失败，请重试登录。");
      }
      try {
        // A. 换取 Access Token
        // 支持 REDIRECT_URI 仅填写路径（如 /qq），自动拼接域名
        let redirectUri = env.REDIRECT_URI || '/qq';
        if (redirectUri.startsWith('/')) {
          redirectUri = url.origin + redirectUri;
        }
        const tokenResp = await fetch(
          `https://graph.qq.com/oauth2.0/token?grant_type=authorization_code&client_id=${env.QQ_APP_ID}&client_secret=${env.QQ_APP_KEY}&code=${code}&redirect_uri=${encodeURIComponent(redirectUri)}&fmt=json`
        );
        const tokenData = await tokenResp.json();
        if (!tokenData.access_token) {
          return renderErrorPage(`QQ 授权失败：${tokenData.error_description || JSON.stringify(tokenData)}`);
        }

        // B. 获取 OpenID
        const meResp = await fetch(`https://graph.qq.com/oauth2.0/me?access_token=${tokenData.access_token}&fmt=json`);
        const meData = await meResp.json();
        if (!meData.openid) {
          return renderErrorPage(`获取 OpenID 失败：${meData.error_description || JSON.stringify(meData)}`);
        }

        // C. 获取用户信息
        const userResp = await fetch(
          `https://graph.qq.com/user/get_user_info?access_token=${tokenData.access_token}&oauth_consumer_key=${env.QQ_APP_ID}&openid=${meData.openid}`
        );
        const userInfo = await userResp.json();
        if (userInfo.ret !== 0) {
          return renderErrorPage(`获取用户信息失败：${userInfo.msg || JSON.stringify(userInfo)}`);
        }
        userInfo.openid = meData.openid;

        // D. 返回精美结果页
        return new Response(renderResultPage(userInfo), {
          headers: { "Content-Type": "text/html; charset=utf-8" }
        });
      } catch (e) {
        return renderErrorPage("服务器异常，请稍后重试。\n" + e.message);
      }
    }

    // 4. 默认首页
    return new Response(await importHomePageHtml(), { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } });
  // 动态加载首页 HTML（与 home-ui.js 分离，便于维护和现代化UI）
  async function importHomePageHtml() {
    // 这里直接读取 home-ui.js 的渲染函数
    const mod = await import('./home-ui.js');
    return mod.renderHomePage();
  }
  // --- 默认首页美化 ---
  function renderHomePage() {
    return `
      <html>
        <head>
          <meta name="viewport" content="width=device-width,initial-scale=1">
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        </head>
        <body class="bg-gradient-to-br from-blue-100 to-blue-300 min-h-screen flex flex-col items-center justify-center">
          <div class="bg-white bg-opacity-90 shadow-xl rounded-2xl p-10 flex flex-col items-center max-w-lg w-full">
            <div class="text-4xl mb-4 font-extrabold text-blue-600 flex items-center gap-2">
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#3b82f6"/><text x="12" y="17" text-anchor="middle" font-size="14" fill="#fff" font-family="Arial">辛巳</text></svg>
              认证中心
            </div>
            <div class="text-lg text-gray-700 mb-2">欢迎使用 <b>辛巳学习网认证中心</b></div>
            <div class="text-gray-500 mb-6">基于 Cloudflare Workers · QQ OAuth2.0</div>
            <a href="/login" class="px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition">QQ 登录</a>
            <div class="mt-8 w-full">
              <div class="text-base font-semibold text-blue-700 mb-2 mt-6">调用/使用说明</div>
              <div class="bg-blue-50 border border-blue-200 rounded p-4 text-sm text-gray-700">
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
  }
};

// --- 工具函数 ---
function cryptoRandomString(length) {
  // 生成随机字符串（仅小写字母和数字，适合 state）
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  for (let i = 0; i < length; i++) {
    result += chars[arr[i] % chars.length];
  }
  return result;
}

function parseCookie(cookieStr) {
  const obj = {};
  cookieStr.split(';').forEach(pair => {
    const [k, v] = pair.split('=');
    if (k && v) obj[k.trim()] = decodeURIComponent(v.trim());
  });
  return obj;
}

function renderErrorPage(msg) {
  return new Response(`
    <html>
      <head>
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      </head>
      <body class="bg-red-50 flex flex-col items-center justify-center min-h-screen">
        <div class="bg-white shadow-lg rounded-lg p-8 mt-12 max-w-md w-full">
          <h2 class="text-2xl font-bold text-red-600 mb-4">认证失败</h2>
          <p class="text-gray-700 mb-6">${msg}</p>
          <a href="/login" class="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">重新登录</a>
        </div>
      </body>
    </html>
  `, { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

// --- 简单的 HTML 模板 ---
function renderAdminPage(env) {
  // 环境变量状态
  const status = [
    { key: 'QQ_APP_ID', value: env.QQ_APP_ID },
    { key: 'QQ_APP_KEY', value: env.QQ_APP_KEY },
    { key: 'REDIRECT_URI', value: env.REDIRECT_URI }
  ];
  return `
    <html>
      <head>
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      </head>
      <body class="bg-gray-50 min-h-screen flex flex-col items-center justify-center">
        <div class="bg-white shadow-lg rounded-lg p-8 mt-12 max-w-md w-full">
          <h2 class="text-2xl font-bold mb-4">🛠 认证中心初始化</h2>
          <p class="mb-4">检测到环境变量尚未配置。请前往 Cloudflare Worker 控制台设置以下变量：</p>
          <ul class="mb-4">
            ${status.map(s => `<li class="flex items-center mb-1"><span class="font-mono w-32">${s.key}</span> <span class="ml-2 ${s.value ? 'text-green-600' : 'text-red-500'}">${s.value ? '✔️ 已设置' : '❌ 未设置'}</span></li>`).join('')}
          </ul>
          <p class="text-sm text-gray-500 mb-2">REDIRECT_URI 推荐填写: <b>https://auth.lz-0315.com/qq</b></p>
          <a href="/login" class="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">去登录测试</a>
        </div>
      </body>
    </html>
  `;
}

function renderResultPage(user) {
  // 性别友好显示
  const gender = user.gender === '男' ? '男 ♂' : user.gender === '女' ? '女 ♀' : user.gender;
  return `
    <html>
      <head>
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <style>
          .progress-bar { height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden; }
          .progress-inner { height: 100%; background: linear-gradient(90deg,#12b7f5,#3b82f6); width: 0%; transition: width 3s linear; }
        </style>
      </head>
      <body class="bg-blue-50 min-h-screen flex flex-col items-center justify-center">
        <div class="bg-white shadow-xl rounded-lg p-8 max-w-md w-full flex flex-col items-center">
          <img src="${user.figureurl_qq_2 || user.figureurl_qq_1}" class="w-24 h-24 rounded-full border-4 border-blue-300 mb-4" alt="avatar">
          <h1 class="text-2xl font-bold mb-2">你好，${user.nickname}</h1>
          <div class="text-gray-700 mb-2">性别：${gender}</div>
          <div class="text-gray-700 mb-2">地区：${user.province || ''} ${user.city || ''}</div>
          <div class="text-gray-500 text-sm mb-4">OpenID: <span class="font-mono">${user.openid}</span></div>
          <div class="w-full mb-2">
            <div class="progress-bar"><div class="progress-inner" id="progress"></div></div>
          </div>
          <div class="text-green-600 font-semibold mb-2">认证成功，3 秒后自动返回主站…</div>
          <a href="https://lz-0315.com" class="text-blue-500 underline">如未跳转请点此</a>
        </div>
        <script>
          let p = document.getElementById('progress');
          setTimeout(() => { p.style.width = '100%'; }, 10);
          setTimeout(() => { window.location.href = 'https://lz-0315.com'; }, 3000);
        </script>
      </body>
    </html>
  `;
}