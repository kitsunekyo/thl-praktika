import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { User } from "next-auth";
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

export function getInitials(user: {
  name?: string | null;
  email?: string | null;
}) {
  const name = user.name?.split(" ");
  if (name) {
    const initials = name[0].charAt(0) + name[1].charAt(0);
    return initials.toUpperCase();
  }
  const emailName = user.email?.split("@")[0];
  if (emailName && emailName.length > 1) {
    const initials = emailName.charAt(0) + emailName.charAt(1);
    return initials.toUpperCase();
  }
  return "U";
}
