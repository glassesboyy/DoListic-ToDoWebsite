"use client";

import Button from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { useTodos } from "@/contexts/TodoContext";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const { todos, fetchTodos } = useTodos();
  const router = useRouter();

  useEffect(() => {
    // Fetch todos for sidebar statistics
    fetchTodos({ limit: 100 });
  }, [fetchTodos]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const getTaskStats = () => {
    const completed = todos.filter(
      (todo) => todo.status === "completed"
    ).length;
    const pending = todos.filter((todo) => todo.status !== "completed").length;
    const overdue = todos.filter((todo) => {
      const endDate = new Date(todo.end_date);
      const now = new Date();
      return endDate < now && todo.status !== "completed";
    }).length;

    return { total: todos.length, completed, pending, overdue };
  };

  const stats = getTaskStats();

  return (
    <div className="min-h-screen bg-bg-main">
      {/* Header */}
      <header className="bg-bg-card border-b border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-primary">To-Do App</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-text-secondary">
                Welcome, {user?.name || user?.username || "User"}!
              </span>
              <Button variant="outline" onClick={handleLogout}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1 h-full">
            <div className="space-y-6">
              {/* User Info Card */}
              <div className="bg-bg-card rounded-lg shadow-custom border border-border-light p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-text-primary">
                    {user?.name || "User"}
                  </h3>
                  <p className="text-text-secondary text-sm">
                    @{user?.username || "username"}
                  </p>
                  {user?.email && (
                    <p className="text-text-muted text-xs mt-1">{user.email}</p>
                  )}
                </div>
              </div>

              {/* Navigation Menu */}
              <div className="bg-bg-card rounded-lg shadow-custom border border-border-light p-6">
                <h3 className="font-semibold text-text-primary mb-4">
                  Navigation
                </h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => router.push("/dashboard")}
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"
                      />
                    </svg>
                    Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => router.push("/dashboard/tasks")}
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    All Tasks
                  </Button>
                </div>
              </div>

              {/* Dynamic Stats Card */}
              <div className="bg-bg-card rounded-lg shadow-custom border border-border-light p-6">
                <h3 className="font-semibold text-text-primary mb-4">
                  Task Statistics
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Total Tasks</span>
                    <span className="font-medium text-text-primary">
                      {stats.total}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Completed</span>
                    <span className="font-medium text-success-600">
                      {stats.completed}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Pending</span>
                    <span className="font-medium text-warning-600">
                      {stats.pending}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Overdue</span>
                    <span className="font-medium text-error-600">
                      {stats.overdue}
                    </span>
                  </div>
                  {stats.total > 0 && (
                    <>
                      <div className="border-t border-border-light pt-3 mt-3">
                        <div className="flex justify-between mb-2">
                          <span className="text-text-secondary text-sm">
                            Progress
                          </span>
                          <span className="text-text-primary text-sm font-medium">
                            {((stats.completed / stats.total) * 100).toFixed(0)}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-2">
                          <div
                            className="bg-success-500 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${
                                (stats.completed / stats.total) * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </aside>

          {/* Content Area */}
          <div className="lg:col-span-3">{children}</div>
        </div>
      </main>
    </div>
  );
}
