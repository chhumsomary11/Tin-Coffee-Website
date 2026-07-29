"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

// Connect this to the real cart store later
const cartCount = 0;

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50  bg-background">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        {/* Logo */}
        <Link
          href="/"
          aria-label="Tin Coffee homepage"
          className="
            flex h-14 w-14 items-center justify-center
            rounded-full border-2 border-primary-dark
            text-primary-dark
            transition-transform duration-200
            hover:scale-105
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-primary-dark
            focus-visible:ring-offset-2
            focus-visible:ring-offset-accent
          "
        >
          {/* Replace TC with your real logo later */}
          <span className="font-cormorant text-lg font-semibold tracking-tight">
            ទីន
          </span>
        </Link>

        {/* Cart */}
        <Link
          href="/order"
          aria-label={`View cart. ${cartCount} items`}
          className="
            relative flex h-11 w-11 items-center justify-center
            rounded-full text-primary-dark
            transition-colors duration-200
            hover:bg-primary-dark/10
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-primary-dark
            focus-visible:ring-offset-2
            focus-visible:ring-offset-accent
          "
        >
          <ShoppingBag size={25} strokeWidth={1.8} aria-hidden="true" />

          {cartCount > 0 && (
            <span
              className="
                absolute right-0 top-0
                flex min-h-5 min-w-5 items-center justify-center
                rounded-full
                bg-primary-dark px-1
                text-[11px] font-semibold leading-none
                text-accent
              "
            >
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </Link>
      </nav>
    </header>
  );
}
