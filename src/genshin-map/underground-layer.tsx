import { canvaskit, Layer } from "@canvaskit-tilemap/core";
import { CustomLayer, DomLayer, ImageLayer } from "@canvaskit-tilemap/react";
import { Canvas } from "canvaskit-wasm";
import classNames from "classnames";
import { useMemo, useState } from "react";
import { useSnapshot } from "valtio";
import { zIndex } from ".";
import { state, UndergroundMapOverlay } from "./state";

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

  return (
    <>
      {chunks}
      {overlay.children.length > 1 && (
        <DomLayer
          x={x}
          y={y}
          className={classNames(
            "flex flex-col rounded-md overflow-hidden shadow-md duration-100 ease-out",
            zoom > -3 ? "opacity-100" : "opacity-0"
          )}
        >
          {overlay.children.map((i) => {
            return (
              <div
                className={classNames(
                  "w-36 box-border overflow-hidden px-2 py-1 text-xs whitespace-nowrap text-ellipsis text-center",
                  i == current ? "bg-blue-500 text-white" : "bg-white"
                )}
                onClick={() => {
                  setCurrent(i);
                }}
              >
                {i.label}
              </div>
            );
          })}
        </DomLayer>
      )}
    </>
  );
}

class MaskLayer extends Layer {
  _paint = new canvaskit.Paint();

  constructor() {
    super(zIndex.underground);
    this._paint.setColor(canvaskit.Color(0, 0, 0, 0.5));
  }

  draw(canvas: Canvas) {
    canvas.drawRect(this.tilemap.visibleRect, this._paint);
  }
}
