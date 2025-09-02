/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useCallback, useContext } from "react";
import type { ReactNode } from "react";
import type {
  ApplicationContext,
  PagesContext,
} from "@sitecore-marketplace-sdk/client";
import { useEffect, useState } from "react";
import { useMarketplaceClient } from "../utils/hooks/useMarketplaceClient";

type MarketplaceClientContextType = ReturnType<typeof useMarketplaceClient> & {
  appContext?: ApplicationContext;
  appContextLoading: boolean;
  appContextError?: Error;
  pagesContext?: PagesContext;
  pagesContextLoading: boolean;
  pagesContextError?: Error;
};

const MarketplaceClientContext = createContext<
  MarketplaceClientContextType | undefined
>(undefined);

interface ProviderProps {
  children: ReactNode;
}

export function MarketplaceClientProvider({ children }: ProviderProps) {
  const clientState = useMarketplaceClient();
  const { client, error, isInitialized } = clientState;

  const [appContext, setAppContext] = useState<ApplicationContext>();
  const [appContextLoading, setAppContextLoading] = useState(false);
  const [appContextError, setAppContextError] = useState<Error>();

  const [pagesContext, setPagesContext] = useState<PagesContext>();
  const [pagesContextLoading, setPagesContextLoading] = useState(false);
  const [pagesContextError, setPagesContextError] = useState<Error>();

  useEffect(() => {
    if (!error && isInitialized && client) {
      setAppContextLoading(true);
      client
        .query("application.context")
        .then((res: any) => {
          setAppContext(res.data);
          setAppContextLoading(false);
        })
        .catch((err: any) => {
          setAppContextError(
            err instanceof Error
              ? err
              : new Error("Failed to fetch application context")
          );
          setAppContextLoading(false);
        });
    } else if (error) {
      setAppContextError(error);
    }
  }, [client, error, isInitialized]);

  const fetchInitialContext = useCallback(async () => {
    if (!client) return;

    try {
      setPagesContextLoading(true);

      const { data } = await client.query("pages.context");

      if (data) {
        setPagesContext(data);
      }
    } catch (err) {
      setPagesContextError(
        err instanceof Error ? err : new Error("Failed to fetch page context")
      );
    } finally {
      setPagesContextLoading(false);
    }
  }, [client]);

  useEffect(() => {
    if (!client) return;

    let unsubscribe: (() => void) | undefined;

    const setupSubscription = async () => {
      try {
        // Subscribe to page context changes
        const result = await client.query("pages.context", {
          subscribe: true,
          onSuccess: (data) => {
            setPagesContext(data);
            setPagesContextLoading(false);
          },
          onError: (err) => {
            console.error("XMC_ITEM_DIFF - Subscription error:", err);
            setPagesContextError(
              err instanceof Error
                ? err
                : new Error("Page context subscription error")
            );
            setPagesContextLoading(false);
          },
        });

        unsubscribe = result.unsubscribe;
      } catch (err) {
        setPagesContextError(
          err instanceof Error
            ? err
            : new Error("Failed to subscribe to page context")
        );
        setPagesContextLoading(false);
      }
    };

    // Fetch initial context and setup subscription
    fetchInitialContext();
    setupSubscription();

    return () => {
      unsubscribe?.();
    };
  }, [client, fetchInitialContext]);

  const value: MarketplaceClientContextType = {
    ...clientState,
    appContext,
    appContextLoading,
    appContextError,
    pagesContext,
    pagesContextLoading,
    pagesContextError,
  };

  return (
    <MarketplaceClientContext.Provider value={value}>
      {children}
    </MarketplaceClientContext.Provider>
  );
}

export function useMarketplaceClientContext() {
  const context = useContext(MarketplaceClientContext);
  if (!context) {
    throw new Error(
      "useMarketplaceClientContext must be used within a MarketplaceClientProvider"
    );
  }
  return context;
}
