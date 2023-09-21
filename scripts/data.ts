import { createWriteStream, existsSync, mkdirSync, writeFileSync } from "fs";
import { Readable } from "stream";
import { finished } from "stream/promises";
import { Area, AreaItem, MapData, MapInfo, Marker } from "../proto/data_pb";
import { api } from "./api";

async function main() {
  mkdirSync("dist/icons", { recursive: true });
  const mapData = new MapData();
  const mapInfoMap = mapData.getMapInfoMap();

  const teyvatMapInfo = new MapInfo();
  teyvatMapInfo.setId("twt40");
  teyvatMapInfo.setWidth(17408);
  teyvatMapInfo.setHeight(17408);
  teyvatMapInfo.setTileOffsetX(-5888);
  teyvatMapInfo.setTileOffsetY(-2048);
  teyvatMapInfo.setOriginX(3568 - teyvatMapInfo.getTileOffsetX());
  teyvatMapInfo.setOriginX(6286 - teyvatMapInfo.getTileOffsetY());
  mapInfoMap.set(teyvatMapInfo.getId(), teyvatMapInfo);

  const icons = await api.fetchIcons();
  for (const i of Object.values(icons)) {
    const target = `dist/icons/${i.id}`;
    if (existsSync(target)) {
      continue;
    }
    console.log(`fetch icon ${i.url}`);
    const response = await fetch(i.url, { headers: { accept: "image/webp" } });
    // @ts-ignore
    const stream = Readable.fromWeb(response.body!);
    await finished(stream.pipe(createWriteStream(target)));
  }
  let areaList = await api.fetch("area/get/list", {
    isTraverse: true,
    parentId: -1,
  });
  const areaMap = {} as Record<number, Area>;
  const itemMap = mapData.getItemMap();
  const markerMap = mapData.getMarkerMap();
  for (const item of areaList.filter((i: any) => i.hiddenFlag == 0)) {
    const area = new Area();
    area.setName(item.name);
    areaMap[item.id] = area;
    if (item.parentId == -1) {
      mapData.addArea(area);
    } else {
      const parent = areaMap[item.parentId];
      if (parent) {
        parent.addChildren(area);

        console.log(`fetch items ${item.id}`);
        const items = await api.fetchItems({ areaIdList: [item.id] });
        for (const item of items) {
          const areaItem = new AreaItem();
          const icon = icons[item.iconTag];
          if (icon) {
            areaItem.setIcon(icon.id);
          }
          areaItem.setName(item.name);
          areaItem.setTypeList(item.typeIdList);
          itemMap.set(item.id, areaItem);
          area.addItem(item.id);
        }

        console.log(`fetch markers ${item.id}`);
        const markers = await api.fetch("marker/get/list_byinfo", {
          itemIdList: items.map((i: any) => i.id),
        });
        for (const item of markers) {
          const marker = new Marker();
          const position = item.position
            .split(",")
            .map((i: string) => Math.round(parseFloat(i)));
          marker.setId(item.id);
          marker.setX(position[0]);
          marker.setY(position[1]);
          marker.setTitle(item.markerTitle);
          marker.setContent(item.content);
          marker.setItemList(item.itemList.map((i: any) => i.itemId));
          for (const i of item.itemList) {
            itemMap.get(i.itemId)?.addMarker(item.id);
          }
          markerMap.set(item.id, marker);
        }

        await new Promise((resolve) =>
          setTimeout(resolve, Math.random() * 2000)
        );
      }
    }
  }
  writeFileSync("dist/data.json", JSON.stringify(mapData.toObject()));
  writeFileSync("dist/data.bin", mapData.serializeBinary());
}

main();
