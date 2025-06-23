"use client";

import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useState } from "react";

export default function ProfilePage() {
  const { user } = useAuth();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

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
            <h1 className="text-3xl font-bold text-text-primary">Profile</h1>
            <p className="text-text-secondary mt-1">
              Manage your account information
            </p>
          </div>
          <Link href="/dashboard/profile/update-profile">
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit Profile
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

        {/* Profile Information Display */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Full Name
              </label>
              <div className="px-3 py-2 border border-border-light rounded-lg bg-bg-secondary">
                <p className="text-text-primary">{user?.name || "Not set"}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Username
              </label>
              <div className="px-3 py-2 border border-border-light rounded-lg bg-bg-secondary">
                <p className="text-text-primary">
                  {user?.username || "Not set"}
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Email Address
            </label>
            <div className="px-3 py-2 border border-border-light rounded-lg bg-bg-secondary">
              <p className="text-text-primary">{user?.email || "Not set"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
