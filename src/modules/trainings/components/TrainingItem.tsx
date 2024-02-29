"use client";

import { CancelTraining } from "./CancelTraining";
import { EditTraining } from "./EditTraining";
import { TrainingCard } from "./TrainingCard";
import { Trainings } from "./TrainingList";
import { Unregister } from "./Unregister";

export function TrainingItem({ t, role }: { t: Trainings[0]; role: string }) {
  let actions = null;
  if (role === "trainer" && t.end > new Date()) {
    actions = (
      <>
        <EditTraining training={t} />
        <CancelTraining
          trainingId={t.id}
          hasRegistrations={Boolean(t.registrations.length)}
        />
      </>
    );
  }
  if (role === "user" && t.end > new Date()) {
    actions = <Unregister trainingId={t.id} />;
  }

  return <TrainingCard training={t} actions={actions} />;
}
