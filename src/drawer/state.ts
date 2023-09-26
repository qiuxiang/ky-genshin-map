import { proxy } from "valtio";
import { proxySet } from "valtio/utils";
import { ItemType } from "../data_pb";

export const state = proxy({
  selected: proxySet<ItemType>(),
  visible: window.innerWidth < 768 ? false : true,
});

export function toggleDrawer() {
  state.visible = !state.visible;
}

export function closeDrawer() {
  state.visible = false;
}
