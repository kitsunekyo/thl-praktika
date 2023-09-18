import { TrainingList } from "./TrainingList";

export default async function Home() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <TrainingList />
    </div>
  );
}
