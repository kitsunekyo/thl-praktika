"use client";

import { HomeIcon } from "lucide-react";
import { usePathname } from "next/navigation";

export function Breadcrumbs({ children }: { children: React.ReactNode }) {
  return (
    <nav className="py-4" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-4">
        <BreadcrumbLink href="/">
          <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
          <span className="sr-only">Home</span>
        </BreadcrumbLink>
        <BreadcrumbsSeparator />
        {children}
      </ol>
    </nav>
  );
}

export function Breadcrumb({
  children,
  href,
}: {
  children: React.ReactNode;
  href?: string;
}) {
  return (
    <li>
      <div className="flex items-center">
        <BreadcrumbLink href={href}>{children}</BreadcrumbLink>
      </div>
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

function BreadcrumbLink({
  href,
  children,
  ...rest
}: React.ComponentProps<"a">) {
  const pathname = usePathname();

  if (!href || pathname === href) {
    return (
      <span className="flex items-center text-sm font-medium text-gray-700">
        {children}
      </span>
    );
  }

  return (
    <a
      {...rest}
      href={href}
      className="flex items-center text-sm font-medium text-gray-500 underline hover:text-gray-700"
    >
      {children}
    </a>
  );
}
