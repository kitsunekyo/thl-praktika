export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="container py-24">{children}</div>;
}
