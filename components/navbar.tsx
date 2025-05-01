"use client"

import { useState, useEffect } from "react" 
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button" 
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

// Function to get section links based on current path
const getNavLinks = (isHomePage: boolean) => {
  const baseLinks = [
    { name: "Home", href: isHomePage ? "#top" : "/" },
    { name: "About Us", href: isHomePage ? "#about" : "/#about" },
    { name: "Book Now", href: isHomePage ? "#book-now" : "/#book-now" }, 
    { name: "Portfolio", href: isHomePage ? "#portfolio" : "/#portfolio" },
    { name: "Shop", href: isHomePage ? "#shop" : "/#shop" },
    { name: "Hair Studio", href: isHomePage ? "#hair-studio" : "/#hair-studio" },
    { name: "Academy", href: isHomePage ? "#academy" : "/#academy" },
    { name: "Policies", href: isHomePage ? "#policies" : "/#policies" },
    { name: "Connect", href: isHomePage ? "#connect" : "/#connect" },
    { name: "Blog", href: isHomePage ? "#blog" : "/blog" },
    { name: "Financing", href: isHomePage ? "#financing" : "/#financing" },
  ];
  
  return baseLinks;
}

// Define props interface for the component
interface NavbarProps {
  scrolled: boolean; // Expect 'scrolled' state from parent
}

export default function Navbar({ scrolled }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const isHomePage = pathname === "/"
  const navLinks = getNavLinks(isHomePage)

  return (
    <header
      // Use the 'scrolled' prop to conditionally apply classes
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-[#eee5e0]/95 shadow-md backdrop-blur-sm" // Apply background, shadow, slight transparency, and blur when scrolled
          : "bg-transparent" // Transparent when not scrolled
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="#top" className="flex items-center flex-shrink-0"> 
          {/* Added flex-shrink-0 to prevent shrinking on smaller screens */}
          <Image
            src="/images/splendid-logo.png" // Ensure this path is correct
            alt="Splendid Beauty Bar & Co."
            width={180} // Adjust width as needed
            height={48} // Adjusted height slightly for aspect ratio, fine-tune
            priority // Make logo priority as it's always visible
            // Opacity transition for logo (optional aesthetic)
            className={`${scrolled ? "opacity-100" : "opacity-90 hover:opacity-100"} transition-opacity duration-300`}
            style={{ height: 'auto' }} // Maintain aspect ratio
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center">
          {/* Increased gap slightly for better spacing */}
          <div className="flex flex-wrap justify-end gap-x-6 gap-y-1"> 
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                // Use 'scrolled' prop for text color
                className={`font-medium text-sm transition-colors duration-300 hover:text-[#C09E6C] ${
                  scrolled ? "text-stone-800" : "text-white hover:text-gray-200" // Darker text when scrolled, white when not
                }`}
                scroll={isHomePage || link.href.startsWith("/")}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </nav>

        {/* Mobile Navigation Trigger */}
        <div className="lg:hidden"> {/* Wrapper div for positioning */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                {/* Use 'scrolled' prop for menu icon color */}
                <Menu className={`h-6 w-6 transition-colors duration-300 ${scrolled ? "text-stone-800" : "text-white"}`} />
              </Button>
            </SheetTrigger>
            {/* Mobile Menu Content */}
            <SheetContent side="right" className="w-[250px] sm:w-[300px] bg-white/95 backdrop-blur-sm pt-10 px-4"> 
              {/* Added background, blur, padding */}
              <div className="flex justify-center mb-8"> 
                {/* Increased margin-bottom */}
                <Link href="#top" onClick={() => setIsMobileMenuOpen(false)}>
                   <Image 
                     src="/images/splendid-logo.png" // Ensure this path is correct
                     alt="Splendid Beauty Bar & Co. Logo" 
                     width={160} 
                     height={43} // Adjusted height
                     style={{ height: 'auto' }} // Maintain aspect ratio
                   />
                </Link>
              </div>
              <nav className="flex flex-col space-y-4"> 
                {/* Increased spacing */}
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    // Use consistent text color and hover for mobile menu
                    className="text-stone-800 hover:text-[#C09E6C] transition-colors py-1 text-base font-medium text-center" 
                    // Close menu on click
                    onClick={() => setIsMobileMenuOpen(false)}
                    scroll={isHomePage || link.href.startsWith("/")}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}