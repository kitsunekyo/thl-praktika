import Image from "next/image";

import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";
import { formatAT } from "@/lib/date";

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
      <div className="mx-auto text-center lg:w-2/3">
        <h1 className="text-3xl font-bold text-gray-900 md:text-5xl">
          Wichtige Umbauten hinter den Kulissen
        </h1>
        <p className="mx-auto mt-8 max-w-[70ch] text-xl text-gray-700">
          Bitte um etwas Geduld. Wir arbeiten an der Seite und sind so schnell
          wie möglich wieder für dich da.
        </p>
        <p className="mt-4 text-gray-500">
          Letztes Update:{" "}
          {formatAT(new Date("2024-03-15T10:00"), "do MMM HH:mm")}
        </p>
        <iframe
          src="https://giphy.com/embed/mCRJDo24UvJMA"
          width="480"
          height="348"
          className="giphy-embed mx-auto mt-8"
          allowFullScreen
        ></iframe>
      </div>
    </article>
  );
}
