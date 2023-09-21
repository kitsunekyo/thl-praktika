/* eslint-disable import/no-duplicates */
import { format, setDefaultOptions, startOfDay, sub } from "date-fns";
import { deAT } from "date-fns/locale";

setDefaultOptions({
  locale: deAT,
});

export function formatTrainingDate(
  date: Date,
  startTime: string,
  endTime: string,
) {
  const [startHours, startMinutes] = startTime.split(":");
  const [endHours, endMinutes] = endTime.split(":");
  const startSeconds =
    parseInt(startHours) * 60 * 60 + parseInt(startMinutes) * 60;
  const endSeconds = parseInt(endHours) * 60 * 60 + parseInt(endMinutes) * 60;

  const hours = Math.floor((endSeconds - startSeconds) / 3600);
  const minutes = Math.floor(((endSeconds - startSeconds) % 3600) / 60);

  let duration = "";
  if (hours > 0) duration += `${hours}h`;
  if (minutes > 0) duration += `${minutes}m`;

  return `${format(
    new Date(date),
    "do MMM yy",
  )}, ${startTime} - ${endTime} (${duration})`;
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

const timeZoneOffset = new Date().getTimezoneOffset();
export const getFixedDate = (date: Date) => {
  return sub(startOfDay(date), { minutes: timeZoneOffset });
};
