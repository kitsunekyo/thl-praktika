import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumbs";

import { NotificationTest } from "./Notification";

export default async function Page() {
  return (
    <>
      <Breadcrumbs>
        <BreadcrumbsItem href={`/notification`}>Push Test</BreadcrumbsItem>
      </Breadcrumbs>
      <div className="mx-auto max-w-[600px] py-6">
        <NotificationTest />
      </div>
    </>
  );
}
