import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { cn } from "@/lib/utils";

import { AppInfoStack } from "./AppInfoStack";
import { Sidebar } from "./Sidebar";

export function BasicLayout({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <Header />
      <Body>
        <Main>{children}</Main>
        <Footer />
      </Body>
    </>
  );
}

export function SidebarLayout({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <AppInfoStack />
      <Header />
      <Body className="lg:grid-cols-5">
        <Sidebar className="hidden lg:block" />
        <div className="col-span-3 flex flex-col lg:col-span-4 lg:border-l">
          <Main>{children}</Main>
          <Footer />
        </div>
      </Body>
    </>
  );
}

function Body({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid min-h-[calc(100vh-var(--header-size))] border-t bg-gray-50",
        className,
      )}
    >
      {children}
    </div>
  );
}

function Main({ children }: { children?: React.ReactNode }) {
  return (
    <main className="mx-auto h-full min-h-0 w-full grow px-4 md:pb-24 lg:px-8">
      {children}
    </main>
  );
}
