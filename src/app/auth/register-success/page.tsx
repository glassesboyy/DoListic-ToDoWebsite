"use client";

import Button from "@/components/ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-bg-card rounded-xl shadow-custom-lg border border-border-light p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-success-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-text-primary mb-4">
            Registration Successful!
          </h1>

          <p className="text-text-secondary mb-6">
            We've sent a verification email to your inbox. Please check your
            email and click the verification link to activate your account.
          </p>

          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
            <p className="text-primary-700 text-sm">
              📧 Don't forget to check your spam folder if you don't see the
              email in your inbox.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => router.push("/auth/login")}
              className="w-full"
            >
              Go to Sign In
            </Button>

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
        </div>
      </div>
    </div>
  );
}
