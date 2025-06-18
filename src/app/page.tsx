"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if user prefers dark mode and apply it
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDarkMode(prefersDark);

    if (prefersDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="min-h-screen bg-bg-main transition-colors duration-300">
      {/* Header with Dark Mode Toggle */}
      <header className="bg-bg-card border-b border-border-light px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">
            ToDo App - Color Demo
          </h1>
          <button
            onClick={toggleDarkMode}
            className="bg-primary hover:bg-primary-600 text-text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-custom-sm"
          >
            {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Color Palette Demo */}
        <section className="bg-bg-card p-6 rounded-xl shadow-custom-md border border-border-light">
          <h2 className="text-2xl font-semibold text-text-primary mb-4">
            Color Palette
          </h2>

          {/* Primary Colors */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-text-secondary mb-3">
              Primary Colors
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {[100, 300, 500, 700, 900].map((shade) => (
                <div key={shade} className="text-center">
                  <div
                    className={`h-16 w-full rounded-lg bg-primary-${shade} border border-border-light`}
                  ></div>
                  <p className="text-sm text-text-muted mt-1">
                    primary-{shade}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Status Colors */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="h-16 w-full rounded-lg bg-success border border-border-light"></div>
              <p className="text-sm text-text-muted mt-1">Success</p>
            </div>
            <div className="text-center">
              <div className="h-16 w-full rounded-lg bg-warning border border-border-light"></div>
              <p className="text-sm text-text-muted mt-1">Warning</p>
            </div>
            <div className="text-center">
              <div className="h-16 w-full rounded-lg bg-error border border-border-light"></div>
              <p className="text-sm text-text-muted mt-1">Error</p>
            </div>
            <div className="text-center">
              <div className="h-16 w-full rounded-lg bg-info border border-border-light"></div>
              <p className="text-sm text-text-muted mt-1">Info</p>
            </div>
          </div>
        </section>

        {/* Typography Demo */}
        <section className="bg-bg-card p-6 rounded-xl shadow-custom-md border border-border-light">
          <h2 className="text-2xl font-semibold text-text-primary mb-4">
            Typography
          </h2>
          <div className="space-y-2">
            <p className="text-text-primary">
              Primary Text - Main content text
            </p>
            <p className="text-text-secondary">
              Secondary Text - Supporting information
            </p>
            <p className="text-text-tertiary">
              Tertiary Text - Less important content
            </p>
            <p className="text-text-muted">Muted Text - Subtle information</p>
            <p className="text-text-disabled">
              Disabled Text - Inactive elements
            </p>
          </div>
        </section>

        {/* Button Variants */}
        <section className="bg-bg-card p-6 rounded-xl shadow-custom-md border border-border-light">
          <h2 className="text-2xl font-semibold text-text-primary mb-4">
            Button Variants
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="bg-primary hover:bg-primary-600 text-text-white px-4 py-2 rounded-lg transition-colors shadow-custom-sm">
              Primary Button
            </button>
            <button className="bg-secondary hover:bg-secondary-600 text-text-white px-4 py-2 rounded-lg transition-colors shadow-custom-sm">
              Secondary Button
            </button>
            <button className="bg-success hover:bg-success-600 text-text-white px-4 py-2 rounded-lg transition-colors shadow-custom-sm">
              Success Button
            </button>
            <button className="bg-error hover:bg-error-600 text-text-white px-4 py-2 rounded-lg transition-colors shadow-custom-sm">
              Error Button
            </button>
            <button className="border border-border-medium hover:bg-bg-hover text-text-primary px-4 py-2 rounded-lg transition-colors">
              Outline Button
            </button>
            <button className="bg-bg-disabled text-text-disabled px-4 py-2 rounded-lg cursor-not-allowed opacity-disabled">
              Disabled Button
            </button>
          </div>
        </section>

        {/* Cards with Different Backgrounds */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">
            Card Variants
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-bg-card p-6 rounded-xl shadow-custom-sm border border-border-light">
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Default Card
              </h3>
              <p className="text-text-secondary">
                This is a default card with standard background.
              </p>
            </div>
            <div className="bg-bg-secondary p-6 rounded-xl shadow-custom-sm border border-border-light">
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Secondary Background
              </h3>
              <p className="text-text-secondary">
                This card uses secondary background color.
              </p>
            </div>
            <div className="bg-bg-tertiary p-6 rounded-xl shadow-custom-sm border border-border-light">
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Tertiary Background
              </h3>
              <p className="text-text-secondary">
                This card uses tertiary background color.
              </p>
            </div>
          </div>
        </section>

        {/* Status Messages */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">
            Status Messages
          </h2>
          <div className="space-y-3">
            <div className="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-lg">
              <strong>Success:</strong> Your action was completed successfully!
            </div>
            <div className="bg-warning-50 border border-warning-200 text-warning-700 px-4 py-3 rounded-lg">
              <strong>Warning:</strong> Please review your input before
              proceeding.
            </div>
            <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg">
              <strong>Error:</strong> Something went wrong. Please try again.
            </div>
            <div className="bg-info-50 border border-info-200 text-info-700 px-4 py-3 rounded-lg">
              <strong>Info:</strong> Here's some helpful information for you.
            </div>
          </div>
        </section>

        {/* Form Elements */}
        <section className="bg-bg-card p-6 rounded-xl shadow-custom-md border border-border-light">
          <h2 className="text-2xl font-semibold text-text-primary mb-4">
            Form Elements
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-text-secondary font-medium mb-1">
                Input Field
              </label>
              <input
                type="text"
                placeholder="Enter text here..."
                className="w-full px-3 py-2 border border-border-light rounded-lg focus:border-border-focus focus:outline-none focus:shadow-focus-ring bg-bg-main text-text-primary"
              />
            </div>
            <div>
              <label className="block text-text-secondary font-medium mb-1">
                Select Dropdown
              </label>
              <select className="w-full px-3 py-2 border border-border-light rounded-lg focus:border-border-focus focus:outline-none bg-bg-main text-text-primary">
                <option>Choose an option</option>
                <option>Option 1</option>
                <option>Option 2</option>
              </select>
            </div>
            <div>
              <label className="block text-text-secondary font-medium mb-1">
                Textarea
              </label>
              <textarea
                placeholder="Enter your message..."
                rows={3}
                className="w-full px-3 py-2 border border-border-light rounded-lg focus:border-border-focus focus:outline-none focus:shadow-focus-ring bg-bg-main text-text-primary resize-none"
              ></textarea>
            </div>
          </div>
        </section>

        {/* Shadow Examples */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">
            Shadow Variants
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-bg-card p-4 rounded-lg shadow-custom-sm border border-border-light text-center">
              <p className="text-text-secondary">Small Shadow</p>
            </div>
            <div className="bg-bg-card p-4 rounded-lg shadow-custom-md border border-border-light text-center">
              <p className="text-text-secondary">Medium Shadow</p>
            </div>
            <div className="bg-bg-card p-4 rounded-lg shadow-custom-lg border border-border-light text-center">
              <p className="text-text-secondary">Large Shadow</p>
            </div>
            <div className="bg-bg-card p-4 rounded-lg shadow-custom-xl border border-border-light text-center">
              <p className="text-text-secondary">Extra Large Shadow</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
