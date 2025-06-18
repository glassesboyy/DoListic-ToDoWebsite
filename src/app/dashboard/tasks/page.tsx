"use client";

import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function TasksPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text-primary">All Tasks</h1>
        <Button onClick={() => router.push("/dashboard/tasks/new")}>
          Add New Task
        </Button>
      </div>

      <div className="bg-bg-card rounded-lg shadow-custom border border-border-light p-6">
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 text-text-muted mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="text-lg font-medium text-text-primary mb-2">
            No tasks yet
          </h3>
          <p className="text-text-secondary mb-4">
            Create your first task to get started with task management.
          </p>
          <Button onClick={() => router.push("/dashboard/tasks/new")}>
            Create First Task
          </Button>
        </div>
      </div>
    </div>
  );
}
