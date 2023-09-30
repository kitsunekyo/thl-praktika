import { PageTitle } from "@/components/PageTitle";

export default function Page() {
  return (
    <>
      <PageTitle>Impressum</PageTitle>
      <article className="prose">
        <h2>
          Informationen und Offenlegung gemäß &sect;5 (1) ECG, &sect; 25
          MedienG, &sect; 63 GewO und &sect; 14 UGB
        </h2>
        <p>
          <strong>Webseitenbetreiber:</strong> Ing. Alexander Spieslechner
        </p>
        <p>
          <strong>Anschrift:</strong> Fasangartengasse 5, 3251 Purgstall
        </p>
        <p>
          <strong>Kontaktdaten:</strong>
          <br /> Email: hi@mostviertel.tech <br />
        </p>
        <p>Diese Webseite und deren Inhalte sind ein privates Projekt.</p>
        <p>
          <strong>Urheberrecht:</strong> Die Inhalte dieser Webseite
          unterliegen, soweit dies rechtlich möglich ist, diversen Schutzrechten
          (z.B dem Urheberrecht). Jegliche Verwendung/Verbreitung von
          bereitgestelltem Material, welche urheberrechtlich untersagt ist,
          bedarf schriftlicher Zustimmung des Webseitenbetreibers.
        </p>
        <p>
          <strong>Haftungsausschluss:</strong> Trotz sorgfältiger inhaltlicher
          Kontrolle übernimmt der Webseitenbetreiber dieser Webseite keine
          Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten
          Seiten sind ausschließlich deren Betreiber verantwortlich. Sollten Sie
          dennoch auf ausgehende Links aufmerksam werden, welche auf eine
          Webseite mit rechtswidriger Tätigkeit/Information verweisen, ersuchen
          wir um dementsprechenden Hinweis, um diese nach § 17 Abs. 2 ECG
          umgehend zu entfernen.
        </p>
        <p>
          Die Urheberrechte Dritter werden vom Betreiber dieser Webseite mit
          größter Sorgfalt beachtet. Sollten Sie trotzdem auf eine
          Urheberrechtsverletzung aufmerksam werden, bitten wir um einen
          entsprechenden Hinweis. Bei Bekanntwerden derartiger
          Rechtsverletzungen werden wir den betroffenen Inhalt umgehend
          entfernen.
        </p>
      </article>
    </>
  );
}
