"use client";

import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import {
  HiOutlineClipboardList,
  HiOutlineLogout,
  HiOutlineMenu,
  HiOutlineTrash,
  HiOutlineUser,
  HiOutlineViewGrid,
  HiOutlineX,
} from "react-icons/hi";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const isActivePath = (path: string) => {
    return pathname === path;
  };

  const getNavLinkClasses = (path: string) => {
    const baseClasses =
      "flex items-center px-4 py-3 rounded-lg transition-colors";
    const activeClasses = "text-white bg-primary";
    const inactiveClasses =
      "text-text-secondary hover:text-text-primary hover:bg-bg-hover";

    return `${baseClasses} ${
      isActivePath(path) ? activeClasses : inactiveClasses
    }`;
  };

  return (
    <div className="min-h-screen bg-bg-main flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-bg-overlay lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-bg-card border-r border-border-light
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-border-light">
            <h1 className="text-xl font-bold text-primary">DoListic</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-text-secondary hover:bg-bg-hover"
            >
              <HiOutlineX className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <Link
              href="/dashboard"
              className={getNavLinkClasses("/dashboard")}
              onClick={() => setSidebarOpen(false)}
            >
              <HiOutlineViewGrid className="w-5 h-5 mr-3" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/task"
              className={getNavLinkClasses("/dashboard/task")}
              onClick={() => setSidebarOpen(false)}
            >
              <HiOutlineClipboardList className="w-5 h-5 mr-3" />
              Tasks
            </Link>
            <Link
              href="/dashboard/profile"
              className={getNavLinkClasses("/dashboard/profile")}
              onClick={() => setSidebarOpen(false)}
            >
              <HiOutlineUser className="w-5 h-5 mr-3" />
              Profile
            </Link>
            <Link
              href="/dashboard/trash"
              className={getNavLinkClasses("/dashboard/trash")}
              onClick={() => setSidebarOpen(false)}
            >
              <HiOutlineTrash className="w-5 h-5 mr-3" />
              Trash
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Global Header */}
        <header className="flex items-center justify-between bg-bg-card border-b border-border-light px-4 py-3 sticky top-0 z-30">
          {/* Mobile: Sidebar toggle button */}
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-text-secondary hover:bg-bg-hover mr-2"
            >
              <HiOutlineMenu className="w-6 h-6" />
            </button>
          </div>
          {/* Right section: Profile, ThemeToggle, Sign Out */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <ThemeToggle />
            {/* User Info */}
            <div className="flex items-center space-x-2 bg-bg-secondary rounded-lg px-3 py-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {(user?.name || user?.username || "U")
                    .charAt(0)
                    .toUpperCase()}
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-text-primary truncate">
                  {user?.name || user?.username || "User"}
                </span>
                <span className="text-xs text-text-secondary truncate">
                  {user?.email || "user@example.com"}
                </span>
              </div>
            </div>
            {/* Logout Button */}
            <Button
              variant="danger"
              onClick={handleLogout}
              className="justify-center px-6 py-2"
              size="sm"
            >
              <HiOutlineLogout className="w-5 h-5 mr-2" />
              Sign Out
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
