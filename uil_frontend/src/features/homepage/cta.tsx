"use client";

import { Button } from "@/components/ui/button";
import { LINKS } from "@/lib/constants";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="w-full">
      <div className="relative bg-slate-950 mx-auto p-8 lg:p-12 rounded-[2rem]">
        <div className="z-10 relative flex md:flex-row flex-col justify-between items-center gap-8">
          <div className="flex md:flex-row flex-col items-center md:items-start gap-4 md:text-left text-center">
            <div>
              <h2 className="font-bold text-white text-2xl md:text-3xl tracking-tight">
                Ready to <span className="text-primary">Collaborate?</span>
              </h2>
              <p className="mt-1 max-w-md text-slate-400 text-sm md:text-base">
                Join our network to bridge the gap between research and
                industry.
              </p>
            </div>
          </div>

          <div className="flex gap-3 shrink-0">
            <Link href={LINKS.signup}>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 px-8 rounded-xl h-12 font-bold text-white transition-all"
              >
                Get Started
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
