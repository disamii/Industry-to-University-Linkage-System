"use client";

import { Menu } from "lucide-react";
import Logo from "../logo";
import { ThemeToggle } from "../theme-toggle";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import HeaderLink from "./header-link";

const authLinks = [
  { href: "/signin", label: "Sign in", variant: "secondary" as const },
  { href: "/signup", label: "Get Started", variant: "default" as const },
];

export function Header() {
  return (
    <header className="top-4 z-50 fixed inset-x-0 px-3 lg:px-6">
      <nav className="mx-auto max-w-7xl">
        <div className="flex justify-between items-center bg-background/60 shadow-sm backdrop-blur-xl px-4 py-2 md:py-3 border border-border/50 rounded-full">
          <Logo hasLabel={true} />

          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* Desktop Navigation - Hidden on Mobile */}
            <div className="hidden md:flex items-center gap-2">
              {authLinks.map((link, idx) => (
                <HeaderLink key={idx} {...link} />
              ))}
            </div>

            {/* Mobile Navigation - Visible on Mobile */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Menu className="w-5 h-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  sideOffset={12}
                  className="flex flex-col gap-2 bg-background/95 shadow-xl backdrop-blur-lg p-3 border-border/50 rounded-2xl w-56"
                >
                  {authLinks.map((link, idx) => (
                    <DropdownMenuItem
                      key={idx}
                      asChild
                      className="focus:bg-transparent p-0"
                    >
                      <HeaderLink {...link} />
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
