"use client";

import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Breadcrumbs({ children }: { children: React.ReactNode }) {
  return (
    <nav className="py-4" aria-label="Breadcrumbs">
      <ul role="list" className="flex items-center space-x-4">
        <Breadcrumb href="/" className="shrink-0">
          <HomeIcon className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">Home</span>
        </Breadcrumb>
        {!!children && <BreadcrumbsSeparator />}
        {children}
      </ul>
    </nav>
  );
}

export function BreadcrumbsItem({
  children,
  href,
}: {
  children: React.ReactNode;
  href?: string;
}) {
  return (
    <li className="min-w-0 truncate text-sm font-medium">
      <Breadcrumb href={href}>{children}</Breadcrumb>
    </li>
  );
}

export function BreadcrumbsSeparator() {
  return (
    <svg
      className="mx-4 h-5 w-5 flex-shrink-0 text-gray-300"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
    </svg>
  );
}

function Breadcrumb({
  href,
  children,
  ...rest
}: Omit<React.ComponentProps<typeof Link>, "href"> & { href?: string }) {
  const pathname = usePathname();

  if (!href || pathname === href) {
    return (
      <span className="text-gray-700" {...rest}>
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className="text-gray-500 underline hover:text-gray-700"
      {...rest}
    >
      {children}
    </Link>
  );
}
