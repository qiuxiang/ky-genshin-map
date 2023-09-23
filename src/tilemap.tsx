import { MarkerLayer, TileLayer, Tilemap } from "@canvaskit-tilemap/react";
import { useSnapshot } from "valtio";
import { getMarkers, store } from "./store";

export function GenshinMap() {
  const { activeAreaItems, mapInfo } = useSnapshot(store);
  return (
    <Tilemap
      className="absolute w-full h-full"
      mapSize={[mapInfo.getWidth(), mapInfo.getHeight()]}
      origin={[mapInfo.getOriginX(), mapInfo.getOriginY()]}
      maxZoom={1}
    >
      <TileLayer
        minZoom={10}
        maxZoom={13}
        offset={[mapInfo.getTileOffsetX(), mapInfo.getTileOffsetY()]}
        getTileUrl={(x, y, z) => {
          return `https://assets.yuanshen.site/tiles_twt40/${z}/${x}_${y}.png`;
        }}
      />
      {[...activeAreaItems.values()].map((areaItem) => {
        return (
          <MarkerLayer
            key={areaItem.getId()}
            items={getMarkers(areaItem)}
            className="p-1"
          >
            <div className="w-6 h-6 drop-shadow-sm flex justify-center items-center rounded-full border border-solid border-white bg-gray-700">
              <img
                className="w-11/12 h-11/12 object-cover"
                src={`icons/${areaItem.getIcon()}`}
                crossOrigin="anonymous"
              />
            </div>
          </MarkerLayer>
        );
      })}
    </Tilemap>
  );
}
