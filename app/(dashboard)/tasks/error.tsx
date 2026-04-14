"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <h2 className="text-lg font-semibold text-zinc-100 mb-2">Something went wrong</h2>
      <p className="text-sm text-zinc-500 mb-4">{error.message}</p>
      <button
        onClick={reset}
        className="rounded-lg bg-zinc-800 px-4 py-2 text-sm text-white hover:bg-zinc-700"
      >
        Try again
      </button>
    </div>
  );
}
