import { createApiClient } from "@repo/api-client/client";

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const clientId = process.env.COGNITO_CLIENT_ID ?? "";
  const clientSecret = process.env.COGNITO_CLIENT_SECRET ?? "";
  const domain = process.env.COGNITO_DOMAIN ?? "";
  const region = process.env.AWS_REGION || "ap-northeast-1";

  const res = await fetch(
    `https://${domain}.auth.${region}.amazoncognito.com/oauth2/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        scope: [
          "api/activities.read",
          "api/articles.read",
          "api/skills.read",
          "api/works.read",
          "api/profile.read",
          "api/contact.read",
        ].join(" "),
      }),
    },
  );

  if (!res.ok) {
    throw new Error(
      `Failed to fetch access token: ${res.status} ${res.statusText}`,
    );
  }

  const data: unknown = await res.json();
  if (
    typeof data !== "object" ||
    data === null ||
    !("access_token" in data) ||
    typeof data.access_token !== "string" ||
    !("expires_in" in data) ||
    typeof data.expires_in !== "number"
  ) {
    throw new Error("Unexpected token response format");
  }

  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };
  return cachedToken.token;
}

export const apiClient = createApiClient({ baseUrl: process.env.API_URL });

apiClient.use({
  async onRequest({ request }) {
    const token = await getAccessToken();
    request.headers.set("Authorization", `Bearer ${token}`);
    return request;
  },
});
