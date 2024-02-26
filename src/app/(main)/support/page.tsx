import { PageTitle } from "@/components/PageTitle";

export default function Page() {
  return (
    <div className="py-6">
      <div className="mb-4">
        <PageTitle>Wie kann ich dich unterstützen?</PageTitle>
      </div>
      <article className="prose">
        <p>
          <strong>Für dich bleibt die App für immer gratis.</strong>
        </p>
        <p>
          Die App kostet mich aktuell eta 15€ pro Monat für den Email Service{" "}
          <a href="https://postmark.com/" rel="nofollow noopener noreferrer">
            Postmark
          </a>
          .
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
