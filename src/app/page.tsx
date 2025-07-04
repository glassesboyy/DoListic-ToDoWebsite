"use client";

import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FiClipboard, FiLock, FiZap } from "react-icons/fi";

// Tambahkan komponen logo sederhana
function DoListicLogo() {
  return (
    <svg
      className="w-8 h-8 text-primary mr-2"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="4" y="4" width="24" height="24" rx="6" fill="currentColor" />
      <path
        d="M10 16l4 4 8-8"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-bg-main">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Branding dengan logo */}
          <div className="flex items-center">
            <DoListicLogo />
            <span className="text-2xl font-bold text-primary">DoListic</span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link href="/auth/login">
              <Button
                variant="outline"
                className="flex items-center justify-center"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="flex items-center justify-center">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-text-primary mb-6">
            Organize Your Life with{" "}
            <span className="text-primary">DoListic</span>
          </h1>
          <p className="text-xl text-text-secondary mb-8 max-w-3xl mx-auto">
            Stay productive and organized with our intuitive task management
            system. Create, manage, and track your tasks with ease.
          </p>
          <div className="space-x-4">
            <Link href="/auth/register">
              <Button size="lg" className="flex items-center justify-center">
                Start Free Today
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                variant="outline"
                size="lg"
                className="flex items-center justify-center"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiClipboard className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              Easy Task Management
            </h3>
            <p className="text-text-secondary">
              Create, edit, and organize your tasks with our intuitive
              interface.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiZap className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              Lightning Fast
            </h3>
            <p className="text-text-secondary">
              Built with modern technologies for optimal performance and speed.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiLock className="w-8 h-8 text-success-600" />
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              Secure & Private
            </h3>
            <p className="text-text-secondary">
              Your data is protected with industry-standard security measures.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
