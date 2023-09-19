import { Training } from "@prisma/client";
import { set } from "date-fns";

export function getStartTimeAsDate(training: Training): Date {
  if (!training.startTime.match(/\d\d:\d\d/)) {
    throw new Error("Invalid start time");
  }
  const [hours, minutes] = training.startTime.split(":");
  const date = set(new Date(training.date), {
    hours: parseInt(hours),
    minutes: parseInt(minutes),
  });
  return date;
}

export function getEndTimeAsDate(training: Training): Date {
  if (!training.endTime.match(/\d\d:\d\d/)) {
    throw new Error("Invalid endt time");
  }
  const [hours, minutes] = training.endTime.split(":");
  const date = set(new Date(training.date), {
    hours: parseInt(hours),
    minutes: parseInt(minutes),
  });
  return date;
}
