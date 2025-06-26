"use client";

import TaskCard from "@/components/task/TaskCard";
import TaskFilters from "@/components/task/TaskFilters";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import { useTask } from "@/contexts/TaskContext";
import { Task } from "@/types/task";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FiPlus,
  FiTrash,
  FiChevronLeft,
  FiChevronRight,
  FiFile,
} from "react-icons/fi";

export default function TaskPage() {
  const router = useRouter();
  const {
    tasks,
    loading,
    error,
    filters,
    selectedTasks,
    fetchTasks,
    deleteTask,
    bulkDeleteTasks,
    setFilters,
    toggleTaskSelection,
    selectAllTasks,
    clearSelection,
    clearError,
    currentPage,
    totalPages,
    totalTasks,
    goToPage,
    pageLimit,
  } = useTask();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  useEffect(() => {
    fetchTasks(undefined, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateTask = () => {
    router.push("/dashboard/task/create");
  };

  const handleViewTask = (task: Task) => {
    router.push(`/dashboard/task/detail/${task.id}`);
  };

  const handleEditTask = (task: Task) => {
    router.push(`/dashboard/task/edit/${task.id}`);
  };

  const handleDeleteTask = (id: number) => {
    setDeleteTargetId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (deleteTargetId) {
      await deleteTask(deleteTargetId);
      setShowDeleteConfirm(false);
      setDeleteTargetId(null);
    }
  };

  const handleBulkDelete = () => {
    const selectedArray = Array.isArray(selectedTasks) ? selectedTasks : [];
    if (selectedArray.length > 0) {
      setShowBulkDeleteConfirm(true);
    }
  };

  const confirmBulkDelete = async () => {
    const selectedArray = Array.isArray(selectedTasks) ? selectedTasks : [];
    if (selectedArray.length > 0) {
      setIsBulkDeleting(true);
      try {
        await bulkDeleteTasks(selectedArray);
        setShowBulkDeleteConfirm(false);
      } catch (err) {
        // Error is handled in context
      } finally {
        setIsBulkDeleting(false);
      }
    }
  };

  const handleSearch = () => {
    fetchTasks(filters, 1); // always reset to page 1 on search
  };

  const handleResetFilters = () => {
    const resetFilters = {
      sort_by: "created_at",
      order: "desc" as const,
    };
    setFilters(resetFilters);
    fetchTasks(resetFilters, 1);
  };

  // Safe array operations with null checks
  const safeSelectedTasks = Array.isArray(selectedTasks) ? selectedTasks : [];
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  const allSelected =
    safeTasks.length > 0 && safeSelectedTasks.length === safeTasks.length;
  const someSelected =
    safeSelectedTasks.length > 0 && safeSelectedTasks.length < safeTasks.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Tasks</h1>
          <p className="text-text-secondary mt-1">
            Manage your tasks and track your progress
          </p>
        </div>
        <Button onClick={handleCreateTask}>
          <FiPlus className="w-4 h-4 mr-2" />
          Create Task
        </Button>
      </div>

      {/* Error Alert */}
      {error && <Alert type="error" message={error} onClose={clearError} />}

      {/* Filters */}
      <TaskFilters
        filters={filters}
        onFiltersChange={setFilters}
        onSearch={handleSearch}
        onReset={handleResetFilters}
      />

      {/* Bulk Actions */}
      {safeTasks.length > 0 && (
        <div className="bg-bg-card border border-border-light rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = someSelected;
                  }}
                  onChange={() =>
                    allSelected ? clearSelection() : selectAllTasks()
                  }
                  className="w-4 h-4 text-primary focus:ring-primary border-border-medium rounded"
                />
                <span className="text-sm text-text-secondary">
                  {safeSelectedTasks.length > 0
                    ? `${safeSelectedTasks.length} task(s) selected`
                    : "Select all tasks"}
                </span>
              </label>
            </div>

            {safeSelectedTasks.length > 0 && (
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={clearSelection}>
                  Clear Selection
                </Button>
                <Button variant="danger" onClick={handleBulkDelete}>
                  <FiTrash className="w-4 h-4 mr-2" />
                  Delete Selected ({safeSelectedTasks.length})
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tasks List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
        </div>
      ) : safeTasks.length === 0 ? (
        <div className="text-center py-12">
          <FiFile className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            No tasks found
          </h3>
          <p className="text-text-secondary mb-4">
            {Object.keys(filters).some(
              (key) => filters[key as keyof typeof filters]
            )
              ? "Try adjusting your filters or create a new task."
              : "Get started by creating your first task."}
          </p>
          <Button onClick={handleCreateTask}>Create Your First Task</Button>
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {safeTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                isSelected={safeSelectedTasks.includes(task.id)}
                onSelect={toggleTaskSelection}
                onView={handleViewTask}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-text-secondary">
              Showing {(currentPage - 1) * pageLimit + 1}
              {" - "}
              {Math.min(currentPage * pageLimit, totalTasks)} of {totalTasks}{" "}
              tasks
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                <FiChevronLeft className="w-4 h-4 mr-1" />
                Prev
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "primary" : "outline"}
                    size="sm"
                    onClick={() => goToPage(page)}
                    disabled={page === currentPage}
                  >
                    {page}
                  </Button>
                )
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                Next
                <FiChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {showBulkDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-bg-overlay" />

            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-bg-card shadow-custom-xl rounded-lg border border-border-light">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-error-100 rounded-full mb-4">
                <FiTrash className="w-6 h-6 text-error-600" />
              </div>

              <h3 className="text-lg font-semibold text-text-primary text-center mb-2">
                Delete Multiple Tasks
              </h3>
              <p className="text-text-secondary text-center mb-6">
                Are you sure you want to delete {safeSelectedTasks.length}{" "}
                selected task{safeSelectedTasks.length > 1 ? "s" : ""}? This
                action cannot be undone.
              </p>

              <div className="flex items-center justify-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowBulkDeleteConfirm(false)}
                  disabled={isBulkDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={confirmBulkDelete}
                  isLoading={isBulkDeleting}
                  disabled={isBulkDeleting}
                >
                  Delete {safeSelectedTasks.length} Task
                  {safeSelectedTasks.length > 1 ? "s" : ""}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-bg-overlay" />

            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-bg-card shadow-custom-xl rounded-lg border border-border-light">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-error-100 rounded-full mb-4">
                <FiTrash className="w-6 h-6 text-error-600" />
              </div>

              <h3 className="text-lg font-semibold text-text-primary text-center mb-2">
                Delete Task
              </h3>
              <p className="text-text-secondary text-center mb-6">
                Are you sure you want to delete this task? This action cannot be
                undone.
              </p>

              <div className="flex items-center justify-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteTargetId(null);
                  }}
                >
                  Cancel
                </Button>
                <Button variant="danger" onClick={confirmDelete}>
                  Delete Task
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
