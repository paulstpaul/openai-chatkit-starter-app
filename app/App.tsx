"use client";

export default function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-5xl text-center text-gray-600 dark:text-gray-300">
        <h1 className="text-2xl font-semibold mb-4">Bianca Twilio Agent</h1>
        <p>
          This application runs headlessly — no front-end chat interface is
          required. Twilio SMS messages are processed through the AgentKit
          workflow.
        </p>
      </div>
    </main>
  );
}