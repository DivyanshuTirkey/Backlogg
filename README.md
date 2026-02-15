# Backlogg - Smart Productivity Hub

A modern, "roadmap.sh" inspired Kanban board and task management app built with **Next.js 16**, **React 19**, **Tailwind CSS**, and **Firebase**.

## Features

- **Kanban Board**: Visualize plans in To Do, In Progress, Done, and Backlog columns.
- **Timeline View**: Detailed modal with a vertical timeline for subtasks/activities.
- **Real-time Sync**: Instant updates across devices using Cloud Firestore.
- **Google Auth**: Secure sign-in with data isolation per user.
- **PWA Support**: Installable on desktop and mobile.
- **Dark Mode**: Sleek, glassmorphism-inspired dark UI.

## Getting Started

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    npm install --legacy-peer-deps
    ```
3.  **Configure Firebase**:
    - Create a `.env.local` file based on `.env.local.example`.
    - Add your Firebase project credentials.
4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: shadcn/ui, Tailwind CSS, Framer Motion
- **Backend**: Firebase (Auth, Firestore)
- **Drag & Drop**: @hello-pangea/dnd

## License

MIT
