/* eslint-disable import/no-duplicates */
import {
  format,
  intervalToDuration,
  setDefaultOptions,
  startOfDay,
  sub,
} from "date-fns";
import { deAT } from "date-fns/locale";

setDefaultOptions({
  locale: deAT,
});

export function formatTrainingDate(startDate: Date, endDate: Date) {
  const date = format(new Date(startDate), "do MMM yy");
  const startTime = format(new Date(startDate), "HH:mm");
  const endTime = format(new Date(endDate), "HH:mm");

  return `${date} von ${startTime} bis ${endTime}`;
}

export function formatTimeValue(time: string) {
  if (time === "" || !time.match(/^[\d\:]*$/)) return "08:00";

  let formattedTime = time;
  if (!formattedTime.includes(":")) {
    const pt = formattedTime.padStart(2, "0").padEnd(4, "0").slice(0, 4);
    formattedTime = pt.slice(0, 2) + ":" + pt.slice(2, 4);
  }

  let [hours, minutes] = formattedTime.split(":");
  if (hours === "") hours = "00";
  if (minutes === "") minutes = "00";

  if (parseInt(hours) > 23) return "23:59";
  if (parseInt(minutes) > 59) return hours + ":59";

  const paddedHours = hours.padStart(2, "0");
  const paddedMinutes = minutes.padEnd(2, "0");

  return `${paddedHours}:${paddedMinutes}`;
}

export const getFixedDate = (date: Date) => {
  const timeZoneOffset = new Date().getTimezoneOffset();
  return sub(startOfDay(date), { minutes: timeZoneOffset });
};

export function secondsToDuration(seconds: number): Duration {
  const epoch = new Date(0);
  const secondsAfterEpoch = new Date(seconds * 1000);
  return intervalToDuration({
    start: epoch,
    end: secondsAfterEpoch,
  });
}
