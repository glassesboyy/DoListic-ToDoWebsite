"use client";

import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { useTodos } from "@/contexts/TodoContext";
import { UpdateTodoRequest } from "@/types/todo";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditTaskPage() {
  const { id } = useParams();
  const router = useRouter();
  const {
    currentTodo,
    isLoading,
    error,
    fetchTodo,
    updateTodo,
    clearError,
    clearCurrentTodo,
  } = useTodos();

  const [formData, setFormData] = useState<UpdateTodoRequest>({
    title: "",
    description: "",
    status: "not_started",
    start_date: "",
    end_date: "",
  });

  const [errors, setErrors] = useState<Partial<UpdateTodoRequest>>({});

  useEffect(() => {
    if (id) {
      fetchTodo(Number(id));
    }
    return () => {
      clearCurrentTodo();
    };
  }, [id, fetchTodo, clearCurrentTodo]);

  useEffect(() => {
    if (currentTodo) {
      setFormData({
        title: currentTodo.title,
        description: currentTodo.description,
        status: currentTodo.status,
        start_date: new Date(currentTodo.start_date).toISOString().slice(0, 16),
        end_date: new Date(currentTodo.end_date).toISOString().slice(0, 16),
      });
    }
  }, [currentTodo]);

  const validateForm = (): boolean => {
    const newErrors: Partial<UpdateTodoRequest> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    else if (formData.title.length < 3)
      newErrors.title = "Title must be at least 3 characters";
    else if (formData.title.length > 100)
      newErrors.title = "Title must not exceed 100 characters";

    if (formData.description.length > 1000)
      newErrors.description = "Description must not exceed 1000 characters";

    if (!formData.start_date) newErrors.start_date = "Start date is required";
    if (!formData.end_date) newErrors.end_date = "End date is required";

    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      if (startDate > endDate) {
        newErrors.end_date = "End date must be after start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) return;

    try {
      const submitData = {
        ...formData,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
      };

      await updateTodo(Number(id), submitData);
      router.push("/dashboard/tasks");
    } catch (error) {
      // Error is handled by context
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof UpdateTodoRequest]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  if (isLoading && !currentTodo) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-text-secondary">Loading task...</p>
      </div>
    );
  }

  if (error && !currentTodo) {
    return (
      <div className="text-center py-12">
        <div className="text-error-600 mb-4">{error}</div>
        <Link href="/dashboard/tasks">
          <Button>Back to Tasks</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text-primary">Edit Task</h1>
        <Link href="/dashboard/tasks">
          <Button variant="outline">Back to Tasks</Button>
        </Link>
      </div>

      {/* Form */}
      <div className="bg-bg-card rounded-lg shadow-custom border border-border-light p-6">
        {error && (
          <div className="mb-6">
            <Alert type="error" message={error} onClose={clearError} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Task Title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            placeholder="Enter task title..."
            required
          />

          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
            placeholder="Describe your task..."
            rows={4}
          />

          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={[
              { value: "not_started", label: "Not Started" },
              { value: "in_progress", label: "In Progress" },
              { value: "completed", label: "Completed" },
            ]}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Start Date"
              name="start_date"
              type="datetime-local"
              value={formData.start_date}
              onChange={handleChange}
              error={errors.start_date}
              required
            />

            <Input
              label="End Date"
              name="end_date"
              type="datetime-local"
              value={formData.end_date}
              onChange={handleChange}
              error={errors.end_date}
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Link href="/dashboard/tasks">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" isLoading={isLoading}>
              {isLoading ? "Updating..." : "Update Task"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
