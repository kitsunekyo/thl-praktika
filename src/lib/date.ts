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

export function formatTrainingDate(startDate: Date, endDate: Date) {
  console.warn("timezone", Intl.DateTimeFormat().resolvedOptions().timeZone);
  const date = formatInTimeZone(
    new Date(startDate),
    "Europe/Vienna",
    "do MMM yy",
    {
      locale: deAT,
    },
  );
  const startTime = formatInTimeZone(
    new Date(startDate),
    "Europe/Vienna",
    "HH:mm",
    {
      locale: deAT,
    },
  );
  const endTime = formatInTimeZone(
    new Date(endDate),
    "Europe/Vienna",
    "HH:mm",
    {
      locale: deAT,
    },
  );

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
