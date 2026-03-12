"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/ui/components/ui/sidebar";
import {
  IconActivity,
  IconArticle,
  IconBriefcase,
  IconCode,
  IconMail,
  IconUpload,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const resourceItems = [
  { title: "Activities", href: "/activities", icon: IconActivity },
  { title: "Articles", href: "/articles", icon: IconArticle },
  { title: "Skills", href: "/skills", icon: IconCode },
  { title: "Works", href: "/works", icon: IconBriefcase },
];

const settingsItems = [
  { title: "Profile", href: "/profile", icon: IconUser },
  { title: "Contact", href: "/contact", icon: IconMail },
];

const toolsItems = [{ title: "Uploads", href: "/uploads", icon: IconUpload }];

export function AppSidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/" className="font-semibold">
                keitaito.net
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavGroup label="Resources" items={resourceItems} isActive={isActive} />
        <NavGroup label="Settings" items={settingsItems} isActive={isActive} />
        <NavGroup label="Tools" items={toolsItems} isActive={isActive} />
      </SidebarContent>
    </Sidebar>
  );
}

interface NavGroupProps {
  label: string;
  items: {
    title: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
  isActive: (href: string) => boolean;
}

function NavGroup({ label, items, isActive }: NavGroupProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={isActive(item.href)}>
                <Link href={item.href}>
                  <item.icon className="size-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
