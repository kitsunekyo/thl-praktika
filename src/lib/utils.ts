import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const range = (start: number, end?: number, step = 1) => {
  let output = [];

  if (typeof end === "undefined") {
    end = start;
    start = 0;
  }

  for (let i = start; i < end; i += step) {
    output.push(i);
  }

  return output;
};

/**
 * returns a randum integer between min and max (inclusive)
 */
export function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const countryCode = /\+(\d\d)/g;
const altCountryCode = /^00(\d\d)/g;

export function normalizePhoneNumber(tel: string) {
  const cleanedTel = tel
    .replace(/([\s\/\-|a-z\(\)])/g, "")
    .replace(altCountryCode, "+$1");

  if (cleanedTel.match(countryCode)) {
    return cleanedTel;
  }

  return `+43${cleanedTel}`;
}
