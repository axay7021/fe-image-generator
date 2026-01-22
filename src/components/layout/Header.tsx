"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import { useAuth } from "@/context/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Loader2, Menu, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState, useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function Header() {
  const { isSignedIn } = useUser();
  const { user, logout, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: "How to use", href: "/#how-it-works" },
    { name: "Faq", href: "/#faq" },
    { name: "Plans", href: "/plans" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/70 backdrop-blur-lg shadow-sm border-b border-white/20 supports-backdrop-filter:bg-white/60"
          : "bg-transparent py-5",
      )}
    >
      <div className="container px-4 md:px-6 mx-auto max-w-[1392px] flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            {/* LogoIpsum Placeholder */}
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-primary"
            >
              <path
                d="M20 0L40 20L20 40L0 20L20 0Z"
                fill="currentColor"
                fillOpacity="0.2"
              />
              <path d="M20 10L30 20L20 30L10 20L20 10Z" fill="currentColor" />
            </svg>
            <span className="text-xl font-bold tracking-tight">AI Gen</span>
          </Link>
        </div>

        {/* Desktop Navigation - Centered */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-base font-medium text-muted-foreground hover:text-primary hover:underline transition-colors cursor-pointer"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>

          {/* User Auth Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {isLoading ? (
              <Button variant="ghost" disabled>
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </Button>
            ) : isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {user.full_name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.full_name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild className="rounded-xl px-6">
                <Link href="/login">Login/Signup</Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={closeMobileMenu}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 z-50 h-full w-[300px] bg-background p-6 shadow-2xl flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-xl font-bold tracking-tight">Menu</span>
                <Button variant="ghost" size="icon" onClick={closeMobileMenu}>
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <div className="flex flex-col gap-4 flex-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className="text-lg font-medium text-foreground py-2 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Bottom Profile Section */}
              <div className="mt-auto pt-4 border-t border-border">
                {isLoading ? (
                  <div className="flex justify-center p-2">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : isSignedIn ? (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
                    <UserButton afterSignOutUrl="/" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {user?.full_name}
                      </span>
                      <span className="text-sm font-medium">{user?.email}</span>
                    </div>
                  </div>
                ) : user ? (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {user.full_name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium truncate max-w-[150px]">
                        {user.full_name}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={logout}
                      className="text-red-500 h-8"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button asChild className="w-full rounded-xl">
                    <Link href="/login" onClick={closeMobileMenu}>
                      Login/Signup
                    </Link>
                  </Button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
