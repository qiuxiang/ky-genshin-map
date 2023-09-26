import { TileLayer, Tilemap, TilemapContext } from "@canvaskit-tilemap/react";
import { useContext } from "react";
import { useSnapshot } from "valtio";
import { AreaItemLayer } from "./area-item-layer";
import { AreaItem } from "./data_pb";
import { onTilemapMove, onTilemapReady, store } from "./store";

export function GenshinMap() {
  const { activeAreaItems, mapInfo } = useSnapshot(store);
  return (
    <Tilemap
      className="absolute w-full h-full"
      mapSize={[mapInfo.getWidth(), mapInfo.getHeight()]}
      origin={[mapInfo.getOriginX(), mapInfo.getOriginY()]}
      maxZoom={1}
      onMove={onTilemapMove}
      onReady={onTilemapReady}
    >
      <TileLayer
        minZoom={10}
        maxZoom={13}
        offset={[mapInfo.getTileOffsetX(), mapInfo.getTileOffsetY()]}
        getTileUrl={(x, y, z) => {
          return `https://assets.yuanshen.site/tiles_${mapInfo.getId()}/${z}/${x}_${y}.png`;
        }}
      />
      {[...activeAreaItems.values()].map((areaItem) => {
        return <AreaItemLayer key={areaItem.getId()} areaItem={areaItem} />;
      })}
      <TeleportLayer />
    </Tilemap>
  );
}

function TeleportLayer() {
  const tilemapContext = useContext(TilemapContext)!;
  console.log(tilemapContext.zoom);
  const { mapInfo, teleportVisible, mapData } = useSnapshot(store);
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

  if (teleportVisible) {
    return (
      <>
        {statues.map((i) => (
          <AreaItemLayer key={i.getId()} areaItem={i} />
        ))}
      </>
    );
  }

  return null;
}
