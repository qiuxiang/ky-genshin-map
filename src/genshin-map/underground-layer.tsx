import { DomLayer, ImageLayer } from "@canvaskit-tilemap/react";
import classNames from "classnames";
import { useMemo, useRef, useState } from "react";
import { Transition } from "react-transition-group";
import { useSnapshot } from "valtio";
import { zIndex } from ".";
import { MaskLayer } from "./mask-layer";
import { state, UndergroundMap, UndergroundMapOverlay } from "./state";

export function UndergroundLayer() {
  const { undergroundEnabled, undergroundMaps, activeMarker } =
    useSnapshot(state);

  // 手动开启的全局分层地图
  if (undergroundEnabled) {
    return (
      <>
        <MaskLayer />
        {undergroundMaps.flatMap(({ overlays, urlTemplate }) => {
          return overlays.map((i) => {
            return (
              <UndergroundMap
                key={i.label}
                overlay={i as UndergroundMapOverlay}
                urlTemplate={urlTemplate}
              />
            );
          });
        })}
      </>
    );
  }

  // 由当前选中点点位触发的分层地图
  const underground = activeMarker?.marker.getUnderground();
  if (underground) {
    let undergroundMap: UndergroundMap | null = null;
    let overlay: UndergroundMapOverlay | null = null;
    for (const map of undergroundMaps) {
      overlay = map.overlays.find((i) =>
        i.children.find((i) => i.value == underground)
      ) as UndergroundMapOverlay;
      if (overlay) {
        undergroundMap = map as UndergroundMap;
        break;
      }
    }
    if (overlay && undergroundMap) {
      return (
        <>
          <MaskLayer />
          <UndergroundMap
            overlay={overlay}
            urlTemplate={undergroundMap.urlTemplate}
          />
        </>
      );
    }
  }
  return null;
}

interface UndergroundMapProps {
  overlay: UndergroundMapOverlay;
  urlTemplate: string;
}

function UndergroundMap({ overlay, urlTemplate }: UndergroundMapProps) {
  if (overlay.label == "大枫丹湖" && overlay.children.length == 4) {
    overlay.children.shift();
  }
  const { zoom } = useSnapshot(state);
  const [current, setCurrent] = useState<UndergroundMapOverlay | null>(null);
  const [x, y] = useMemo(() => {
    let x = Number.MIN_SAFE_INTEGER;
    let y = Number.MIN_SAFE_INTEGER;
    for (const { chunks } of overlay.children) {
      for (const { bounds } of chunks ?? []) {
        if (bounds) {
          x = Math.max(x, bounds[1][0]);
          y = Math.max(y, bounds[1][1]);
        }
      }
    }
    return [x, y];
  }, []);

  const chunks = useMemo(() => {
    return overlay.children.flatMap((i) => {
      const { chunks, label } = i;
      if (!chunks) {
        return null;
      }
      return chunks.map(({ value, bounds, url }) => {
        const image = new Image();
        image.src = url ?? urlTemplate.replace("{{chunkValue}}", value);
        image.crossOrigin = "";
        if (!bounds) {
          return null;
        }
        return (
          <ImageLayer
            key={label}
            zIndex={zIndex.underground + (i == current ? 1 : 0)}
            image={image}
            bounds={bounds.flat()}
            opacity={current == null || i == current ? 1 : 0.3}
          />
        );
      });
    });
  }, [current]);

  const domLayerElement = useRef<HTMLDivElement>(null);
  return (
    <>
      {chunks}
      {overlay.children.length > 1 && (
        <Transition nodeRef={domLayerElement} in={zoom > -3} timeout={100}>
          {(state) => {
            return (
              <DomLayer x={x} y={y}>
                <div
                  ref={domLayerElement}
                  className={classNames(
                    "flex flex-col rounded-md overflow-hidden shadow-md duration-100 ease-out",
                    state == "entered" ? "opacity-100" : "opacity-0",
                    state == "exited" ? "hidden h-0" : "block"
                  )}
                >
                  {overlay.children.map((i) => {
                    return (
                      <div
                        key={i.label}
                        className={classNames(
                          "w-36 box-border overflow-hidden px-2 py-1 text-xs whitespace-nowrap text-ellipsis text-center font-semibold",
                          i == current
                            ? "bg-yellow-500/80 text-white"
                            : "bg-white/80"
                        )}
                        onClick={() => {
                          if (i == current) {
                            setCurrent(null);
                          } else {
                            setCurrent(i);
                          }
                        }}
                      >
                        {i.label}
                      </div>
                    );
                  })}
                </div>
              </DomLayer>
            );
          }}
        </Transition>
      )}
    </>
  );
}
