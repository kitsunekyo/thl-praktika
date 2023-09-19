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

/**
 * @returns a time string in the format HH:mm
 */
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
