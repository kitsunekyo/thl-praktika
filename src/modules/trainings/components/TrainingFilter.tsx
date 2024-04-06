"use client";

import { endOfDay, startOfDay } from "date-fns";
import debounce from "lodash/debounce";
import {
  CalendarIcon,
  ChevronsDownUpIcon,
  ChevronsUpDownIcon,
  ClockIcon,
  FilterXIcon,
  MapIcon,
  SearchIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useOptimistic,
  useState,
  useTransition,
} from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
      { key: 1, label: "1+" },
      { key: 2, label: "2+" },
      { key: 3, label: "3+" },
    ],
  },
  {
    key: "duration",
    icon: ClockIcon,
    label: "Trainingsdauer",
    options: [
      { key: 2, label: "ab 2h" },
      { key: 4, label: "ab 4h" },
    ],
  },
  {
    key: "traveltime",
    icon: MapIcon,
    label: "Fahrtzeit",
    options: [
      { key: 30, label: "bis 30min" },
      { key: 60, label: "bis 1h" },
      { key: 120, label: "bis 2h" },
    ],
  },
] as const;

export type Filter = {
  free: number;
  duration: number;
  traveltime: number;
  from?: Date;
  to?: Date;
  search: string;
};

const FILTER_LOCALSTORAGE_KEY = "filter-open";

export function TrainingFilter({
  hasAddress,
  value,
}: {
  hasAddress: boolean;
  value: Filter;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [optimisticFilter, setOptimisticFilter] = useOptimistic<Filter>(value);
  const [isOpen, setIsOpen] = useState(true);

  function setFilterOpen(open: boolean) {
    setIsOpen(open);
    if (window) {
      window.localStorage.setItem(FILTER_LOCALSTORAGE_KEY, open.toString());
    }
  }

  useEffect(() => {
    if (!window) {
      return;
    }
    setIsOpen(window.localStorage.getItem(FILTER_LOCALSTORAGE_KEY) === "true");
  }, []);

  const [date, setDate] = useState<DateRange | undefined>(() => {
    if (!optimisticFilter.from) {
      return;
    }

    let from;
    if (isNaN(optimisticFilter.from.getTime())) {
      return;
    }
    from = optimisticFilter.from;

    let to;
    if (optimisticFilter.to) {
      if (!isNaN(optimisticFilter.to.getTime())) {
        to = optimisticFilter.to;
      }
    }

    return {
      from,
      to,
    };
  });

  function updateFilter(key: string, value: number | null) {
    const params = new URLSearchParams(window.location.search);
    if (value === null) {
      params.delete(key);
    } else {
      params.set(key, value.toString());
    }

    startTransition(() => {
      setOptimisticFilter((prev) => ({
        ...prev,
        [key]: value,
      }));
      router.push(`?${params.toString()}`);
    });
  }

  function clearDate() {
    setDate(undefined);
    const params = new URLSearchParams(window.location.search);
    params.delete("from");
    params.delete("to");
    startTransition(() => {
      setOptimisticFilter((prev) => ({
        ...prev,
        from: undefined,
        to: undefined,
      }));
      router.push(`?${params.toString()}`);
    });
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    debouncedSearch(e.target.value);
  }

  const updateSearch = useCallback(
    (value: string) => {
      const params = new URLSearchParams(window.location.search);
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      startTransition(() => {
        setOptimisticFilter((prev) => ({
          ...prev,
          search: value,
        }));
        router.push(`?${params.toString()}`);
      });
    },
    [router, setOptimisticFilter],
  );

  const debouncedSearch = useMemo(
    () => debounce(updateSearch, 300),
    [updateSearch],
  );

  function handleSelectDate(range: DateRange | undefined) {
    setDate(range);
    const params = new URLSearchParams(window.location.search);
    if (!range?.from) {
      params.delete("from");
      params.delete("to");
    }
    if (range?.from) {
      params.set("from", formatAT(startOfDay(range.from), "yyyy-MM-dd"));
    }
    if (range?.to) {
      params.set("to", formatAT(endOfDay(range.to), "yyyy-MM-dd"));
    }
    startTransition(() => {
      setOptimisticFilter((prev) => ({
        ...prev,
        from: range?.from,
        to: range?.to,
      }));
      router.push(`?${params.toString()}`);
    });
  }

  function handleResetFilters() {
    const params = new URLSearchParams();
    startTransition(() => {
      setOptimisticFilter({
        free: 0,
        duration: 0,
        traveltime: 0,
        from: undefined,
        to: undefined,
        search: "",
      });
      router.push(`?${params.toString()}`);
    });
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setFilterOpen}>
      <div className="flex items-center px-4 py-2 text-sm">
        <h3 className="font-medium">Filter</h3>
        <CollapsibleTrigger asChild>
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
          <div className="space-y-2">
            <Label htmlFor="search">Suche</Label>
            <div className="relative">
              <SearchIcon className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                type="search"
                placeholder="Trainer, Adresse oder Beschreibung"
                className="pl-8"
                defaultValue={optimisticFilter.search}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <div>
            <div className="mb-2 flex items-center">
              <CalendarIcon className="mr-2 h-4 w-5" />
              <p className="font-medium">Zeitraum (von / bis)</p>
            </div>
            <Popover>
              <div className="flex items-center gap-2">
                <PopoverTrigger asChild>
                  <div className="relative w-full">
                    <CalendarIcon className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
                    <Button
                      id="date"
                      variant="outline"
                      className={cn(
                        "group w-full justify-start px-3 py-2 pl-8 text-left font-normal",
                        !date && "text-muted-foreground",
                      )}
                    >
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
                        <span>Wähle einen Zeitraum</span>
                      )}
                    </Button>
                    {date?.from || date?.to ? (
                      <button
                        className="absolute right-0 p-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearDate();
                        }}
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>
                </PopoverTrigger>
              </div>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={handleSelectDate}
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
                      selected={!optimisticFilter[filter.key]}
                      onClick={() => updateFilter(filter.key, null)}
                    >
                      alle
                    </FilterOption>
                  </li>
                  {filter.options.map((option) => (
                    <li key={option.key}>
                      <FilterOption
                        selected={optimisticFilter[filter.key] === option.key}
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
          {Object.values(optimisticFilter).some(Boolean) && (
            <div>
              <Button
                size="sm"
                variant="ghost"
                className="w-full"
                onClick={handleResetFilters}
              >
                <FilterXIcon className="mr-2 h-4 w-4" />
                Filter zurücksetzen
              </Button>
            </div>
          )}
        </section>
      </CollapsibleContent>
    </Collapsible>
  );
}

function FilterOption({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Badge
      variant={selected ? "default" : "secondary"}
      className={cn("select-none", { "cursor-pointer": !selected })}
      onClick={onClick}
    >
      {children}
    </Badge>
  );
}
