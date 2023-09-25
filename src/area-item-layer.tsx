import { MarkerItem } from "@canvaskit-tilemap/core/dist";
import { MarkerLayer } from "@canvaskit-tilemap/react";
import { AreaItem } from "./data_pb";
import { getMarkers } from "./store";

const teleportNames = [
  "传送锚点",
  "七天神像",
  "秘境",
  "征讨领域",
  "奖励秘境",
  "浪船锚点",
];
const borderless = [...teleportNames, "山洞洞口"];

export function AreaItemLayer({ areaItem }: { areaItem: AreaItem }) {
  const allItems = getMarkers(areaItem);
  const normalItems = [];
  const undergroundItems = [];
  for (const item of allItems) {
    if (item.marker?.getUnderground()) {
      undergroundItems.push(item);
    } else {
      normalItems.push(item);
    }
  }
  if (borderless.includes(areaItem.getName())) {
    return (
      <>
        <BorderlessMarkerLayer
          areaItem={areaItem}
          items={undergroundItems}
          underground
        />
        <BorderlessMarkerLayer areaItem={areaItem} items={normalItems} />
      </>
    );
  } else {
    return (
      <>
        <NormalMarkerLayer
          areaItem={areaItem}
          items={undergroundItems}
          underground
        />
        <NormalMarkerLayer areaItem={areaItem} items={normalItems} />
      </>
    );
  }
}

interface MarkerLayerProps {
  areaItem: AreaItem;
  items: MarkerItem[];
  underground?: boolean;
  marked?: boolean;
}

function NormalMarkerLayer(props: MarkerLayerProps) {
  return (
    <MarkerLayer items={props.items} className="p-1">
      <div className="w-6 h-6 drop-shadow-sm flex justify-center items-center rounded-full border border-solid border-white bg-gray-700">
        <img
          className="w-11/12 h-11/12 object-contain"
          src={`icons/${props.areaItem.getIcon()}`}
          crossOrigin="anonymous"
        />
      </div>
      {props.underground && (
        <img
          className="absolute w-4 h-4 bottom-0 right-0"
          src={require("../images/icon-underground.png")}
        />
      )}
    </MarkerLayer>
  );
}

function BorderlessMarkerLayer(props: MarkerLayerProps) {
  return (
    <MarkerLayer items={props.items}>
      <div className="w-8 h-8 flex justify-center items-center">
        <img
          className="w-full h-full object-contain"
          src={`icons/${props.areaItem.getIcon()}`}
          crossOrigin="anonymous"
        />
      </div>
      {props.underground && (
        <img
          className="absolute w-4 h-4 bottom-0 right-0"
          src={require("../images/icon-underground.png")}
        />
      )}
    </MarkerLayer>
  );
}
