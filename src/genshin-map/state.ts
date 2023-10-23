import { MapClickEvent, MarkerItem, CanvaskitMap } from "@canvaskit-map/core";
import { proxy, ref } from "valtio";
import { proxySet } from "valtio/utils";
import { AreaItem, Marker, UndergroundMap } from "../data_pb";
import { store } from "../store";

export interface AreaItemMarker extends MarkerItem {
  marker: Marker;
  areaItem: AreaItem;
}

export const state = proxy({
  tilemap: null as unknown as CanvaskitMap,
  zoomLevel: 0,
  undergroundEnabled: false,
  activeUndergroundMap: null as UndergroundMap | null,
  teleportVisible: true,
  markedVisible: false,
  activeMarker: null as AreaItemMarker | null,
  marked: proxySet<number>(),
});

export async function onTilemapReady(tilemap: CanvaskitMap) {
  state.tilemap = ref(tilemap);
  onTilemapMove();
}

export async function onTilemapMove() {
  state.zoomLevel = Math.floor(state.tilemap!.zoom);
}

export function toggleMarkedVisible() {
  state.markedVisible = !state.markedVisible;
}

export function toggleUnderground() {
  state.undergroundEnabled = !state.undergroundEnabled;
}

export function toggleTeleport() {
  state.teleportVisible = !state.teleportVisible;
}

export function onTilemapClick(event: MapClickEvent) {
  if (!event.markerItem) {
    state.activeMarker = null;
    state.activeUndergroundMap = null;
    console.log("onClick", event.coordinate);
  }
}

export function activateMarker(marker: AreaItemMarker) {
  state.activeMarker = ref(marker);
  const underground = marker?.marker.getUnderground();
  if (underground) {
    for (const item of store.mapData.getUndergroundMapList()) {
      const active = item.getChildList().find((i) => i.getId() == underground);
      if (active) {
        state.activeUndergroundMap = ref(active);
        break;
      }
    }
  } else {
    state.activeUndergroundMap = null;
  }
}

export function mark(marker: Marker) {
  state.marked.add(marker.getId());
  localStorage.setItem("marked", JSON.stringify([...state.marked]));
}

export function unmark(marker: Marker) {
  state.marked.delete(marker.getId());
  localStorage.setItem("marked", JSON.stringify([...state.marked]));
}

export function exportData() {
  const blob = new Blob([JSON.stringify([...state.marked])]);
  const link = document.createElement("a");
  link.style.display = "none";
  link.href = URL.createObjectURL(blob);
  link.download = `${new Date().toLocaleString()}.json`;
  link.click();
}

export function importData() {
  const input = document.createElement("input");
  input.style.display = "none";
  input.type = "file";
  input.click();
  input.onchange = ({ target }) => {
    const { files } = target as HTMLInputElement;
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        const data = JSON.parse(reader.result as string);
        if (state.marked.size > 0 && !confirm("是否覆盖当前数据")) {
          return;
        }
        state.marked = proxySet(data);
        localStorage.setItem("marked", JSON.stringify([...state.marked]));
      };
      reader.readAsText(files[0]);
    }
  };
}

async function init() {
  const marked = localStorage.getItem("marked");
  if (marked) {
    state.marked = proxySet(JSON.parse(marked));
  }
}

init();
