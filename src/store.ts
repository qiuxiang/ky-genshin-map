/**
 * 全局状态
 */
import initCanvaskit, { CanvasKit } from "canvaskit-wasm";
import { proxy, ref } from "valtio";
import { proxySet } from "valtio/utils";
import { Area, AreaItem, MapData, MapInfo } from "./data_pb";

export const isApp = navigator.userAgent.includes("app");
export const store = proxy({
  canvaskit: null as unknown as CanvasKit,
  mapData: null as unknown as MapData,
  mapInfo: null as unknown as MapInfo,
  areaItems: {} as Record<string, Record<string, AreaItem[]>>,
  activeAreaItems: proxySet<AreaItem>(),
  activeTopArea: null as unknown as Area,
  activeSubArea: null as Area | null,
});

async function init() {
  const [response, canvaskit] = await Promise.all([
    fetch(
      location.protocol == "http:"
        ? "http://ky-genshin-map.test.upcdn.net/data.txt"
        : require("./data.txt")
    ),
    initCanvaskit({
      locateFile() {
        return "https://cdn.staticfile.org/canvaskit-wasm/0.38.2/canvaskit.wasm";
      },
    }),
  ]);
  store.canvaskit = ref(canvaskit);
  const buffer = await response.arrayBuffer();
  store.mapData = ref(MapData.deserializeBinary(new Uint8Array(buffer)));
  activateArea(store.mapData.getAreaList()[0]);
  store.mapInfo = ref(
    store.mapData.getMapInfoMap().get(store.activeTopArea.getMapId())!
  );
}

init();

export function activateArea(area: Area) {
  const areaList = store.mapData.getAreaList();

  for (const topArea of areaList) {
    if (topArea == area) {
      store.activeTopArea = ref(area);
      store.activeSubArea = null;
      break;
    } else {
      const subArea = topArea.getChildList().find((i) => i == area);
      if (subArea) {
        store.activeTopArea = ref(topArea);
        store.activeSubArea = ref(area);
        break;
      }
    }
  }
  updateMapInfo(area);
  updateAreaItems();
}

function updateMapInfo(area: Area) {
  if (!store.mapInfo) return;

  const mapId = area.getMapId();
  if (store.mapInfo.getId() != mapId) {
    store.mapInfo = ref(store.mapData.getMapInfoMap().get(mapId)!);
    store.activeAreaItems = proxySet();
  }
}

function updateAreaItems() {
  store.areaItems = {};
  if (store.activeSubArea) {
    updateSubAreaItems(store.activeSubArea);
  } else {
    for (const area of store.activeTopArea.getChildList()) {
      if (area.getMapId() == store.activeTopArea.getMapId()) {
        updateSubAreaItems(area);
      }
    }
  }
}

function updateSubAreaItems(subArea: Area) {
  const itemMap = store.mapData.getItemMap();
  const { areaItems } = store;
  for (const itemId of subArea.getItemList()) {
    const item = itemMap.get(itemId)!;
    for (const typeId of item.getTypeList()) {
      const icon = item.getIcon();
      if (!areaItems[typeId]) {
        areaItems[typeId] = {};
      }
      if (!areaItems[typeId][icon]) {
        areaItems[typeId][icon] = [];
      }
      areaItems[typeId][icon].push(ref(item));
    }
  }
}

export function activateAreaItem(areaItem: AreaItem) {
  store.activeAreaItems.add(ref(areaItem));
}

export function inactivateAreaItem(areaItem: AreaItem) {
  store.activeAreaItems.delete(ref(areaItem));
}
