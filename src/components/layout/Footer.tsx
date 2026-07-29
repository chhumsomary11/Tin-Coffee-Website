import Link from "next/link";
import { Mail, Phone } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-darkBrown  text-cream px-5 py-8 ">
      <div className="mx-auto max-w-6xl">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            aria-label="Tin Coffee homepage"
            className="
              flex h-12 w-12 shrink-0 items-center justify-center
              rounded-full border border-surface
              font-serif text-sm
              transition-opacity hover:opacity-80
            "
          >
            TC
          </Link>

          <Link href="/" className="font-serif text-xl tracking-[0.2em]">
            TIN COFFEE
          </Link>
        </div>

        {/* Contact and social links */}
        <div className="mt-7 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3 text-sm">
            <a
              href="tel:+85523456789"
              className="flex items-center gap-3 hover:text-accent"
            >
              <svg
                className="w-6 h-6 text-cream dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.8"
                  d="M18.427 14.768 17.2 13.542a1.733 1.733 0 0 0-2.45 0l-.613.613a1.732 1.732 0 0 1-2.45 0l-1.838-1.84a1.735 1.735 0 0 1 0-2.452l.612-.613a1.735 1.735 0 0 0 0-2.452L9.237 5.572a1.6 1.6 0 0 0-2.45 0c-3.223 3.2-1.702 6.896 1.519 10.117 3.22 3.221 6.914 4.745 10.12 1.535a1.601 1.601 0 0 0 0-2.456Z"
                />
              </svg>
              <span>+855 23 456 789</span>
            </a>

            <a
              href="mailto:hello@tincoffee.com"
              className="flex items-center gap-3 hover:text-accent"
            >
              <svg
                className="w-6 h-6 text-cream dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-width="1.8"
                  d="m3.5 5.5 7.893 6.036a1 1 0 0 0 1.214 0L20.5 5.5M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"
                />
              </svg>
              <span>hello@tincoffee.com</span>
            </a>
          </div>

          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.2em]">Follow us</p>

            <div className="flex items-center gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Tin Coffee on Facebook"
                className="transition-colors hover:text-accent"
              >
                <svg
                  className="w-6 h-6 text-cream dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z"
                    clip-rule="evenodd"
                  />
                </svg>{" "}
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Tin Coffee on Instagram"
                className="transition-colors hover:text-accent"
              >
                <svg
                  className="w-6 h-6 text-cream dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    fill-rule="evenodd"
                    d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm7.597 2.214a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-surface/20 pt-5">
          <p className="text-xs text-surface/70">
            © {currentYear} Tin Coffee &amp; Eatery. Fresh lines, Cambodian
            heart.
          </p>
        </div>
      </div>
    </footer>
  );
}
