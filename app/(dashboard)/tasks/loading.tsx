export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 h-8 w-48 animate-pulse rounded-lg bg-zinc-800" />
      <div className="mb-8 h-12 w-full animate-pulse rounded-lg bg-zinc-800" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-48 animate-pulse rounded-xl bg-zinc-900" />
        ))}
      </div>
    </div>
  );
}
