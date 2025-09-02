import { LighthouseMetrics } from "@/app/types/globalTypes";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url, strategy } = await req.json();

    if (!url || !strategy) {
      return NextResponse.json(
        { error: "Missing url or strategy" },
        { status: 400 }
      );
    }

    const apiKey = process.env.PAGESPEED_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not set" }, { status: 500 });
    }

    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
      url
    )}&strategy=${strategy}&key=${apiKey}&category=performance&category=seo`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    const audits = data.lighthouseResult?.audits;
    if (!audits) return;

    const extracted: LighthouseMetrics = {
      performance: {
        "cumulative-layout-shift": audits["cumulative-layout-shift"],
        "largest-contentful-paint": audits["largest-contentful-paint"],
        "speed-index": audits["speed-index"],
        "total-blocking-time": audits["total-blocking-time"],
        "first-contentful-paint": audits["first-contentful-paint"],
      },
      seo: {
        "is-crawlable": audits["is-crawlable"],
        "robots-txt": audits["robots-txt"],
        "font-size": audits["font-size"],
        "tap-targets": audits["tap-targets"],
        hreflang: audits["hreflang"],
        canonical: audits["canonical"],
        "structured-data": audits["structured-data"],
        "crawlable-anchors": audits["crawlable-anchors"],
        "document-title": audits["document-title"],
        "meta-description": audits["meta-description"],
        "http-status-code": audits["http-status-code"],
        "image-alt": audits["image-alt"],
        "link-text": audits["link-text"],
      },
    };

    return NextResponse.json(extracted);
  } catch (error) {
    console.error("PageSpeed API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
