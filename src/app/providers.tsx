"use client";

import { NuqsAdapter } from "nuqs/adapters/next/app";

import { createTheme, MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

const theme = createTheme({
  fontFamily: "Open Sans, sans-serif",
  primaryColor: "cyan",
});
const queryClient = new QueryClient();

export default function Providers({
  session,
  children,
}: {
  session: Session | null;
  children: React.ReactNode;
}) {
  // if (!session) {
  //   return <p>Please sign in!</p>;
  // }
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <MantineProvider theme={theme}>
          <NuqsAdapter>{children}</NuqsAdapter>
        </MantineProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
