import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { TaskProvider } from "@/contexts/TaskContext";
import { TrashProvider } from "@/contexts/TrashContext";
import { ReactNode } from "react";

export default function DashboardLayoutWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ProtectedRoute>
      <TaskProvider>
        <TrashProvider>
          <DashboardLayout>{children}</DashboardLayout>
        </TrashProvider>
      </TaskProvider>
    </ProtectedRoute>
  );
}
