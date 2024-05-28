import { Fragment } from "react";

const LINK_REGEX = /(\bhttp[s]?:\/\/[\S]+)/gi;

export function wrapLinksWithTags(text: string) {
  const parts: string[] = text.split(LINK_REGEX);

  return parts.filter(Boolean).map((p, i) => {
    if (p.match(LINK_REGEX)) {
      return (
        <a
          key={i}
          href={p}
          target="_blank"
          rel="noreferrer"
          className="inline-block max-w-52 truncate underline md:max-w-sm "
        >
          {p}
        </a>
      );
    }
    return <Fragment key={p + i}>{p}</Fragment>;
  });
}
