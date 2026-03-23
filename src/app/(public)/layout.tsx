import React from "react";

import { Footer, Navbar, ThemeSelector } from "@/components/shared";

interface Props {
  children: React.ReactNode;
}

const MainLayout = ({ children }: Props) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <ThemeSelector />
    </>
  );
};

export default MainLayout;
