"use client";

import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-bg-card rounded-lg shadow-custom border border-border-light p-6">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Welcome to Your Dashboard
        </h2>
        <p className="text-text-secondary mb-6">
          This is your personal task management dashboard. Here you can create,
          manage, and track all your tasks efficiently.
        </p>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            className="w-full"
            size="lg"
            onClick={() => router.push("/dashboard/tasks/new")}
          >
            Create New Task
          </Button>
          <Button
            variant="outline"
            className="w-full"
            size="lg"
            onClick={() => router.push("/dashboard/tasks")}
          >
            View All Tasks
          </Button>
        </div>
      </div>

      {/* Recent Tasks Section */}
      <div className="bg-bg-card rounded-lg shadow-custom border border-border-light p-6">
        <h3 className="text-xl font-semibold text-text-primary mb-4">
          Recent Tasks
        </h3>
        <div className="space-y-3">
          {/* Dummy tasks */}
          {[
            {
              id: 1,
              title: "Complete project proposal",
              completed: false,
            },
            { id: 2, title: "Review team feedback", completed: true },
            {
              id: 3,
              title: "Schedule client meeting",
              completed: false,
            },
          ].map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-3 bg-bg-main rounded-lg border border-border-light"
            >
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  className="w-4 h-4 text-primary bg-bg-main border-border-light rounded focus:ring-primary focus:ring-2"
                  readOnly
                />
                <span
                  className={`${
                    task.completed
                      ? "text-text-secondary line-through"
                      : "text-text-primary"
                  }`}
                >
                  {task.title}
                </span>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/tasks")}
          >
            View All Tasks
          </Button>
        </div>
      </div>

      {/* Quick Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-bg-card rounded-lg shadow-custom border border-border-light p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">3</p>
              <p className="text-text-secondary text-sm">Total Tasks</p>
            </div>
          </div>
        </div>

        <div className="bg-bg-card rounded-lg shadow-custom border border-border-light p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center mr-3">
              <svg
                className="w-5 h-5 text-success-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">1</p>
              <p className="text-text-secondary text-sm">Completed</p>
            </div>
          </div>
        </div>

        <div className="bg-bg-card rounded-lg shadow-custom border border-border-light p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-warning-100 rounded-full flex items-center justify-center mr-3">
              <svg
                className="w-5 h-5 text-warning-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">2</p>
              <p className="text-text-secondary text-sm">Pending</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
