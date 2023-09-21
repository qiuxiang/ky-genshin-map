import {
  initCanvaskit,
  MarkerLayer,
  TileLayer,
  Tilemap,
} from "@canvaskit-tilemap/react";
import { useEffect, useState } from "react";
import { MapData, Marker } from "./data_pb";

export function Main() {
  const [loading, setLoading] = useState(true);
  const [markers, setMarkers] = useState<Record<number, Marker[]>>([]);

  useEffect(() => {
    initCanvaskit().then(() => setLoading(false));
    fetch("data.bin").then(async (response) => {
      const buffer = await response.arrayBuffer();
      const mapData = MapData.deserializeBinary(new Uint8Array(buffer));
      const itemMap = mapData.getItemMap();
      const markerMap = mapData.getMarkerMap();
      const markers = {} as Record<number, Marker[]>;
      for (const topArea of mapData.getAreaList()) {
        for (const area of topArea.getChildList()) {
          for (const itemId of area.getItemList()) {
            const areaItem = itemMap.get(itemId)!;
            if (areaItem.getTypeList()[0] != 5) {
              continue;
            }

            const icon = areaItem.getIcon();
            if (!markers[icon]) {
              markers[icon] = [];
            }
            for (const markerId of areaItem.getMarkerList()) {
              markers[icon].push(markerMap.get(markerId)!);
            }
          }
        }
      }
      setMarkers(markers);
    });
  }, []);

  if (loading) {
    return null;
  }

  const tileOffset: [number, number] = [-5888, -2048];
  return (
    <Tilemap
      className="absolute w-full h-full left-0 top-0"
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
      {Object.keys(markers).map((i) => {
        const items = markers[parseInt(i)];
        return (
          <MarkerLayer
            items={items.map((i) => ({ x: i.getX(), y: i.getY() }))}
            className="p-1"
          >
            <div className="w-6 h-6 shadow shadow-black flex justify-center items-center rounded-full border border-solid border-white bg-gray-700">
              <img
                className="w-11/12 h-11/12 object-cover"
                src={`icons/${i}`}
                crossOrigin=""
              />
            </div>
          </MarkerLayer>
        );
      })}
    </Tilemap>
  );
}
