import { Amplify } from "aws-amplify";
import { HashRouter, Link, Route, Routes } from "react-router";
import { SignInButton } from "../sign-in-button";
import { FetchTokenButton } from "../fetch-token-button";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "ap-northeast-1_RCyxtw3pe",
      userPoolClientId: "4a5qefkpusbktpamn4p8i5vj1a",
      loginWith: {
        oauth: {
          domain:
            "portfoliodevelopment-183295441800.auth.ap-northeast-1.amazoncognito.com",
          redirectSignIn: ["http://localhost:3000/admin"],
          redirectSignOut: ["http://localhost:3000/admin"],
          responseType: "code",
          scopes: ["email", "openid", "portfolio-api/api"],
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
            <div className="flex flex-col">
              <p>Admin Dashboard</p>
              <SignInButton />
              <FetchTokenButton />
              <Link to="/users">Go to User Management</Link>
              <Link to="/settings">Go to Settings</Link>
            </div>
          }
        />
        <Route
          path="users"
          element={
            <div>
              <p>User Management</p>
              <Link to="/">Back to Dashboard</Link>
            </div>
          }
        />
        <Route
          path="settings"
          element={
            <div>
              <p>Settings</p>
              <Link to="/">Back to Dashboard</Link>
            </div>
          }
        />
      </Routes>
    </HashRouter>
  );
}
