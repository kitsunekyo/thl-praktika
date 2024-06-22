import React from "react";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

import { Body, Main } from "./layouts";

export async function PublicLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <Body>
        <Main>{children}</Main>
        <Footer />
      </Body>
    </>
  );
}
