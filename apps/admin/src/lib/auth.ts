import { Amplify } from "aws-amplify";
import {
  fetchAuthSession,
  signInWithRedirect,
  signOut,
} from "aws-amplify/auth";

const origin = typeof window !== "undefined" ? window.location.origin : "";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID ?? "",
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID ?? "",
      loginWith: {
        oauth: {
          domain: `${process.env.NEXT_PUBLIC_COGNITO_DOMAIN ?? ""}.auth.ap-northeast-1.amazoncognito.com`,
          scopes: [
            "openid",
            "email",
            "profile",
            "api/activities.read",
            "api/activities.write",
            "api/articles.read",
            "api/articles.write",
            "api/skills.read",
            "api/skills.write",
            "api/works.read",
            "api/works.write",
            "api/profile.read",
            "api/profile.write",
            "api/contact.read",
            "api/contact.write",
            "api/uploads.write",
          ],
          redirectSignIn: [`${origin}/admin/auth/callback/`],
          redirectSignOut: [`${origin}/admin/`],
          responseType: "code",
        },
      },
    },
  },
});

export { fetchAuthSession, signInWithRedirect, signOut };

export async function getAccessToken(): Promise<string | undefined> {
  const session = await fetchAuthSession();
  return session.tokens?.accessToken?.toString();
}
