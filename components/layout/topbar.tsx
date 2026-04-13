import { UserButton } from "@clerk/nextjs";
import { MobileNav } from "./mobile-nav";

interface TopbarProps {
  heading?: string;
}

export function Topbar({ heading }: TopbarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <MobileNav />
        {heading && <h1 className="text-lg font-semibold text-gray-900">{heading}</h1>}
      </div>
      <div className="flex items-center gap-3">
        <UserButton />
      </div>
    </header>
  );
}
