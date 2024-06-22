import React from "react";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getMyProfile } from "@/modules/users/queries";

import { AppInfoStack } from "./AppInfoStack";
import { Body, HeaderNavigation, Main } from "./layouts";
import { MenuProvider } from "./nav/menu-context";
import { MobileMenu } from "./nav/MobileMenu";
import { AppSidebarSection, Sidebar } from "./Sidebar";

export function AuthenticatedLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <>
      <AppInfoStack />
      <Header>
        <HeaderNavigation />
        <MobileMenuLoader />
      </Header>
      <Body>
        <Main>{children}</Main>
        <Footer />
        <AppInfoStack />
      </Body>
    </>
  );
}

async function MobileMenuLoader() {
  const user = await getMyProfile();

  return (
    <div className="ml-auto lg:hidden">
      <MenuProvider>
        <MobileMenu user={user}>
          <Sidebar>
            <AppSidebarSection />
          </Sidebar>
        </MobileMenu>
      </MenuProvider>
    </div>
  );
}
