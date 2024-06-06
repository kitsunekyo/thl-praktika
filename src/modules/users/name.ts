export function getInitials(payload: { name: string } | string) {
  const name = typeof payload === "string" ? payload : payload.name;
  const parts = name.split(" ");

  const initials =
    parts.length > 2
      ? parts[0].charAt(0) + parts[1].charAt(0)
      : parts[0].substring(0, 2);

  return initials.toUpperCase();
}
