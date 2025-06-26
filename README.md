# To-Do App

> **Backend repository:**  
> This is the frontend project. The backend RESTful API for this app is available at [https://github.com/wyasana12/to-do-with-golang.git](https://github.com/wyasana12/to-do-with-golang.git)

A modern, full-featured task management web application built with [Next.js](https://nextjs.org), TypeScript, and Tailwind CSS. This app allows users to create, manage, and organize their daily tasks efficiently, complete with authentication, attachments, trash management, and a responsive dashboard.

## Features

- **User Authentication:** Register, login, forgot/reset password, and profile management.
- **Task Management:** Create, edit, delete, and view tasks with status tracking (`not_started`, `in_progress`, `completed`).
- **Attachments:** Upload files or add links to tasks.
- **Trash Bin:** Soft-delete tasks, restore or permanently delete them.
- **Filtering & Pagination:** Filter tasks by status, title, and sort order. Paginated task lists.
- **Responsive Dashboard:** Sidebar navigation, theme toggle (light/dark), and user profile.
- **Modern UI:** Built with Tailwind CSS and custom themes.

## Folder Structure

```
c:\laragon\www\to-do-with-nextjs
├── app/                # Next.js app directory (pages, layouts, routes)
├── components/         # Reusable UI components (TaskCard, Button, etc.)
├── contexts/           # React context providers (Auth, Task, Trash, Theme)
├── lib/                # API clients and utility libraries
├── src/types/          # TypeScript type definitions
├── public/             # Static assets
├── tailwind.config.js  # Tailwind CSS configuration
├── README.md           # Project documentation
└── ...                 # Other config and environment files
```

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm, yarn, pnpm, atau bun

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/to-do-with-nextjs.git
   cd to-do-with-nextjs
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Configure environment variables:**

   - Copy `.env.example` to `.env.local` and set your API base URL and other secrets.

4. **Run the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open the app:**
   - Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

- **Register** a new account, then login.
- **Create, edit, and delete tasks** from the dashboard.
- **Attach files or links** to your tasks.
- **Move tasks to Trash** and restore or permanently delete them.
- **Update your profile** from the Profile page.
- **Switch themes** using the theme toggle in the header.

## Technologies Used

- [Next.js](https://nextjs.org/) (App Router)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Icons](https://react-icons.github.io/react-icons/)
- Custom API client (fetch-based)
- Context API for state management

## API

- The app expects a RESTful API backend (see `src/lib/api.ts`, `src/lib/auth.ts`, etc.).
- Configure the API base URL in your environment variables.

## Customization

- **Theme:** Easily customize colors and shadows via `tailwind.config.js` and CSS variables.
- **Fonts:** Uses [Geist](https://vercel.com/font) for modern typography.

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements or bug fixes.

## Contact

For questions or support, please contact [suryazulfikar22@gmail.com].
