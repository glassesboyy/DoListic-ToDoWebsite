"use client";

import Button from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { useTask } from "@/contexts/TaskContext";
import Link from "next/link";
import {
  FiCheckCircle,
  FiClipboard,
  FiClock,
  FiList,
  FiLoader,
  FiPlus,
  FiTrash2,
  FiUser,
} from "react-icons/fi";

// Komponen logo yang sama seperti di landing page
function DoListicLogo() {
  return (
    <svg
      className="w-8 h-8 text-primary mr-2"
      color="currentColor"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="4" y="4" width="24" height="24" rx="6" fill="currentColor" />
      <path
        d="M10 16l4 4 8-8"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { tasks, loading } = useTask();

  // Rekap task berdasarkan status
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const totalTasks = safeTasks.length;
  const notStarted = safeTasks.filter((t) => t.status === "not_started").length;
  const inProgress = safeTasks.filter((t) => t.status === "in_progress").length;
  const completed = safeTasks.filter((t) => t.status === "completed").length;

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div className="bg-bg-card rounded-lg shadow-custom border border-border-light p-8">
        <div className="text-center flex flex-col items-center">
          {/* Branding dengan logo */}
          <div className="flex items-center justify-center mb-2">
            <DoListicLogo />
            <span className="text-2xl font-bold text-primary">DoListic</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Halo, {user?.name || user?.username || "User"}! 👋
          </h1>
          <p className="text-text-secondary text-lg">
            Welcome to your dashboard. Manage your tasks and profile easily!
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <Link href="/dashboard/task">
          <Button
            icon={<FiList />}
            className="w-full flex flex-col items-center py-6"
            variant="outline"
          >
            <span className="font-semibold">View All Tasks</span>
          </Button>
        </Link>
        <Link href="/dashboard/task/create">
          <Button
            icon={<FiPlus />}
            className="w-full flex flex-col items-center py-6"
          >
            <span className="font-semibold">Create New Task</span>
          </Button>
        </Link>
        <Link href="/dashboard/trash">
          <Button
            icon={<FiTrash2 />}
            className="w-full flex flex-col items-center py-6"
            variant="danger"
          >
            <span className="font-semibold">Trash</span>
          </Button>
        </Link>
        <Link href="/dashboard/profile">
          <Button
            icon={<FiUser />}
            className="w-full flex flex-col items-center py-6"
            variant="outline"
          >
            <span className="font-semibold">My Profile</span>
          </Button>
        </Link>
      </div>

      {/* Rekap Task */}
      <div className="bg-bg-card rounded-lg shadow-custom border border-border-light p-8">
        <h2 className="text-xl font-bold text-text-primary mb-6">
          Task Overview
        </h2>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <FiLoader className="animate-spin w-10 h-10 text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center p-4 bg-primary-50 rounded-lg border border-primary-100">
              <FiClipboard className="w-8 h-8 text-primary mb-2" />
              <span className="text-2xl font-bold text-primary">
                {totalTasks}
              </span>
              <span className="text-text-secondary">Total Task</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-neutral-50 rounded-lg border border-neutral-100">
              <FiClock className="w-8 h-8 text-neutral-500 mb-2" />
              <span className="text-2xl font-bold text-neutral-700">
                {notStarted}
              </span>
              <span className="text-text-secondary">Not Started</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-warning-50 rounded-lg border border-warning-100">
              <FiLoader className="w-8 h-8 text-warning-600 mb-2" />
              <span className="text-2xl font-bold text-warning-700">
                {inProgress}
              </span>
              <span className="text-text-secondary">In Progress</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-success-50 rounded-lg border border-success-100">
              <FiCheckCircle className="w-8 h-8 text-success-600 mb-2" />
              <span className="text-2xl font-bold text-success-700">
                {completed}
              </span>
              <span className="text-text-secondary">Completed</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
