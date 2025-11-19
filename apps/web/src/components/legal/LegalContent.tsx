import React from "react";

interface LegalContentProps {
  children: React.ReactNode;
}

export function LegalContent({ children }: LegalContentProps) {
  return (
    <div className="space-y-8 text-white leading-relaxed">{children}</div>
  );
}

