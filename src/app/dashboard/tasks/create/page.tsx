"use client";

import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { useTodos } from "@/contexts/TodoContext";
import { CreateTodoRequest } from "@/types/todo";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateTaskPage() {
  const { createTodo, isLoading, error, clearError } = useTodos();
  const router = useRouter();

  const [formData, setFormData] = useState<CreateTodoRequest>({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
  });

  const [errors, setErrors] = useState<Partial<CreateTodoRequest>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateTodoRequest> = {};

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
      // Convert dates to ISO format
      const submitData = {
        ...formData,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
      };

      await createTodo(submitData);
      router.push("/dashboard/tasks");
    } catch (error) {
      // Error is handled by context
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof CreateTodoRequest]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text-primary">
          Create New Task
        </h1>
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
              {isLoading ? "Creating..." : "Create Task"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
