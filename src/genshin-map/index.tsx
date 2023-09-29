import { MarkerLayer, TileLayer, Tilemap } from "@canvaskit-tilemap/react";
import { useSnapshot } from "valtio";
import { store } from "../store";
import { AreaItemLayer, bottomCenterAnchor } from "./area-item-layer";
import { Settings } from "./settings";
import { onTilemapClick, onTilemapMove, onTilemapReady, state } from "./state";
import { TeleportLayer } from "./teleport-layer";

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
      <TeleportLayer />
      <ActiveMarkerLayer />
    </Tilemap>
  );
}

/**
 * 渲染当前选中的点位
 */
function ActiveMarkerLayer() {
  const { activeMarker } = useSnapshot(state);
  const image = (
    <img class="w-4 block" src={require("../../images/active-marker.png")} />
  );
  return (
    <>
      <MarkerLayer items={[]} cacheKey="activeMarker">
        {image}
      </MarkerLayer>
      {activeMarker && (
        <MarkerLayer
          items={[activeMarker]}
          anchor={bottomCenterAnchor}
          zIndex={20}
          cacheKey="activeMarker"
        >
          {image}
        </MarkerLayer>
      )}
    </>
  );
}
