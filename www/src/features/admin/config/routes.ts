import {
  IconActivity,
  IconArticle,
  IconBriefcase,
  IconCode,
  IconMail,
  IconUpload,
  IconUser,
} from "@tabler/icons-react";
import type { ComponentType } from "react";

export type AdminRoute = {
  path: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

export const ADMIN_ROUTES: AdminRoute[] = [
  { path: "/profile", label: "Profile", icon: IconUser },
  { path: "/activities", label: "Activities", icon: IconActivity },
  { path: "/skills", label: "Skills", icon: IconCode },
  { path: "/works", label: "Works", icon: IconBriefcase },
  { path: "/articles", label: "Articles", icon: IconArticle },
  { path: "/contacts", label: "Contacts", icon: IconMail },
  { path: "/uploads", label: "Uploads", icon: IconUpload },
];
