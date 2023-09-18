/* eslint-disable import/no-duplicates */
import { format, setDefaultOptions } from "date-fns";
import { deAT } from "date-fns/locale";

setDefaultOptions({
  locale: deAT,
});

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
