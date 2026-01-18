import {
  LayoutDashboard,
  LayoutGrid,
  Bookmark,
  MessageCircle,
  History,
} from "lucide-react";

export interface NavigationItem {
  title: string;
  href: string;
  icon: any;
  badge?: string | number;
  children?: NavigationItem[];
}

export const navigationItems: NavigationItem[] = [
  {
    title: "预设提示词广场",
    href: "/dashboard/prompts",
    icon: LayoutGrid,
  },
  {
    title: "收藏",
    href: "/dashboard/favorites",
    icon: Bookmark,
  },
  {
    title: "聊天",
    href: "/dashboard/chat",
    icon: MessageCircle,
  },
  {
    title: "聊天记录",
    href: "/dashboard/history",
    icon: History,
  },
];

export const userMenuItems = [
  {
    title: "Profile",
    href: "/dashboard/profile",
  },
  {
    title: "Account Settings",
    href: "/dashboard/account",
  },
  {
    title: "Logout",
    href: "/logout",
  },
];
