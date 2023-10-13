import { DomLayer, ImageLayer } from "@canvaskit-tilemap/react";
import classNames from "classnames";
import { useMemo, useRef, useState } from "react";
import { useSnapshot } from "valtio";
import { zIndex } from ".";
import { UndergroundMap } from "../data_pb";
import { store } from "../store";
import { MaskLayer } from "./mask-layer";
import { state } from "./state";

export function UndergroundLayer() {
  const { undergroundEnabled, activeUndergroundMap } = useSnapshot(state);
  const { mapData } = useSnapshot(store);

  // 手动开启的全局分层地图
  if (undergroundEnabled) {
    return (
      <>
        <MaskLayer />
        {mapData.getUndergroundMapList().map((i) => {
          return <UndergroundMapItem key={i.getId()} undergroundMap={i} />;
        })}
      </>
    );
  }

  // 由当前选中点点位触发的分层地图
  if (activeUndergroundMap) {
    let undergroundMap = mapData
      .getUndergroundMapList()
      .find((i) => i.getChildList().find((i) => i == activeUndergroundMap));
    if (undergroundMap) {
      return (
        <>
          <MaskLayer />
          <UndergroundMapItem
            key={activeUndergroundMap.getId()}
            undergroundMap={undergroundMap}
            current={activeUndergroundMap}
          />
        </>
      );
    }
  }
  return null;
}

interface UndergroundMapProps {
  undergroundMap: UndergroundMap;
  current?: UndergroundMap;
}

function UndergroundMapItem(props: UndergroundMapProps) {
  const { undergroundMap } = props;
  const { zoomLevel, activeUndergroundMap } = useSnapshot(state);
  const [current, setCurrent] = useState<UndergroundMap | undefined>(
    props.current
  );
  const [x, y] = useMemo(() => {
    let x = Number.MIN_SAFE_INTEGER;
    let y = Number.MIN_SAFE_INTEGER;
    for (const child of undergroundMap.getChildList()) {
      for (const chunk of child.getChunkList()) {
        const bounds = chunk.getBoundList();
        x = Math.max(x, bounds[2]);
        y = Math.max(y, bounds[3]);
      }
    }
    return [x, y];
  }, []);

  const chunks = useMemo(() => {
    return undergroundMap.getChildList().map((i) => {
      return i.getChunkList().map((chunk, index) => {
        const image = new Image();
        image.src = `underground/${i.getId()}_${index}.webp`;
        return (
          <ImageLayer
            key={image.src}
            zIndex={zIndex.underground + (i == current ? 1 : 0)}
            image={image}
            bounds={chunk.getBoundList()}
            opacity={current == null || i == current ? 1 : 0.3}
          />
        );
      });
    });
  }, [current]);

  const labels = useMemo(() => {
    return undergroundMap.getChildList().map((i) => {
      return (
        <div
          key={i.getId()}
          className={classNames(
            "w-36 box-border overflow-hidden px-2 py-1 text-xs whitespace-nowrap text-ellipsis text-center font-semibold",
            i == current ? "bg-yellow-500/80 text-white" : "bg-white/80"
          )}
          onClick={() => {
            if (i == current) {
              setCurrent(undefined);
            } else {
              setCurrent(i);
            }
          }}
        >
          {i.getName()}
        </div>
      );
    });
  }, [current]);

  const domLayerElement = useRef<HTMLDivElement>(null);
  const hidden = zoomLevel < -2 && activeUndergroundMap == null;
  return (
    <>
      {chunks}
      {undergroundMap.getChildList().length > 1 && (
        <DomLayer x={x} y={y} hidden={hidden}>
          <div
            ref={domLayerElement}
            className={classNames(
              "flex flex-col rounded-md overflow-hidden shadow-md duration-100 ease-out"
            )}
          >
            {labels}
          </div>
        </DomLayer>
      )}
    </>
  );
}
