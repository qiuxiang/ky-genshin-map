import { canvaskit, Layer } from "@canvaskit-tilemap/core";
import { CustomLayer, DomLayer, ImageLayer } from "@canvaskit-tilemap/react";
import { Canvas } from "canvaskit-wasm";
import classNames from "classnames";
import { useMemo, useRef, useState } from "react";
import { useSnapshot } from "valtio";
import { zIndex } from ".";
import { state, UndergroundMapOverlay } from "./state";
import { Transition } from "react-transition-group";

export function UndergroundLayer() {
  const { undergroundEnabled, undergroundMaps } = useSnapshot(state);
  if (!undergroundEnabled) {
    return null;
  }

  return (
    <>
      <CustomLayer createLayer={() => new MaskLayer()} />
      {undergroundMaps.map(({ overlays, urlTemplate }) => {
        return (
          <>
            {overlays.map((i) => {
              return (
                <UndergroundMap
                  overlay={i as UndergroundMapOverlay}
                  urlTemplate={urlTemplate}
                />
              );
            })}
          </>
        );
      })}
    </>
  );
}

interface UndergroundMapProps {
  overlay: UndergroundMapOverlay;
  urlTemplate: string;
}

function UndergroundMap({ overlay, urlTemplate }: UndergroundMapProps) {
  const { zoom } = useSnapshot(state);
  const [current, setCurrent] = useState(overlay.children[0]);
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
    if (!current.chunks) {
      return null;
    }
    return current.chunks.map((i) => {
      const image = new Image();
      image.src = i.url ?? urlTemplate.replace("{{chunkValue}}", i.value);
      image.crossOrigin = "";
      if (!i.bounds) {
        return null;
      }
      return (
        <ImageLayer
          key={current.label}
          zIndex={zIndex.underground}
          image={image}
          bounds={i.bounds.flat()}
        />
      );
    });
  }, [current]);

  const domLayerElement = useRef<HTMLDivElement>(null);
  return (
    <>
      {chunks}
      {overlay.children.length > 1 && (
        <Transition nodeRef={domLayerElement} in={zoom > -3} timeout={100}>
          {(state) => {
            console.log(state);
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
                        className={classNames(
                          "w-36 box-border overflow-hidden px-2 py-1 text-xs whitespace-nowrap text-ellipsis text-center font-semibold",
                          i == current
                            ? "bg-yellow-500/80 text-white"
                            : "bg-white/80"
                        )}
                        onClick={() => {
                          setCurrent(i);
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

class MaskLayer extends Layer {
  _paint = new canvaskit.Paint();

  constructor() {
    super(zIndex.underground);
    this._paint.setColor(canvaskit.Color(0, 0, 0, 0.7));
  }

  draw(canvas: Canvas) {
    canvas.drawRect(this.tilemap.visibleRect, this._paint);
  }
}
