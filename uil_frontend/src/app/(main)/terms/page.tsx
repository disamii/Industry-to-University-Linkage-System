import React from "react";

const SECTIONS = [
  {
    title: "Acceptance of Terms",
    content:
      "By accessing and using this platform, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, you are prohibited from using the service.",
  },
  {
    title: "User Responsibilities",
    content:
      "Users are responsible for maintaining the confidentiality of their account credentials and for all activities that occur under their account. You agree to provide accurate, current, and complete information during the registration process.",
  },
  {
    title: "Intellectual Property",
    content:
      "All content, features, and functionality—including but not limited to text, graphics, logos, and software—are the exclusive property of the platform and its licensors and are protected by international copyright and trademark laws.",
  },
  {
    title: "Limitation of Liability",
    content:
      "In no event shall the platform, its directors, or its partners be liable for any indirect, incidental, special, or consequential damages resulting from your use or inability to use the service.",
  },
];

const TermsPage = () => {
  return (
    <section>
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-16 pb-12 border-border border-b">
          <h1 className="mb-4 font-bold text-foreground text-4xl md:text-5xl tracking-tight">
            Terms of <span className="text-primary">Service</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Last updated: April 01, 2026
          </p>
        </div>

        {/* Content Area */}
        <div className="space-y-12">
          {SECTIONS.map((section, idx) => (
            <div key={idx} className="group">
              <h2 className="flex items-center gap-4 mb-4 font-bold text-foreground text-xl tracking-tight">
                <span className="font-mono text-primary/50 text-sm">
                  0{idx + 1}
                </span>
                {section.title}
              </h2>
              <div className="pl-9 border-border group-hover:border-primary border-l transition-colors duration-300">
                <p className="text-muted-foreground leading-relaxed">
                  {section.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="bg-muted/30 mt-20 p-8 border border-border rounded-3xl">
          <p className="text-muted-foreground text-sm text-center italic">
            Questions regarding these terms? Please contact our legal department
            at support@example.com.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TermsPage;
