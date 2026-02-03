import { Amplify } from "aws-amplify";
import { HashRouter, Link, Route, Routes } from "react-router";
import { ActivitiesTestPanel } from "../activities-test-panel";
import { AuthTestPanel } from "../auth-test-panel";
import { ProfileTestPanel } from "../profile-test-panel";
import { SkillsTestPanel } from "../skills-test-panel";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID,
      userPoolClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID,
      loginWith: {
        oauth: {
          domain: process.env.NEXT_PUBLIC_AWS_COGNITO_OAUTH_DOMAIN,
          redirectSignIn:
            process.env.NEXT_PUBLIC_AWS_COGNITO_OAUTH_REDIRECT_SIGNIN?.split(
              ",",
            ),
          redirectSignOut:
            process.env.NEXT_PUBLIC_AWS_COGNITO_OAUTH_REDIRECT_SIGNOUT?.split(
              ",",
            ),
          responseType: "code",
          scopes: [
            "email",
            "openid",
            "profile",
            "api/activities.read",
            "api/activities.write",
            "api/skills.read",
            "api/skills.write",
            "api/profile.read",
            "api/profile.write",
          ],
        },
      },
    },
  },
});

export default function AdminShell() {
  return (
    <HashRouter>
      <Routes>
        <Route
          index
          element={
            <div className="min-h-screen bg-background p-8 space-y-8">
              <AuthTestPanel />
              <ActivitiesTestPanel />
              <SkillsTestPanel />
              <ProfileTestPanel />
              <div className="max-w-2xl mx-auto mt-6 flex gap-4">
                <Link
                  to="/users"
                  className="text-sm text-muted-foreground hover:underline"
                >
                  Go to User Management
                </Link>
                <Link
                  to="/settings"
                  className="text-sm text-muted-foreground hover:underline"
                >
                  Go to Settings
                </Link>
              </div>
            </div>
          }
        />
        <Route
          path="users"
          element={
            <div className="min-h-screen bg-background p-8">
              <Link
                to="/"
                className="text-sm text-muted-foreground hover:underline"
              >
                Back to Dashboard
              </Link>
            </div>
          }
        />
        <Route
          path="settings"
          element={
            <div className="min-h-screen bg-background p-8">
              <p className="text-xl font-semibold">Settings</p>
              <Link
                to="/"
                className="text-sm text-muted-foreground hover:underline"
              >
                Back to Dashboard
              </Link>
            </div>
          }
        />
      </Routes>
    </HashRouter>
  );
}
