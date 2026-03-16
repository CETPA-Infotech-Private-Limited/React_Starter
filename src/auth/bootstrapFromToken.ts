import { User, UserManager } from 'oidc-client-ts';
import { oidcConfig } from './config';

type JwtPayload = {
  exp?: number;
  nbf?: number;
  scope?: string | string[];
  [k: string]: any;
};

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const b = token.split('.')[1];
    if (!b) return null;
    const json = decodeURIComponent(
      atob(b.replace(/-/g, '+').replace(/_/g, '/'))
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

const storageKey = () => `oidc.user:${oidcConfig.authority}:${oidcConfig.client_id}`;

export async function bootstrapFromAccessToken(userManager: UserManager, accessToken: string, opts?: { scope?: string; expiresIn?: number }): Promise<boolean> {
  if (!accessToken) return false;
  const payload = decodeJwtPayload(accessToken) || {};
  const now = Math.floor(Date.now() / 1000);

  if (payload.nbf && now < payload.nbf - 60) return false; // not yet valid
  const exp = payload.exp ?? (opts?.expiresIn ? now + opts.expiresIn : now + 3600);
  if (now > exp + 60) return false; // expired

  const scope = opts?.scope ?? (Array.isArray(payload.scope) ? payload.scope.join(' ') : payload.scope);

  const user = new User({
    access_token: accessToken,
    token_type: 'Bearer',
    scope,
    expires_at: exp, // epoch seconds
    profile: payload, // optional, handy
  });

  await userManager.storeUser(user);

  // mirror minimal shape to sessionStorage for Axios
  sessionStorage.setItem(
    storageKey(),
    JSON.stringify({
      access_token: user.access_token,
      token_type: user.token_type,
      scope: user.scope,
      expires_at: user.expires_at,
      profile: user.profile,
    })
  );

  return true;
}

export function stripTokenParamsFromUrl() {
  const url = new URL(window.location.href);
  const p = url.searchParams;
  let changed = false;
  ['access_token', 'expires_in', 'scope'].forEach((k) => {
    if (p.has(k)) {
      p.delete(k);
      changed = true;
    }
  });
  if (changed) {
    const next = `${url.pathname}${p.toString() ? `?${p}` : ''}${url.hash}`;
    window.history.replaceState({}, '', next);
  }
}
