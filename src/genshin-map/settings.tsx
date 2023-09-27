import { Switch } from "../components/switch";
import {
  state,
  toggleMarkedVisible,
  toggleTeleport,
  toggleUnderground,
} from "./state";

export function Settings() {
  return (
    <div className="absolute bottom-4 left-4 flex flex-col gap-1.5">
      <Switch
        defaultValue={state.undergroundEnabled}
        label="地下地图"
        onChange={toggleUnderground}
      />
      <Switch
        defaultValue={state.teleportVisible}
        label="传送点位"
        onChange={toggleTeleport}
      />
      <Switch
        defaultValue={state.markedVisible}
        label="标记点位"
        onChange={toggleMarkedVisible}
      />
    </div>
  );
}
