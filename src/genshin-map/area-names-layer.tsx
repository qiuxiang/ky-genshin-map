import { TextLayer } from "@canvaskit-map/react";
import { memo } from "react";
import { useSnapshot } from "valtio";
import { zIndex } from ".";
import { store } from "../store";
import { state } from "./state";

type AreaName = [string, number, number];

const areaNames: AreaName[] = [
  ["枫丹", -5539, -5395],
  ["须弥", -4781, 829],
  ["璃月", -875, -1094],
  ["蒙德", 1476, -3067],
  ["稻妻", 4746, 4685],
];

const areaNames2: AreaName[] = [
  ["枫丹动能工程科学研究院区", -4819, -6997],
  ["枫丹廷区", -5070, -5511],
  ["苍晶区", -6038, -4210],
  ["白露区", -5140, -4120],
  ["浮罗囿", -7078, -1800],
  ["荒石苍漠", -8130, -1423],
  ["千壑沙地", -6494, 135],
  ["列柱沙原", -6855, 2373],
  ["下风蚀地", -5286, 1540],
  ["上风蚀地", -5518, 3230],
  ["善见地", -3864, 896],
  ["二净甸", -3819, -229],
  ["道成林", -2959, 61],
  ["阿陀河谷", -2902, 1285],
  ["护世森", -2648, -1083],
  ["层岩巨渊", -1847, 132],
  ["珉林", -1484, -1428],
  ["璃沙郊", -851, 11],
  ["碧水原", -177, -2509],
  ["琼玑野", 441, -1543],
  ["云来海", 764, -208],
  ["名冠山脉", 958, -4360],
  ["坠星山谷", 2282, -4086],
  ["苍风高地", 1240, -3548],
  ["风啸山坡", 2315, -2897],
  ["龙脊雪山", 1511, -2487],
  ["鸣神岛", 5910, 2679],
  ["神无冢", 4670, 3574],
  ["八酝岛", 3119, 4303],
  ["海祇岛", 1634, 3919],
  ["清籁岛", 5791, 5325],
  ["鹤观", 4347, 7546],
];

export function AreaNamesLayer() {
  const { zoomLevel } = useSnapshot(state);
  const { activeSubArea, activeTopArea } = useSnapshot(store);

  // 只在提瓦特大陆显示地名
  if (activeSubArea && activeSubArea.getMapId() != activeTopArea.getMapId()) {
    return null;
  }

  return (
    <>
      <NamesLayer fontSize={30} areaNames={areaNames} hidden={zoomLevel > -4} />
      <NamesLayer
        fontSize={20}
        areaNames={areaNames2}
        hidden={zoomLevel != -3}
      />
    </>
  );
}

interface Props {
  hidden: boolean;
  areaNames: AreaName[];
  fontSize: number;
}

const NamesLayer = memo((props: Props) => {
  const style = {
    textStyle: {
      color: store.canvaskit.WHITE,
      fontSize: props.fontSize,
      shadows: [{ color: store.canvaskit.BLACK, blurRadius: 1 }],
    },
  };
  return (
    <>
      {props.areaNames.map(([name, x, y]) => (
        <TextLayer
          key={name}
          x={x}
          y={y}
          text={name}
          fontUrl={require("../../images/font.otf")}
          hidden={props.hidden}
          style={style}
          zIndex={zIndex.marker + 2}
        />
      ))}
    </>
  );
});
