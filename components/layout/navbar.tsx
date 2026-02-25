"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import { ShoppingCart, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CartSheet } from "@/components/cart/cart-sheet";

export function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useUser();
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">🍽️ Restaurant</span>
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/menu"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/menu" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Menu
            </Link>
            {isSignedIn && (
              <Link
                href="/orders"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === "/orders" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Orders
              </Link>
            )}
            {isSignedIn && (
              <Link
                href="/admin/dashboard"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname?.startsWith("/admin") ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Admin
              </Link>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/search">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
          </Link>
          <CartSheet />
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <SignInButton mode="modal">
              <Button variant="default">Sign In</Button>
            </SignInButton>
          )}
        </div>
      </div>
    </nav>
  );
}
