import classNames from "classnames";
import { proxy, ref, useSnapshot } from "valtio";
import { proxySet } from "valtio/utils";
import { AreaItem, ItemType } from "./data_pb";
import { activeAreaItem, removeAreaItem, store, toggleDrawer } from "./store";

const state = proxy({ selected: proxySet<ItemType>() });

export function Drawer() {
  const { drawerVisible } = useSnapshot(store);
  return (
    <div
      className="flex flex-col w-72 h-[calc(100%-4rem)] md:h-[calc(100%-5rem)] absolute top-16 md:top-20 right-2 duration-300 ease-out"
      style={{
        transform: `translate(${drawerVisible ? 0 : 276}px, 0)`,
      }}
    >
      <ToggleButton />
      <img
        className="w-full relative top-1"
        src={require("../images/drawer-bg-top.png")}
      />
      <div
        className="flex-1"
        style={{
          background: `url(${require("../images/drawer-bg-content.png")}) center / 100%`,
        }}
      />
      <img
        className="w-full relative -top-1"
        src={require("../images/drawer-bg-bottom.png")}
      />
      <div className="absolute w-full h-full pt-2.5 pl-5 pr-3 pb-11 box-border">
        <div
          className="rounded w-60 mx-auto h-2.5 shadow relative top-1"
          style={{ backgroundColor: "#b6a9a3" }}
        />
        <AreaItemTypes />
      </div>
    </div>
  );
}

function ToggleButton() {
  const { drawerVisible } = useSnapshot(store);
  return (
    <div
      className="absolute -z-10 top-2 -left-11 h-8 w-14 bg-contain bg-right bg-no-repeat"
      style={{
        backgroundImage: `url(${require("../images/drawer-button.png")})`,
      }}
      onClick={toggleDrawer}
    >
      <div
        className={classNames(
          "h-5 w-5 mt-1.5 ml-6 bg-cover duration-300 ease-out",
          !drawerVisible && "rotate-180"
        )}
        style={{
          backgroundImage: `url(${require("../images/drawer-arrow.png")})`,
        }}
      />
    </div>
  );
}

function AreaItemTypes() {
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
          <TypeItem key={type.getId()} itemType={type} />
        ))}
    </div>
  );
}

function TypeItem({ itemType }: { itemType: ItemType }) {
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

function AreaItems(props: {
  items: Record<string, AreaItem[]>;
  isSelected: boolean;
}) {
  const { activeAreaItems } = useSnapshot(store);
  return (
    <div className="grid grid-cols-2 gap-1">
      {Object.values(props.items).map((items) => {
        const active = !items.some((i) => !activeAreaItems.has(i));
        return (
          <div
            className="text-xs"
            key={items[0].getId()}
            style={{ background: active ? "#424b63" : "#f6f6f6" }}
            onClick={(event) => {
              event.stopPropagation();
              if (active) {
                items.forEach(removeAreaItem);
              } else {
                items.forEach(activeAreaItem);
              }
            }}
          >
            <div className="flex">
              <div className="w-9 h-9 bg-black/10 p-1 box-border mr-1">
                {props.isSelected && (
                  <img
                    className="w-7 h-7 object-contain"
                    src={`icons/${items[0].getIcon()}`}
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col justify-center overflow-hidden">
                <div
                  className={classNames(
                    "whitespace-nowrap text-ellipsis overflow-hidden",
                    active && "text-gray-200"
                  )}
                >
                  {items[0].getName()}
                </div>
                <div className="text-gray-500">
                  {items.reduce((value, i) => value + i.getCount(), 0)}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
