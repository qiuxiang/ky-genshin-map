import { api, Marker } from "./api";
import {
  initCanvaskit,
  MarkerLayer,
  TileLayer,
  Tilemap,
} from "@canvaskit-tilemap/react";
import { useEffect, useState } from "react";

export function Main() {
  const [loading, setLoading] = useState(true);
  const [markers, setMarkers] = useState<Marker[]>([]);

  useEffect(() => {
    initCanvaskit().then(() => setLoading(false));
    api
      .fetchMarkers({
        areaIdList: [6, 17, 2, 3, 12, 13, 14, 19, 21, 22, 23, 28],
        typeIdList: [5],
      })
      .then(setMarkers);
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
      {markers.map((i) => {
        return (
          <MarkerLayer items={i.items} className="p-1">
            <div className="w-6 h-6 shadow shadow-black flex justify-center items-center rounded-full border border-solid border-white bg-gray-700">
              <img
                className="w-11/12 h-11/12 object-cover"
                src={i.icon}
                crossOrigin=""
              />
            </div>
          </MarkerLayer>
        );
      })}
    </Tilemap>
  );
}
