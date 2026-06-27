"use client";

import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  // Don't load user here — let each protected layout handle it
    return <>{children}</>;
}