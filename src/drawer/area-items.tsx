import classNames from "classnames";
import { useSnapshot } from "valtio";
import { AreaItem } from "../data_pb";
import { activateAreaItem, inactivateAreaItem, store } from "../store";
export { closeDrawer } from "./state";

export function AreaItems(props: {
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
                items.forEach(inactivateAreaItem);
              } else {
                items.forEach(activateAreaItem);
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
