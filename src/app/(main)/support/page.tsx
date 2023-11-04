//

import { PageTitle } from "@/components/PageTitle";

export default function Page() {
  return (
    <div className="py-6">
      <div className="mb-4">
        <PageTitle>Wie kann ich dich unterstützen?</PageTitle>
      </div>
      <article className="prose">
        <p>
          Die App kostet mich aktuell keinen Cent. Sobald wir mit den
          versendeten Emails über 100 pro Monat kommen, kostet{" "}
          <strong>mich</strong> der Email Service etwa $15 pro Monat.{" "}
        </p>
        <p>
          <strong>Für dich bleibt die App für immer gratis.</strong>
        </p>
        <p>
          Wenn du mich und meine Arbeitszeit trotzdem unterstützen möchtest
          kannst du das über{" "}
          <a href="https://paypal.me/aspieslechner?country.x=AT&locale.x=de_DE">
            paypal.me/aspieslechner
          </a>{" "}
          tun.
        </p>
        <p>
          Alle Spenden die über die Betriebskosten hinausgehen werden an den
          Verein Tiere Helfen Leben gespendet.
        </p>
      </article>
    </div>
  );
}
