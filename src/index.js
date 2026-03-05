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
    const isConfigured = env.QQ_APP_ID && env.QQ_APP_KEY && env.REDIRECT_URI;

    // ========== 域名守卫 ==========
    // 仅允许通过 REDIRECT_URI 配置的域名访问，屏蔽 workers.dev 等其他入口
    if (env.REDIRECT_URI && url.hostname !== env.REDIRECT_URI) {
      return htmlResponse(renderErrorPage(
        `此认证服务仅可通过 <b>${env.REDIRECT_URI}</b> 访问。<br>当前域名 <b>${url.hostname}</b> 未被授权。`
      ), 403);
    }

    // 1. 配置引导页（未配置环境变量时）
    if (!isConfigured && url.pathname === "/") {
      return new Response(renderAdminPage(env), { headers: securityHeaders });
    }

    // 2. 登录入口 /login?from=回调地址
    if (url.pathname === "/login") {
      if (!isConfigured) {
        return htmlResponse(renderErrorPage("认证中心尚未配置，请先设置环境变量。"), 500);
      }

      const from = url.searchParams.get("from") || '';

      // 校验 from 来源域名是否在 ALLOWED_ORIGINS 白名单中
      if (from) {
        if (!isAllowedOrigin(from, env.ALLOWED_ORIGINS)) {
          return htmlResponse(renderErrorPage(
            `回调域名未授权。<br>请在环境变量 <b>ALLOWED_ORIGINS</b> 中添加该域名。`
          ), 403);
        }
      }

      const state = cryptoRandomString(16);
      // 用 REDIRECT_URI（纯域名）拼接 QQ 回调地址
      const qqCallbackUri = `https://${env.REDIRECT_URI}/qq`;
      const loginUrl = `https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=${env.QQ_APP_ID}&redirect_uri=${encodeURIComponent(qqCallbackUri)}&state=${state}`;

      // 写入 state 和 from 到 cookie（Max-Age=600，10 分钟超时）
      const headers = new Headers();
      headers.set('Location', loginUrl);
      headers.append('Set-Cookie', `qq_oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=600`);
      if (from) {
        headers.append('Set-Cookie', `qq_oauth_from=${encodeURIComponent(from)}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=600`);
      }

      return new Response(null, { status: 302, headers });
    }

    // 3. QQ 回调 /qq
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
        const qqCallbackUri = `https://${env.REDIRECT_URI}/qq`;

        // A. 换取 Access Token
        const tokenResp = await fetch(
          `https://graph.qq.com/oauth2.0/token?grant_type=authorization_code&client_id=${env.QQ_APP_ID}&client_secret=${env.QQ_APP_KEY}&code=${code}&redirect_uri=${encodeURIComponent(qqCallbackUri)}&fmt=json`
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

        // D. 判断是否有来源回调
        const from = cookie.qq_oauth_from ? decodeURIComponent(cookie.qq_oauth_from) : '';

        if (from && isAllowedOrigin(from, env.ALLOWED_ORIGINS)) {
          // ===== 有来源：立即 302 回调（0s 超时），携带用户信息 =====
          const callbackUrl = new URL(from);
          callbackUrl.searchParams.set('openid', userInfo.openid);
          callbackUrl.searchParams.set('nickname', userInfo.nickname || '');
          callbackUrl.searchParams.set('avatar', userInfo.figureurl_qq_2 || userInfo.figureurl_qq_1 || '');
          callbackUrl.searchParams.set('gender', userInfo.gender || '');
          callbackUrl.searchParams.set('province', userInfo.province || '');
          callbackUrl.searchParams.set('city', userInfo.city || '');

          // 清除 cookie 并立即跳转
          const headers = new Headers();
          headers.set('Location', callbackUrl.toString());
          headers.append('Set-Cookie', 'qq_oauth_state=; Path=/; Max-Age=0');
          headers.append('Set-Cookie', 'qq_oauth_from=; Path=/; Max-Age=0');
          return new Response(null, { status: 302, headers });
        }

        // ===== 无来源：直接访问，显示结果页（不自动跳转） =====
        return new Response(renderResultPage(userInfo), { headers: securityHeaders });
      } catch (e) {
        return htmlResponse(renderErrorPage("服务器异常，请稍后重试。<br>" + e.message), 500);
      }
    }

    // 4. 默认首页
    return new Response(renderHomePage(), { headers: securityHeaders });
  }
};

// ========== 工具函数 ==========

function htmlResponse(html, status = 200) {
  return new Response(html, { status, headers: securityHeaders });
}

function cryptoRandomString(length) {
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

/**
 * 校验 from URL 的域名是否在 ALLOWED_ORIGINS 白名单中
 * ALLOWED_ORIGINS 格式: 逗号分隔的域名，如 "lz-0315.com,www.lz-0315.com"
 * 支持子域名匹配：白名单有 lz-0315.com 则 www.lz-0315.com 也允许
 */
/**
 * 校验 from URL 的域名是否在 ALLOWED_ORIGINS 白名单中
 * ALLOWED_ORIGINS 支持：
 *   - 为空或 * 表示允许所有
 *   - *.example.com 通配符匹配任意子域名
 *   - 普通域名支持子域名后缀匹配
 */
function isAllowedOrigin(fromUrl, allowedOriginsStr) {
  try {
    if (!allowedOriginsStr || allowedOriginsStr.trim() === '*' ) return true;
    const fromHostname = new URL(fromUrl).hostname.toLowerCase();
    const allowed = allowedOriginsStr.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    return allowed.some(origin => {
      if (origin === '*') return true;
      if (origin.startsWith('*.')) {
        // 通配符 *.example.com 匹配任意子域名
        const base = origin.slice(2);
        return fromHostname.endsWith('.' + base);
      }
      // 普通域名，支持自身和子域名
      return fromHostname === origin || fromHostname.endsWith('.' + origin);
    });
  } catch {
    return false;
  }
}