import { TrainingForm } from "./training";
import { TrainingList } from "./training-list";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="container">
        <div className="grid grid-cols-2 gap-8">
          <TrainingForm />
          <TrainingList />
        </div>
      </div>
    </main>
  );
}
