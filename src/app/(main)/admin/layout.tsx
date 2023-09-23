import { Metadata } from "next";
import Image from "next/image";

import { SidebarNav } from "./SidebarNav";

export const metadata: Metadata = {
  title: "Forms",
  description: "Advanced form example using react-hook-form and Zod.",
};

const sidebarNavItems = [
  {
    title: "Benutzer",
    href: "/admin/user",
  },
  {
    title: "Praktika Anmeldungen",
    href: "/admin/registration",
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <>
      <div className="space-y-0.5">
        <h1 className="text-2xl font-semibold">Admin</h1>
        <p className="text-muted-foreground">
          Verwalte User, Einstellungen und Datasets.
        </p>
      </div>
      <hr className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1">{children}</div>
      </div>
    </>
  );
}
