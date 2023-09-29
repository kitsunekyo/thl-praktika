import { CalendarIcon, ChevronsUpDown, MailIcon, MapIcon } from "lucide-react";

import { PageTitle } from "@/components/PageTitle";
import { TrainingDate } from "@/components/training/TrainingDate";
import { TrainingRegistrations } from "@/components/training/TrainingRegistrations";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { formatUserAddress } from "@/lib/user";

import { TrainingForm } from "./TrainingForm";
import { TrainingListActions } from "./TrainingListActions";
import { getMyTrainings } from "../actions";

export default async function Page() {
  const trainings = await getMyTrainings();

  return (
    <div>
      <PageTitle>Trainer Dashboard</PageTitle>
      <div className="gap-16 md:grid lg:grid-cols-[500px,1fr]">
        <div className="mb-10 md:mb-0">
          <h2 className="mb-3 text-xl font-semibold">Training erstellen</h2>
          <p className="mb-8 max-w-[70ch] text-sm leading-[1.8] text-gray-500">
            Du hast ein Training bei denen Praktikant:innen von THL dabei sein
            können? Trage es hier ein, damit sie sich dafür anmelden können.
          </p>
          <TrainingForm />
        </div>
        <section>
          <h2 className="mb-6 text-xl font-semibold">
            Deine geplanten Trainings
          </h2>
          {trainings.length === 0 && (
            <p className="text-sm text-gray-500">
              Du hast noch keine Trainings eingetragen.
            </p>
          )}
          <ul className="space-y-4">
            {trainings.map((training) => (
              <li key={training.id}>
                <TrainingItem training={training} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function TrainingItem({
  training,
}: {
  training: Awaited<ReturnType<typeof getMyTrainings>>[number];
}) {
  return (
    <div className="rounded border border-solid bg-white p-4 text-sm">
      <dl className="space-y-2">
        <dd className="font-medium">{training.description}</dd>
        <dd className="flex items-center">
          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          <TrainingDate start={training.start} end={training.end} />
        </dd>
        <dd>
          {training.registrations.length ? (
            <Collapsible className="space-y-2" defaultOpen>
              <div className="flex items-center space-x-2">
                <TrainingRegistrations
                  count={training.registrations.length}
                  max={training.maxInterns}
                />
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 p-2">
                    <ChevronsUpDown className="h-4 w-4" />
                    <span className="sr-only">Toggle</span>
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="space-y-2">
                <h3 className="font-medium">Angemeldete Praktikant:innen</h3>
                {training.registrations.map(({ user, id }) => (
                  <div key={id} className="rounded-md border px-4 py-3 text-sm">
                    <div className="flex items-center">
                      <Avatar size="default" className="mr-4">
                        <AvatarImage src={user.image || "/img/avatar.jpg"} />
                      </Avatar>
                      <dl>
                        {user.name && <dd>{user.name}</dd>}
                        <dd className="flex items-center text-xs text-muted-foreground">
                          <MailIcon className="mr-2 h-3 w-3" />
                          {user.phone ? (
                            <>
                              <a
                                href={`tel:${user.phone}`}
                                className="underline"
                              >
                                {user.phone}
                              </a>
                              <span className="mx-2">&middot;</span>
                            </>
                          ) : null}
                          <a
                            href={`mailto:${user.email}`}
                            className="underline"
                          >
                            {user.email}
                          </a>
                        </dd>
                        {
                          <dd className="flex items-center text-xs text-muted-foreground">
                            {formatUserAddress(user) !== "" && (
                              <>
                                <MapIcon className="mr-2 h-3 w-3" />
                                <span className="sr-only">Adresse:</span>{" "}
                                {formatUserAddress(user)}
                              </>
                            )}
                          </dd>
                        }
                      </dl>
                    </div>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <TrainingRegistrations
              count={training.registrations.length}
              max={training.maxInterns}
            />
          )}
        </dd>
      </dl>
      <footer className="mt-4 flex items-center gap-4 border-t pt-4">
        <TrainingListActions id={training.id} />
      </footer>
    </div>
  );
}
