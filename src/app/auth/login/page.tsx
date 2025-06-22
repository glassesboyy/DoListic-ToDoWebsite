"use client";

import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/contexts/AuthContext";
import AuthAPI from "@/lib/auth";
import { ApiError, LoginRequest } from "@/types/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginRequest>({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<LoginRequest>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const { login } = useAuth();
  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginRequest> = {};
    if (!formData.username?.trim()) newErrors.username = "Username is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await AuthAPI.login(formData);

      if (response.status === "success" && (response.data || response.token)) {
        const token = response.data || response.token!;

        // Login akan otomatis mengekstrak user data dari token
        await login(token);

        setMessage({
          type: "success",
          text: "Login berhasil! Mengarahkan ke dashboard...",
        });

        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        setMessage({
          type: "error",
          text: "Login gagal. Response tidak valid dari server.",
        });
      }
    } catch (error) {
      const apiError = error as ApiError;
      let errorMessage = apiError.message || "Login gagal. Silakan coba lagi.";

      if (
        apiError.status === 403 ||
        apiError.message?.toLowerCase().includes("email not verified") ||
        apiError.message?.toLowerCase().includes("please verify your email")
      ) {
        errorMessage =
          "Email Anda belum diverifikasi. Silakan cek email dan klik link verifikasi.";
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
    if (errors[name as keyof LoginRequest]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-bg-card rounded-xl shadow-custom-lg border border-border-light p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary">Welcome Back</h1>
          <p className="text-text-secondary mt-2">Sign in to your account</p>
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
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Enter your password"
            required
          />

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 space-y-4">
          <div className="text-center">
            <Link
              href="/auth/forgot-password"
              className="text-primary hover:text-primary-600 text-sm font-medium"
            >
              Forgot your password?
            </Link>
          </div>
          {message?.type === "error" &&
            message.text.toLowerCase().includes("email") &&
            message.text.toLowerCase().includes("verified") && (
              <div className="text-center">
                <p className="text-text-secondary text-sm">
                  Didn't receive the email?{" "}
                  <Link
                    href="/auth/register"
                    className="text-primary hover:text-primary-600 font-medium"
                  >
                    Register again
                  </Link>
                </p>
              </div>
            )}
          <div className="text-center">
            <p className="text-text-secondary">
              Don't have an account?{" "}
              <Link
                href="/auth/register"
                className="text-primary hover:text-primary-600 font-medium"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
