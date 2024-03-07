import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { getMyProfile } from "@/modules/users/queries";

export const dynamic = "force-dynamic";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getMyProfile();

  return (
    <>
      <Header user={user ? user : undefined} />
      <div className="grid min-h-[calc(100vh-62px)] border-t bg-gray-50 lg:grid-cols-5">
        <Navigation className="hidden bg-white lg:block" role={user.role} />
        <div className="col-span-3 flex flex-col lg:col-span-4 lg:border-l">
          <main className="h-full min-h-0 grow px-4 md:pb-24 lg:px-8">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}
