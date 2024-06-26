import Image from "next/image";

import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="container grid flex-grow items-center py-24 lg:grid-cols-[1fr,1fr]">
        <div className="my-auto w-full px-8 pt-8 md:justify-start md:px-24 md:pt-0 lg:min-w-[600px]">
          <div className="mb-8 flex justify-center">
            <Logo />
          </div>
          {children}
        </div>
        <div className="relative hidden h-[600px] w-full overflow-hidden rounded-xl shadow-2xl lg:block">
          <Image
            fill
            priority
            className="object-cover"
            src="https://i.imgur.com/7GZhST0.jpg"
            sizes="600px"
            alt=""
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
