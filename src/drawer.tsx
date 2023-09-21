import classNames from "classnames";
import { proxy, ref, useSnapshot } from "valtio";
import { proxySet } from "valtio/utils";
import arrowImage from "../images/drawer-arrow.png";
import bottomBackgroundImage from "../images/drawer-bg-bottom.png";
import contentBackgroundImage from "../images/drawer-bg-content.png";
import topBackgroundImage from "../images/drawer-bg-top.png";
import buttonImage from "../images/drawer-button.png";
import { AreaItem, ItemType } from "./data_pb";
import { store, toggleAreaItem, toggleDrawer } from "./store";

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
      <img className="w-full relative top-1" src={topBackgroundImage} />
      <div
        className="flex-1"
        style={{ background: `url(${contentBackgroundImage}) center / 100%` }}
      />
      <img className="w-full relative -top-1" src={bottomBackgroundImage} />
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
      style={{ backgroundImage: `url(${buttonImage})` }}
      onClick={toggleDrawer}
    >
      <div
        className={classNames(
          "h-5 w-5 mt-1.5 ml-6 bg-cover duration-300 ease-out",
          !drawerVisible && "rotate-180"
        )}
        style={{ backgroundImage: `url(${arrowImage})` }}
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
        .filter((type) => areaItems[type.getId()]?.length > 0)
        .map((type) => (
          <TypeItem itemType={type} />
        ))}
    </div>
  );
}

function TypeItem({ itemType }: { itemType: ItemType }) {
  const { areaItems } = useSnapshot(store);
  const { selected } = useSnapshot(state);
  const isSelected = selected.has(itemType);
  const items = areaItems[itemType.getId()];
  const height = 2.5 * Math.ceil(items.length / 2) + 0.5;
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
        <AreaItems items={items as AreaItem[]} isSelected={isSelected} />
      </div>
    </div>
  );
}

function AreaItems(props: { items: AreaItem[]; isSelected: boolean }) {
  const { activeAreaItems } = useSnapshot(store);
  return (
    <div className="grid grid-cols-2 gap-1">
      {props.items.map((i) => {
        const active = activeAreaItems.has(i);
        return (
          <div
            className="text-xs"
            style={{ background: active ? "#424b63" : "#f6f6f6" }}
            onClick={(event) => {
              event.stopPropagation();
              toggleAreaItem(i);
            }}
          >
            <div className="flex">
              <div className="w-9 h-9 bg-black/10 p-1 box-border mr-1">
                {props.isSelected && (
                  <img
                    className="w-7 h-7 object-contain"
                    src={`icons/${i.getIcon()}`}
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
                  {i.getName()}
                </div>
                <div className="text-gray-500">{i.getCount()}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
