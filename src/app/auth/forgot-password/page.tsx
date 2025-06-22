"use client";

import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import AuthAPI from "@/lib/auth";
import { ApiError, ForgotPasswordRequest } from "@/types/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [formData, setFormData] = useState<ForgotPasswordRequest>({
    email: "",
  });
  const [errors, setErrors] = useState<Partial<ForgotPasswordRequest>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors: Partial<ForgotPasswordRequest> = {};

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
      await AuthAPI.forgotPassword(formData);
      setMessage({
        type: "success",
        text: "If your account exists, you will receive a password reset code via email.",
      });

      // Redirect to reset password page with email pre-filled
      setTimeout(() => {
        router.push(
          `/auth/reset-password?email=${encodeURIComponent(formData.email)}`
        );
      }, 2000);
    } catch (error) {
      const apiError = error as ApiError;
      setMessage({
        type: "error",
        text:
          apiError.message || "Failed to send reset code. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof ForgotPasswordRequest]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-bg-card rounded-xl shadow-custom-lg border border-border-light p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary">
            Forgot Password
          </h1>
          <p className="text-text-secondary mt-2">
            Enter your email to receive a reset code
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
            placeholder="Enter your email address"
            required
          />

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? "Sending Reset Code..." : "Send Reset Code"}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-text-secondary">
            Remember your password?{" "}
            <Link
              href="/auth/login"
              className="text-primary hover:text-primary-600 font-medium"
            >
              Sign in
            </Link>
          </p>
          <p className="text-text-secondary">
            Don't have an account?{" "}
            <Link
              href="/auth/register"
              className="text-primary hover:text-primary-600 font-medium"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
