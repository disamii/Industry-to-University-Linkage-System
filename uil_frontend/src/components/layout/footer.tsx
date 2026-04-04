"use client";

import Link from "next/link";
import Logo from "../reusable/logo";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "../ui/tooltip";
import { Mail, Phone, MapPin } from "lucide-react";
import { LINKS, UIL_CONTACT_INFO } from "@/lib/constants";

const contacts = [
  {
    icon: <Mail size={18} />,
    label: "Email",
    ...UIL_CONTACT_INFO.email,
  },
  {
    icon: <Phone size={18} />,
    label: "Call",
    ...UIL_CONTACT_INFO.phone,
  },
  {
    icon: <MapPin size={18} />,
    label: "Location",
    ...UIL_CONTACT_INFO.location,
  },
];

const links = [
  { href: LINKS.privacy, label: "Privacy Policy" },
  { href: LINKS.terms, label: "Terms of Service" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card px-3 lg:px-6 pt-16 pb-8 border-border border-t w-full">
      <div className="mx-auto max-w-7xl">
        <div className="items-center gap-12 grid grid-cols-1 md:grid-cols-2 mb-12">
          {/* Brand & Description */}
          <div className="space-y-4 md:text-left text-center">
            <Logo hasLabel={true} forceLabel={true} />
            <p className="mx-auto md:mx-0 max-w-md text-muted-foreground text-sm leading-relaxed">
              Facilitating collaboration between industry and academia to drive
              innovation, research, and mutual growth.
            </p>
          </div>

          {/* Contact Dock */}
          <div className="flex flex-col items-center md:items-end gap-4">
            <span className="font-bold text-muted-foreground text-xs uppercase tracking-widest">
              Get in touch
            </span>
            <div className="flex items-center gap-3 bg-background shadow-inner p-2 border border-border rounded-full">
              <TooltipProvider>
                {contacts.map((item, i) => (
                  <Tooltip key={i}>
                    <TooltipTrigger asChild>
                      <a
                        href={item.href}
                        className="flex justify-center items-center bg-accent hover:bg-primary rounded-full w-10 h-10 text-muted-foreground hover:text-primary-foreground active:scale-90 transition-all"
                      >
                        {item.icon}
                      </a>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="bg-primary text-primary-foreground"
                    >
                      <p className="font-bold text-xs">{item.label}</p>
                      <p className="opacity-90 text-[10px]">{item.value}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal Links */}
        <div className="flex md:flex-row flex-col-reverse justify-between items-center gap-4 pt-8 border-border/50 border-t">
          <p className="text-muted-foreground text-xs md:text-left text-center">
            © {currentYear} University-Industry Linkage. All Rights Reserved.
          </p>

          <div className="flex items-center gap-6">
            {links.map(({ href, label }, idx) => (
              <Link
                key={idx}
                href={href}
                className="text-muted-foreground hover:text-primary text-xs transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
