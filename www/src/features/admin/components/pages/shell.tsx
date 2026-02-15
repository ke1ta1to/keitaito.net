import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Amplify } from "aws-amplify";
import { HashRouter, Navigate, Route, Routes } from "react-router";
import { AuthGuard } from "../auth-guard";
import { AppSidebar } from "../layouts/app-sidebar";
import { ActivitiesPage } from "./activities-page";
import { ArticlesPage } from "./articles-page";
import { ContactsPage } from "./contacts-page";
import { ProfilePage } from "./profile-page";
import { SkillsPage } from "./skills-page";
import { UploadsPage } from "./uploads-page";
import { WorksPage } from "./works-page";

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
            "api/works.read",
            "api/works.write",
            "api/contact.read",
            "api/contact.write",
            "api/articles.read",
            "api/articles.write",
            "api/uploads.write",
          ],
        },
      },
    },
  },
});

export default function AdminShell() {
  return (
    <HashRouter>
      <AuthGuard>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger />
              <span className="text-sm font-medium">Admin</span>
            </header>
            <main className="flex-1 p-6">
              <Routes>
                <Route index element={<Navigate to="/profile" replace />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="activities" element={<ActivitiesPage />} />
                <Route path="skills" element={<SkillsPage />} />
                <Route path="works" element={<WorksPage />} />
                <Route path="articles" element={<ArticlesPage />} />
                <Route path="contacts" element={<ContactsPage />} />
                <Route path="uploads" element={<UploadsPage />} />
              </Routes>
            </main>
          </SidebarInset>
        </SidebarProvider>
      </AuthGuard>
    </HashRouter>
  );
}
