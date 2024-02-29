"use client";

import { CancelTraining } from "./CancelTraining";
import { EditTraining } from "./EditTraining";
import { Register } from "./Register";
import { TrainingCard } from "./TrainingCard";
import { Trainings } from "./TrainingList";
import { Unregister } from "./Unregister";

export function TrainingItem({
  t,
  role,
  userId,
}: {
  t: Trainings[0];
  role: string;
  userId?: string;
}) {
  const hasFreeSpots = t.maxInterns - t.registrations.length > 0;
  const isOwner = t.authorId === userId;
  const isRegistered = t.registrations.some((r) => r.userId === userId);
  const isPast = t.end < new Date();
  const canRegister = !isOwner && hasFreeSpots && !isRegistered;

  let actions = null;
  if (role === "trainer" && isOwner && !isPast) {
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
  if (role === "user" && isRegistered) {
    actions = <Unregister trainingId={t.id} />;
  }
  if (role === "user" && canRegister) {
    actions = <Register trainingId={t.id} />;
  }

  return <TrainingCard training={t} actions={actions} />;
}
