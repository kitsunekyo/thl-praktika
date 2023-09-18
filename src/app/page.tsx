import { TrainingList } from "./TrainingList";

export default async function Home() {
  return (
    <div className="grid grid-cols-2 gap-8">
      <TrainingList />
    </div>
  );
}
