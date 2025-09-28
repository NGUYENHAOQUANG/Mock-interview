import React from "react";
import { ReactNode } from "react";
import AppHeader from "./_components/AppHeader";
import { Toaster } from "sonner";

function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <AppHeader />
      {children}
      <Toaster />
    </div>
  );
}

export default Layout;
