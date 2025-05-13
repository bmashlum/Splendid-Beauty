// components/section.tsx
// Unused component, but keeping definition
import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> { // Extend HTMLAttributes
  id: string;
  children: React.ReactNode;
  // className is already part of HTMLAttributes
}

// Forward ref for potential parent manipulation
const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ id, children, className, ...props }, ref) => {
    return (
      <section
        id={id}
        ref={ref}
        className={cn(
          "min-h-screen flex flex-col items-center justify-center px-6 py-24 outline-none", // Added outline-none
          className
        )}
        // Spread remaining props like aria-label etc.
        {...props}
      >
        {children}
      </section>
    );
  }
);

Section.displayName = "Section"; // Add display name for DevTools

export default Section;