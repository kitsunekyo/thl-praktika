import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/next-auth";

import { TrainingList } from "./TrainingList";

export default async function Home() {
  const session = await getServerSession(authOptions);

  let content = <p>du musst dich anmelden</p>;
  if (session) {
    content = <TrainingList />;
  }
  return <div className="grid gap-8 md:grid-cols-2">{content}</div>;
}
