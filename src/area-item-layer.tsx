import { MarkerItem } from "@canvaskit-tilemap/core/dist";
import { MarkerLayer } from "@canvaskit-tilemap/react";
import classNames from "classnames";
import { AreaItem } from "./data_pb";
import { getMarkers } from "./store";

// navigator.userAgent.match(/version\/(\d+).+?safari/i);
const isSafari = navigator.userAgent.indexOf("iPhone") != -1;
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

function NormalMarkerLayer({ items, areaItem, underground }: MarkerLayerProps) {
  return (
    <MarkerLayer
      items={items}
      className="p-1"
      cacheKey={`${areaItem.getId()}_${underground}`}
    >
      <div
        className={classNames(
          "w-6 h-6 flex justify-center items-center rounded-full border border-solid border-white bg-gray-700",
          isSafari ? "drop-shadow" : "drop-shadow-sm"
        )}
      >
        <img
          className="w-11/12 h-11/12 object-contain"
          src={`icons/${areaItem.getIcon()}`}
          crossOrigin="anonymous"
        />
      </div>
      {underground && (
        <img
          className="absolute w-3 h-3 bottom-0.5 right-0.5"
          src={require("../images/icon-underground.png")}
        />
      )}
    </MarkerLayer>
  );
}

function BorderlessMarkerLayer({
  items,
  areaItem,
  underground,
}: MarkerLayerProps) {
  return (
    <MarkerLayer
      items={items}
      anchor={[0, 1]}
      cacheKey={`${areaItem.getId()}_${underground}`}
    >
      <div
        className={classNames(
          "flex justify-center items-center",
          areaItem.getName() == "七天神像" ? "w-8 h-8" : "w-7 h-7"
        )}
      >
        <img
          className="w-full h-full object-contain"
          src={`icons/${areaItem.getIcon()}`}
          crossOrigin="anonymous"
        />
      </div>
      {underground && (
        <img
          className="absolute w-3 h-3 bottom-0.5 right-0.5"
          src={require("../images/icon-underground.png")}
        />
      )}
    </MarkerLayer>
  );
}
