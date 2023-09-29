import { DomLayer, MarkerLayer } from "@canvaskit-tilemap/react";
import classNames from "classnames";
import { useSnapshot } from "valtio";
import { bottomCenterAnchor } from "./area-item-layer";
import { AreaItemMarker, mark, state, unmark } from "./state";

export function ActiveMarkerLayer() {
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
        <>
          <MarkerLayer
            items={[activeMarker]}
            anchor={bottomCenterAnchor}
            zIndex={20}
            cacheKey="activeMarker"
          >
            {image}
          </MarkerLayer>
          <MarkerInfo {...activeMarker} />
        </>
      )}
    </>
  );
}

function MarkerInfo({ marker, x, y }: AreaItemMarker) {
  const { marked } = useSnapshot(state);
  let markButton = null;
  // if (!areaItem.specialFlag && areaItem.defaultRefreshTime == 0) {
  const buttonClass = "flex-1 rounded-full text-center border border-solid";
  markButton = (
    <div className="h-5 p-0.5 mt-1 rounded-full border border-yellow-900/50 border-solid flex">
      <div
        className={classNames(
          buttonClass,
          marked.has(marker.getId())
            ? "border-transparent"
            : "bg-yellow-900/40 border-yellow-900/60 text-white"
        )}
        onClick={() => unmark(marker)}
      >
        未完成
      </div>
      <div
        className={classNames(
          buttonClass,
          marked.has(marker.getId())
            ? "bg-cyan-600/90 border-cyan-900/80 text-white"
            : "border-transparent"
        )}
        onClick={() => mark(marker)}
      >
        已完成
      </div>
    </div>
  );
  // }
  return (
    <DomLayer
      x={x}
      y={y}
      className="relative -top-full -left-1/2 w-64 text-sm pb-10"
    >
      <div className="bg-orange-50 shadow-lg rounded-lg flex flex-col gap-2 p-3 marker relative">
        <div className="text-gray-900">{marker.getTitle()}</div>
        <div className="text-gray-500 text-xs">{marker.getContent()}</div>
        {marker.getPicture() && (
          <img className="w-full rounded" src={marker.getPicture()} />
        )}
        {markButton}
      </div>
    </DomLayer>
  );
}
