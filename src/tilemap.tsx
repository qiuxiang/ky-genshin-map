import { MarkerLayer, TileLayer, Tilemap } from "@canvaskit-tilemap/react";
import { useSnapshot } from "valtio";
import { getMarkers, store } from "./store";

export function GenshinMap() {
  const { mapData, activeAreaItems } = useSnapshot(store);
  const markerMap = mapData.getMarkerMap();
  const tileOffset: [number, number] = [-5888, -2048];
  return (
    <Tilemap
      className="absolute w-full h-full"
      mapSize={[17408, 17408]}
      origin={[3568 - tileOffset[0], 6286 - tileOffset[1]]}
      maxZoom={1}
    >
      <TileLayer
        minZoom={10}
        maxZoom={13}
        offset={tileOffset}
        getTileUrl={(x, y, z) => {
          return `https://assets.yuanshen.site/tiles_twt40/${z}/${x}_${y}.png`;
        }}
      />
      {[...activeAreaItems.values()].map((areaItem) => {
        return (
          <MarkerLayer items={getMarkers(areaItem)} className="p-1">
            <div className="w-6 h-6 shadow shadow-black flex justify-center items-center rounded-full border border-solid border-white bg-gray-700">
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
