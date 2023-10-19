import { Session } from "next-auth";

/**
 * leave roles undefined if the link should be visible for all users
 * otherwise specify the roles that should see the link
 */
export const PRIMARY_NAV_LINKS = [
  {
    href: "/trainer/dashboard",
    label: "Trainer Hub",
    roles: ["trainer", "admin"],
  },
  {
    href: "/admin/users",
    label: "Admin",
    roles: ["admin"],
  },
];

export const USER_NAV_LINKS = [
  {
    href: "/profile",
    label: "Profil",
  },
];

export function canSeeLink(
  link: { href: string; label: string; roles?: string[] },
  user?: Session["user"],
) {
  return !link.roles || (user?.role && link.roles.includes(user.role));
}
