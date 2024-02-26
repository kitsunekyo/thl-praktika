"use client";

import { endOfDay, startOfDay } from "date-fns";
import {
  CalendarIcon,
  ChevronsDownUpIcon,
  ChevronsUpDownIcon,
  ClockIcon,
  MapIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { DateRange } from "react-day-picker";

import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatAT } from "@/lib/date";
import { cn } from "@/lib/utils";

const filterOptions = [
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
] as const;

export function TrainingFilter({ hasAddress }: { hasAddress: boolean }) {
  const { replace } = useRouter();
  const [pending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

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
    if (searchParams.get(key) === value) return;

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
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center py-2 text-sm">
        <h3 className="font-medium">Filter</h3>
        <CollapsibleTrigger asChild className="md:hidden">
          {isOpen ? (
            <Button variant="ghost" size="sm" className="ml-auto w-9 p-0">
              <ChevronsDownUpIcon className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          ) : (
            <Button variant="ghost" size="sm" className="ml-auto w-9 p-0">
              <ChevronsUpDownIcon className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          )}
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <section
          className="mb-4 space-y-6 rounded-xl bg-white p-4 text-sm shadow-lg"
          aria-label="filter"
        >
          <div>
            <div className="mb-2 flex items-center">
              <CalendarIcon className="mr-2 h-4 w-5" />
              <p className="font-medium">Zeitraum (von / bis)</p>
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
                          {formatAT(date.from, "dd. LLL yy")} -{" "}
                          {formatAT(date.to, "dd. LLL yy")}
                        </>
                      ) : (
                        formatAT(date.from, "dd. LLL yy")
                      )
                    ) : (
                      <span>Wähle ein Datum</span>
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
                      params.set(
                        "from",
                        formatAT(startOfDay(v.from), "yyyy-MM-dd"),
                      );
                    }
                    if (v?.to) {
                      params.set("to", formatAT(endOfDay(v.to), "yyyy-MM-dd"));
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
                  Vervollständige dein{" "}
                  <Link
                    href="/profile"
                    className="underline hover:no-underline"
                  >
                    Profil
                  </Link>{" "}
                  um nach Fahrtzeit filtern zu können!
                </Alert>
              ) : (
                <ul className="flex flex-wrap items-center gap-1">
                  <li>
                    <FilterOption
                      selected={!searchParams.get(filter.key)}
                      pending={pending}
                      onClick={() => updateFilter(filter.key, null)}
                    >
                      alle
                    </FilterOption>
                  </li>
                  {filter.options.map((option) => (
                    <li key={option.key}>
                      <FilterOption
                        selected={searchParams.get(filter.key) === option.key}
                        pending={pending}
                        onClick={() => updateFilter(filter.key, option.key)}
                      >
                        {option.label}
                      </FilterOption>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      </CollapsibleContent>
    </Collapsible>
  );
}

function FilterOption({
  selected,
  pending,
  onClick,
  children,
}: {
  selected: boolean;
  pending: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Badge
      variant={selected ? "default" : "secondary"}
      className={cn({ "cursor-pointer": !selected })}
      onClick={onClick}
      aria-disabled={pending}
    >
      {children}
    </Badge>
  );
}
