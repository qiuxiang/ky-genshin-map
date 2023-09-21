import * as core from "@canvaskit-tilemap/core";

class KyApi {
  baseUrl = "https://cloud.yuanshen.site";
  accessToken = "";
  icons: Record<string, any> = {};

  async fetchIcons() {
    let { record } = await this.fetch("icon/get/list", { size: 1e3 });
    for (const i of record) {
      this.icons[i.name] = i;
    }
    return this.icons;
  }

  async fetchItems(params: { areaIdList?: number[]; typeIdList?: number[] }) {
    const { record } = await this.fetch("item/get/list", {
      size: 1e3,
      ...params,
    });
    return record;
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

export const api = new KyApi();
