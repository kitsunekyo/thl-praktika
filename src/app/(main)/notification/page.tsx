import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumbs";
import { getMySubscription } from "@/modules/push/queries";

import { NotificationTest } from "./Notification";

export default async function Page() {
  const subscription = await getMySubscription();

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbsItem href={`/notification`}>Push Test</BreadcrumbsItem>
      </Breadcrumbs>
      <div className="mx-auto max-w-[600px] py-6">
        <NotificationTest subscription={subscription} />
      </div>
    </>
  );
}
