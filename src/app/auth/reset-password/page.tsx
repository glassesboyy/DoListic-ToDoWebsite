"use client";

import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import AuthAPI from "@/lib/auth";
import { ApiError, ResetPasswordRequest } from "@/types/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState<ResetPasswordRequest>({
    email: "",
    username: "",
    new_password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<
    Partial<ResetPasswordRequest & { confirm_password: string }>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors: Partial<
      ResetPasswordRequest & { confirm_password: string }
    > = {};

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.new_password)
      newErrors.new_password = "New password is required";
    else if (formData.new_password.length < 6)
      newErrors.new_password = "Password must be at least 6 characters";
    if (!confirmPassword)
      newErrors.confirm_password = "Password confirmation is required";
    else if (formData.new_password !== confirmPassword) {
      newErrors.confirm_password = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await AuthAPI.resetPassword(formData);
      setMessage({
        type: "success",
        text: "Password reset successfully! You can now sign in with your new password.",
      });

      // Reset form
      setFormData({
        email: "",
        username: "",
        new_password: "",
      });
      setConfirmPassword("");

      // Redirect to login after success
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (error) {
      const apiError = error as ApiError;
      let errorMessage = "Password reset failed. Please try again.";

      if (apiError.status === 404) {
        errorMessage = "Email and username do not match any account.";
      } else if (apiError.message) {
        errorMessage = apiError.message;
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

    if (name === "confirm_password") {
      setConfirmPassword(value);
      if (errors.confirm_password) {
        setErrors((prev) => ({ ...prev, confirm_password: undefined }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name as keyof ResetPasswordRequest]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-bg-card rounded-xl shadow-custom-lg border border-border-light p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary">
            Reset Password
          </h1>
          <p className="text-text-secondary mt-2">
            Enter your details to reset your password
          </p>
        </div>

        {message && (
          <div className="mb-6">
            <Alert
              type={message.type}
              message={message.text}
              onClose={() => setMessage(null)}
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="Enter your email"
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

          <Input
            label="New Password"
            name="new_password"
            type="password"
            value={formData.new_password}
            onChange={handleChange}
            error={errors.new_password}
            placeholder="Enter your new password"
            required
          />

          <Input
            label="Confirm New Password"
            name="confirm_password"
            type="password"
            value={confirmPassword}
            onChange={handleChange}
            error={errors.confirm_password}
            placeholder="Confirm your new password"
            required
          />

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? "Resetting Password..." : "Reset Password"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-text-secondary">
            Remember your password?{" "}
            <Link
              href="/auth/login"
              className="text-primary hover:text-primary-600 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
