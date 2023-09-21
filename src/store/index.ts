import { initCanvaskit } from "@canvaskit-tilemap/core/dist";
import { proxy, ref } from "valtio";
import { proxySet } from "valtio/utils";
import { Area, AreaItem, MapData } from "../data_pb";

export const store = proxy({
  drawerVisible: false,
  mapData: null as unknown as MapData,
  areaItems: {} as Record<string, AreaItem[]>,
  activeAreaItems: proxySet<AreaItem>(),
  activeTopArea: null as unknown as Area,
  activeSubArea: null as unknown as Area,
  isAreaPickerOpen: false,
});

document.body.addEventListener("click", ({ target }) => {
  if ((target as HTMLElement).tagName == "CANVAS") {
    closeAreaPicker();
  }
});

export async function initStore() {
  const [response] = await Promise.all([fetch("data.bin"), initCanvaskit()]);
  const buffer = await response.arrayBuffer();
  store.mapData = ref(MapData.deserializeBinary(new Uint8Array(buffer)));
  activateArea(store.mapData.getAreaList()[0]);
}

export function toggleDrawer() {
  store.drawerVisible = !store.drawerVisible;
}

export function closeDrawer() {
  store.drawerVisible = false;
}

export function toggleAreaPicker() {
  store.isAreaPickerOpen = !store.isAreaPickerOpen;
}

export function closeAreaPicker() {
  store.isAreaPickerOpen = false;
}

export function activateArea(area: Area) {
  const areaList = store.mapData.getAreaList();

  for (const topArea of areaList) {
    if (topArea == area) {
      store.activeTopArea = ref(area);
      store.activeSubArea = ref(area.getChildList()[0]);
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
  updateItems();
}

function updateItems() {
  store.areaItems = {};
  const itemMap = store.mapData.getItemMap();
  for (const itemId of store.activeSubArea.getItemList()) {
    const item = itemMap.get(itemId)!;
    for (const typeId of item.getTypeList()) {
      if (!store.areaItems[typeId]) {
        store.areaItems[typeId] = [];
      }
      store.areaItems[typeId].push(ref(item));
    }
  }
}

export function toggleAreaItem(areaItem: AreaItem) {
  if (store.activeAreaItems.has(areaItem)) {
    store.activeAreaItems.delete(areaItem);
  } else {
    store.activeAreaItems.add(ref(areaItem));
  }
}
