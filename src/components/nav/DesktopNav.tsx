import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "next-auth";

import { cn } from "@/lib/utils";

import { PRIMARY_NAV_LINKS, canSeeLink } from "./links";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";

export function DesktopNav({ user }: { user?: User }) {
  const pathname = usePathname();
  const links = PRIMARY_NAV_LINKS.filter((link) => canSeeLink(link, user));

  return (
    <nav className="hidden md:block">
      <NavigationMenu>
        <NavigationMenuList>
          {links.map((link) => (
            <NavigationMenuItem key={link.href}>
              <Link href={link.href} legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "text-foreground/60 hover:text-foreground/80",
                    pathname === link.href && "text-foreground",
                  )}
                >
                  {link.label}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}
