import * as core from "@canvaskit-tilemap/core";

class KyApi {
  baseUrl = "https://cloud.yuanshen.site";
  accessToken = "";
  icons: Record<string, any> = {};

  constructor() {
    this.fetchIcons();
  }

  async fetchIcons() {
    let { record } = await this.fetch("icon/get/list", { size: 1e3 });
    for (const i of record) {
      this.icons[i.name] = i;
    }
  }

  async fetchItems(params: { areaIdList: number[]; typeIdList: number[] }) {
    const { record } = await this.fetch("item/get/list", {
      size: 1e3,
      ...params,
    });
    return record;
  }

  async fetchMarkers(params: { areaIdList: number[]; typeIdList: number[] }) {
    const items = await this.fetchItems(params);
    const allMarkers = await this.fetch("marker/get/list_byinfo", {
      itemIdList: items.map((i: any) => i.id),
    });
    const markersMap: Record<string, any> = {};
    for (const marker of allMarkers) {
      const position = marker.position
        .split(",")
        .map((i: string) => parseFloat(i));
      marker.coordinate = { x: position[0], y: position[1] };
      const { iconTag } = marker.itemList[0];
      const markers = markersMap[iconTag];
      if (markers) {
        markers.push(marker);
      } else {
        markersMap[iconTag] = [marker];
      }
    }
    return Object.keys(markersMap).map((name) => {
      const markers = markersMap[name];
      return {
        icon: this.icons[name].url,
        items: markers.map((i: any) => ({
          ...i.coordinate,
          title: i.markerTitle,
          content: i.content,
        })),
      };
    });
  }

  async fetch(path: string, params: Record<string, any> = {}): Promise<any> {
    if (!this.accessToken) {
      await this.fetchAccessToken();
    }
    const response = await fetch(`${this.baseUrl}/api/${path}`, {
      method: "post",
      body: JSON.stringify(params),
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${this.accessToken}`,
      },
    });
    if (response.status == 401) {
      await this.fetchAccessToken();
      return this.fetch(path, params);
    }
    return (await response.json())["data"];
  }

  async fetchAccessToken() {
    const headers = { authorization: "Basic Y2xpZW50OnNlY3JldA==" };
    const response = await fetch(
      `${this.baseUrl}/oauth/token?scope=all&grant_type=client_credentials`,
      { method: "post", headers }
    );
    this.accessToken = (await response.json())["access_token"];
  }
}

export interface Marker {
  icon: string;
  items: MarkerItem[];
}

export interface MarkerItem extends core.MarkerItem {
  title: string;
  content: string;
}

export const api = new KyApi();
