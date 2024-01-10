import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";

import { getProfile } from "./profile/actions";

export const dynamic = "force-dynamic";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getProfile();
  const role = user?.role;

  return (
    <>
      <Header user={user ? user : undefined} />
      <div className="grid min-h-[calc(100vh-62px)] border-t bg-background lg:grid-cols-5">
        <Navigation className="hidden lg:block" role={role} />
        <div className="col-span-3 flex flex-col lg:col-span-4 lg:border-l">
          <div className="h-full min-h-0 grow px-4 md:pb-24 lg:px-8">
            {children}
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}
