import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTrainingDate(
  date: Date,
  startTime: string,
  endTime: string,
) {
  return `${format(
    new Date(date),
    "do MMM yy",
  )} von ${startTime} bis ${endTime}`;
}
