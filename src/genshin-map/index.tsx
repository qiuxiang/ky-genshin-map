import { TileLayer, CanvaskitMap } from "@canvaskit-map/react";
import { CanvasKit } from "canvaskit-wasm";
import { useSnapshot } from "valtio";
import { store } from "../store";
import { ActiveMarkerLayer } from "./active-marker-layer";
import { AreaItemLayer } from "./area-item-layer";
import { AreaNamesLayer } from "./area-names-layer";
import { Settings } from "./settings";
import { ShadowLayer } from "./shadow-layer";
import { onTilemapClick, onTilemapMove, onTilemapReady } from "./state";
import { TeleportLayer } from "./teleport-layer";
import { UndergroundLayer } from "./underground-layer";

export const zIndex = {
  underground: 10,
  marker: 20,
  activeMarker: 30,
};

export function GenshinMap() {
  const { activeAreaItems, mapInfo, canvaskit } = useSnapshot(store);
  return (
    <CanvaskitMap
      key={mapInfo.getId()}
      canvaskit={canvaskit as CanvasKit}
      className="absolute w-full h-full bg-gray-900"
      size={[mapInfo.getWidth(), mapInfo.getHeight()]}
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
      <ShadowLayer />
    </CanvaskitMap>
  );
}
