/**
 * 全局状态
 */
import initCanvaskit, { CanvasKit } from "canvaskit-wasm";
import { decompress } from "fflate";
import { proxy, ref } from "valtio";
import { proxySet } from "valtio/utils";
import { Area, AreaItem, MapData, MapInfo } from "./data_pb";

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
      "https://ky-genshin-map-1253179036.cos.ap-nanjing.myqcloud.com/data-4.2.0.gz"
    ),
    initCanvaskit({
      locateFile() {
        return "https://cdn.bootcdn.net/ajax/libs/canvaskit-wasm/0.38.2/canvaskit.wasm";
      },
    }),
  ]);
  decompress(new Uint8Array(await response.arrayBuffer()), (_, data) => {
    store.canvaskit = ref(canvaskit);
    store.mapData = ref(MapData.deserializeBinary(data));
    activateArea(store.mapData.getAreaList()[0]);
    store.mapInfo = ref(
      store.mapData.getMapInfoMap().get(store.activeTopArea.getMapId())!
    );
  });
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
