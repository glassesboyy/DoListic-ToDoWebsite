"use client";

import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { useTask } from "@/contexts/TaskContext";
import TaskAPI from "@/lib/taskApi";
import { ApiError } from "@/types/auth";
import { Task, UpdateTaskRequest } from "@/types/task";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditTaskPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = parseInt(params.id as string);

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [formData, setFormData] = useState<UpdateTaskRequest>({
    title: "",
    description: "",
    status: "not_started",
    start_date: "",
    end_date: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { updateTask } = useTask();

  useEffect(() => {
    const fetchTaskDetail = async () => {
      try {
        setLoading(true);
        const data = await TaskAPI.getTaskById(taskId);
        setTask(data);

        // Populate form data
        setFormData({
          title: data.title,
          description: data.description || "",
          status: data.status,
          start_date:
            data.start_date && data.start_date !== "0001-01-01T00:00:00Z"
              ? new Date(data.start_date).toISOString().slice(0, 16)
              : "",
          end_date:
            data.end_date && data.end_date !== "0001-01-01T00:00:00Z"
              ? new Date(data.end_date).toISOString().slice(0, 16)
              : "",
        });
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError.message || "Failed to fetch task details");
      } finally {
        setLoading(false);
      }
    };

    if (taskId) {
      fetchTaskDetail();
    }
  }, [taskId]);

  const statusOptions = [
    { value: "not_started", label: "Not Started" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must not exceed 100 characters";
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = "Description must not exceed 1000 characters";
    }

    if (formData.start_date && formData.end_date) {
      if (new Date(formData.start_date) > new Date(formData.end_date)) {
        newErrors.end_date = "End date must be after start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !task) return;

    setIsUpdating(true);
    setError(null);

    try {
      const submitData = {
        ...formData,
        start_date: formData.start_date
          ? new Date(formData.start_date).toISOString()
          : undefined,
        end_date: formData.end_date
          ? new Date(formData.end_date).toISOString()
          : undefined,
      };

      await updateTask(task.id, submitData);
      router.push(`/dashboard/task/detail/${task.id}`);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Failed to update task");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error && !task) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-text-primary">Edit Task</h1>
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
        </div>

        <Alert type="error" message={error} onClose={() => setError(null)} />

        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-text-primary mb-4">
            Task not found
          </h3>
          <Button onClick={() => router.push("/dashboard/task")}>
            Go to Tasks
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Edit Task</h1>
          <p className="text-text-secondary mt-1">Update task information</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
          {task && (
            <Button
              variant="primary"
              onClick={() => router.push(`/dashboard/task/detail/${task.id}`)}
            >
              View Details
            </Button>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      {/* Edit Form */}
      <div className="bg-bg-card border border-border-light rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            placeholder="Enter task title"
            required
          />

          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
            placeholder="Enter task description (optional)"
            rows={4}
          />

          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={statusOptions}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Start Date"
              name="start_date"
              type="datetime-local"
              value={formData.start_date}
              onChange={handleChange}
              error={errors.start_date}
            />

            <Input
              label="End Date"
              name="end_date"
              type="datetime-local"
              value={formData.end_date}
              onChange={handleChange}
              error={errors.end_date}
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border-light">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isUpdating} disabled={isUpdating}>
              Update Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
