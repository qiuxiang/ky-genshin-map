import classNames from "classnames";
import { ref, useSnapshot } from "valtio";
import { AreaItem, ItemType } from "../data_pb";
import { store } from "../store";
import { AreaItems } from "./area-items";
import { state } from "./state";
export { closeDrawer } from "./state";

export function AreaItemTypes() {
  const { mapData, areaItems } = useSnapshot(store);
  const itemTypes = mapData.getItemTypeList();
  return (
    <div
      className="rounded w-full h-full shadow relative overflow-y-auto"
      style={{ backgroundColor: "#f2f0eb" }}
    >
      {Object.values(itemTypes)
        .filter((type) => areaItems[type.getId()])
        .map((type) => (
          <AreaItemType key={type.getId()} itemType={type} />
        ))}
    </div>
  );
}

export function AreaItemType({ itemType }: { itemType: ItemType }) {
  const { areaItems } = useSnapshot(store);
  const { selected } = useSnapshot(state);
  const isSelected = selected.has(itemType);
  const items = areaItems[itemType.getId()];
  const height = 2.5 * Math.ceil(Object.keys(items).length / 2) + 0.5;
  return (
    <div
      className="m-2 p-2 bg-white rounded"
      onClick={() => {
        if (isSelected) {
          state.selected.delete(itemType);
        } else {
          state.selected.add(ref(itemType));
        }
      }}
    >
      <div className="flex items-center">
        <img src={`icons/${itemType.getIcon()}`} className="w-6 h-6 mr-2" />
        <div className="flex-1 text-gray-900">{itemType.getName()}</div>
        <div
          className={classNames(
            "text-sm duration-300 ease-out",
            !isSelected && "rotate-180"
          )}
          style={{ color: "#b6a9a3" }}
        >
          ▲
        </div>
      </div>
      <div
        className="overflow-hidden duration-300 ease-out"
        style={{ height: `${isSelected ? height : 0}rem` }}
      >
        <div className="h-3" onClick={() => {}} />
        <AreaItems
          items={items as Record<string, AreaItem[]>}
          isSelected={isSelected}
        />
      </div>
    </div>
  );
}
