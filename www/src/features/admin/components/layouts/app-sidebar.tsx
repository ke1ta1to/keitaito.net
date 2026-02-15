import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { IconLogout } from "@tabler/icons-react";
import { signOut } from "aws-amplify/auth";
import { useLocation, useNavigate } from "react-router";
import { ADMIN_ROUTES } from "../../config/routes";

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <span className="text-sm font-semibold">管理パネル</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>メニュー</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {ADMIN_ROUTES.map((route) => (
                <SidebarMenuItem key={route.path}>
                  <SidebarMenuButton
                    isActive={location.pathname === route.path}
                    onClick={() => navigate(route.path)}
                  >
                    <route.icon className="size-4" />
                    <span>{route.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <IconLogout className="size-4" />
              <span>ログアウト</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
