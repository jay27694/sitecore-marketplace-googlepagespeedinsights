import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const system = `You are an AI that analyzes Google PageSpeed API JSON data. You are expected to produce structured analysis in **markdown table** and a markdown summary.`;
    const prompt = `
    Analyze the following Google PageSpeed API JSON data and produce a markdown table and a summary:

    Requirements:
    1. create performance and seo tables with columns:
    | Metric | Score | Status | Notes/Suggestions |
    2. Use emojis for Status (🟢 green, 🟠 orange, 🔴 red)    
    3. Notes/Suggestions should be concise and actionable.
    4. Finally, provide a concise summary of the overall performance and SEO status in markdown format.

    JSON Data:
    ${JSON.stringify(data)}

    JSON Data explanation:
    "performance" object contains key performance metrics such as:
    - "cumulative-layout-shift": Measures visual stability.
    - "largest-contentful-paint": Time taken to render the largest content element.
    - "speed-index": How quickly content is visually displayed.
    - "total-blocking-time": Total time the main thread was blocked.
    - "first-contentful-paint": Time taken to render the first piece of DOM content
    "seo" object contains key SEO metrics such as:
    - "is-crawlable": Checks if the page is crawlable by search engines.
    - "robots-txt": Validates the presence and correctness of the robots.txt file.
    - "font-size": Ensures font sizes are legible on all devices.
    - "tap-targets": Checks if tap targets are appropriately sized.
    - "hreflang": Validates hreflang attributes for multilingual sites.
    - "canonical": Checks for the presence of canonical tags.
    - "structured-data": Validates the presence and correctness of structured data.
    - "crawlable-anchors": Ensures anchor links are crawlable.
    - "document-title": Checks for the presence and relevance of the document title.
    - "meta-description": Validates the presence and relevance of meta descriptions.
    - "http-status-code": Checks for valid HTTP status codes.
    - "image-alt": Ensures images have appropriate alt text.
    - "link-text": Validates the presence and relevance of link text.

    
    Output format:
    {
      "performance": "markdown table as string for performance metrics",
      "seo": "markdown table as string for seo metrics",
      "summary": "concise markdown summary"
    };`;

    const openai = createOpenAI();

    const { text } = await generateText({
      model: openai("gpt-5"),
      system,
      prompt,
    });

    const parsed = JSON.parse(text);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("PageSpeed API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
