"use client";

import { ChakraProvider } from "@chakra-ui/react";
import sitecoreTheme, { toastOptions } from "@sitecore/blok-theme";
import { MarketplaceClientProvider } from "./marketplaceClientProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider theme={sitecoreTheme} toastOptions={toastOptions}>
      <MarketplaceClientProvider>{children}</MarketplaceClientProvider>
    </ChakraProvider>
  );
}
