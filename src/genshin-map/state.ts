import {
  MarkerItem,
  Tilemap,
  TilemapClickEvent,
} from "@canvaskit-tilemap/core";
import { proxy, ref } from "valtio";
import { proxySet } from "valtio/utils";
import { AreaItem, Marker, UndergroundMap } from "../data_pb";
import { store } from "../store";

export interface AreaItemMarker extends MarkerItem {
  marker: Marker;
  areaItem: AreaItem;
}

export const state = proxy({
  tilemap: null as unknown as Tilemap,
  zoomLevel: 0,
  undergroundEnabled: false,
  activeUndergroundMap: null as UndergroundMap | null,
  teleportVisible: true,
  markedVisible: false,
  activeMarker: null as AreaItemMarker | null,
  marked: proxySet<number>(),
});

export async function onTilemapReady(tilemap: Tilemap) {
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

export function onTilemapClick(event: TilemapClickEvent) {
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

async function init() {
  const marked = localStorage.getItem("marked");
  if (marked) {
    state.marked = proxySet(JSON.parse(marked));
  }
}

init();
