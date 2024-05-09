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
      <header className="sticky top-0 z-30 flex min-h-[62px] flex-wrap items-center bg-white px-4 py-2 shadow md:relative md:top-auto">
        <div className="mr-12">
          <Logo />
        </div>
      </header>
      <main className="space-y-40 pb-40">
        <Hero />
        <TrainerFeatures />
        {/* <UserFeatures /> */}
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}

function Hero() {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40"
      >
        <div className="h-56 bg-gradient-to-br from-yellow-200/40 to-yellow-400 blur-[106px]"></div>
        <div className="h-32 bg-gradient-to-r from-red-400 to-orange-300 blur-[106px]"></div>
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
            <h1 className="text-5xl font-bold text-gray-900 md:text-6xl xl:text-7xl">
              Praktika stressfrei und unkompliziert planen
            </h1>
            <p className="mx-auto mt-8 max-w-[70ch] text-gray-700">
              Mehr als 200 Praktika Stunden zwischen 20 Student:innen und 40
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
            <div className="mt-16 hidden grid-cols-3 justify-between gap-8 border-y border-gray-100 py-8 sm:grid">
              <div className="text-left">
                <h6 className="text-lg font-semibold text-gray-700">
                  Praktika anbieten
                </h6>
                <p className="mt-2 text-gray-500">
                  Erstelle ein Praktikum und informiere alle interessierten
                  Student:innen auf einmal.
                </p>
              </div>
              <div className="text-left">
                <h6 className="text-lg font-semibold text-gray-700">
                  1-Klick Anmeldung
                </h6>
                <p className="mt-2 text-gray-500">
                  Schnell und unkompliziert: Ein Klick, und du bist für dein
                  Wunschpraktikum angemeldet.
                </p>
              </div>
              <div className="text-left">
                <h6 className="text-lg font-semibold text-gray-700">
                  Automatisierte E-Mails
                </h6>
                <p className="mt-2 text-gray-500">
                  Du musst dich um nichts kümmern! Automatische
                  Benachrichtigungen zu Anmeldungen und Absagen.
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
      <div className="flex flex-col items-end gap-16 md:flex-row">
        <Image
          className="max-w-[300px] md:hidden"
          src="/img/dog-mirror.svg"
          width={697}
          height={568}
          alt="Hund vor einem Spiegel"
        />
        <div className="md:w-2/3 lg:w-1/2">
          <div className="flex">
            <h2 className="mb-8 text-4xl font-bold">Für dich als Trainer:in</h2>
            <Sparkle />
          </div>
          <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
            Für Praktikums-Anfragen auf eine Vielzahl Nachrichten antworten zu
            müssen ist echt anstrengend. Hier kannst du Praktika mit nur wenigen
            Klicks erstellen und alle interessierten Student:innen wissen sofort
            bescheid.
          </p>
        </div>
        <Image
          className="hidden max-w-[300px] md:block"
          src="/img/dog-mirror.svg"
          width={697}
          height={568}
          alt="Hund vor einem Spiegel"
        />
      </div>
      <div className="mt-16 grid divide-x divide-y divide-gray-100 overflow-hidden rounded-3xl border border-gray-100 text-gray-600 sm:grid-cols-2 lg:grid-cols-3 lg:divide-y-0">
        <div className="group relative bg-white transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
          <div className="relative space-y-4 p-8 py-12">
            <FormInputIcon className="h-8 w-8" />
            <div className="space-y-2">
              <h5 className="text-xl font-semibold text-gray-700 transition">
                Praktika auf Anfrage
              </h5>
              <p className="text-gray-600">
                Du erhälst Praktika-Anfragen per Mail. In der Übersicht siehst
                du, wer dir wann eine Anfrage geschickt hat.
              </p>
            </div>
          </div>
        </div>
        <div className="group relative bg-white transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
          <div className="relative space-y-4 p-8 py-12">
            <MessageCircleIcon className="h-8 w-8" />
            <div className="space-y-2">
              <h5 className="text-xl font-semibold text-gray-700 transition">
                Einfache Kommunikation
              </h5>
              <p className="text-gray-600">
                Student:innen können sich mit nur einem Klick für Praktika
                anmelden, ohne dass du auf jede Nachricht einzeln antworten
                musst.
              </p>
            </div>
          </div>
        </div>
        <div className="group relative bg-white transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
          <div className="relative space-y-4 p-8 py-12">
            <MailsIcon className="h-8 w-8" />
            <div className="space-y-2">
              <h5 className="text-xl font-semibold text-gray-700 transition">
                Automatische E-Mails
              </h5>
              <p className="text-gray-600">
                Wenn du ein Praktikum erstellst oder absagen musst, werden alle
                automatisch benachrichtigt.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="my-32 grid items-center gap-16 md:grid-cols-6">
        <div className="md:col-span-2">
          <h3 className="mb-6 text-2xl font-semibold leading-snug md:text-3xl">
            Lehn dich zurück und warte auf Praktika Anfragen
          </h3>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Student:innen können bei Trainer:innen mit nur einem Klick eine
            Praktikumsanfrage schicken. Du erhälst ganz automatisch ein E-Mail.
            Wenn du ein Praktikum erstellst werden alle, die dir eine Anfrage
            geschickt haben per E-Mail benachrichtigt.
          </p>
        </div>
        <div className="relative flex justify-center md:col-span-4">
          <Image
            src="/img/screenshots/trainers.png"
            alt="Praktika Anfragen"
            className="overflow-hidden rounded-2xl object-cover ring-1 ring-slate-900/10"
            width="300"
            height="419"
            priority
            sizes="(max-width: 768px) 100vw, 1282px"
          />
        </div>
      </div>

      <div className="my-32 grid items-center gap-16 md:grid-cols-6">
        <div className="md:order-last md:col-span-2">
          <h3 className="mb-6 text-2xl font-semibold leading-snug md:text-3xl">
            Erstelle Praktika für Student:innen
          </h3>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Trage alle wichtigen Details zu deinem angebotenen Praktikum ein.
            Wann und wo es stattfindet, und wie viele Praktikant:innen
            teilnehmen können.
          </p>
        </div>
        <div className="relative flex justify-center md:col-span-4">
          <Image
            src="/img/screenshots/create-training.png"
            alt="Praktikum erstellen Dialog"
            className="overflow-hidden rounded-2xl object-cover ring-1 ring-slate-900/10"
            width="300"
            height="649"
            sizes="(max-width: 768px) 100vw, 1282px"
          />
        </div>
      </div>

      <div className="my-32 grid items-center gap-16 md:grid-cols-6">
        <div className="md:col-span-2">
          <h3 className="mb-6 text-2xl font-semibold leading-snug md:text-3xl">
            Erfahre von Anmeldungen bequem per E-Mail
          </h3>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Du bekommst automatisch eine E-Mail, wenn sich jemand für dein
            Praktikum anmeldet und auch wenn sich jemand wieder abmeldet. Damit
            musst du nicht immer die App öffnen, um zu wissen ob du mit
            Unterstützung rechnen kannst.
          </p>
        </div>
        <div className="relative flex justify-center md:col-span-4">
          <Image
            src="/img/screenshots/trainer preferences.png"
            alt="Praktika Anfragen"
            className="overflow-hidden rounded-2xl object-cover ring-1 ring-slate-900/10"
            width="300"
            height="327"
            sizes="(max-width: 768px) 100vw, 1282px"
          />
        </div>
      </div>

      <div className="my-32 grid items-center gap-16 md:grid-cols-6">
        <div className="md:order-last md:col-span-2">
          <h3 className="mb-6 text-2xl font-semibold leading-snug md:text-3xl">
            Hab deine Praktika im Blick
          </h3>
          <ul className="list-disc space-y-2 pl-6 text-lg leading-relaxed text-muted-foreground">
            <li>Wer hat sich wofür angemeldet?</li>
            <li>
              Bei Änderungen oder Absagen werden alle angemeldeten
              Stundent:innen per E-Mail benachrichtigt.
            </li>
            <li>
              Klicke auf einen Benutzer um im Profil Kontaktdaten und mehr zu
              sehen.
            </li>
          </ul>
        </div>
        <div className="relative flex justify-center md:col-span-4">
          <Image
            src="/img/screenshots/trainer home.png"
            alt="Praktika Anfragen"
            className="overflow-hidden rounded-2xl object-cover ring-1 ring-slate-900/10"
            width="300"
            height="503"
            priority
            sizes="(max-width: 768px) 100vw, 1282px"
          />
        </div>
      </div>
    </div>
  );
}

function UserFeatures() {
  return (
    <div className="container">
      <div className="flex flex-col items-end gap-16 md:flex-row">
        <Image
          src="/img/dog-bucket.svg"
          className="max-w-[220px] md:hidden"
          width={368}
          height={420}
          alt="Hund mit Eimer am Kopf"
        />
        <div className="md:w-2/3 lg:w-1/2">
          <div className="flex">
            <h2 className="mb-8 text-4xl font-bold">Für dich als Student:in</h2>
            <Sparkle />
          </div>
          <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
            So hilft dir die App dabei, die richtigen Praktika für dich zu
            finden und zu planen ohne Trainer:innen mit WhatApp Nachrichten zu
            überfluten.
          </p>
        </div>
        <Image
          src="/img/dog-bucket.svg"
          className="hidden max-w-[220px] md:block"
          width={368}
          height={420}
          alt="Hund mit Eimer am Kopf"
        />
      </div>
      <div className="mt-16 grid divide-x divide-y divide-gray-100 overflow-hidden rounded-3xl border border-gray-100 text-gray-600 sm:grid-cols-2 lg:grid-cols-3 lg:divide-y-0">
        <div className="group relative bg-white transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
          <div className="relative space-y-4 p-8 py-12">
            <UserPlus2Icon className="h-8 w-8" />
            <div className="space-y-2">
              <h5 className="text-xl font-semibold text-gray-700 transition">
                1-Klick Anmeldung
              </h5>
              <p className="text-gray-600">
                Du kannst genau sehen wie viele Plätze bei Praktika noch frei
                sind und dich mit nur einem Klick für anmelden.
              </p>
            </div>
          </div>
        </div>
        <div className="group relative bg-white transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
          <div className="relative space-y-4 p-8 py-12">
            <SlidersIcon className="h-8 w-8" />
            <div className="space-y-2">
              <h5 className="text-xl font-semibold text-gray-700 transition">
                Praktika Filter
              </h5>
              <p className="text-gray-600">
                Filtere Praktika nach Fahrtzeit, Datum, Dauer und mehr und finde
                die optimalen Praktika für dich.
              </p>
            </div>
          </div>
        </div>
        <div className="group relative bg-white transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
          <div className="relative space-y-4 p-8 py-12">
            <CalendarDaysIcon className="h-8 w-8" />
            <div className="space-y-2">
              <h5 className="text-xl font-semibold text-gray-700 transition">
                Behalte die Übersicht
              </h5>
              <p className="text-gray-600">
                Hab immer im Blick, wann und wo deine Praktika stattfinden, und
                wofür du dich angemeldet hast.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="my-32 grid items-center gap-16 md:grid-cols-6">
        <div className="md:col-span-2">
          <h3 className="mb-6 text-2xl font-semibold leading-snug md:text-3xl">
            Sende Praktika Anfragen
          </h3>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Mit nur einem Klick kannst du eine Anfrage an Trainer:innen senden.
            Sobald ein Training von der Person erstellt wird, wirst du per Mail
            benachrichtigt.
          </p>
        </div>
        <div className="relative aspect-video w-full max-w-4xl md:col-span-4">
          <Image
            src="/img/trainer.png"
            alt="Trainer Liste"
            className="overflow-hidden rounded-2xl object-cover ring-1 ring-slate-900/10"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1282px"
          />
        </div>
      </div>

      <div className="my-32 grid items-center gap-16 md:grid-cols-6">
        <div className="md:order-last md:col-span-2">
          <h3 className="mb-6 text-2xl font-semibold leading-snug md:text-3xl">
            Finde das richtige Praktikum für dich
          </h3>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Du kannst Praktika nach Fahrtzeit, Datum, Dauer und mehr filtern,
            und so das passande Praktikum für dich finden.
          </p>
        </div>
        <div className="relative aspect-video w-full max-w-4xl md:col-span-4">
          <Image
            src="/img/home.png"
            alt="Praktika suchen"
            className="overflow-hidden rounded-2xl object-cover ring-1 ring-slate-900/10"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1282px"
          />
        </div>
      </div>

      <div className="my-32 grid items-center gap-16 md:grid-cols-6">
        <div className="md:col-span-2">
          <h3 className="mb-6 text-2xl font-semibold leading-snug md:text-3xl">
            Deine Anmeldungen auf einem Blick
          </h3>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Behalte immer im Blick wann und wo deine Praktika stattfinden, und
            wofür du dich angemeldet hast.
          </p>
        </div>
        <div className="relative aspect-video w-full max-w-4xl md:col-span-4">
          <Image
            src="/img/trainings.png"
            alt="Deine Praktika Anmeldungen"
            className="overflow-hidden rounded-2xl object-cover ring-1 ring-slate-900/10"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1282px"
          />
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
        className="absolute inset-0 m-auto grid h-max w-full grid-cols-2 -space-x-52 opacity-40"
      >
        <div className="h-56 bg-gradient-to-br from-yellow-200/20 to-yellow-400 blur-[106px]"></div>
        <div className="h-32 bg-gradient-to-r from-red-400 to-orange-300 blur-[106px]"></div>
      </div>
      <div className="container relative z-10">
        <div className="m-auto mt-6 space-y-6 md:w-8/12 lg:w-7/12">
          <h1 className="text-center text-4xl font-bold text-gray-800 md:text-5xl">
            Wie kann ich dabei sein?
          </h1>
          <p className="text-center text-xl text-gray-600">
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
