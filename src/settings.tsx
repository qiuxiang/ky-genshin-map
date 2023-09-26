import { Switch } from "./components/switch";
import {
  store,
  toggleMarkedVisible,
  toggleUnderground,
  toggleTeleport,
} from "./store";

export function Settings() {
  return (
    <div className="absolute bottom-4 left-4 flex flex-col gap-1.5">
      <Switch
        defaultValue={store.undergroundEnabled}
        label="地下地图"
        onChange={toggleUnderground}
      />
      <Switch
        defaultValue={store.teleportVisible}
        label="传送点位"
        onChange={toggleTeleport}
      />
      <Switch
        defaultValue={store.markedVisible}
        label="标记点位"
        onChange={toggleMarkedVisible}
      />
    </div>
  );
}
