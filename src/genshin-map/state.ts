import { Tilemap } from "@canvaskit-tilemap/core";
import { proxy, ref } from "valtio";

export const state = proxy({
  tilemap: null as unknown as Tilemap,
  zoom: 0,
  undergroundEnabled: false,
  teleportVisible: true,
  markedVisible: false,
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
