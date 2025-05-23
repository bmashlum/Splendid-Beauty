// components/navbar.tsx
"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { cn } from "@/lib/utils";

interface NavbarProps {
  scrolled?: boolean;
}

interface NavLinkItem {
  name: string;
  href: string;
  isExternal?: boolean;
  isBooking?: boolean;
  ariaLabel?: string;
}

// Constants
const BOOKING_URL = "https://dashboard.boulevard.io/booking/businesses/18e96cd8-7ca6-4e7e-8282-2055f45efbc4/widget#/visit-type";
const SCROLL_THRESHOLD = 10;

const useNavLinks = (): NavLinkItem[] => {
  const pathname = usePathname();
  const isScrollablePage = pathname === "/" || pathname.startsWith("/#");

  return useMemo(() => [
    { name: "Home", href: "/", ariaLabel: "Go to homepage" },
    { name: "About Us", href: isScrollablePage ? "#about" : "/#about", ariaLabel: "Learn about us" },
    { name: "We Do That", href: isScrollablePage ? "#we-do-that" : "/#we-do-that", ariaLabel: "View our services" },
    { name: "Book Now", href: "#", isBooking: true, ariaLabel: "Book an appointment" },
    { name: "Shop", href: isScrollablePage ? "#shop" : "/#shop", ariaLabel: "Shop our products" },
    { name: "Hair Studio", href: isScrollablePage ? "#hair-studio" : "/#hair-studio", ariaLabel: "View hair studio services" },
    { name: "Academy", href: isScrollablePage ? "#academy" : "/#academy", ariaLabel: "Learn about our academy" },
    { name: "Policies", href: isScrollablePage ? "#policies" : "/#policies", ariaLabel: "View our policies" },
    { name: "Connect", href: isScrollablePage ? "#connect" : "/#connect", ariaLabel: "Contact us" },
    { name: "Blog", href: "/blog", ariaLabel: "Read our blog" },
    { name: "Financing", href: isScrollablePage ? "#financing" : "/#financing", ariaLabel: "View financing options" },
  ], [isScrollablePage]);
};

const Navbar = React.memo(function Navbar({ scrolled: initialScrolled = false }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(initialScrolled);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const navLinks = useNavLinks();
  const pathname = usePathname();
  const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (typeof initialScrolled === 'boolean' && initialScrolled !== isScrolled) {
      setIsScrolled(initialScrolled);
    }

    const handleScroll = () => {
      // Debounce scroll handler
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      scrollTimeoutRef.current = setTimeout(() => {
        const currentScrollY = window.scrollY;
        if (typeof initialScrolled !== 'boolean' || !initialScrolled) {
          setIsScrolled(currentScrollY > SCROLL_THRESHOLD);
        }
      }, 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [initialScrolled, isScrolled]);


  const handleNavLinkClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string, isBooking?: boolean) => {
    if (isBooking) {
      e.preventDefault();
      setIsBookingOpen(true);
      setIsMobileMenuOpen(false);
      return;
    }

    setIsMobileMenuOpen(false);

    if (href.startsWith("#") && pathname === "/") {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      const mainContent = document.getElementById('main-content');

      if (targetElement && mainContent) {
        const offsetTop = targetElement.offsetTop;
        mainContent.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
        
        // Update focus for accessibility
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus();
        targetElement.addEventListener('blur', () => {
          targetElement.removeAttribute('tabindex');
        }, { once: true });
      } else if (targetId === 'hero' && mainContent) {
        mainContent.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (href === "/" && pathname === "/") {
      e.preventDefault();
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ease-in-out",
          "bg-white/30 backdrop-blur-sm shadow-lg border border-white/20",
          "mobile-navbar" // Add a special class for mobile styling
        )}
        role="banner"
      >
        <div className={cn(
          "container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between",
          "h-12 sm:h-14"
        )}>
          <Link
            href="/"
            className="flex items-center flex-shrink-0"
            aria-label="Splendid Beauty Bar & Co. Homepage"
            onClick={(e) => handleNavLinkClick(e, "/")}
          >
            <Image
              src="/images/splendid-logo.png"
              alt="Splendid Beauty Bar & Co. Logo"
              width={180}
              height={48}
              priority
              className={cn(
                "transition-all duration-300 ease-in-out",
                "opacity-100 w-[150px] sm:w-[180px]"
              )}
              style={{ height: 'auto' }}
              sizes="(max-width: 640px) 150px, 180px"
            />
          </Link>

          <nav className="hidden lg:flex items-center" aria-label="Main navigation">
            <ul className="flex flex-wrap justify-end gap-x-5 xl:gap-x-6 gap-y-1">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    target={link.isExternal ? "_blank" : "_self"}
                    rel={link.isExternal ? "noopener noreferrer" : ""}
                    className={cn(
                      "font-forum text-sm xl:text-base transition-all duration-200 hover:text-[#C09E6C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C09E6C] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-sm",
                      "text-stone-800",
                      link.isBooking && "bg-[#C09E6C] text-white px-4 py-2 rounded-full hover:bg-[#a88a5d] hover:text-white shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                    )}
                    aria-label={link.ariaLabel || link.name}
                    onClick={(e) => handleNavLinkClick(e, link.href, link.isBooking)}
                    scroll={!link.href.startsWith("#") && !link.isExternal}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open main menu">
                  <Menu className="h-6 w-6 text-stone-800" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] max-w-xs sm:max-w-sm bg-white/95 backdrop-blur-md p-0 flex flex-col shadow-xl">
                <SheetHeader className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="text-lg font-semibold text-stone-800">Menu</SheetTitle>
                    <SheetClose asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        aria-label="Close menu"
                        className="hover:bg-gray-100 transition-colors"
                      >
                        <X className="h-5 w-5 text-stone-600" />
                      </Button>
                    </SheetClose>
                  </div>
                </SheetHeader>
                <nav className="flex-grow overflow-y-auto p-4" aria-label="Mobile navigation">
                  <ul className="space-y-1">
                    {navLinks.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          target={link.isExternal ? "_blank" : "_self"}
                          rel={link.isExternal ? "noopener noreferrer" : ""}
                          onClick={(e) => handleNavLinkClick(e, link.href, link.isBooking)}
                          className={cn(
                            "block text-lg font-forum transition-all py-3 px-3 rounded-md hover:bg-gray-100 focus-visible:outline-none focus-visible:bg-gray-100",
                            link.isBooking
                              ? "bg-[#C09E6C] text-white hover:bg-[#a88a5d] hover:text-white shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 text-center my-4"
                              : "text-gray-800 hover:text-[#C09E6C]"
                          )}
                          aria-label={link.ariaLabel || link.name}
                          scroll={!link.href.startsWith("#") && !link.isExternal}
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="max-w-[90vw] w-[1200px] h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle className="text-lg font-semibold text-stone-800">
              Book Your Appointment
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 w-full h-[calc(90vh-4rem)]">
            <iframe
              src={BOOKING_URL}
              className="w-full h-full border-0"
              title="Booking Widget - Schedule your beauty appointment"
              loading="lazy"
              allow="payment"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;