import {
  MarkerItem,
  Tilemap,
  TilemapClickEvent,
} from "@canvaskit-tilemap/core";
import { proxy, ref } from "valtio";
import { AreaItem, Marker } from "../data_pb";

export interface AreaItemMarker extends MarkerItem {
  marker: Marker;
  areaItem: AreaItem;
}

export const state = proxy({
  tilemap: null as unknown as Tilemap,
  zoom: 0,
  undergroundEnabled: false,
  teleportVisible: true,
  markedVisible: false,
  activeMarker: null as AreaItemMarker | null,
});

export async function onTilemapReady(tilemap: Tilemap) {
  state.tilemap = ref(tilemap);
  onTilemapMove();
}

export async function onTilemapMove() {
  state.zoom = state.tilemap!.zoom;
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
  }
}

export function activateMarker(marker: AreaItemMarker) {
  state.activeMarker = ref(marker);
}
