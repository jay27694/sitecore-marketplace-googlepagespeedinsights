import {
  ApplicationContext,
  ClientSDK,
} from "@sitecore-marketplace-sdk/client";

export interface PublishedItem {
  id: string;
  name: string;
  path: string;
  displayName: string;
  url: {
    url: string;
  };
}

export class ExperienceEdgeService {
  private client: ClientSDK;
  private liveContextId: string = "";
  private applicationContext: ApplicationContext | null = null;

  constructor(client: ClientSDK) {
    this.client = client;
  }

  async initialize(): Promise<void> {
    try {
      const { data } = await this.client.query("application.context");
      this.applicationContext = data || null;
      this.liveContextId = this.getLiveContextId() || "";
    } catch (error) {
      console.log("initialize error", error);
      throw error;
    }
  }

  private getLiveContextId(): string | null {
    if (!this.applicationContext?.resourceAccess?.length) return null;
    const firstResource = this.applicationContext.resourceAccess[0];
    return firstResource?.context?.live || null;
  }

  async getPublishedItem(
    itemId: string,
    language: string = "en"
  ): Promise<PublishedItem | null> {
    if (!this.liveContextId) {
      throw new Error(
        "ExperienceEdgeService not initialized. Call initialize() first."
      );
    }

    try {
      const { data } = await this.client.mutate("xmc.live.graphql", {
        params: {
          query: { sitecoreContextId: this.liveContextId },
          body: {
            query: `
              query GetPublishedItem($itemId: String!, $language: String!) {
                item(path: $itemId, language: $language) {
                  id
                  name
                  path
                  displayName
                  url {
                    url
                  }
                }
              }
            `,
            variables: { itemId, language },
          },
        },
      });

      return (data?.data?.item as PublishedItem) || null;
    } catch {
      return null;
    }
  }
}
