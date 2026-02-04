import "server-only";

type TokenResponse = {
  access_token: string;
  expires_in: number;
};

type Cache = {
  access_token: string;
  expMs: number;
};

let cache: Cache | null = null;
let inflight: Promise<string> | null = null;

function isValid(cache: Cache, nowMs: number) {
  const jitterMs = Math.floor(Math.random() * 5_000);
  const earlyRefreshMs = 30_000 + jitterMs;
  return nowMs < cache.expMs - earlyRefreshMs;
}

async function fetchToken(): Promise<TokenResponse> {
  const domain = process.env.NEXT_PUBLIC_AWS_COGNITO_OAUTH_DOMAIN;
  const clientId = process.env.AWS_COGNITO_INTERNAL_USER_POOL_CLIENT_ID;
  const clientSecret = process.env.AWS_COGNITO_INTERNAL_USER_POOL_CLIENT_SECRET;
  const scope = "api/activities.read api/skills.read api/profile.read api/works.read";

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(`https://${domain}/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basic}`,
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      scope,
    }).toString(),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cognito /oauth2/token failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data;
}

export async function getServiceAccessToken(): Promise<string> {
  const now = Date.now();

  if (cache && isValid(cache, now)) {
    return cache.access_token
  };
  if (inflight) return inflight;

  inflight = (async () => {
    try {
      const token = await fetchToken();
      const expMs = now + token.expires_in * 1000;

      cache = { access_token: token.access_token, expMs };

      return cache.access_token;
    } finally {
      inflight = null;
    }
  })();

  return inflight;
}
