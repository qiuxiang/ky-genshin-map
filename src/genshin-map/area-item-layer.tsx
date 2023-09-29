import { MarkerItem } from "@canvaskit-tilemap/core";
import { MarkerLayer } from "@canvaskit-tilemap/react";
import classNames from "classnames";
import { AreaItem } from "../data_pb";
import { store } from "../store";

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
const borderlessNames = [...teleportNames, "山洞洞口"];

interface AreaItemLayerProps {
  areaItem: AreaItem;
  hidden?: boolean;
}

export function AreaItemLayer(props: AreaItemLayerProps) {
  const items = [];
  const undergroundItems = [];
  for (const item of getMarkers(props.areaItem)) {
    if (item.marker?.getUnderground()) {
      undergroundItems.push(item);
    } else {
      items.push(item);
    }
  }
  const Component = borderlessNames.includes(props.areaItem.getName())
    ? BorderlessMarkerLayer
    : DefaultMarkerLayer;

  function onClick(item: MarkerItem) {
    console.log(item);
  }

  const commonProps = { ...props, onClick };
  return (
    <>
      {undergroundItems.length > 0 && (
        <Component {...commonProps} items={undergroundItems} underground />
      )}
      {items.length > 0 && <Component {...commonProps} items={items} />}
    </>
  );
}

interface MarkerLayerProps extends AreaItemLayerProps {
  items: MarkerItem[];
  underground?: boolean;
  marked?: boolean;
  onClick: (item: MarkerItem) => void;
}

function DefaultMarkerLayer({
  areaItem,
  underground = false,
  ...props
}: MarkerLayerProps) {
  return (
    <MarkerLayer
      {...props}
      className="p-1"
      cacheKey={`${areaItem.getName()}_${underground}`}
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
          src={require("../../images/icon-underground.png")}
        />
      )}
    </MarkerLayer>
  );
}

function BorderlessMarkerLayer({
  areaItem,
  underground = false,
  ...props
}: MarkerLayerProps) {
  return (
    <MarkerLayer
      {...props}
      anchor={[0, 1]}
      cacheKey={`${areaItem.getName()}_${underground}`}
      zIndex={10}
    >
      <div
        className={classNames(
          "flex justify-center items-center",
          areaItem.getName() == "七天神像" ? "w-9 h-9" : "w-7 h-7"
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
          src={require("../../images/icon-underground.png")}
        />
      )}
    </MarkerLayer>
  );
}

function getMarkers(areaItem: AreaItem) {
  const markerMap = store.mapData.getMarkerMap();
  return areaItem
    .getMarkerList()
    .map((i) => markerMap.get(i))
    .map((i) => ({ x: i!.getX(), y: i!.getY(), marker: i }));
}
