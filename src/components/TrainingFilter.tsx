"use client";

/* eslint-disable import/no-duplicates */
import { endOfDay, format, setDefaultOptions, startOfDay } from "date-fns";
import { deAT } from "date-fns/locale";
import {
  CalendarIcon,
  ClockIcon,
  LockIcon,
  MapIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { DateRange } from "react-day-picker";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { Alert } from "./ui/alert";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

setDefaultOptions({
  locale: deAT,
});

const filterOptions = [
  {
    key: "traveltime",
    icon: MapIcon,
    label: "Fahrtzeit",
    options: [
      { key: "30", label: "bis 30min" },
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
] as const;

export function TrainingFilter({ hasAddress }: { hasAddress: boolean }) {
  const { replace } = useRouter();
  const [pending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [date, setDate] = useState<DateRange | undefined>(() => {
    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");

    if (!fromParam) {
      return;
    }

    let from;
    const fromDate = new Date(fromParam);
    if (isNaN(fromDate.getTime())) {
      return;
    }
    from = fromDate;

    let to;
    if (toParam) {
      const toDate = new Date(toParam);
      if (!isNaN(toDate.getTime())) {
        to = toDate;
      }
    }

    return {
      from,
      to,
    };
  });

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

  function clearDate() {
    setDate(undefined);
    const params = new URLSearchParams(window.location.search);
    params.delete("from");
    params.delete("to");
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <section className="space-y-6 text-sm" aria-label="filter">
      <div>
        <div className="mb-2 flex items-center">
          <CalendarIcon className="mr-2 h-4 w-5" />
          <p className="font-medium">Zeitraum</p>
        </div>
        <Popover>
          <div className="flex items-center gap-2">
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "group w-full items-center justify-start text-left text-xs font-normal",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "dd. LLL yy")} -{" "}
                      {format(date.to, "dd. LLL yy")}
                    </>
                  ) : (
                    format(date.from, "dd. LLL yy")
                  )
                ) : (
                  <span>Filter nach Datum</span>
                )}
                {date?.from || date?.to ? (
                  <button
                    className="ml-auto block translate-x-4 p-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearDate();
                    }}
                  >
                    <XIcon className="h-4 w-4" />
                  </button>
                ) : null}
              </Button>
            </PopoverTrigger>
          </div>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={(v) => {
                if (pending) return;
                setDate(v);
                const params = new URLSearchParams(window.location.search);
                if (!v?.from) {
                  params.delete("from");
                  params.delete("to");
                }
                if (v?.from) {
                  params.set("from", format(startOfDay(v.from), "yyyy-MM-dd"));
                }
                if (v?.to) {
                  params.set("to", format(endOfDay(v.to), "yyyy-MM-dd"));
                }
                startTransition(() => {
                  replace(`${pathname}?${params.toString()}`);
                });
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
      {filterOptions.map(({ icon: Icon, ...filter }) => (
        <div key={filter.label}>
          <div className="mb-2 flex items-center">
            <Icon className="mr-2 h-4 w-5" />
            <p className="font-medium">{filter.label}</p>
          </div>
          {filter.key === "traveltime" && !hasAddress ? (
            <Alert className="text-xs text-muted-foreground">
              Trage deine Adresse im{" "}
              <Link href="/profile" className="underline hover:no-underline">
                Profil
              </Link>{" "}
              ein, um nach Fahrtzeit filtern zu können
            </Alert>
          ) : (
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
          )}
        </div>
      ))}
    </section>
  );
}
