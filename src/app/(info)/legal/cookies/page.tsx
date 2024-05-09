import {
  Breadcrumbs,
  BreadcrumbsItem,
  BreadcrumbsSeparator,
} from "@/components/Breadcrumbs";
import { PageTitle } from "@/components/PageTitle";

export default function Page() {
  return (
    <>
      <Breadcrumbs>
        <BreadcrumbsItem>Legal</BreadcrumbsItem>
        <BreadcrumbsSeparator />
        <BreadcrumbsItem href="/legal/cookies">Cookies</BreadcrumbsItem>
      </Breadcrumbs>
      <div className="py-6">
        <div className="mb-4">
          <PageTitle>Cookies</PageTitle>
        </div>
        <article className="prose">
          <p>
            Diese Website verwendet Cookies, um Ihnen ein optimales
            Benutzererlebnis zu bieten und unsere Dienste kontinuierlich zu
            verbessern. Im Folgenden möchten wir Sie über die Arten von Cookies
            informieren, die wir verwenden und wie wir sie nutzen:
          </p>
          <ol>
            <li>
              <strong>Authentifizierungs-Cookies:</strong> Diese Cookies sind
              für die Funktion unserer Anwendung unerlässlich. Sie ermöglichen
              es Benutzern, sich sicher einzuloggen und die verschiedenen
              Funktionen unserer Anwendung zu nutzen. Diese Cookies enthalten
              keine persönlich identifizierbaren Informationen und werden nur
              für die Dauer Ihrer Sitzung gespeichert.
            </li>
            <li>
              <strong>Posthog-Cookies:</strong> Wir verwenden Posthog, um das
              Benutzerverhalten auf unserer Website zu analysieren und unser
              Angebot zu verbessern. Posthog setzt Cookies ein, um anonyme
              Informationen über Ihre Interaktionen mit unserer Anwendung zu
              sammeln. Diese Cookies enthalten keine sensiblen personenbezogenen
              Daten und dienen ausschließlich der Analyse und Verbesserung
              unserer Dienste.
            </li>
          </ol>
          <p>
            Bitte beachten Sie, dass wir keine persönlichen Informationen an
            Dritte zu Marketing- oder Werbezwecken weitergeben. Alle gesammelten
            Daten werden ausschließlich für interne Zwecke verwendet, um die
            Leistung unserer Anwendung zu überwachen, zu analysieren und zu
            verbessern.
          </p>
          <p>
            Indem Sie unsere Anwendung nutzen, stimmen Sie der Verwendung der
            oben genannten Cookies zu. Sie haben jedoch die Möglichkeit, Cookies
            in Ihren Browsereinstellungen zu deaktivieren oder zu löschen, falls
            Sie dies bevorzugen. Bitte beachten Sie jedoch, dass dies die
            Funktionalität unserer Anwendung beeinträchtigen kann.
          </p>
          <p>
            Vielen Dank für Ihr Verständnis und Ihre Unterstützung bei der
            Verbesserung unserer Anwendung. Wenn Sie weitere Fragen zu unserer
            Cookie-Richtlinie haben, können Sie uns gerne kontaktieren.
          </p>
        </article>
      </div>
    </>
  );
}
