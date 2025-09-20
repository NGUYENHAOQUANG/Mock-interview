import React from "react";
import { ReactNode } from "react";
import AppHeader from "./_components/AppHeader";

function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <AppHeader />
      {children}
    </div>
  );
}

export default Layout;
