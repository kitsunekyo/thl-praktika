import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="grid min-h-[calc(100vh-62px)] border-t bg-gray-50">
        <main className="mx-auto h-full min-h-0 grow px-4 md:pb-24 lg:px-8">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
