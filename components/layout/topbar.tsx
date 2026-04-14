import { UserButton } from "@clerk/nextjs";
import { MobileNav } from "./mobile-nav";

interface TopbarProps {
  heading?: string;
}

export function Topbar({ heading }: TopbarProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <MobileNav />
        {heading && <h1 className="text-base font-semibold text-zinc-100">{heading}</h1>}
      </div>
      <div className="flex items-center gap-3">
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-7 w-7",
            },
          }}
        />
      </div>
    </header>
  );
}
