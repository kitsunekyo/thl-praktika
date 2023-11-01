import {
  CalendarDaysIcon,
  FormInputIcon,
  MailsIcon,
  MessageCircleIcon,
  SlidersIcon,
  UserPlus2Icon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <>
      <header className="border-b">
        <div className="container flex min-h-[60px] flex-wrap items-center py-2">
          <div className="mr-12">
            <Logo />
          </div>
          <div className="ml-auto hidden md:block">
            <LoginButton />
          </div>
        </div>
      </header>
      <main className="space-y-40 pb-40">
        <Hero />
        <TrainerFeatures />
        <UserFeatures />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}

function LoginButton() {
  return (
    <Button size="sm" variant="link">
      <Link href="/login">Anmelden</Link>
    </Button>
  );
}

function Hero() {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20"
      >
        <div className="h-56 bg-gradient-to-br from-yellow-200/40 to-yellow-400 blur-[106px] dark:from-blue-700"></div>
        <div className="h-32 bg-gradient-to-r from-red-400 to-orange-300 blur-[106px] dark:to-indigo-600"></div>
      </div>
      <div className="container">
        <div className="relative ml-auto pt-8">
          <Image
            className="z-1 mx-auto my-8 -mb-6"
            src="/img/dog-clock.svg"
            width={219}
            height={206}
            alt="Hund mit Uhr"
          />
          <div className="mx-auto text-center lg:w-2/3">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white md:text-6xl xl:text-7xl">
              Plane deine Praktika{" "}
              <span className="text-primary dark:text-white">
                stressfrei und entspannt.
              </span>
            </h1>
            <p className="mx-auto mt-8 max-w-[70ch] text-gray-700 dark:text-gray-300">
              Über 230 Praktika Stunden zwischen 20 Studierenden und 40
              Praxisanleiter:innen zu koordinieren, kann viel Zeit und Energie
              kosten. Muss es aber nicht!
            </p>
            <div className="mt-16 flex flex-wrap justify-center gap-x-6 gap-y-4">
              <Link
                href="/login"
                className="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:bg-primary before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max"
              >
                <span className="relative text-base font-semibold text-white">
                  Jetzt Praktika planen
                </span>
              </Link>
            </div>
            <div className="mt-16 hidden grid-cols-3 justify-between gap-8 border-y border-gray-100 py-8 dark:border-gray-800 sm:grid">
              <div className="text-left">
                <h6 className="text-lg font-semibold text-gray-700 dark:text-white">
                  1-Klick Anmeldung
                </h6>
                <p className="mt-2 text-gray-500">
                  Melde dich mit nur einem Klick für Praktika an.
                </p>
              </div>
              <div className="text-left">
                <h6 className="text-lg font-semibold text-gray-700 dark:text-white">
                  Praktika Filter
                </h6>
                <p className="mt-2 text-gray-500">
                  Filtere Praktika nach Fahrtzeit, Plätze, Dauer und mehr.
                </p>
              </div>
              <div className="text-left">
                <h6 className="text-lg font-semibold text-gray-700 dark:text-white">
                  Automatische Emails
                </h6>
                <p className="mt-2 text-gray-500">
                  Minimaler Kommunikationsaufwand bei Absagen und Anmeldungen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrainerFeatures() {
  return (
    <div className="container">
      <div className="items-end md:flex">
        <div className="md:w-2/3 lg:w-1/2">
          <div className="flex">
            <h2 className="mb-8 text-2xl font-bold text-gray-700 dark:text-white md:text-4xl">
              Für dich als Trainer:in
            </h2>
            <Sparkle />
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Erfahre mehr über die Funktionen, die die Koordination und
            Kommunikation von Praktika Möglichkeiten mit den Studenten
            vereinfachen.
          </p>
        </div>
        <Image
          className="max-w-[300px]"
          src="/img/dog-mirror.svg"
          width={697}
          height={568}
          alt="Hund vor einem Spiegel"
        />
      </div>
      <div className="mt-16 grid divide-x divide-y divide-gray-100 overflow-hidden rounded-3xl border border-gray-100 text-gray-600 dark:divide-gray-700 dark:border-gray-700 sm:grid-cols-2 lg:grid-cols-3 lg:divide-y-0">
        <div className="group relative bg-white transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10 dark:bg-gray-800">
          <div className="relative space-y-4 p-8 py-12">
            <FormInputIcon className="h-8 w-8" />
            <div className="space-y-2">
              <h5 className="text-xl font-semibold text-gray-700 transition dark:text-white">
                Einfaches Erstellen
              </h5>
              <p className="text-gray-600 dark:text-gray-300">
                Gib mit nur wenigen Klicks an wann und wo ein Training
                stattfindet, und wie viele Praktikanten teilnehmen können.
              </p>
            </div>
          </div>
        </div>
        <div className="group relative bg-white transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10 dark:bg-gray-800">
          <div className="relative space-y-4 p-8 py-12">
            <MessageCircleIcon className="h-8 w-8" />
            <div className="space-y-2">
              <h5 className="text-xl font-semibold text-gray-700 transition dark:text-white">
                Kein WhatsApp Spam
              </h5>
              <p className="text-gray-600 dark:text-gray-300">
                Ermögliche es Studenten sich mit nur einem Klick für Praktika
                anzumelden, ohne jedem einzeln antworten zu müssen.
              </p>
            </div>
          </div>
        </div>
        <div className="group relative bg-white transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10 dark:bg-gray-800">
          <div className="relative space-y-4 p-8 py-12">
            <MailsIcon className="h-8 w-8" />
            <div className="space-y-2">
              <h5 className="text-xl font-semibold text-gray-700 transition dark:text-white">
                Automatische Emails
              </h5>
              <p className="text-gray-600 dark:text-gray-300">
                Wenn du ein Praktikum absagen musst werden alle Teilnehmer:innen
                automatisch benachrichtigt.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserFeatures() {
  return (
    <div className="container">
      <div className="items-end md:flex">
        <div className="md:w-2/3 lg:w-1/2">
          <div className="flex">
            <h2 className="mb-8 text-2xl font-bold text-gray-700 dark:text-white md:text-4xl">
              Für dich als Student:in
            </h2>
            <Sparkle />
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            So hilft dir die App dabei, Praktika zu finden und zu planen ohne
            Trainer:innen mit WhatApp Nachrichten zu überfluten.
          </p>
        </div>
        <Image
          src="/img/dog-bucket.svg"
          className="max-w-[220px]"
          width={368}
          height={420}
          alt="Hund mit Eimer am Kopf"
        />
      </div>
      <div className="mt-16 grid divide-x divide-y divide-gray-100 overflow-hidden rounded-3xl border border-gray-100 text-gray-600 dark:divide-gray-700 dark:border-gray-700 sm:grid-cols-2 lg:grid-cols-3 lg:divide-y-0">
        <div className="group relative bg-white transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10 dark:bg-gray-800">
          <div className="relative space-y-4 p-8 py-12">
            <UserPlus2Icon className="h-8 w-8" />
            <div className="space-y-2">
              <h5 className="text-xl font-semibold text-gray-700 transition dark:text-white">
                1-Klick Anmeldung
              </h5>
              <p className="text-gray-600 dark:text-gray-300">
                Du kannst genau sehen wie viele Plätze bei Praktika noch frei
                sind, und dich mit nur einem Klick für anmelden.
              </p>
            </div>
          </div>
        </div>
        <div className="group relative bg-white transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10 dark:bg-gray-800">
          <div className="relative space-y-4 p-8 py-12">
            <SlidersIcon className="h-8 w-8" />
            <div className="space-y-2">
              <h5 className="text-xl font-semibold text-gray-700 transition dark:text-white">
                Praktika Filter
              </h5>
              <p className="text-gray-600 dark:text-gray-300">
                Filtere Praktika nach Fahrtzeit, Datum, Dauer und mehr, und
                finde die optimalen Praktika für dich.
              </p>
            </div>
          </div>
        </div>
        <div className="group relative bg-white transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10 dark:bg-gray-800">
          <div className="relative space-y-4 p-8 py-12">
            <CalendarDaysIcon className="h-8 w-8" />
            <div className="space-y-2">
              <h5 className="text-xl font-semibold text-gray-700 transition dark:text-white">
                Behalte die Übersicht
              </h5>
              <p className="text-gray-600 dark:text-gray-300">
                Hab immer im Blick wann und wo deine Praktika stattfinden, und
                wofür du dich angemeldet hast.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CallToAction() {
  return (
    <div className="relative py-8">
      <div
        aria-hidden="true"
        className="absolute inset-0 m-auto grid h-max w-full grid-cols-2 -space-x-52 opacity-40 dark:opacity-20"
      >
        <div className="h-56 bg-gradient-to-br from-yellow-200/20 to-yellow-400 blur-[106px] dark:from-blue-700"></div>
        <div className="h-32 bg-gradient-to-r from-red-400 to-orange-300 blur-[106px] dark:to-indigo-600"></div>
      </div>
      <div className="container relative z-10">
        <div className="m-auto mt-6 space-y-6 md:w-8/12 lg:w-7/12">
          <h1 className="text-center text-4xl font-bold text-gray-800 dark:text-white md:text-5xl">
            Wie kann ich dabei sein?
          </h1>
          <p className="text-center text-xl text-gray-600 dark:text-gray-300">
            Die App ist nur mit einer Einladung zugänglich. Solltest du noch
            keine Einladung erhalten haben, kannst du dich bei
            hi@mostviertel.tech melden.
          </p>
          <Image
            className="z-1 mx-auto md:max-w-[500px]"
            src="/img/dog-laptop.svg"
            width={913}
            height={297}
            alt="Hund mit Laptop"
          />
        </div>
      </div>
    </div>
  );
}

function Sparkle() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-6 w-6 text-muted"
    >
      <path
        fillRule="evenodd"
        d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z"
        clipRule="evenodd"
      />
    </svg>
  );
}
