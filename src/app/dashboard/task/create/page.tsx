"use client";

import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { useTask } from "@/contexts/TaskContext";
import { ApiError } from "@/types/auth";
import { CreateTaskRequest } from "@/types/task";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateTaskPage() {
  const router = useRouter();
  const { createTask } = useTask();

  const [formData, setFormData] = useState<CreateTaskRequest>({
    title: "",
    description: "",
    status: "not_started",
    start_date: "",
    end_date: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    if (!validateForm()) return;

    setIsCreating(true);
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

      await createTask(submitData);
      router.push("/dashboard/task");
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Failed to create task");
    } finally {
      setIsCreating(false);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            Create New Task
          </h1>
          <p className="text-text-secondary mt-1">
            Add a new task to your list
          </p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      {/* Create Form */}
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
            value={formData.description || ""}
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
              value={formData.start_date || ""}
              onChange={handleChange}
              error={errors.start_date}
            />

            <Input
              label="End Date"
              name="end_date"
              type="datetime-local"
              value={formData.end_date || ""}
              onChange={handleChange}
              error={errors.end_date}
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border-light">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isCreating} disabled={isCreating}>
              Create Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
