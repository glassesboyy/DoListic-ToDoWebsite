"use client";

import TrashTaskCard from "@/components/trash/TrashTaskCard";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import { useTrash } from "@/contexts/TrashContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiInbox, FiRotateCcw, FiTrash } from "react-icons/fi";

export default function TrashPage() {
  const router = useRouter();
  const {
    trashedTasks,
    loading,
    error,
    selectedTasks,
    fetchTrashedTasks,
    restoreTask,
    permanentDeleteTask,
    bulkRestoreTasks,
    bulkPermanentDeleteTasks,
    toggleTaskSelection,
    selectAllTasks,
    clearSelection,
    clearError,
  } = useTrash();

  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBulkRestoreConfirm, setShowBulkRestoreConfirm] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [targetTaskId, setTargetTaskId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchTrashedTasks();
  }, []);

  const handleRestoreTask = (id: number) => {
    setTargetTaskId(id);
    setShowRestoreConfirm(true);
  };

  const handlePermanentDeleteTask = (id: number) => {
    setTargetTaskId(id);
    setShowDeleteConfirm(true);
  };

  const confirmRestore = async () => {
    if (targetTaskId) {
      setIsProcessing(true);
      try {
        await restoreTask(targetTaskId);
        setShowRestoreConfirm(false);
        setTargetTaskId(null);
      } catch (err) {
        // Error handled in context
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const confirmPermanentDelete = async () => {
    if (targetTaskId) {
      setIsProcessing(true);
      try {
        await permanentDeleteTask(targetTaskId);
        setShowDeleteConfirm(false);
        setTargetTaskId(null);
      } catch (err) {
        // Error handled in context
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleBulkRestore = () => {
    const selectedArray = Array.isArray(selectedTasks) ? selectedTasks : [];
    if (selectedArray.length > 0) {
      setShowBulkRestoreConfirm(true);
    }
  };

  const handleBulkPermanentDelete = () => {
    const selectedArray = Array.isArray(selectedTasks) ? selectedTasks : [];
    if (selectedArray.length > 0) {
      setShowBulkDeleteConfirm(true);
    }
  };

  const confirmBulkRestore = async () => {
    const selectedArray = Array.isArray(selectedTasks) ? selectedTasks : [];
    if (selectedArray.length > 0) {
      setIsProcessing(true);
      try {
        await bulkRestoreTasks(selectedArray);
        setShowBulkRestoreConfirm(false);
      } catch (err) {
        // Error handled in context
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const confirmBulkPermanentDelete = async () => {
    const selectedArray = Array.isArray(selectedTasks) ? selectedTasks : [];
    if (selectedArray.length > 0) {
      setIsProcessing(true);
      try {
        await bulkPermanentDeleteTasks(selectedArray);
        setShowBulkDeleteConfirm(false);
      } catch (err) {
        // Error handled in context
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Safe array operations
  const safeSelectedTasks = Array.isArray(selectedTasks) ? selectedTasks : [];
  const safeTrashedTasks = Array.isArray(trashedTasks) ? trashedTasks : [];

  const allSelected =
    safeTrashedTasks.length > 0 &&
    safeSelectedTasks.length === safeTrashedTasks.length;
  const someSelected =
    safeSelectedTasks.length > 0 &&
    safeSelectedTasks.length < safeTrashedTasks.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Trash</h1>
          <p className="text-text-secondary mt-1">
            Manage deleted tasks - restore or permanently delete them
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/task")}
        >
          ← Back to Tasks
        </Button>
      </div>

      {/* Error Alert */}
      {error && <Alert type="error" message={error} onClose={clearError} />}

      {/* Bulk Actions */}
      {safeTrashedTasks.length > 0 && (
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
                <Button
                  variant="secondary"
                  onClick={handleBulkRestore}
                  className="flex items-center justify-center"
                >
                  <FiRotateCcw className="w-4 h-4 mr-2" />
                  Restore Selected ({safeSelectedTasks.length})
                </Button>
                <Button
                  variant="danger"
                  onClick={handleBulkPermanentDelete}
                  className="flex items-center justify-center"
                >
                  <FiTrash className="w-4 h-4 mr-2" />
                  Delete Forever ({safeSelectedTasks.length})
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
      ) : safeTrashedTasks.length === 0 ? (
        <div className="text-center py-12">
          <FiInbox className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            No deleted tasks
          </h3>
          <p className="text-text-secondary mb-4">
            Your trash is empty. Deleted tasks will appear here.
          </p>
          <Button onClick={() => router.push("/dashboard/task")}>
            Go to Tasks
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {safeTrashedTasks.map((task) => (
            <TrashTaskCard
              key={task.id}
              task={task}
              isSelected={safeSelectedTasks.includes(task.id)}
              onSelect={toggleTaskSelection}
              onRestore={handleRestoreTask}
              onPermanentDelete={handlePermanentDeleteTask}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {/* Restore Confirmation Modal */}
      {showRestoreConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-bg-overlay" />
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-bg-card shadow-custom-xl rounded-lg border border-border-light">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-success-100 rounded-full mb-4">
                <FiRotateCcw className="w-6 h-6 text-success-600" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary text-center mb-2">
                Restore Task
              </h3>
              <p className="text-text-secondary text-center mb-6">
                Are you sure you want to restore this task? It will be moved
                back to your active tasks.
              </p>
              <div className="flex items-center justify-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowRestoreConfirm(false)}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  variant="secondary"
                  onClick={confirmRestore}
                  isLoading={isProcessing}
                >
                  Restore Task
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Permanent Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-bg-overlay" />
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-bg-card shadow-custom-xl rounded-lg border border-border-light">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-error-100 rounded-full mb-4">
                <FiTrash className="w-6 h-6 text-error-600" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary text-center mb-2">
                Permanently Delete Task
              </h3>
              <p className="text-text-secondary text-center mb-6">
                Are you sure you want to permanently delete this task? This
                action cannot be undone.
              </p>
              <div className="flex items-center justify-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={confirmPermanentDelete}
                  isLoading={isProcessing}
                >
                  Delete Forever
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Restore Confirmation Modal */}
      {showBulkRestoreConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-bg-overlay" />
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-bg-card shadow-custom-xl rounded-lg border border-border-light">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-success-100 rounded-full mb-4">
                <FiRotateCcw className="w-6 h-6 text-success-600" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary text-center mb-2">
                Restore Multiple Tasks
              </h3>
              <p className="text-text-secondary text-center mb-6">
                Are you sure you want to restore {safeSelectedTasks.length}{" "}
                selected task{safeSelectedTasks.length > 1 ? "s" : ""}? They
                will be moved back to your active tasks.
              </p>
              <div className="flex items-center justify-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowBulkRestoreConfirm(false)}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  variant="secondary"
                  onClick={confirmBulkRestore}
                  isLoading={isProcessing}
                >
                  Restore {safeSelectedTasks.length} Task
                  {safeSelectedTasks.length > 1 ? "s" : ""}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Permanent Delete Confirmation Modal */}
      {showBulkDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-bg-overlay" />
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-bg-card shadow-custom-xl rounded-lg border border-border-light">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-error-100 rounded-full mb-4">
                <FiTrash className="w-6 h-6 text-error-600" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary text-center mb-2">
                Permanently Delete Multiple Tasks
              </h3>
              <p className="text-text-secondary text-center mb-6">
                Are you sure you want to permanently delete{" "}
                {safeSelectedTasks.length} selected task
                {safeSelectedTasks.length > 1 ? "s" : ""}? This action cannot be
                undone.
              </p>
              <div className="flex items-center justify-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowBulkDeleteConfirm(false)}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={confirmBulkPermanentDelete}
                  isLoading={isProcessing}
                >
                  Delete Forever ({safeSelectedTasks.length})
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
