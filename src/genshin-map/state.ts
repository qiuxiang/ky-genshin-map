import { Tilemap } from "@canvaskit-tilemap/core";
import { proxy, ref } from "valtio";

export const state = proxy({
  tilemap: null as unknown as Tilemap,
  zoom: 0,
});

export async function onTilemapReady(tilemap: Tilemap) {
  state.tilemap = ref(tilemap);
  onTilemapMove();
}

export async function onTilemapMove() {
  state.zoom = state.tilemap!.zoom;
}
