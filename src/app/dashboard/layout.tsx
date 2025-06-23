import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { TaskProvider } from "@/contexts/TaskContext";
import { ReactNode } from "react";

export default function DashboardLayoutWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ProtectedRoute>
      <TaskProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </TaskProvider>
    </ProtectedRoute>
  );
}
