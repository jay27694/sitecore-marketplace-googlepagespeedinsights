"use client";

import {
  mdiApplicationOutline,
  mdiCellphone,
  mdiLaptop,
  mdiMagnify,
  mdiOpenInNew,
  mdiSpeedometer,
  mdiText,
} from "@mdi/js";
import { useMarketplaceClientContext } from "../providers/marketplaceClientProvider";
import { ErrorDisplay } from "./ErrorDisplay";
import { LoadingSpinner } from "./LoadingSpinner";
import {
  Heading,
  Text,
  Stack,
  Divider,
  Icon,
  Badge,
  Spinner,
  Flex,
  Button,
  Link,
} from "@chakra-ui/react";
import {
  ExperienceEdgeService,
  PublishedItem,
} from "../services/ExperienceEdgeService";
import { useEffect, useState } from "react";
import { AIAnalysisResponse, LighthouseMetrics } from "../types/globalTypes";
import FunnyLoading from "./FunnyLoading";
import { MarkdownRenderer } from "./MarkdownRenders";
import { AnalysisSection } from "./AnalysisSection";

export type CachedResult = {
  metrics: LighthouseMetrics;
  isActive: boolean;
  aiAnalysis?: AIAnalysisResponse;
};

export default function PageDetails() {
  const { client, pagesContext, pagesContextLoading, pagesContextError } =
    useMarketplaceClientContext();

  const [publishedBadge, setPublishedBadge] = useState("Published");
  const [isEdgeDataLoading, setIsEdgeDataLoading] = useState(true);
  const [publishedItem, setPublishedItem] = useState<
    PublishedItem | undefined
  >();

  const [loadingStrategy, setLoadingStrategy] = useState<
    "desktop" | "mobile" | null
  >(null);
  const [results, setResults] = useState<{ [key: string]: CachedResult }>({});

  useEffect(() => {
    setResults({});
    const pageId = pagesContext?.pageInfo?.id;
    if (!pageId || !client) return;

    const checkPublishedStatus = async () => {
      setIsEdgeDataLoading(true);
      try {
        const service = new ExperienceEdgeService(client);
        await service.initialize(); // must await before calling getPublishedItem
        const item = await service.getPublishedItem(pageId);
        setPublishedBadge(item ? "Published" : "Not Published");
        setPublishedItem(item ? item : undefined);
      } catch (err) {
        console.error("Failed to fetch item:", err);
        setPublishedBadge("Failed to fetch item");
      } finally {
        setIsEdgeDataLoading(false);
      }
    };

    checkPublishedStatus();
  }, [pagesContext?.pageInfo?.id, client]);

  const handleRunPageSpeed = async (strategy: "desktop" | "mobile") => {
    if (!publishedItem?.url?.url) return;

    // If we already have results, just set active
    if (results[strategy]?.metrics) {
      setResults((prev) => ({
        ...Object.fromEntries(
          Object.entries(prev).map(([key, val]) => [
            key,
            { ...val, isActive: key === strategy },
          ])
        ),
      }));
      return;
    }

    try {
      setLoadingStrategy(strategy);

      const response = await fetch("/api/pagespeed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: publishedItem?.url?.url, strategy }),
      });
      const audits: LighthouseMetrics = await response.json();
      if (!audits) return;

      console.log("PageSpeed Audits:", audits);

      const aiRes = await fetch("/api/ai-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audits,
        }),
      });

      const aiResponse: AIAnalysisResponse = await aiRes.json();

      console.log("AI Response:", aiResponse);

      if (!aiResponse) {
        return;
      }

      setResults((prev) => ({
        desktop: {
          metrics: strategy === "desktop" ? audits : prev.desktop?.metrics,
          isActive: strategy === "desktop",
          aiAnalysis: aiResponse,
        },
        mobile: {
          metrics: strategy === "mobile" ? audits : prev.mobile?.metrics,
          isActive: strategy === "mobile",
          aiAnalysis: aiResponse,
        },
      }));
    } catch (error) {
      console.error("Error calling PageSpeed API:", error);
    } finally {
      setLoadingStrategy(null);
    }
  };

  const activeStrategy = Object.entries(results).find(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ([_, val]) => val.isActive
  )?.[0] as "desktop" | "mobile" | undefined;

  if (pagesContextLoading) {
    return (
      <LoadingSpinner message="Initializing Sitecore Marketplace client..." />
    );
  }

  if (pagesContextError) {
    return (
      <ErrorDisplay
        title="Marketplace Connection Error"
        message={pagesContextError?.message}
        details="Failed to initialize the Sitecore Marketplace SDK. Please ensure you're running within the Sitecore environment."
      />
    );
  }

  return (
    <>
      <Flex
        align="center"
        bg="white"
        p={4}
        rounded="md"
        shadow="md"
        gap={2}
        direction={{ base: "column" }}
        width={"80%"}
        mt={4}
      >
        <Heading size="md" mb={4}>
          <Flex align="center">
            <Icon viewBox="0 0 24 24" color="purple.400" w={6} h={6} mr={2}>
              <path d={mdiApplicationOutline} fill="currentColor" />
            </Icon>
            <Text mr={2}>Page Details</Text>

            {isEdgeDataLoading ? (
              <Flex align="center">
                <Spinner ml={2} mr={1} size="xs" />
                <Text fontSize="sm">fetching page details</Text>
              </Flex>
            ) : publishedItem ? (
              <Badge colorScheme="green">{publishedBadge}</Badge>
            ) : (
              <Badge colorScheme="yellow">{publishedBadge}</Badge>
            )}
          </Flex>
        </Heading>
        <Divider mb={4} />

        <Stack spacing={2} position={"relative"} w="full">
          {!isEdgeDataLoading && (
            <>
              <Text>
                <Text as="span" fontWeight="bold">
                  ID:
                </Text>
                {pagesContext?.pageInfo?.id}
              </Text>
              <Text>
                <Text as="span" fontWeight="bold">
                  Path:
                </Text>
                {pagesContext?.pageInfo?.path}
              </Text>
            </>
          )}
          {!isEdgeDataLoading && publishedItem && (
            <>
              <Text>
                <Text as="span" fontWeight="bold">
                  Url:
                </Text>{" "}
                {publishedItem?.url?.url}
              </Text>
              <Link
                href={`https://pagespeed.web.dev/analysis?url=${publishedItem?.url?.url}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Analyze with Google PageSpeed Insights Online
                <Icon viewBox="0 0 24 24" color="blue.500" w={4} h={4} ml={1}>
                  <path d={mdiOpenInNew} fill="currentColor" />
                </Icon>
              </Link>
            </>
          )}
        </Stack>
        <Divider mt={4} />

        {!isEdgeDataLoading && (
          <Flex
            direction={{ base: "row", md: "row" }}
            mt={6}
            gap={4}
            position={"relative"}
            w="full"
            justify="center"
          >
            <Button
              leftIcon={
                loadingStrategy === "desktop" ? (
                  <Spinner size="xs" mr={2} />
                ) : (
                  <Icon viewBox="0 0 24 24">
                    <path d={mdiLaptop} />
                  </Icon>
                )
              }
              variant="outline"
              colorScheme="primary"
              isDisabled={
                publishedBadge !== "Published" || loadingStrategy ? true : false
              }
              onClick={() => handleRunPageSpeed("desktop")}
              isActive={activeStrategy === "desktop" ? true : false}
            >
              Desktop
            </Button>
            <Button
              leftIcon={
                loadingStrategy === "mobile" ? (
                  <Spinner size="xs" mr={2} />
                ) : (
                  <Icon viewBox="0 0 24 24">
                    <path d={mdiCellphone} />
                  </Icon>
                )
              }
              variant="outline"
              colorScheme="primary"
              isDisabled={
                publishedBadge !== "Published" || loadingStrategy ? true : false
              }
              onClick={() => handleRunPageSpeed("mobile")}
              isActive={activeStrategy === "mobile" ? true : false}
            >
              Mobile
            </Button>
          </Flex>
        )}
        {activeStrategy &&
          results[activeStrategy]?.aiAnalysis &&
          !loadingStrategy && (
            <Flex direction="column" w="full" gap={8} p={4}>
              <AnalysisSection title="Summary" iconPath={mdiText}>
                <MarkdownRenderer
                  content={results[activeStrategy].aiAnalysis.summary}
                />
              </AnalysisSection>

              <AnalysisSection title="Performance" iconPath={mdiSpeedometer}>
                <MarkdownRenderer
                  content={results[activeStrategy].aiAnalysis.performance}
                />
              </AnalysisSection>

              <AnalysisSection title="SEO" iconPath={mdiMagnify}>
                <MarkdownRenderer
                  content={results[activeStrategy].aiAnalysis.seo}
                />
              </AnalysisSection>
            </Flex>
          )}
        {loadingStrategy && (
          <>
            <FunnyLoading />
          </>
        )}
      </Flex>
    </>
  );
}
