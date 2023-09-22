"use client";

import { ClockIcon, MapIcon, UserIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import { Badge } from "@/components/ui/badge";

const filterOptions = [
  {
    key: "traveltime",
    icon: MapIcon,
    label: "Fahrtzeit",
    options: [
      { key: "30", label: "bis 30h" },
      { key: "60", label: "bis 1h" },
      { key: "120", label: "bis 2h" },
    ],
  },
  {
    key: "free",
    icon: UserIcon,
    label: "Freie Plätze",
    options: [
      { key: "1", label: "1+" },
      { key: "2", label: "2+" },
      { key: "3", label: "3+" },
    ],
  },
  {
    key: "duration",
    icon: ClockIcon,
    label: "Trainingsdauer",
    options: [
      { key: "2", label: "ab 2h" },
      { key: "4", label: "ab 4h" },
    ],
  },
];

export function TrainingFilter() {
  const { replace } = useRouter();
  const [pending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  function updateFilter(key: string, value: string | null) {
    if (pending) return;

    const params = new URLSearchParams(window.location.search);
    if (value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <section className="space-y-6 text-sm" aria-label="filter">
      {filterOptions.map(({ icon: Icon, ...filter }) => (
        <div key={filter.label}>
          <div className="mb-2 flex items-center">
            <Icon className="mr-2 h-4 w-5" />
            <p className="font-medium">{filter.label}</p>
          </div>
          <ul className="flex flex-wrap items-center gap-1">
            <li>
              <Badge
                variant={
                  !searchParams.get(filter.key) ? "default" : "secondary"
                }
                className="cursor-pointer"
                onClick={() => updateFilter(filter.key, null)}
                aria-disabled={pending}
              >
                alle
              </Badge>
            </li>
            {filter.options.map((option) => (
              <li key={option.key}>
                <Badge
                  variant={
                    searchParams.get(filter.key) === option.key
                      ? "default"
                      : "secondary"
                  }
                  className="cursor-pointer"
                  onClick={() => updateFilter(filter.key, option.key)}
                  aria-disabled={pending}
                >
                  {option.label}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
