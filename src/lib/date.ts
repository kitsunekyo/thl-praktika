/* eslint-disable import/no-duplicates */
import {
  intervalToDuration,
  setDefaultOptions,
  startOfDay,
  sub,
} from "date-fns";
import { deAT } from "date-fns/locale";
import { formatInTimeZone } from "date-fns-tz";

setDefaultOptions({
  locale: deAT,
});

export function formatAT(date: Date, format: string) {
  return formatInTimeZone(date, "Europe/Vienna", format, {
    locale: deAT,
  });
}

export function formatTrainingDate(startDate: Date, endDate: Date) {
  const date = formatAT(new Date(startDate), "do MMM yy");
  const startTime = formatAT(new Date(startDate), "HH:mm");
  const endTime = formatAT(new Date(endDate), "HH:mm");

  return `${date} von ${startTime} bis ${endTime}`;
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
