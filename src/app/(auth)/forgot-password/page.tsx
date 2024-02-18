import { ForgotPasswordForm } from "@/modules/auth/components/ForgotPasswordForm";

export default function ForgotPassword() {
  return (
    <>
      <h1 className="mb-4 text-center text-4xl font-bold">
        Passwort vergessen?
      </h1>
      <p className="mb-8 text-center text-muted-foreground">
        Kein Problem. Das passiert uns allen mal. 😉
        <br />
        Gib deine E-Mail-Adresse ein und wir senden dir einen Link zum
        Zurücksetzen deines Passworts.
      </p>
      <ForgotPasswordForm />
    </>
  );
}
