import { TileLayer, Tilemap } from "@canvaskit-tilemap/react";
import { useSnapshot } from "valtio";
import { store } from "../store";
import { ActiveMarkerLayer } from "./active-marker-layer";
import { AreaItemLayer } from "./area-item-layer";
import { AreaNamesLayer } from "./area-names-layer";
import { Settings } from "./settings";
import { onTilemapClick, onTilemapMove, onTilemapReady } from "./state";
import { TeleportLayer } from "./teleport-layer";
import { UndergroundLayer } from "./underground-layer";

export const zIndex = {
  underground: 10,
  marker: 20,
  activeMarker: 30,
};

export function GenshinMap() {
  const { activeAreaItems, mapInfo } = useSnapshot(store);
  return (
    <Tilemap
      key={mapInfo.getId()}
      className="absolute w-full h-full"
      mapSize={[mapInfo.getWidth(), mapInfo.getHeight()]}
      origin={[mapInfo.getOriginX(), mapInfo.getOriginY()]}
      maxZoom={1}
      onMove={onTilemapMove}
      onReady={onTilemapReady}
      onClick={onTilemapClick}
    >
      <Settings />
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
      <ActiveMarkerLayer />
      <UndergroundLayer />
      <TeleportLayer />
      <AreaNamesLayer />
    </Tilemap>
  );
}
