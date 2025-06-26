"use client";

import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import AuthAPI from "@/lib/auth";
import { ApiError } from "@/types/auth";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

function VerifyEmailContent() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Verification token is missing.");
        return;
      }

      try {
        await AuthAPI.verifyEmail(token);
        setStatus("success");
        setMessage(
          "Email verified successfully! You can now sign in to your account."
        );
      } catch (error) {
        const apiError = error as ApiError;
        setStatus("error");

        if (apiError.status === 400) {
          setMessage("Verification token is missing or expired.");
        } else if (apiError.status === 404) {
          setMessage("Invalid token or email is already verified.");
        } else {
          setMessage(apiError.message || "Email verification failed.");
        }
      }
    };

    verifyEmail();
  }, [token]);

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              Verifying Email...
            </h1>
            <p className="text-text-secondary">
              Please wait while we verify your email address.
            </p>
          </div>
        );

      case "success":
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle className="w-8 h-8 text-success-600" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              Email Verified!
            </h1>
            <p className="text-text-secondary mb-6">{message}</p>
            <Button onClick={() => router.push("/auth/login")}>
              Go to Sign In
            </Button>
          </div>
        );

      case "error":
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiXCircle className="w-8 h-8 text-error-600" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              Verification Failed
            </h1>
            <div className="mb-6">
              <Alert type="error" message={message} />
            </div>
            <div className="space-y-3">
              <Button onClick={() => router.push("/auth/register")}>
                Register Again
              </Button>
              <div>
                <Link
                  href="/auth/login"
                  className="text-primary hover:text-primary-600 text-sm font-medium"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-bg-card rounded-xl shadow-custom-lg border border-border-light p-8">
        {renderContent()}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg-main flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
