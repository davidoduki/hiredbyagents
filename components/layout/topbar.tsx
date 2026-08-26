import { UserButton } from "@clerk/nextjs";
import { MobileNav } from "./mobile-nav";
import { NotificationBell } from "./notification-bell";

interface TopbarProps {
  heading?: string;
}

export function Topbar({ heading }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/[0.06] bg-zinc-950/90 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex items-center gap-3">
        <MobileNav />
        {heading && <h1 className="font-display text-base font-bold tracking-tight text-zinc-100">{heading}</h1>}
      </div>
      <div className="flex items-center gap-3">
        <NotificationBell />
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
