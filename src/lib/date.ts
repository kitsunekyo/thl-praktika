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
