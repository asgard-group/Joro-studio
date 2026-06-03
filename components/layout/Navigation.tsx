"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { NavItem } from "@/types";

interface Props {
  items: NavItem[];
  scrolled?: boolean;
}

export default function Navigation({ items, scrolled = false }: Props) {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const textColor = scrolled ? "text-charcoal hover:text-taupe" : "text-cream/90 hover:text-cream";
  const activeColor = scrolled ? "text-taupe" : "text-cream";

  return (
    <nav aria-label="Navigation principale" className="hidden lg:block">
      <ul className="flex items-center gap-8">
        {items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href.split("#")[0]));

          return (
            <li key={item.href} className="relative">
              {item.children ? (
                <div
                  onMouseEnter={() => setOpenDropdown(item.href)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                      isActive ? activeColor : textColor
                    }`}
                    aria-expanded={openDropdown === item.href}
                    aria-haspopup="true"
                  >
                    {item.label}
                    <svg
                      className={`h-3 w-3 transition-transform ${
                        openDropdown === item.href ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {openDropdown === item.href && (
                    <ul className="absolute left-0 top-full mt-2 w-52 bg-cream shadow-lg ring-1 ring-cream-300">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="block px-4 py-3 text-sm text-charcoal transition-colors hover:bg-cream-300 hover:text-taupe"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive ? activeColor : textColor
                  }`}
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
