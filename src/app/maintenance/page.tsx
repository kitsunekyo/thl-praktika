import Image from "next/image";

import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";

export default function Page() {
  return (
    <div className="relative flex h-full flex-col">
      <header className="sticky top-0 z-30 flex min-h-[62px] flex-wrap items-center bg-white px-4 py-2 shadow">
        <div className="mr-12">
          <Logo />
        </div>
      </header>
      <main className="grow">
        <section className="mx-auto max-w-4xl py-20">
          <Message />
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Message() {
  return (
    <article>
      <Image
        className="z-1 mx-auto"
        src="/img/dog-clock.svg"
        width={219}
        height={206}
        alt="Hund mit Uhr"
      />
      <div className="mx-auto text-center lg:w-2/3">
        <h1 className="text-5xl font-bold text-gray-900 md:text-6xl xl:text-7xl">
          Wichtige Umbauten hinter den Kulissen
        </h1>
        <p className="mx-auto mt-8 max-w-[70ch] text-xl text-gray-700">
          Bitte um etwas Geduld. Wir arbeiten an der Seite und sind so schnell
          wie möglich wieder für dich da.
        </p>
      </div>
    </article>
  );
}
