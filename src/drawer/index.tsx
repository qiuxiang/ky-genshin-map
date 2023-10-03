import classNames from "classnames";
import { useSnapshot } from "valtio";
import { isApp } from "../store";
import { AreaItemTypes } from "./area-item-types";
import { state } from "./state";
import { ToggleButton } from "./toggle-button";
export { closeDrawer } from "./state";

export function Drawer() {
  const { visible } = useSnapshot(state);
  return (
    <div
      className={classNames(
        "flex flex-col w-72 absolute top-16 md:top-20 right-2 duration-300 ease-out",
        isApp
          ? "h-[calc(100%-4rem-24px)] md:h-[calc(100%-5rem-24px)] mt-[24px]"
          : "h-[calc(100%-4rem)] md:h-[calc(100%-5rem)]"
      )}
      style={{
        transform: `translate(${visible ? 0 : 276}px, 0)`,
      }}
    >
      <ToggleButton />
      <img
        className="w-full relative top-1"
        src={require("../../images/drawer-bg-top.png")}
      />
      <div
        className="flex-1"
        style={{
          background: `url(${require("../../images/drawer-bg-content.png")}) center / 100%`,
        }}
      />
      <img
        className="w-full relative -top-1"
        src={require("../../images/drawer-bg-bottom.png")}
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
