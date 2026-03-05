import { renderHomePage, renderResultPage, renderErrorPage, renderAdminPage } from './home-ui.js';

// 安全响应头
const securityHeaders = {
  "Content-Type": "text/html; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const isConfigured = env.QQ_APP_ID && env.QQ_APP_KEY;

    // 1. 配置引导页
    if (!isConfigured && url.pathname === "/") {
      return new Response(renderAdminPage(env), { headers: securityHeaders });
    }

    // 2. QQ 登录入口，生成 state
    if (url.pathname === "/login") {
      const state = cryptoRandomString(16);
      let redirectUri = env.REDIRECT_URI || '/qq';
      if (redirectUri.startsWith('/')) {
        redirectUri = url.origin + redirectUri;
      }
      const loginUrl = `https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=${env.QQ_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
      return new Response(null, {
        status: 302,
        headers: {
          'Location': loginUrl,
          'Set-Cookie': `qq_oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax; Secure`,
        }
      });
    }

    // 3. QQ 回调
    if (url.pathname === "/qq") {
      const code = url.searchParams.get("code");
      const state = url.searchParams.get("state");
      const cookie = parseCookie(request.headers.get('Cookie') || '');
      const savedState = cookie.qq_oauth_state;

      if (!code) return htmlResponse(renderErrorPage("缺少 code 参数"), 400);
      if (!state || !savedState || state !== savedState) {
        return htmlResponse(renderErrorPage("state 校验失败，请重试登录。"), 400);
      }

      try {
        // A. 换取 Access Token
        let redirectUri = env.REDIRECT_URI || '/qq';
        if (redirectUri.startsWith('/')) {
          redirectUri = url.origin + redirectUri;
        }
        const tokenResp = await fetch(
          `https://graph.qq.com/oauth2.0/token?grant_type=authorization_code&client_id=${env.QQ_APP_ID}&client_secret=${env.QQ_APP_KEY}&code=${code}&redirect_uri=${encodeURIComponent(redirectUri)}&fmt=json`
        );
        const tokenData = await tokenResp.json();
        if (!tokenData.access_token) {
          return htmlResponse(renderErrorPage(`QQ 授权失败：${tokenData.error_description || JSON.stringify(tokenData)}`), 400);
        }

        // B. 获取 OpenID
        const meResp = await fetch(`https://graph.qq.com/oauth2.0/me?access_token=${tokenData.access_token}&fmt=json`);
        const meData = await meResp.json();
        if (!meData.openid) {
          return htmlResponse(renderErrorPage(`获取 OpenID 失败：${meData.error_description || JSON.stringify(meData)}`), 400);
        }

        // C. 获取用户信息
        const userResp = await fetch(
          `https://graph.qq.com/user/get_user_info?access_token=${tokenData.access_token}&oauth_consumer_key=${env.QQ_APP_ID}&openid=${meData.openid}`
        );
        const userInfo = await userResp.json();
        if (userInfo.ret !== 0) {
          return htmlResponse(renderErrorPage(`获取用户信息失败：${userInfo.msg || JSON.stringify(userInfo)}`), 400);
        }
        userInfo.openid = meData.openid;

        // D. 返回认证成功页
        return new Response(renderResultPage(userInfo), { headers: securityHeaders });
      } catch (e) {
        return htmlResponse(renderErrorPage("服务器异常，请稍后重试。\n" + e.message), 500);
      }
    }

    // 4. 默认首页
    return new Response(renderHomePage(), { headers: securityHeaders });
  }
};

// --- 工具函数 ---
function htmlResponse(html, status = 200) {
  return new Response(html, { status, headers: securityHeaders });
}
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