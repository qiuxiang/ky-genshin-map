import { useMemo } from "react";
import { useSnapshot } from "valtio";
import { AreaItem } from "../data_pb";
import { store } from "../store";
import { AreaItemLayer } from "./area-item-layer";
import { state } from "./state";

export function TeleportLayer() {
  const { mapInfo, mapData } = useSnapshot(store);
  const { teleportVisible } = useSnapshot(state);
  const { zoom } = useSnapshot(state);
  const itemMap = mapData.getItemMap();
  const allTeleports = mapInfo.getTeleportList().map((i) => itemMap.get(i)!);
  const teleports = [] as AreaItem[];
  const statues = [] as AreaItem[];
  for (const i of allTeleports) {
    if (i.getName() == "七天神像") {
      statues.push(i);
    } else {
      teleports.push(i);
    }
  }

  const statuesLayer = useMemo(() => {
    return statues.map((i) => <AreaItemLayer key={i.getId()} areaItem={i} />);
  }, []);

  const teleportsLayer = useMemo(() => {
    return teleports.map((i) => (
      <AreaItemLayer key={i.getId()} areaItem={i} hidden={zoom < -3} />
    ));
  }, [zoom < -3]);

  if (teleportVisible) {
    return (
      <>
        {statuesLayer}
        {teleportsLayer}
      </>
    );
  }

  return null;
}