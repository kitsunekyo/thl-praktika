export function getInitials(user: {
  name?: string | null;
  email?: string | null;
}) {
  const name = user.name?.split(" ");
  if (name) {
    const initials =
      name.length > 2
        ? name[0].charAt(0) + name[1].charAt(0)
        : name[0].substring(0, 2);
    return initials.toUpperCase();
  }
  const emailName = user.email?.split("@")[0];
  if (emailName && emailName.length > 1) {
    const initials = emailName.charAt(0) + emailName.charAt(1);
    return initials.toUpperCase();
  }
  return "U";
}