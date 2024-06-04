"use client";

import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/20/solid";
import { VariantProps, cva } from "class-variance-authority";
import { XIcon } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const variants = cva(
  "rounded-md p-4 bg-[--bg-color] border border-[--button-bg-hover]",
  {
    variants: {
      variant: {
        info: "[--icon-color:theme(colors.blue.400)] [--text-color:theme(colors.blue.800)] [--bg-color:theme(colors.blue.50)] [--button-text:theme(colors.blue.500)] [--button-bg-hover:theme(colors.blue.100)] [--focus-ring:theme(colors.blue.600)]",
        success:
          "[--icon-color:theme(colors.green.400)] [--text-color:theme(colors.green.800)] [--bg-color:theme(colors.green.50)] [--button-text:theme(colors.green.500)] [--button-bg-hover:theme(colors.green.100)] [--focus-ring:theme(colors.green.600)]",
        warn: "[--icon-color:theme(colors.yellow.400)] [--text-color:theme(colors.yellow.800)] [--bg-color:theme(colors.yellow.50)] [--button-text:theme(colors.yellow.500)] [--button-bg-hover:theme(colors.yellow.100)] [--focus-ring:theme(colors.yellow.600)]",
        error:
          "[--icon-color:theme(colors.red.400)] [--text-color:theme(colors.red.800)] [--bg-color:theme(colors.red.50)] [--button-text:theme(colors.red.500)] [--button-bg-hover:theme(colors.red.100)] [--focus-ring:theme(colors.red.600)]",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  },
);

export type InfoBoxVariantOptions = VariantProps<typeof variants>;

const variantToIconMap = {
  info: InformationCircleIcon,
  success: CheckCircleIcon,
  warn: ExclamationTriangleIcon,
  error: XCircleIcon,
};

interface Props extends InfoBoxVariantOptions {
  children: ReactNode;
  storageKey: string;
  maxAge?: number;
}

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

export function InfoBox({
  variant,
  children,
  storageKey,
  maxAge = ONE_YEAR_IN_SECONDS,
}: Props) {
  const cookieKey = `info-box-closed-${storageKey}`;
  const [isClosed, setIsClosed] = useState(true);

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(";").shift();
    }
  };

  const setCookie = (name: string, value: string) => {
    document.cookie = `${name}=${value};path=/;max-age=${maxAge}`;
  };

  useEffect(() => {
    const isClosedFromCookie = getCookie(cookieKey);
    if (isClosedFromCookie) {
      setIsClosed(JSON.parse(isClosedFromCookie));
    } else {
      setIsClosed(false);
    }
  }, [cookieKey]);

  const handleClose = () => {
    setIsClosed(true);
    setCookie(cookieKey, JSON.stringify(true));
  };

  if (isClosed) {
    return null;
  }

  const Icon = variantToIconMap[variant || "info"];

  return (
    <div className={cn(variants({ variant }))}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className="h-5 w-5 text-[--icon-color]" aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1 text-sm text-[--text-color]">
          {children}
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex rounded-md p-1.5 text-[--button-text] hover:bg-[--button-bg-hover] focus:outline-none focus:ring-2 focus:ring-[--focus-ring] focus:ring-offset-2"
            >
              <span className="sr-only">Schließen</span>
              <XIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
