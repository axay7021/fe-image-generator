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
import { LogOut, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Header() {
  const { isSignedIn } = useUser();
  const { user, logout, isLoading } = useAuth();

  return (
    <header className="flex h-16 w-full items-center justify-between py-4 container px-4 md:px-6 mx-auto max-w-[1392px]">
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
      <div className="flex items-center gap-4">
        <Link
          href="/pricing"
          className="text-base font-medium text-muted-foreground hidden sm:inline-block hover:text-foreground transition-colors cursor-pointer"
        >
          Pricing
        </Link>
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
          <Button asChild>
            <Link href="/login">Login/Signup</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
