# ✨ Collaborative Whiteboard

A real-time, collaborative whiteboard application built with React and Supabase. This project showcases a production-ready implementation of complex features like live cursors, synchronized drawing, and optimistic UI updates in a modern, beautifully designed interface.

## 🚀 Features

### 🎨 Core Drawing & Editing Tools

- **Multi-Tool Support**: Seamlessly switch between Pen, Eraser, Line, Rectangle, Circle, and Text tools.
- **Style Customization**: A rich color palette and a range of stroke widths to bring your ideas to life.
- **Undo/Redo**: Complete history management for all drawing actions.
- **Clear Canvas**: Instantly reset the whiteboard with a single click.

### 👥 Real-time Collaboration

- **Live Cursors**: See other users' cursors move in real-time with their names and avatar colors.
- **User Presence**: View a list of all active users currently on the whiteboard.
- **Synchronized State**: All drawing actions are instantly synchronized across all clients using Supabase Realtime.

### 🔐 Authentication & User Management

- **Passwordless Auth**: Secure magic link authentication via email.
- **User Profiles**: Automatically generated user profiles with customizable display names and unique avatar colors.

### 📱 Modern UI & UX

- **Responsive Design**: Optimized for a great experience on both desktop and tablet devices.
- **Shareable Links**: Every whiteboard has a unique, shareable URL for easy collaboration.
- **Auto-Saving**: All changes are automatically and instantly saved to the database.
- **Editable Title**: Easily rename your whiteboards.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Lucide React
- **Backend**: Supabase (PostgreSQL Database, Real-time Subscriptions, Authentication)
- **State Management**: React Hooks (`useState`, `useCallback`, `useEffect`) for local and custom hook-based state management.

## ⚙️ Getting Started

Follow these steps to get the project running locally.

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/)
- A [Supabase](https://supabase.com/) account

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/aryan877/react-course-projects
cd 08-collaborative-whiteboard-with-supabase

# Install dependencies
npm install
```

### 3. Set up Supabase

- Go to your [Supabase Dashboard](https://app.supabase.com) and create a new project.
- Navigate to **Project Settings** > **API**.
- Find your **Project URL** and **`anon` public key**.
- Create a `.env` file in the root of the project directory. You can copy the example if one exists, or create it from scratch.
- Add your Supabase credentials to the `.env` file:
  ```env
  VITE_SUPABASE_URL=your_supabase_project_url
  VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
  ```

### 4. Set up the Database

- Go to the **SQL Editor** in your Supabase project dashboard.
- Click **New query**.
- Copy the entire content of `supabase/migrations/20250629214508_crystal_island.sql` and paste it into the editor.
- Click **Run** to execute the script. This will create the necessary tables and policies.

### 5. Configure Authentication

- In your Supabase dashboard, go to **Authentication** > **Providers** and ensure **Email** is enabled.
- Go to **Authentication** > **URL Configuration**.
- Set your **Site URL** to `http://localhost:5173` for local development. When deploying, you will need to update this to your production URL.
- For a quicker setup, you can disable **Confirm email** in **Authentication > Providers > Email**.

### 6. Start the Development Server

```bash
npm run dev
```

The application should now be running at `http://localhost:5173`.

## 🏗️ Architecture & Project Structure

This project uses a component-based architecture with custom hooks to encapsulate logic and side effects.

- `src/components`: Contains all React components, divided into UI elements (`Toolbar`, `WhiteboardCanvas`), pages (`AuthForm`, `WhiteboardApp`), and common elements (`FullScreenLoader`).
- `src/hooks`: The core logic of the application resides here.
  - `useAuth.js`: Manages user authentication and profiles.
  - `useWhiteboardData.js`: Central hook for all whiteboard data, including elements, undo/redo stacks, and real-time synchronization logic.
  - `useCanvasInteraction.js`: Translates user mouse events into drawing actions.
  - `useCanvasDrawing.js`: Contains the low-level canvas rendering logic.
- `src/lib`: Handles direct communication with the Supabase backend.
  - `supabase.js`: Initializes the Supabase client.
  - `db.js`: A data access layer with functions for all database CRUD operations.
  - `realtime.js`: A helper library for managing Supabase Realtime channels and events.
- `src/utils`: Contains constants (`constants.js`) and utility functions (`hitDetection.js`).
- `supabase/migrations`: Contains database schema definitions.

## 🌐 Real-time & State Synchronization

The application's real-time functionality is powered by Supabase:

- **Presence Channel**: Used to track and broadcast live cursor positions and active user information. Each user's cursor position is sent via `channel.track()`.
- **Broadcast Channel**: Used for synchronizing the state of the drawing elements. When a user performs an action that changes the canvas (draw, undo, redo, clear), the entire state object (`elements`, `undoStack`, `redoStack`) is broadcast to all other clients using a `state-replace` event. This ensures that all users see the exact same canvas state.
- **Optimistic Updates**: To make the UI feel instantaneous, actions like drawing or deleting an element are applied to the local state immediately. The change is then sent to the database. If the database operation fails, the local state is rolled back.

## 🔒 Security

Security is managed at the database level using Supabase's **Row Level Security (RLS)**.

- **Authentication**: All API requests and real-time messages are protected and require a valid JWT from an authenticated user.
- **Policies**: RLS policies are enabled on all tables (`profiles`, `whiteboards`, `drawing_elements`, `active_cursors`) to ensure that:
  - Users can only read and write data for whiteboards they have access to (either their own or public ones).
  - Users can only update their own profiles and cursor positions.
  - These policies are defined in the initial migration script.

## 🚀 Deployment

The application is a standard Vite React project and can be deployed to any static hosting provider.

### Vercel / Netlify

1. Connect your Git repository to Vercel or Netlify.
2. Configure the build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add your Supabase environment variables (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`) in the project settings on your hosting provider.
4. Update the **Site URL** in your Supabase Authentication settings to your production domain.
5. Deploy!

---

Built with ❤️ using React and Supabase
