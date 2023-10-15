import { MarkerLayer } from "@canvaskit-tilemap/react";
import classNames from "classnames";
import { useMemo } from "react";
import { useSnapshot } from "valtio";
import { zIndex } from ".";
import { AreaItem } from "../data_pb";
import { store } from "../store";
import { activateMarker, AreaItemMarker, state } from "./state";

const isSafari = navigator.userAgent.includes("iPhone");
const teleportNames = [
  "传送锚点",
  "七天神像",
  "秘境",
  "征讨领域",
  "奖励秘境",
  "浪船锚点",
];
export const borderlessNames = [...teleportNames, "山洞洞口"];

interface AreaItemLayerProps {
  areaItem: AreaItem;
  hidden?: boolean;
}

export const bottomCenterAnchor = [0, 1] as [number, number];

// TODO: 这里的冗余代码有点多，需要优化
export function AreaItemLayer(props: AreaItemLayerProps) {
  const { activeMarker, marked, markedVisible, activeUndergroundMap } =
    useSnapshot(state);
  const items = useMemo(() => {
    const items = {
      default: [] as AreaItemMarker[],
      underground: [] as AreaItemMarker[],
      activeUnderground: [] as AreaItemMarker[],
    };
    const activeUnderground = activeUndergroundMap?.getId();
    for (const item of getMarkers(props.areaItem)) {
      if (item.marker == activeMarker?.marker) {
        continue;
      }
      if (!markedVisible && marked.has(item.marker.getId())) {
        continue;
      }
      const underground = item.marker?.getUnderground();
      if (underground) {
        if (underground == activeUnderground) {
          items.activeUnderground.push(item);
        } else {
          items.underground.push(item);
        }
      } else {
        items.default.push(item);
      }
    }
    return items;
  }, [
    activeMarker?.areaItem == props.areaItem && activeMarker,
    markedVisible,
    activeUndergroundMap,
  ]);

  const commonProps = { ...props, onClick: activateMarker };
  const Component = borderlessNames.includes(props.areaItem.getName())
    ? BorderlessMarkerLayer
    : DefaultMarkerLayer;

  return (
    <>
      {items.underground.length > 0 && (
        <Component {...commonProps} items={items.underground} underground />
      )}
      {items.activeUnderground.length > 0 && (
        <Component
          {...commonProps}
          items={items.activeUnderground}
          activeUnderground
        />
      )}
      {items.default.length > 0 && (
        <Component {...commonProps} items={items.default} />
      )}
    </>
  );
}

interface MarkerLayerProps extends AreaItemLayerProps {
  items: AreaItemMarker[];
  underground?: boolean;
  activeUnderground?: boolean;
  onClick: (item: AreaItemMarker) => void;
}

function DefaultMarkerLayer({
  areaItem,
  underground = false,
  activeUnderground = false,
  ...props
}: MarkerLayerProps) {
  const { undergroundEnabled } = useSnapshot(state);
  if (undergroundEnabled && !underground) {
    props.hidden = true;
  }
  return (
    <MarkerLayer
      {...props}
      className="p-1"
      anchor={bottomCenterAnchor}
      zIndex={zIndex.marker}
    >
      <div
        className={classNames(
          "w-6 h-6 flex justify-center items-center rounded-full border border-white border-solid bg-gray-700",
          isSafari ? "drop-shadow" : "drop-shadow-sm"
        )}
      >
        <img
          className="w-11/12 h-11/12 object-contain"
          src={`icons/${areaItem.getIcon()}`}
        />
      </div>
      {underground && (
        <img
          className="absolute w-4 h-4 bottom-0 right-0"
          src={require("../../images/icon-underground.png")}
        />
      )}
      {activeUnderground && (
        <img
          className="absolute w-4 h-4 bottom-0 right-0"
          src={require("../../images/icon-underground-active.png")}
        />
      )}
    </MarkerLayer>
  );
}

function BorderlessMarkerLayer({
  areaItem,
  underground = false,
  activeUnderground = false,
  ...props
}: MarkerLayerProps) {
  return (
    <MarkerLayer
      {...props}
      anchor={bottomCenterAnchor}
      cacheKey={`${areaItem.getName()}_${underground}_${activeUnderground}`}
      zIndex={
        areaItem.getName() == "七天神像" ? zIndex.marker + 2 : zIndex.marker + 1
      }
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
        />
      </div>
      {underground && (
        <img
          className="absolute w-4 h-4 bottom-0 right-0"
          src={require("../../images/icon-underground.png")}
        />
      )}
      {activeUnderground && (
        <img
          className="absolute w-4 h-4 bottom-0 right-0"
          src={require("../../images/icon-underground-active.png")}
        />
      )}
    </MarkerLayer>
  );
}

function getMarkers(areaItem: AreaItem): AreaItemMarker[] {
  const markerMap = store.mapData.getMarkerMap();
  return areaItem
    .getMarkerList()
    .map((i) => markerMap.get(i))
    .map((i) => ({ x: i!.getX(), y: i!.getY(), marker: i!, areaItem }));
}
