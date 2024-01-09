export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <article className="px-6 py-16 sm:px-8 md:py-32">
      <div className="prose mx-auto max-w-3xl prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-xl">
        {children}
      </div>
    </article>
  );
}
