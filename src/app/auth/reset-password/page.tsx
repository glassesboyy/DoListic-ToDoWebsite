"use client";

import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import OTPInput from "@/components/ui/OTPInput";
import AuthAPI from "@/lib/auth";
import { ApiError, ResetPasswordRequest } from "@/types/auth";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";

function ResetPasswordContent() {
  const [formData, setFormData] = useState<ResetPasswordRequest>({
    email: "",
    otp_code: "",
    new_password: "",
    password_confirm: "",
  });
  const [errors, setErrors] = useState<Partial<ResetPasswordRequest>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Pre-fill email if coming from forgot-password page
    const email = searchParams.get("email");
    if (email) {
      setFormData((prev) => ({ ...prev, email: decodeURIComponent(email) }));
    }
  }, [searchParams]);

  const validateForm = (): boolean => {
    const newErrors: Partial<ResetPasswordRequest> = {};

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.otp_code.trim()) newErrors.otp_code = "OTP code is required";
    else if (formData.otp_code.length !== 4)
      newErrors.otp_code = "OTP code must be 4 digits";
    if (!formData.new_password)
      newErrors.new_password = "New password is required";
    else if (formData.new_password.length < 6)
      newErrors.new_password = "Password must be at least 6 characters";
    if (!formData.password_confirm)
      newErrors.password_confirm = "Password confirmation is required";
    else if (formData.new_password !== formData.password_confirm) {
      newErrors.password_confirm = "Passwords do not match";
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
        email: formData.email, // Keep email
        otp_code: "",
        new_password: "",
        password_confirm: "",
      });

      // Redirect to login after success
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (error) {
      const apiError = error as ApiError;
      let errorMessage = "Password reset failed. Please try again.";

      if (apiError.status === 404) {
        errorMessage = "Wrong email or OTP code.";
      } else if (apiError.status === 400) {
        if (apiError.message.includes("Invalid OTP")) {
          errorMessage = "Invalid OTP code. Please check and try again.";
        } else if (apiError.message.includes("Expired OTP")) {
          errorMessage = "OTP code has expired. Please request a new one.";
        } else if (apiError.message.includes("Password Not Match")) {
          errorMessage = "Passwords do not match.";
        } else {
          errorMessage = apiError.message;
        }
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
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof ResetPasswordRequest]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleOTPChange = (otpValue: string) => {
    setFormData((prev) => ({ ...prev, otp_code: otpValue }));

    if (errors.otp_code) {
      setErrors((prev) => ({ ...prev, otp_code: undefined }));
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
            Enter the 4-digit code sent to your email and your new password
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

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <OTPInput
            label="Verification Code"
            value={formData.otp_code}
            onChange={handleOTPChange}
            error={errors.otp_code}
            disabled={isLoading}
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
            name="password_confirm"
            type="password"
            value={formData.password_confirm}
            onChange={handleChange}
            error={errors.password_confirm}
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

        <div className="mt-6 text-center space-y-2">
          <p className="text-text-secondary text-sm">
            Didn't receive the code?{" "}
            <Link
              href="/auth/forgot-password"
              className="text-primary hover:text-primary-600 font-medium"
            >
              Send again
            </Link>
          </p>
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg-main flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
