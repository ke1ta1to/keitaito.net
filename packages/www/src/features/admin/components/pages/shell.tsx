import { Amplify } from "aws-amplify";
import { HashRouter, Link, Route, Routes } from "react-router";
import { ApiTestPanel } from "../api-test-panel";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "ap-northeast-1_ao0flv9ZB",
      userPoolClientId: "2mlsu3u2jebcirli2sk75pt48f",
      loginWith: {
        oauth: {
          domain:
            "portfoliodevelopment-183295441800.auth.ap-northeast-1.amazoncognito.com",
          redirectSignIn: ["http://localhost:3000/admin"],
          redirectSignOut: ["http://localhost:3000/admin"],
          responseType: "code",
          scopes: [
            "email",
            "openid",
            "profile",
            "api/activities.read",
            "api/activities.write",
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
            <div className="min-h-screen bg-background p-8">
              <ApiTestPanel />
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
              <p className="text-xl font-semibold">User Management</p>
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
