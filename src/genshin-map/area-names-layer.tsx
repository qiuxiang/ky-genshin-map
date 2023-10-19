import { TextLayer } from "@canvaskit-map/react";
import { useSnapshot } from "valtio";
import { zIndex } from ".";
import { store } from "../store";
import { state } from "./state";

const areaNames = [
  { name: "枫丹", x: -5539, y: -5395, children: [] },
  { name: "须弥", x: -4781, y: 829, children: [] },
  { name: "璃月", x: -875, y: -1094, children: [] },
  { name: "蒙德", x: 1476, y: -3067, children: [] },
  { name: "稻妻", x: 4746, y: 4685, children: [] },
];

export function AreaNamesLayer() {
  const { zoomLevel } = useSnapshot(state);
  const { activeSubArea, activeTopArea, canvaskit } = useSnapshot(store);

  // 只在提瓦特大陆显示地名
  if (activeSubArea && activeSubArea.getMapId() != activeTopArea.getMapId()) {
    return null;
  }

  const style = {
    textStyle: {
      color: canvaskit.WHITE,
      fontSize: 30,
      shadows: [{ color: canvaskit.BLACK, blurRadius: 2 }],
    },
  };
  const areaNames1 = areaNames;
  return (
    <>
      {areaNames1.map((i) => (
        <TextLayer
          key={i.name}
          x={i.x}
          y={i.y}
          text={i.name}
          fontUrl={require("../../images/font.otf")}
          hidden={zoomLevel > -4}
          style={style}
          zIndex={zIndex.underground + 2}
        />
      ))}
    </>
  );
}
