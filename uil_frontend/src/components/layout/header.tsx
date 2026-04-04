"use client";

import Logo from "../reusable/logo";
import { ThemeToggle } from "../theme-toggle";
import ProfileDropdown from "./profile-dropdown";

export function Header() {
  return (
    <header className="top-4 z-50 fixed inset-x-0 px-3 lg:px-6">
      <nav className="mx-auto max-w-7xl">
        <div className="flex justify-between items-center bg-background/60 shadow-sm backdrop-blur-xl px-4 py-2 md:py-3 border border-border/50 rounded-full">
          <Logo hasLabel={true} />

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <ProfileDropdown />
          </div>
        </div>
      </nav>
    </header>
  );
}
