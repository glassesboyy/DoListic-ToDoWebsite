"use client";

import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/contexts/AuthContext";
import AuthAPI from "@/lib/auth";
import { ApiError, UpdateProfileRequest } from "@/types/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UpdateProfilePage() {
  const { user, setUser, refreshUser } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState<UpdateProfileRequest>({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
  });

  const [errors, setErrors] = useState<Partial<UpdateProfileRequest>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<UpdateProfileRequest> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await AuthAPI.updateProfile(formData);

      // Update user in context with new data
      if (user) {
        const updatedUser = {
          ...user,
          name: formData.name,
          username: formData.username,
          email: formData.email,
        };
        setUser(updatedUser);
      }

      // Optionally refresh user data from server
      await refreshUser();

      setMessage({
        type: "success",
        text: "Profile updated successfully!",
      });

      // Redirect back to profile page after 2 seconds
      setTimeout(() => {
        router.push("/dashboard/profile");
      }, 2000);
    } catch (error) {
      const apiError = error as ApiError;
      let errorMessage = apiError.message || "Failed to update profile.";

      // Handle specific validation errors
      if (apiError.status === 400) {
        errorMessage = "Please check your input and try again.";
      } else if (apiError.status === 409) {
        errorMessage = "Username or email already exists.";
      }

      setMessage({
        type: "error",
        text: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof UpdateProfileRequest]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  if (!user) {
    return (
      <div className="bg-bg-card rounded-lg shadow-custom border border-border-light p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-bg-card rounded-lg shadow-custom border border-border-light p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">
              Update Profile
            </h1>
            <p className="text-text-secondary mt-1">
              Edit your account information
            </p>
          </div>
          <Link href="/dashboard/profile">
            <Button variant="outline">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Profile
            </Button>
          </Link>
        </div>

        {/* Alert Messages */}
        {message && (
          <div className="mb-6">
            <Alert
              type={message.type}
              message={message.text}
              onClose={() => setMessage(null)}
            />
          </div>
        )}

        {/* Profile Avatar */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {(user.name || user.username || "U").charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-text-primary">
              {user.name || user.username}
            </h2>
            <p className="pl-1 text-sm text-text-secondary">{user.email}</p>
          </div>
        </div>

        {/* Update Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Enter your full name"
              required
            />

            <Input
              label="Username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              placeholder="Enter your username"
              required
            />
          </div>

          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="Enter your email"
            required
          />

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border-light">
            <Link href="/dashboard/profile">
              <Button type="button" variant="outline" disabled={isLoading}>
                Cancel
              </Button>
            </Link>
            <Button type="submit" isLoading={isLoading} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
