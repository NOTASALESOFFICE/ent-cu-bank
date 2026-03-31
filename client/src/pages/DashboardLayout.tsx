import { Link, useLocation } from "wouter";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  ArrowLeftRight,
  Receipt,
  Bell,
  Settings,
  LogOut,
  Shield,
  Menu,
  X,
  Info,
  AlertTriangle,
  ShieldCheck,
  CheckCircle,
  CreditCard,
  Send,
  History,
  Link2,
  User,
  BellRing,
  FileText,
  ShoppingBag,
  TrendingUp,
  Wallet,
  DollarSign,
  PiggyBank,
  Target,
  BarChart3,
  LineChart,
  ArrowDownCircle,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth";
import entLogoUrl from "@assets/EntE_ColorLogo_Square300x300.jpg";

interface NavSection {
  label: string;
  icon: typeof LayoutDashboard;
  children: { href: string; label: string; icon: typeof LayoutDashboard }[];
}

const navSections: NavSection[] = [
  {
    label: "Move Money",
    icon: ArrowLeftRight,
    children: [
      { href: "/move-money/transfer", label: "Make a Transfer", icon: ArrowLeftRight },
      { href: "/move-money/pay-loan", label: "Pay a Loan", icon: DollarSign },
      { href: "/move-money/pay-credit-card", label: "Pay a Credit Card", icon: CreditCard },
      { href: "/move-money/pay-bills", label: "Pay Bills", icon: Receipt },
      { href: "/move-money/send-member", label: "Send Money to a Member", icon: Send },
      { href: "/move-money/activity", label: "Activity", icon: History },
      { href: "/move-money/external-accounts", label: "My External Accounts", icon: Link2 },
    ],
  },
  {
    label: "Self Service",
    icon: User,
    children: [
      { href: "/self-service/profile", label: "My Profile", icon: User },
      { href: "/self-service/manage-cards", label: "Manage Cards", icon: CreditCard },
      { href: "/self-service/manage-notifications", label: "Manage Notifications", icon: BellRing },
    ],
  },
];

const topNavItems = [
  { href: "/", label: "Accounts", icon: LayoutDashboard },
];

const bottomNavItems = [
  { href: "/money-insights", label: "Money Insights", icon: TrendingUp },
  { href: "/download-statements", label: "Download Statements", icon: FileText },
  { href: "/explore-products", label: "Explore Products", icon: ShoppingBag },
];

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "info" | "warning" | "security" | "success";
}

const notifIcons: Record<string, typeof Info> = {
  info: Info,
  warning: AlertTriangle,
  security: ShieldCheck,
  success: CheckCircle,
};

const notifColors: Record<string, string> = {
  info: "text-blue-500 bg-blue-100 dark:bg-blue-900/30",
  warning: "text-amber-500 bg-amber-100 dark:bg-amber-900/30",
  security: "text-red-500 bg-red-100 dark:bg-red-900/30",
  success: "text-green-500 bg-green-100 dark:bg-green-900/30",
};

function EntCuLogo() {
  return (
    <img
      src={entLogoUrl}
      alt="ENT CU Logo"
      className="w-10 h-10 rounded-lg"
    />
  );
}

function NavSectionItem({
  section,
  location,
  expanded,
  onToggle,
  onItemClick,
}: {
  section: NavSection;
  location: string;
  expanded: boolean;
  onToggle: () => void;
  onItemClick: () => void;
}) {
  const isAnyChildActive = section.children.some((child) => location === child.href);
  const ChevronIcon = expanded ? ChevronDown : ChevronRight;

  return (
    <div>
      <button
        onClick={onToggle}
        className={`
          flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer w-full
          transition-colors duration-150
          ${
            isAnyChildActive && !expanded
              ? "bg-[hsl(var(--sidebar-primary))] text-white"
              : "text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))]"
          }
        `}
        data-testid={`nav-section-${section.label.toLowerCase().replace(/ /g, "-")}`}
      >
        <section.icon size={18} />
        <span className="flex-1 text-left">{section.label}</span>
        <ChevronIcon size={14} className="opacity-60" />
      </button>
      {expanded && (
        <div className="ml-3 pl-4 border-l border-[hsl(var(--sidebar-border))] mt-1 space-y-0.5">
          {section.children.map((child) => {
            const isActive = location === child.href;
            return (
              <Link key={child.href} href={child.href}>
                <div
                  onClick={onItemClick}
                  className={`
                    flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] cursor-pointer
                    transition-colors duration-150
                    ${
                      isActive
                        ? "bg-[hsl(var(--sidebar-primary))] text-white font-medium"
                        : "text-[hsl(var(--sidebar-foreground))] opacity-80 hover:opacity-100 hover:bg-[hsl(var(--sidebar-accent))]"
                    }
                  `}
                  data-testid={`nav-${child.label.toLowerCase().replace(/ /g, "-")}`}
                >
                  <child.icon size={15} />
                  {child.label}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    // Auto-expand section if user is on a child route
    const initial: Record<string, boolean> = {};
    navSections.forEach((section) => {
      const isChildActive = section.children.some((child) => location.startsWith(child.href.split("/").slice(0, 2).join("/")));
      if (isChildActive) initial[section.label] = true;
    });
    return initial;
  });

  const { data: notifications } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/notifications");
      return res.json();
    },
  });

  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;

  const handleLogout = async () => {
    await logout();
  };

  const toggleSection = (label: string) => {
    setExpandedSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background" data-testid="dashboard-layout">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col
          bg-[hsl(var(--sidebar))] text-[hsl(var(--sidebar-foreground))]
          border-r border-[hsl(var(--sidebar-border))]
          transform transition-transform duration-200
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        data-testid="sidebar"
      >
        {/* Logo area */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-[hsl(var(--sidebar-border))]">
          <EntCuLogo />
          <div>
            <div className="font-semibold text-sm tracking-wide text-white">ENT CU</div>
            <div className="text-[11px] text-[hsl(var(--sidebar-foreground))] opacity-60">
              Credit Union
            </div>
          </div>
          <button
            className="ml-auto lg:hidden text-[hsl(var(--sidebar-foreground))]"
            onClick={() => setMobileOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overscroll-contain">
          {/* Top-level: Accounts */}
          {topNavItems.map((item) => {
            const isActive =
              item.href === "/"
                ? location === "/" || location.startsWith("/accounts")
                : location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  onClick={() => setMobileOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer
                    transition-colors duration-150
                    ${
                      isActive
                        ? "bg-[hsl(var(--sidebar-primary))] text-white"
                        : "text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))]"
                    }
                  `}
                  data-testid={`nav-${item.label.toLowerCase().replace(/ /g, "-")}`}
                >
                  <item.icon size={18} />
                  {item.label}
                </div>
              </Link>
            );
          })}

          {/* Collapsible sections: Move Money, Self Service */}
          {navSections.map((section) => (
            <NavSectionItem
              key={section.label}
              section={section}
              location={location}
              expanded={!!expandedSections[section.label]}
              onToggle={() => toggleSection(section.label)}
              onItemClick={() => setMobileOpen(false)}
            />
          ))}

          {/* Divider */}
          <div className="my-3 border-t border-[hsl(var(--sidebar-border))]" />

          {/* Bottom nav items */}
          {bottomNavItems.map((item) => {
            const isActive = location === item.href || location.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href}>
                <div
                  onClick={() => setMobileOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer
                    transition-colors duration-150
                    ${
                      isActive
                        ? "bg-[hsl(var(--sidebar-primary))] text-white"
                        : "text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))]"
                    }
                  `}
                  data-testid={`nav-${item.label.toLowerCase().replace(/ /g, "-")}`}
                >
                  <item.icon size={18} />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User profile + logout at bottom */}
        <div className="px-3 py-4 border-t border-[hsl(var(--sidebar-border))] space-y-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 px-3 py-2 w-full rounded-lg hover:bg-[hsl(var(--sidebar-accent))] transition-colors" data-testid="button-user-menu">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-[hsl(var(--sidebar-primary))] text-white text-xs font-semibold">
                    ZL
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-sm font-medium text-white truncate">
                    {user?.name || "Zackary Lovrek"}
                  </div>
                  <div className="text-[11px] opacity-50">Member since {user?.memberSince || "2019"}</div>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user?.name || "Zackary Lovrek"}</p>
                <p className="text-xs text-muted-foreground">{user?.email || "zackary.lovrek@entcu.com"}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setLocation("/self-service/profile")} data-testid="menu-profile">
                <User size={14} className="mr-2" />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocation("/self-service/manage-cards")} data-testid="menu-cards">
                <CreditCard size={14} className="mr-2" />
                Manage Cards
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={handleLogout}
                data-testid="menu-logout"
              >
                <LogOut size={14} className="mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-4 lg:px-6 h-14 border-b border-border bg-card/80 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-1"
              onClick={() => setMobileOpen(true)}
              data-testid="button-mobile-menu"
            >
              <Menu size={22} />
            </button>
            <div className="hidden sm:block">
              <span className="text-sm text-muted-foreground">Welcome back,</span>{" "}
              <span className="text-sm font-semibold">{user?.name?.split(" ")[0] || "Zackary"}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notifications Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative" data-testid="button-notifications">
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[hsl(var(--destructive))] text-white text-[10px] font-bold flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md" data-testid="notifications-panel">
                <SheetHeader>
                  <SheetTitle className="flex items-center justify-between">
                    Notifications
                    {unreadCount > 0 && (
                      <Badge variant="secondary" className="text-xs">{unreadCount} new</Badge>
                    )}
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-1 -mx-2">
                  {notifications?.map((notif) => {
                    const Icon = notifIcons[notif.type] || Info;
                    const colorClass = notifColors[notif.type] || notifColors.info;
                    return (
                      <div
                        key={notif.id}
                        className={`flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-muted/50 ${
                          !notif.read ? "bg-primary/5" : ""
                        }`}
                        data-testid={`notification-${notif.id}`}
                      >
                        <div className={`p-1.5 rounded-md shrink-0 ${colorClass}`}>
                          <Icon size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-sm ${!notif.read ? "font-semibold" : "font-medium"}`}>
                              {notif.title}
                            </p>
                            {!notif.read && (
                              <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                          <p className="text-[10px] text-muted-foreground/60 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>

            {/* Secure session badge */}
            <div className="hidden sm:flex items-center gap-1.5 ml-2 px-2 py-1 rounded-md bg-primary/10 text-primary">
              <Shield size={14} />
              <span className="text-xs font-medium">Secure Session</span>
            </div>

            {/* Logout button (visible on desktop) */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex text-muted-foreground hover:text-destructive"
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut size={18} />
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto overscroll-contain p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
