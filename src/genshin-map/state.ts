import {
  MarkerItem,
  Tilemap,
  TilemapClickEvent,
} from "@canvaskit-tilemap/core";
import { proxy, ref } from "valtio";
import { proxySet } from "valtio/utils";
import { AreaItem, Marker } from "../data_pb";

export interface AreaItemMarker extends MarkerItem {
  marker: Marker;
  areaItem: AreaItem;
}

export interface UndergroundMapChunk {
  bounds: number[][];
  value: string;
  url?: string;
}

export interface UndergroundMapOverlay {
  label: string;
  value: string;
  chunks?: UndergroundMapChunk[];
  children: UndergroundMapOverlay[];
}

export interface UndergroundMap {
  overlays: UndergroundMapOverlay[];
  urlTemplate: string;
}

export const state = proxy({
  tilemap: null as unknown as Tilemap,
  zoom: 0,
  undergroundEnabled: false,
  teleportVisible: true,
  markedVisible: false,
  activeMarker: null as AreaItemMarker | null,
  marked: proxySet<number>(),
  undergroundMaps: [] as UndergroundMap[],
});

export async function onTilemapReady(tilemap: Tilemap) {
  state.tilemap = ref(tilemap);
  onTilemapMove();
}

export async function onTilemapMove() {
  state.zoom = Math.floor(state.tilemap!.zoom);
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
    console.log(event.coordinate);
  }
}

export function activateMarker(marker: AreaItemMarker) {
  state.activeMarker = ref(marker);
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
  const response = await fetch("https://assets.yuanshen.site/web-map.json");
  const { plugins } = await response.json();
  state.undergroundMaps = ref(
    Object.values(plugins)
      .filter((i: any) => i.extra[0] == "underground")
      .map((i: any) => i.overlayConfig)
      .filter((i) => i)
  );
}

init();
