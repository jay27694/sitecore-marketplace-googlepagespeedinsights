export type LighthouseMetrics = {
  performance?: {
    "cumulative-layout-shift"?: object;
    "largest-contentful-paint"?: object;
    "speed-index"?: object;
    "total-blocking-time"?: object;
    "first-contentful-paint"?: object;
  };
  seo?: {
    "is-crawlable"?: object;
    "robots-txt"?: object;
    "font-size"?: object;
    "tap-targets"?: object;
    hreflang?: object;
    canonical?: object;
    "structured-data"?: object;
    "crawlable-anchors"?: object;
    "document-title"?: object;
    "meta-description"?: object;
    "http-status-code"?: object;
    "image-alt"?: object;
    "link-text"?: object;
  };
};

export type AIAnalysisResponse = {
  performance: string;
  seo: string;
  summary: string;
};
