import Link from "next/link";
import React from "react";
import { Button } from "../../ui/button";
import { ArrowLeft } from "lucide-react";

type Link = {
  linkLabel: string;
  href?: string;
  onClick?: () => void;
  Icon?: React.ElementType;
};

type Props = {
  title: string;
  desc?: string;
  links?: Link | Link[];
  backLink?: Link;
};

const AdminHeaderTitle = ({ title, desc, links, backLink }: Props) => {
  const linksArr = !links ? [] : Array.isArray(links) ? links : [links];

  return (
    <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-4">
      <div className="flex flex-col gap-4">
        {backLink && (
          <Link
            href={backLink.href!}
            className="group inline-flex items-center gap-2 font-bold text-muted-foreground hover:text-primary text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            {backLink.linkLabel}
          </Link>
        )}

        <div>
          <h1 className="font-bold text-foreground text-3xl md:text-4xl tracking-tight">
            {title}
          </h1>
          <p className="mt-1 text-muted-foreground">{desc}</p>
        </div>
      </div>

      <div>
        {linksArr.map((link, idx) => (
          <CTA key={`${link.linkLabel}-${idx}`} link={link}>
            {link.Icon && (
              <link.Icon className="mr-2 w-5 h-5 group-hover:rotate-90 transition-transform" />
            )}
            {link.linkLabel}
          </CTA>
        ))}
      </div>
    </div>
  );
};

const CTA = ({ link, children }: { link: Link; children: React.ReactNode }) => {
  if (link.href) {
    return (
      <Link href={link.href}>
        <Button className="group px-6 rounded-2xl h-12 font-bold">
          {children}
        </Button>
      </Link>
    );
  }

  return (
    <Button onClick={link.onClick} className="group rounded-2xl h-12 font-bold">
      {children}
    </Button>
  );
};

export default AdminHeaderTitle;
