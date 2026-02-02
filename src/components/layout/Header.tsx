'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { UserButton, useUser } from '@clerk/nextjs';
import { useAuth } from '@/context/auth-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, Loader2, Menu, X, Coins } from 'lucide-react';
import { useSubscription } from '@/hooks/use-subscription';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useState, useEffect } from 'react';

import { motion, AnimatePresence, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';

function AnimatedCounter({ value }: { value: number }) {
  const motionValue = useMotionValue(value);
  const spring = useSpring(motionValue, {
    mass: 0.8,
    stiffness: 75,
    damping: 15,
  });
  const display = useTransform(spring, (current) => Math.round(current).toLocaleString());

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  return <motion.span>{display}</motion.span>;
}

export function Header() {
  const { isSignedIn } = useUser();
  const { user, logout, isLoading } = useAuth();
  const { subscription } = useSubscription();

  const credits = subscription ? subscription.image_generation_limit - subscription.quota_used : 0;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const [activeHash, setActiveHash] = useState('');

  useEffect(() => {
    // Initial hash check
    const timer = setTimeout(() => {
      setActiveHash(window.location.hash);
    }, 0);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    const handleHashChange = () => {
      setActiveHash(window.location.hash);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('popstate', handleHashChange); // For back/forward
    // For manual clicks, we update state in the click handler too.

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    // { name: "How to use", href: "/#how-it-works" },
    // { name: "FAQs", href: "/#faq" },
    { name: 'Home', href: '/' },
    { name: 'Plans', href: '/plans' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/70 backdrop-blur-lg shadow-sm supports-backdrop-filter:bg-white/60'
          : 'bg-transparent md:py-5 ',
      )}
    >
      <div className="container px-4 md:px-6 mx-auto max-w-[1392px] flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="Logo"
              height={40}
              width={40}
              className="h-10 lg:w-full md:w-[200px] w-[180px] object-contain"
            />
          </Link>
        </div>

        {/* Desktop Navigation - Centered */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {navLinks.map((link) => {
            const isActive =
              link.href === pathname + activeHash ||
              (link.href === '/#how-it-works' &&
                pathname === '/' &&
                activeHash === '#how-it-works') ||
              (link.href === '/#faq' && pathname === '/' && activeHash === '#faq');

            // Special case: if no hash and at home, maybe highlight nothing or 'How to use' if scrolled?
            // User asked "when visit that". So if I click Plans, Plans is active.
            // If I click How To Use, How To Use is active.

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() =>
                  setActiveHash(link.href.split('#')[1] ? '#' + link.href.split('#')[1] : '')
                }
                className={cn(
                  'text-base font-medium transition-colors cursor-pointer relative py-1',
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary',
                )}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="active-nav-underline"
                    className="absolute left-0 right-0 bottom-0 h-0.5 bg-primary rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Mobile Menu Toggle */}
          {isSignedIn && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#EDEDED] border border-[#EFEFFB] rounded-full text-sm font-medium transition-colors hover:bg-secondary">
              <Coins className="w-4 h-4 text-yellow-500" />
              <div className="md:text-lg tabular-nums">
                <AnimatedCounter value={credits > 0 ? credits : 0} />
              </div>
            </div>
          )}

          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X className="h-6! w-6!" /> : <Menu className="h-6! w-6!" />}
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
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {user.full_name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.full_name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
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
              <Button
                asChild
                className="bg-transparent hover:bg-transparent shadow-none p-0 h-auto"
              >
                <Link href="/login" className="login-shine-btn">
                  Login/Signup
                </Link>
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
              className="fixed inset-0 z-40 bg-black/50 md:hidden h-dvh"
              onClick={closeMobileMenu}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 z-50 h-dvh w-[300px] bg-background p-6 shadow-2xl flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-xl font-bold tracking-tight">Menu</span>
                <Button variant="ghost" size="icon" onClick={closeMobileMenu}>
                  <X className="h-6! w-6!" />
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
                      <span className="text-sm font-medium">{user?.full_name}</span>
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
                    <Button variant="ghost" size="sm" onClick={logout} className="text-red-500 h-8">
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
