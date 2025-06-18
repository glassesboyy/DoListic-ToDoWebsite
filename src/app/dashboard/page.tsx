"use client";

import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Button from "@/components/ui/Button";

function DashboardContent() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-bg-main">
      <div className="bg-bg-card border-b border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">
                Dashboard
              </h1>
              <p className="text-text-secondary">Welcome back, {user?.name}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-bg-card rounded-lg border border-border-light p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Profile Information
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-text-secondary">Name:</span>{" "}
                <span className="text-text-primary">{user?.name}</span>
              </p>
              <p>
                <span className="text-text-secondary">Username:</span>{" "}
                <span className="text-text-primary">{user?.username}</span>
              </p>
              <p>
                <span className="text-text-secondary">Email:</span>{" "}
                <span className="text-text-primary">{user?.email}</span>
              </p>
              <p>
                <span className="text-text-secondary">Status:</span>
                <span
                  className={`ml-1 ${
                    user?.emailVerified
                      ? "text-success-600"
                      : "text-warning-600"
                  }`}
                >
                  {user?.emailVerified ? "Verified" : "Unverified"}
                </span>
              </p>
            </div>
          </div>

          <div className="bg-bg-card rounded-lg border border-border-light p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Button className="w-full" size="sm">
                Create New Task
              </Button>
              <Button variant="outline" className="w-full" size="sm">
                View All Tasks
              </Button>
            </div>
          </div>

          <div className="bg-bg-card rounded-lg border border-border-light p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Statistics
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-text-secondary">Total Tasks:</span>{" "}
                <span className="text-text-primary">0</span>
              </p>
              <p>
                <span className="text-text-secondary">Completed:</span>{" "}
                <span className="text-success-600">0</span>
              </p>
              <p>
                <span className="text-text-secondary">Pending:</span>{" "}
                <span className="text-warning-600">0</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="bg-bg-card rounded-lg border border-border-light p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Recent Activity
            </h3>
            <div className="text-center py-8">
              <p className="text-text-muted">No recent activity</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
