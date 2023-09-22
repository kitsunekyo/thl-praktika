"use client";

import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useTransition } from "react";

import { Badge } from "@/components/ui/badge";

export function Filter() {
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
    <section className="text-sm" aria-label="filter">
      {filterOptions.map((filter) => (
        <div key={filter.label} className="mb-4">
          <p className="mb-2 font-medium">{filter.label}</p>
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

const filterOptions = [
  {
    key: "traveltime",
    label: "Fahrtzeit",
    options: [
      { key: "30", label: "bis 30h" },
      { key: "60", label: "bis 1h" },
      { key: "120", label: "bis 2h" },
    ],
  },
  {
    key: "free",
    label: "Freie Plätze",
    options: [
      { key: "1", label: "1+" },
      { key: "2", label: "2+" },
      { key: "3", label: "3+" },
    ],
  },
  {
    key: "duration",
    label: "Trainingsdauer",
    options: [
      { key: "2", label: "ab 2h" },
      { key: "4", label: "ab 4h" },
    ],
  },
];
