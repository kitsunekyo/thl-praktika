import Link from "next/link";

import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-gray-900">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 space-y-4 md:mb-0">
            <Logo light={true} />
            <p className="max-w-xs text-xs text-gray-400">
              Diese App ist ein privates Projekt. Du kannst Feedback oder
              Support Anfragen an hi@mostviertel.tech senden.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3 sm:gap-6">
            <div>
              <h2 className="mb-6 font-semibold uppercase text-white">Infos</h2>
              <ul className="space-y-4 font-medium text-gray-400">
                <li>
                  <Link href="/about" className="hover:underline">
                    Über diese App
                  </Link>
                </li>
                <li>
                  <Link href="/legal/privacy" className="hover:underline">
                    Datenschutzerklärung
                  </Link>
                </li>
                <li>
                  <Link href="/legal/imprint" className="hover:underline">
                    Impressum
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover:underline">
                    Unterstützen
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-700 sm:mx-auto lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-xs text-gray-400 sm:text-center">
            © 2023{" "}
            <a href="https://flowbite.com/" className="hover:underline">
              Alexander Spieslechner
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
