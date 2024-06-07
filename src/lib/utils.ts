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

export function normalizePhoneNumber(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/(?!^\+)\D/g, "");
  const phoneNumberPattern = /^(\+|00)?(\d{1,3})?(\d{7,14})$/;
  const match = cleaned.match(phoneNumberPattern);

  if (match) {
    let countryCode = match[2] ? match[2] : "";
    let number = match[3];

    if (cleaned.startsWith("00")) {
      countryCode = "+" + countryCode;
    } else if (!cleaned.startsWith("+")) {
      if (countryCode) {
        countryCode = "+" + countryCode;
      } else {
        countryCode = "+43";
      }
    }
    return countryCode + number;
  }

  return phoneNumber;
}
