import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumbs";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs>
        <BreadcrumbsItem href="/changelog">Änderungen</BreadcrumbsItem>
      </Breadcrumbs>
      <article className="prose py-6">{children}</article>
    </>
  );
}
